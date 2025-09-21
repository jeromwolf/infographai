# InfoGraphAI v2.0 - 완전 재설계 아키텍처

## 🎯 핵심 목표
사용자가 주제만 입력하면 → 완전 편집 가능한 시나리오 → 전문적인 교육 비디오 자동 생성

## 📋 상세 스펙

### 1. 사용자 입력 인터페이스
```typescript
interface UserInput {
  topic: string;              // "RAG 시스템 설명"
  targetAudience: string;     // "IT 초보자", "개발자", "경영진"
  duration: number;           // 60-300초
  style: 'professional' | 'casual' | 'academic';
  language: 'ko' | 'en';
  
  // 선택적 상세 옵션
  keyPoints?: string[];       // 강조하고 싶은 핵심 포인트
  visualPreferences?: {
    colorScheme: 'corporate' | 'modern' | 'minimal';
    chartTypes: ('flowchart' | 'comparison' | 'timeline')[];
  };
}
```

### 2. AI 시나리오 생성 엔진
```typescript
interface ScenarioEngine {
  async generateScenario(input: UserInput): Promise<EditableScenario>;
}

interface EditableScenario {
  id: string;
  metadata: {
    title: string;
    description: string;
    totalDuration: number;
    sceneCount: number;
  };
  scenes: EditableScene[];
  visualFlow: VisualFlowChart; // 시나리오 전체 흐름도
}

interface EditableScene {
  id: string;
  order: number;
  type: 'intro' | 'concept' | 'explanation' | 'example' | 'comparison' | 'conclusion';
  
  // 편집 가능한 콘텐츠
  content: {
    title: string;
    mainText: string;          // 화면에 표시될 텍스트
    narration: string;         // 음성/자막용 텍스트
    keyPoints: string[];       // 강조할 포인트들
  };
  
  // 시각적 요소
  visuals: {
    backgroundType: 'gradient' | 'solid' | 'image';
    backgroundColor: string;
    layout: 'centered' | 'left-right' | 'top-bottom';
    
    // 인포그래픽 요소
    infographics: InfographicElement[];
    animations: AnimationConfig[];
  };
  
  // 타이밍
  timing: {
    duration: number;
    fadeIn: number;
    fadeOut: number;
    textAnimationDelay: number;
  };
  
  // 편집 상태
  isEdited: boolean;
  lastModified: Date;
}
```

### 3. 시나리오 편집 시스템
```typescript
class ScenarioEditor {
  // 씬 관리
  async addScene(position: number, sceneType: SceneType): Promise<EditableScene>;
  async deleteScene(sceneId: string): Promise<void>;
  async reorderScenes(newOrder: string[]): Promise<void>;
  async duplicateScene(sceneId: string): Promise<EditableScene>;
  
  // 콘텐츠 편집
  async updateSceneContent(sceneId: string, content: Partial<SceneContent>): Promise<void>;
  async updateSceneTiming(sceneId: string, timing: Partial<TimingConfig>): Promise<void>;
  async updateSceneVisuals(sceneId: string, visuals: Partial<VisualConfig>): Promise<void>;
  
  // 전체 시나리오 관리
  async validateScenario(scenario: EditableScenario): Promise<ValidationResult>;
  async previewScene(sceneId: string): Promise<PreviewData>;
  async exportScenario(scenarioId: string): Promise<ExportableScenario>;
}

interface ValidationResult {
  isValid: boolean;
  warnings: ValidationWarning[];
  errors: ValidationError[];
  suggestions: Suggestion[];
}
```

