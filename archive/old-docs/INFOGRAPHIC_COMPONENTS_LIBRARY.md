# 기본 인포그래픽 컴포넌트 라이브러리 구축

## 🎯 목표
Remotion 기반으로 **재사용 가능한 인포그래픽 컴포넌트 라이브러리**를 구축하여 자동 생성된 시나리오에 바로 적용

---

## 📊 현재 Remotion 테스트 결과 분석

### 성공한 애니메이션 패턴 (RAG 비디오에서)
```typescript
// 1. Spring 애니메이션 - 자연스러운 등장
const titleOpacity = spring({
  frame: sceneFrame,
  fps: config.fps,
  config: { damping: 12, stiffness: 200 },
});

// 2. Interpolate + Easing - 부드러운 이동
const titleY = interpolate(sceneFrame, [0, 30], [100, 0], {
  easing: Easing.out(Easing.cubic),
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
});

// 3. 진행률 바 - 데이터 시각화
const progressWidth = interpolate(
  sceneFrame,
  [60, Math.max(sceneDuration - 30, 61)],
  [0, 400],
  { easing: Easing.inOut(Easing.cubic) }
);
```

### 성공한 시각적 요소들
- ✅ 한글 텍스트 완벽 렌더링
- ✅ 그라데이션 배경 
- ✅ 다중 텍스트 레이어 (제목, 내용, 아이콘)
- ✅ 부드러운 씬 전환
- ✅ 반응형 레이아웃

---

## 🧩 컴포넌트 라이브러리 구조

### 1. 핵심 컴포넌트 분류

#### A. 텍스트 애니메이션 컴포넌트
```typescript
// AnimatedText.tsx - 기본 텍스트 애니메이션
// TypewriterText.tsx - 타이핑 효과
// FadeInText.tsx - 페이드 인 효과
// SlideInText.tsx - 슬라이드 인 효과
```

#### B. 인포그래픽 컴포넌트  
```typescript
// ProgressBar.tsx - 진행률 표시
// StepFlow.tsx - 단계별 플로우
// ComparisonChart.tsx - 비교 차트
// IconGrid.tsx - 아이콘 그리드
// DataVisualization.tsx - 데이터 시각화
```

#### C. 레이아웃 컴포넌트
```typescript
// SceneWrapper.tsx - 씬 기본 레이아웃
// SplitLayout.tsx - 좌우 분할 레이아웃
// CenterLayout.tsx - 중앙 정렬 레이아웃
// GridLayout.tsx - 그리드 레이아웃
```

#### D. 장식 컴포넌트
```typescript
// BackgroundElements.tsx - 배경 장식
// ParticleEffect.tsx - 파티클 효과  
// GeometricShapes.tsx - 기하학적 도형
// BrandingElements.tsx - 브랜딩 요소
```

---

## 🎨 구체적 컴포넌트 구현

### 1. AnimatedText - 기본 텍스트 애니메이션

```typescript
// src/remotion/components/shared/AnimatedText.tsx
import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Easing,
} from 'remotion';

interface AnimatedTextProps {
  text: string;
  fontSize?: number;
  fontWeight?: string;
  color?: string;
  animation?: 'fadeIn' | 'slideUp' | 'typewriter' | 'spring';
  delay?: number;
  duration?: number;
  style?: React.CSSProperties;
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  fontSize = 48,
  fontWeight = 'bold',
  color = '#ffffff',
  animation = 'fadeIn',
  delay = 0,
  duration = 30,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const animationFrame = Math.max(0, frame - delay);
  
  // 애니메이션 타입별 처리
  const getAnimationStyle = (): React.CSSProperties => {
    switch (animation) {
      case 'spring':
        const opacity = spring({
          frame: animationFrame,
          fps,
          config: { damping: 12, stiffness: 200 },
        });
        const y = spring({
          frame: animationFrame,
          fps,
          config: { damping: 15, stiffness: 300 },
          from: 50,
          to: 0,
        });
        return { opacity, transform: `translateY(${y}px)` };
        
      case 'slideUp':
        const slideOpacity = interpolate(
          animationFrame,
          [0, duration * 0.3],
          [0, 1],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );
        const slideY = interpolate(
          animationFrame,
          [0, duration * 0.5],
          [30, 0],
          { 
            easing: Easing.out(Easing.cubic),
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp'
          }
        );
        return { opacity: slideOpacity, transform: `translateY(${slideY}px)` };
        
      case 'typewriter':
        const visibleChars = interpolate(
          animationFrame,
          [0, duration],
          [0, text.length],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );
        const visibleText = text.substring(0, Math.floor(visibleChars));
        return { 
          opacity: 1,
          '&::after': {
            content: visibleText !== text ? '|' : '',
            animation: 'blink 1s infinite'
          }
        };
        
      default: // fadeIn
        const fadeOpacity = interpolate(
          animationFrame,
          [0, duration * 0.4],
          [0, 1],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );
        return { opacity: fadeOpacity };
    }
  };

  const displayText = animation === 'typewriter' 
    ? text.substring(0, Math.floor(interpolate(
        animationFrame,
        [0, duration],
        [0, text.length],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
      )))
    : text;

  return (
    <div
      style={{
        fontSize,
        fontWeight,
        color,
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
        textShadow: '2px 2px 10px rgba(0,0,0,0.3)',
        ...getAnimationStyle(),
        ...style,
      }}
    >
      {displayText}
      {animation === 'typewriter' && displayText !== text && (
        <span style={{ opacity: frame % 30 < 15 ? 1 : 0 }}>|</span>
      )}
    </div>
  );
};
```

