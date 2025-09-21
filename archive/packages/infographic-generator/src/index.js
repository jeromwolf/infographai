"use strict";
/**
 * Infographic Generator
 * SVG/Canvas 기반 인포그래픽 자동 생성 시스템
 */
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InfographicGenerator = void 0;
const canvas_1 = require("canvas");
const sharp_1 = __importDefault(require("sharp"));
const d3 = __importStar(require("d3"));
const winston_1 = __importDefault(require("winston"));
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
class InfographicGenerator {
    logger;
    outputDir;
    defaultOptions = {
        width: 1920,
        height: 1080,
        backgroundColor: '#ffffff',
        fontFamily: 'Arial, sans-serif',
        outputFormat: 'png',
        quality: 90
    };
    constructor(outputDir = './output/infographics') {
        this.outputDir = outputDir;
        // Logger 설정
        this.logger = winston_1.default.createLogger({
            level: 'info',
            format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.json()),
            transports: [
                new winston_1.default.transports.Console(),
                new winston_1.default.transports.File({ filename: 'infographic-generator.log' })
            ]
        });
        // 출력 디렉토리 생성
        this.ensureOutputDir();
    }
    async ensureOutputDir() {
        try {
            await promises_1.default.mkdir(this.outputDir, { recursive: true });
        }
        catch (error) {
            this.logger.error('Failed to create output directory', { error });
        }
    }
    /**
     * GPT 설명을 기반으로 인포그래픽 생성
     */
    async generateFromDescription(description, options) {
        const opts = { ...this.defaultOptions, ...options };
        const canvas = (0, canvas_1.createCanvas)(opts.width, opts.height);
        const ctx = canvas.getContext('2d');
        // 배경 설정
        ctx.fillStyle = opts.backgroundColor;
        ctx.fillRect(0, 0, opts.width, opts.height);
        // 색상 스킴 적용
        const colors = description.colorScheme || ['#3498db', '#2ecc71', '#f39c12', '#e74c3c'];
        // 제목 렌더링
        this.renderTitle(ctx, description.title, opts.width, opts.height);
        // 요소들 렌더링
        for (const element of description.elements) {
            await this.renderElement(ctx, element, opts.width, opts.height, colors);
        }
        // 파일 저장
        const filename = `infographic_${Date.now()}`;
        const asset = await this.saveCanvas(canvas, filename, opts);
        this.logger.info('Infographic generated', {
            title: description.title,
            elements: description.elements.length,
            format: opts.outputFormat
        });
        return asset;
    }
    /**
     * 제목 렌더링
     */
    renderTitle(ctx, title, width, height) {
        ctx.font = 'bold 48px Arial';
        ctx.fillStyle = '#2c3e50';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(title, width / 2, 50);
    }
    /**
     * 개별 요소 렌더링
     */
    async renderElement(ctx, element, width, height, colors) {
        const x = (element.position.x / 100) * width;
        const y = (element.position.y / 100) * height;
        switch (element.type) {
            case 'text':
                this.renderText(ctx, element.content, x, y, element.style);
                break;
            case 'shape':
                this.renderShape(ctx, element.content, x, y, element.style, colors);
                break;
            case 'icon':
                await this.renderIcon(ctx, element.content, x, y, element.style);
                break;
            case 'arrow':
                this.renderArrow(ctx, x, y, element.style);
                break;
            case 'chart':
                await this.renderMiniChart(ctx, element.content, x, y, element.style);
                break;
        }
    }
    /**
     * 텍스트 렌더링
     */
    renderText(ctx, text, x, y, style) {
        ctx.font = style.fontSize || '16px Arial';
        ctx.fillStyle = style.color || '#333333';
        ctx.textAlign = style.align || 'left';
        ctx.textBaseline = style.baseline || 'top';
        // 긴 텍스트는 줄바꿈 처리
        const maxWidth = style.maxWidth || 300;
        const lines = this.wrapText(text, maxWidth, ctx);
        const lineHeight = parseInt(style.fontSize || '16') * 1.2;
        lines.forEach((line, index) => {
            ctx.fillText(line, x, y + (index * lineHeight));
        });
    }
    /**
     * 텍스트 줄바꿈
     */
    wrapText(text, maxWidth, ctx) {
        const words = text.split(' ');
        const lines = [];
        let currentLine = '';
        for (const word of words) {
            const testLine = currentLine ? `${currentLine} ${word}` : word;
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxWidth && currentLine) {
                lines.push(currentLine);
                currentLine = word;
            }
            else {
                currentLine = testLine;
            }
        }
        if (currentLine) {
            lines.push(currentLine);
        }
        return lines;
    }
    /**
     * 도형 렌더링
     */
    renderShape(ctx, shape, x, y, style, colors) {
        const size = style.size || 50;
        const color = style.color || colors[0];
        ctx.fillStyle = color;
        ctx.strokeStyle = style.borderColor || color;
        ctx.lineWidth = style.borderWidth || 2;
        switch (shape.toLowerCase()) {
            case 'circle':
                ctx.beginPath();
                ctx.arc(x, y, size / 2, 0, Math.PI * 2);
                ctx.fill();
                if (style.border)
                    ctx.stroke();
                break;
            case 'rectangle':
            case 'rect':
                const width = style.width || size;
                const height = style.height || size;
                ctx.fillRect(x - width / 2, y - height / 2, width, height);
                if (style.border) {
                    ctx.strokeRect(x - width / 2, y - height / 2, width, height);
                }
                break;
            case 'triangle':
                ctx.beginPath();
                ctx.moveTo(x, y - size / 2);
                ctx.lineTo(x - size / 2, y + size / 2);
                ctx.lineTo(x + size / 2, y + size / 2);
                ctx.closePath();
                ctx.fill();
                if (style.border)
                    ctx.stroke();
                break;
        }
    }
    /**
     * 아이콘 렌더링 (플레이스홀더)
     */
    async renderIcon(ctx, iconName, x, y, style) {
        // 실제 구현에서는 아이콘 라이브러리 사용
        // 여기서는 간단한 기호로 대체
        const size = style.size || 32;
        const color = style.color || '#666666';
        ctx.font = `${size}px Arial`;
        ctx.fillStyle = color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const iconMap = {
            'check': '✓',
            'star': '★',
            'heart': '♥',
            'arrow': '→',
            'info': 'ⓘ',
            'warning': '⚠',
            'code': '</>'
        };
        const icon = iconMap[iconName.toLowerCase()] || '●';
        ctx.fillText(icon, x, y);
    }
    /**
     * 화살표 렌더링
     */
    renderArrow(ctx, x, y, style) {
        const length = style.length || 100;
        const angle = (style.angle || 0) * Math.PI / 180;
        const headSize = style.headSize || 10;
        const color = style.color || '#333333';
        const endX = x + length * Math.cos(angle);
        const endY = y + length * Math.sin(angle);
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = style.width || 2;
        // 화살표 몸통
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        // 화살표 머리
        ctx.beginPath();
        ctx.moveTo(endX, endY);
        ctx.lineTo(endX - headSize * Math.cos(angle - Math.PI / 6), endY - headSize * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(endX - headSize * Math.cos(angle + Math.PI / 6), endY - headSize * Math.sin(angle + Math.PI / 6));
        ctx.closePath();
        ctx.fill();
    }
    /**
     * 미니 차트 렌더링
     */
    async renderMiniChart(ctx, chartData, x, y, style) {
        // 간단한 막대 차트
        try {
            const data = JSON.parse(chartData);
            const values = data.values || [30, 45, 60, 35, 70];
            const width = style.width || 200;
            const height = style.height || 100;
            const barWidth = width / values.length;
            const maxValue = Math.max(...values);
            ctx.fillStyle = style.color || '#3498db';
            values.forEach((value, index) => {
                const barHeight = (value / maxValue) * height;
                ctx.fillRect(x + (index * barWidth) + 2, y + height - barHeight, barWidth - 4, barHeight);
            });
        }
        catch (error) {
            this.logger.error('Failed to render mini chart', { error });
        }
    }
    /**
     * 차트 생성
     */
    async generateChart(type, data, options) {
        const opts = { ...this.defaultOptions, ...options };
        const canvas = (0, canvas_1.createCanvas)(opts.width, opts.height);
        const ctx = canvas.getContext('2d');
        // 배경
        ctx.fillStyle = opts.backgroundColor;
        ctx.fillRect(0, 0, opts.width, opts.height);
        // 차트 렌더링
        switch (type) {
            case 'bar':
                this.renderBarChart(ctx, data, opts.width, opts.height);
                break;
            case 'pie':
                this.renderPieChart(ctx, data, opts.width, opts.height);
                break;
            case 'line':
                this.renderLineChart(ctx, data, opts.width, opts.height);
                break;
            default:
                throw new Error(`Unsupported chart type: ${type}`);
        }
        // 파일 저장
        const filename = `chart_${type}_${Date.now()}`;
        const asset = await this.saveCanvas(canvas, filename, opts);
        this.logger.info('Chart generated', { type, dataPoints: data.values.length });
        return asset;
    }
    /**
     * 막대 차트
     */
    renderBarChart(ctx, data, width, height) {
        const margin = { top: 50, right: 50, bottom: 100, left: 100 };
        const chartWidth = width - margin.left - margin.right;
        const chartHeight = height - margin.top - margin.bottom;
        const barWidth = chartWidth / data.values.length;
        const maxValue = Math.max(...data.values);
        const colors = data.colors || ['#3498db'];
        // 막대 그리기
        data.values.forEach((value, index) => {
            const barHeight = (value / maxValue) * chartHeight;
            const x = margin.left + (index * barWidth) + barWidth * 0.1;
            const y = margin.top + chartHeight - barHeight;
            ctx.fillStyle = colors[index % colors.length];
            ctx.fillRect(x, y, barWidth * 0.8, barHeight);
            // 값 표시
            ctx.fillStyle = '#333';
            ctx.font = '14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(value.toString(), x + barWidth * 0.4, y - 10);
            // 라벨
            ctx.save();
            ctx.translate(x + barWidth * 0.4, margin.top + chartHeight + 20);
            ctx.rotate(-Math.PI / 4);
            ctx.fillText(data.labels[index] || '', 0, 0);
            ctx.restore();
        });
        // 축 그리기
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(margin.left, margin.top);
        ctx.lineTo(margin.left, margin.top + chartHeight);
        ctx.lineTo(margin.left + chartWidth, margin.top + chartHeight);
        ctx.stroke();
    }
    /**
     * 파이 차트
     */
    renderPieChart(ctx, data, width, height) {
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) * 0.3;
        const colors = data.colors || d3.schemeCategory10;
        const total = data.values.reduce((sum, val) => sum + val, 0);
        let currentAngle = -Math.PI / 2;
        data.values.forEach((value, index) => {
            const sliceAngle = (value / total) * Math.PI * 2;
            // 파이 조각
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
            ctx.closePath();
            ctx.fillStyle = colors[index % colors.length];
            ctx.fill();
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.stroke();
            // 라벨
            const labelAngle = currentAngle + sliceAngle / 2;
            const labelX = centerX + Math.cos(labelAngle) * (radius * 1.3);
            const labelY = centerY + Math.sin(labelAngle) * (radius * 1.3);
            ctx.fillStyle = '#333';
            ctx.font = '14px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(`${data.labels[index]}: ${Math.round((value / total) * 100)}%`, labelX, labelY);
            currentAngle += sliceAngle;
        });
    }
    /**
     * 선 차트
     */
    renderLineChart(ctx, data, width, height) {
        const margin = { top: 50, right: 50, bottom: 100, left: 100 };
        const chartWidth = width - margin.left - margin.right;
        const chartHeight = height - margin.top - margin.bottom;
        const pointSpacing = chartWidth / (data.values.length - 1);
        const maxValue = Math.max(...data.values);
        const minValue = Math.min(...data.values);
        const valueRange = maxValue - minValue;
        // 선 그리기
        ctx.strokeStyle = data.colors?.[0] || '#3498db';
        ctx.lineWidth = 3;
        ctx.beginPath();
        data.values.forEach((value, index) => {
            const x = margin.left + (index * pointSpacing);
            const y = margin.top + chartHeight - ((value - minValue) / valueRange) * chartHeight;
            if (index === 0) {
                ctx.moveTo(x, y);
            }
            else {
                ctx.lineTo(x, y);
            }
            // 데이터 포인트
            ctx.fillStyle = '#fff';
            ctx.strokeStyle = data.colors?.[0] || '#3498db';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            // 값 표시
            ctx.fillStyle = '#333';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(value.toString(), x, y - 15);
            // 라벨
            ctx.save();
            ctx.translate(x, margin.top + chartHeight + 20);
            ctx.rotate(-Math.PI / 4);
            ctx.fillText(data.labels[index] || '', 0, 0);
            ctx.restore();
        });
        ctx.strokeStyle = data.colors?.[0] || '#3498db';
        ctx.lineWidth = 3;
        ctx.stroke();
        // 축 그리기
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(margin.left, margin.top);
        ctx.lineTo(margin.left, margin.top + chartHeight);
        ctx.lineTo(margin.left + chartWidth, margin.top + chartHeight);
        ctx.stroke();
    }
    /**
     * 캔버스 저장
     */
    async saveCanvas(canvas, filename, options) {
        const pngPath = path_1.default.join(this.outputDir, `${filename}.png`);
        // PNG 저장
        const buffer = canvas.toBuffer('image/png');
        await promises_1.default.writeFile(pngPath, buffer);
        // Sharp로 최적화
        if (options.quality && options.quality < 100) {
            await (0, sharp_1.default)(pngPath)
                .png({ quality: options.quality })
                .toFile(pngPath + '.optimized');
            await promises_1.default.rename(pngPath + '.optimized', pngPath);
        }
        const stats = await promises_1.default.stat(pngPath);
        return {
            type: 'infographic',
            format: 'png',
            path: pngPath,
            width: canvas.width,
            height: canvas.height,
            size: stats.size
        };
    }
    /**
     * 다이어그램 생성 (플로우차트, 마인드맵 등)
     */
    async generateDiagram(type, nodes, edges, options) {
        // D3.js를 사용한 복잡한 다이어그램 생성
        // 여기서는 간단한 구현
        const opts = { ...this.defaultOptions, ...options };
        const canvas = (0, canvas_1.createCanvas)(opts.width, opts.height);
        const ctx = canvas.getContext('2d');
        // 배경
        ctx.fillStyle = opts.backgroundColor;
        ctx.fillRect(0, 0, opts.width, opts.height);
        // 노드와 엣지 렌더링
        // ... (구현 생략)
        const filename = `diagram_${type}_${Date.now()}`;
        return await this.saveCanvas(canvas, filename, opts);
    }
}
exports.InfographicGenerator = InfographicGenerator;