### 4. 인포그래픽 생성 시스템
```typescript
interface InfographicElement {
  id: string;
  type: 'chart' | 'diagram' | 'icon' | 'illustration';
  position: { x: number; y: number; width: number; height: number };
  
  // 차트 타입별 설정
  config: ChartConfig | DiagramConfig | IconConfig | IllustrationConfig;
  
  // 애니메이션
  animation: {
    entrance: 'fadeIn' | 'slideIn' | 'scaleIn' | 'drawOn';
    duration: number;
    delay: number;
    easing: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut';
  };
}

// 확장 가능한 차트 시스템
interface ChartConfig {
  chartType: 'bar' | 'pie' | 'line' | 'area' | 'flowchart' | 'comparison' | 'timeline';
  data: ChartData;
  style: ChartStyle;
  responsive: boolean;
}

interface FlowchartConfig extends ChartConfig {
  chartType: 'flowchart';
  data: {
    nodes: FlowchartNode[];
    connections: FlowchartConnection[];
  };
  style: {
    nodeStyle: NodeStyle;
    connectionStyle: ConnectionStyle;
    layout: 'horizontal' | 'vertical' | 'hierarchical';
  };
}
```

### 5. 자막 시스템
```typescript
interface SubtitleSystem {
  // 자동 생성
  async generateSubtitles(scenario: EditableScenario): Promise<EditableSubtitle[]>;
  
  // 편집 기능
  async updateSubtitleText(subtitleId: string, text: string): Promise<void>;
  async updateSubtitleTiming(subtitleId: string, startTime: number, endTime: number): Promise<void>;
  async splitSubtitle(subtitleId: string, splitPoint: number): Promise<EditableSubtitle[]>;
  async mergeSubtitles(subtitleIds: string[]): Promise<EditableSubtitle>;
  
  // 스타일링
  async updateSubtitleStyle(subtitleId: string, style: SubtitleStyle): Promise<void>;
}

interface EditableSubtitle {
  id: string;
  sceneId: string;
  text: string;
  startTime: number; // 밀리초
  endTime: number;
  
  // 스타일링
  style: {
    fontSize: number;
    fontFamily: string;
    color: string;
    backgroundColor?: string;
    position: 'top' | 'center' | 'bottom';
    alignment: 'left' | 'center' | 'right';
    
    // 애니메이션
    entrance: 'none' | 'fadeIn' | 'slideIn' | 'typewriter';
    exit: 'none' | 'fadeOut' | 'slideOut';
  };
  
  // 편집 상태
  isEdited: boolean;
  confidence: number; // AI 생성 신뢰도
}
```

### 6. 비디오 렌더링 엔진
```typescript
interface VideoRenderEngine {
  async renderPreview(sceneId: string): Promise<PreviewVideo>;
  async renderFullVideo(scenarioId: string, options: RenderOptions): Promise<RenderedVideo>;
  async renderWithSubtitles(videoId: string, subtitles: EditableSubtitle[]): Promise<RenderedVideo>;
}

interface RenderOptions {
  quality: 'draft' | 'standard' | 'high' | '4k';
  format: 'mp4' | 'webm' | 'mov';
  fps: 24 | 30 | 60;
  includeSubtitles: boolean;
  watermark?: WatermarkConfig;
  
  // 고급 옵션
  customTransitions?: TransitionConfig[];
  backgroundMusic?: AudioConfig;
  voiceOver?: VoiceOverConfig;
}
```

## 🏗️ 기술 스택 선택

### 프론트엔드 (편집 인터페이스)
```typescript
// React + TypeScript + Tailwind CSS
// 시나리오 편집을 위한 드래그앤드롭 인터페이스

interface ScenarioEditorUI {
  components: {
    TimelineEditor: React.FC<{ scenario: EditableScenario }>;
    SceneEditor: React.FC<{ scene: EditableScene }>;
    InfographicEditor: React.FC<{ element: InfographicElement }>;
    SubtitleEditor: React.FC<{ subtitles: EditableSubtitle[] }>;
    PreviewPlayer: React.FC<{ sceneId?: string }>;
  };
}
```

