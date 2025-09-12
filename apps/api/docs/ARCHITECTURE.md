# InfoGraphAI Video Generation Architecture

## 1. AI-Powered Scenario Generation System

### 1.1 Topic Analysis Pipeline
```typescript
interface TopicAnalysis {
  topic: string;
  category: 'AI_ML' | 'BACKEND' | 'DEVOPS' | 'FRONTEND' | 'DATA';
  complexity: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  keywords: string[];
  relatedConcepts: string[];
  targetAudience: string;
}
```

### 1.2 Scenario Structure Generation
```typescript
interface ScenarioStructure {
  totalDuration: number; // 30, 60, 90 seconds
  scenes: SceneStructure[];
}

interface SceneStructure {
  id: string;
  type: SceneType;
  duration: number;
  title: string;
  narration: string;
  visualElements: VisualElement[];
  animations: Animation[];
  dataPoints?: DataPoint[];
}

type SceneType = 
  | 'intro'        // 오프닝 - 주제 소개
  | 'problem'      // 문제 정의
  | 'concept'      // 핵심 개념 설명
  | 'process'      // 프로세스/워크플로우
  | 'comparison'   // 비교 분석
  | 'benefits'     // 장점/특징
  | 'example'      // 실제 사례
  | 'tutorial'     // 실습/튜토리얼
  | 'conclusion';  // 결론/CTA
```

### 1.3 AI Content Generation Flow
```
User Input (Topic) 
    ↓
GPT-4 Topic Analysis
    ↓
Scene Structure Planning
    ↓
Content Generation per Scene
    ├── Title & Subtitle
    ├── Narration Script
    ├── Visual Elements Selection
    └── Animation Choreography
    ↓
JSON Scenario Output
```

## 2. Professional Animation & Layout System

### 2.1 Visual Element Library
```typescript
interface VisualElement {
  type: 'icon' | 'chart' | 'diagram' | 'code' | 'text' | 'shape';
  id: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  style: VisualStyle;
  data?: any;
}

interface VisualStyle {
  color?: string;
  gradient?: GradientStyle;
  opacity?: number;
  shadow?: ShadowStyle;
  blur?: number;
}
```

### 2.2 Animation System
```typescript
interface Animation {
  targetId: string;
  type: AnimationType;
  duration: number;
  delay?: number;
  easing: EasingFunction;
  properties: AnimationProperty[];
}

type AnimationType = 
  | 'fadeIn' | 'fadeOut'
  | 'slideIn' | 'slideOut'
  | 'zoomIn' | 'zoomOut'
  | 'rotate' | 'scale'
  | 'morphPath' | 'drawPath'
  | 'typewriter' | 'countUp';

interface AnimationProperty {
  property: string;
  from: any;
  to: any;
}
```

### 2.3 Layout Templates
```typescript
interface LayoutTemplate {
  name: string;
  grid: GridSystem;
  zones: LayoutZone[];
}

interface LayoutZone {
  id: string;
  type: 'title' | 'content' | 'visual' | 'footer';
  bounds: Bounds;
  alignment: Alignment;
  padding: Padding;
}

// Predefined Templates
const templates = {
  'center-focus': CenterFocusTemplate,
  'split-screen': SplitScreenTemplate,
  'grid-layout': GridLayoutTemplate,
  'timeline': TimelineTemplate,
  'comparison': ComparisonTemplate,
  'process-flow': ProcessFlowTemplate
};
```

### 2.4 Smart Infographic Components

#### Chart Components
- Bar Chart (animated)
- Line Chart (progressive draw)
- Pie Chart (rotation reveal)
- Area Chart (wave animation)
- Radar Chart (expand from center)

#### Diagram Components
- Flowchart (step-by-step reveal)
- Architecture Diagram (layer build)
- Network Diagram (connection animation)
- Tree Diagram (branch growth)
- Mind Map (radial expansion)

#### Data Visualization
- Progress Bars (fill animation)
- Gauges (needle rotation)
- Counters (number increment)
- Heatmaps (color transition)
- Word Clouds (particle formation)

## 3. Technical Implementation

### 3.1 Service Architecture
```
┌─────────────────────────────────────────┐
│            API Gateway                   │
└────────────┬────────────────────────────┘
             │
┌────────────┴────────────────────────────┐
│         Orchestration Service           │
│  - Request validation                   │
│  - Job queue management                 │
│  - Progress tracking                    │
└────────────┬────────────────────────────┘
             │
    ┌────────┴────────┬────────┬─────────┐
    ↓                 ↓        ↓         ↓
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│   AI     │ │Animation │ │  Video   │ │   TTS    │
│ Service  │ │  Engine  │ │ Renderer │ │ Service  │
└──────────┘ └──────────┘ └──────────┘ └──────────┘
```

