export interface GenerateVideoRequest {
    topic: string;
    options: {
        duration: 30 | 60 | 90;
        style: 'professional' | 'casual' | 'technical';
        targetAudience: 'beginner' | 'intermediate' | 'advanced';
        language: 'ko' | 'en';
    };
}
export interface VideoGenerationResponse {
    id: string;
    status: 'pending' | 'generating' | 'completed' | 'failed';
    progress: number;
    videoUrl?: string;
    scenarioId?: string;
    error?: string;
}
declare class AIAPI {
    private request;
    generateVideo(data: GenerateVideoRequest): Promise<VideoGenerationResponse>;
    getGenerationStatus(id: string): Promise<VideoGenerationResponse>;
    getGeneratedScenario(id: string): Promise<unknown>;
    updateGeneratedScenario(id: string, updates: any): Promise<unknown>;
    regenerateVideo(scenarioId: string): Promise<unknown>;
    getPopularTopics(): Promise<unknown>;
    getSuggestedTopics(category?: string): Promise<unknown>;
}
export declare const aiApi: AIAPI;
export {};
//# sourceMappingURL=ai-api.d.ts.map