/**
 * Enhanced Animation Renderer
 * Phase 2: 컨텍스트 인식 애니메이션 및 동적 템플릿 조합
 */

import sharp from 'sharp';
import { EnhancedScene } from './ai-scenario-generator';
import { smartTemplateSelector, TemplateComposition } from './smart-template-selector';
import path from 'path';
import fs from 'fs/promises';

interface AnimationContext {
  currentFrame: number;
  totalFrames: number;
  progress: number;
  sceneType: string;
  templates: TemplateComposition;
}

interface LayerConfig {
  type: 'background' | 'template' | 'content' | 'animation' | 'overlay';
  opacity: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
}

export class EnhancedAnimationRenderer {
  private width = 1920;
  private height = 1080;
  private fps = 30;

  // Enhanced color palette
  private colors = {
    primary: '#667eea',
    secondary: '#764ba2',
    accent: '#4fd1c7',
    success: '#48bb78',
    warning: '#f6ad55',
    danger: '#fc8181',
    dark: '#1a1a2e',
    light: '#f7fafc',
    gradients: {
      purple: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      teal: 'linear-gradient(135deg, #4fd1c7 0%, #81e6d9 100%)',
      orange: 'linear-gradient(135deg, #f6ad55 0%, #ed8936 100%)',
      pink: 'linear-gradient(135deg, #fc8181 0%, #f687b3 100%)'
    }
  };

  /**
   * 씬 렌더링 with 스마트 템플릿
   */
  public async renderSceneWithTemplates(
    scene: EnhancedScene,
    frameNumber: number,
    totalFrames: number,
    topic: string,
    userLevel: 'beginner' | 'intermediate' | 'advanced' = 'intermediate'
  ): Promise<Buffer> {
    // 1. 템플릿 선택
    const templates = await smartTemplateSelector.selectTemplatesForScene(
      scene,
      topic,
      userLevel
    );

    // 2. 애니메이션 컨텍스트 생성
    const context: AnimationContext = {
      currentFrame: frameNumber,
      totalFrames,
      progress: frameNumber / totalFrames,
      sceneType: scene.type,
      templates
    };

    // 3. 레이어 구성
    const layers = await this.composeLayers(scene, context);

    // 4. 레이어 합성
    return await this.compositeLayers(layers, context);
  }

