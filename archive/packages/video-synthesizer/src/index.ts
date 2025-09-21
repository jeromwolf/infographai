/**
 * Video Synthesizer
 * FFmpeg를 사용한 비디오 합성 모듈
 */

import ffmpeg from 'fluent-ffmpeg';
import sharp from 'sharp';
import tmp from 'tmp';
import winston from 'winston';
import path from 'path';
import fs from 'fs/promises';
import { EventEmitter } from 'events';

// 비디오 설정
export interface VideoConfig {
  width: number;
  height: number;
  fps: number;
  videoBitrate: string;
  audioBitrate?: string;
  format: 'mp4' | 'webm' | 'avi';
  codec: 'h264' | 'h265' | 'vp9';
  preset?: 'ultrafast' | 'superfast' | 'veryfast' | 'faster' | 'fast' | 'medium' | 'slow' | 'slower' | 'veryslow';
}

// 합성 옵션
export interface SynthesisOptions {
  images: string[];
  durations: number[]; // 각 이미지 표시 시간 (초)
  transitions?: TransitionType[];
  subtitlesPath?: string;
  audioPath?: string;
  backgroundMusic?: string;
  outputPath: string;
  videoConfig?: Partial<VideoConfig>;
}

// 트랜지션 타입
export type TransitionType = 'fade' | 'slide' | 'dissolve' | 'wipe' | 'zoom' | 'none';

// 합성 결과
export interface SynthesisResult {
  videoPath: string;
  thumbnailPath: string;
  duration: number;
  fileSize: number;
  width: number;
  height: number;
  format: string;
  codec: string;
  metadata: Record<string, any>;
}

export class VideoSynthesizer extends EventEmitter {
  private logger: winston.Logger;
  private defaultConfig: VideoConfig = {
    width: 1920,
    height: 1080,
    fps: 30,
    videoBitrate: '5000k',
    audioBitrate: '192k',
    format: 'mp4',
    codec: 'h264',
    preset: 'medium'
  };
  private tempDir: string | null = null;

