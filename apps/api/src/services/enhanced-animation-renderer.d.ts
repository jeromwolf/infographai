/**
 * Enhanced Animation Renderer
 * Phase 2: 컨텍스트 인식 애니메이션 및 동적 템플릿 조합
 */
import { EnhancedScene } from './ai-scenario-generator';
export declare class EnhancedAnimationRenderer {
    private width;
    private height;
    private fps;
    private colors;
    /**
     * 씬 렌더링 with 스마트 템플릿
     */
    renderSceneWithTemplates(scene: EnhancedScene, frameNumber: number, totalFrames: number, topic: string, userLevel?: 'beginner' | 'intermediate' | 'advanced'): Promise<Buffer>;
    /**
     * 레이어 구성
     */
    private composeLayers;
    /**
     * 레이어 합성
     */
    private compositeLayers;
    /**
     * 개별 레이어 렌더링
     */
    private renderLayer;
    /**
     * 배경 레이어 렌더링
     */
    private renderBackgroundLayer;
    /**
     * 템플릿 레이어 렌더링
     */
    private renderTemplateLayer;
    /**
     * 애니메이션 레이어 렌더링
     */
    private renderAnimationLayer;
    /**
     * 콘텐츠 레이어 렌더링
     */
    private renderContentLayer;
    /**
     * 오버레이 레이어 렌더링
     */
    private renderOverlayLayer;
    /**
     * 애니메이션 불투명도 계산
     */
    private calculateAnimationOpacity;
    /**
     * 템플릿 애니메이션 적용
     */
    private applyTemplateAnimations;
    /**
     * 애니메이션 SVG 생성
     */
    private generateAnimationSVG;
    /**
     * 컨텍스트 기반 트랜지션 생성
     */
    createTransition(fromScene: EnhancedScene, toScene: EnhancedScene, frameNumber: number, transitionDuration?: number): Promise<Buffer>;
    /**
     * 트랜지션 타입 선택
     */
    private selectTransitionType;
    /**
     * 트랜지션 SVG 생성
     */
    private generateTransitionSVG;
}
export declare const enhancedAnimationRenderer: EnhancedAnimationRenderer;
//# sourceMappingURL=enhanced-animation-renderer.d.ts.map