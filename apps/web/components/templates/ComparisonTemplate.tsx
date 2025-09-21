"use client";

import React, { useEffect, useRef, useState } from 'react';

interface ComparisonItem {
  label: string;
  value?: number;
  description?: string;
  color?: string;
}

interface ComparisonTemplateProps {
  title?: string;
  leftTitle?: string;
  rightTitle?: string;
  leftItems?: ComparisonItem[];
  rightItems?: ComparisonItem[];
  showVersus?: boolean;
  animate?: boolean;
}

export default function ComparisonTemplate({
  title = "Comparison Analysis",
  leftTitle = "Option A",
  rightTitle = "Option B",
  leftItems = [
    { label: 'Performance', value: 85, color: '#4ade80' },
    { label: 'Cost', value: 40, color: '#3b82f6' },
    { label: 'Scalability', value: 90, color: '#fbbf24' },
    { label: 'Ease of Use', value: 70, color: '#ef4444' }
  ],
  rightItems = [
    { label: 'Performance', value: 70, color: '#4ade80' },
    { label: 'Cost', value: 80, color: '#3b82f6' },
    { label: 'Scalability', value: 60, color: '#fbbf24' },
    { label: 'Ease of Use', value: 95, color: '#ef4444' }
  ],
  showVersus = true,
  animate = true
}: ComparisonTemplateProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [animationProgress, setAnimationProgress] = useState(0);

  // KodeKloud exact colors
  const COLORS = {
    bg: '#0a0a0a',
    primaryGreen: '#4ade80',
    white: '#ffffff',
    blue: '#3b82f6',
    yellow: '#fbbf24',
    red: '#ef4444',
    gray: '#6b7280',
    darkGray: '#374151',
    lightGray: '#9ca3af'
  };

  // Professional hand-drawn rectangle with subtle imperfections
  const drawHandRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    cornerRadius: number = 0
  ) => {
    ctx.beginPath();

    if (cornerRadius > 0) {
      // Rounded rectangle with hand-drawn effect
      const wobble = 1.5;
      ctx.moveTo(x + cornerRadius + (Math.random() - 0.5) * wobble, y);
      ctx.lineTo(x + width - cornerRadius + (Math.random() - 0.5) * wobble, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + cornerRadius);
      ctx.lineTo(x + width + (Math.random() - 0.5) * wobble, y + height - cornerRadius);
      ctx.quadraticCurveTo(x + width, y + height, x + width - cornerRadius, y + height);
      ctx.lineTo(x + cornerRadius + (Math.random() - 0.5) * wobble, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - cornerRadius);
      ctx.lineTo(x + (Math.random() - 0.5) * wobble, y + cornerRadius);
      ctx.quadraticCurveTo(x, y, x + cornerRadius, y);
    } else {
      // Simple rectangle with wobble
      const points = [
        { x: x + (Math.random() - 0.5) * 1, y: y + (Math.random() - 0.5) * 1 },
        { x: x + width + (Math.random() - 0.5) * 1, y: y + (Math.random() - 0.5) * 1 },
        { x: x + width + (Math.random() - 0.5) * 1, y: y + height + (Math.random() - 0.5) * 1 },
        { x: x + (Math.random() - 0.5) * 1, y: y + height + (Math.random() - 0.5) * 1 }
      ];

      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1];
        const curr = points[i];
        const cpX = (prev.x + curr.x) / 2 + (Math.random() - 0.5) * 2;
        const cpY = (prev.y + curr.y) / 2 + (Math.random() - 0.5) * 2;
        ctx.quadraticCurveTo(cpX, cpY, curr.x, curr.y);
      }
      ctx.closePath();
    }
  };

  // Draw progress bar with animation
  const drawProgressBar = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    value: number,
    color: string,
    label: string,
    showValue: boolean = true
  ) => {
    // Background bar
    ctx.strokeStyle = COLORS.darkGray;
    ctx.lineWidth = 2;
    drawHandRect(ctx, x, y, width, height);
    ctx.stroke();

    // Filled bar
    const fillWidth = (width - 4) * (value / 100) * animationProgress;
    if (fillWidth > 0) {
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.8;
      drawHandRect(ctx, x + 2, y + 2, fillWidth, height - 4);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    // Label
    ctx.fillStyle = COLORS.white;
    ctx.font = '16px Kalam, cursive';
    ctx.textAlign = 'left';
    ctx.fillText(label, x, y - 8);

    // Value
    if (showValue) {
      ctx.textAlign = 'right';
      ctx.fillStyle = COLORS.lightGray;
      ctx.font = '14px Kalam, cursive';
      ctx.fillText(`${Math.round(value * animationProgress)}%`, x + width, y - 8);
    }
  };

  // Draw VS divider
  const drawVSDivider = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    // Circle background
    ctx.beginPath();
    ctx.arc(x, y, 40, 0, Math.PI * 2);
    ctx.fillStyle = COLORS.red;
    ctx.fill();
    ctx.strokeStyle = COLORS.white;
    ctx.lineWidth = 3;
    ctx.stroke();

    // VS text
    ctx.fillStyle = COLORS.white;
    ctx.font = 'bold 28px Kalam, cursive';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('VS', x, y);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 1200;
    const height = 700;
    canvas.width = width;
    canvas.height = height;

    // Background
    ctx.fillStyle = COLORS.bg;
    ctx.fillRect(0, 0, width, height);

    // Title
    ctx.fillStyle = COLORS.primaryGreen;
    ctx.font = 'bold 36px Kalam, cursive';
    ctx.textAlign = 'center';
    ctx.fillText(title, width / 2, 50);

    // Draw sections
    const sectionWidth = 450;
    const leftX = 100;
    const rightX = width - leftX - sectionWidth;
    const sectionY = 120;
    const sectionHeight = 500;

    // Left section
    ctx.strokeStyle = COLORS.blue;
    ctx.lineWidth = 3;
    drawHandRect(ctx, leftX, sectionY, sectionWidth, sectionHeight, 10);
    ctx.stroke();

    // Left title
    ctx.fillStyle = COLORS.blue;
    ctx.font = 'bold 28px Kalam, cursive';
    ctx.textAlign = 'center';
    ctx.fillText(leftTitle, leftX + sectionWidth / 2, sectionY + 40);

    // Right section
    ctx.strokeStyle = COLORS.yellow;
    ctx.lineWidth = 3;
    drawHandRect(ctx, rightX, sectionY, sectionWidth, sectionHeight, 10);
    ctx.stroke();

    // Right title
    ctx.fillStyle = COLORS.yellow;
    ctx.font = 'bold 28px Kalam, cursive';
    ctx.textAlign = 'center';
    ctx.fillText(rightTitle, rightX + sectionWidth / 2, sectionY + 40);

    // VS divider
    if (showVersus) {
      drawVSDivider(ctx, width / 2, height / 2);
    }

    // Draw comparison items
    const itemStartY = sectionY + 80;
    const itemSpacing = 100;
    const barHeight = 25;

    // Left items
    leftItems.forEach((item, index) => {
      const y = itemStartY + index * itemSpacing;
      drawProgressBar(
        ctx,
        leftX + 30,
        y,
        sectionWidth - 60,
        barHeight,
        item.value || 0,
        item.color || COLORS.blue,
        item.label,
        true
      );

      if (item.description) {
        ctx.fillStyle = COLORS.gray;
        ctx.font = '12px Kalam, cursive';
        ctx.textAlign = 'left';
        ctx.fillText(item.description, leftX + 30, y + barHeight + 15);
      }
    });

    // Right items
    rightItems.forEach((item, index) => {
      const y = itemStartY + index * itemSpacing;
      drawProgressBar(
        ctx,
        rightX + 30,
        y,
        sectionWidth - 60,
        barHeight,
        item.value || 0,
        item.color || COLORS.yellow,
        item.label,
        true
      );

      if (item.description) {
        ctx.fillStyle = COLORS.gray;
        ctx.font = '12px Kalam, cursive';
        ctx.textAlign = 'left';
        ctx.fillText(item.description, rightX + 30, y + barHeight + 15);
      }
    });

    // Winner indicator (optional)
    const leftTotal = leftItems.reduce((sum, item) => sum + (item.value || 0), 0);
    const rightTotal = rightItems.reduce((sum, item) => sum + (item.value || 0), 0);

    if (animationProgress >= 1) {
      const winnerX = leftTotal > rightTotal ? leftX + sectionWidth / 2 : rightX + sectionWidth / 2;
      const winnerColor = leftTotal > rightTotal ? COLORS.blue : COLORS.yellow;

      // Draw winner badge
      ctx.save();
      ctx.translate(winnerX, sectionY - 30);
      ctx.rotate(-0.1);

      ctx.fillStyle = winnerColor;
      ctx.strokeStyle = COLORS.white;
      ctx.lineWidth = 2;

      // Star shape
      const drawStar = (cx: number, cy: number, size: number) => {
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
          const x = cx + Math.cos(angle) * size;
          const y = cy + Math.sin(angle) * size;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
          const innerAngle = angle + Math.PI / 5;
          const innerX = cx + Math.cos(innerAngle) * (size / 2);
          const innerY = cy + Math.sin(innerAngle) * (size / 2);
          ctx.lineTo(innerX, innerY);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      };

      drawStar(0, 0, 20);

      ctx.fillStyle = COLORS.white;
      ctx.font = 'bold 12px Kalam, cursive';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('WIN', 0, 0);

      ctx.restore();
    }

  }, [title, leftTitle, rightTitle, leftItems, rightItems, showVersus, animationProgress]);

  // Animation
  useEffect(() => {
    if (animate && animationProgress < 1) {
      const timer = setTimeout(() => {
        setAnimationProgress(prev => Math.min(prev + 0.02, 1));
      }, 20);
      return () => clearTimeout(timer);
    }
  }, [animate, animationProgress]);

  return (
    <div className="relative rounded-lg overflow-hidden shadow-2xl">
      <canvas ref={canvasRef} className="block" />

      {/* Controls */}
      <div className="absolute bottom-4 right-4 flex gap-2">
        <button
          onClick={() => setAnimationProgress(0)}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-bold"
          style={{ fontFamily: 'Kalam, cursive' }}
        >
          Replay
        </button>
      </div>
    </div>
  );
}