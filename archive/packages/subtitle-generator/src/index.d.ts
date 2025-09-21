/**
 * Subtitle Generator
 * 자막 생성 및 타이밍 조정 시스템
 */
import { GPTService, ScriptSection } from '@infographai/gpt-service';
export type SubtitleFormat = 'srt' | 'vtt' | 'ass' | 'json';
export interface SubtitleEntry {
    id: number;
    startTime: number;
    endTime: number;
    text: string;
    style?: SubtitleStyle;
}
export interface SubtitleStyle {
    fontSize?: number;
    color?: string;
    backgroundColor?: string;
    position?: 'top' | 'center' | 'bottom';
    animation?: 'fade' | 'slide' | 'typewriter' | 'none';
}
export interface TimingOptions {
    wordsPerMinute?: number;
    minDuration?: number;
    maxDuration?: number;
    gap?: number;
    overlapAllowed?: boolean;
}
export interface GenerationOptions {
    language: 'ko' | 'en';
    style?: SubtitleStyle;
    timing?: TimingOptions;
    maxLineLength?: number;
    maxLines?: number;
}
export declare class SubtitleGenerator {
    private koreanProcessor;
    private gptService;
    private logger;
    private parser;
    private outputDir;
    private defaultTiming;
    constructor(outputDir?: string, gptService?: GPTService);
    private ensureOutputDir;
    /**
     * 스크립트 섹션에서 자막 생성
     */
    generateFromScript(sections: ScriptSection[], options: GenerationOptions): Promise<SubtitleEntry[]>;
    /**
     * 섹션별 자막 생성
     */
    private generateSectionSubtitles;
    /**
     * 텍스트를 자막 청크로 분할
     */
    private splitTextIntoChunks;
    /**
     * 간단한 텍스트 분할
     */
    private simpleSplit;
    /**
     * 타이밍 자동 조정
     */
    adjustTiming(subtitles: SubtitleEntry[], totalDuration: number): SubtitleEntry[];
    /**
     * 읽기 시간 계산
     */
    private calculateReadingTime;
    /**
     * SRT 형식으로 내보내기
     */
    exportToSRT(subtitles: SubtitleEntry[], filename: string): Promise<string>;
    /**
     * WebVTT 형식으로 내보내기
     */
    exportToVTT(subtitles: SubtitleEntry[], filename: string): Promise<string>;
    /**
     * ASS/SSA 형식으로 내보내기 (고급 스타일링)
     */
    exportToASS(subtitles: SubtitleEntry[], filename: string): Promise<string>;
    /**
     * ASS 헤더 생성
     */
    private generateASSHeader;
    /**
     * JSON 형식으로 내보내기
     */
    exportToJSON(subtitles: SubtitleEntry[], filename: string): Promise<string>;
    /**
     * SRT 시간 포맷
     */
    private formatSRTTime;
    /**
     * VTT 시간 포맷
     */
    private formatVTTTime;
    /**
     * ASS 시간 포맷
     */
    private formatASSTime;
    /**
     * 일반 시간 포맷
     */
    private formatTime;
    /**
     * 자막 애니메이션 생성 (CSS/JSON)
     */
    generateAnimations(subtitles: SubtitleEntry[]): Record<string, any>;
    /**
     * 자막 검증
     */
    validateSubtitles(subtitles: SubtitleEntry[]): {
        valid: boolean;
        errors: string[];
    };
}
export default SubtitleGenerator;
//# sourceMappingURL=index.d.ts.map