import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// IT 카테고리 타입
type ITCategory = 'AI_ML' | 'BACKEND' | 'DEVOPS' | 'FRONTEND' | 'DATA' | 'GENERAL';

// 토픽 분석 결과 인터페이스
interface TopicAnalysis {
  category: ITCategory;
  difficulty: 'basic' | 'intermediate' | 'advanced';
  keywords: string[];
  suggestedDuration: number;
  sceneStructure: SceneTemplate[];
}

// 씬 템플릿 인터페이스
interface SceneTemplate {
  type: string;
  duration: number;
  template: string;
  contentPattern: string;
  visualStyle: string;
}

// 생성된 씬 인터페이스
interface GeneratedScene {
  id: string;
  type: string;
  duration: number;
  title: string;
  narration: string;
  style: SceneStyle;
}

// 씬 스타일 인터페이스
interface SceneStyle {
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  animation: string;
  infographic: string;
}

// 생성된 시나리오 인터페이스
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

// 토픽 분석기 클래스
class TopicAnalyzer {
  analyze(topic: string): TopicAnalysis {
    const category = this.classifyTopic(topic);
    const difficulty = this.estimateDifficulty(topic);
    const keywords = this.extractKeywords(topic);
    const sceneStructure = this.selectSceneStructure(category, difficulty);
    const suggestedDuration = sceneStructure.reduce((sum, scene) => sum + scene.duration, 0);
    
    return { category, difficulty, keywords, suggestedDuration, sceneStructure };
  }

  private classifyTopic(topic: string): ITCategory {
    const categoryPatterns = {
      'AI_ML': [
        'RAG', 'LLM', 'GPT', 'machine learning', 'deep learning', 
        '머신러닝', '딥러닝', '인공지능', 'AI', '신경망', 'neural',
        'transformer', 'bert', 'embedding', '임베딩'
      ],
      'BACKEND': [
        'API', 'REST', 'GraphQL', 'server', 'backend',
        '서버', '백엔드', 'database', '데이터베이스', 'SQL',
        'NoSQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis'
      ],
      'DEVOPS': [
        'Docker', 'Kubernetes', 'CI/CD', 'deployment',
        '도커', '쿠버네티스', '배포', 'AWS', 'cloud',
        'Jenkins', 'GitLab', 'GitHub Actions', 'terraform'
      ],
      'FRONTEND': [
        'React', 'Vue', 'Angular', 'frontend', 'UI/UX',
        '프론트엔드', 'JavaScript', 'TypeScript', 'CSS',
        'HTML', 'webpack', 'Next.js', 'Nuxt'
      ],
      'DATA': [
        'data', 'analytics', 'visualization', 'dashboard',
        '데이터', '분석', '시각화', '대시보드', 'ETL',
        'pandas', 'numpy', 'matplotlib', 'tableau'
      ]
    };

    for (const [category, patterns] of Object.entries(categoryPatterns)) {
      for (const pattern of patterns) {
        if (topic.toLowerCase().includes(pattern.toLowerCase())) {
          return category as ITCategory;
        }
      }
    }
    
    return 'GENERAL';
  }

  private estimateDifficulty(topic: string): 'basic' | 'intermediate' | 'advanced' {
    const advancedKeywords = ['advanced', 'optimization', 'architecture', '고급', '최적화', '아키텍처'];
    const basicKeywords = ['introduction', 'basic', 'beginner', '입문', '기초', '초보'];
    
    const lowerTopic = topic.toLowerCase();
    
    if (advancedKeywords.some(keyword => lowerTopic.includes(keyword))) {
      return 'advanced';
    }
    if (basicKeywords.some(keyword => lowerTopic.includes(keyword))) {
      return 'basic';
    }
    
    return 'intermediate';
  }

  private extractKeywords(topic: string): string[] {
    // 간단한 키워드 추출 로직
    const words = topic.split(/\s+/);
    const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for'];
    
    return words
      .filter(word => word.length > 2)
      .filter(word => !stopWords.includes(word.toLowerCase()))
      .map(word => word.toLowerCase());
  }

