/**
 * Smart Template Selector Service
 * Phase 2: AI 기반 템플릿 매칭 및 동적 조합 시스템
 */
import { EnhancedScene } from './ai-scenario-generator';
export declare enum TemplateCategory {
    CODE_EDITOR = "code-editors",
    TERMINAL = "terminals",
    ANIMATION = "animations",
    CHART = "charts",
    COMPARISON = "comparisons",
    PROCESS = "processes",
    TIMELINE = "timelines",
    CONCEPT = "concepts",
    ARCHITECTURE = "architecture",
    TRANSITION = "transitions"
}
export interface TemplateComposition {
    primaryTemplate: string;
    supportingTemplates: string[];
    transitions: string[];
    animations: string[];
    layout: 'single' | 'split' | 'grid' | 'timeline';
}
export declare class SmartTemplateSelector {
    private templateRules;
    private templateCache;
    private readonly templatesDir;
    constructor();
    /**
     * 주제별 템플릿 매칭 규칙 초기화
     */
    private initializeRules;
    /**
     * 씬에 대한 최적 템플릿 선택
     */
    selectTemplatesForScene(scene: EnhancedScene, topic: string, userLevel?: 'beginner' | 'intermediate' | 'advanced'): Promise<TemplateComposition>;
    /**
     * 키워드 추출
     */
    private extractKeywords;
    /**
     * 매칭 규칙 찾기
     */
    private findMatchingRules;
    /**
     * 템플릿 조합 생성
     */
    private composeTemplates;
    /**
     * 애니메이션 및 트랜지션 강화
     */
    private enhanceWithAnimations;
    /**
     * 템플릿 콘텐츠 로드 (캐싱 포함)
     */
    loadTemplate(templatePath: string): Promise<string>;
    /**
     * 기본 템플릿
     */
    private getDefaultTemplate;
    /**
     * 컨텍스트 기반 템플릿 추천
     */
    recommendTemplates(topic: string, sceneCount?: number): Promise<Map<string, TemplateComposition>>;
    /**
     * 템플릿 사용 통계
     */
    getTemplateUsageStats(): Map<string, number>;
}
export declare const smartTemplateSelector: SmartTemplateSelector;
//# sourceMappingURL=smart-template-selector.d.ts.map