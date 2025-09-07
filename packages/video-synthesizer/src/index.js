"use strict";
/**
 * Video Synthesizer
 * FFmpeg를 사용한 비디오 합성 모듈
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoSynthesizer = void 0;
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const sharp_1 = __importDefault(require("sharp"));
const tmp_1 = __importDefault(require("tmp"));
const winston_1 = __importDefault(require("winston"));
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const events_1 = require("events");
class VideoSynthesizer extends events_1.EventEmitter {
    logger;
    defaultConfig = {
        width: 1920,
        height: 1080,
        fps: 30,
        videoBitrate: '5000k',
        audioBitrate: '192k',
        format: 'mp4',
        codec: 'h264',
        preset: 'medium'
    };
    tempDir = null;
    constructor() {
        super();
        // Logger 설정
        this.logger = winston_1.default.createLogger({
            level: 'info',
            format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.json()),
            transports: [
                new winston_1.default.transports.Console(),
                new winston_1.default.transports.File({ filename: 'video-synthesizer.log' })
            ]
        });
    }
    /**
     * 이미지 시퀀스로부터 비디오 생성
     */
    async synthesizeFromImages(options) {
        const config = { ...this.defaultConfig, ...options.videoConfig };
        try {
            // 임시 디렉토리 생성
            this.tempDir = await this.createTempDir();
            // 이미지 전처리
            const processedImages = await this.preprocessImages(options.images, config);
            // 이미지 시퀀스 생성
            const sequencePath = await this.createImageSequence(processedImages, options.durations, config.fps);
            // 비디오 생성
            const videoPath = await this.generateVideo(sequencePath, options, config);
            // 썸네일 생성
            const thumbnailPath = await this.generateThumbnail(videoPath);
            // 메타데이터 추출
            const metadata = await this.extractMetadata(videoPath);
            // 파일 크기 확인
            const stats = await promises_1.default.stat(videoPath);
            const result = {
                videoPath,
                thumbnailPath,
                duration: metadata.duration,
                fileSize: stats.size,
                width: config.width,
                height: config.height,
                format: config.format,
                codec: config.codec,
                metadata
            };
            this.logger.info('Video synthesis completed', {
                videoPath,
                duration: metadata.duration,
                fileSize: stats.size
            });
            // 임시 파일 정리
            await this.cleanup();
            return result;
        }
        catch (error) {
            this.logger.error('Video synthesis failed', { error });
            await this.cleanup();
            throw error;
        }
    }
    /**
     * 이미지 전처리 (크기 조정, 포맷 변환)
     */
    async preprocessImages(images, config) {
        const processedImages = [];
        for (let i = 0; i < images.length; i++) {
            const imagePath = images[i];
            const outputPath = path_1.default.join(this.tempDir, `processed_${i}.png`);
            await (0, sharp_1.default)(imagePath)
                .resize(config.width, config.height, {
                fit: 'contain',
                background: { r: 0, g: 0, b: 0, alpha: 1 }
            })
                .png()
                .toFile(outputPath);
            processedImages.push(outputPath);
            this.emit('progress', {
                stage: 'preprocessing',
                current: i + 1,
                total: images.length
            });
        }
        return processedImages;
    }
    /**
     * 이미지 시퀀스 생성
     */
    async createImageSequence(images, durations, fps) {
        const sequenceDir = path_1.default.join(this.tempDir, 'sequence');
        await promises_1.default.mkdir(sequenceDir, { recursive: true });
        let frameNumber = 0;
        for (let i = 0; i < images.length; i++) {
            const imagePath = images[i];
            const duration = durations[i] || 3; // 기본 3초
            const frameCount = Math.floor(duration * fps);
            // 각 이미지를 필요한 프레임 수만큼 복사
            for (let j = 0; j < frameCount; j++) {
                const framePath = path_1.default.join(sequenceDir, `frame_${frameNumber.toString().padStart(6, '0')}.png`);
                await promises_1.default.copyFile(imagePath, framePath);
                frameNumber++;
            }
            this.emit('progress', {
                stage: 'sequence',
                current: i + 1,
                total: images.length
            });
        }
        return sequenceDir;
    }
    /**
     * FFmpeg를 사용한 비디오 생성
     */
    async generateVideo(sequencePath, options, config) {
        return new Promise((resolve, reject) => {
            const inputPattern = path_1.default.join(sequencePath, 'frame_%06d.png');
            const outputPath = options.outputPath;
            let command = (0, fluent_ffmpeg_1.default)()
                .input(inputPattern)
                .inputOptions([
                `-framerate ${config.fps}`,
                '-pix_fmt yuv420p'
            ])
                .videoCodec(this.getCodec(config.codec))
                .videoBitrate(config.videoBitrate)
                .size(`${config.width}x${config.height}`)
                .outputOptions([
                `-preset ${config.preset}`,
                '-movflags +faststart'
            ]);
            // 자막 추가
            if (options.subtitlesPath) {
                command = command
                    .input(options.subtitlesPath)
                    .outputOptions([`-vf subtitles=${options.subtitlesPath}`]);
            }
            // 오디오 추가
            if (options.audioPath) {
                command = command
                    .input(options.audioPath)
                    .audioCodec('aac')
                    .audioBitrate(config.audioBitrate || '192k');
            }
            else if (options.backgroundMusic) {
                command = command
                    .input(options.backgroundMusic)
                    .audioCodec('aac')
                    .audioBitrate(config.audioBitrate || '128k')
                    .outputOptions(['-shortest']);
            }
            else {
                // 무음 오디오 트랙 추가 (일부 플레이어 호환성)
                command = command
                    .input('anullsrc=r=44100:cl=stereo')
                    .inputOptions(['-f lavfi'])
                    .audioCodec('aac')
                    .audioBitrate('64k')
                    .outputOptions(['-shortest']);
            }
            // 진행 상태 리스너
            command.on('progress', (progress) => {
                this.emit('progress', {
                    stage: 'encoding',
                    percent: progress.percent || 0,
                    timemark: progress.timemark
                });
            });
            command.on('error', (err) => {
                this.logger.error('FFmpeg error', { error: err });
                reject(err);
            });
            command.on('end', () => {
                this.logger.info('Video encoding completed');
                resolve(outputPath);
            });
            // 실행
            command.save(outputPath);
        });
    }
    /**
     * 트랜지션 효과 적용
     */
    async applyTransitions(videoPath, transitions, outputPath) {
        return new Promise((resolve, reject) => {
            let filterComplex = '';
            // 트랜지션 필터 생성
            transitions.forEach((transition, index) => {
                switch (transition) {
                    case 'fade':
                        filterComplex += `[${index}:v]fade=t=in:st=0:d=0.5[v${index}];`;
                        break;
                    case 'dissolve':
                        filterComplex += `[${index}:v]format=yuva420p,fade=t=in:st=0:d=1:alpha=1[v${index}];`;
                        break;
                    // 다른 트랜지션 효과들...
                }
            });
            const command = (0, fluent_ffmpeg_1.default)()
                .input(videoPath)
                .complexFilter(filterComplex)
                .outputOptions(['-map [vout]', '-map 0:a?'])
                .on('error', reject)
                .on('end', () => resolve(outputPath))
                .save(outputPath);
        });
    }
    /**
     * 썸네일 생성
     */
    async generateThumbnail(videoPath) {
        return new Promise((resolve, reject) => {
            const thumbnailPath = videoPath.replace(/\.[^.]+$/, '_thumb.jpg');
            (0, fluent_ffmpeg_1.default)(videoPath)
                .screenshots({
                timestamps: ['10%'],
                filename: path_1.default.basename(thumbnailPath),
                folder: path_1.default.dirname(thumbnailPath),
                size: '640x360'
            })
                .on('error', reject)
                .on('end', () => resolve(thumbnailPath));
        });
    }
    /**
     * 비디오 메타데이터 추출
     */
    async extractMetadata(videoPath) {
        return new Promise((resolve, reject) => {
            fluent_ffmpeg_1.default.ffprobe(videoPath, (err, metadata) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve({
                        duration: metadata.format.duration,
                        bitrate: metadata.format.bit_rate,
                        size: metadata.format.size,
                        streams: metadata.streams.map(stream => ({
                            type: stream.codec_type,
                            codec: stream.codec_name,
                            width: stream.width,
                            height: stream.height,
                            fps: stream.r_frame_rate,
                            bitrate: stream.bit_rate
                        }))
                    });
                }
            });
        });
    }
    /**
     * 비디오 병합
     */
    async concatenateVideos(videoPaths, outputPath) {
        return new Promise((resolve, reject) => {
            const listFile = path_1.default.join(this.tempDir, 'concat_list.txt');
            const listContent = videoPaths
                .map(videoPath => `file '${videoPath}'`)
                .join('\n');
            promises_1.default.writeFile(listFile, listContent)
                .then(() => {
                (0, fluent_ffmpeg_1.default)()
                    .input(listFile)
                    .inputOptions(['-f concat', '-safe 0'])
                    .outputOptions(['-c copy'])
                    .on('error', reject)
                    .on('end', () => resolve(outputPath))
                    .save(outputPath);
            })
                .catch(reject);
        });
    }
    /**
     * 워터마크 추가
     */
    async addWatermark(videoPath, watermarkPath, position, outputPath) {
        return new Promise((resolve, reject) => {
            const positions = {
                topleft: '10:10',
                topright: 'W-w-10:10',
                bottomleft: '10:H-h-10',
                bottomright: 'W-w-10:H-h-10',
                center: '(W-w)/2:(H-h)/2'
            };
            (0, fluent_ffmpeg_1.default)()
                .input(videoPath)
                .input(watermarkPath)
                .complexFilter([
                `[1:v]scale=200:-1[wm];[0:v][wm]overlay=${positions[position]}`
            ])
                .on('error', reject)
                .on('end', () => resolve(outputPath))
                .save(outputPath);
        });
    }
    /**
     * 비디오 형식 변환
     */
    async convertFormat(inputPath, outputFormat, outputPath) {
        return new Promise((resolve, reject) => {
            const codecs = {
                mp4: { video: 'libx264', audio: 'aac' },
                webm: { video: 'libvpx-vp9', audio: 'libopus' },
                avi: { video: 'mpeg4', audio: 'mp3' },
                mov: { video: 'libx264', audio: 'aac' }
            };
            const codec = codecs[outputFormat];
            (0, fluent_ffmpeg_1.default)()
                .input(inputPath)
                .videoCodec(codec.video)
                .audioCodec(codec.audio)
                .on('error', reject)
                .on('end', () => resolve(outputPath))
                .save(outputPath);
        });
    }
    /**
     * 비디오 압축
     */
    async compressVideo(inputPath, quality, outputPath) {
        return new Promise((resolve, reject) => {
            const presets = {
                low: { crf: 35, preset: 'veryfast', bitrate: '1000k' },
                medium: { crf: 28, preset: 'medium', bitrate: '2500k' },
                high: { crf: 23, preset: 'slow', bitrate: '5000k' }
            };
            const settings = presets[quality];
            (0, fluent_ffmpeg_1.default)()
                .input(inputPath)
                .videoCodec('libx264')
                .outputOptions([
                `-crf ${settings.crf}`,
                `-preset ${settings.preset}`,
                `-b:v ${settings.bitrate}`
            ])
                .on('error', reject)
                .on('end', () => resolve(outputPath))
                .save(outputPath);
        });
    }
    /**
     * 코덱 매핑
     */
    getCodec(codec) {
        const codecMap = {
            h264: 'libx264',
            h265: 'libx265',
            vp9: 'libvpx-vp9'
        };
        return codecMap[codec] || 'libx264';
    }
    /**
     * 임시 디렉토리 생성
     */
    async createTempDir() {
        return new Promise((resolve, reject) => {
            tmp_1.default.dir({ unsafeCleanup: true }, (err, path) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(path);
                }
            });
        });
    }
    /**
     * 임시 파일 정리
     */
    async cleanup() {
        if (this.tempDir) {
            try {
                await promises_1.default.rm(this.tempDir, { recursive: true, force: true });
                this.tempDir = null;
            }
            catch (error) {
                this.logger.warn('Failed to cleanup temp files', { error });
            }
        }
    }
    /**
     * FFmpeg 설치 확인
     */
    static async checkFFmpeg() {
        return new Promise((resolve) => {
            fluent_ffmpeg_1.default.getAvailableFormats((err) => {
                resolve(!err);
            });
        });
    }
    /**
     * 지원 포맷 목록
     */
    static async getSupportedFormats() {
        return new Promise((resolve, reject) => {
            fluent_ffmpeg_1.default.getAvailableFormats((err, formats) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(Object.keys(formats));
                }
            });
        });
    }
    /**
     * 지원 코덱 목록
     */
    static async getSupportedCodecs() {
        return new Promise((resolve, reject) => {
            fluent_ffmpeg_1.default.getAvailableCodecs((err, codecs) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(Object.keys(codecs));
                }
            });
        });
    }
}
exports.VideoSynthesizer = VideoSynthesizer;
exports.default = VideoSynthesizer;
