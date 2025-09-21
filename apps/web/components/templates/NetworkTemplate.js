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
exports.default = NetworkTemplate;
const react_1 = __importStar(require("react"));
function NetworkTemplate({ title = "Network Architecture", nodes = [
    { id: '1', label: 'Client', type: 'client' },
    { id: '2', label: 'Load Balancer', type: 'server' },
    { id: '3', label: 'Server 1', type: 'server' },
    { id: '4', label: 'Server 2', type: 'server' },
    { id: '5', label: 'Database', type: 'database' }
], connections = [
    { from: '1', to: '2', label: 'HTTPS' },
    { from: '2', to: '3' },
    { from: '2', to: '4' },
    { from: '3', to: '5' },
    { from: '4', to: '5' }
], theme = 'dark', animate = true }) {
    const canvasRef = (0, react_1.useRef)(null);
    const colors = {
        dark: {
            bg: '#0a0a0a',
            primary: '#4ade80',
            secondary: '#3b82f6',
            text: '#ffffff',
            accent: '#fbbf24'
        },
        light: {
            bg: '#ffffff',
            primary: '#059669',
            secondary: '#2563eb',
            text: '#1f2937',
            accent: '#f59e0b'
        }
    };
    const currentColors = colors[theme];
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
        // Clear canvas
        ctx.fillStyle = currentColors.bg;
        ctx.fillRect(0, 0, width, height);
        // Set font
        ctx.font = '24px Kalam, cursive';
        // Title
        ctx.fillStyle = currentColors.primary;
        ctx.font = '36px Kalam, cursive';
        ctx.fillText(title, 50, 60);
        // Position nodes
        const nodePositions = {
            '1': { x: 200, y: 350 },
            '2': { x: 450, y: 350 },
            '3': { x: 700, y: 250 },
            '4': { x: 700, y: 450 },
            '5': { x: 950, y: 350 }
        };
        // Draw connections with animation
        let connectionIndex = 0;
        const drawConnection = () => {
            if (connectionIndex >= connections.length) {
                // Draw nodes after connections
                drawNodes();
                return;
            }
            const conn = connections[connectionIndex];
            const from = nodePositions[conn.from];
            const to = nodePositions[conn.to];
            if (from && to) {
                // Draw line
                ctx.strokeStyle = currentColors.secondary;
                ctx.lineWidth = 3;
                ctx.lineCap = 'round';
                // Add wobble for hand-drawn effect
                const midX = (from.x + to.x) / 2 + (Math.random() - 0.5) * 10;
                const midY = (from.y + to.y) / 2 + (Math.random() - 0.5) * 10;
                ctx.beginPath();
                ctx.moveTo(from.x, from.y);
                ctx.quadraticCurveTo(midX, midY, to.x, to.y);
                ctx.stroke();
                // Draw arrow
                const angle = Math.atan2(to.y - from.y, to.x - from.x);
                ctx.beginPath();
                ctx.moveTo(to.x - 20 * Math.cos(angle), to.y - 20 * Math.sin(angle));
                ctx.lineTo(to.x - 30 * Math.cos(angle) - 10 * Math.cos(angle - Math.PI / 2), to.y - 30 * Math.sin(angle) - 10 * Math.sin(angle - Math.PI / 2));
                ctx.moveTo(to.x - 20 * Math.cos(angle), to.y - 20 * Math.sin(angle));
                ctx.lineTo(to.x - 30 * Math.cos(angle) - 10 * Math.cos(angle + Math.PI / 2), to.y - 30 * Math.sin(angle) - 10 * Math.sin(angle + Math.PI / 2));
                ctx.stroke();
                // Label
                if (conn.label) {
                    ctx.fillStyle = currentColors.accent;
                    ctx.font = '18px Kalam, cursive';
                    ctx.fillText(conn.label, midX - 20, midY - 10);
                }
            }
            connectionIndex++;
            if (animate) {
                setTimeout(drawConnection, 300);
            }
            else {
                drawConnection();
            }
        };
        const drawNodes = () => {
            nodes.forEach((node, index) => {
                const pos = nodePositions[node.id];
                if (!pos)
                    return;
                setTimeout(() => {
                    // Draw node based on type
                    ctx.fillStyle = currentColors.primary;
                    ctx.strokeStyle = currentColors.primary;
                    ctx.lineWidth = 3;
                    switch (node.type) {
                        case 'server':
                            // Draw server (rectangle)
                            ctx.strokeRect(pos.x - 60, pos.y - 30, 120, 60);
                            ctx.fillStyle = currentColors.bg;
                            ctx.fillRect(pos.x - 57, pos.y - 27, 114, 54);
                            // Server lines
                            ctx.strokeStyle = currentColors.secondary;
                            ctx.beginPath();
                            ctx.moveTo(pos.x - 40, pos.y - 10);
                            ctx.lineTo(pos.x + 40, pos.y - 10);
                            ctx.moveTo(pos.x - 40, pos.y + 10);
                            ctx.lineTo(pos.x + 40, pos.y + 10);
                            ctx.stroke();
                            break;
                        case 'database':
                            // Draw database (cylinder)
                            ctx.beginPath();
                            ctx.ellipse(pos.x, pos.y - 20, 50, 15, 0, 0, Math.PI * 2);
                            ctx.stroke();
                            ctx.beginPath();
                            ctx.moveTo(pos.x - 50, pos.y - 20);
                            ctx.lineTo(pos.x - 50, pos.y + 20);
                            ctx.moveTo(pos.x + 50, pos.y - 20);
                            ctx.lineTo(pos.x + 50, pos.y + 20);
                            ctx.stroke();
                            ctx.beginPath();
                            ctx.ellipse(pos.x, pos.y + 20, 50, 15, 0, 0, Math.PI * 2);
                            ctx.stroke();
                            break;
                        case 'client':
                            // Draw client (circle with person icon)
                            ctx.beginPath();
                            ctx.arc(pos.x, pos.y, 40, 0, Math.PI * 2);
                            ctx.stroke();
                            // Person icon
                            ctx.beginPath();
                            ctx.arc(pos.x, pos.y - 10, 10, 0, Math.PI * 2);
                            ctx.stroke();
                            ctx.beginPath();
                            ctx.moveTo(pos.x - 15, pos.y + 20);
                            ctx.lineTo(pos.x - 15, pos.y + 5);
                            ctx.lineTo(pos.x - 5, pos.y + 5);
                            ctx.lineTo(pos.x, pos.y);
                            ctx.lineTo(pos.x + 5, pos.y + 5);
                            ctx.lineTo(pos.x + 15, pos.y + 5);
                            ctx.lineTo(pos.x + 15, pos.y + 20);
                            ctx.stroke();
                            break;
                        case 'cloud':
                            // Draw cloud
                            ctx.beginPath();
                            ctx.arc(pos.x - 25, pos.y, 20, 0, Math.PI * 2);
                            ctx.arc(pos.x, pos.y - 10, 25, 0, Math.PI * 2);
                            ctx.arc(pos.x + 25, pos.y, 20, 0, Math.PI * 2);
                            ctx.closePath();
                            ctx.stroke();
                            break;
                        default:
                            // Default circle
                            ctx.beginPath();
                            ctx.arc(pos.x, pos.y, 35, 0, Math.PI * 2);
                            ctx.stroke();
                    }
                    // Label
                    ctx.fillStyle = currentColors.text;
                    ctx.font = '20px Kalam, cursive';
                    ctx.textAlign = 'center';
                    ctx.fillText(node.label, pos.x, pos.y + 60);
                }, animate ? index * 200 : 0);
            });
        };
        // Start animation
        drawConnection();
    }, [nodes, connections, title, theme, animate, currentColors]);
    return (<div className="relative rounded-lg overflow-hidden shadow-2xl">
      <canvas ref={canvasRef} className="block"/>
    </div>);
}
