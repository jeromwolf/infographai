"use strict";
/**
 * Scenario Manager
 * 시나리오 자동 생성, 수정, 사용자 입력 관리 시스템
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScenarioManager = exports.ScenarioStatus = exports.ScenarioType = void 0;
const uuid_1 = require("uuid");
const Diff = __importStar(require("diff"));
const joi_1 = __importDefault(require("joi"));
const winston_1 = __importDefault(require("winston"));
const events_1 = require("events");
// 시나리오 타입
var ScenarioType;
(function (ScenarioType) {
    ScenarioType["AUTO_GENERATED"] = "auto_generated";
    ScenarioType["USER_PROVIDED"] = "user_provided";
    ScenarioType["HYBRID"] = "hybrid";
    ScenarioType["TEMPLATE_BASED"] = "template_based"; // 템플릿 기반
})(ScenarioType || (exports.ScenarioType = ScenarioType = {}));
// 시나리오 상태
var ScenarioStatus;
(function (ScenarioStatus) {
    ScenarioStatus["DRAFT"] = "draft";
    ScenarioStatus["REVIEWING"] = "reviewing";
    ScenarioStatus["APPROVED"] = "approved";
    ScenarioStatus["IN_PRODUCTION"] = "in_production";
    ScenarioStatus["COMPLETED"] = "completed"; // 완료
})(ScenarioStatus || (exports.ScenarioStatus = ScenarioStatus = {}));
class ScenarioManager extends events_1.EventEmitter {
    scenarios;
    templates;
    logger;
    validationRules;
    constructor() {
        super();
        this.scenarios = new Map();
        this.templates = new Map();
        // 기본 유효성 검사 규칙
        this.validationRules = {
            minDuration: 30,
            maxDuration: 600,
            minSections: 2,
            maxSections: 20
        };
        // Logger 설정
        this.logger = winston_1.default.createLogger({
            level: 'info',
            format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.json()),
            transports: [
                new winston_1.default.transports.Console(),
                new winston_1.default.transports.File({ filename: 'scenario-manager.log' })
            ]
        });
        // 기본 템플릿 로드
        this.loadDefaultTemplates();
    }
    /**
     * 시나리오 자동 생성
     */
    async generateScenario(options, userId) {
        this.logger.info('Generating scenario', { options, userId });
        const scenarioId = (0, uuid_1.v4)();
        // 템플릿 사용 여부 확인
        let sections;
        if (options.templateId) {
            sections = await this.generateFromTemplate(options.templateId, options);
        }
        else {
            sections = await this.generateSectionsAI(options);
        }
        // 시나리오 생성
        const scenario = {
            metadata: {
                id: scenarioId,
                projectId: (0, uuid_1.v4)(),
                title: `${options.topic} 튜토리얼`,
                type: ScenarioType.AUTO_GENERATED,
                status: ScenarioStatus.DRAFT,
                version: 1,
                language: options.language,
                targetAudience: options.targetAudience,
                estimatedDuration: options.duration,
                tags: options.keywords || [],
                createdAt: new Date(),
                updatedAt: new Date(),
                createdBy: userId
            },
            introduction: this.generateIntroduction(options),
            sections,
            conclusion: this.generateConclusion(options),
            revisionHistory: [{
                    id: (0, uuid_1.v4)(),
                    version: 1,
                    timestamp: new Date(),
                    author: userId,
                    changes: [{
                            type: 'add',
                            path: '/',
                            newValue: 'Initial creation'
                        }],
                    comment: 'Auto-generated scenario'
                }]
        };
        // 유효성 검사
        this.validateScenario(scenario);
        // 저장
        this.scenarios.set(scenarioId, scenario);
        this.emit('scenario:created', scenario);
        return scenario;
    }
    /**
     * 사용자 시나리오 입력
     */
    async createUserScenario(userInput, userId) {
        this.logger.info('Creating user scenario', { userId });
        const scenarioId = (0, uuid_1.v4)();
        // 사용자 입력을 시나리오 섹션으로 변환
        const sections = userInput.sections.map((section, index) => ({
            id: (0, uuid_1.v4)(),
            title: section.title,
            content: section.content,
            duration: section.duration || this.estimateDuration(section.content),
            order: index + 1,
            isEditable: true,
            lastModified: new Date(),
            modifiedBy: userId
        }));
        // 총 지속 시간 계산
        const totalDuration = sections.reduce((sum, s) => sum + s.duration, 0);
        const scenario = {
            metadata: {
                id: scenarioId,
                projectId: (0, uuid_1.v4)(),
                title: userInput.title,
                type: ScenarioType.USER_PROVIDED,
                status: ScenarioStatus.DRAFT,
                version: 1,
                language: userInput.language,
                targetAudience: userInput.targetAudience,
                estimatedDuration: totalDuration,
                tags: this.extractKeywords(userInput.introduction + ' ' + userInput.conclusion),
                createdAt: new Date(),
                updatedAt: new Date(),
                createdBy: userId
            },
            introduction: userInput.introduction,
            sections,
            conclusion: userInput.conclusion,
            revisionHistory: [{
                    id: (0, uuid_1.v4)(),
                    version: 1,
                    timestamp: new Date(),
                    author: userId,
                    changes: [{
                            type: 'add',
                            path: '/',
                            newValue: 'User-provided scenario'
                        }],
                    comment: 'Initial user input'
                }]
        };
        // 유효성 검사
        this.validateScenario(scenario);
        // 저장
        this.scenarios.set(scenarioId, scenario);
        this.emit('scenario:created', scenario);
        return scenario;
    }
    /**
     * 시나리오 수정
     */
    async updateScenario(scenarioId, updates, userId, comment) {
        const scenario = this.scenarios.get(scenarioId);
        if (!scenario) {
            throw new Error(`Scenario not found: ${scenarioId}`);
        }
        this.logger.info('Updating scenario', { scenarioId, userId });
        // 변경 사항 추적
        const changes = [];
        // const oldScenario = JSON.parse(JSON.stringify(scenario)); // 현재 사용되지 않음
        // 제목 업데이트
        if (updates.title) {
            changes.push({
                type: 'modify',
                path: '/metadata/title',
                oldValue: scenario.metadata.title,
                newValue: updates.title
            });
            scenario.metadata.title = updates.title;
        }
        // 소개 업데이트
        if (updates.introduction) {
            changes.push({
                type: 'modify',
                path: '/introduction',
                oldValue: scenario.introduction,
                newValue: updates.introduction
            });
            scenario.introduction = updates.introduction;
        }
        // 섹션 업데이트
        if (updates.sections) {
            updates.sections.forEach((sectionUpdate, index) => {
                if (scenario.sections[index]) {
                    Object.entries(sectionUpdate).forEach(([key, value]) => {
                        if (value !== undefined) {
                            changes.push({
                                type: 'modify',
                                path: `/sections/${index}/${key}`,
                                oldValue: scenario.sections[index][key],
                                newValue: value
                            });
                            scenario.sections[index][key] = value;
                            scenario.sections[index].lastModified = new Date();
                            scenario.sections[index].modifiedBy = userId;
                        }
                    });
                }
            });
        }
        // 결론 업데이트
        if (updates.conclusion) {
            changes.push({
                type: 'modify',
                path: '/conclusion',
                oldValue: scenario.conclusion,
                newValue: updates.conclusion
            });
            scenario.conclusion = updates.conclusion;
        }
        // 메타데이터 업데이트
        scenario.metadata.version += 1;
        scenario.metadata.updatedAt = new Date();
        scenario.metadata.lastModifiedBy = userId;
        // 타입 변경 (자동 생성 → 하이브리드)
        if (scenario.metadata.type === ScenarioType.AUTO_GENERATED && changes.length > 0) {
            scenario.metadata.type = ScenarioType.HYBRID;
        }
        // 수정 이력 추가
        scenario.revisionHistory.push({
            id: (0, uuid_1.v4)(),
            version: scenario.metadata.version,
            timestamp: new Date(),
            author: userId,
            changes,
            comment
        });
        // 유효성 검사
        this.validateScenario(scenario);
        this.emit('scenario:updated', { scenario, changes });
        return scenario;
    }
    /**
     * 섹션 추가
     */
    async addSection(scenarioId, section, userId) {
        const scenario = this.scenarios.get(scenarioId);
        if (!scenario) {
            throw new Error(`Scenario not found: ${scenarioId}`);
        }
        const newSection = {
            id: (0, uuid_1.v4)(),
            title: section.title,
            content: section.content,
            duration: section.duration || this.estimateDuration(section.content),
            order: section.position || scenario.sections.length + 1,
            isEditable: true,
            lastModified: new Date(),
            modifiedBy: userId
        };
        // 위치 지정된 경우 삽입, 아니면 끝에 추가
        if (section.position !== undefined && section.position < scenario.sections.length) {
            scenario.sections.splice(section.position, 0, newSection);
            // 이후 섹션들의 순서 재조정
            for (let i = section.position + 1; i < scenario.sections.length; i++) {
                scenario.sections[i].order = i + 1;
            }
        }
        else {
            scenario.sections.push(newSection);
        }
        // 메타데이터 업데이트
        scenario.metadata.version += 1;
        scenario.metadata.updatedAt = new Date();
        scenario.metadata.estimatedDuration = scenario.sections.reduce((sum, s) => sum + s.duration, 0);
        // 수정 이력 추가
        scenario.revisionHistory.push({
            id: (0, uuid_1.v4)(),
            version: scenario.metadata.version,
            timestamp: new Date(),
            author: userId,
            changes: [{
                    type: 'add',
                    path: `/sections/${newSection.order - 1}`,
                    newValue: newSection
                }],
            comment: `Added section: ${newSection.title}`
        });
        this.emit('scenario:section:added', { scenarioId, section: newSection });
        return scenario;
    }
    /**
     * 섹션 삭제
     */
    async removeSection(scenarioId, sectionId, userId) {
        const scenario = this.scenarios.get(scenarioId);
        if (!scenario) {
            throw new Error(`Scenario not found: ${scenarioId}`);
        }
        const sectionIndex = scenario.sections.findIndex(s => s.id === sectionId);
        if (sectionIndex === -1) {
            throw new Error(`Section not found: ${sectionId}`);
        }
        const removedSection = scenario.sections[sectionIndex];
        scenario.sections.splice(sectionIndex, 1);
        // 순서 재조정
        scenario.sections.forEach((section, index) => {
            section.order = index + 1;
        });
        // 메타데이터 업데이트
        scenario.metadata.version += 1;
        scenario.metadata.updatedAt = new Date();
        scenario.metadata.estimatedDuration = scenario.sections.reduce((sum, s) => sum + s.duration, 0);
        // 수정 이력 추가
        scenario.revisionHistory.push({
            id: (0, uuid_1.v4)(),
            version: scenario.metadata.version,
            timestamp: new Date(),
            author: userId,
            changes: [{
                    type: 'delete',
                    path: `/sections/${sectionIndex}`,
                    oldValue: removedSection
                }],
            comment: `Removed section: ${removedSection.title}`
        });
        this.emit('scenario:section:removed', { scenarioId, sectionId });
        return scenario;
    }
    /**
     * 섹션 순서 변경
     */
    async reorderSections(scenarioId, newOrder, userId) {
        const scenario = this.scenarios.get(scenarioId);
        if (!scenario) {
            throw new Error(`Scenario not found: ${scenarioId}`);
        }
        const reorderedSections = [];
        newOrder.forEach((sectionId, index) => {
            const section = scenario.sections.find(s => s.id === sectionId);
            if (section) {
                section.order = index + 1;
                reorderedSections.push(section);
            }
        });
        scenario.sections = reorderedSections;
        // 메타데이터 업데이트
        scenario.metadata.version += 1;
        scenario.metadata.updatedAt = new Date();
        // 수정 이력 추가
        scenario.revisionHistory.push({
            id: (0, uuid_1.v4)(),
            version: scenario.metadata.version,
            timestamp: new Date(),
            author: userId,
            changes: [{
                    type: 'modify',
                    path: '/sections/order',
                    oldValue: 'Previous order',
                    newValue: newOrder
                }],
            comment: 'Reordered sections'
        });
        this.emit('scenario:sections:reordered', { scenarioId, newOrder });
        return scenario;
    }
    /**
     * 시나리오 비교 (Diff)
     */
    compareVersions(scenarioId, version1, version2) {
        const scenario = this.scenarios.get(scenarioId);
        if (!scenario) {
            throw new Error(`Scenario not found: ${scenarioId}`);
        }
        // 버전별 내용 재구성
        const v1Content = this.reconstructVersion(scenario, version1);
        const v2Content = this.reconstructVersion(scenario, version2);
        // 텍스트 비교
        return Diff.diffLines(JSON.stringify(v1Content, null, 2), JSON.stringify(v2Content, null, 2));
    }
    /**
     * 시나리오 복제
     */
    async cloneScenario(scenarioId, userId, modifications) {
        const original = this.scenarios.get(scenarioId);
        if (!original) {
            throw new Error(`Scenario not found: ${scenarioId}`);
        }
        const clonedId = (0, uuid_1.v4)();
        const cloned = JSON.parse(JSON.stringify(original));
        // 새 ID 및 메타데이터 설정
        cloned.metadata.id = clonedId;
        cloned.metadata.projectId = (0, uuid_1.v4)();
        cloned.metadata.title = modifications?.title || `${original.metadata.title} (복사본)`;
        cloned.metadata.version = 1;
        cloned.metadata.createdAt = new Date();
        cloned.metadata.updatedAt = new Date();
        cloned.metadata.createdBy = userId;
        cloned.metadata.type = ScenarioType.USER_PROVIDED;
        // 섹션 ID 재생성
        cloned.sections.forEach(section => {
            section.id = (0, uuid_1.v4)();
        });
        // 수정 이력 초기화
        cloned.revisionHistory = [{
                id: (0, uuid_1.v4)(),
                version: 1,
                timestamp: new Date(),
                author: userId,
                changes: [{
                        type: 'add',
                        path: '/',
                        newValue: `Cloned from ${scenarioId}`
                    }],
                comment: 'Cloned scenario'
            }];
        this.scenarios.set(clonedId, cloned);
        this.emit('scenario:cloned', { original: scenarioId, clone: clonedId });
        return cloned;
    }
    /**
     * 시나리오 승인
     */
    async approveScenario(scenarioId, userId, comment) {
        const scenario = this.scenarios.get(scenarioId);
        if (!scenario) {
            throw new Error(`Scenario not found: ${scenarioId}`);
        }
        scenario.metadata.status = ScenarioStatus.APPROVED;
        scenario.metadata.updatedAt = new Date();
        scenario.metadata.version += 1;
        // 수정 이력 추가
        scenario.revisionHistory.push({
            id: (0, uuid_1.v4)(),
            version: scenario.metadata.version,
            timestamp: new Date(),
            author: userId,
            changes: [{
                    type: 'modify',
                    path: '/metadata/status',
                    oldValue: ScenarioStatus.DRAFT,
                    newValue: ScenarioStatus.APPROVED
                }],
            comment: comment || 'Scenario approved'
        });
        this.emit('scenario:approved', { scenarioId, approvedBy: userId });
        return scenario;
    }
    /**
     * AI를 통한 섹션 생성 (시뮬레이션)
     */
    async generateSectionsAI(options) {
        const sections = [];
        const sectionCount = Math.max(3, Math.floor(options.duration / 60));
        for (let i = 0; i < sectionCount; i++) {
            sections.push({
                id: (0, uuid_1.v4)(),
                title: `섹션 ${i + 1}: ${options.topic} ${this.getSectionTopic(i)}`,
                content: this.generateSectionContent(options, i),
                duration: Math.floor(options.duration / sectionCount),
                order: i + 1,
                isEditable: true,
                visualNotes: ['다이어그램', '코드 예제'],
                keywords: options.keywords
            });
        }
        return sections;
    }
    /**
     * 템플릿 기반 섹션 생성
     */
    async generateFromTemplate(templateId, options) {
        const template = this.templates.get(templateId);
        if (!template) {
            throw new Error(`Template not found: ${templateId}`);
        }
        return template.structure.sectionTemplates.map((sectionTemplate, index) => ({
            id: (0, uuid_1.v4)(),
            title: this.fillTemplate(sectionTemplate.title, options),
            content: this.fillTemplate(sectionTemplate.contentTemplate, options),
            duration: sectionTemplate.defaultDuration,
            order: index + 1,
            isEditable: true
        }));
    }
    /**
     * 소개 생성
     */
    generateIntroduction(options) {
        const greetings = options.language === 'ko'
            ? ['안녕하세요!', '반갑습니다!', '환영합니다!']
            : ['Hello!', 'Welcome!', 'Greetings!'];
        const greeting = greetings[Math.floor(Math.random() * greetings.length)];
        return options.language === 'ko'
            ? `${greeting} 오늘은 ${options.topic}에 대해 알아보겠습니다. 이 튜토리얼은 ${this.getAudienceLabel(options.targetAudience, 'ko')}를 위해 준비되었습니다.`
            : `${greeting} Today we'll learn about ${options.topic}. This tutorial is designed for ${this.getAudienceLabel(options.targetAudience, 'en')}.`;
    }
    /**
     * 결론 생성
     */
    generateConclusion(options) {
        return options.language === 'ko'
            ? `오늘 ${options.topic}에 대해 알아보았습니다. 배운 내용을 실제 프로젝트에 적용해보세요. 감사합니다!`
            : `We've covered ${options.topic} today. Try applying what you've learned in your projects. Thank you!`;
    }
    /**
     * 섹션 주제 생성
     */
    getSectionTopic(index) {
        const topics = ['기초', '핵심 개념', '실습', '고급 기능', '최적화', '마무리'];
        return topics[index % topics.length];
    }
    /**
     * 섹션 내용 생성
     */
    generateSectionContent(options, index) {
        const templates = {
            ko: [
                `이번 섹션에서는 ${options.topic}의 기본 개념을 설명합니다.`,
                `${options.topic}의 핵심 기능을 살펴보겠습니다.`,
                `실제 예제를 통해 ${options.topic}를 실습해봅시다.`,
                `${options.topic}의 고급 기능과 팁을 알아봅니다.`
            ],
            en: [
                `In this section, we'll explore the basics of ${options.topic}.`,
                `Let's dive into the core features of ${options.topic}.`,
                `We'll practice ${options.topic} with real examples.`,
                `Advanced features and tips for ${options.topic}.`
            ]
        };
        const contentTemplates = templates[options.language] || templates.en;
        return contentTemplates[index % contentTemplates.length];
    }
    /**
     * 대상 청중 레이블
     */
    getAudienceLabel(audience, language) {
        const labels = {
            ko: {
                beginner: '초급자',
                intermediate: '중급자',
                advanced: '고급자'
            },
            en: {
                beginner: 'beginners',
                intermediate: 'intermediate learners',
                advanced: 'advanced users'
            }
        };
        return labels[language][audience];
    }
    /**
     * 템플릿 채우기
     */
    fillTemplate(template, options) {
        return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
            return options[key] || match;
        });
    }
    /**
     * 지속 시간 추정
     */
    estimateDuration(content) {
        // 대략 분당 150단어 읽기 속도 기준
        const words = content.split(/\s+/).length;
        const minutes = words / 150;
        return Math.max(30, Math.ceil(minutes * 60)); // 최소 30초
    }
    /**
     * 키워드 추출
     */
    extractKeywords(text) {
        // 간단한 키워드 추출 (실제로는 더 정교한 NLP 필요)
        const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for']);
        const words = text.toLowerCase().match(/\b\w+\b/g) || [];
        return Array.from(new Set(words.filter(word => word.length > 3 &&
            !stopWords.has(word)))).slice(0, 10);
    }
    /**
     * 시나리오 유효성 검사
     */
    validateScenario(scenario) {
        const schema = joi_1.default.object({
            metadata: joi_1.default.object({
                title: joi_1.default.string().min(1).max(200).required(),
                estimatedDuration: joi_1.default.number()
                    .min(this.validationRules.minDuration || 30)
                    .max(this.validationRules.maxDuration || 600)
                    .required()
            }),
            sections: joi_1.default.array()
                .min(this.validationRules.minSections || 2)
                .max(this.validationRules.maxSections || 20)
                .required()
        });
        const { error } = schema.validate({
            metadata: scenario.metadata,
            sections: scenario.sections
        });
        if (error) {
            throw new Error(`Scenario validation failed: ${error.message}`);
        }
    }
    /**
     * 버전 재구성
     */
    reconstructVersion(scenario, _version) {
        // 특정 버전의 상태를 재구성 (수정 이력 기반)
        let reconstructed = {
            introduction: scenario.introduction,
            sections: [...scenario.sections],
            conclusion: scenario.conclusion
        };
        // 해당 버전까지의 변경사항만 적용
        // const relevantRevisions = scenario.revisionHistory.filter(r => r.version <= version);
        // 실제 구현에서는 더 정교한 재구성 로직 필요
        // relevantRevisions를 사용한 버전 재구성 로직은 추후 구현
        return reconstructed;
    }
    /**
     * 기본 템플릿 로드
     */
    loadDefaultTemplates() {
        // 프로그래밍 튜토리얼 템플릿
        this.templates.set('programming-tutorial', {
            id: 'programming-tutorial',
            name: '프로그래밍 튜토리얼',
            description: '프로그래밍 언어나 기술을 가르치는 표준 템플릿',
            category: 'education',
            structure: {
                introductionTemplate: '안녕하세요! 오늘은 {{topic}}에 대해 알아보겠습니다.',
                sectionTemplates: [
                    {
                        title: '개요',
                        contentTemplate: '{{topic}}의 기본 개념과 왜 중요한지 설명합니다.',
                        defaultDuration: 60,
                        requiredVariables: ['topic']
                    },
                    {
                        title: '기본 문법',
                        contentTemplate: '{{topic}}의 기본 문법과 구조를 살펴봅니다.',
                        defaultDuration: 120,
                        requiredVariables: ['topic']
                    },
                    {
                        title: '실습',
                        contentTemplate: '실제 코드 예제를 통해 {{topic}}를 실습합니다.',
                        defaultDuration: 180,
                        requiredVariables: ['topic']
                    },
                    {
                        title: '심화 내용',
                        contentTemplate: '{{topic}}의 고급 기능과 베스트 프랙티스를 알아봅니다.',
                        defaultDuration: 120,
                        requiredVariables: ['topic']
                    }
                ],
                conclusionTemplate: '오늘 배운 {{topic}}를 프로젝트에 적용해보세요!'
            },
            variables: [
                {
                    name: 'topic',
                    type: 'text',
                    description: '튜토리얼 주제'
                },
                {
                    name: 'duration',
                    type: 'number',
                    description: '전체 길이 (초)',
                    defaultValue: 300
                }
            ]
        });
        // 개념 설명 템플릿
        this.templates.set('concept-explanation', {
            id: 'concept-explanation',
            name: '개념 설명',
            description: 'IT 개념을 설명하는 템플릿',
            category: 'education',
            structure: {
                introductionTemplate: '{{concept}}에 대해 자세히 알아보겠습니다.',
                sectionTemplates: [
                    {
                        title: '정의',
                        contentTemplate: '{{concept}}란 무엇인지 정의합니다.',
                        defaultDuration: 45,
                        requiredVariables: ['concept']
                    },
                    {
                        title: '동작 원리',
                        contentTemplate: '{{concept}}가 어떻게 작동하는지 설명합니다.',
                        defaultDuration: 90,
                        requiredVariables: ['concept']
                    },
                    {
                        title: '장단점',
                        contentTemplate: '{{concept}}의 장점과 단점을 비교합니다.',
                        defaultDuration: 60,
                        requiredVariables: ['concept']
                    },
                    {
                        title: '활용 사례',
                        contentTemplate: '{{concept}}의 실제 활용 사례를 소개합니다.',
                        defaultDuration: 60,
                        requiredVariables: ['concept']
                    }
                ],
                conclusionTemplate: '{{concept}}에 대한 이해가 깊어졌기를 바랍니다.'
            },
            variables: [
                {
                    name: 'concept',
                    type: 'text',
                    description: '설명할 개념'
                }
            ]
        });
        this.logger.info('Default templates loaded', {
            count: this.templates.size
        });
    }
    /**
     * 시나리오 조회
     */
    getScenario(scenarioId) {
        return this.scenarios.get(scenarioId);
    }
    /**
     * 모든 시나리오 조회
     */
    getAllScenarios() {
        return Array.from(this.scenarios.values());
    }
    /**
     * 시나리오 삭제
     */
    deleteScenario(scenarioId) {
        const result = this.scenarios.delete(scenarioId);
        if (result) {
            this.emit('scenario:deleted', { scenarioId });
        }
        return result;
    }
    /**
     * 시나리오 내보내기
     */
    exportScenario(scenarioId, format) {
        const scenario = this.scenarios.get(scenarioId);
        if (!scenario) {
            throw new Error(`Scenario not found: ${scenarioId}`);
        }
        switch (format) {
            case 'json':
                return JSON.stringify(scenario, null, 2);
            case 'markdown':
                return this.exportToMarkdown(scenario);
            case 'pdf':
                // PDF 생성은 별도 라이브러리 필요
                throw new Error('PDF export not implemented');
            default:
                throw new Error(`Unsupported format: ${format}`);
        }
    }
    /**
     * 마크다운으로 내보내기
     */
    exportToMarkdown(scenario) {
        let markdown = `# ${scenario.metadata.title}\n\n`;
        markdown += `**대상**: ${scenario.metadata.targetAudience}\n`;
        markdown += `**예상 시간**: ${Math.floor(scenario.metadata.estimatedDuration / 60)}분\n`;
        markdown += `**언어**: ${scenario.metadata.language}\n\n`;
        markdown += `## 소개\n\n${scenario.introduction}\n\n`;
        scenario.sections.forEach(section => {
            markdown += `## ${section.title}\n\n`;
            markdown += `${section.content}\n\n`;
            if (section.codeExamples && section.codeExamples.length > 0) {
                section.codeExamples.forEach(example => {
                    markdown += `\`\`\`${example.language}\n`;
                    markdown += `${example.code}\n`;
                    markdown += `\`\`\`\n\n`;
                });
            }
        });
        markdown += `## 결론\n\n${scenario.conclusion}\n`;
        return markdown;
    }
    /**
     * 시나리오 가져오기
     */
    importScenario(data, format, userId) {
        let scenarioData;
        switch (format) {
            case 'json':
                scenarioData = JSON.parse(data);
                break;
            case 'markdown':
                scenarioData = this.parseMarkdown(data);
                break;
            default:
                throw new Error(`Unsupported format: ${format}`);
        }
        // 새 ID 생성
        scenarioData.metadata.id = (0, uuid_1.v4)();
        scenarioData.metadata.createdBy = userId;
        scenarioData.metadata.createdAt = new Date();
        const scenario = scenarioData;
        this.validateScenario(scenario);
        this.scenarios.set(scenario.metadata.id, scenario);
        this.emit('scenario:imported', { scenarioId: scenario.metadata.id });
        return scenario;
    }
    /**
     * 마크다운 파싱 (간단한 구현)
     */
    parseMarkdown(markdown) {
        // 실제 구현에서는 더 정교한 파싱 필요
        const lines = markdown.split('\n');
        const scenario = {
            metadata: {
                id: (0, uuid_1.v4)(),
                title: '',
                type: ScenarioType.USER_PROVIDED,
                status: ScenarioStatus.DRAFT,
                version: 1
            },
            introduction: '',
            sections: [],
            conclusion: '',
            revisionHistory: []
        };
        // 간단한 파싱 로직
        let currentSection = null;
        lines.forEach(line => {
            if (line.startsWith('# ')) {
                scenario.metadata.title = line.substring(2);
            }
            else if (line.startsWith('## ')) {
                const title = line.substring(3);
                if (title === '소개' || title === 'Introduction') {
                    currentSection = 'introduction';
                }
                else if (title === '결론' || title === 'Conclusion') {
                    currentSection = 'conclusion';
                }
                else {
                    const newSection = { title, content: '' };
                    currentSection = newSection;
                    scenario.sections.push(newSection);
                }
            }
            else if (currentSection) {
                if (typeof currentSection === 'string') {
                    if (currentSection === 'introduction') {
                        scenario.introduction += line + '\n';
                    }
                    else if (currentSection === 'conclusion') {
                        scenario.conclusion += line + '\n';
                    }
                }
                else {
                    currentSection.content += line + '\n';
                }
            }
        });
        return scenario;
    }
}
exports.ScenarioManager = ScenarioManager;
exports.default = ScenarioManager;
