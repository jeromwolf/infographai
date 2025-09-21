type ITCategory = 'AI_ML' | 'BACKEND' | 'DEVOPS' | 'FRONTEND' | 'DATA' | 'GENERAL';
interface GeneratedScene {
    id: string;
    type: string;
    duration: number;
    title: string;
    narration: string;
    style: SceneStyle;
}
interface SceneStyle {
    backgroundColor: string;
    textColor: string;
    accentColor: string;
    animation: string;
    infographic: string;
}
interface GeneratedScenario {
    id: string;
    title: string;
    description: string;
    scenes: GeneratedScene[];
    totalDuration: number;
    sceneCount: number;
    metadata: {
        generatedBy: string;
        category: ITCategory;
        difficulty: string;
        keywords: string[];
        generatedAt: string;
        userId: string;
    };
}
export declare class AutoScenarioGenerator {
    private topicAnalyzer;
    private contentGenerator;
    private styleSelector;
    generateFromTopic(topic: string, userId: string): Promise<GeneratedScenario>;
    saveToDatabase(scenario: GeneratedScenario, projectId: string): Promise<any>;
}
export {};
//# sourceMappingURL=auto-scenario-generator.d.ts.map