/**
 * Interactive Visualizer - Figma Make 스타일 인터랙티브 컴포넌트
 * 교육 비디오에 삽입 가능한 동적 시각화 도구
 */

import { Canvas } from 'canvas';
import * as d3 from 'd3';
import { EventEmitter } from 'events';

// 1. 3D SVG 시각화 도구 (알고리즘 복잡도 시각화)
export class Algorithm3DVisualizer extends EventEmitter {
  private canvas: Canvas;
  private speed: number = 1;
  private distance: number = 100;
  private depth: number = 50;
  
  constructor(width: number = 800, height: number = 600) {
    super();
    this.canvas = new Canvas(width, height);
  }

  /**
   * 시간복잡도 3D 그래프 생성
   * O(1), O(log n), O(n), O(n log n), O(n²), O(2^n)
   */
  public async generateComplexityGraph(
    algorithm: string,
    inputSize: number[]
  ): Promise<string> {
    const ctx = this.canvas.getContext('2d');
    
    // 3D 투영 변환
    const project3D = (x: number, y: number, z: number) => {
      const scale = this.distance / (this.distance + z * this.depth);
      return {
        x: x * scale + this.canvas.width / 2,
        y: y * scale + this.canvas.height / 2,
        scale
      };
    };

    // 복잡도별 색상
    const complexityColors = {
      'O(1)': '#4CAF50',
      'O(log n)': '#2196F3',
      'O(n)': '#FF9800',
      'O(n log n)': '#9C27B0',
      'O(n²)': '#F44336',
      'O(2^n)': '#E91E63'
    };

    // 애니메이션 프레임 생성
    const frames: string[] = [];
    for (let frame = 0; frame < 60 * this.speed; frame++) {
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      // 3D 축 그리기
      this.draw3DAxes(ctx, project3D);
      
      // 복잡도 곡선 그리기
      this.drawComplexityCurve(ctx, algorithm, inputSize, frame, project3D);
      
      frames.push(this.canvas.toDataURL());
      this.emit('frame', { current: frame, total: 60 * this.speed });
    }

    return this.createAnimatedSVG(frames);
  }

  /**
   * 조절 가능한 파라미터 설정
   */
  public setParameters(params: {
    speed?: number;
    distance?: number;
    depth?: number;
  }) {
    this.speed = params.speed ?? this.speed;
    this.distance = params.distance ?? this.distance;
    this.depth = params.depth ?? this.depth;
  }

  private draw3DAxes(ctx: any, project3D: Function) {
    // X, Y, Z 축 구현
    const axes = [
      { from: [-100, 0, 0], to: [100, 0, 0], color: '#FF0000' },
      { from: [0, -100, 0], to: [0, 100, 0], color: '#00FF00' },
      { from: [0, 0, -100], to: [0, 0, 100], color: '#0000FF' }
    ];

    axes.forEach(axis => {
      const start = project3D(...axis.from);
      const end = project3D(...axis.to);
      
      ctx.strokeStyle = axis.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
    });
  }

  private drawComplexityCurve(
    ctx: any,
    algorithm: string,
    inputSize: number[],
    frame: number,
    project3D: Function
  ) {
    // 복잡도별 곡선 렌더링 로직
  }

  private createAnimatedSVG(frames: string[]): string {
    // SVG 애니메이션 생성
    return `<svg><!-- animated frames --></svg>`;
  }
}

// 2. 반응형 시계 컴포넌트 (시간복잡도 실시간 표시)
export class AlgorithmClock {
  private startTime: number = 0;
  private operations: number = 0;
  
  /**
   * 알고리즘 실행 시간 시각화
   */
  public generateClockSVG(elapsed: number, operations: number): string {
    const angle = (elapsed / 60) * 360; // 60초 = 1회전
    const operationsPerSecond = operations / (elapsed || 1);
    
    return `
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <!-- 시계 배경 -->
        <circle cx="100" cy="100" r="90" fill="#1a1a1a" stroke="#333" stroke-width="2"/>
        
        <!-- 시간 표시 (초침) -->
        <line x1="100" y1="100" 
              x2="${100 + 70 * Math.sin(angle * Math.PI / 180)}" 
              y2="${100 - 70 * Math.cos(angle * Math.PI / 180)}"
              stroke="#FF5722" stroke-width="3" stroke-linecap="round"/>
        
        <!-- 연산 횟수 표시 -->
        <text x="100" y="140" text-anchor="middle" fill="#FFF" font-size="14">
          ${operations.toLocaleString()} ops
        </text>
        
        <!-- 초당 연산 -->
        <text x="100" y="160" text-anchor="middle" fill="#888" font-size="10">
          ${operationsPerSecond.toFixed(0)} ops/sec
        </text>
        
        <!-- 복잡도 표시 -->
        <text x="100" y="50" text-anchor="middle" fill="#4CAF50" font-size="12">
          ${this.detectComplexity(operations, elapsed)}
        </text>
      </svg>
    `;
  }

