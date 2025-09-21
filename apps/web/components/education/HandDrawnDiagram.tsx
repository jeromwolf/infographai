"use client";

import React, { useEffect, useRef, useState } from 'react';

interface HandDrawnDiagramProps {
  width?: number;
  height?: number;
  theme?: 'dark' | 'light';
  animationSpeed?: number;
}

export default function HandDrawnDiagram({
  width = 1200,
  height = 700,
  theme = 'dark',
  animationSpeed = 1
}: HandDrawnDiagramProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Hand-drawn font style
  const handwritingFont = '"Kalam", "Comic Sans MS", cursive';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = width;
    canvas.height = height;

    // Background color
    ctx.fillStyle = theme === 'dark' ? '#0a0a0a' : '#f8f8f8';
    ctx.fillRect(0, 0, width, height);

    // Drawing settings for hand-drawn effect
    ctx.strokeStyle = theme === 'dark' ? '#4ade80' : '#059669';
    ctx.fillStyle = theme === 'dark' ? '#ffffff' : '#1f2937';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.font = `32px ${handwritingFont}`;

    // Animation steps
    const animationSteps = [
      () => drawPDF(ctx, 200, 200),
      () => drawArrow(ctx, 350, 250, 450, 250, 'Dress Code'),
      () => drawArrow(ctx, 150, 150, 200, 100, 'Time off requests'),
      () => drawArrow(ctx, 150, 300, 200, 350, 'Equipment Policy'),
      () => drawText(ctx, 'Employee Handbook', 230, 250, '#ffffff'),
      () => drawDatabase(ctx, 600, 250),
      () => drawText(ctx, 'DATABASE', 570, 420, '#ffffff'),
      () => drawPerson(ctx, 850, 200, 'Can I wear jeans in the office?'),
      () => drawPerson(ctx, 850, 320, 'Can I request time off on a holiday?'),
      () => drawPerson(ctx, 850, 440, 'Can I bring my laptop home for the weekend?'),
      () => drawArrow(ctx, 750, 250, 820, 200, '', true),
      () => drawArrow(ctx, 750, 250, 820, 320, '', true),
      () => drawArrow(ctx, 750, 250, 820, 440, '', true),
    ];

    // Clear and redraw up to current step
    ctx.fillStyle = theme === 'dark' ? '#0a0a0a' : '#f8f8f8';
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i <= currentStep && i < animationSteps.length; i++) {
      animationSteps[i]();
    }

    // Helper functions
    function drawPDF(ctx: CanvasRenderingContext2D, x: number, y: number) {
      // PDF icon with hand-drawn effect
      ctx.strokeStyle = theme === 'dark' ? '#ffffff' : '#374151';
      ctx.fillStyle = '#ffffff';

      // Draw slightly wobbly rectangle for PDF
      ctx.beginPath();
      ctx.moveTo(x + Math.random() * 2, y);
      ctx.lineTo(x + 120 + Math.random() * 2, y + Math.random() * 2);
      ctx.lineTo(x + 120 + Math.random() * 2, y + 160 + Math.random() * 2);
      ctx.lineTo(x + Math.random() * 2, y + 160);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // PDF label with red background
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(x, y, 120, 40);
      ctx.fillStyle = '#ffffff';
      ctx.font = `24px ${handwritingFont}`;
      ctx.fillText('PDF', x + 35, y + 28);

      // PDF icon
      ctx.strokeStyle = '#ef4444';
      ctx.beginPath();
      ctx.moveTo(x + 30, y + 70);
      ctx.lineTo(x + 30, y + 120);
      ctx.lineTo(x + 50, y + 130);
      ctx.lineTo(x + 90, y + 130);
      ctx.lineTo(x + 90, y + 70);
      ctx.stroke();
    }

    function drawDatabase(ctx: CanvasRenderingContext2D, x: number, y: number) {
      ctx.strokeStyle = '#3b82f6';
      ctx.fillStyle = '#3b82f6';

      // Draw cylinder for database with hand-drawn effect
      for (let i = 0; i < 4; i++) {
        const yOffset = i * 40;
        const wobble = Math.random() * 2 - 1;

        // Top ellipse
        ctx.beginPath();
        ctx.ellipse(x + wobble, y + yOffset, 80, 20, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Cylinder body
        if (i < 3) {
          ctx.beginPath();
          ctx.moveTo(x - 80 + wobble, y + yOffset);
          ctx.lineTo(x - 80 + wobble, y + yOffset + 40);
          ctx.moveTo(x + 80 + wobble, y + yOffset);
          ctx.lineTo(x + 80 + wobble, y + yOffset + 40);
          ctx.stroke();
        }
      }
    }

    function drawArrow(
      ctx: CanvasRenderingContext2D,
      x1: number, y1: number,
      x2: number, y2: number,
      label: string,
      dashed = false
    ) {
      ctx.strokeStyle = theme === 'dark' ? '#4ade80' : '#059669';

      if (dashed) {
        ctx.setLineDash([8, 8]);
      }

      // Draw slightly curved line for hand-drawn effect
      const midX = (x1 + x2) / 2 + (Math.random() * 10 - 5);
      const midY = (y1 + y2) / 2 + (Math.random() * 10 - 5);

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.quadraticCurveTo(midX, midY, x2, y2);
      ctx.stroke();

      // Arrow head
      const angle = Math.atan2(y2 - y1, x2 - x1);
      ctx.beginPath();
      ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - 12 * Math.cos(angle - Math.PI / 6), y2 - 12 * Math.sin(angle - Math.PI / 6));
      ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - 12 * Math.cos(angle + Math.PI / 6), y2 - 12 * Math.sin(angle + Math.PI / 6));
      ctx.stroke();

      ctx.setLineDash([]);

      // Label
      if (label) {
        ctx.fillStyle = theme === 'dark' ? '#4ade80' : '#059669';
        ctx.font = `20px ${handwritingFont}`;
        ctx.fillText(label, midX - 40, midY - 10);
      }
    }

    function drawText(
      ctx: CanvasRenderingContext2D,
      text: string,
      x: number,
      y: number,
      color: string
    ) {
      ctx.fillStyle = color;
      ctx.font = `24px ${handwritingFont}`;

      // Add slight rotation for hand-drawn effect
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((Math.random() * 4 - 2) * Math.PI / 180);
      ctx.fillText(text, 0, 0);
      ctx.restore();
    }

    function drawPerson(
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      question: string
    ) {
      ctx.strokeStyle = theme === 'dark' ? '#ffffff' : '#1f2937';
      ctx.lineWidth = 2;

      // Simple stick figure with wobble
      const wobbleX = Math.random() * 3 - 1.5;
      const wobbleY = Math.random() * 3 - 1.5;

      // Head
      ctx.beginPath();
      ctx.arc(x + wobbleX, y + wobbleY, 15, 0, Math.PI * 2);
      ctx.stroke();

      // Body
      ctx.beginPath();
      ctx.moveTo(x + wobbleX, y + 15);
      ctx.lineTo(x + wobbleX, y + 45);
      ctx.stroke();

      // Arms
      ctx.beginPath();
      ctx.moveTo(x - 10 + wobbleX, y + 25);
      ctx.lineTo(x + 10 + wobbleX, y + 25);
      ctx.stroke();

      // Legs
      ctx.beginPath();
      ctx.moveTo(x + wobbleX, y + 45);
      ctx.lineTo(x - 8 + wobbleX, y + 65);
      ctx.moveTo(x + wobbleX, y + 45);
      ctx.lineTo(x + 8 + wobbleX, y + 65);
      ctx.stroke();

      // Question text
      ctx.fillStyle = theme === 'dark' ? '#ffffff' : '#1f2937';
      ctx.font = `18px ${handwritingFont}`;
      ctx.fillText(question, x + 40, y + 10);
    }

  }, [currentStep, width, height, theme]);

  // Animation timer
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setTimeout(() => {
      if (currentStep < 12) {
        setCurrentStep(prev => prev + 1);
      } else {
        setIsPlaying(false);
      }
    }, 800 / animationSpeed);

    return () => clearTimeout(timer);
  }, [currentStep, isPlaying, animationSpeed]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        className="rounded-lg shadow-2xl"
        style={{
          background: theme === 'dark' ? '#0a0a0a' : '#f8f8f8',
          imageRendering: 'crisp-edges'
        }}
      />

      {/* Controls */}
      <div className="absolute bottom-4 left-4 flex gap-2">
        <button
          onClick={() => {
            setCurrentStep(0);
            setIsPlaying(true);
          }}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-bold"
        >
          Replay
        </button>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-bold"
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
      </div>
    </div>
  );
}