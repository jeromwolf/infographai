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
exports.default = KodeKloudCanvas;
const react_1 = __importStar(require("react"));
// KodeKloud signature colors
const KODEKLOUD_COLORS = {
    bg: '#0a0a0a',
    green: '#4ade80',
    white: '#ffffff',
    blue: '#3b82f6',
    yellow: '#fbbf24',
    red: '#ef4444',
    gray: '#6b7280',
};
function KodeKloudCanvas({ width = 1280, height = 720, backgroundColor = KODEKLOUD_COLORS.bg }) {
    const canvasRef = (0, react_1.useRef)(null);
    const [isDrawing, setIsDrawing] = (0, react_1.useState)(false);
    const [currentPath, setCurrentPath] = (0, react_1.useState)([]);
    // Hand-drawn effect: add slight randomness
    const addWobble = (value, amount = 2) => {
        return value + (Math.random() - 0.5) * amount;
    };
    // Draw a hand-drawn line
    const drawHandLine = (ctx, x1, y1, x2, y2, color = KODEKLOUD_COLORS.green, lineWidth = 3) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        // Add slight curve for organic feel
        const midX = (x1 + x2) / 2 + addWobble(0, 5);
        const midY = (y1 + y2) / 2 + addWobble(0, 5);
        ctx.beginPath();
        ctx.moveTo(addWobble(x1), addWobble(y1));
        ctx.quadraticCurveTo(midX, midY, addWobble(x2), addWobble(y2));
        ctx.stroke();
    };
    // Draw hand-drawn rectangle
    const drawHandRect = (ctx, x, y, width, height, color = KODEKLOUD_COLORS.green, filled = false) => {
        if (filled) {
            ctx.fillStyle = color;
            ctx.fillRect(x, y, width, height);
        }
        else {
            drawHandLine(ctx, x, y, x + width, y, color);
            drawHandLine(ctx, x + width, y, x + width, y + height, color);
            drawHandLine(ctx, x + width, y + height, x, y + height, color);
            drawHandLine(ctx, x, y + height, x, y, color);
        }
    };
    // Draw hand-drawn circle
    const drawHandCircle = (ctx, x, y, radius, color = KODEKLOUD_COLORS.green, filled = false) => {
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        // Draw circle with slight imperfections
        for (let i = 0; i <= 360; i += 10) {
            const angle = (i * Math.PI) / 180;
            const wobbleRadius = radius + addWobble(0, 2);
            const px = x + Math.cos(angle) * wobbleRadius;
            const py = y + Math.sin(angle) * wobbleRadius;
            if (i === 0) {
                ctx.moveTo(px, py);
            }
            else {
                ctx.lineTo(px, py);
            }
        }
        ctx.closePath();
        if (filled) {
            ctx.fill();
        }
        else {
            ctx.stroke();
        }
    };
    // Draw text with hand-drawn style
    const drawHandText = (ctx, text, x, y, fontSize = 24, color = KODEKLOUD_COLORS.white) => {
        ctx.font = `${fontSize}px Kalam, "Comic Sans MS", cursive`;
        ctx.fillStyle = color;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        // Add slight rotation for hand-drawn feel
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate((Math.random() - 0.5) * 0.02);
        ctx.fillText(text, 0, 0);
        ctx.restore();
    };
    // Draw arrow
    const drawArrow = (ctx, x1, y1, x2, y2, color = KODEKLOUD_COLORS.green) => {
        drawHandLine(ctx, x1, y1, x2, y2, color);
        // Arrowhead
        const angle = Math.atan2(y2 - y1, x2 - x1);
        const headLength = 15;
        drawHandLine(ctx, x2, y2, x2 - headLength * Math.cos(angle - Math.PI / 6), y2 - headLength * Math.sin(angle - Math.PI / 6), color, 2);
        drawHandLine(ctx, x2, y2, x2 - headLength * Math.cos(angle + Math.PI / 6), y2 - headLength * Math.sin(angle + Math.PI / 6), color, 2);
    };
    // Initialize canvas
    (0, react_1.useEffect)(() => {
        const canvas = canvasRef.current;
        if (!canvas)
            return;
        const ctx = canvas.getContext('2d');
        if (!ctx)
            return;
        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;
        // Clear and set background
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, width, height);
        // Example KodeKloud-style diagram
        // This is where we'll build our scenes
        // Title
        drawHandText(ctx, 'Container Orchestration', width / 2 - 150, 50, 32, KODEKLOUD_COLORS.green);
        // Draw some containers
        const containerWidth = 150;
        const containerHeight = 100;
        const startX = 100;
        const startY = 150;
        for (let i = 0; i < 3; i++) {
            const x = startX + i * 200;
            drawHandRect(ctx, x, startY, containerWidth, containerHeight, KODEKLOUD_COLORS.blue);
            drawHandText(ctx, `Container ${i + 1}`, x + 20, startY + 50, 18);
        }
        // Draw orchestrator
        drawHandCircle(ctx, width / 2, 400, 80, KODEKLOUD_COLORS.yellow);
        drawHandText(ctx, 'Kubernetes', width / 2 - 50, 400, 20, KODEKLOUD_COLORS.bg);
        // Draw connections
        for (let i = 0; i < 3; i++) {
            const x = startX + i * 200 + containerWidth / 2;
            drawArrow(ctx, x, startY + containerHeight, width / 2, 320, KODEKLOUD_COLORS.green);
        }
        // Add some annotations
        drawHandText(ctx, '• Automatic scaling', 100, 550, 18, KODEKLOUD_COLORS.gray);
        drawHandText(ctx, '• Load balancing', 100, 580, 18, KODEKLOUD_COLORS.gray);
        drawHandText(ctx, '• Self-healing', 100, 610, 18, KODEKLOUD_COLORS.gray);
    }, [width, height, backgroundColor]);
    return (<div className="relative rounded-lg overflow-hidden shadow-2xl">
      <canvas ref={canvasRef} className="block" style={{
            backgroundColor,
            imageRendering: 'crisp-edges'
        }}/>

      {/* Overlay Controls */}
      <div className="absolute bottom-4 left-4 flex gap-2">
        <button onClick={() => setIsDrawing(!isDrawing)} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-bold" style={{ fontFamily: 'Kalam, cursive' }}>
          {isDrawing ? 'Stop Drawing' : 'Start Drawing'}
        </button>
        <button onClick={() => {
            const canvas = canvasRef.current;
            if (!canvas)
                return;
            const ctx = canvas.getContext('2d');
            if (!ctx)
                return;
            ctx.fillStyle = backgroundColor;
            ctx.fillRect(0, 0, width, height);
        }} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-bold" style={{ fontFamily: 'Kalam, cursive' }}>
          Clear
        </button>
      </div>

      {/* Status Badge */}
      <div className="absolute top-4 right-4 px-3 py-1 bg-green-500 text-white rounded-full text-sm font-bold" style={{ fontFamily: 'Kalam, cursive' }}>
        KodeKloud Style
      </div>
    </div>);
}
