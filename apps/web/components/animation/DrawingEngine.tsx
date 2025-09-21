"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';

// Animation command types - exported for use in other components
export type DrawCommand =
  | { type: 'line'; x1: number; y1: number; x2: number; y2: number; color?: string; width?: number }
  | { type: 'rect'; x: number; y: number; width: number; height: number; color?: string; filled?: boolean }
  | { type: 'circle'; x: number; y: number; radius: number; color?: string; filled?: boolean }
  | { type: 'text'; text: string; x: number; y: number; size?: number; color?: string }
  | { type: 'arrow'; x1: number; y1: number; x2: number; y2: number; color?: string }
  | { type: 'path'; points: Array<{x: number; y: number}>; color?: string; closed?: boolean }
  | { type: 'clear' }
  | { type: 'wait'; duration: number }
  | { type: 'parallel'; commands: DrawCommand[] }
  | { type: 'highlight'; x: number; y: number; width: number; height: number; color?: string };

interface DrawingEngineProps {
  commands: DrawCommand[];
  width?: number;
  height?: number;
  speed?: number; // 0.5 = slow, 1 = normal, 2 = fast
  autoPlay?: boolean;
  loop?: boolean;
  onComplete?: () => void;
}

export default function DrawingEngine({
  commands,
  width = 1200,
  height = 700,
  speed = 1,
  autoPlay = true,
  loop = false,
  onComplete
}: DrawingEngineProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [currentCommandIndex, setCurrentCommandIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const animationFrameRef = useRef<number>();
  const startTimeRef = useRef<number>(0);

  // KodeKloud colors
  const COLORS = {
    bg: '#0a0a0a',
    primary: '#4ade80',
    white: '#ffffff',
    blue: '#3b82f6',
    yellow: '#fbbf24',
    red: '#ef4444',
    gray: '#6b7280'
  };

  // Add hand-drawn effect to any path
  const addHandDrawnEffect = (ctx: CanvasRenderingContext2D) => {
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    // Add subtle shadow for depth
    ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
    ctx.shadowBlur = 1;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  };

  // Draw a line with animation
  const drawAnimatedLine = (
    ctx: CanvasRenderingContext2D,
    x1: number, y1: number,
    x2: number, y2: number,
    progress: number,
    color: string = COLORS.primary,
    width: number = 3
  ) => {
    if (progress <= 0) return;

    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    addHandDrawnEffect(ctx);

    // Calculate current end point based on progress
    const currentX = x1 + (x2 - x1) * progress;
    const currentY = y1 + (y2 - y1) * progress;

    // Draw straight line without random curves
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(currentX, currentY);
    ctx.stroke();
  };

  // Draw animated rectangle
  const drawAnimatedRect = (
    ctx: CanvasRenderingContext2D,
    x: number, y: number,
    width: number, height: number,
    progress: number,
    color: string = COLORS.primary,
    filled: boolean = false
  ) => {
    if (progress <= 0) return;

    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 3;
    addHandDrawnEffect(ctx);

    // Draw rectangle sides progressively
    const perimeter = (width + height) * 2;
    const currentLength = perimeter * progress;

    ctx.beginPath();

    // Top side
    if (currentLength > 0) {
      const topLength = Math.min(currentLength, width);
      ctx.moveTo(x, y);
      ctx.lineTo(x + topLength, y);
    }

    // Right side
    if (currentLength > width) {
      const rightLength = Math.min(currentLength - width, height);
      ctx.lineTo(x + width, y + rightLength);
    }

    // Bottom side
    if (currentLength > width + height) {
      const bottomLength = Math.min(currentLength - width - height, width);
      ctx.lineTo(x + width - bottomLength, y + height);
    }

    // Left side
    if (currentLength > width * 2 + height) {
      const leftLength = Math.min(currentLength - width * 2 - height, height);
      ctx.lineTo(x, y + height - leftLength);
    }

    ctx.stroke();

    // Fill if needed (after outline is complete)
    if (filled && progress >= 1) {
      ctx.globalAlpha = 0.3;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  };

  // Draw animated circle
  const drawAnimatedCircle = (
    ctx: CanvasRenderingContext2D,
    x: number, y: number,
    radius: number,
    progress: number,
    color: string = COLORS.primary,
    filled: boolean = false
  ) => {
    if (progress <= 0) return;

    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 3;
    addHandDrawnEffect(ctx);

    const endAngle = Math.PI * 2 * progress;

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, endAngle);

    if (progress >= 1) {
      ctx.closePath();
      if (filled) {
        ctx.globalAlpha = 0.3;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }
    ctx.stroke();
  };

  // Helper function to find if a point is inside a recently drawn shape
  const findCenterForText = (x: number, y: number, commandIndex: number, text?: string): { x: number, y: number, shouldCenter: boolean } => {
    // Look backwards through commands to find related shapes
    // Check more commands to find the correct container
    for (let i = commandIndex - 1; i >= 0 && i >= commandIndex - 20; i--) {
      const prevCmd = commands[i];
      if (!prevCmd) continue;

      // Check if text is inside or near a rectangle
      if (prevCmd.type === 'rect') {
        const rectCenterX = prevCmd.x + prevCmd.width / 2;
        const rectCenterY = prevCmd.y + prevCmd.height / 2;

        // Method 1: Text coordinates are explicitly inside the rectangle
        if (x >= prevCmd.x && x <= prevCmd.x + prevCmd.width &&
            y >= prevCmd.y && y <= prevCmd.y + prevCmd.height) {
          console.log(`Text "${text}" found inside rect at (${prevCmd.x}, ${prevCmd.y}), centering at (${rectCenterX}, ${rectCenterY})`);
          return { x: rectCenterX, y: rectCenterY, shouldCenter: true };
        }

        // Method 2: Text is very close to rectangle center (likely meant to be inside)
        const distToCenter = Math.sqrt((x - rectCenterX) ** 2 + (y - rectCenterY) ** 2);
        if (distToCenter <= Math.max(prevCmd.width, prevCmd.height) / 2) {
          console.log(`Text "${text}" close to rect center, centering at (${rectCenterX}, ${rectCenterY})`);
          return { x: rectCenterX, y: rectCenterY, shouldCenter: true };
        }

        // Method 3: Text X coordinate matches rect X (common in templates)
        if (Math.abs(x - prevCmd.x) < 5 || Math.abs(x - rectCenterX) < 5) {
          // Check if Y is reasonable
          if (Math.abs(y - rectCenterY) <= prevCmd.height) {
            console.log(`Text "${text}" X-aligned with rect, centering at (${rectCenterX}, ${rectCenterY})`);
            return { x: rectCenterX, y: rectCenterY, shouldCenter: true };
          }
        }
      }

      // Check if text is for a circle
      if (prevCmd.type === 'circle') {
        const distance = Math.sqrt((x - prevCmd.x) ** 2 + (y - prevCmd.y) ** 2);
        if (distance <= prevCmd.radius * 1.5) { // Allow some margin
          console.log(`Text "${text}" near circle, centering`);
          return { x: prevCmd.x, y: prevCmd.y, shouldCenter: true };
        }
      }
    }

    // For title texts (typically at top of canvas)
    if (y <= 100) {
      return { x: 600, y: y, shouldCenter: true }; // Always center titles
    }

    // Default: center on original position
    return { x, y, shouldCenter: true };
  };

  // Draw text with typewriter effect
  const drawAnimatedText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number, y: number,
    progress: number,
    size: number = 24,
    color: string = COLORS.white,
    commandIndex: number = -1
  ) => {
    if (progress <= 0) return;

    const charCount = Math.floor(text.length * progress);
    const displayText = text.substring(0, charCount);

    // Find optimal center position
    const position = commandIndex >= 0 ? findCenterForText(x, y, commandIndex, text) : { x, y, shouldCenter: false };

    ctx.font = `${size}px Arial`;  // Kalam 폰트를 Arial로 변경하여 측정 정확도 향상
    ctx.fillStyle = color;

    // 텍스트 너비 측정
    const metrics = ctx.measureText(displayText);
    const textWidth = metrics.width;

    // 중앙 정렬을 위한 x 위치 계산
    let finalX = position.x;
    if (position.shouldCenter) {
      // 텍스트 너비의 절반만큼 왼쪽으로 이동
      finalX = position.x - (textWidth / 2);

      // 디버그: 계산된 위치 출력 (콘솔과 파일 모두)
      const debugInfo = {
        timestamp: new Date().toISOString(),
        text: displayText,
        originalX: x,
        originalY: y,
        centerX: position.x,
        centerY: position.y,
        textWidth: textWidth,
        finalX: finalX,
        shouldCenter: position.shouldCenter
      };

      console.log('🎯 Text Centering Debug:', debugInfo);

      // 로컬 스토리지에도 저장
      const existingLogs = localStorage.getItem('textCenteringLogs') || '[]';
      const logs = JSON.parse(existingLogs);
      logs.push(debugInfo);
      // 최근 50개만 유지
      if (logs.length > 50) logs.shift();
      localStorage.setItem('textCenteringLogs', JSON.stringify(logs));
    }

    // textBaseline을 middle로 설정하여 수직 중앙 정렬
    ctx.textBaseline = 'middle';

    // textAlign은 left로 고정 (위치를 직접 계산하므로)
    ctx.textAlign = 'left';

    // Draw text at calculated position
    ctx.fillText(displayText, finalX, position.y);

    // 디버그 정보 텍스트로 항상 표시 (애니메이션과 무관하게)
    ctx.save();
    ctx.font = '12px Arial';
    ctx.fillStyle = 'red';
    ctx.fillText(`DEBUG: ${displayText}`, 10, 20); // 화면 좌상단에 표시
    ctx.fillStyle = 'yellow';
    ctx.fillText(`[x:${Math.round(finalX)}, w:${Math.round(textWidth)}]`, finalX, position.y - 20);
    ctx.restore();

    // 디버그: 중앙 정렬 가이드라인 그리기 (개발 시 참고용)
    if (false) { // 복잡한 디버그는 일단 비활성화
      // 박스 중심점 표시 (빨간색 십자선)
      ctx.save(); // 현재 컨텍스트 저장
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 2; // 더 두껍게
      ctx.beginPath();
      ctx.moveTo(position.x - 10, position.y);
      ctx.lineTo(position.x + 10, position.y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(position.x, position.y - 10);
      ctx.lineTo(position.x, position.y + 10);
      ctx.stroke();

      // 텍스트 경계 박스 표시 (녹색)
      ctx.strokeStyle = 'lime';
      ctx.lineWidth = 2;
      const textHeight = size * 1.2; // 대략적인 텍스트 높이
      ctx.strokeRect(finalX, position.y - textHeight/2, textWidth, textHeight);

      // 계산된 중심점 표시 (파란색 점)
      ctx.fillStyle = 'blue';
      ctx.beginPath();
      ctx.arc(finalX + textWidth/2, position.y, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore(); // 컨텍스트 복원
    }

    // Add cursor at the end while typing
    if (progress < 1) {
      const textWidth = ctx.measureText(displayText).width;
      ctx.fillRect(x + textWidth + 2, y - size/2, 2, size);
    }
  };

  // Draw animated arrow
  const drawAnimatedArrow = (
    ctx: CanvasRenderingContext2D,
    x1: number, y1: number,
    x2: number, y2: number,
    progress: number,
    color: string = COLORS.primary
  ) => {
    if (progress <= 0) return;

    // Draw line part
    drawAnimatedLine(ctx, x1, y1, x2, y2, progress, color);

    // Draw arrowhead if line is complete enough
    if (progress > 0.7) {
      const angle = Math.atan2(y2 - y1, x2 - x1);
      const headLength = 15;
      const headProgress = (progress - 0.7) / 0.3;

      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;

      ctx.beginPath();
      ctx.moveTo(x2, y2);
      ctx.lineTo(
        x2 - headLength * Math.cos(angle - Math.PI / 6) * headProgress,
        y2 - headLength * Math.sin(angle - Math.PI / 6) * headProgress
      );
      ctx.moveTo(x2, y2);
      ctx.lineTo(
        x2 - headLength * Math.cos(angle + Math.PI / 6) * headProgress,
        y2 - headLength * Math.sin(angle + Math.PI / 6) * headProgress
      );
      ctx.stroke();
    }
  };

  // Draw animated path
  const drawAnimatedPath = (
    ctx: CanvasRenderingContext2D,
    points: Array<{x: number; y: number}>,
    progress: number,
    color: string = COLORS.primary,
    closed: boolean = false
  ) => {
    if (progress <= 0 || points.length < 2) return;

    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    addHandDrawnEffect(ctx);

    const totalSegments = points.length - 1;
    const currentSegment = Math.floor(totalSegments * progress);
    const segmentProgress = (totalSegments * progress) - currentSegment;

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    // Draw completed segments
    for (let i = 1; i <= currentSegment && i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const midX = (prev.x + curr.x) / 2 + (Math.random() - 0.5) * 2;
      const midY = (prev.y + curr.y) / 2 + (Math.random() - 0.5) * 2;
      ctx.quadraticCurveTo(midX, midY, curr.x, curr.y);
    }

    // Draw current segment with progress
    if (currentSegment < totalSegments) {
      const prev = points[currentSegment];
      const next = points[currentSegment + 1];
      const currentX = prev.x + (next.x - prev.x) * segmentProgress;
      const currentY = prev.y + (next.y - prev.y) * segmentProgress;
      const midX = (prev.x + currentX) / 2 + (Math.random() - 0.5) * 2;
      const midY = (prev.y + currentY) / 2 + (Math.random() - 0.5) * 2;
      ctx.quadraticCurveTo(midX, midY, currentX, currentY);
    }

    if (closed && progress >= 1) {
      ctx.closePath();
    }

    ctx.stroke();
  };

  // Draw highlight effect
  const drawHighlight = (
    ctx: CanvasRenderingContext2D,
    x: number, y: number,
    width: number, height: number,
    color: string = COLORS.yellow
  ) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.globalAlpha = 0.5;
    ctx.strokeRect(x - 5, y - 5, width + 10, height + 10);

    // Glow effect
    ctx.shadowColor = color;
    ctx.shadowBlur = 20;
    ctx.strokeRect(x - 5, y - 5, width + 10, height + 10);

    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  };

  // Execute a single command
  const executeCommand = useCallback(
    (ctx: CanvasRenderingContext2D, command: DrawCommand, progress: number, commandIndex: number = -1) => {
      if (!command || !command.type) return;
      switch (command.type) {
        case 'line':
          drawAnimatedLine(
            ctx,
            command.x1, command.y1, command.x2, command.y2,
            progress,
            command.color,
            command.width
          );
          break;

        case 'rect':
          drawAnimatedRect(
            ctx,
            command.x, command.y, command.width, command.height,
            progress,
            command.color,
            command.filled
          );
          break;

        case 'circle':
          drawAnimatedCircle(
            ctx,
            command.x, command.y, command.radius,
            progress,
            command.color,
            command.filled
          );
          break;

        case 'text':
          drawAnimatedText(
            ctx,
            command.text,
            command.x, command.y,
            progress,
            command.size,
            command.color,
            commandIndex
          );
          break;

        case 'arrow':
          drawAnimatedArrow(
            ctx,
            command.x1, command.y1, command.x2, command.y2,
            progress,
            command.color
          );
          break;

        case 'path':
          drawAnimatedPath(
            ctx,
            command.points,
            progress,
            command.color,
            command.closed
          );
          break;

        case 'highlight':
          if (progress > 0.5) {
            drawHighlight(
              ctx,
              command.x, command.y, command.width, command.height,
              command.color
            );
          }
          break;

        case 'clear':
          ctx.fillStyle = COLORS.bg;
          ctx.fillRect(0, 0, width, height);
          break;

        case 'parallel':
          // Execute all parallel commands with same progress
          command.commands.forEach(cmd => executeCommand(ctx, cmd, progress));
          break;

        default:
          console.warn('Unknown command type:', (command as any).type);
          break;
      }
    },
    [width, height]
  );

  // Animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = COLORS.bg;
    ctx.fillRect(0, 0, width, height);

    // Draw all completed commands
    for (let i = 0; i < currentCommandIndex; i++) {
      executeCommand(ctx, commands[i], 1, i);
    }

    // Draw current command with progress
    if (currentCommandIndex < commands.length) {
      const currentCommand = commands[currentCommandIndex];

      // Handle wait command
      if (currentCommand.type === 'wait') {
        const waitDuration = currentCommand.duration / speed;
        if (!startTimeRef.current) {
          startTimeRef.current = performance.now();
        }
        const elapsed = performance.now() - startTimeRef.current;
        if (elapsed >= waitDuration) {
          setCurrentCommandIndex(prev => prev + 1);
          startTimeRef.current = 0;
          setProgress(0);
        }
      } else {
        executeCommand(ctx, currentCommand, progress, currentCommandIndex);

        // Update progress
        const newProgress = progress + (0.02 * speed);
        if (newProgress >= 1) {
          setCurrentCommandIndex(prev => prev + 1);
          setProgress(0);
        } else {
          setProgress(newProgress);
        }
      }
    } else if (loop) {
      // Loop animation
      setCurrentCommandIndex(0);
      setProgress(0);
    } else {
      // Animation complete
      setIsPlaying(false);
      if (onComplete) onComplete();
    }

    if (isPlaying) {
      animationFrameRef.current = requestAnimationFrame(animate);
    }
  }, [currentCommandIndex, progress, commands, isPlaying, loop, speed, executeCommand, width, height, onComplete]);

  // Start/stop animation
  useEffect(() => {
    if (isPlaying) {
      animationFrameRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, animate]);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = width;
    canvas.height = height;

    // Initial clear
    ctx.fillStyle = COLORS.bg;
    ctx.fillRect(0, 0, width, height);
  }, [width, height]);

  return (
    <div className="relative rounded-lg overflow-hidden shadow-2xl" style={{ maxWidth: `${width}px`, maxHeight: `${height}px` }}>
      <canvas
        ref={canvasRef}
        className="block w-full h-auto"
        style={{
          backgroundColor: COLORS.bg,
          maxWidth: '100%',
          objectFit: 'contain'
        }}
      />

      {/* Control Panel */}
      <div className="absolute bottom-4 left-4 flex gap-2">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-bold"
          style={{ fontFamily: 'Kalam, cursive' }}
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <button
          onClick={() => {
            setCurrentCommandIndex(0);
            setProgress(0);
            setIsPlaying(true);
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-bold"
          style={{ fontFamily: 'Kalam, cursive' }}
        >
          Restart
        </button>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 px-4 py-2 rounded-lg">
        <div className="flex items-center gap-2">
          <span className="text-white text-sm" style={{ fontFamily: 'Kalam, cursive' }}>
            Step {currentCommandIndex + 1} / {commands.length}
          </span>
          <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all"
              style={{ width: `${(currentCommandIndex / commands.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}