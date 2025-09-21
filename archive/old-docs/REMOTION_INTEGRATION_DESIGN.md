# InfoGraphAI x Remotion 연동 방안 설계

## 🔍 기존 시스템 분석 결과

### 현재 아키텍처
```
사용자 → Project → Scenario → Video
                ↓         ↓
         ScenarioManager  simple-video-generator (FFmpeg)
```

### 핵심 발견사항
1. **Scenario 테이블**: 이미 JSON 형태로 scenes 데이터 저장 중
2. **Video 생성 플로우**: `POST /videos/generate` → `startSimpleVideoGeneration`
3. **FFmpeg 기반**: 현재 `simple-video-generator.ts`에서 복잡한 FFmpeg 명령어 사용
4. **한글 지원 문제**: 현재도 한글 처리에 많은 어려움 겪고 있음

---

## 🎯 Remotion 연동 전략

### Phase 1: 기존 시스템 최소 변경 접근
기존 API 엔드포인트와 데이터베이스 스키마는 그대로 유지하고, **비디오 생성 엔진만 교체**

### 연동 포인트
```typescript
// 기존: apps/api/src/services/simple-video-generator.ts
export async function startSimpleVideoGeneration(
  videoId: string,
  projectId: string, 
  scenarioId?: string
): Promise<void>

// 신규: apps/api/src/services/remotion-video-generator.ts  
export async function startRemotionVideoGeneration(
  videoId: string,
  projectId: string,
  scenarioId?: string
): Promise<void>
```

---

## 🏗 구체적 구현 설계

### 1. Remotion 서비스 모듈 구조

```
apps/api/src/
├── services/
│   ├── simple-video-generator.ts (기존 - 백업용)
│   └── remotion-video-generator.ts (신규)
├── remotion/
│   ├── components/
│   │   ├── AutoVideoComposition.tsx
│   │   ├── SceneComponents/
│   │   │   ├── IntroScene.tsx
│   │   │   ├── ConceptScene.tsx
│   │   │   ├── ProcessScene.tsx
│   │   │   └── ConclusionScene.tsx
│   │   └── shared/
│   │       ├── AnimatedText.tsx
│   │       ├── ProgressIndicator.tsx
│   │       └── InfographicIcon.tsx
│   ├── templates/
│   │   ├── rag-video-template.ts
│   │   ├── docker-video-template.ts
│   │   └── api-video-template.ts
│   └── utils/
│       ├── scene-converter.ts
│       ├── auto-styling.ts
│       └── rendering-queue.ts
```

### 2. 데이터 변환 로직

#### 기존 Scenario 데이터 구조
```typescript
interface ScenarioScene {
  id: string;
  type: string; // 'intro', 'concept', 'process', 'example', 'conclusion'
  duration: number;
  title: string;
  narration: string;
  subtitle?: string;
}
```

#### Remotion Props 변환
```typescript
interface RemotionVideoProps {
  title: string;
  scenes: RemotionScene[];
  style: {
    colorPalette: string[];
    fontFamily: string;
    animations: AnimationStyle;
  };
}

interface RemotionScene {
  id: string;
  type: 'intro' | 'concept' | 'process' | 'example' | 'conclusion';
  duration: number; // frames (30fps 기준)
  content: {
    title: string;
    text: string;
    subtitle?: string;
  };
  style: {
    backgroundColor: string;
    textColor: string;
    accentColor: string;
    animation: AnimationType;
  };
  infographic?: {
    type: 'progress' | 'flow' | 'comparison' | 'icon';
    data: any;
  };
}
```

### 3. 자동 스타일링 시스템

#### 토픽별 자동 테마 선택
```typescript
const topicThemes = {
  'AI/ML': {
    colors: ['#667eea', '#764ba2', '#f093fb'],
    icons: ['brain', 'chart', 'robot'],
    animationStyle: 'smooth'
  },
  'Backend': {  
    colors: ['#5f72bd', '#9921e8', '#667eea'],
    icons: ['server', 'database', 'api'],
    animationStyle: 'technical'
  },
  'DevOps': {
    colors: ['#2c3e50', '#3498db', '#1abc9c'], 
    icons: ['docker', 'kubernetes', 'pipeline'],
    animationStyle: 'flow'
  }
};
```

