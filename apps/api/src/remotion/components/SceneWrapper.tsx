import React from 'react';
import { AbsoluteFill } from 'remotion';

interface SceneWrapperProps {
  backgroundColor?: string;
  children: React.ReactNode;
  padding?: number;
  style?: React.CSSProperties;
}

export const SceneWrapper: React.FC<SceneWrapperProps> = ({
  backgroundColor = '#1a1a2e',
  children,
  padding = 40,
  style = {}
}) => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding,
        ...style
      }}
    >
      {children}
    </AbsoluteFill>
  );
};