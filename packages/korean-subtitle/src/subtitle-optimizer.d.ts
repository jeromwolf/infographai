/**
 * 자막 최적화 엔진
 * 가독성과 타이밍 최적화
 */
export interface SubtitleSegment {
    text: string;
    startTime: number;
    endTime: number;
    keywords?: string[];
    emphasis?: boolean;
}
export interface OptimizationConfig {
    maxCharsPerLine: number;
    maxLines: number;
    minDuration: number;
    maxDuration: number;
    readingSpeed: number;
}
export declare class SubtitleOptimizer {
    private config;
    constructor(config?: Partial<OptimizationConfig>);
    /**
     * 긴 텍스트를 자막 세그먼트로 분할
     */
    splitIntoSegments(text: string, totalDuration: number): SubtitleSegment[];
    /**
     * 문장 분리
     */
    private splitSentences;
    /**
     * 한 줄 길이에 맞춰 텍스트 분할
     */
    private splitIntoLines;
    /**
     * 여러 줄을 지정된 수로 병합
     */
    private mergeLines;
    /**
     * 자막 표시 시간 계산
     */
    private calculateDuration;
    /**
     * 중요 키워드 추출
     */
    private extractKeywords;
    /**
     * 자막 타이밍 검증
     */
    validateTiming(segments: SubtitleSegment[]): boolean;
    /**
     * 자연스러운 끊김 위치 찾기
     */
    findNaturalBreaks(text: string): number[];
}
//# sourceMappingURL=subtitle-optimizer.d.ts.map