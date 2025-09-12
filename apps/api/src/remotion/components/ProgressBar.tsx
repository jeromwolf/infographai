import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

interface ProgressBarProps {
  progress: number; // 0-100
  width?: number;
  height?: number;
  backgroundColor?: string;
  fillColor?: string;
  animated?: boolean;
  label?: string;
  showPercentage?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  width = 400,
  height = 40,
  backgroundColor = '#e0e0e0',
  fillColor = '#667eea',
  animated = true,
  label,
  showPercentage = true
}) => {
  const frame = useCurrentFrame();
  
  const animatedProgress = animated
    ? interpolate(frame, [0, 60], [0, progress], {
        extrapolateRight: 'clamp'
      })
    : progress;
  
  return (
    <div style={{ width, position: 'relative' }}>
      {label && (
        <div
          style={{
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 8,
            color: '#333',
            fontFamily: 'AppleSDGothicNeo, sans-serif'
          }}
        >
          {label}
        </div>
      )}
      
      <div
        style={{
          width,
          height,
          backgroundColor,
          borderRadius: height / 2,
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <div
          style={{
            width: `${animatedProgress}%`,
            height: '100%',
            backgroundColor: fillColor,
            borderRadius: height / 2,
            transition: animated ? 'none' : 'width 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingRight: 12
          }}
        >
          {showPercentage && animatedProgress > 20 && (
            <span
              style={{
                color: '#fff',
                fontSize: 14,
                fontWeight: 'bold',
                fontFamily: 'AppleSDGothicNeo, sans-serif'
              }}
            >
              {Math.round(animatedProgress)}%
            </span>
          )}
        </div>
      </div>
      
      {showPercentage && animatedProgress <= 20 && (
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: label ? 28 : 0,
            height,
            display: 'flex',
            alignItems: 'center',
            paddingRight: 12
          }}
        >
          <span
            style={{
              color: '#666',
              fontSize: 14,
              fontWeight: 'bold',
              fontFamily: 'AppleSDGothicNeo, sans-serif'
            }}
          >
            {Math.round(animatedProgress)}%
          </span>
        </div>
      )}
    </div>
  );
};