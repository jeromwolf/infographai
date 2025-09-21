"use strict";
/**
 * 고품질 시나리오 템플릿
 * 각 주제별로 최적화된 시나리오 구조 제공
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.scenarioGuidelines = exports.templates = void 0;
exports.evaluateScenarioQuality = evaluateScenarioQuality;
exports.enhanceScenario = enhanceScenario;
// IT 교육용 템플릿
exports.templates = {
    // 1. 개념 설명 템플릿
    conceptExplanation: {
        name: '개념 설명',
        description: 'IT 개념을 체계적으로 설명하는 템플릿',
        category: 'educational',
        targetDuration: 120,
        scenes: [
            {
                type: 'intro',
                duration: 5,
                visualStyle: 'modern-gradient',
                animationPattern: 'fade-in-scale',
                narrationGuideline: '주제 소개와 학습 목표 제시'
            },
            {
                type: 'concept',
                duration: 15,
                visualStyle: 'diagram-centered',
                animationPattern: 'reveal-sequential',
                narrationGuideline: '핵심 개념 정의와 중요성 설명'
            },
            {
                type: 'comparison',
                duration: 20,
                visualStyle: 'split-screen',
                animationPattern: 'slide-compare',
                narrationGuideline: '기존 방법과 새로운 방법 비교'
            },
            {
                type: 'example',
                duration: 25,
                visualStyle: 'code-showcase',
                animationPattern: 'typewriter-effect',
                narrationGuideline: '실제 코드 예제와 설명'
            },
            {
                type: 'process',
                duration: 20,
                visualStyle: 'flowchart',
                animationPattern: 'path-follow',
                narrationGuideline: '동작 원리와 프로세스 설명'
            },
            {
                type: 'conclusion',
                duration: 10,
                visualStyle: 'summary-cards',
                animationPattern: 'fade-in-group',
                narrationGuideline: '핵심 내용 요약과 다음 학습 안내'
            }
        ],
        keywords: ['정의', '개념', '원리', '특징', '장점', '활용']
    },
    // 2. 튜토리얼 템플릿
    stepByStepTutorial: {
        name: '단계별 튜토리얼',
        description: '실습 위주의 단계별 학습 템플릿',
        category: 'tutorial',
        targetDuration: 180,
        scenes: [
            {
                type: 'intro',
                duration: 5,
                visualStyle: 'clean-minimal',
                animationPattern: 'slide-up',
                narrationGuideline: '학습 목표와 필요 사항 안내'
            },
            {
                type: 'process',
                duration: 30,
                visualStyle: 'terminal-view',
                animationPattern: 'typing-animation',
                narrationGuideline: '환경 설정 단계별 안내'
            },
            {
                type: 'example',
                duration: 40,
                visualStyle: 'code-editor',
                animationPattern: 'highlight-lines',
                narrationGuideline: '코드 작성 과정 상세 설명'
            },
            {
                type: 'process',
                duration: 30,
                visualStyle: 'browser-mockup',
                animationPattern: 'interactive-demo',
                narrationGuideline: '실행 결과와 동작 확인'
            },
            {
                type: 'example',
                duration: 25,
                visualStyle: 'debug-view',
                animationPattern: 'problem-solution',
                narrationGuideline: '일반적인 오류와 해결 방법'
            },
            {
                type: 'conclusion',
                duration: 10,
                visualStyle: 'checklist',
                animationPattern: 'check-animation',
                narrationGuideline: '학습 내용 정리와 추가 자료'
            }
        ],
        keywords: ['설치', '설정', '실습', '코드', '실행', '디버깅']
    },
    // 3. 아키텍처 설명 템플릿
    systemArchitecture: {
        name: '시스템 아키텍처',
        description: '복잡한 시스템 구조를 시각적으로 설명',
        category: 'architecture',
        targetDuration: 150,
        scenes: [
            {
                type: 'intro',
                duration: 5,
                visualStyle: 'blueprint',
                animationPattern: 'zoom-out',
                narrationGuideline: '시스템 개요와 목적'
            },
            {
                type: 'concept',
                duration: 20,
                visualStyle: 'layered-diagram',
                animationPattern: 'layer-reveal',
                narrationGuideline: '전체 아키텍처 구조 소개'
            },
            {
                type: 'process',
                duration: 30,
                visualStyle: 'component-focus',
                animationPattern: 'zoom-in-component',
                narrationGuideline: '각 컴포넌트 역할과 기능'
            },
            {
                type: 'process',
                duration: 25,
                visualStyle: 'data-flow',
                animationPattern: 'flow-animation',
                narrationGuideline: '데이터 흐름과 통신 과정'
            },
            {
                type: 'comparison',
                duration: 20,
                visualStyle: 'metrics-dashboard',
                animationPattern: 'chart-animation',
                narrationGuideline: '성능 지표와 장단점 분석'
            },
            {
                type: 'example',
                duration: 15,
                visualStyle: 'use-case',
                animationPattern: 'scenario-play',
                narrationGuideline: '실제 사용 사례'
            },
            {
                type: 'conclusion',
                duration: 10,
                visualStyle: 'summary-infographic',
                animationPattern: 'assemble-animation',
                narrationGuideline: '핵심 특징 요약'
            }
        ],
        keywords: ['구조', '컴포넌트', '통신', '데이터', '성능', '확장성']
    },
    // 4. 기술 비교 템플릿
    techComparison: {
        name: '기술 비교',
        description: '여러 기술/프레임워크 비교 분석',
        category: 'comparison',
        targetDuration: 120,
        scenes: [
            {
                type: 'intro',
                duration: 5,
                visualStyle: 'versus-screen',
                animationPattern: 'split-reveal',
                narrationGuideline: '비교 대상 소개'
            },
            {
                type: 'concept',
                duration: 15,
                visualStyle: 'feature-matrix',
                animationPattern: 'grid-fill',
                narrationGuideline: '각 기술의 핵심 특징'
            },
            {
                type: 'comparison',
                duration: 25,
                visualStyle: 'side-by-side',
                animationPattern: 'toggle-view',
                narrationGuideline: '구체적인 차이점 비교'
            },
            {
                type: 'example',
                duration: 20,
                visualStyle: 'code-diff',
                animationPattern: 'diff-highlight',
                narrationGuideline: '코드 레벨 비교'
            },
            {
                type: 'comparison',
                duration: 20,
                visualStyle: 'benchmark-chart',
                animationPattern: 'bar-race',
                narrationGuideline: '성능 벤치마크'
            },
            {
                type: 'process',
                duration: 15,
                visualStyle: 'decision-tree',
                animationPattern: 'path-selection',
                narrationGuideline: '선택 가이드라인'
            },
            {
                type: 'conclusion',
                duration: 10,
                visualStyle: 'recommendation',
                animationPattern: 'star-rating',
                narrationGuideline: '추천 사항과 결론'
            }
        ],
        keywords: ['비교', '차이점', '장단점', '성능', '선택', '추천']
    }
};
// 시나리오 생성 가이드라인
exports.scenarioGuidelines = {
    // 좋은 시나리오의 특징
    bestPractices: [
        '명확한 학습 목표 설정',
        '단계적 난이도 상승',
        '실제 예제 활용',
        '시각적 요소와 나레이션 조화',
        '적절한 속도와 리듬',
        '핵심 내용 반복 강조'
    ],
    // 씬별 추천 길이
    sceneDuration: {
        intro: { min: 3, max: 7, optimal: 5 },
        concept: { min: 10, max: 30, optimal: 20 },
        example: { min: 15, max: 40, optimal: 25 },
        process: { min: 15, max: 35, optimal: 25 },
        comparison: { min: 15, max: 30, optimal: 20 },
        conclusion: { min: 5, max: 15, optimal: 10 }
    },
    // 시각적 스타일 가이드
    visualStyles: {
        'modern-gradient': {
            colors: ['#667eea', '#764ba2'],
            fonts: ['Inter', 'Pretendard'],
            animations: ['fade', 'scale', 'slide']
        },
        'code-showcase': {
            theme: 'monokai',
            fontSize: 18,
            lineHeight: 1.6,
            highlights: true
        },
        'diagram-centered': {
            layout: 'hierarchical',
            nodeStyle: 'rounded',
            connectionStyle: 'curved'
        }
    },
    // 나레이션 작성 팁
    narrationTips: {
        intro: '흥미 유발, 학습 동기 부여',
        concept: '명확한 정의, 쉬운 비유 사용',
        example: '구체적 설명, 실습 가능한 내용',
        process: '순차적 설명, 인과관계 명확히',
        comparison: '객관적 비교, 균형잡힌 시각',
        conclusion: '핵심 요약, 다음 단계 제시'
    }
};
// 시나리오 품질 평가 함수
function evaluateScenarioQuality(scenario) {
    let score = 0;
    const feedback = [];
    const improvements = [];
    // 1. 구조 평가 (30점)
    if (scenario.scenes?.length >= 4) {
        score += 10;
        feedback.push('✅ 충분한 씬 구성');
    }
    else {
        improvements.push('더 많은 씬을 추가하세요 (최소 4개 권장)');
    }
    if (scenario.scenes?.some((s) => s.type === 'intro') &&
        scenario.scenes?.some((s) => s.type === 'conclusion')) {
        score += 10;
        feedback.push('✅ 도입부와 결론 포함');
    }
    else {
        improvements.push('도입부와 결론을 추가하세요');
    }
    const totalDuration = scenario.scenes?.reduce((sum, s) => sum + (s.duration || 0), 0) || 0;
    if (totalDuration >= 60 && totalDuration <= 300) {
        score += 10;
        feedback.push('✅ 적절한 전체 길이');
    }
    else {
        improvements.push(`전체 길이를 60-300초 사이로 조정하세요 (현재: ${totalDuration}초)`);
    }
    // 2. 내용 평가 (40점)
    const hasNarration = scenario.scenes?.every((s) => s.narration && s.narration.length > 10);
    if (hasNarration) {
        score += 20;
        feedback.push('✅ 모든 씬에 나레이션 포함');
    }
    else {
        improvements.push('모든 씬에 충분한 나레이션을 추가하세요');
    }
    const hasVisuals = scenario.scenes?.every((s) => s.title || s.visuals);
    if (hasVisuals) {
        score += 20;
        feedback.push('✅ 시각적 요소 포함');
    }
    else {
        improvements.push('각 씬에 시각적 요소를 추가하세요');
    }
    // 3. 다양성 평가 (30점)
    const sceneTypes = new Set(scenario.scenes?.map((s) => s.type));
    if (sceneTypes.size >= 3) {
        score += 15;
        feedback.push('✅ 다양한 씬 타입 사용');
    }
    else {
        improvements.push('더 다양한 씬 타입을 사용하세요');
    }
    const avgDuration = totalDuration / (scenario.scenes?.length || 1);
    if (avgDuration >= 10 && avgDuration <= 30) {
        score += 15;
        feedback.push('✅ 균형잡힌 씬 길이');
    }
    else {
        improvements.push('각 씬의 길이를 10-30초 사이로 조정하세요');
    }
    return {
        score,
        feedback,
        improvements
    };
}
// 시나리오 자동 개선 함수
function enhanceScenario(scenario, template) {
    const selectedTemplate = template ? exports.templates[template] : exports.templates.conceptExplanation;
    // 기본 구조가 없으면 템플릿 기반으로 생성
    if (!scenario.scenes || scenario.scenes.length === 0) {
        return {
            ...scenario,
            scenes: selectedTemplate.scenes.map((scene, index) => ({
                id: `scene_${index}`,
                ...scene,
                narration: `${scene.narrationGuideline}를 여기에 작성하세요`,
                title: `Scene ${index + 1}`
            }))
        };
    }
    // 기존 시나리오 개선
    const enhancedScenes = scenario.scenes.map((scene, index) => {
        const templateScene = selectedTemplate.scenes[index] || selectedTemplate.scenes[0];
        return {
            ...scene,
            // 누락된 필드 보완
            type: scene.type || templateScene.type,
            duration: scene.duration || templateScene.duration,
            visualStyle: scene.visualStyle || templateScene.visualStyle,
            animationPattern: scene.animationPattern || templateScene.animationPattern,
            // 나레이션 개선
            narration: scene.narration || templateScene.narrationGuideline,
            // 시각적 요소 추가
            visuals: scene.visuals || {
                background: templateScene.visualStyle,
                animation: templateScene.animationPattern
            }
        };
    });
    return {
        ...scenario,
        scenes: enhancedScenes,
        quality: evaluateScenarioQuality({ ...scenario, scenes: enhancedScenes })
    };
}
