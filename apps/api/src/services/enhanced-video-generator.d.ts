/**
 * 향상된 비디오 생성 엔진
 * 고품질 교육 비디오 생성을 위한 개선된 버전
 */
export declare class EnhancedVideoGenerator {
    private videoId;
    private projectId;
    private scenarioId?;
    private outputDir;
    private quality;
    constructor(videoId: string, projectId: string, scenarioId?: string);
    generate(): Promise<void>;
    private generateEnhancedScenario;
    private getFallbackScenario;
    private generateEnhancedSubtitles;
    private extractKeywords;
    private prepareVisualAssets;
    private createCodeImage;
    private renderEnhancedFrames;
    private generateFrameHtml;
    private generateAudio;
    private compileEnhancedVideo;
    private finalizeVideo;
    private updateStatus;
}
export declare function startEnhancedVideoGeneration(videoId: string, projectId: string, scenarioId?: string): Promise<void>;
//# sourceMappingURL=enhanced-video-generator.d.ts.map