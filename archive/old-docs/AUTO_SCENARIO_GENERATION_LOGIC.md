# 자동 시나리오 생성 로직 개발

## 🎯 목표
사용자가 **토픽명 하나만 입력**하면 자동으로 **완성된 30초 교육용 비디오 시나리오**를 생성하는 시스템 개발

---

## 📊 현재 상황 분석

### 기존 시나리오 생성 플로우
```typescript
// apps/api/src/routes/scenarios.ts - 현재 시나리오 생성
POST /scenarios {
  "type": "auto",
  "generationOptions": {
    "topic": "RAG",
    "duration": 30,
    "targetAudience": "개발자",
    "language": "ko"
  }
}
↓
scenarioManager.generateScenario(generationOptions, userId)
```

### 문제점
1. **ScenarioManager 미구현**: `@infographai/scenario-manager` 패키지 없음
2. **복잡한 입력**: duration, targetAudience 등 많은 필드 필요
3. **일관성 부족**: 매번 다른 결과 생성 가능성

---

## 🧠 자동 생성 로직 설계

### 1. 토픽 분석 시스템

#### TopicAnalyzer 클래스
```typescript
interface TopicAnalysis {
  category: ITCategory;
  difficulty: 'basic' | 'intermediate' | 'advanced';
  keywords: string[];
  suggestedDuration: number;
  sceneStructure: SceneTemplate[];
}

class TopicAnalyzer {
  analyze(topic: string): TopicAnalysis {
    // 1. 카테고리 분류
    const category = this.classifyTopic(topic);
    
    // 2. 난이도 추정 
    const difficulty = this.estimateDifficulty(topic);
    
    // 3. 키워드 추출
    const keywords = this.extractKeywords(topic);
    
    // 4. 적절한 시나리오 구조 선택
    const sceneStructure = this.selectSceneStructure(category, difficulty);
    
    return { category, difficulty, keywords, sceneStructure };
  }

  private classifyTopic(topic: string): ITCategory {
    const categoryPatterns = {
      'AI_ML': [
        'RAG', 'LLM', 'GPT', 'machine learning', 'deep learning', 
        '머신러닝', '딥러닝', '인공지능', 'AI', '신경망'
      ],
      'BACKEND': [
        'API', 'REST', 'GraphQL', 'server', 'backend',
        '서버', '백엔드', 'database', '데이터베이스', 'SQL'
      ],
      'DEVOPS': [
        'Docker', 'Kubernetes', 'CI/CD', 'deployment',
        '도커', '쿠버네티스', '배포', 'AWS', 'cloud'
      ],
      'FRONTEND': [
        'React', 'Vue', 'Angular', 'frontend', 'UI/UX',
        '프론트엔드', 'JavaScript', 'TypeScript'
      ],
      'DATA': [
        'data', 'analytics', 'visualization', 'dashboard',
        '데이터', '분석', '시각화', '대시보드'
      ]
    };

    // 키워드 매칭으로 카테고리 분류
    for (const [category, patterns] of Object.entries(categoryPatterns)) {
      for (const pattern of patterns) {
        if (topic.toLowerCase().includes(pattern.toLowerCase())) {
          return category as ITCategory;
        }
      }
    }
    
    return 'GENERAL'; // 기본 카테고리
  }
}
```

### 2. 시나리오 템플릿 시스템

#### 카테고리별 시나리오 구조
```typescript
const sceneTemplates = {
  AI_ML: {
    basic: [
      {
        type: 'intro',
        duration: 4,
        template: '{topic} 소개',
        contentPattern: '{topic}은 {키워드1}을 활용한 {기술분야} 기술입니다.',
        visualStyle: 'concept-introduction'
      },
      {
        type: 'definition', 
        duration: 6,
        template: '{topic}란 무엇인가?',
        contentPattern: '{topic}의 핵심은 {핵심개념}입니다. {상세설명}',
        visualStyle: 'definition-explanation'
      },
      {
        type: 'process',
        duration: 7,
        template: '{topic} 작동 과정',
        contentPattern: '{단계1} → {단계2} → {단계3} 순서로 진행됩니다.',
        visualStyle: 'step-by-step'
      },
      {
        type: 'benefits',
        duration: 5,
        template: '{topic}의 장점',
        contentPattern: '{장점1}, {장점2}, {장점3} 등의 이점이 있습니다.',
        visualStyle: 'benefits-showcase'
      },
      {
        type: 'example',
        duration: 5,
        template: '실제 활용 사례',
        contentPattern: '{회사/서비스}에서 {활용방법}으로 사용되고 있습니다.',
        visualStyle: 'real-example'
      },
      {
        type: 'conclusion',
        duration: 3,
        template: '정리',
        contentPattern: '{topic}을 통해 {결과/효과}를 얻을 수 있습니다.',
        visualStyle: 'summary'
      }
    ]
  },
  
  BACKEND: {
    basic: [
      {
        type: 'intro',
        duration: 4,
        template: '{topic} 개요',
        contentPattern: '{topic}은 {목적}을 위한 백엔드 기술입니다.',
        visualStyle: 'tech-introduction'
      },
      {
        type: 'problem',
        duration: 5,
        template: '해결하는 문제',
        contentPattern: 기존에는 {문제상황}이었지만, {topic}으로 해결할 수 있습니다.',
        visualStyle: 'problem-solution'
      },
      {
        type: 'architecture',
        duration: 8,
        template: '{topic} 구조',
        contentPattern: '{컴포넌트1}, {컴포넌트2}, {컴포넌트3}로 구성됩니다.',
        visualStyle: 'architecture-diagram'
      },
      {
        type: 'implementation',
        duration: 8,
        template: '구현 방법',
        contentPattern: '{언어/프레임워크}를 사용해서 {구현과정}합니다.',
        visualStyle: 'code-example'
      },
      {
        type: 'best-practices',
        duration: 3,
        template: '모범 사례',
        contentPattern: '{주의사항}을 고려하여 {권장방법}으로 사용하세요.',
        visualStyle: 'tips-highlight'
      },
      {
        type: 'conclusion',
        duration: 2,
        template: '마무리',
        contentPattern: '{topic}을 활용해 {목표달성}하시기 바랍니다.',
        visualStyle: 'call-to-action'
      }
    ]
  }
  
  // DEVOPS, FRONTEND, DATA 카테고리도 동일하게...
};
```