#### Scene 타입별 자동 애니메이션
```typescript
const sceneAnimations = {
  'intro': {
    entrance: 'fadeInScale',
    textReveal: 'typewriter',
    duration: 120 // 4초
  },
  'concept': {
    entrance: 'slideFromLeft', 
    textReveal: 'fadeInUp',
    infographic: 'progressiveReveal',
    duration: 180 // 6초
  },
  'process': {
    entrance: 'flowTransition',
    textReveal: 'sequentialFade', 
    infographic: 'stepByStep',
    duration: 150 // 5초
  }
};
```

---

## 🔧 구현 단계별 계획

### Step 1: Remotion 환경 설정
```bash
# API 서버에 Remotion 설치
cd apps/api
npm install @remotion/bundler @remotion/renderer remotion

# Remotion 설정 파일 생성
# apps/api/remotion.config.ts
```

### Step 2: 기본 비디오 컴포넌트 개발
```typescript
// apps/api/src/remotion/components/AutoVideoComposition.tsx
import { Composition } from 'remotion';

export const AutoVideoComposition: React.FC<RemotionVideoProps> = ({ 
  title, 
  scenes, 
  style 
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#1a1a2e' }}>
      {scenes.map((scene, index) => (
        <Sequence
          key={scene.id}
          from={getSceneStartFrame(scenes, index)}
          durationInFrames={scene.duration}
        >
          <SceneComponent scene={scene} style={style} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
```

### Step 3: 자동 변환 서비스 개발
```typescript
// apps/api/src/services/remotion-video-generator.ts
export class RemotionVideoGenerator {
  async generate(videoId: string, projectId: string, scenarioId?: string) {
    // 1. Scenario 데이터 가져오기
    const scenarioData = await this.getScenarioData(scenarioId, projectId);
    
    // 2. Remotion Props 변환
    const remotionProps = await this.convertToRemotionProps(scenarioData);
    
    // 3. Remotion 렌더링
    const videoPath = await this.renderWithRemotion(videoId, remotionProps);
    
    // 4. 결과 업데이트
    await this.finalizeVideo(videoId, videoPath);
  }
  
  private async convertToRemotionProps(scenarioData: any): Promise<RemotionVideoProps> {
    // 기존 Scenario 데이터를 Remotion Props로 변환
    // 자동 스타일링 적용
    // 애니메이션 패턴 선택
  }
  
  private async renderWithRemotion(videoId: string, props: RemotionVideoProps): Promise<string> {
    const { bundle } = require('@remotion/bundler');
    const { renderMedia, selectComposition } = require('@remotion/renderer');
    
    // 번들링
    const bundleLocation = await bundle({
      entryPoint: path.join(__dirname, '../remotion/index.ts'),
    });
    
    // 컴포지션 선택
    const composition = await selectComposition({
      serveUrl: bundleLocation,
      id: 'AutoVideoComposition',
      inputProps: props
    });
    
    // 렌더링
    const outputPath = path.join(process.cwd(), 'public/videos', `${videoId}.mp4`);
    await renderMedia({
      composition,
      serveUrl: bundleLocation,
      codec: 'h264',
      outputLocation: outputPath,
      inputProps: props
    });
    
    return `/videos/${videoId}.mp4`;
  }
}
```

### Step 4: API 라우트 수정
```typescript
// apps/api/src/routes/videos.ts에서 한 줄만 수정
// 기존:
await startSimpleVideoGeneration(video.id, projectId, scenarioId);

// 신규:
await startRemotionVideoGeneration(video.id, projectId, scenarioId);
```

---

## 🎨 자동 생성 로직 상세