### 2. ProgressBar - 진행률 인포그래픽

```typescript
// src/remotion/components/infographics/ProgressBar.tsx
import React from 'react';
import {
  useCurrentFrame,
  interpolate,
  Easing,
} from 'remotion';

interface ProgressBarProps {
  value: number; // 0-100
  label?: string;
  color?: string;
  backgroundColor?: string;
  width?: number;
  height?: number;
  animationDelay?: number;
  animationDuration?: number;
  showPercentage?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  label,
  color = '#4ade80',
  backgroundColor = 'rgba(255,255,255,0.2)',
  width = 400,
  height = 12,
  animationDelay = 0,
  animationDuration = 60,
  showPercentage = true,
}) => {
  const frame = useCurrentFrame();
  const animationFrame = Math.max(0, frame - animationDelay);
  
  const animatedValue = interpolate(
    animationFrame,
    [0, animationDuration],
    [0, value],
    {
      easing: Easing.out(Easing.cubic),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {label && (
        <div style={{
          color: '#ffffff',
          fontSize: 18,
          marginBottom: 12,
          fontWeight: '500',
        }}>
          {label}
        </div>
      )}
      
      <div
        style={{
          width,
          height,
          backgroundColor,
          borderRadius: height / 2,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${animatedValue}%`,
            height: '100%',
            background: `linear-gradient(90deg, ${color}, ${color}dd)`,
            borderRadius: height / 2,
            transition: 'width 0.1s ease-out',
            position: 'relative',
          }}
        >
          {/* 광택 효과 */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '50%',
              background: 'linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)',
              borderRadius: height / 2,
            }}
          />
        </div>
      </div>
      
      {showPercentage && (
        <div style={{
          color: '#ffffff',
          fontSize: 16,
          marginTop: 8,
          fontWeight: '600',
        }}>
          {Math.round(animatedValue)}%
        </div>
      )}
    </div>
  );
};
```

### 3. StepFlow - 단계별 플로우 다이어그램

```typescript
// src/remotion/components/infographics/StepFlow.tsx
import React from 'react';
import {
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
} from 'remotion';

interface Step {
  id: string;
  title: string;
  icon?: string; // 텍스트 아이콘 (이모지 대신)
  description?: string;
}

interface StepFlowProps {
  steps: Step[];
  direction?: 'horizontal' | 'vertical';
  animationDelay?: number;
  stepDelay?: number;
}

export const StepFlow: React.FC<StepFlowProps> = ({
  steps,
  direction = 'horizontal',
  animationDelay = 0,
  stepDelay = 15,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const renderStep = (step: Step, index: number) => {
    const stepFrame = Math.max(0, frame - animationDelay - (index * stepDelay));
    
    const opacity = spring({
      frame: stepFrame,
      fps,
      config: { damping: 12, stiffness: 200 },
    });
    
    const scale = spring({
      frame: stepFrame,
      fps,
      config: { damping: 15, stiffness: 300 },
      from: 0.8,
      to: 1,
    });

    const y = spring({
      frame: stepFrame,
      fps,
      config: { damping: 10, stiffness: 150 },
      from: 20,
      to: 0,
    });

    return (
      <div
        key={step.id}
        style={{
          opacity,
          transform: `scale(${scale}) translateY(${y}px)`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '20px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          minWidth: direction === 'horizontal' ? '140px' : '200px',
          minHeight: '100px',
        }}
      >
        {/* 단계 번호 */}
        <div
          style={{
            width: 32,
            height: 32,
            backgroundColor: '#3b82f6',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontSize: 16,
            fontWeight: 'bold',
            marginBottom: 8,
          }}
        >
          {index + 1}
        </div>
        
        {/* 아이콘 */}
        {step.icon && (
          <div
            style={{
              fontSize: 24,
              marginBottom: 8,
              padding: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
            }}
          >
            {step.icon}
          </div>
        )}
        
        {/* 제목 */}
        <div
          style={{
            color: '#ffffff',
            fontSize: 16,
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: 4,
          }}
        >
          {step.title}
        </div>
        
        {/* 설명 */}
        {step.description && (
          <div
            style={{
              color: '#e5e7eb',
              fontSize: 12,
              textAlign: 'center',
              lineHeight: 1.4,
            }}
          >
            {step.description}
          </div>
        )}
      </div>
    );
  };

  const renderArrow = (index: number) => {
    const arrowFrame = Math.max(0, frame - animationDelay - (index * stepDelay) - 10);
    
    const opacity = interpolate(
      arrowFrame,
      [0, 20],
      [0, 1],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );

    return (
      <div
        key={`arrow-${index}`}
        style={{
          opacity,
          fontSize: 24,
          color: '#6b7280',
          margin: direction === 'horizontal' ? '0 16px' : '16px 0',
        }}
      >
        {direction === 'horizontal' ? '→' : '↓'}
      </div>
    );
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: direction === 'horizontal' ? 'row' : 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0,
      }}
    >
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          {renderStep(step, index)}
          {index < steps.length - 1 && renderArrow(index)}
        </React.Fragment>
      ))}
    </div>
  );
};
```

### 4. SceneWrapper - 씬 기본 레이아웃

```typescript
// src/remotion/components/layouts/SceneWrapper.tsx
import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from 'remotion';

