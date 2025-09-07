/**
 * Video Synthesizer
 * FFmpeg를 사용한 비디오 합성 모듈
 */
import { EventEmitter } from 'events';
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
export interface SynthesisOptions {
    images: string[];
    durations: number[];
    transitions?: TransitionType[];
    subtitlesPath?: string;
    audioPath?: string;
    backgroundMusic?: string;
    outputPath: string;
    videoConfig?: Partial<VideoConfig>;
}
export type TransitionType = 'fade' | 'slide' | 'dissolve' | 'wipe' | 'zoom' | 'none';
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
export declare class VideoSynthesizer extends EventEmitter {
    private logger;
    private defaultConfig;
    private tempDir;
    constructor();
    /**
     * 이미지 시퀀스로부터 비디오 생성
     */
    synthesizeFromImages(options: SynthesisOptions): Promise<SynthesisResult>;
    /**
     * 이미지 전처리 (크기 조정, 포맷 변환)
     */
    private preprocessImages;
    /**
     * 이미지 시퀀스 생성
     */
    private createImageSequence;
    /**
     * FFmpeg를 사용한 비디오 생성
     */
    private generateVideo;
    /**
     * 트랜지션 효과 적용
     */
    applyTransitions(videoPath: string, transitions: TransitionType[], outputPath: string): Promise<string>;
    /**
     * 썸네일 생성
     */
    private generateThumbnail;
    /**
     * 비디오 메타데이터 추출
     */
    private extractMetadata;
    /**
     * 비디오 병합
     */
    concatenateVideos(videoPaths: string[], outputPath: string): Promise<string>;
    /**
     * 워터마크 추가
     */
    addWatermark(videoPath: string, watermarkPath: string, position: 'topleft' | 'topright' | 'bottomleft' | 'bottomright' | 'center', outputPath: string): Promise<string>;
    /**
     * 비디오 형식 변환
     */
    convertFormat(inputPath: string, outputFormat: 'mp4' | 'webm' | 'avi' | 'mov', outputPath: string): Promise<string>;
    /**
     * 비디오 압축
     */
    compressVideo(inputPath: string, quality: 'low' | 'medium' | 'high', outputPath: string): Promise<string>;
    /**
     * 코덱 매핑
     */
    private getCodec;
    /**
     * 임시 디렉토리 생성
     */
    private createTempDir;
    /**
     * 임시 파일 정리
     */
    private cleanup;
    /**
     * FFmpeg 설치 확인
     */
    static checkFFmpeg(): Promise<boolean>;
    /**
     * 지원 포맷 목록
     */
    static getSupportedFormats(): Promise<string[]>;
    /**
     * 지원 코덱 목록
     */
    static getSupportedCodecs(): Promise<string[]>;
}
export default VideoSynthesizer;
//# sourceMappingURL=index.d.ts.map