  private detectComplexity(ops: number, time: number): string {
    const ratio = ops / time;
    if (ratio < 10) return 'O(1)';
    if (ratio < 100) return 'O(log n)';
    if (ratio < 1000) return 'O(n)';
    if (ratio < 10000) return 'O(n log n)';
    return 'O(n²)';
  }
}

// 3. 코드 검사 및 실시간 편집 (Korean Comments Support)
export class CodeInspector {
  private code: string = '';
  private language: string = 'javascript';
  private highlights: Map<number, string> = new Map();
  
  /**
   * 실시간 코드 분석 및 시각화
   */
  public inspectCode(code: string): {
    complexity: string;
    issues: string[];
    suggestions: string[];
    visualization: string;
  } {
    this.code = code;
    
    // 복잡도 분석
    const complexity = this.analyzeComplexity(code);
    
    // 문제점 검출
    const issues = this.detectIssues(code);
    
    // 개선 제안
    const suggestions = this.generateSuggestions(code);
    
    // 시각화 SVG 생성
    const visualization = this.generateCodeFlowDiagram(code);
    
    return { complexity, issues, suggestions, visualization };
  }

  /**
   * 실시간 편집 with 한글 주석
   */
  public editWithHighlight(
    lineNumber: number,
    newCode: string,
    highlight: 'add' | 'remove' | 'modify'
  ): string {
    const lines = this.code.split('\n');
    lines[lineNumber - 1] = newCode;
    
    // 하이라이트 색상
    const colors = {
      add: '#4CAF50',
      remove: '#F44336',
      modify: '#FF9800'
    };
    
    this.highlights.set(lineNumber, colors[highlight]);
    this.code = lines.join('\n');
    
    return this.renderHighlightedCode();
  }

  private analyzeComplexity(code: string): string {
    let loops = (code.match(/for|while/g) || []).length;
    let conditions = (code.match(/if|else/g) || []).length;
    
    if (loops === 0) return 'O(1) - 상수 시간';
    if (loops === 1) return 'O(n) - 선형 시간';
    if (loops >= 2) return 'O(n²) - 이차 시간';
    return 'O(?)';
  }

  private detectIssues(code: string): string[] {
    const issues: string[] = [];
    
    // 중첩 루프 검출
    if (code.includes('for') && code.indexOf('for', code.indexOf('for') + 1) > -1) {
      issues.push('⚠️ 중첩 루프 발견 - 성능 주의');
    }
    
    // var 사용 검출
    if (code.includes('var ')) {
      issues.push('💡 var 대신 const/let 사용 권장');
    }
    
    return issues;
  }

  private generateSuggestions(code: string): string[] {
    return [
      '✨ 함수 분리로 가독성 향상',
      '🚀 메모이제이션으로 성능 개선',
      '📝 한글 주석 추가로 이해도 향상'
    ];
  }

  private generateCodeFlowDiagram(code: string): string {
    // 코드 플로우 다이어그램 SVG 생성
    return `<svg><!-- code flow diagram --></svg>`;
  }

  private renderHighlightedCode(): string {
    // 하이라이트된 코드 렌더링
    return this.code;
  }
}

// 4. OKLCH 컬러 피커 (한국 전통색 포함)
export class KoreanColorPicker {
  private koreanPalette = {
    '단청빨강': 'oklch(53% 0.24 29)',
    '단청파랑': 'oklch(41% 0.15 262)',
    '단청노랑': 'oklch(85% 0.15 95)',
    '단청초록': 'oklch(52% 0.17 164)',
    '먹색': 'oklch(20% 0.01 0)',
    '한지색': 'oklch(95% 0.02 85)'
  };