interface SceneWrapperProps {
  backgroundColor?: string;
  backgroundGradient?: [string, string];
  children: React.ReactNode;
  enterAnimation?: 'fade' | 'slide' | 'scale' | 'none';
  exitAnimation?: 'fade' | 'slide' | 'scale' | 'none';
  sceneDuration?: number;
  padding?: number;
}

export const SceneWrapper: React.FC<SceneWrapperProps> = ({
  backgroundColor = '#1a1a2e',
  backgroundGradient,
  children,
  enterAnimation = 'fade',
  exitAnimation = 'fade',
  sceneDuration = 150, // 5초 기본값
  padding = 80,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const enterDuration = Math.min(20, sceneDuration * 0.15); // 씬의 15% 또는 최대 20프레임
  const exitDuration = Math.min(20, sceneDuration * 0.15);
  const exitStart = sceneDuration - exitDuration;

  // 진입 애니메이션
  const getEnterTransform = () => {
    if (enterAnimation === 'none' || frame > enterDuration) return {};
    
    const progress = frame / enterDuration;
    
    switch (enterAnimation) {
      case 'slide':
        const slideX = interpolate(progress, [0, 1], [50, 0]);
        return { transform: `translateX(${slideX}px)` };
      case 'scale':
        const scale = interpolate(progress, [0, 1], [0.9, 1]);
        return { transform: `scale(${scale})` };
      default: // fade
        return {};
    }
  };

  // 전체 씬 투명도
  const getOpacity = () => {
    if (frame < enterDuration) {
      // 진입 페이드
      return interpolate(frame, [0, enterDuration], [0, 1]);
    } else if (frame > exitStart) {
      // 종료 페이드
      return interpolate(frame, [exitStart, sceneDuration], [1, 0]);
    }
    return 1;
  };

  const backgroundStyle = backgroundGradient
    ? { background: `linear-gradient(135deg, ${backgroundGradient[0]}, ${backgroundGradient[1]})` }
    : { backgroundColor };

  return (
    <AbsoluteFill
      style={{
        ...backgroundStyle,
        opacity: getOpacity(),
        ...getEnterTransform(),
      }}
    >
      {/* 배경 장식 요소들 */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          right: '10%',
          width: 150,
          height: 150,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.05)',
          transform: `rotate(${frame * 0.2}deg)`,
        }}
      />
      
      <div
        style={{
          position: 'absolute',
          bottom: '15%',
          left: '8%',
          width: 100,
          height: 100,
          borderRadius: '20px',
          background: 'rgba(255, 255, 255, 0.03)',
          transform: `rotate(${-frame * 0.15}deg)`,
        }}
      />

      {/* 메인 콘텐츠 영역 */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          padding,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 10,
        }}
      >
        {children}
      </div>
      
      {/* 브랜딩 */}
      <div
        style={{
          position: 'absolute',
          bottom: 30,
          right: 30,
          color: 'rgba(255, 255, 255, 0.6)',
          fontSize: 20,
          fontFamily: 'system-ui',
        }}
      >
        InfoGraphAI
      </div>
    </AbsoluteFill>
  );
};
```

---

## 🎯 사용 시나리오별 컴포넌트 조합

### RAG 비디오 예시
```typescript
// IntroScene.tsx
<SceneWrapper backgroundGradient={['#667eea', '#764ba2']}>
  <AnimatedText 
    text="RAG 시작하기" 
    fontSize={64}
    animation="spring"
  />
  <AnimatedText 
    text="검색 증강 생성에 대해 완벽하게 알아보겠습니다" 
    fontSize={32}
    animation="slideUp"
    delay={30}
  />