  private selectSceneStructure(category: ITCategory, difficulty: 'basic' | 'intermediate' | 'advanced'): SceneTemplate[] {
    const sceneTemplates = {
      'AI_ML': {
        'basic': [
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
      'BACKEND': {
        'basic': [
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
            contentPattern: '기존에는 {문제상황}이었지만, {topic}으로 해결할 수 있습니다.',
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
      },
      'DEVOPS': {
        'basic': [
          {
            type: 'intro',
            duration: 4,
            template: '{topic} 소개',
            contentPattern: '{topic}은 {목적}을 위한 DevOps 도구입니다.',
            visualStyle: 'tool-introduction'
          },
          {
            type: 'concept',
            duration: 5,
            template: '핵심 개념',
            contentPattern: '{topic}의 핵심 개념은 {개념1}, {개념2}입니다.',
            visualStyle: 'concept-overview'
          },
          {
            type: 'workflow',
            duration: 8,
            template: '워크플로우',
            contentPattern: '{단계1} → {단계2} → {단계3} 순서로 진행됩니다.',
            visualStyle: 'workflow-diagram'
          },
          {
            type: 'setup',
            duration: 7,
            template: '설정 방법',
            contentPattern: '{설치명령}을 실행하고 {설정파일}을 구성합니다.',
            visualStyle: 'setup-guide'
          },
          {
            type: 'monitoring',
            duration: 4,
            template: '모니터링',
            contentPattern: '{메트릭1}, {메트릭2}를 모니터링하여 {효과}를 확인합니다.',
            visualStyle: 'monitoring-dashboard'
          },
          {
            type: 'conclusion',
            duration: 2,
            template: '정리',
            contentPattern: '{topic}으로 {목표}를 달성할 수 있습니다.',
            visualStyle: 'summary'
          }
        ]
      },
      'FRONTEND': {
        'basic': [
          {
            type: 'intro',
            duration: 4,
            template: '{topic} 소개',
            contentPattern: '{topic}은 {목적}을 위한 프론트엔드 기술입니다.',
            visualStyle: 'framework-introduction'
          },
          {
            type: 'features',
            duration: 6,
            template: '주요 기능',
            contentPattern: '{기능1}, {기능2}, {기능3} 등의 기능을 제공합니다.',
            visualStyle: 'feature-showcase'
          },
          {
            type: 'component',
            duration: 7,
            template: '컴포넌트 구조',
            contentPattern: '{컴포넌트1}, {컴포넌트2}로 구성되어 있습니다.',
            visualStyle: 'component-tree'
          },
          {
            type: 'state',
            duration: 6,
            template: '상태 관리',
            contentPattern: '{상태관리방식}을 통해 {데이터흐름}을 관리합니다.',
            visualStyle: 'state-flow'
          },
          {
            type: 'performance',
            duration: 4,
            template: '성능 최적화',
            contentPattern: '{최적화기법}을 사용하여 {성능향상}을 달성합니다.',
            visualStyle: 'performance-metrics'
          },
          {
            type: 'conclusion',
            duration: 3,
            template: '마무리',
            contentPattern: '{topic}을 통해 {목표}를 구현할 수 있습니다.',
            visualStyle: 'summary'
          }
        ]
      },
      'DATA': {
        'basic': [
          {
            type: 'intro',
            duration: 4,
            template: '{topic} 소개',
            contentPattern: '{topic}은 {목적}을 위한 데이터 기술입니다.',
            visualStyle: 'data-introduction'
          },
          {
            type: 'collection',
            duration: 5,
            template: '데이터 수집',
            contentPattern: '{소스1}, {소스2}에서 데이터를 수집합니다.',
            visualStyle: 'data-sources'
          },
          {
            type: 'processing',
            duration: 7,
            template: '데이터 처리',
            contentPattern: '{처리방법}을 통해 {변환과정}을 수행합니다.',
            visualStyle: 'data-pipeline'
          },
          {
            type: 'analysis',
            duration: 7,
            template: '분석 방법',
            contentPattern: '{분석기법}을 사용하여 {인사이트}를 도출합니다.',
            visualStyle: 'analysis-chart'
          },
          {
            type: 'visualization',
            duration: 5,
            template: '시각화',
            contentPattern: '{차트유형}을 통해 {결과}를 표현합니다.',
            visualStyle: 'visualization-examples'
          },
          {
            type: 'conclusion',
            duration: 2,
            template: '정리',
            contentPattern: '{topic}을 통해 {비즈니스가치}를 창출할 수 있습니다.',
            visualStyle: 'summary'
          }
        ]
      },
      'GENERAL': {
        'basic': [
          {
            type: 'intro',
            duration: 5,
            template: '{topic} 소개',
            contentPattern: '{topic}에 대해 알아보겠습니다.',
            visualStyle: 'general-introduction'
          },
          {
            type: 'overview',
            duration: 6,
            template: '개요',
            contentPattern: '{topic}의 주요 내용을 살펴보겠습니다.',
            visualStyle: 'overview'
          },
          {
            type: 'details',
            duration: 8,
            template: '상세 내용',
            contentPattern: '{내용1}, {내용2}, {내용3}를 설명합니다.',
            visualStyle: 'detailed-content'
          },
          {
            type: 'applications',
            duration: 6,
            template: '활용 방안',
            contentPattern: '{활용1}, {활용2} 등으로 활용할 수 있습니다.',
            visualStyle: 'application-examples'
          },
          {
            type: 'conclusion',
            duration: 5,
            template: '정리',
            contentPattern: '{topic}에 대해 알아보았습니다.',
            visualStyle: 'summary'
          }
        ]
      }
    };

    // 카테고리와 난이도에 해당하는 템플릿이 없으면 기본값 사용
    const categoryTemplates = sceneTemplates[category] || sceneTemplates['GENERAL'];
    return categoryTemplates[difficulty] || categoryTemplates['basic'];
  }
}

// 콘텐츠 생성기 클래스
class ContentGenerator {
  async generateSceneContent(
    topic: string,
    sceneTemplate: SceneTemplate,
    context: TopicAnalysis
  ): Promise<{ title: string; content: string; visual: any }> {
    const title = this.generateTitle(topic, sceneTemplate);
    const content = await this.generateContent(topic, sceneTemplate, context);
    const visual = this.selectVisualElements(sceneTemplate.visualStyle, context);
    
    return { title, content, visual };
  }

  private generateTitle(topic: string, sceneTemplate: SceneTemplate): string {
    return sceneTemplate.template.replace('{topic}', topic);
  }

  private async generateContent(
    topic: string,
    template: SceneTemplate,
    context: TopicAnalysis
  ): Promise<string> {
    // 규칙 기반 생성
    if (this.hasRuleBasedPattern(topic, template.type)) {
      return this.generateByRules(topic, template, context);
    }
    
    // 기본 템플릿 사용
    return this.generateByTemplate(topic, template, context);
  }

  private hasRuleBasedPattern(topic: string, type: string): boolean {
    const rulePatterns = {
      'RAG': ['definition', 'process', 'benefits'],
      'Docker': ['definition', 'process', 'benefits'],
      'REST API': ['definition', 'architecture', 'implementation'],
      'React': ['features', 'component', 'state'],
      'Kubernetes': ['concept', 'workflow', 'setup']
    };
    
    return rulePatterns[topic]?.includes(type) || false;
  }

  private generateByRules(
    topic: string,
    template: SceneTemplate,
    context: TopicAnalysis
  ): string {
    const rulePatterns = {
      'RAG': {
        'definition': 'RAG(Retrieval-Augmented Generation)은 검색과 생성을 결합한 AI 기술입니다. 외부 지식을 활용하여 더 정확하고 최신의 답변을 생성할 수 있습니다.',
        'process': '문서 임베딩 → 벡터 데이터베이스 저장 → 유사도 검색 → 컨텍스트 증강 → LLM 답변 생성 단계로 작동합니다.',
        'benefits': '정확성 향상, 최신 정보 활용, 환각 현상 감소, 도메인 특화 지식 활용 등의 장점이 있습니다.'
      },
      'Docker': {
        'definition': 'Docker는 애플리케이션을 컨테이너로 패키징하는 플랫폼입니다. 어디서나 동일한 환경으로 실행할 수 있습니다.',
        'process': 'Dockerfile 작성 → 이미지 빌드 → 컨테이너 실행 → 포트 바인딩 → 볼륨 마운트 순으로 진행됩니다.',
        'benefits': '환경 일관성, 빠른 배포, 리소스 효율성, 확장성 등의 이점을 제공합니다.'
      },
      'REST API': {
        'definition': 'REST API는 웹 서비스 간 통신을 위한 아키텍처 스타일입니다. HTTP 프로토콜을 기반으로 리소스를 관리합니다.',
        'architecture': 'Client → HTTP Request → Server → Database → Response → Client 구조로 구성됩니다.',
        'implementation': 'Express.js, Spring Boot, Django 등의 프레임워크를 사용하여 엔드포인트를 구현합니다.'
      },
      'React': {
        'features': '컴포넌트 기반 구조, Virtual DOM, 단방향 데이터 플로우, Hooks 등의 기능을 제공합니다.',
        'component': 'App → Layout → Header/Content/Footer → 개별 컴포넌트로 구성되어 있습니다.',
        'state': 'useState, useReducer, Context API를 통해 컴포넌트 간 상태를 관리합니다.'
      },
      'Kubernetes': {
        'concept': 'Kubernetes는 컨테이너 오케스트레이션 플랫폼입니다. Pod, Service, Deployment 등의 개념으로 구성됩니다.',
        'workflow': 'YAML 작성 → kubectl apply → Pod 생성 → Service 노출 → 스케일링 순서로 진행됩니다.',
        'setup': 'kubectl 설치, 클러스터 연결, namespace 생성, deployment.yaml 작성 및 배포를 수행합니다.'
      }
    };

    const patterns = rulePatterns[topic];
    if (patterns && patterns[template.type]) {
      return patterns[template.type];
    }

    // 패턴이 없으면 템플릿 기본값 사용
    return this.generateByTemplate(topic, template, context);
  }

  private generateByTemplate(
    topic: string,
    template: SceneTemplate,
    context: TopicAnalysis
  ): string {
    let content = template.contentPattern;
    
    // 기본 치환
    content = content.replace(/\{topic\}/g, topic);
    content = content.replace(/\{키워드1\}/g, context.keywords[0] || '핵심 기술');
    content = content.replace(/\{기술분야\}/g, this.getCategoryName(context.category));
    
    // 타입별 기본 내용 생성
    switch (template.type) {
      case 'intro':
        content = content.replace(/\{목적\}/g, '효율적인 개발');
        break;
      case 'definition':
        content = content.replace(/\{핵심개념\}/g, '혁신적인 접근 방식');
        content = content.replace(/\{상세설명\}/g, '이를 통해 기존 문제를 해결할 수 있습니다');
        break;
      case 'process':
        content = content.replace(/\{단계1\}/g, '초기화');
        content = content.replace(/\{단계2\}/g, '처리');
        content = content.replace(/\{단계3\}/g, '완료');
        break;
      case 'benefits':
        content = content.replace(/\{장점1\}/g, '생산성 향상');
        content = content.replace(/\{장점2\}/g, '비용 절감');
        content = content.replace(/\{장점3\}/g, '품질 개선');
        break;
      case 'example':
        content = content.replace(/\{회사\/서비스\}/g, '많은 기업');
        content = content.replace(/\{활용방법\}/g, '실무');
        break;
      case 'conclusion':
        content = content.replace(/\{결과\/효과\}/g, '더 나은 결과');
        content = content.replace(/\{목표달성\}/g, '프로젝트 성공');
        break;
    }
    
    // 남은 플레이스홀더 처리
    content = content.replace(/\{[^}]+\}/g, (match) => {
      const placeholder = match.slice(1, -1);
      if (placeholder.includes('/')) {
        const options = placeholder.split('/');
        return options[0];
      }
      return placeholder;
    });
    
    return content;
  }

  private getCategoryName(category: ITCategory): string {
    const names = {
      'AI_ML': 'AI/머신러닝',
      'BACKEND': '백엔드',
      'DEVOPS': 'DevOps',
      'FRONTEND': '프론트엔드',
      'DATA': '데이터',
      'GENERAL': 'IT'
    };
    return names[category] || 'IT';
  }

  private selectVisualElements(visualStyle: string, context: TopicAnalysis): any {
    // 시각적 요소 선택 로직 (추후 구현)
    return {
      style: visualStyle,
      category: context.category
    };
  }
}

// 스타일 선택기 클래스
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
      'DATA': ['#96ceb4', '#ffeaa7', '#fab1a0'],
      'GENERAL': ['#74b9ff', '#a29bfe', '#fd79a8']
    };