### 백엔드 (콘텐츠 생성)
```typescript
// 확장 가능한 플러그인 아키텍처
interface ContentGenerationPipeline {
  plugins: {
    scenarioGenerators: ScenarioGenerator[];  // OpenAI, Claude, 커스텀
    infographicGenerators: InfographicGenerator[]; // D3.js, Chart.js, 커스텀
    subtitleGenerators: SubtitleGenerator[];  // AI, 템플릿 기반
    videoRenderers: VideoRenderer[];         // Remotion, FFmpeg, 커스텀
  };
}
```

### 데이터베이스 스키마
```sql
-- 확장 가능한 스키마 설계
CREATE TABLE projects (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  settings JSONB, -- 프로젝트별 설정
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE scenarios (
  id UUID PRIMARY KEY,
  project_id UUID REFERENCES projects(id),
  version INTEGER DEFAULT 1, -- 버전 관리
  title VARCHAR(255) NOT NULL,
  description TEXT,
  total_duration INTEGER, -- 초
  scene_count INTEGER,
  metadata JSONB, -- AI 생성 메타데이터
  is_template BOOLEAN DEFAULT FALSE, -- 템플릿으로 재사용 가능
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE scenes (
  id UUID PRIMARY KEY,
  scenario_id UUID REFERENCES scenarios(id),
  order_index INTEGER NOT NULL,
  type VARCHAR(50) NOT NULL,
  content JSONB NOT NULL, -- EditableScene 전체 데이터
  visuals JSONB, -- 인포그래픽 설정
  timing JSONB, -- 타이밍 설정
  is_edited BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE subtitles (
  id UUID PRIMARY KEY,
  scene_id UUID REFERENCES scenes(id),
  text TEXT NOT NULL,
  start_time INTEGER NOT NULL, -- 밀리초
  end_time INTEGER NOT NULL,
  style JSONB, -- 스타일 설정
  is_edited BOOLEAN DEFAULT FALSE,
  confidence FLOAT, -- AI 신뢰도
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE rendered_videos (
  id UUID PRIMARY KEY,
  scenario_id UUID REFERENCES scenarios(id),
  file_path VARCHAR(500),
  file_size BIGINT,
  duration INTEGER, -- 초
  quality VARCHAR(20),
  format VARCHAR(10),
  render_options JSONB,
  status VARCHAR(20) DEFAULT 'pending',
  error_message TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

-- 템플릿 시스템
CREATE TABLE scenario_templates (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  template_data JSONB NOT NULL, -- 재사용 가능한 시나리오 구조
  usage_count INTEGER DEFAULT 0,
  is_public BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- 에셋 관리
CREATE TABLE assets (
  id UUID PRIMARY KEY,
  type VARCHAR(50) NOT NULL, -- 'icon', 'chart', 'image', 'audio'
  name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500),
  metadata JSONB, -- 크기, 색상, 태그 등
  is_public BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🚀 구현 단계별 계획

### Phase 1: 핵심 아키텍처 (2주)
1. **데이터 모델 및 API 설계**
2. **시나리오 편집 인터페이스 프로토타입**
3. **기본 인포그래픽 생성 시스템**

### Phase 2: 편집 시스템 구축 (2주)
1. **고급 시나리오 편집기**
2. **자막 편집 시스템**
3. **실시간 프리뷰 시스템**

### Phase 3: 렌더링 엔진 (2주)
1. **고품질 비디오 렌더링**
2. **다양한 출력 형식 지원**
3. **성능 최적화**

### Phase 4: AI 고도화 (2주)
1. **스마트 시나리오 생성**
2. **자동 인포그래픽 매칭**
3. **품질 자동 검증**

---

## 💡 즉시 시작할 수 있는 첫 번째 작업

어떤 부분부터 시작하시겠습니까?

1. **데이터 모델 재설계** - 확장 가능한 DB 스키마 구축
2. **시나리오 편집 인터페이스** - React 기반 드래그앤드롭 편집기
3. **인포그래픽 생성 시스템** - D3.js/Chart.js 기반 차트 생성
4. **전체 아키텍처 프로토타입** - 핵심 워크플로우 구현

선택해주시면 해당 부분을 깊이 있게 설계하고 구현하겠습니다.