</SceneWrapper>

// ProcessScene.tsx  
<SceneWrapper backgroundGradient={['#5f72bd', '#9921e8']}>
  <AnimatedText text="RAG 작동 과정" fontSize={48} />
  <StepFlow 
    steps={[
      { id: '1', title: '문서 임베딩', icon: '[문서]' },
      { id: '2', title: '유사도 검색', icon: '[검색]' },
      { id: '3', title: '컨텍스트 증강', icon: '[결합]' },
      { id: '4', title: '답변 생성', icon: '[생성]' }
    ]}
    animationDelay={20}
  />
</SceneWrapper>

// BenefitsScene.tsx
<SceneWrapper backgroundGradient={['#9921e8', '#5f27cd']}>
  <AnimatedText text="RAG의 장점" fontSize={48} />
  <ProgressBar value={95} label="정확성 향상" />
  <ProgressBar value={88} label="최신 정보 활용" animationDelay={40} />
  <ProgressBar value={92} label="환각 현상 감소" animationDelay={80} />
</SceneWrapper>
```

### Docker 비디오 예시
```typescript
// ArchitectureScene.tsx
<SceneWrapper backgroundColor="#2c3e50">
  <AnimatedText text="Docker 아키텍처" fontSize={48} />
  <StepFlow 
    direction="vertical"
    steps={[
      { id: '1', title: 'Application', icon: '[앱]' },
      { id: '2', title: 'Container Runtime', icon: '[실행]' },
      { id: '3', title: 'Docker Engine', icon: '[엔진]' },
      { id: '4', title: 'Host OS', icon: '[OS]' }
    ]}
  />
</SceneWrapper>
```

---

## 📦 컴포넌트 라이브러리 통합

### 컴포넌트 인덱스 파일
```typescript
// src/remotion/components/index.ts
export { AnimatedText } from './shared/AnimatedText';
export { ProgressBar } from './infographics/ProgressBar';
export { StepFlow } from './infographics/StepFlow';
export { SceneWrapper } from './layouts/SceneWrapper';

// 사전 정의된 씬 템플릿들
export { IntroScene } from './scenes/IntroScene';
export { ConceptScene } from './scenes/ConceptScene';
export { ProcessScene } from './scenes/ProcessScene';
export { BenefitsScene } from './scenes/BenefitsScene';
export { ConclusionScene } from './scenes/ConclusionScene';
```

### 자동 컴포넌트 선택 로직
```typescript
// src/remotion/utils/component-selector.ts
export class ComponentSelector {
  selectSceneComponent(sceneType: string): React.ComponentType {
    const sceneMap = {
      'intro': IntroScene,
      'definition': ConceptScene, 
      'process': ProcessScene,
      'benefits': BenefitsScene,
      'example': ProcessScene, // 프로세스 컴포넌트 재사용
      'conclusion': ConclusionScene
    };
    
    return sceneMap[sceneType] || ConceptScene;
  }
  
  selectInfographic(visualStyle: string): React.ComponentType {
    const infographicMap = {
      'step-by-step': StepFlow,
      'progress': ProgressBar,
      'comparison': ComparisonChart,
      'benefits-showcase': ProgressBar
    };
    
    return infographicMap[visualStyle] || ProgressBar;
  }
}
```

---

## 🚀 다음 단계 통합

이제 4단계가 모두 완료되었습니다:

### ✅ 완료된 단계들
1. **Phase 1 계획 수립** - 전체 자동 생성 엔진 로드맵
2. **Remotion 연동 설계** - 기존 시스템과의 완벽한 연동 방안  
3. **자동 시나리오 생성** - 토픽만으로 완전한 시나리오 자동 생성
4. **인포그래픽 컴포넌트** - 재사용 가능한 Remotion 컴포넌트 라이브러리

### 🎯 통합된 워크플로우
```
사용자: "RAG" 입력
    ↓
TopicAnalyzer: AI_ML 카테고리 분석
    ↓
AutoScenarioGenerator: 6개 씬 자동 생성
    ↓
RemotionVideoGenerator: 컴포넌트 조합하여 렌더링
    ↓
결과: 30초 완성된 RAG 교육 비디오
```

<function_calls>
<invoke name="TodoWrite">
<parameter name="todos">[{"content": "\uae30\ubcf8 \uc778\ud3ec\uadf8\ub798\ud53d \ucef4\ud3ec\ub10c\ud2b8 \ub77c\uc774\ube0c\ub7ec\ub9ac \uad6c\ucd95", "status": "completed", "activeForm": "\uae30\ubcf8 \uc778\ud3ec\uadf8\ub798\ud53d \ucef4\ud3ec\ub10c\ud2b8 \ub77c\uc774\ube0c\ub7ec\ub9ac \uad6c\ucd95 \uc911"}]