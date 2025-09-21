/**
 * Interactive Visualizer - Figma Make 스타일 인터랙티브 컴포넌트
 * 교육 비디오에 삽입 가능한 동적 시각화 도구
 */
import { EventEmitter } from 'events';
export declare class Algorithm3DVisualizer extends EventEmitter {
    private canvas;
    private speed;
    private distance;
    private depth;
    constructor(width?: number, height?: number);
    /**
     * 시간복잡도 3D 그래프 생성
     * O(1), O(log n), O(n), O(n log n), O(n²), O(2^n)
     */
    generateComplexityGraph(algorithm: string, inputSize: number[]): Promise<string>;
    /**
     * 조절 가능한 파라미터 설정
     */
    setParameters(params: {
        speed?: number;
        distance?: number;
        depth?: number;
    }): void;
    private draw3DAxes;
    private drawComplexityCurve;
    private createAnimatedSVG;
}
export declare class AlgorithmClock {
    private startTime;
    private operations;
    /**
     * 알고리즘 실행 시간 시각화
     */
    generateClockSVG(elapsed: number, operations: number): string;
    private detectComplexity;
}
export declare class CodeInspector {
    private code;
    private language;
    private highlights;
    /**
     * 실시간 코드 분석 및 시각화
     */
    inspectCode(code: string): {
        complexity: string;
        issues: string[];
        suggestions: string[];
        visualization: string;
    };
    /**
     * 실시간 편집 with 한글 주석
     */
    editWithHighlight(lineNumber: number, newCode: string, highlight: 'add' | 'remove' | 'modify'): string;
    private analyzeComplexity;
    private detectIssues;
    private generateSuggestions;
    private generateCodeFlowDiagram;
    private renderHighlightedCode;
}
export declare class KoreanColorPicker {
    private koreanPalette;
    /**
     * OKLCH 색상 공간 기반 팔레트 생성
     */
    generatePalette(baseColor: string, scheme: 'monochromatic' | 'complementary' | 'triadic' | 'korean'): string[];
    /**
     * SVG 그래픽 색상 실시간 변경
     */
    updateSVGColors(svg: string, colorMap: Map<string, string>): string;
    /**
     * 색상 접근성 검사 (WCAG 기준)
     */
    checkAccessibility(foreground: string, background: string): {
        ratio: number;
        level: 'AAA' | 'AA' | 'FAIL';
        readable: boolean;
    };
    private parseOKLCH;
    private calculateContrastRatio;
}
export declare class InteractiveVideoGenerator {
    private visualizer;
    private clock;
    private inspector;
    private colorPicker;
    constructor();
    /**
     * 인터랙티브 교육 비디오 생성
     */
    generateInteractiveVideo(topic: string, code: string, options?: {
        enable3D?: boolean;
        showClock?: boolean;
        colorScheme?: 'korean' | 'modern';
        interactive?: boolean;
    }): Promise<{
        video: string;
        interactions: any[];
        metadata: any;
    }>;
}
export default InteractiveVideoGenerator;
//# sourceMappingURL=index.d.ts.map