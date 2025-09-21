/**
 * Scenario Manager
 * 시나리오 자동 생성, 수정, 사용자 입력 관리 시스템
 */
import * as Diff from 'diff';
import { EventEmitter } from 'events';
export declare enum ScenarioType {
    AUTO_GENERATED = "auto_generated",// AI 자동 생성
    USER_PROVIDED = "user_provided",// 사용자 직접 입력
    HYBRID = "hybrid",// 자동 생성 후 수정
    TEMPLATE_BASED = "template_based"
}
export declare enum ScenarioStatus {
    DRAFT = "draft",// 초안
    REVIEWING = "reviewing",// 검토 중
    APPROVED = "approved",// 승인됨
    IN_PRODUCTION = "in_production",// 제작 중
    COMPLETED = "completed"
}
export interface ScenarioSection {
    id: string;
    title: string;
    content: string;
    duration: number;
    order: number;
    visualNotes?: string[];
    audioNotes?: string[];
    codeExamples?: CodeExample[];
    keywords?: string[];
    isEditable: boolean;
    lastModified?: Date;
    modifiedBy?: string;
}
export interface CodeExample {
    language: string;
    code: string;
    description?: string;
    highlightLines?: number[];
}
export interface ScenarioMetadata {
    id: string;
    projectId: string;
    title: string;
    description?: string;
    type: ScenarioType;
    status: ScenarioStatus;
    version: number;
    language: 'ko' | 'en';
    targetAudience: 'beginner' | 'intermediate' | 'advanced';
    estimatedDuration: number;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    lastModifiedBy?: string;
}
export interface Scenario {
    metadata: ScenarioMetadata;
    introduction: string;
    sections: ScenarioSection[];
    conclusion: string;
    references?: string[];
    attachments?: Attachment[];
    revisionHistory: Revision[];
}
export interface Attachment {
    id: string;
    type: 'image' | 'video' | 'document' | 'link';
    url: string;
    description?: string;
}
export interface Revision {
    id: string;
    version: number;
    timestamp: Date;
    author: string;
    changes: Change[];
    comment?: string;
}
export interface Change {
    type: 'add' | 'modify' | 'delete';
    path: string;
    oldValue?: any;
    newValue?: any;
}
export interface GenerationOptions {
    topic: string;
    duration: number;
    targetAudience: 'beginner' | 'intermediate' | 'advanced';
    language: 'ko' | 'en';
    style?: 'casual' | 'formal' | 'educational';
    keywords?: string[];
    includeCodeExamples?: boolean;
    includeQuiz?: boolean;
    templateId?: string;
}
export interface ScenarioTemplate {
    id: string;
    name: string;
    description: string;
    category: string;
    structure: {
        introductionTemplate: string;
        sectionTemplates: SectionTemplate[];
        conclusionTemplate: string;
    };
    variables: TemplateVariable[];
}
export interface SectionTemplate {
    title: string;
    contentTemplate: string;
    defaultDuration: number;
    requiredVariables: string[];
}
export interface TemplateVariable {
    name: string;
    type: 'text' | 'number' | 'select' | 'boolean';
    description: string;
    defaultValue?: any;
    options?: any[];
}
export interface ValidationRules {
    minDuration?: number;
    maxDuration?: number;
    minSections?: number;
    maxSections?: number;
    requiredKeywords?: string[];
    forbiddenWords?: string[];
}
export declare class ScenarioManager extends EventEmitter {
    private scenarios;
    private templates;
    private logger;
    private validationRules;
    constructor();
    /**
     * 시나리오 자동 생성
     */
    generateScenario(options: GenerationOptions, userId: string): Promise<Scenario>;
    /**
     * 사용자 시나리오 입력
     */
    createUserScenario(userInput: {
        title: string;
        introduction: string;
        sections: Array<{
            title: string;
            content: string;
            duration?: number;
        }>;
        conclusion: string;
        language: 'ko' | 'en';
        targetAudience: 'beginner' | 'intermediate' | 'advanced';
    }, userId: string): Promise<Scenario>;
    /**
     * 시나리오 수정
     */
    updateScenario(scenarioId: string, updates: Partial<{
        title: string;
        introduction: string;
        sections: Partial<ScenarioSection>[];
        conclusion: string;
    }>, userId: string, comment?: string): Promise<Scenario>;
    /**
     * 섹션 추가
     */
    addSection(scenarioId: string, section: {
        title: string;
        content: string;
        duration?: number;
        position?: number;
    }, userId: string): Promise<Scenario>;
    /**
     * 섹션 삭제
     */
    removeSection(scenarioId: string, sectionId: string, userId: string): Promise<Scenario>;
    /**
     * 섹션 순서 변경
     */
    reorderSections(scenarioId: string, newOrder: string[], userId: string): Promise<Scenario>;
    /**
     * 시나리오 비교 (Diff)
     */
    compareVersions(scenarioId: string, version1: number, version2: number): Diff.Change[];
    /**
     * 시나리오 복제
     */
    cloneScenario(scenarioId: string, userId: string, modifications?: Partial<ScenarioMetadata>): Promise<Scenario>;
    /**
     * 시나리오 승인
     */
    approveScenario(scenarioId: string, userId: string, comment?: string): Promise<Scenario>;
    /**
     * AI를 통한 섹션 생성 (시뮬레이션)
     */
    private generateSectionsAI;
    /**
     * 템플릿 기반 섹션 생성
     */
    private generateFromTemplate;
    /**
     * 소개 생성
     */
    private generateIntroduction;
    /**
     * 결론 생성
     */
    private generateConclusion;
    /**
     * 섹션 주제 생성
     */
    private getSectionTopic;
    /**
     * 섹션 내용 생성
     */
    private generateSectionContent;
    /**
     * 대상 청중 레이블
     */
    private getAudienceLabel;
    /**
     * 템플릿 채우기
     */
    private fillTemplate;
    /**
     * 지속 시간 추정
     */
    private estimateDuration;
    /**
     * 키워드 추출
     */
    private extractKeywords;
    /**
     * 시나리오 유효성 검사
     */
    private validateScenario;
    /**
     * 버전 재구성
     */
    private reconstructVersion;
    /**
     * 기본 템플릿 로드
     */
    private loadDefaultTemplates;
    /**
     * 시나리오 조회
     */
    getScenario(scenarioId: string): Scenario | undefined;
    /**
     * 모든 시나리오 조회
     */
    getAllScenarios(): Scenario[];
    /**
     * 시나리오 삭제
     */
    deleteScenario(scenarioId: string): boolean;
    /**
     * 시나리오 내보내기
     */
    exportScenario(scenarioId: string, format: 'json' | 'markdown' | 'pdf'): string;
    /**
     * 마크다운으로 내보내기
     */
    private exportToMarkdown;
    /**
     * 시나리오 가져오기
     */
    importScenario(data: string, format: 'json' | 'markdown', userId: string): Scenario;
    /**
     * 마크다운 파싱 (간단한 구현)
     */
    private parseMarkdown;
}
export default ScenarioManager;
//# sourceMappingURL=index.d.ts.map