  /**
   * 레이어 구성
   */
  private async composeLayers(
    scene: EnhancedScene,
    context: AnimationContext
  ): Promise<Map<string, LayerConfig>> {
    const layers = new Map<string, LayerConfig>();

    // 1. 배경 레이어
    layers.set('background', {
      type: 'background',
      opacity: 1,
      position: { x: 0, y: 0 },
      size: { width: this.width, height: this.height },
      zIndex: 0
    });

    // 2. 템플릿 레이어 (레이아웃에 따라 다르게 배치)
    switch (context.templates.layout) {
      case 'single':
        layers.set('primary-template', {
          type: 'template',
          opacity: 1,
          position: { x: 0, y: 0 },
          size: { width: this.width, height: this.height },
          zIndex: 1
        });
        break;

      case 'split':
        layers.set('primary-template', {
          type: 'template',
          opacity: 1,
          position: { x: 0, y: 0 },
          size: { width: this.width / 2, height: this.height },
          zIndex: 1
        });
        layers.set('secondary-template', {
          type: 'template',
          opacity: 1,
          position: { x: this.width / 2, y: 0 },
          size: { width: this.width / 2, height: this.height },
          zIndex: 1
        });
        break;

      case 'grid':
        const gridSize = Math.ceil(Math.sqrt(context.templates.supportingTemplates.length + 1));
        const cellWidth = this.width / gridSize;
        const cellHeight = this.height / gridSize;

        layers.set('primary-template', {
          type: 'template',
          opacity: 1,
          position: { x: 0, y: 0 },
          size: { width: cellWidth, height: cellHeight },
          zIndex: 1
        });

        context.templates.supportingTemplates.forEach((template, index) => {
          const row = Math.floor((index + 1) / gridSize);
          const col = (index + 1) % gridSize;
          layers.set(`supporting-template-${index}`, {
            type: 'template',
            opacity: 0.9,
            position: { x: col * cellWidth, y: row * cellHeight },
            size: { width: cellWidth, height: cellHeight },
            zIndex: 1
          });
        });
        break;

      case 'timeline':
        const timelineSteps = context.templates.supportingTemplates.length + 1;
        const stepWidth = this.width / timelineSteps;

        layers.set('primary-template', {
          type: 'template',
          opacity: 1,
          position: { x: 0, y: this.height / 3 },
          size: { width: stepWidth, height: this.height / 3 },
          zIndex: 1
        });

        context.templates.supportingTemplates.forEach((template, index) => {
          layers.set(`timeline-step-${index}`, {
            type: 'template',
            opacity: 0.8 + (index * 0.05),
            position: { x: (index + 1) * stepWidth, y: this.height / 3 },
            size: { width: stepWidth, height: this.height / 3 },
            zIndex: 1
          });
        });
        break;
    }

    // 3. 애니메이션 레이어
    if (context.templates.animations.length > 0) {
      layers.set('animation', {
        type: 'animation',
        opacity: this.calculateAnimationOpacity(context),
        position: { x: 0, y: 0 },
        size: { width: this.width, height: this.height },
        zIndex: 2
      });
    }

    // 4. 콘텐츠 오버레이 레이어
    layers.set('content', {
      type: 'content',
      opacity: 1,
      position: { x: 0, y: 0 },
      size: { width: this.width, height: this.height },
      zIndex: 3
    });

    return layers;
  }

  /**
   * 레이어 합성
   */
  private async compositeLayers(
    layers: Map<string, LayerConfig>,
    context: AnimationContext
  ): Promise<Buffer> {
    // Base canvas
    let composite = sharp({
      create: {
        width: this.width,
        height: this.height,
        channels: 4,
        background: { r: 26, g: 26, b: 46, alpha: 1 } // dark background
      }
    });

    // Sort layers by zIndex
    const sortedLayers = Array.from(layers.entries())
      .sort((a, b) => a[1].zIndex - b[1].zIndex);

    // Composite each layer
    const compositeInputs: sharp.OverlayOptions[] = [];

    for (const [layerName, config] of sortedLayers) {
      const layerBuffer = await this.renderLayer(layerName, config, context);
      if (layerBuffer) {
        compositeInputs.push({
          input: layerBuffer,
          left: config.position.x,
          top: config.position.y,
          blend: 'over' as const
        });
      }
    }

    if (compositeInputs.length > 0) {
      composite = composite.composite(compositeInputs);
    }

    return composite.png().toBuffer();
  }

  /**
   * 개별 레이어 렌더링
   */
  private async renderLayer(
    layerName: string,
    config: LayerConfig,
    context: AnimationContext
  ): Promise<Buffer | null> {
    switch (config.type) {
      case 'background':
        return this.renderBackgroundLayer(config);

      case 'template':
        return this.renderTemplateLayer(layerName, config, context);

      case 'animation':
        return this.renderAnimationLayer(config, context);

      case 'content':
        return this.renderContentLayer(config, context);

      case 'overlay':
        return this.renderOverlayLayer(config, context);

      default:
        return null;
    }
  }

  /**
   * 배경 레이어 렌더링
   */
  private async renderBackgroundLayer(config: LayerConfig): Promise<Buffer> {
    const svg = `
      <svg width="${config.size.width}" height="${config.size.height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${this.colors.dark};stop-opacity:1" />
            <stop offset="100%" style="stop-color:#0a0a0a;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="${config.size.width}" height="${config.size.height}" fill="url(#bgGradient)"/>
      </svg>
    `;

    return sharp(Buffer.from(svg))
      .resize(config.size.width, config.size.height)
      .png()
      .toBuffer();
  }

