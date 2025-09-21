# InfoGraphAI 핵심 모듈 재설계 전략

## 🎯 목표: YouTube-ready 전문 교육 비디오 자동 생성

### 현재 문제점 분석

#### 1. 시나리오 생성 문제
- AI 생성 시나리오의 품질 일관성 부족
- 교육적 구조와 흐름 부족
- 시각적 요소와 텍스트의 불일치

#### 2. 인포그래픽 렌더링 문제  
- SVG → PNG 변환 실패
- FFmpeg의 복잡한 그래픽 처리 한계
- 동적 차트/다이어그램 생성 어려움

#### 3. 화면 구성 문제
- 정적인 텍스트 중심 화면
- 전문적인 디자인 템플릿 부족
- 애니메이션과 전환 효과 제한

### 📋 재설계 전략

## Phase 1: 기술 스택 재선택 (1주)

### 1.1 비디오 생성 엔진 교체
**현재**: FFmpeg 직접 사용
**제안**: 

#### 옵션 A: Remotion (React 기반)
```typescript
// 장점: React 컴포넌트로 비디오 제작, 풍부한 애니메이션
import { Composition } from 'remotion';

export const VideoComposition = () => (
  <Composition
    id="RAG-Tutorial"
    component={RAGTutorial}
    durationInFrames={900} // 30초
    fps={30}
    width={1920}
    height={1080}
  />
);
```

#### 옵션 B: Fabric.js + Canvas → Video
```typescript
// 장점: 강력한 2D 그래픽 처리, SVG 지원
import { fabric } from 'fabric';

const canvas = new fabric.Canvas('canvas');
// 인포그래픽 생성 후 프레임별 캡처
```

#### 옵션 C: Three.js + WebGL
```typescript
// 장점: 3D 애니메이션, 고성능 렌더링
// 단점: 복잡성 증가
```

### 1.2 시나리오 템플릿 시스템 구축

#### 교육용 비디오 구조 표준화
```typescript
interface EducationalTemplate {
  type: 'concept' | 'tutorial' | 'comparison' | 'case-study';
  structure: {
    intro: SceneTemplate;
    body: SceneTemplate[];
    conclusion: SceneTemplate;
  };
  visualAssets: InfographicTemplate[];
}

interface InfographicTemplate {
  type: 'flowchart' | 'comparison-table' | 'process-diagram' | 'architecture';
  data: any;
  style: DesignSystem;
}
```

### 1.3 디자인 시스템 구축
```typescript
interface DesignSystem {
  colors: {
    primary: string[];
    secondary: string[];
    backgrounds: string[];
  };
  typography: {
    heading: FontStyle;
    body: FontStyle;
    caption: FontStyle;
  };
  animations: {
    transitions: AnimationPreset[];
    emphasis: AnimationPreset[];
  };
}
```

## Phase 2: 핵심 모듈 구현 (2주)

### 2.1 스마트 시나리오 생성기
```typescript
class ScenarioGenerator {
  async generateFromTopic(topic: string): Promise<Scenario> {
    // 1. 주제 분석 및 구조화
    const structure = await this.analyzeTopicStructure(topic);
    
    // 2. 템플릿 선택
    const template = await this.selectBestTemplate(structure);
    
    // 3. 컨텐츠 생성
    const content = await this.generateContent(structure, template);
    
    // 4. 시각화 요소 매칭
    const visuals = await this.generateVisualElements(content);
    
    return { structure, template, content, visuals };
  }
}
```

### 2.2 인포그래픽 생성 엔진
```typescript
class InfographicEngine {
  async generateChart(type: ChartType, data: any): Promise<SVGElement> {
    switch(type) {
      case 'flowchart':
        return this.createFlowchart(data);
      case 'comparison':
        return this.createComparisonChart(data);
      case 'architecture':
        return this.createArchitectureDiagram(data);
    }
  }
  
  async renderToCanvas(svg: SVGElement): Promise<Canvas> {
    // SVG → Canvas 안정적 변환
    return await this.svgToCanvas(svg);
  }
}
```

### 2.3 비디오 컴포지션 시스템
```typescript
class VideoComposer {
  async createScene(sceneData: SceneData): Promise<VideoFrame[]> {
    const layout = this.calculateLayout(sceneData);
    const assets = await this.prepareAssets(sceneData);
    
    return this.animateScene({
      layout,
      assets,
      duration: sceneData.duration,
      transitions: sceneData.transitions
    });
  }
}
```

## Phase 3: 품질 보증 시스템 (1주)

### 3.1 자동 품질 검증
```typescript
interface QualityMetrics {
  visual: {
    readability: number; // 텍스트 가독성
    contrast: number;    // 색상 대비
    balance: number;     // 화면 구성 균형
  };
  content: {
    coherence: number;   // 내용 일관성
    educational: number; // 교육적 가치
    engagement: number;  // 참여도
  };
  technical: {
    renderTime: number;
    fileSize: number;
    compatibility: number;
  };
}
```

### 3.2 A/B 테스트 시스템
```typescript
class VideoTester {
  async compareVersions(original: Video, variants: Video[]): Promise<TestResult> {
    // 다양한 버전 생성 및 품질 비교
    return await this.runQualityTests([original, ...variants]);
  }
}
```

## 🚀 실행 계획

### Week 1: 기술 스택 결정 및 POC
- [ ] Remotion vs Fabric.js vs 기존 FFmpeg 성능 비교
- [ ] 간단한 인포그래픽 렌더링 테스트
- [ ] 템플릿 시스템 프로토타입

### Week 2: 핵심 엔진 구현
- [ ] 선택된 기술로 비디오 생성 엔진 재구축
- [ ] 시나리오 템플릿 시스템 구현
- [ ] 인포그래픽 생성기 첫 버전

### Week 3: 통합 및 최적화
- [ ] 전체 파이프라인 통합
- [ ] 성능 최적화
- [ ] 품질 검증 시스템 구축

### Week 4: 테스트 및 개선
- [ ] 다양한 주제로 테스트
- [ ] 사용자 피드백 수집
- [ ] 최종 품질 개선

## 💡 우선순위 결정이 필요한 사항

1. **비디오 생성 엔진 선택**
   - Remotion (React 친화적, 학습곡선)
   - Fabric.js (유연성, 커스터마이징)
   - 기존 FFmpeg 개선 (안정성, 호환성)

2. **인포그래픽 복잡도**
   - 간단한 차트부터 시작
   - 복잡한 다이어그램은 2단계
   - 3D 요소는 필요시만

3. **AI 의존도**
   - 템플릿 기반 + AI 보조
   - 완전 AI 생성
   - 하이브리드 접근

## 📊 성공 지표

### 기술적 지표
- 비디오 생성 성공률: 95% 이상
- 평균 생성 시간: 5분 이내
- 인포그래픽 품질 스코어: 8/10 이상

### 비즈니스 지표
- YouTube 업로드 가능한 품질
- 교육적 가치 인정
- 사용자 만족도 증가

---

**다음 단계**: 위 옵션들 중 어떤 방향으로 진행할지 결정 필요