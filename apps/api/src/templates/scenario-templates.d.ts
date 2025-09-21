/**
 * 고품질 시나리오 템플릿
 * 각 주제별로 최적화된 시나리오 구조 제공
 */
export interface SceneTemplate {
    type: 'intro' | 'concept' | 'comparison' | 'process' | 'example' | 'conclusion';
    duration: number;
    visualStyle: string;
    animationPattern: string;
    narrationGuideline: string;
}
export interface ScenarioTemplate {
    name: string;
    description: string;
    category: string;
    targetDuration: number;
    scenes: SceneTemplate[];
    keywords: string[];
}
export declare const templates: Record<string, ScenarioTemplate>;
export declare const scenarioGuidelines: {
    bestPractices: string[];
    sceneDuration: {
        intro: {
            min: number;
            max: number;
            optimal: number;
        };
        concept: {
            min: number;
            max: number;
            optimal: number;
        };
        example: {
            min: number;
            max: number;
            optimal: number;
        };
        process: {
            min: number;
            max: number;
            optimal: number;
        };
        comparison: {
            min: number;
            max: number;
            optimal: number;
        };
        conclusion: {
            min: number;
            max: number;
            optimal: number;
        };
    };
    visualStyles: {
        'modern-gradient': {
            colors: string[];
            fonts: string[];
            animations: string[];
        };
        'code-showcase': {
            theme: string;
            fontSize: number;
            lineHeight: number;
            highlights: boolean;
        };
        'diagram-centered': {
            layout: string;
            nodeStyle: string;
            connectionStyle: string;
        };
    };
    narrationTips: {
        intro: string;
        concept: string;
        example: string;
        process: string;
        comparison: string;
        conclusion: string;
    };
};
export declare function evaluateScenarioQuality(scenario: any): {
    score: number;
    feedback: string[];
    improvements: string[];
};
export declare function enhanceScenario(scenario: any, template?: string): any;
//# sourceMappingURL=scenario-templates.d.ts.map