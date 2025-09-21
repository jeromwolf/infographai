/**
 * Real Template Renderer
 * 실제 템플릿 파일을 사용하는 고품질 렌더러
 */
import { EnhancedScene } from './ai-scenario-generator';
export declare class RealTemplateRenderer {
    private width;
    private height;
    private fps;
    private templateLoader;
    constructor();
    renderScene(scene: EnhancedScene, frameNumber: number, totalFrames: number): Promise<Buffer>;
    private renderWithRealTemplate;
    private getTemplatePath;
    private prepareTemplateData;
    private applyAnimations;
    private applyTypewriterEffect;
    private applySlideAnimation;
    private applyFadeAnimation;
    private applyZoomAnimation;
    private applyBounceAnimation;
    private renderFallback;
}
//# sourceMappingURL=real-template-renderer.d.ts.map