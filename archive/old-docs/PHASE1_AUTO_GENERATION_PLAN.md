# Phase 1: Remotion 자동 생성 엔진 구축 계획

## 🎯 목표
기존 InfoGraphAI 시스템과 Remotion을 연동하여 **완전 자동화된 비디오 생성 시스템** 구축

### 핵심 요구사항
- 사용자 입력: 토픽명만 입력
- 출력: 완성된 30초 교육용 비디오
- 편집 불필요: 바로 사용 가능한 품질

---

## 📊 현재 상황 분석

### ✅ 완료된 것들
- Remotion 기술 검증 완료
- 30초 RAG 비디오 성공적 생성
- 한글 + 애니메이션 완벽 지원 확인

### 🔍 분석 필요한 것들
- 기존 InfoGraphAI 시나리오 데이터 구조
- 현재 비디오 생성 워크플로우
- 데이터베이스 스키마 (Scenario, Video 테이블)

---

## 🏗 시스템 아키텍처 설계

### 전체 워크플로우
```
사용자 입력 → 시나리오 자동생성 → Remotion 렌더링 → 완성 비디오
    ↓              ↓                   ↓              ↓
  토픽명        6개 씬 구조         React 컴포넌트    MP4 파일
```

### 핵심 컴포넌트
1. **토픽 분석기** - 입력된 토픽을 분석하여 적절한 템플릿 선택
2. **시나리오 생성기** - 토픽별 6개 씬 자동 구성
3. **템플릿 매처** - IT 토픽에 맞는 시각적 스타일 자동 선택  
4. **Remotion 렌더러** - React 컴포넌트 기반 비디오 생성

---

## 📋 개발 단계별 계획

### Week 1: 기반 시스템 분석 및 설계
- [x] Remotion 기술 검증
- [ ] 기존 InfoGraphAI 코드 분석
- [ ] 데이터베이스 스키마 파악
- [ ] 시나리오 → Remotion 변환 로직 설계

### Week 2: 자동 생성 로직 개발
- [ ] 토픽별 템플릿 시스템 구축
- [ ] 시나리오 자동 생성 알고리즘
- [ ] 색상/애니메이션 자동 선택 로직
- [ ] 기본 인포그래픽 컴포넌트 개발

### Week 3: 시스템 통합
- [ ] 기존 API와 Remotion 연동
- [ ] 렌더링 큐 시스템 구축
- [ ] 에러 핸들링 및 로깅
- [ ] 성능 최적화

### Week 4: 테스트 및 개선
- [ ] 다양한 토픽으로 테스트
- [ ] 품질 검증 및 개선
- [ ] 문서화 및 배포 준비

---

## 🎨 토픽별 템플릿 시스템

### IT 기술 카테고리별 자동 스타일링
```typescript
const topicTemplates = {
  'AI/ML': {
    colorPalette: ['#667eea', '#764ba2'],
    animations: ['spring', 'fade'],
    icons: ['🤖', '🧠', '📊'],
    sceneStructure: 'concept-explanation-example-benefit'
  },
  'Backend': {
    colorPalette: ['#5f72bd', '#9921e8'],
    animations: ['slide', 'zoom'],
    icons: ['⚙️', '🔧', '📡'],
    sceneStructure: 'problem-solution-architecture-implementation'
  },
  'DevOps': {
    colorPalette: ['#2c3e50', '#3498db'],
    animations: ['flow', 'sequence'],
    icons: ['🚀', '⚡', '🔄'],
    sceneStructure: 'current-pain-solution-workflow'
  }
};
```

### 자동 시나리오 생성 규칙
```typescript
interface AutoScenarioRules {
  intro: { duration: 4, focus: 'problem-statement' };
  definition: { duration: 6, focus: 'concept-explanation' };
  keyFeatures: { duration: 5, focus: 'main-benefits' };
  implementation: { duration: 7, focus: 'practical-steps' };
  examples: { duration: 5, focus: 'real-use-cases' };
  conclusion: { duration: 3, focus: 'call-to-action' };
}
```

---

## 🔧 기술적 구현 방향

### 1. 기존 시스템과의 연동
```typescript
// 기존 Scenario 테이블 활용
interface ExistingScenario {
  id: string;
  title: string;
  scenes: SceneData[];
}

// Remotion Props로 변환
interface RemotionVideoProps {
  title: string;
  scenes: RemotionScene[];
  style: VideoStyle;
}
```

### 2. 자동 생성 파이프라인
```typescript
class AutoVideoGenerator {
  analyzeTopic(topic: string): TopicAnalysis;
  generateScenario(analysis: TopicAnalysis): ScenarioData;
  selectTemplate(analysis: TopicAnalysis): TemplateConfig;
  renderVideo(scenario: ScenarioData, template: TemplateConfig): Promise<VideoFile>;
}
```

### 3. 템플릿 기반 컴포넌트
```typescript
// 재사용 가능한 씬 컴포넌트들
export const IntroScene: React.FC<IntroSceneProps> = ({ topic, style }) => { ... };
export const ConceptScene: React.FC<ConceptSceneProps> = ({ definition, examples }) => { ... };
export const BenefitScene: React.FC<BenefitSceneProps> = ({ benefits, animations }) => { ... };
```

---

## 🎯 성공 기준

### 기능적 요구사항
- [ ] 토픽 입력으로 30초 완성 비디오 자동 생성
- [ ] 최소 5개 IT 토픽 카테고리 지원
- [ ] 일관된 품질의 인포그래픽 애니메이션
- [ ] 한글 텍스트 완벽 지원

### 성능 요구사항  
- [ ] 비디오 생성 시간: 30초 비디오 기준 20초 이내
- [ ] 시스템 안정성: 연속 10회 생성 성공률 100%
- [ ] 파일 크기: 3MB 이하
- [ ] 해상도: 1920x1080 고화질

### 품질 요구사항
- [ ] 전문적인 시각적 품질
- [ ] 자연스러운 애니메이션 전환
- [ ] 읽기 쉬운 텍스트 레이아웃
- [ ] 적절한 색상 조합

---

## 📈 향후 확장 계획 (Phase 2 이후)

### 사용자 편집 기능 (Phase 2)
- 텍스트 수정
- 색상 변경
- 씬 순서 조정
- 애니메이션 속도 조절

### 고급 기능 (Phase 3)
- 음성 내레이션 추가
- 차트/데이터 시각화
- 브랜딩 요소 삽입
- 다양한 출력 포맷

---

**다음 단계**: 기존 InfoGraphAI 시스템 코드 분석 및 연동 방안 설계