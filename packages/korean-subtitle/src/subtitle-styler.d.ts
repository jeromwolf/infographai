/**
 * 자막 스타일링 엔진
 * 시각적 효과 및 애니메이션 처리
 */
export interface SubtitleStyle {
    fontSize: number;
    fontFamily: string;
    color: string;
    backgroundColor?: string;
    opacity: number;
    position: SubtitlePosition;
    animation?: SubtitleAnimation;
    shadow?: ShadowStyle;
    outline?: OutlineStyle;
}
export interface SubtitlePosition {
    x: number;
    y: number;
    align: 'left' | 'center' | 'right';
    verticalAlign: 'top' | 'middle' | 'bottom';
}
export interface SubtitleAnimation {
    type: AnimationType;
    duration: number;
    delay?: number;
    easing?: EasingFunction;
}
export type AnimationType = 'fade-in' | 'fade-out' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'typewriter' | 'highlight' | 'bounce';
export type EasingFunction = 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'cubic-bezier';
export interface ShadowStyle {
    offsetX: number;
    offsetY: number;
    blur: number;
    color: string;
}
export interface OutlineStyle {
    width: number;
    color: string;
}
export declare class SubtitleStyler {
    private defaultStyle;
    private keywordStyle;
    private codeStyle;
    constructor();
    /**
     * 기본 자막 스타일
     */
    private createDefaultStyle;
    /**
     * 키워드 강조 스타일
     */
    private createKeywordStyle;
    /**
     * 코드 블록 스타일
     */
    private createCodeStyle;
    /**
     * 텍스트 타입별 스타일 적용
     */
    getStyleForText(_text: string, type?: TextType): SubtitleStyle;
    /**
     * 제목 스타일
     */
    private getTitleStyle;
    /**
     * 캡션 스타일
     */
    private getCaptionStyle;
    /**
     * CSS 스타일 생성
     */
    generateCSS(style: SubtitleStyle): string;
    /**
     * 애니메이션 CSS 생성
     */
    generateAnimationCSS(animation: SubtitleAnimation): string;
    /**
     * 애니메이션별 키프레임 정의
     */
    private getKeyframesForAnimation;
    /**
     * 반응형 폰트 크기 계산
     */
    getResponsiveFontSize(baseSize: number, viewportWidth: number): number;
    /**
     * 키워드 하이라이팅
     */
    highlightKeywords(text: string, keywords: string[]): string;
    /**
     * 스타일 프리셋
     */
    getPreset(presetName: PresetName): SubtitleStyle;
}
export type TextType = 'normal' | 'keyword' | 'code' | 'title' | 'caption';
export type PresetName = 'minimal' | 'bold' | 'elegant' | 'tech' | 'youtube';
//# sourceMappingURL=subtitle-styler.d.ts.map