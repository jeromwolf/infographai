"use client";
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ProcessFlowTemplate;
const react_1 = __importStar(require("react"));
function ProcessFlowTemplate({ title = "Process Flow", steps = [
    { id: '1', title: 'Start', icon: 'start' },
    { id: '2', title: 'Input Data', description: 'Receive user input', icon: 'data' },
    { id: '3', title: 'Process', description: 'Transform data', icon: 'process' },
    { id: '4', title: 'Validate?', description: 'Check results', icon: 'decision', highlight: true },
    { id: '5', title: 'Output', description: 'Return results', icon: 'process' },
    { id: '6', title: 'End', icon: 'end' }
], orientation = 'horizontal', showProgress = true, animationSpeed = 500 }) {
    const canvasRef = (0, react_1.useRef)(null);
    const [currentStep, setCurrentStep] = (0, react_1.useState)(0);
    const animationRef = (0, react_1.useRef)();
    // KodeKloud color palette - EXACTLY matching their style
    const COLORS = {
        bg: '#0a0a0a',
        primaryGreen: '#4ade80',
        brightGreen: '#22c55e',
        white: '#ffffff',
        blue: '#3b82f6',
        yellow: '#fbbf24',
        red: '#ef4444',
        gray: '#6b7280',
        darkGray: '#374151'
    };
    // Hand-drawn effect with controlled randomness
    const handDrawnPath = (ctx, points, closed = false) => {
        if (points.length < 2)
            return;
        ctx.beginPath();
        // Start with slight offset
        const startX = points[0].x + (Math.random() - 0.5) * 1.5;
        const startY = points[0].y + (Math.random() - 0.5) * 1.5;
        ctx.moveTo(startX, startY);
        // Draw with subtle quadratic curves for organic feel
        for (let i = 1; i < points.length; i++) {
            const prev = points[i - 1];
            const curr = points[i];
            const cpX = (prev.x + curr.x) / 2 + (Math.random() - 0.5) * 3;
            const cpY = (prev.y + curr.y) / 2 + (Math.random() - 0.5) * 3;
            const endX = curr.x + (Math.random() - 0.5) * 1.5;
            const endY = curr.y + (Math.random() - 0.5) * 1.5;
            ctx.quadraticCurveTo(cpX, cpY, endX, endY);
        }
        if (closed) {
            const cpX = (points[points.length - 1].x + points[0].x) / 2 + (Math.random() - 0.5) * 3;
            const cpY = (points[points.length - 1].y + points[0].y) / 2 + (Math.random() - 0.5) * 3;
            ctx.quadraticCurveTo(cpX, cpY, startX, startY);
            ctx.closePath();
        }
    };
    // Draw shapes exactly like KodeKloud
    const drawShape = (ctx, type, x, y, width, height, color, filled = false) => {
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        switch (type) {
            case 'start':
            case 'end':
                // Rounded rectangle (capsule shape)
                handDrawnPath(ctx, [
                    { x: x + 20, y: y },
                    { x: x + width - 20, y: y },
                    { x: x + width, y: y + height / 2 },
                    { x: x + width - 20, y: y + height },
                    { x: x + 20, y: y + height },
                    { x: x, y: y + height / 2 }
                ], true);
                break;
            case 'process':
                // Rectangle
                handDrawnPath(ctx, [
                    { x: x, y: y },
                    { x: x + width, y: y },
                    { x: x + width, y: y + height },
                    { x: x, y: y + height }
                ], true);
                break;
            case 'decision':
                // Diamond
                handDrawnPath(ctx, [
                    { x: x + width / 2, y: y },
                    { x: x + width, y: y + height / 2 },
                    { x: x + width / 2, y: y + height },
                    { x: x, y: y + height / 2 }
                ], true);
                break;
            case 'data':
                // Parallelogram
                handDrawnPath(ctx, [
                    { x: x + 20, y: y },
                    { x: x + width, y: y },
                    { x: x + width - 20, y: y + height },
                    { x: x, y: y + height }
                ], true);
                break;
            default:
                // Default rectangle
                handDrawnPath(ctx, [
                    { x: x, y: y },
                    { x: x + width, y: y },
                    { x: x + width, y: y + height },
                    { x: x, y: y + height }
                ], true);
        }
        if (filled) {
            ctx.fill();
        }
        ctx.stroke();
    };
    // Draw arrow with perfect KodeKloud style
    const drawArrow = (ctx, x1, y1, x2, y2, color = COLORS.primaryGreen, animated = false) => {
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = 2.5;
        if (animated) {
            ctx.setLineDash([8, 8]);
        }
        else {
            ctx.setLineDash([]);
        }
        // Draw line
        handDrawnPath(ctx, [{ x: x1, y: y1 }, { x: x2, y: y2 }]);
        ctx.stroke();
        // Draw arrowhead
        const angle = Math.atan2(y2 - y1, x2 - x1);
        const headLength = 12;
        ctx.beginPath();
        ctx.moveTo(x2, y2);
        ctx.lineTo(x2 - headLength * Math.cos(angle - Math.PI / 6), y2 - headLength * Math.sin(angle - Math.PI / 6));
        ctx.moveTo(x2, y2);
        ctx.lineTo(x2 - headLength * Math.cos(angle + Math.PI / 6), y2 - headLength * Math.sin(angle + Math.PI / 6));
        ctx.stroke();
        ctx.setLineDash([]);
    };
    // Draw text with KodeKloud's handwritten style
    const drawText = (ctx, text, x, y, fontSize = 20, color = COLORS.white, align = 'center') => {
        ctx.font = `${fontSize}px Kalam, "Comic Sans MS", cursive`;
        ctx.fillStyle = color;
        ctx.textAlign = align;
        ctx.textBaseline = 'middle';
        // Slight rotation for natural feel
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate((Math.random() - 0.5) * 0.015);
        ctx.fillText(text, 0, 0);
        ctx.restore();
    };
    (0, react_1.useEffect)(() => {
        const canvas = canvasRef.current;
        if (!canvas)
            return;
        const ctx = canvas.getContext('2d');
        if (!ctx)
            return;
        const width = 1200;
        const height = 700;
        canvas.width = width;
        canvas.height = height;
        // Clear canvas with KodeKloud background
        ctx.fillStyle = COLORS.bg;
        ctx.fillRect(0, 0, width, height);
        // Draw title
        drawText(ctx, title, width / 2, 50, 36, COLORS.primaryGreen);
        // Calculate positions for steps
        const stepWidth = 160;
        const stepHeight = 80;
        const spacing = 80;
        const totalWidth = steps.length * stepWidth + (steps.length - 1) * spacing;
        const startX = (width - totalWidth) / 2;
        const centerY = height / 2;
        // Draw steps with animation
        steps.forEach((step, index) => {
            const x = startX + index * (stepWidth + spacing);
            const y = centerY - stepHeight / 2;
            // Determine if this step should be shown
            if (index <= currentStep) {
                // Draw connection to next step
                if (index < steps.length - 1 && index < currentStep) {
                    const nextX = startX + (index + 1) * (stepWidth + spacing);
                    drawArrow(ctx, x + stepWidth, centerY, nextX, centerY, step.highlight ? COLORS.yellow : COLORS.primaryGreen, index === currentStep - 1);
                }
                // Draw step shape
                const shapeColor = step.highlight ? COLORS.yellow : COLORS.blue;
                drawShape(ctx, step.icon || 'process', x, y, stepWidth, stepHeight, shapeColor);
                // Draw step title
                drawText(ctx, step.title, x + stepWidth / 2, centerY, 18, COLORS.white);
                // Draw description if exists
                if (step.description) {
                    drawText(ctx, step.description, x + stepWidth / 2, y + stepHeight + 25, 14, COLORS.gray);
                }
                // Draw step number
                if (showProgress) {
                    ctx.beginPath();
                    ctx.arc(x + stepWidth / 2, y - 25, 15, 0, Math.PI * 2);
                    ctx.fillStyle = index <= currentStep ? COLORS.primaryGreen : COLORS.darkGray;
                    ctx.fill();
                    drawText(ctx, (index + 1).toString(), x + stepWidth / 2, y - 25, 14, COLORS.bg);
                }
            }
        });
        // Draw progress bar at bottom
        if (showProgress) {
            const progressWidth = (width - 200) * (currentStep / (steps.length - 1));
            // Background bar
            ctx.strokeStyle = COLORS.darkGray;
            ctx.lineWidth = 8;
            ctx.beginPath();
            ctx.moveTo(100, height - 50);
            ctx.lineTo(width - 100, height - 50);
            ctx.stroke();
            // Progress bar
            ctx.strokeStyle = COLORS.primaryGreen;
            ctx.lineWidth = 8;
            ctx.beginPath();
            ctx.moveTo(100, height - 50);
            ctx.lineTo(100 + progressWidth, height - 50);
            ctx.stroke();
            // Progress text
            drawText(ctx, `Step ${currentStep + 1} of ${steps.length}`, width / 2, height - 20, 16, COLORS.gray);
        }
    }, [currentStep, steps, title, showProgress]);
    // Animation loop
    (0, react_1.useEffect)(() => {
        if (currentStep < steps.length - 1) {
            animationRef.current = window.setTimeout(() => {
                setCurrentStep(prev => prev + 1);
            }, animationSpeed);
        }
        return () => {
            if (animationRef.current) {
                clearTimeout(animationRef.current);
            }
        };
    }, [currentStep, steps.length, animationSpeed]);
    return (<div className="relative rounded-lg overflow-hidden shadow-2xl">
      <canvas ref={canvasRef} className="block"/>

      {/* Control buttons */}
      <div className="absolute bottom-4 left-4 flex gap-2">
        <button onClick={() => setCurrentStep(0)} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-bold" style={{ fontFamily: 'Kalam, cursive' }}>
          Restart
        </button>
        <button onClick={() => setCurrentStep(Math.min(currentStep + 1, steps.length - 1))} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-bold" style={{ fontFamily: 'Kalam, cursive' }}>
          Next Step
        </button>
      </div>
    </div>);
}
