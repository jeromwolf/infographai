/**
 * Infographic Generator
 * SVG/Canvas 기반 인포그래픽 자동 생성 시스템
 */
import { InfographicDescription } from '@infographai/gpt-service';
export interface GeneratorOptions {
    width: number;
    height: number;
    backgroundColor: string;
    fontFamily?: string;
    outputFormat: 'png' | 'svg' | 'both';
    quality?: number;
}
export type ChartType = 'bar' | 'pie' | 'line' | 'donut' | 'area';
export interface ChartData {
    labels: string[];
    values: number[];
    colors?: string[];
}
export interface GeneratedAsset {
    type: 'infographic' | 'chart' | 'diagram';
    format: 'png' | 'svg';
    path: string;
    width: number;
    height: number;
    size: number;
}
export declare class InfographicGenerator {
    private logger;
    private outputDir;
    private defaultOptions;
    constructor(outputDir?: string);
    private ensureOutputDir;
    /**
     * GPT 설명을 기반으로 인포그래픽 생성
     */
    generateFromDescription(description: InfographicDescription, options?: Partial<GeneratorOptions>): Promise<GeneratedAsset>;
    /**
     * 제목 렌더링
     */
    private renderTitle;
    /**
     * 개별 요소 렌더링
     */
    private renderElement;
    /**
     * 텍스트 렌더링
     */
    private renderText;
    /**
     * 텍스트 줄바꿈
     */
    private wrapText;
    /**
     * 도형 렌더링
     */
    private renderShape;
    /**
     * 아이콘 렌더링 (플레이스홀더)
     */
    private renderIcon;
    /**
     * 화살표 렌더링
     */
    private renderArrow;
    /**
     * 미니 차트 렌더링
     */
    private renderMiniChart;
    /**
     * 차트 생성
     */
    generateChart(type: ChartType, data: ChartData, options?: Partial<GeneratorOptions>): Promise<GeneratedAsset>;
    /**
     * 막대 차트
     */
    private renderBarChart;
    /**
     * 파이 차트
     */
    private renderPieChart;
    /**
     * 선 차트
     */
    private renderLineChart;
    /**
     * 캔버스 저장
     */
    private saveCanvas;
    /**
     * 다이어그램 생성 (플로우차트, 마인드맵 등)
     */
    generateDiagram(type: 'flowchart' | 'mindmap' | 'sequence' | 'network', nodes: any[], edges: any[], options?: Partial<GeneratorOptions>): Promise<GeneratedAsset>;
}
//# sourceMappingURL=index.d.ts.map