### 3.2 AI Service Implementation
```typescript
class AIScenarioGenerator {
  private openai: OpenAI;
  
  async generateScenario(topic: string, options: GenerationOptions): Promise<Scenario> {
    // 1. Topic Analysis
    const analysis = await this.analyzeTopic(topic);
    
    // 2. Structure Planning
    const structure = await this.planStructure(analysis, options);
    
    // 3. Content Generation
    const scenes = await Promise.all(
      structure.scenes.map(scene => this.generateSceneContent(scene, analysis))
    );
    
    // 4. Visual Planning
    const visualPlan = await this.planVisuals(scenes, analysis.category);
    
    return this.compileScenario(scenes, visualPlan);
  }
  
  private async analyzeTopic(topic: string): Promise<TopicAnalysis> {
    const prompt = `
      Analyze this technical topic for educational video creation:
      Topic: ${topic}
      
      Provide:
      1. Category classification
      2. Complexity level
      3. Key concepts to cover
      4. Target audience
      5. Related topics
      
      Format: JSON
    `;
    
    return await this.openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [{ role: "system", content: prompt }],
      response_format: { type: "json_object" }
    });
  }
}
```

### 3.3 Animation Engine
```typescript
class ProfessionalAnimationEngine {
  private renderer: SVGRenderer | CanvasRenderer;
  private timeline: AnimationTimeline;
  
  async renderScene(scene: Scene, frameNumber: number): Promise<Frame> {
    const progress = this.calculateProgress(frameNumber, scene.duration);
    
    // 1. Setup base layout
    const layout = this.getLayout(scene.layoutTemplate);
    
    // 2. Place visual elements
    const elements = this.placeElements(scene.visualElements, layout);
    
    // 3. Apply animations
    const animatedElements = this.applyAnimations(
      elements, 
      scene.animations, 
      progress
    );
    
    // 4. Render to frame
    return this.renderer.render(animatedElements);
  }
  
  private applyAnimations(
    elements: VisualElement[], 
    animations: Animation[], 
    progress: number
  ): VisualElement[] {
    return elements.map(element => {
      const elementAnimations = animations.filter(a => a.targetId === element.id);
      
      return elementAnimations.reduce((el, animation) => {
        return this.applyAnimation(el, animation, progress);
      }, element);
    });
  }
}
```

## 4. Data Flow

### 4.1 Video Generation Pipeline
```
1. User Input
   └── Topic: "RAG Implementation"
   
2. AI Processing (GPT-4)
   ├── Topic Analysis
   ├── Scene Planning (6 scenes @ 5s each)
   └── Content Generation
   
3. Visual Planning
   ├── Template Selection
   ├── Asset Mapping
   └── Animation Choreography
   
4. Frame Generation
   ├── Scene 1: Frames 0-149
   ├── Scene 2: Frames 150-299
   └── ... (900 frames total @ 30fps)
   
5. Video Compilation
   ├── FFmpeg Processing
   ├── Audio Sync (if TTS enabled)
   └── Export (MP4, 1920x1080, 30fps)
```

### 4.2 Scene Content Structure
```json
{
  "scene": {
    "id": "scene_001",
    "type": "concept",
    "duration": 5,
    "title": "RAG Architecture",
    "narration": "Retrieval-Augmented Generation combines...",
    "layout": "split-screen",
    "visualElements": [
      {
        "type": "diagram",
        "subtype": "architecture",
        "position": { "x": 960, "y": 540 },
        "components": [
          { "id": "retriever", "label": "Retriever", "icon": "database" },
          { "id": "generator", "label": "Generator", "icon": "brain" }
        ],
        "connections": [
          { "from": "retriever", "to": "generator", "animated": true }
        ]
      }
    ],
    "animations": [
      {
        "targetId": "retriever",
        "type": "fadeIn",
        "duration": 0.5,
        "delay": 0
      },
      {
        "targetId": "generator",
        "type": "slideIn",
        "duration": 0.5,
        "delay": 0.5,
        "from": "right"
      }
    ]
  }
}
```

## 5. Next Steps

### Phase 1: Core Implementation
- [ ] GPT-4 integration for scenario generation
- [ ] Professional SVG animation system
- [ ] Layout template library
- [ ] Basic infographic components

### Phase 2: Enhancement
- [ ] Advanced animations (particles, morphing)
- [ ] Custom chart libraries
- [ ] TTS integration
- [ ] Real-time preview

### Phase 3: User Features
- [ ] Scene editor UI
- [ ] Custom branding options
- [ ] Export formats (YouTube, Shorts, Reels)
- [ ] Collaboration features