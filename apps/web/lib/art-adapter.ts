/**
 * Art Adapter - 예술적 컴포넌트와 기존 시스템 간의 브리지
 * 사이드이펙트 없이 기존 CanvasElement 형식과 호환
 */

interface CanvasElement {
  id: string;
  type: 'text' | 'rect' | 'circle' | 'arrow' | 'image' | 'line' | 'group';
  x: number;
  y: number;
  props: any;
  animation?: any;
  locked?: boolean;
  visible?: boolean;
  groupId?: string;
  children?: string[];
}

export interface ArtElement {
  type: 'generative' | 'particle' | '3d' | 'shader' | 'fractal' | 'wave';
  render: () => HTMLCanvasElement | SVGElement;
  toDataURL?: () => string;
  getConfig?: () => any;
}

export class ArtAdapter {
  private static generateId(): string {
    return `art-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 아트 요소를 기존 Canvas Element로 변환
   */
  static convertToCanvasElement(artElement: ArtElement): CanvasElement {
    try {
      const rendered = artElement.render();
      let dataUrl: string;

      if (rendered instanceof HTMLCanvasElement) {
        dataUrl = rendered.toDataURL();
      } else if (rendered instanceof SVGElement) {
        const svgString = new XMLSerializer().serializeToString(rendered);
        dataUrl = `data:image/svg+xml,${encodeURIComponent(svgString)}`;
      } else {
        throw new Error('Unsupported render output');
      }

      return {
        id: this.generateId(),
        type: 'image',
        x: 100,
        y: 100,
        props: {
          src: dataUrl,
          width: rendered instanceof HTMLCanvasElement ? rendered.width : 200,
          height: rendered instanceof HTMLCanvasElement ? rendered.height : 200,
          artType: artElement.type,
          artConfig: artElement.getConfig ? artElement.getConfig() : {}
        },
        visible: true,
        locked: false
      };
    } catch (error) {
      console.error('ArtAdapter conversion failed:', error);
      // 실패시 기본 사각형 반환 (폴백)
      return {
        id: this.generateId(),
        type: 'rect',
        x: 100,
        y: 100,
        props: {
          width: 100,
          height: 100,
          fill: '#cccccc'
        }
      };
    }
  }

  /**
   * 비디오 생성시 Sharp와 호환되는 Buffer로 변환
   */
  static async toSharpCompatible(artElement: ArtElement): Promise<Buffer> {
    try {
      const rendered = artElement.render();

      if (rendered instanceof HTMLCanvasElement) {
        const dataUrl = rendered.toDataURL('image/png');
        const base64 = dataUrl.split(',')[1];
        return Buffer.from(base64, 'base64');
      } else if (rendered instanceof SVGElement) {
        const svgString = new XMLSerializer().serializeToString(rendered);
        return Buffer.from(svgString, 'utf-8');
      }

      throw new Error('Unsupported render output for Sharp');
    } catch (error) {
      console.error('Sharp conversion failed:', error);
      // 빈 이미지 반환 (1x1 투명 PNG)
      const emptyPng = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
      return Buffer.from(emptyPng, 'base64');
    }
  }

  /**
   * Canvas Element가 아트 요소인지 확인
   */
  static isArtElement(element: CanvasElement): boolean {
    return element.type === 'image' && element.props?.artType;
  }

  /**
   * 아트 요소의 설정 업데이트
   */
  static updateArtConfig(element: CanvasElement, config: any): CanvasElement {
    if (!this.isArtElement(element)) {
      return element;
    }

    return {
      ...element,
      props: {
        ...element.props,
        artConfig: {
          ...element.props.artConfig,
          ...config
        }
      }
    };
  }

  /**
   * 성능 측정 래퍼
   */
  static measurePerformance<T>(
    name: string,
    operation: () => T
  ): T {
    const startTime = performance.now();

    try {
      const result = operation();
      const endTime = performance.now();
      const duration = endTime - startTime;

      if (duration > 100) {
        console.warn(`Art operation "${name}" took ${duration.toFixed(2)}ms`);
      }

      return result;
    } catch (error) {
      console.error(`Art operation "${name}" failed:`, error);
      throw error;
    }
  }
}

/**
 * 아트 요소 품질 설정
 */
export class ArtConfig {
  private static quality: 'low' | 'medium' | 'high' = 'medium';
  private static maxParticles = 500;
  private static enableShaders = false;
  private static enable3D = false;

  static setQuality(quality: 'low' | 'medium' | 'high') {
    this.quality = quality;

    switch (quality) {
      case 'low':
        this.maxParticles = 100;
        this.enableShaders = false;
        this.enable3D = false;
        break;
      case 'medium':
        this.maxParticles = 500;
        this.enableShaders = false;
        this.enable3D = true;
        break;
      case 'high':
        this.maxParticles = 1000;
        this.enableShaders = true;
        this.enable3D = true;
        break;
    }
  }

  static getConfig() {
    return {
      quality: this.quality,
      maxParticles: this.maxParticles,
      enableShaders: this.enableShaders,
      enable3D: this.enable3D
    };
  }
}