  /**
   * 템플릿 레이어 렌더링
   */
  private async renderTemplateLayer(
    layerName: string,
    config: LayerConfig,
    context: AnimationContext
  ): Promise<Buffer | null> {
    try {
      let templatePath = '';

      if (layerName === 'primary-template') {
        templatePath = context.templates.primaryTemplate;
      } else if (layerName.startsWith('supporting-template-')) {
        const index = parseInt(layerName.split('-')[2]);
        templatePath = context.templates.supportingTemplates[index];
      } else if (layerName === 'secondary-template' && context.templates.supportingTemplates.length > 0) {
        templatePath = context.templates.supportingTemplates[0];
      }

      if (!templatePath) return null;

      // Load template content
      const templateContent = await smartTemplateSelector.loadTemplate(templatePath);

      // Apply animations based on progress
      const animatedContent = this.applyTemplateAnimations(templateContent, context);

      return sharp(Buffer.from(animatedContent))
        .resize(config.size.width, config.size.height)
        .png()
        .toBuffer();
    } catch (error) {
      console.error(`Failed to render template layer: ${layerName}`, error);
      return null;
    }
  }

  /**
   * 애니메이션 레이어 렌더링
   */
  private async renderAnimationLayer(
    config: LayerConfig,
    context: AnimationContext
  ): Promise<Buffer> {
    const animationType = context.templates.animations[0] || 'fade-in';
    const progress = context.progress;

    const svg = `
      <svg width="${config.size.width}" height="${config.size.height}" xmlns="http://www.w3.org/2000/svg">
        ${this.generateAnimationSVG(animationType, progress, config)}
      </svg>
    `;

    return sharp(Buffer.from(svg))
      .resize(config.size.width, config.size.height)
      .png()
      .toBuffer();
  }

  /**
   * 콘텐츠 레이어 렌더링
   */
  private async renderContentLayer(
    config: LayerConfig,
    context: AnimationContext
  ): Promise<Buffer> {
    // This would render text, titles, and other dynamic content
    const svg = `
      <svg width="${config.size.width}" height="${config.size.height}" xmlns="http://www.w3.org/2000/svg">
        <!-- Dynamic content would be rendered here -->
      </svg>
    `;

    return sharp(Buffer.from(svg))
      .resize(config.size.width, config.size.height)
      .png()
      .toBuffer();
  }

  /**
   * 오버레이 레이어 렌더링
   */
  private async renderOverlayLayer(
    config: LayerConfig,
    context: AnimationContext
  ): Promise<Buffer> {
    const svg = `
      <svg width="${config.size.width}" height="${config.size.height}" xmlns="http://www.w3.org/2000/svg">
        <!-- Overlay effects like vignette, grain, etc. -->
      </svg>
    `;

    return sharp(Buffer.from(svg))
      .resize(config.size.width, config.size.height)
      .png()
      .toBuffer();
  }

  /**
   * 애니메이션 불투명도 계산
   */
  private calculateAnimationOpacity(context: AnimationContext): number {
    const { progress } = context;

    // Fade in/out logic
    if (progress < 0.1) {
      return progress * 10; // Fade in
    } else if (progress > 0.9) {
      return (1 - progress) * 10; // Fade out
    }

    return 1; // Full opacity
  }

  /**
   * 템플릿 애니메이션 적용
   */
  private applyTemplateAnimations(templateContent: string, context: AnimationContext): string {
    // Apply progress-based transformations
    let animated = templateContent;

    // Replace animation placeholders with actual values
    animated = animated.replace(/\{progress\}/g, context.progress.toString());
    animated = animated.replace(/\{frame\}/g, context.currentFrame.toString());
    animated = animated.replace(/\{opacity\}/g, this.calculateAnimationOpacity(context).toString());

    return animated;
  }

