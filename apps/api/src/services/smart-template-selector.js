"use strict";
/**
 * Smart Template Selector Service
 * Phase 2: AI 기반 템플릿 매칭 및 동적 조합 시스템
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.smartTemplateSelector = exports.SmartTemplateSelector = exports.TemplateCategory = void 0;
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
// 템플릿 카테고리 정의
var TemplateCategory;
(function (TemplateCategory) {
    TemplateCategory["CODE_EDITOR"] = "code-editors";
    TemplateCategory["TERMINAL"] = "terminals";
    TemplateCategory["ANIMATION"] = "animations";
    TemplateCategory["CHART"] = "charts";
    TemplateCategory["COMPARISON"] = "comparisons";
    TemplateCategory["PROCESS"] = "processes";
    TemplateCategory["TIMELINE"] = "timelines";
    TemplateCategory["CONCEPT"] = "concepts";
    TemplateCategory["ARCHITECTURE"] = "architecture";
    TemplateCategory["TRANSITION"] = "transitions";
})(TemplateCategory || (exports.TemplateCategory = TemplateCategory = {}));
class SmartTemplateSelector {
    templateRules;
    templateCache;
    templatesDir;
    constructor() {
        this.templatesDir = path_1.default.join(__dirname, '../../../../assets/templates');
        this.templateCache = new Map();
        this.templateRules = this.initializeRules();
    }
    /**
     * 주제별 템플릿 매칭 규칙 초기화
     */
    initializeRules() {
        const rules = new Map();
        // Docker/Container 관련
        rules.set('docker', {
            keywords: ['docker', 'container', 'containerization', 'dockerfile', 'docker-compose'],
            templates: {
                beginner: [
                    'code-editors/dockerfile.svg',
                    'terminals/docker-terminal.svg',
                    'concepts/container-basics.svg'
                ],
                intermediate: [
                    'architecture/containerization.svg',
                    'processes/ci-cd-pipeline.svg',
                    'comparisons/docker-vs-vm.svg'
                ],
                advanced: [
                    'architecture/orchestration.svg',
                    'charts/performance-metrics.svg',
                    'processes/data-pipeline.svg'
                ]
            },
            priority: 10
        });
        // Kubernetes 관련
        rules.set('kubernetes', {
            keywords: ['kubernetes', 'k8s', 'kubectl', 'pods', 'deployment', 'service', 'ingress'],
            templates: {
                beginner: [
                    'code-editors/kubernetes-yaml.svg',
                    'terminals/kubectl-terminal.svg',
                    'concepts/pod-basics.svg'
                ],
                intermediate: [
                    'architecture/k8s-cluster.svg',
                    'processes/deployment-flow.svg',
                    'charts/scaling-metrics.svg'
                ],
                advanced: [
                    'architecture/service-mesh.svg',
                    'terminals/monitoring-commands.svg',
                    'processes/interactive-pipeline.svg'
                ]
            },
            priority: 10
        });
        // React/Frontend 관련
        rules.set('react', {
            keywords: ['react', 'component', 'hooks', 'state', 'props', 'jsx', 'frontend'],
            templates: {
                beginner: [
                    'code-editors/javascript-react.svg',
                    'concepts/component-tree.svg',
                    'animations/fade-in.svg'
                ],
                intermediate: [
                    'processes/state-management.svg',
                    'charts/lifecycle.svg',
                    'code-editors/typescript-advanced.svg'
                ],
                advanced: [
                    'architecture/micro-frontend.svg',
                    'charts/performance.svg',
                    'processes/data-pipeline.svg'
                ]
            },
            priority: 9
        });
        // TypeScript 관련
        rules.set('typescript', {
            keywords: ['typescript', 'types', 'interface', 'generic', 'decorator', 'ts'],
            templates: {
                beginner: [
                    'code-editors/typescript-advanced.svg',
                    'concepts/type-system.svg',
                    'comparisons/js-vs-ts.svg'
                ],
                intermediate: [
                    'code-editors/typescript-advanced.svg',
                    'processes/build-process.svg',
                    'charts/type-coverage.svg'
                ],
                advanced: [
                    'architecture/type-architecture.svg',
                    'code-editors/typescript-advanced.svg',
                    'processes/compilation-flow.svg'
                ]
            },
            priority: 8
        });
        // AWS/Cloud 관련
        rules.set('aws', {
            keywords: ['aws', 'ec2', 's3', 'lambda', 'cloud', 'serverless', 'amazon'],
            templates: {
                beginner: [
                    'terminals/aws-cli.svg',
                    'architecture/cloud-basics.svg',
                    'concepts/serverless.svg'
                ],
                intermediate: [
                    'architecture/vpc-design.svg',
                    'processes/deployment-pipeline.svg',
                    'charts/cost-analysis.svg'
                ],
                advanced: [
                    'architecture/multi-region.svg',
                    'processes/data-pipeline.svg',
                    'terminals/monitoring-commands.svg'
                ]
            },
            priority: 9
        });
        // Terraform/IaC 관련
        rules.set('terraform', {
            keywords: ['terraform', 'infrastructure', 'iac', 'provision', 'hcl'],
            templates: {
                beginner: [
                    'code-editors/terraform-iac.svg',
                    'terminals/terraform-apply.svg',
                    'concepts/iac-basics.svg'
                ],
                intermediate: [
                    'processes/provision-flow.svg',
                    'architecture/infrastructure.svg',
                    'charts/resource-graph.svg'
                ],
                advanced: [
                    'architecture/multi-cloud.svg',
                    'processes/interactive-pipeline.svg',
                    'terminals/terraform-apply.svg'
                ]
            },
            priority: 8
        });
        // Go/Golang 관련
        rules.set('golang', {
            keywords: ['go', 'golang', 'goroutine', 'channel', 'microservice'],
            templates: {
                beginner: [
                    'code-editors/golang-microservice.svg',
                    'concepts/concurrency.svg',
                    'comparisons/go-features.svg'
                ],
                intermediate: [
                    'architecture/microservices.svg',
                    'processes/goroutine-flow.svg',
                    'charts/performance.svg'
                ],
                advanced: [
                    'architecture/distributed-system.svg',
                    'processes/data-pipeline.svg',
                    'code-editors/golang-microservice.svg'
                ]
            },
            priority: 7
        });
        // Python/ML 관련
        rules.set('python', {
            keywords: ['python', 'machine learning', 'ml', 'ai', 'tensorflow', 'pytorch', 'pandas'],
            templates: {
                beginner: [
                    'code-editors/python-ml.svg',
                    'concepts/ml-basics.svg',
                    'charts/data-visualization.svg'
                ],
                intermediate: [
                    'processes/ml-pipeline.svg',
                    'charts/training-metrics.svg',
                    'architecture/ml-architecture.svg'
                ],
                advanced: [
                    'architecture/distributed-training.svg',
                    'processes/data-pipeline.svg',
                    'charts/model-comparison.svg'
                ]
            },
            priority: 8
        });
        // Security 관련
        rules.set('security', {
            keywords: ['security', 'vulnerability', 'audit', 'penetration', 'encryption', 'ssl'],
            templates: {
                beginner: [
                    'terminals/security-audit.svg',
                    'concepts/security-basics.svg',
                    'charts/vulnerability-chart.svg'
                ],
                intermediate: [
                    'processes/security-scan.svg',
                    'architecture/security-layers.svg',
                    'comparisons/encryption-methods.svg'
                ],
                advanced: [
                    'architecture/zero-trust.svg',
                    'processes/incident-response.svg',
                    'terminals/security-audit.svg'
                ]
            },
            priority: 9
        });
        // Database 관련
        rules.set('database', {
            keywords: ['database', 'sql', 'nosql', 'postgresql', 'mongodb', 'redis', 'query'],
            templates: {
                beginner: [
                    'code-editors/sql-query.svg',
                    'concepts/database-basics.svg',
                    'comparisons/sql-vs-nosql.svg'
                ],
                intermediate: [
                    'architecture/database-design.svg',
                    'processes/transaction-flow.svg',
                    'charts/query-performance.svg'
                ],
                advanced: [
                    'architecture/distributed-db.svg',
                    'processes/data-pipeline.svg',
                    'charts/replication-lag.svg'
                ]
            },
            priority: 7
        });
        return rules;
    }
    /**
     * 씬에 대한 최적 템플릿 선택
     */
    async selectTemplatesForScene(scene, topic, userLevel = 'intermediate') {
        // 1. 주제 분석 및 키워드 추출
        const keywords = this.extractKeywords(topic, scene);
        // 2. 매칭되는 규칙 찾기
        const matchedRules = this.findMatchingRules(keywords);
        // 3. 씬 타입에 따른 템플릿 선택
        const composition = await this.composeTemplates(scene, matchedRules, userLevel);
        // 4. 애니메이션 및 트랜지션 추가
        this.enhanceWithAnimations(composition, scene);
        return composition;
    }
    /**
     * 키워드 추출
     */
    extractKeywords(topic, scene) {
        const keywords = [];
        // 주제에서 키워드 추출
        keywords.push(...topic.toLowerCase().split(/\s+/));
        // 씬 제목에서 키워드 추출
        keywords.push(...scene.title.toLowerCase().split(/\s+/));
        // 씬 설명에서 키워드 추출
        if (scene.narration) {
            keywords.push(...scene.narration.toLowerCase().split(/\s+/));
        }
        // 중복 제거
        return [...new Set(keywords)];
    }
    /**
     * 매칭 규칙 찾기
     */
    findMatchingRules(keywords) {
        const matches = [];
        this.templateRules.forEach((rule, key) => {
            let score = 0;
            // 키워드 매칭 점수 계산
            for (const keyword of keywords) {
                if (rule.keywords.some(ruleKeyword => keyword.includes(ruleKeyword) || ruleKeyword.includes(keyword))) {
                    score += rule.priority;
                }
            }
            if (score > 0) {
                matches.push({ rule, score });
            }
        });
        // 점수 기준 정렬
        matches.sort((a, b) => b.score - a.score);
        return matches.map(m => m.rule);
    }
    /**
     * 템플릿 조합 생성
     */
    async composeTemplates(scene, matchedRules, userLevel) {
        const composition = {
            primaryTemplate: '',
            supportingTemplates: [],
            transitions: [],
            animations: [],
            layout: 'single'
        };
        // 씬 타입에 따른 기본 템플릿 선택
        switch (scene.type) {
            case 'intro':
                composition.primaryTemplate = 'concepts/title-slide.svg';
                composition.animations = ['animations/fade-in.svg'];
                composition.layout = 'single';
                break;
            case 'concept':
                if (matchedRules.length > 0) {
                    const templates = matchedRules[0].templates[userLevel];
                    composition.primaryTemplate = templates[0] || 'concepts/concept-basic.svg';
                }
                composition.animations = ['animations/slide-in.svg'];
                composition.layout = 'single';
                break;
            case 'process':
                composition.primaryTemplate = 'processes/interactive-pipeline.svg';
                if (matchedRules.length > 0) {
                    const templates = matchedRules[0].templates[userLevel];
                    composition.supportingTemplates = templates.slice(0, 2);
                }
                composition.layout = 'split';
                break;
            case 'benefits':
                composition.primaryTemplate = 'comparisons/benefits-chart.svg';
                composition.animations = ['animations/bounce.svg'];
                composition.layout = 'grid';
                break;
            case 'example':
                if (matchedRules.length > 0) {
                    const templates = matchedRules[0].templates[userLevel];
                    // 코드 에디터나 터미널 템플릿 우선 선택
                    const codeTemplate = templates.find(t => t.includes('code-editors') || t.includes('terminals'));
                    composition.primaryTemplate = codeTemplate || templates[0];
                }
                composition.layout = 'single';
                break;
            case 'conclusion':
                composition.primaryTemplate = 'concepts/summary-slide.svg';
                composition.animations = ['animations/fade-in.svg'];
                composition.transitions = ['transitions/fade-out.svg'];
                composition.layout = 'single';
                break;
            default:
                composition.primaryTemplate = 'concepts/default.svg';
                composition.layout = 'single';
        }
        // 보조 템플릿 추가 (최대 3개)
        if (matchedRules.length > 1 && composition.supportingTemplates.length < 3) {
            for (let i = 1; i < matchedRules.length && composition.supportingTemplates.length < 3; i++) {
                const templates = matchedRules[i].templates[userLevel];
                if (templates.length > 0) {
                    composition.supportingTemplates.push(templates[0]);
                }
            }
        }
        return composition;
    }
    /**
     * 애니메이션 및 트랜지션 강화
     */
    enhanceWithAnimations(composition, scene) {
        // 씬 애니메이션 추가
        if (scene.animation) {
            switch (scene.animation.type) {
                case 'fadeIn':
                    composition.animations.push('animations/fade-in.svg');
                    break;
                case 'slideIn':
                    composition.animations.push('animations/slide-in.svg');
                    break;
                case 'zoomIn':
                    composition.animations.push('animations/zoom-in.svg');
                    break;
                case 'typewriter':
                    composition.animations.push('animations/typewriter.svg');
                    break;
            }
        }
        // 레이아웃에 따른 트랜지션 추가
        switch (composition.layout) {
            case 'split':
                composition.transitions.push('transitions/split-screen.svg');
                break;
            case 'grid':
                composition.transitions.push('transitions/grid-transition.svg');
                break;
            case 'timeline':
                composition.transitions.push('transitions/timeline-flow.svg');
                break;
            default:
                composition.transitions.push('transitions/smooth.svg');
        }
    }
    /**
     * 템플릿 콘텐츠 로드 (캐싱 포함)
     */
    async loadTemplate(templatePath) {
        // 캐시 확인
        if (this.templateCache.has(templatePath)) {
            return this.templateCache.get(templatePath);
        }
        try {
            const fullPath = path_1.default.join(this.templatesDir, templatePath);
            const content = await promises_1.default.readFile(fullPath, 'utf-8');
            // 캐시 저장
            this.templateCache.set(templatePath, content);
            return content;
        }
        catch (error) {
            console.error(`Failed to load template: ${templatePath}`, error);
            // 기본 템플릿 반환
            return this.getDefaultTemplate();
        }
    }
    /**
     * 기본 템플릿
     */
    getDefaultTemplate() {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
      <rect width="1920" height="1080" fill="#1a1a2e"/>
      <text x="960" y="540" font-family="'Inter', sans-serif" font-size="48" fill="#ffffff" text-anchor="middle">Content</text>
    </svg>`;
    }
    /**
     * 컨텍스트 기반 템플릿 추천
     */
    async recommendTemplates(topic, sceneCount = 6) {
        const recommendations = new Map();
        // 기본 씬 타입들
        const sceneTypes = ['intro', 'concept', 'process', 'benefits', 'example', 'conclusion'];
        for (let i = 0; i < Math.min(sceneCount, sceneTypes.length); i++) {
            const mockScene = {
                id: i + 1,
                type: sceneTypes[i],
                title: `${topic} - ${sceneTypes[i]}`,
                duration: 5,
                narration: `Explaining ${topic} ${sceneTypes[i]}`,
                visualElements: [],
                animation: { type: 'fadeIn', duration: 1 },
                layout: 'single'
            };
            const composition = await this.selectTemplatesForScene(mockScene, topic, 'intermediate');
            recommendations.set(sceneTypes[i], composition);
        }
        return recommendations;
    }
    /**
     * 템플릿 사용 통계
     */
    getTemplateUsageStats() {
        // 실제 구현에서는 데이터베이스에서 통계를 가져옴
        const stats = new Map();
        // 예시 데이터
        stats.set('code-editors/typescript-advanced.svg', 145);
        stats.set('terminals/docker-terminal.svg', 132);
        stats.set('processes/interactive-pipeline.svg', 98);
        stats.set('architecture/microservices.svg', 87);
        stats.set('charts/performance.svg', 76);
        return stats;
    }
}
exports.SmartTemplateSelector = SmartTemplateSelector;
// Export singleton instance
exports.smartTemplateSelector = new SmartTemplateSelector();