### 3. 콘텐츠 생성기

#### ContentGenerator 클래스
```typescript
class ContentGenerator {
  async generateSceneContent(
    topic: string,
    sceneTemplate: SceneTemplate,
    context: TopicAnalysis
  ): Promise<SceneContent> {
    
    // 1. 템플릿 기반 제목 생성
    const title = this.generateTitle(topic, sceneTemplate);
    
    // 2. 자동 내용 생성 (규칙 기반 + OpenAI)
    const content = await this.generateContent(topic, sceneTemplate, context);
    
    // 3. 시각적 요소 선택
    const visual = this.selectVisualElements(sceneTemplate.visualStyle, context);
    
    return { title, content, visual };
  }

  private async generateContent(
    topic: string,
    template: SceneTemplate,
    context: TopicAnalysis
  ): Promise<string> {
    
    // 규칙 기반 생성 (빠르고 일관성 있음)
    if (this.hasRuleBasedPattern(topic, template.type)) {
      return this.generateByRules(topic, template, context);
    }
    
    // OpenAI 기반 생성 (창의적이지만 느림)
    if (process.env.OPENAI_API_KEY) {
      try {
        return await this.generateByOpenAI(topic, template, context);
      } catch {
        // fallback to rules
      }
    }
    
    // 기본 템플릿 사용
    return this.generateByTemplate(topic, template);
  }

  private generateByRules(
    topic: string,
    template: SceneTemplate,
    context: TopicAnalysis
  ): string {
    const rulePatterns = {
      'RAG': {
        'definition': 'RAG(Retrieval-Augmented Generation)은 검색과 생성을 결합한 AI 기술입니다.',
        'process': '문서 임베딩 → 유사도 검색 → 컨텍스트 증강 → 답변 생성 단계로 작동합니다.',
        'benefits': '정확성 향상, 최신 정보 활용, 환각 현상 감소 등의 장점이 있습니다.'
      },
      'Docker': {
        'definition': 'Docker는 애플리케이션을 컨테이너로 패키징하는 플랫폼입니다.',
        'process': '이미지 빌드 → 컨테이너 실행 → 포트 바인딩 → 볼륨 마운트 순으로 진행됩니다.',
        'benefits': '환경 일관성, 빠른 배포, 리소스 효율성 등의 이점을 제공합니다.'
      }
      // 더 많은 토픽과 패턴들...
    };

    const patterns = rulePatterns[topic];
    if (patterns && patterns[template.type]) {
      return patterns[template.type];
    }

    // 패턴이 없으면 템플릿 기본값 사용
    return template.contentPattern
      .replace('{topic}', topic)
      .replace('{키워드1}', context.keywords[0] || '핵심 기술');
  }
}
```

### 4. 자동 스타일링 시스템