  /**
   * 애니메이션 SVG 생성
   */
  private generateAnimationSVG(
    animationType: string,
    progress: number,
    config: LayerConfig
  ): string {
    switch (animationType) {
      case 'animations/fade-in.svg':
        return `
          <rect width="${config.size.width}" height="${config.size.height}"
                fill="transparent" opacity="${progress}"/>
        `;

      case 'animations/slide-in.svg':
        const slideX = config.size.width * (1 - progress);
        return `
          <g transform="translate(${slideX}, 0)">
            <rect width="${config.size.width}" height="${config.size.height}" fill="transparent"/>
          </g>
        `;

      case 'animations/zoom-in.svg':
        const scale = 0.5 + (progress * 0.5);
        const translateX = (config.size.width * (1 - scale)) / 2;
        const translateY = (config.size.height * (1 - scale)) / 2;
        return `
          <g transform="translate(${translateX}, ${translateY}) scale(${scale})">
            <rect width="${config.size.width}" height="${config.size.height}" fill="transparent"/>
          </g>
        `;

      case 'animations/rotate.svg':
        const rotation = progress * 360;
        return `
          <g transform="rotate(${rotation}, ${config.size.width / 2}, ${config.size.height / 2})">
            <rect width="${config.size.width}" height="${config.size.height}" fill="transparent"/>
          </g>
        `;

      default:
        return '';
    }
  }

  /**
   * 컨텍스트 기반 트랜지션 생성
   */
  public async createTransition(
    fromScene: EnhancedScene,
    toScene: EnhancedScene,
    frameNumber: number,
    transitionDuration: number = 30 // 1 second at 30fps
  ): Promise<Buffer> {
    const progress = frameNumber / transitionDuration;

    // Create transition based on scene types
    const transitionType = this.selectTransitionType(fromScene.type, toScene.type);

    const svg = `
      <svg width="${this.width}" height="${this.height}" xmlns="http://www.w3.org/2000/svg">
        ${this.generateTransitionSVG(transitionType, progress)}
      </svg>
    `;

    return sharp(Buffer.from(svg))
      .resize(this.width, this.height)
      .png()
      .toBuffer();
  }

  /**
   * 트랜지션 타입 선택
   */
  private selectTransitionType(fromType: string, toType: string): string {
    // Logic to select appropriate transition
    if (fromType === 'intro' && toType === 'concept') {
      return 'fade';
    } else if (fromType === 'concept' && toType === 'process') {
      return 'slide';
    } else if (fromType === 'process' && toType === 'benefits') {
      return 'zoom';
    } else if (fromType === 'benefits' && toType === 'example') {
      return 'split';
    } else {
      return 'dissolve';
    }
  }

  /**
   * 트랜지션 SVG 생성
   */
  private generateTransitionSVG(transitionType: string, progress: number): string {
    switch (transitionType) {
      case 'fade':
        return `
          <rect width="${this.width}" height="${this.height}"
                fill="${this.colors.dark}" opacity="${1 - progress}"/>
        `;

      case 'slide':
        const slideX = this.width * progress;
        return `
          <rect x="${slideX}" y="0" width="${this.width}" height="${this.height}"
                fill="${this.colors.dark}"/>
        `;

      case 'zoom':
        const scale = 1 + (progress * 2);
        return `
          <g transform="scale(${scale})">
            <rect width="${this.width}" height="${this.height}"
                  fill="${this.colors.dark}" opacity="${1 - progress}"/>
          </g>
        `;

      case 'split':
        const splitY = this.height * progress / 2;
        return `
          <rect x="0" y="0" width="${this.width}" height="${splitY}" fill="${this.colors.dark}"/>
          <rect x="0" y="${this.height - splitY}" width="${this.width}" height="${splitY}"
                fill="${this.colors.dark}"/>
        `;

      case 'dissolve':
      default:
        return `
          <rect width="${this.width}" height="${this.height}"
                fill="${this.colors.dark}" opacity="${1 - progress}"/>
        `;
    }
  }
}

// Export singleton instance
export const enhancedAnimationRenderer = new EnhancedAnimationRenderer();