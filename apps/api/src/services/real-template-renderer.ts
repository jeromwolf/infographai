/**
 * Real Template Renderer
 * 실제 템플릿 파일을 사용하는 고품질 렌더러
 */

import sharp from 'sharp';
import { EnhancedScene } from './ai-scenario-generator';
import { TemplateLoader } from './template-loader';

export class RealTemplateRenderer {
  private width = 1920;
  private height = 1080;
  private fps = 30;
  private templateLoader: TemplateLoader;

  constructor() {
    this.templateLoader = new TemplateLoader();
  }

  async renderScene(scene: EnhancedScene, frameNumber: number, totalFrames: number): Promise<Buffer> {
    const progress = frameNumber / totalFrames;

    try {
      // 실제 템플릿 파일 사용
      const svg = await this.renderWithRealTemplate(scene, progress);

      // SVG를 PNG로 변환
      return await sharp(Buffer.from(svg))
        .resize(this.width, this.height)
        .png()
        .toBuffer();

    } catch (error) {
      console.error('Real template rendering failed:', error);
      // 실패시 기본 렌더링으로 폴백
      return await this.renderFallback(scene, progress);
    }
  }

  private async renderWithRealTemplate(scene: EnhancedScene, progress: number): Promise<string> {
    // 템플릿 경로 결정
    const templatePath = this.getTemplatePath(scene);

    // 템플릿 데이터 준비
    const templateData = this.prepareTemplateData(scene, progress);

    // 실제 템플릿 로드 및 데이터 삽입
    let svg = await this.templateLoader.renderTemplateWithData(templatePath, templateData);

    // 애니메이션 효과 적용
    svg = this.applyAnimations(svg, scene, progress);

    return svg;
  }

  private getTemplatePath(scene: EnhancedScene): string {
    // 장면 유형에 따라 최적의 템플릿 선택
    switch (scene.type) {
      case 'intro':
        return 'templates/highlights/call-to-action.svg';

      case 'concept':
        if (scene.layout === 'split') {
          return 'templates/comparisons/vs-comparison.svg';
        }
        return 'templates/highlights/concept-highlight.svg';

      case 'process':
        return 'templates/processes/step-flow.svg';

      case 'example':
        // 코드가 포함된 경우 코드 에디터 템플릿 사용
        const hasCode = scene.visualElements?.some(el =>
          el.type === 'code' || el.type === 'code_block'
        );
        if (hasCode) {
          return 'templates/code-editors/python-syntax-highlight.svg';
        }
        return 'templates/terminals/nodejs-dev.svg';

      case 'benefits':
        return 'templates/comparisons/before-after.svg';

      case 'conclusion':
        return 'templates/highlights/call-to-action.svg';

      default:
        return 'templates/animations/smooth-fade-in.svg';
    }
  }

  private prepareTemplateData(scene: EnhancedScene, progress: number): any {
    const data: any = {
      title: scene.title || '',
      subtitle: scene.subtitle || '',
      content: scene.narration || '',
      primaryColor: '#667eea',
      secondaryColor: '#764ba2'
    };

    // 시각적 요소에서 데이터 추출
    if (scene.visualElements) {
      for (const element of scene.visualElements) {
        switch (element.type) {
          case 'code':
          case 'code_block':
            data.code = element.content;
            data.language = element.style?.language || 'python';
            break;

          case 'step':
          case 'process_step':
            if (!data.steps) data.steps = [];
            data.steps.push(element.content);
            break;

          case 'benefit':
          case 'benefit_card':
            if (!data.benefits) data.benefits = [];
            data.benefits.push(element.content);
            break;
        }
      }
    }

    // 데이터 포인트가 있다면 차트 데이터로 변환
    if (scene.dataPoints) {
      data.data = scene.dataPoints.map(point => ({
        label: point.label,
        value: parseFloat(point.value.toString()) || 0,
        highlight: point.highlight
      }));
    }

    // 진행률에 따른 동적 효과
    data.animationProgress = progress;

    return data;
  }

  private applyAnimations(svg: string, scene: EnhancedScene, progress: number): string {
    if (!scene.animations) return svg;

    let result = svg;

    for (const animation of scene.animations) {
      switch (animation.type) {
        case 'typewriter':
        case 'typewriterCode':
          result = this.applyTypewriterEffect(result, animation, progress);
          break;

        case 'slideIn':
        case 'slideInLeft':
        case 'slideInRight':
          result = this.applySlideAnimation(result, animation, progress);
          break;

        case 'fadeIn':
        case 'smoothFadeIn':
          result = this.applyFadeAnimation(result, animation, progress);
          break;

        case 'zoomIn':
        case 'zoomInBounce':
          result = this.applyZoomAnimation(result, animation, progress);
          break;

        case 'bounceIn':
        case 'bounceInSequence':
          result = this.applyBounceAnimation(result, animation, progress);
          break;
      }
    }

    return result;
  }