### 1. Topic 분석기
```typescript
class TopicAnalyzer {
  analyze(topic: string): TopicCategory {
    const keywords = {
      'ai': ['AI', 'ML', 'machine learning', 'deep learning', 'neural', '인공지능', '머신러닝'],
      'backend': ['API', 'server', 'database', 'backend', '서버', '데이터베이스'],
      'devops': ['Docker', 'K8s', 'CI/CD', 'deployment', '배포', '컨테이너'],
      'frontend': ['React', 'Vue', 'frontend', '프론트엔드', 'UI', 'UX']
    };
    
    // 키워드 매칭으로 카테고리 결정
    // 기본 템플릿과 스타일 반환
  }
}
```

### 2. Scene 생성기
```typescript  
class SceneGenerator {
  generateScenes(topic: string, category: TopicCategory): ScenarioScene[] {
    const templates = {
      'ai': [
        { type: 'intro', template: '{topic} 소개', duration: 4 },
        { type: 'concept', template: '{topic}의 핵심 개념', duration: 6 },
        { type: 'process', template: '{topic} 작동 원리', duration: 5 },
        { type: 'example', template: '실제 사용 사례', duration: 7 },
        { type: 'conclusion', template: '정리 및 마무리', duration: 3 }
      ]
      // 다른 카테고리들...
    };
    
    return templates[category].map(t => ({
      ...t,
      title: t.template.replace('{topic}', topic),
      narration: this.generateNarration(topic, t.type)
    }));
  }
}
```

### 3. 자동 인포그래픽 선택
```typescript
class InfographicSelector {
  selectInfographic(sceneType: string, content: string): InfographicConfig {
    if (sceneType === 'process' && content.includes('단계')) {
      return { type: 'step-flow', animation: 'sequence' };
    }
    if (sceneType === 'concept' && content.includes('vs')) {
      return { type: 'comparison', animation: 'side-by-side' };
    }
    // 기본값
    return { type: 'progress-bar', animation: 'fill' };
  }
}
```

---

## 📈 성능 및 품질 목표

### 렌더링 성능
- **목표 시간**: 30초 비디오 → 20초 이내 렌더링
- **품질**: 1920x1080, 30fps, H.264
- **파일 크기**: 3MB 이하

### 자동 생성 품질
- **일관성**: 같은 토픽은 항상 일관된 스타일
- **가독성**: 한글 텍스트 완벽 렌더링  
- **전문성**: IT 전문가 수준의 시각적 품질

---

## 🚀 롤아웃 전략

### 1. 점진적 교체
```typescript
// apps/api/src/services/video-generator-factory.ts
export function createVideoGenerator(useRemotion = false) {
  if (useRemotion) {
    return new RemotionVideoGenerator();
  }
  return new SimpleVideoGenerator(); // 기존
}
```

### 2. A/B 테스트 지원
- 동일한 시나리오로 FFmpeg vs Remotion 결과 비교
- 사용자 피드백 수집
- 성능 메트릭 비교

### 3. 완전 전환 로드맵
- Week 1-2: Remotion 기본 구현
- Week 3: A/B 테스트 및 품질 검증  
- Week 4: 점진적 사용자 롤아웃
- Week 5+: 완전 전환 및 FFmpeg 제거

---

## 🔧 즉시 시작 가능한 작업

### 1. 환경 설정 (1일)
```bash
cd apps/api
npm install @remotion/bundler @remotion/renderer remotion
mkdir -p src/remotion/{components,templates,utils}
```

### 2. 최소 기능 구현 (3일)
- 기본 AutoVideoComposition 컴포넌트
- Scene 데이터 변환 로직
- 단순한 렌더링 파이프라인

### 3. 기존 시스템 연동 (2일)  
- RemotionVideoGenerator 클래스
- 기존 API 엔드포인트 연결
- 에러 핸들링 및 로깅

**다음 단계**: 자동 시나리오 생성 로직 개발로 진행