#### StyleSelector 클래스
```typescript
class StyleSelector {
  selectSceneStyle(
    sceneType: string,
    category: ITCategory,
    sceneIndex: number,
    totalScenes: number
  ): SceneStyle {
    
    // 카테고리별 색상 팔레트
    const colorPalettes = {
      'AI_ML': ['#667eea', '#764ba2', '#f093fb'],
      'BACKEND': ['#5f72bd', '#9921e8', '#667eea'],
      'DEVOPS': ['#2c3e50', '#3498db', '#1abc9c'],
      'FRONTEND': ['#ff6b6b', '#4ecdc4', '#45b7d1'],
      'DATA': ['#96ceb4', '#ffeaa7', '#fab1a0']
    };

    // 시나리오 전체에서 조화로운 색상 선택
    const palette = colorPalettes[category] || colorPalettes['AI_ML'];
    const colorIndex = Math.floor((sceneIndex / totalScenes) * palette.length);
    
    return {
      backgroundColor: palette[colorIndex],
      textColor: '#ffffff',
      accentColor: palette[(colorIndex + 1) % palette.length],
      animation: this.selectAnimation(sceneType),
      infographic: this.selectInfographic(sceneType)
    };
  }

  private selectAnimation(sceneType: string): AnimationType {
    const animationMap = {
      'intro': 'fadeInScale',
      'definition': 'slideFromLeft',
      'process': 'sequentialReveal', 
      'benefits': 'popIn',
      'example': 'typewriter',
      'conclusion': 'fadeOut'
    };
    
    return animationMap[sceneType] || 'fadeIn';
  }

  private selectInfographic(sceneType: string): InfographicType {
    const infographicMap = {
      'process': 'step-flow',
      'benefits': 'icon-list',
      'architecture': 'diagram',
      'comparison': 'side-by-side',
      'example': 'code-snippet'
    };
    
    return infographicMap[sceneType] || 'simple-icon';
  }
}
```

---

## 🚀 통합 자동 생성 서비스

### AutoScenarioGenerator 클래스
```typescript
export class AutoScenarioGenerator {
  private topicAnalyzer = new TopicAnalyzer();
  private contentGenerator = new ContentGenerator();
  private styleSelector = new StyleSelector();

  async generateFromTopic(topic: string, userId: string): Promise<GeneratedScenario> {
    console.log(`[AutoGen] Starting scenario generation for topic: ${topic}`);

    // 1. 토픽 분석
    const analysis = this.topicAnalyzer.analyze(topic);
    console.log(`[AutoGen] Topic analysis:`, analysis);

    // 2. 시나리오 구조 생성
    const sceneTemplates = analysis.sceneStructure;
    
    // 3. 각 씬의 콘텐츠 생성
    const scenes = [];
    for (let i = 0; i < sceneTemplates.length; i++) {
      const template = sceneTemplates[i];
      
      // 내용 생성
      const content = await this.contentGenerator.generateSceneContent(
        topic, template, analysis
      );
      
      // 스타일 선택
      const style = this.styleSelector.selectSceneStyle(
        template.type, analysis.category, i, sceneTemplates.length
      );
      
      // 씬 완성
      scenes.push({
        id: `scene_${i}`,
        type: template.type,
        duration: template.duration,
        title: content.title,
        narration: content.content,
        style: style
      });
    }

    // 4. 최종 시나리오 생성
    const totalDuration = scenes.reduce((sum, scene) => sum + scene.duration, 0);
    
    return {
      id: `scenario_${Date.now()}`,
      title: `${topic} 완전 가이드`,
      description: `${topic}에 대한 포괄적인 교육용 비디오`,
      scenes,
      totalDuration,
      sceneCount: scenes.length,
      metadata: {
        generatedBy: 'auto',
        category: analysis.category,
        difficulty: analysis.difficulty,
        keywords: analysis.keywords,
        generatedAt: new Date().toISOString(),
        userId
      }
    };
  }
}
```

### API 연동
```typescript
// apps/api/src/routes/scenarios.ts 수정
import { AutoScenarioGenerator } from '../services/auto-scenario-generator';

const autoGenerator = new AutoScenarioGenerator();

// 기존 scenarioManager.generateScenario 대체
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  // ... 기존 코드 ...

  switch (type) {
    case 'auto':
      // 새로운 자동 생성 로직
      const generatedScenario = await autoGenerator.generateFromTopic(
        generationOptions.topic,
        userId
      );
      scenario = generatedScenario;
      break;
    
    // ... 기존 코드 ...
  }
});
```

---

## 🎯 테스트 시나리오

### 기본 토픽 테스트
```typescript
const testTopics = [
  'RAG',                    // AI_ML 카테고리
  'Docker',                 // DEVOPS 카테고리  
  'REST API',              // BACKEND 카테고리
  'React Hooks',           // FRONTEND 카테고리
  '데이터 시각화',          // DATA 카테고리
];

// 각 토픽별로 30초 시나리오 자동 생성 테스트
for (const topic of testTopics) {
  const scenario = await autoGenerator.generateFromTopic(topic, 'test-user');
  console.log(`Generated scenario for ${topic}:`, scenario.scenes.length, 'scenes');
}
```

### 품질 검증 기준
1. **일관성**: 같은 토픽은 항상 같은 구조
2. **완성도**: 모든 씬에 의미 있는 내용
3. **시간**: 정확히 30초 (±2초)
4. **가독성**: 한 눈에 이해 가능한 텍스트

---

## 📈 성능 목표

### 생성 속도
- **목표**: 토픽 입력 → 완성된 시나리오 생성까지 **3초 이내**
- **OpenAI 사용시**: 5초 이내
- **규칙 기반만**: 1초 이내

### 품질 지표
- **완성률**: 100% (빈 씬 없음)
- **일관성**: 동일 토픽 반복 생성시 95% 유사도
- **사용자 만족도**: Phase 1에서 80% 이상

---

**다음 단계**: 기본 인포그래픽 컴포넌트 라이브러리 구축