  private applyTypewriterEffect(svg: string, animation: any, progress: number): string {
    const animationStart = (animation.delay || 0) / 5; // 5초 기준으로 정규화
    const animationEnd = animationStart + (animation.duration || 2) / 5;

    if (progress < animationStart) {
      return svg.replace(/class="code-text"/g, 'class="code-text" opacity="0"');
    } else if (progress >= animationEnd) {
      return svg.replace(/class="code-text"/g, 'class="code-text" opacity="1"');
    } else {
      const typeProgress = (progress - animationStart) / (animationEnd - animationStart);
      return svg.replace(/class="code-text"/g, `class="code-text" opacity="${typeProgress}"`);
    }
  }

  private applySlideAnimation(svg: string, animation: any, progress: number): string {
    const animationStart = (animation.delay || 0) / 5;
    const animationEnd = animationStart + (animation.duration || 1) / 5;

    if (progress < animationStart) {
      return svg.replace(/transform="[^"]*"/g, 'transform="translate(-100, 0)"');
    } else if (progress >= animationEnd) {
      return svg.replace(/transform="translate\(-100, 0\)"/g, 'transform="translate(0, 0)"');
    } else {
      const slideProgress = (progress - animationStart) / (animationEnd - animationStart);
      const translateX = -100 * (1 - slideProgress);
      return svg.replace(/transform="[^"]*"/g, `transform="translate(${translateX}, 0)"`);
    }
  }

  private applyFadeAnimation(svg: string, animation: any, progress: number): string {
    const animationStart = (animation.delay || 0) / 5;
    const animationEnd = animationStart + (animation.duration || 1) / 5;

    if (progress < animationStart) {
      return svg.replace(/opacity="[^"]*"/g, 'opacity="0"');
    } else if (progress >= animationEnd) {
      return svg.replace(/opacity="0"/g, 'opacity="1"');
    } else {
      const fadeProgress = (progress - animationStart) / (animationEnd - animationStart);
      return svg.replace(/opacity="[^"]*"/g, `opacity="${fadeProgress}"`);
    }
  }

  private applyZoomAnimation(svg: string, animation: any, progress: number): string {
    const animationStart = (animation.delay || 0) / 5;
    const animationEnd = animationStart + (animation.duration || 1) / 5;

    if (progress < animationStart) {
      return svg.replace(/transform="[^"]*"/g, 'transform="scale(0)"');
    } else if (progress >= animationEnd) {
      return svg.replace(/transform="scale\(0\)"/g, 'transform="scale(1)"');
    } else {
      const zoomProgress = (progress - animationStart) / (animationEnd - animationStart);
      const scale = zoomProgress;
      return svg.replace(/transform="[^"]*"/g, `transform="scale(${scale})"`);
    }
  }

  private applyBounceAnimation(svg: string, animation: any, progress: number): string {
    const animationStart = (animation.delay || 0) / 5;
    const animationEnd = animationStart + (animation.duration || 1) / 5;

    if (progress < animationStart) {
      return svg.replace(/transform="[^"]*"/g, 'transform="scale(0) translateY(50px)"');
    } else if (progress >= animationEnd) {
      return svg.replace(/transform="scale\(0\) translateY\(50px\)"/g, 'transform="scale(1) translateY(0)"');
    } else {
      const bounceProgress = (progress - animationStart) / (animationEnd - animationStart);
      // 바운스 효과 계산 (cubic-bezier 근사)
      const bounceScale = bounceProgress < 0.5
        ? 2 * bounceProgress * bounceProgress
        : 1 - Math.pow(-2 * bounceProgress + 2, 3) / 2;
      const translateY = 50 * (1 - bounceProgress);
      return svg.replace(/transform="[^"]*"/g, `transform="scale(${bounceScale}) translateY(${translateY}px)"`);
    }
  }

  private async renderFallback(scene: EnhancedScene, progress: number): Promise<Buffer> {
    // 기본 SVG 생성
    const svg = `
      <svg width="${this.width}" height="${this.height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#667eea"/>
            <stop offset="100%" style="stop-color:#764ba2"/>
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#bg)"/>
        <text x="50%" y="40%" text-anchor="middle" fill="white" font-size="64" font-weight="bold">${scene.title || 'Title'}</text>
        <text x="50%" y="50%" text-anchor="middle" fill="white" font-size="32">${scene.subtitle || 'Subtitle'}</text>
        <text x="50%" y="60%" text-anchor="middle" fill="white" font-size="24">${(scene.narration || '').substring(0, 100)}...</text>
      </svg>
    `;

    return await sharp(Buffer.from(svg))
      .resize(this.width, this.height)
      .png()
      .toBuffer();
  }
}