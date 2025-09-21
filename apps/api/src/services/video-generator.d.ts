/**
 * Video Generation Service
 * Handles the complete video generation pipeline
 */
export declare class VideoGenerator {
    private videoId;
    private projectId;
    private scenarioId?;
    private outputDir;
    private frameRate;
    private width;
    private height;
    constructor(videoId: string, projectId: string, scenarioId?: string);
    generate(): Promise<void>;
    private generateScript;
    private parseScriptToScenes;
    private generateSubtitles;
    private renderScenes;
    private renderScene;
    private compileVideo;
    private saveVideo;
    private finalizeVideo;
    private updateVideoStatus;
}
export declare function startVideoGeneration(videoId: string, projectId: string, scenarioId?: string): Promise<void>;
//# sourceMappingURL=video-generator.d.ts.map