    // 시나리오 전체에서 조화로운 색상 선택
    const palette = colorPalettes[category] || colorPalettes['GENERAL'];
    const colorIndex = Math.floor((sceneIndex / totalScenes) * palette.length);
    
    return {
      backgroundColor: palette[colorIndex],
      textColor: '#ffffff',
      accentColor: palette[(colorIndex + 1) % palette.length],
      animation: this.selectAnimation(sceneType),
      infographic: this.selectInfographic(sceneType)
    };
  }

  private selectAnimation(sceneType: string): string {
    const animationMap = {
      'intro': 'fadeInScale',
      'definition': 'slideFromLeft',
      'concept': 'slideFromLeft',
      'process': 'sequentialReveal',
      'workflow': 'sequentialReveal',
      'benefits': 'popIn',
      'features': 'popIn',
      'example': 'typewriter',
      'applications': 'typewriter',
      'conclusion': 'fadeOut',
      'architecture': 'diagram-build',
      'component': 'tree-expand',
      'state': 'flow-animation',
      'collection': 'data-stream',
      'processing': 'pipeline-flow',
      'analysis': 'chart-build',
      'visualization': 'graph-draw',
      'monitoring': 'dashboard-update',
      'setup': 'step-by-step',
      'implementation': 'code-highlight',
      'best-practices': 'tips-reveal',
      'performance': 'metrics-rise',
      'problem': 'problem-highlight',
      'overview': 'overview-scan',
      'details': 'detail-zoom'
    };
    
    return animationMap[sceneType] || 'fadeIn';
  }

  private selectInfographic(sceneType: string): string {
    const infographicMap = {
      'process': 'step-flow',
      'workflow': 'step-flow',
      'benefits': 'icon-list',
      'features': 'icon-list',
      'architecture': 'diagram',
      'component': 'tree-diagram',
      'comparison': 'side-by-side',
      'example': 'code-snippet',
      'applications': 'use-case-grid',
      'state': 'state-diagram',
      'collection': 'source-icons',
      'processing': 'pipeline-diagram',
      'analysis': 'chart',
      'visualization': 'graph',
      'monitoring': 'dashboard',
      'setup': 'checklist',
      'implementation': 'code-block',
      'best-practices': 'tip-cards',
      'performance': 'metric-bars',
      'problem': 'before-after'
    };
    
    return infographicMap[sceneType] || 'simple-icon';
  }
}

