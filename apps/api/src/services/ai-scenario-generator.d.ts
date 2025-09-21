export type SceneType = 'intro' | 'problem' | 'concept' | 'process' | 'comparison' | 'benefits' | 'example' | 'tutorial' | 'conclusion';
export interface VisualElement {
    type: 'icon' | 'chart' | 'diagram' | 'code' | 'text' | 'shape' | 'image';
    id: string;
    content?: any;
    style?: {
        color?: string;
        size?: 'small' | 'medium' | 'large';
        position?: 'center' | 'left' | 'right' | 'top' | 'bottom';
    };
}
export interface SceneAnimation {
    type: 'fadeIn' | 'slideIn' | 'zoomIn' | 'typewriter' | 'draw' | 'morph';
    target: string;
    duration: number;
    delay?: number;
}
export interface EnhancedScene {
    id: string;
    type: SceneType;
    duration: number;
    title: string;
    subtitle?: string;
    narration: string;
    layout: 'center' | 'split' | 'grid' | 'timeline' | 'comparison';
    visualElements: VisualElement[];
    animations: SceneAnimation[];
    dataPoints?: Array<{
        label: string;
        value: string | number;
        highlight?: boolean;
    }>;
}
export interface GenerationOptions {
    duration: 30 | 60 | 90;
    style: 'professional' | 'casual' | 'technical';
    targetAudience: 'beginner' | 'intermediate' | 'advanced';
    language: 'ko' | 'en';
}
export declare class AIScenarioGenerator {
    private openai;
    constructor(apiKey?: string);
    generateScenario(topic: string, options?: GenerationOptions): Promise<EnhancedScene[]>;
    private validateScenes;
    private generateTemplateScenario;
    private getSceneTypeTitle;
    private getLayoutForType;
    private getVisualElementsForType;
}
//# sourceMappingURL=ai-scenario-generator.d.ts.map