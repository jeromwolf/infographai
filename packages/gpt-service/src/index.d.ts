/**
 * GPT Service - OpenAI API Integration
 * IT 교육 콘텐츠 생성을 위한 GPT 서비스
 */
import { CostMonitor } from '@infographai/cost-monitor';
export declare enum GPTModel {
    GPT4 = "gpt-4-turbo-preview",
    GPT35 = "gpt-3.5-turbo",
    GPT4_VISION = "gpt-4-vision-preview"
}
export interface ScriptOptions {
    topic: string;
    duration: number;
    targetAudience: 'beginner' | 'intermediate' | 'advanced';
    language: 'ko' | 'en';
    style?: 'casual' | 'formal' | 'educational';
    keywords?: string[];
}
export interface GeneratedScript {
    title: string;
    introduction: string;
    sections: ScriptSection[];
    conclusion: string;
    estimatedDuration: number;
    keywords: string[];
    metadata: {
        tokens: number;
        model: string;
        cost: number;
    };
}
export interface ScriptSection {
    title: string;
    content: string;
    duration: number;
    visualSuggestions: string[];
    codeExamples?: string[];
}
export interface InfographicPrompt {
    concept: string;
    style: 'diagram' | 'flowchart' | 'comparison' | 'timeline' | 'process';
    complexity: 'simple' | 'moderate' | 'detailed';
}
export interface InfographicDescription {
    title: string;
    description: string;
    elements: InfographicElement[];
    colorScheme: string[];
    layout: string;
}
export interface InfographicElement {
    type: 'text' | 'shape' | 'icon' | 'arrow' | 'chart';
    content: string;
    position: {
        x: number;
        y: number;
    };
    style: Record<string, any>;
}
export declare class GPTService {
    private openai;
    private logger;
    private costMonitor;
    private defaultModel;
    constructor(apiKey?: string, costMonitor?: CostMonitor);
    /**
     * IT 교육 스크립트 생성
     */
    generateScript(options: ScriptOptions): Promise<GeneratedScript>;
    /**
     * 인포그래픽 설명 생성
     */
    generateInfographicDescription(prompt: InfographicPrompt): Promise<InfographicDescription>;
    /**
     * 코드 예제 생성
     */
    generateCodeExample(language: string, concept: string, level: 'basic' | 'intermediate' | 'advanced'): Promise<string>;
    /**
     * 자막 최적화 (한국어)
     */
    optimizeSubtitles(text: string, maxLength?: number): Promise<string[]>;
    /**
     * 단순 자막 분할 (fallback)
     */
    private simpleSubtitleSplit;
    /**
     * 비용 계산
     */
    private calculateCost;
    /**
     * 모델 변경
     */
    setModel(model: GPTModel): void;
    /**
     * 토큰 수 추정
     */
    estimateTokens(text: string): number;
}
export default GPTService;
//# sourceMappingURL=index.d.ts.map