// 메인 자동 시나리오 생성기 클래스
export class AutoScenarioGenerator {
  private topicAnalyzer = new TopicAnalyzer();
  private contentGenerator = new ContentGenerator();
  private styleSelector = new StyleSelector();

  async generateFromTopic(topic: string, userId: string): Promise<GeneratedScenario> {
    console.log(`[AutoGen] Starting scenario generation for topic: ${topic}`);

    // 1. 토픽 분석
    const analysis = this.topicAnalyzer.analyze(topic);
    console.log(`[AutoGen] Topic analysis:`, {
      category: analysis.category,
      difficulty: analysis.difficulty,
      keywords: analysis.keywords,
      sceneCount: analysis.sceneStructure.length
    });

    // 2. 시나리오 구조 생성
    const sceneTemplates = analysis.sceneStructure;
    
    // 3. 각 씬의 콘텐츠 생성
    const scenes: GeneratedScene[] = [];
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
        id: `scene_${i + 1}`,
        type: template.type,
        duration: template.duration,
        title: content.title,
        narration: content.content,
        style: style
      });
    }

    // 4. 최종 시나리오 생성
    const totalDuration = scenes.reduce((sum, scene) => sum + scene.duration, 0);
    
    const scenario = {
      id: `scenario_${Date.now()}`,
      title: `${topic} 완전 가이드`,
      description: `${topic}에 대한 ${totalDuration}초 교육용 비디오`,
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

    console.log(`[AutoGen] Scenario generation complete:`, {
      id: scenario.id,
      title: scenario.title,
      totalDuration: scenario.totalDuration,
      sceneCount: scenario.sceneCount
    });

    return scenario;
  }

  // 데이터베이스에 시나리오 저장
  async saveToDatabase(scenario: GeneratedScenario, projectId: string): Promise<any> {
    try {
      const savedScenario = await prisma.scenario.create({
        data: {
          title: scenario.title,
          description: scenario.description,
          type: 'auto',
          scenes: JSON.stringify(scenario.scenes),
          totalDuration: scenario.totalDuration,
          sceneCount: scenario.sceneCount,
          projectId: projectId,
          metadata: scenario.metadata
        }
      });

      console.log(`[AutoGen] Scenario saved to database:`, savedScenario.id);
      return savedScenario;
    } catch (error) {
      console.error(`[AutoGen] Failed to save scenario:`, error);
      throw error;
    }
  }
}