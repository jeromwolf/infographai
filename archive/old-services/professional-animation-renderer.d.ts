import { EnhancedScene } from './ai-scenario-generator';
export declare class ProfessionalAnimationRenderer {
    private width;
    private height;
    private fps;
    private colors;
    renderScene(scene: EnhancedScene, frameNumber: number, totalFrames: number): Promise<Buffer>;
    private renderCenterLayout;
    private renderSplitLayout;
    private renderGridLayout;
    private renderTimelineLayout;
    private renderComparisonLayout;
    private createBackground;
    private createAnimatedBackground;
    private renderTitle;
    private renderVisualElements;
    private renderIcon;
    private renderChart;
    private renderDiagram;
    private renderCode;
    private renderText;
    private renderGridItem;
    private renderComparisonCard;
    private renderDataPoints;
    private calculateElementProgress;
    private getAnimatedOpacity;
}
//# sourceMappingURL=professional-animation-renderer.d.ts.map