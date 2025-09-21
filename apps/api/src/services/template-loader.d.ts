/**
 * Template Loader System
 * 실제 SVG 템플릿 파일을 로드해서 동적 콘텐츠를 삽입하는 시스템
 */
interface TemplateData {
    title?: string;
    subtitle?: string;
    content?: string;
    code?: string;
    language?: string;
    steps?: string[];
    data?: any[];
    [key: string]: any;
}
export declare class TemplateLoader {
    private templateCache;
    private assetsPath;
    constructor();
    /**
     * 템플릿 파일을 로드하고 캐싱
     */
    loadTemplate(templatePath: string): Promise<string>;
    /**
     * 템플릿에 동적 데이터를 삽입
     */
    renderTemplateWithData(templatePath: string, data: TemplateData): Promise<string>;
    /**
     * 템플릿의 플레이스홀더를 실제 데이터로 교체
     */
    private injectData;
    /**
     * 간단한 코드 구문 하이라이팅
     */
    private highlightCode;
    /**
     * 차트 데이터를 SVG 요소로 변환
     */
    private generateChartElements;
    /**
     * HTML/XML 이스케이프
     */
    private escapeHtml;
    /**
     * 템플릿을 찾을 수 없을 때 사용할 기본 템플릿
     */
    private getFallbackTemplate;
    /**
     * 특정 템플릿 유형에 맞는 데이터 구조 생성
     */
    static createTemplateData(type: string, sceneData: any): TemplateData;
}
export {};
//# sourceMappingURL=template-loader.d.ts.map