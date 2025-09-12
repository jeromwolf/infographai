import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

interface AnimatedTextProps {
  text: string;
  fontSize?: number;
  color?: string;
  fontFamily?: string;
  animation?: 'fadeIn' | 'slideUp' | 'typewriter' | 'bounce';
  delay?: number;
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  fontSize = 48,
  color = '#ffffff',
  fontFamily = 'AppleSDGothicNeo, sans-serif',
  animation = 'fadeIn',
  delay = 0
}) => {
  const frame = useCurrentFrame();
  
  const getAnimationStyle = () => {
    const adjustedFrame = Math.max(0, frame - delay);
    
    switch (animation) {
      case 'fadeIn':
        const opacity = interpolate(adjustedFrame, [0, 30], [0, 1], {
          extrapolateRight: 'clamp'
        });
        return { opacity };
        
      case 'slideUp':
        const translateY = interpolate(adjustedFrame, [0, 30], [50, 0], {
          extrapolateRight: 'clamp'
        });
        const slideOpacity = interpolate(adjustedFrame, [0, 20], [0, 1], {
          extrapolateRight: 'clamp'
        });
        return {
          transform: `translateY(${translateY}px)`,
          opacity: slideOpacity
        };
        
      case 'typewriter':
        const charCount = Math.floor(
          interpolate(adjustedFrame, [0, 60], [0, text.length], {
            extrapolateRight: 'clamp'
          })
        );
        return {
          width: `${charCount}ch`,
          overflow: 'hidden',
          whiteSpace: 'nowrap'
        };
        
      case 'bounce':
        const bounceY = interpolate(
          adjustedFrame,
          [0, 10, 20, 30],
          [0, -20, 0, -5],
          {
            extrapolateRight: 'clamp'
          }
        );
        const bounceOpacity = interpolate(adjustedFrame, [0, 10], [0, 1], {
          extrapolateRight: 'clamp'
        });
        return {
          transform: `translateY(${bounceY}px)`,
          opacity: bounceOpacity
        };
        
      default:
        return {};
    }
  };
  
  return (
    <div
      style={{
        fontSize,
        color,
        fontFamily,
        fontWeight: 'bold',
        textAlign: 'center',
        ...getAnimationStyle()
      }}
    >
      {animation === 'typewriter' ? text : text}
    </div>
  );
};