  constructor() {
    super();

    // Logger 설정
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'video-synthesizer.log' })
      ]
    });
  }

  /**
   * 이미지 시퀀스로부터 비디오 생성
   */
  public async synthesizeFromImages(
    options: SynthesisOptions
  ): Promise<SynthesisResult> {
    const config = { ...this.defaultConfig, ...options.videoConfig };

    try {
      // 임시 디렉토리 생성
      this.tempDir = await this.createTempDir();

      // 이미지 전처리
      const processedImages = await this.preprocessImages(
        options.images,
        config
      );

      // 이미지 시퀀스 생성
      const sequencePath = await this.createImageSequence(
        processedImages,
        options.durations,
        config.fps
      );

      // 비디오 생성
      const videoPath = await this.generateVideo(
        sequencePath,
        options,
        config
      );

      // 썸네일 생성
      const thumbnailPath = await this.generateThumbnail(videoPath);

      // 메타데이터 추출
      const metadata = await this.extractMetadata(videoPath);

      // 파일 크기 확인
      const stats = await fs.stat(videoPath);

      const result: SynthesisResult = {
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
    } catch (error) {
      this.logger.error('Video synthesis failed', { error });
      await this.cleanup();
      throw error;
    }
  }

  /**
   * 이미지 전처리 (크기 조정, 포맷 변환)
   */
  private async preprocessImages(
    images: string[],
    config: VideoConfig
  ): Promise<string[]> {
    const processedImages: string[] = [];

    for (let i = 0; i < images.length; i++) {
      const imagePath = images[i];
      const outputPath = path.join(this.tempDir!, `processed_${i}.png`);

      await sharp(imagePath)
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
  private async createImageSequence(
    images: string[],
    durations: number[],
    fps: number
  ): Promise<string> {
    const sequenceDir = path.join(this.tempDir!, 'sequence');
    await fs.mkdir(sequenceDir, { recursive: true });

    let frameNumber = 0;

    for (let i = 0; i < images.length; i++) {
      const imagePath = images[i];
      const duration = durations[i] || 3; // 기본 3초
      const frameCount = Math.floor(duration * fps);

      // 각 이미지를 필요한 프레임 수만큼 복사
      for (let j = 0; j < frameCount; j++) {
        const framePath = path.join(
          sequenceDir,
          `frame_${frameNumber.toString().padStart(6, '0')}.png`
        );
        
        await fs.copyFile(imagePath, framePath);
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
  private async generateVideo(
    sequencePath: string,
    options: SynthesisOptions,
    config: VideoConfig
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const inputPattern = path.join(sequencePath, 'frame_%06d.png');
      const outputPath = options.outputPath;

      let command = ffmpeg()
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
      } else if (options.backgroundMusic) {
        command = command
          .input(options.backgroundMusic)
          .audioCodec('aac')
          .audioBitrate(config.audioBitrate || '128k')
          .outputOptions(['-shortest']);
      } else {
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
  public async applyTransitions(
    videoPath: string,
    transitions: TransitionType[],
    outputPath: string
  ): Promise<string> {
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

      const command = ffmpeg()
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
  private async generateThumbnail(videoPath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const thumbnailPath = videoPath.replace(/\.[^.]+$/, '_thumb.jpg');

      ffmpeg(videoPath)
        .screenshots({
          timestamps: ['10%'],
          filename: path.basename(thumbnailPath),
          folder: path.dirname(thumbnailPath),
          size: '640x360'
        })
        .on('error', reject)
        .on('end', () => resolve(thumbnailPath));
    });
  }

  /**
   * 비디오 메타데이터 추출
   */
  private async extractMetadata(videoPath: string): Promise<any> {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(videoPath, (err, metadata) => {
        if (err) {
          reject(err);
        } else {
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
  public async concatenateVideos(
    videoPaths: string[],
    outputPath: string
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const listFile = path.join(this.tempDir!, 'concat_list.txt');
      const listContent = videoPaths
        .map(videoPath => `file '${videoPath}'`)
        .join('\n');

      fs.writeFile(listFile, listContent)
        .then(() => {
          ffmpeg()
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
  public async addWatermark(
    videoPath: string,
    watermarkPath: string,
    position: 'topleft' | 'topright' | 'bottomleft' | 'bottomright' | 'center',
    outputPath: string
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const positions = {
        topleft: '10:10',
        topright: 'W-w-10:10',
        bottomleft: '10:H-h-10',
        bottomright: 'W-w-10:H-h-10',
        center: '(W-w)/2:(H-h)/2'
      };

      ffmpeg()
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
  public async convertFormat(
    inputPath: string,
    outputFormat: 'mp4' | 'webm' | 'avi' | 'mov',
    outputPath: string
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const codecs = {
        mp4: { video: 'libx264', audio: 'aac' },
        webm: { video: 'libvpx-vp9', audio: 'libopus' },
        avi: { video: 'mpeg4', audio: 'mp3' },
        mov: { video: 'libx264', audio: 'aac' }
      };

      const codec = codecs[outputFormat];

      ffmpeg()
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
  public async compressVideo(
    inputPath: string,
    quality: 'low' | 'medium' | 'high',
    outputPath: string
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const presets = {
        low: { crf: 35, preset: 'veryfast', bitrate: '1000k' },
        medium: { crf: 28, preset: 'medium', bitrate: '2500k' },
        high: { crf: 23, preset: 'slow', bitrate: '5000k' }
      };

      const settings = presets[quality];

      ffmpeg()
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
  private getCodec(codec: string): string {
    const codecMap: Record<string, string> = {
      h264: 'libx264',
      h265: 'libx265',
      vp9: 'libvpx-vp9'
    };
    return codecMap[codec] || 'libx264';
  }

  /**
   * 임시 디렉토리 생성
   */
  private async createTempDir(): Promise<string> {
    return new Promise((resolve, reject) => {
      tmp.dir({ unsafeCleanup: true }, (err, path) => {
        if (err) {
          reject(err);
        } else {
          resolve(path);
        }
      });
    });
  }

  /**
   * 임시 파일 정리
   */
  private async cleanup() {
    if (this.tempDir) {
      try {
        await fs.rm(this.tempDir, { recursive: true, force: true });
        this.tempDir = null;
      } catch (error) {
        this.logger.warn('Failed to cleanup temp files', { error });
      }
    }
  }

  /**
   * FFmpeg 설치 확인
   */
  public static async checkFFmpeg(): Promise<boolean> {
    return new Promise((resolve) => {
      ffmpeg.getAvailableFormats((err) => {
        resolve(!err);
      });
    });
  }

  /**
   * 지원 포맷 목록
   */
  public static async getSupportedFormats(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      ffmpeg.getAvailableFormats((err, formats) => {
        if (err) {
          reject(err);
        } else {
          resolve(Object.keys(formats));
        }
      });
    });
  }

  /**
   * 지원 코덱 목록
   */
  public static async getSupportedCodecs(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      ffmpeg.getAvailableCodecs((err, codecs) => {
        if (err) {
          reject(err);
        } else {
          resolve(Object.keys(codecs));
        }
      });
    });
  }
}

export default VideoSynthesizer;