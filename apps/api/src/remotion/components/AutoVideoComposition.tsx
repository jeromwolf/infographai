import React from 'react';
import { Composition, Sequence, AbsoluteFill } from 'remotion';
import { SceneWrapper } from './SceneWrapper';
import { AnimatedText } from './AnimatedText';
import { ProgressBar } from './ProgressBar';
import { StepFlow } from './StepFlow';

interface Scene {
  id: string;
  type: string;
  duration: number;
  title: string;
  narration: string;
  style: {
    backgroundColor: string;
    textColor: string;
    accentColor: string;
    animation: string;
    infographic: string;
  };
}

interface AutoVideoCompositionProps {
  title: string;
  scenes: Scene[];
  style?: {
    colorPalette?: string[];
    fontFamily?: string;
  };
}

// Scene Component Renderer
const SceneComponent: React.FC<{ scene: Scene }> = ({ scene }) => {
  const renderInfographic = () => {
    switch (scene.style.infographic) {
      case 'step-flow':
        // Parse steps from narration (simple example)
        const steps = scene.narration.split('→').map((step, index) => ({
          id: `step-${index}`,
          title: step.trim()
        }));
        
        if (steps.length > 1) {
          return <StepFlow steps={steps} activeColor={scene.style.accentColor} />;
        }
        break;
        
      case 'icon-list':
        // Parse list items from narration
        const items = scene.narration.split(',').map(item => item.trim());
        
        return (
          <div style={{ marginTop: 30 }}>
            {items.map((item, index) => (
              <div
                key={index}
                style={{
                  fontSize: 24,
                  color: scene.style.textColor,
                  marginBottom: 15,
                  fontFamily: 'AppleSDGothicNeo, sans-serif'
                }}
              >
                • {item}
              </div>
            ))}
          </div>
        );
        
      case 'progress-bar':
        return (
          <div style={{ marginTop: 40 }}>
            <ProgressBar
              progress={75}
              fillColor={scene.style.accentColor}
              label="진행 상황"
            />
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <SceneWrapper backgroundColor={scene.style.backgroundColor}>
      {/* Title */}
      <AnimatedText
        text={scene.title}
        fontSize={48}
        color={scene.style.textColor}
        animation={getAnimationType(scene.style.animation)}
      />
      
      {/* Narration */}
      <div
        style={{
          marginTop: 30,
          fontSize: 24,
          color: scene.style.textColor,
          textAlign: 'center',
          maxWidth: '80%',
          lineHeight: 1.6,
          fontFamily: 'AppleSDGothicNeo, sans-serif'
        }}
      >
        {scene.narration}
      </div>
      
      {/* Infographic */}
      {renderInfographic()}
    </SceneWrapper>
  );
};

// Helper function to map animation strings
const getAnimationType = (animation: string): 'fadeIn' | 'slideUp' | 'typewriter' | 'bounce' => {
  const animationMap: Record<string, 'fadeIn' | 'slideUp' | 'typewriter' | 'bounce'> = {
    'fadeInScale': 'fadeIn',
    'slideFromLeft': 'slideUp',
    'sequentialReveal': 'fadeIn',
    'popIn': 'bounce',
    'typewriter': 'typewriter',
    'fadeOut': 'fadeIn'
  };
  
  return animationMap[animation] || 'fadeIn';
};

// Calculate scene start frames
const getSceneStartFrame = (scenes: Scene[], index: number): number => {
  let startFrame = 0;
  for (let i = 0; i < index; i++) {
    startFrame += scenes[i].duration * 30; // Convert seconds to frames (30fps)
  }
  return startFrame;
};

// Main Video Composition
export const AutoVideoComposition: React.FC<AutoVideoCompositionProps> = ({
  title,
  scenes,
  style
}) => {
  const totalDurationInFrames = scenes.reduce(
    (sum, scene) => sum + scene.duration * 30,
    0
  );
  
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {scenes.map((scene, index) => (
        <Sequence
          key={scene.id}
          from={getSceneStartFrame(scenes, index)}
          durationInFrames={scene.duration * 30}
        >
          <SceneComponent scene={scene} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

// Export composition metadata for Remotion
export const AutoVideoCompositionMetadata = {
  id: 'AutoVideoComposition',
  component: AutoVideoComposition,
  width: 1920,
  height: 1080,
  fps: 30,
  durationInFrames: 900, // Default 30 seconds, will be overridden
  defaultProps: {
    title: 'Sample Video',
    scenes: []
  }
};