/**
 * Simple Video Generation Service
 * Creates video content without complex dependencies
 */
export declare class SimpleVideoGenerator {
    private videoId;
    private projectId;
    private scenarioId?;
    private outputDir;
    constructor(videoId: string, projectId: string, scenarioId?: string);
    generate(): Promise<void>;
    private generateScript;
    private generateSubtitles;
    private createSimpleFrames;
    private createVideo;
    private finalizeVideo;
    private updateVideoStatus;
}
export declare function startSimpleVideoGeneration(videoId: string, projectId: string, scenarioId?: string): Promise<void>;
//# sourceMappingURL=simple-video-generator.d.ts.map