/**
 * Canvas-based Infographic Video Generator
 * 실제 인포그래픽과 애니메이션이 포함된 비디오 생성
 */
export declare class CanvasVideoGenerator {
    private videoId;
    private projectId;
    private scenarioId?;
    private outputDir;
    private fps;
    private width;
    private height;
    constructor(videoId: string, projectId: string, scenarioId?: string);
    generate(): Promise<void>;
    private getScenario;
    private createSceneFrames;
    private drawIntroScene;
    private drawConceptScene;
    private drawProcessScene;
    private drawBenefitsScene;
    private drawExampleScene;
    private drawConclusionScene;
    private drawDefaultScene;
    private createVideoFromFrames;
    private cleanupFrames;
    private updateVideoStatus;
}
export declare function startCanvasVideoGeneration(videoId: string, projectId: string, scenarioId?: string): Promise<void>;
//# sourceMappingURL=canvas-video-generator.d.ts.map