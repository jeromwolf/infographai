/**
 * Infographic Generator
 * SVG/Canvas 기반 인포그래픽 자동 생성 시스템
 */

import { createCanvas, Canvas, CanvasRenderingContext2D, registerFont } from 'canvas';
import sharp from 'sharp';
import * as d3 from 'd3';
import { InfographicDescription, InfographicElement } from '@infographai/gpt-service';
import winston from 'winston';
import fs from 'fs/promises';
import path from 'path';

// 인포그래픽 생성 옵션
export interface GeneratorOptions {
  width: number;
  height: number;
  backgroundColor: string;
  fontFamily?: string;
  outputFormat: 'png' | 'svg' | 'both';
  quality?: number; // PNG quality (1-100)
}

// 차트 타입
export type ChartType = 'bar' | 'pie' | 'line' | 'donut' | 'area';

// 차트 데이터
export interface ChartData {
  labels: string[];
  values: number[];
  colors?: string[];
}

// 생성된 자산
export interface GeneratedAsset {
  type: 'infographic' | 'chart' | 'diagram';
  format: 'png' | 'svg';
  path: string;
  width: number;
  height: number;
  size: number; // bytes
}

export class InfographicGenerator {
  private logger: winston.Logger;
  private outputDir: string;
  private defaultOptions: GeneratorOptions = {
    width: 1920,
    height: 1080,
    backgroundColor: '#ffffff',
    fontFamily: 'Arial, sans-serif',
    outputFormat: 'png',
    quality: 90
  };

  constructor(outputDir: string = './output/infographics') {
    this.outputDir = outputDir;

    // Logger 설정
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'infographic-generator.log' })
      ]
    });

    // 출력 디렉토리 생성
    this.ensureOutputDir();
  }

  private async ensureOutputDir() {
    try {
      await fs.mkdir(this.outputDir, { recursive: true });
    } catch (error) {
      this.logger.error('Failed to create output directory', { error });
    }
  }

  /**
   * GPT 설명을 기반으로 인포그래픽 생성
   */
  public async generateFromDescription(
    description: InfographicDescription,
    options?: Partial<GeneratorOptions>
  ): Promise<GeneratedAsset> {
    const opts = { ...this.defaultOptions, ...options };
    const canvas = createCanvas(opts.width, opts.height);
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
  private renderTitle(
    ctx: CanvasRenderingContext2D,
    title: string,
    width: number,
    height: number
  ) {
    ctx.font = 'bold 48px Arial';
    ctx.fillStyle = '#2c3e50';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(title, width / 2, 50);
  }

  /**
   * 개별 요소 렌더링
   */
  private async renderElement(
    ctx: CanvasRenderingContext2D,
    element: InfographicElement,
    width: number,
    height: number,
    colors: string[]
  ) {
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
  private renderText(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    style: Record<string, any>
  ) {
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
  private wrapText(text: string, maxWidth: number, ctx: CanvasRenderingContext2D): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const metrics = ctx.measureText(testLine);
      
      if (metrics.width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
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
  private renderShape(
    ctx: CanvasRenderingContext2D,
    shape: string,
    x: number,
    y: number,
    style: Record<string, any>,
    colors: string[]
  ) {
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
        if (style.border) ctx.stroke();
        break;
      
      case 'rectangle':
      case 'rect':
        const width = style.width || size;
        const height = style.height || size;
        ctx.fillRect(x - width/2, y - height/2, width, height);
        if (style.border) {
          ctx.strokeRect(x - width/2, y - height/2, width, height);
        }
        break;
      
      case 'triangle':
        ctx.beginPath();
        ctx.moveTo(x, y - size/2);
        ctx.lineTo(x - size/2, y + size/2);
        ctx.lineTo(x + size/2, y + size/2);
        ctx.closePath();
        ctx.fill();
        if (style.border) ctx.stroke();
        break;
    }
  }

  /**
   * 아이콘 렌더링 (플레이스홀더)
   */
  private async renderIcon(
    ctx: CanvasRenderingContext2D,
    iconName: string,
    x: number,
    y: number,
    style: Record<string, any>
  ) {
    // 실제 구현에서는 아이콘 라이브러리 사용
    // 여기서는 간단한 기호로 대체
    const size = style.size || 32;
    const color = style.color || '#666666';

    ctx.font = `${size}px Arial`;
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const iconMap: Record<string, string> = {
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
  private renderArrow(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    style: Record<string, any>
  ) {
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
    ctx.lineTo(
      endX - headSize * Math.cos(angle - Math.PI/6),
      endY - headSize * Math.sin(angle - Math.PI/6)
    );
    ctx.lineTo(
      endX - headSize * Math.cos(angle + Math.PI/6),
      endY - headSize * Math.sin(angle + Math.PI/6)
    );
    ctx.closePath();
    ctx.fill();
  }

  /**
   * 미니 차트 렌더링
   */
  private async renderMiniChart(
    ctx: CanvasRenderingContext2D,
    chartData: string,
    x: number,
    y: number,
    style: Record<string, any>
  ) {
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
        ctx.fillRect(
          x + (index * barWidth) + 2,
          y + height - barHeight,
          barWidth - 4,
          barHeight
        );
      });
    } catch (error) {
      this.logger.error('Failed to render mini chart', { error });
    }
  }

  /**
   * 차트 생성
   */
  public async generateChart(
    type: ChartType,
    data: ChartData,
    options?: Partial<GeneratorOptions>
  ): Promise<GeneratedAsset> {
    const opts = { ...this.defaultOptions, ...options };
    const canvas = createCanvas(opts.width, opts.height);
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
  private renderBarChart(
    ctx: CanvasRenderingContext2D,
    data: ChartData,
    width: number,
    height: number
  ) {
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
      ctx.fillText(
        value.toString(),
        x + barWidth * 0.4,
        y - 10
      );

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
  private renderPieChart(
    ctx: CanvasRenderingContext2D,
    data: ChartData,
    width: number,
    height: number
  ) {
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
      ctx.fillText(
        `${data.labels[index]}: ${Math.round((value/total)*100)}%`,
        labelX,
        labelY
      );

      currentAngle += sliceAngle;
    });
  }

  /**
   * 선 차트
   */
  private renderLineChart(
    ctx: CanvasRenderingContext2D,
    data: ChartData,
    width: number,
    height: number
  ) {
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
      } else {
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
  private async saveCanvas(
    canvas: Canvas,
    filename: string,
    options: GeneratorOptions
  ): Promise<GeneratedAsset> {
    const pngPath = path.join(this.outputDir, `${filename}.png`);
    
    // PNG 저장
    const buffer = canvas.toBuffer('image/png');
    await fs.writeFile(pngPath, buffer);

    // Sharp로 최적화
    if (options.quality && options.quality < 100) {
      await sharp(pngPath)
        .png({ quality: options.quality })
        .toFile(pngPath + '.optimized');
      
      await fs.rename(pngPath + '.optimized', pngPath);
    }

    const stats = await fs.stat(pngPath);

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
  public async generateDiagram(
    type: 'flowchart' | 'mindmap' | 'sequence' | 'network',
    nodes: any[],
    edges: any[],
    options?: Partial<GeneratorOptions>
  ): Promise<GeneratedAsset> {
    // D3.js를 사용한 복잡한 다이어그램 생성
    // 여기서는 간단한 구현
    const opts = { ...this.defaultOptions, ...options };
    const canvas = createCanvas(opts.width, opts.height);
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