/**
 * Sharp + SVG 기반 비디오 생성기
 * Canvas 대신 Sharp와 SVG를 사용하여 인포그래픽 생성
 */
export declare class SharpVideoGenerator {
    private videoId;
    private projectId;
    private scenarioId?;
    private outputDir;
    private fps;
    private width;
    private height;
    constructor(videoId: string, projectId: string, scenarioId?: string);
    generate(): Promise<void>;
    private createSceneFrames;
    private createIntroSVG;
    private createConceptSVG;
    private createProcessSVG;
    private createBenefitsSVG;
    private createExampleSVG;
    private createConclusionSVG;
    private createDefaultSVG;
    private getScenario;
    private parseScenes;
    private createVideo;
    private updateVideoStatus;
}
export declare function startSharpVideoGeneration(videoId: string, projectId: string, scenarioId?: string): Promise<void>;
//# sourceMappingURL=sharp-video-generator.d.ts.map