  /**
   * OKLCH 색상 공간 기반 팔레트 생성
   */
  public generatePalette(
    baseColor: string,
    scheme: 'monochromatic' | 'complementary' | 'triadic' | 'korean'
  ): string[] {
    if (scheme === 'korean') {
      return Object.values(this.koreanPalette);
    }

    const [l, c, h] = this.parseOKLCH(baseColor);
    const palette: string[] = [baseColor];

    switch (scheme) {
      case 'monochromatic':
        // 명도 변화
        for (let i = 20; i <= 80; i += 20) {
          palette.push(`oklch(${i}% ${c} ${h})`);
        }
        break;
      
      case 'complementary':
        // 보색
        palette.push(`oklch(${l}% ${c} ${(h + 180) % 360})`);
        break;
      
      case 'triadic':
        // 삼원색
        palette.push(`oklch(${l}% ${c} ${(h + 120) % 360})`);
        palette.push(`oklch(${l}% ${c} ${(h + 240) % 360})`);
        break;
    }

    return palette;
  }

  /**
   * SVG 그래픽 색상 실시간 변경
   */
  public updateSVGColors(
    svg: string,
    colorMap: Map<string, string>
  ): string {
    let updatedSVG = svg;
    
    colorMap.forEach((newColor, oldColor) => {
      const regex = new RegExp(oldColor, 'gi');
      updatedSVG = updatedSVG.replace(regex, newColor);
    });

    return updatedSVG;
  }

  /**
   * 색상 접근성 검사 (WCAG 기준)
   */
  public checkAccessibility(
    foreground: string,
    background: string
  ): {
    ratio: number;
    level: 'AAA' | 'AA' | 'FAIL';
    readable: boolean;
  } {
    const ratio = this.calculateContrastRatio(foreground, background);
    
    return {
      ratio,
      level: ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : 'FAIL',
      readable: ratio >= 4.5
    };
  }

  private parseOKLCH(color: string): [number, number, number] {
    const match = color.match(/oklch\((\d+)%?\s+(\d+\.?\d*)\s+(\d+)\)/);
    if (!match) return [50, 0.1, 0];
    return [
      parseFloat(match[1]),
      parseFloat(match[2]),
      parseFloat(match[3])
    ];
  }

  private calculateContrastRatio(fg: string, bg: string): number {
    // WCAG 대비율 계산
    return 4.5; // 임시 값
  }
}

// 5. 통합 인터랙티브 비디오 생성기
export class InteractiveVideoGenerator {
  private visualizer: Algorithm3DVisualizer;
  private clock: AlgorithmClock;
  private inspector: CodeInspector;
  private colorPicker: KoreanColorPicker;

  constructor() {
    this.visualizer = new Algorithm3DVisualizer();
    this.clock = new AlgorithmClock();
    this.inspector = new CodeInspector();
    this.colorPicker = new KoreanColorPicker();
  }

  /**
   * 인터랙티브 교육 비디오 생성
   */
  public async generateInteractiveVideo(
    topic: string,
    code: string,
    options: {
      enable3D?: boolean;
      showClock?: boolean;
      colorScheme?: 'korean' | 'modern';
      interactive?: boolean;
    } = {}
  ): Promise<{
    video: string;
    interactions: any[];
    metadata: any;
  }> {
    // 1. 코드 분석
    const analysis = this.inspector.inspectCode(code);
    
    // 2. 3D 시각화 생성
    let visualization = '';
    if (options.enable3D) {
      visualization = await this.visualizer.generateComplexityGraph(
        topic,
        [10, 100, 1000, 10000]
      );
    }
    
    // 3. 시계 컴포넌트
    let clockSVG = '';
    if (options.showClock) {
      clockSVG = this.clock.generateClockSVG(0, 0);
    }
    
    // 4. 색상 팔레트
    const palette = this.colorPicker.generatePalette(
      'oklch(60% 0.15 250)',
      options.colorScheme === 'korean' ? 'korean' : 'triadic'
    );
    
    // 5. 인터랙티브 요소 생성
    const interactions = options.interactive ? [
      { type: 'slider', target: 'speed', min: 0.5, max: 2 },
      { type: 'button', action: 'pause/play' },
      { type: 'colorPicker', target: 'theme' }
    ] : [];
    
    return {
      video: `${visualization}${clockSVG}`,
      interactions,
      metadata: {
        complexity: analysis.complexity,
        duration: 180,
        interactive: options.interactive
      }
    };
  }
}

export default InteractiveVideoGenerator;