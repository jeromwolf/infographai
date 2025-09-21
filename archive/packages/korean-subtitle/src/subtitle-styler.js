"use strict";
/**
 * 자막 스타일링 엔진
 * 시각적 효과 및 애니메이션 처리
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubtitleStyler = void 0;
class SubtitleStyler {
    defaultStyle;
    keywordStyle;
    codeStyle;
    constructor() {
        this.defaultStyle = this.createDefaultStyle();
        this.keywordStyle = this.createKeywordStyle();
        this.codeStyle = this.createCodeStyle();
    }
    /**
     * 기본 자막 스타일
     */
    createDefaultStyle() {
        return {
            fontSize: 24,
            fontFamily: "'Noto Sans KR', sans-serif",
            color: '#FFFFFF',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            opacity: 1,
            position: {
                x: 50,
                y: 85,
                align: 'center',
                verticalAlign: 'bottom'
            },
            shadow: {
                offsetX: 2,
                offsetY: 2,
                blur: 4,
                color: 'rgba(0, 0, 0, 0.8)'
            },
            animation: {
                type: 'fade-in',
                duration: 300,
                easing: 'ease-in-out'
            }
        };
    }
    /**
     * 키워드 강조 스타일
     */
    createKeywordStyle() {
        return {
            ...this.defaultStyle,
            color: '#FFD700', // Gold color for keywords
            fontSize: 26,
            animation: {
                type: 'highlight',
                duration: 500,
                easing: 'ease-in-out'
            }
        };
    }
    /**
     * 코드 블록 스타일
     */
    createCodeStyle() {
        return {
            fontSize: 20,
            fontFamily: "'Fira Code', 'Courier New', monospace",
            color: '#00FF00',
            backgroundColor: 'rgba(20, 20, 20, 0.9)',
            opacity: 1,
            position: {
                x: 50,
                y: 50,
                align: 'center',
                verticalAlign: 'middle'
            },
            outline: {
                width: 1,
                color: '#333333'
            }
        };
    }
    /**
     * 텍스트 타입별 스타일 적용
     */
    getStyleForText(_text, type = 'normal') {
        switch (type) {
            case 'keyword':
                return this.keywordStyle;
            case 'code':
                return this.codeStyle;
            case 'title':
                return this.getTitleStyle();
            case 'caption':
                return this.getCaptionStyle();
            default:
                return this.defaultStyle;
        }
    }
    /**
     * 제목 스타일
     */
    getTitleStyle() {
        return {
            ...this.defaultStyle,
            fontSize: 36,
            fontFamily: "'Noto Sans KR', sans-serif",
            position: {
                x: 50,
                y: 50,
                align: 'center',
                verticalAlign: 'middle'
            },
            animation: {
                type: 'slide-up',
                duration: 800,
                easing: 'ease-out'
            }
        };
    }
    /**
     * 캡션 스타일
     */
    getCaptionStyle() {
        return {
            ...this.defaultStyle,
            fontSize: 18,
            position: {
                x: 50,
                y: 95,
                align: 'center',
                verticalAlign: 'bottom'
            },
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
        };
    }
    /**
     * CSS 스타일 생성
     */
    generateCSS(style) {
        const css = [];
        css.push(`font-size: ${style.fontSize}px`);
        css.push(`font-family: ${style.fontFamily}`);
        css.push(`color: ${style.color}`);
        css.push(`opacity: ${style.opacity}`);
        if (style.backgroundColor) {
            css.push(`background-color: ${style.backgroundColor}`);
            css.push(`padding: 8px 16px`);
            css.push(`border-radius: 4px`);
        }
        // Position
        css.push(`position: absolute`);
        css.push(`left: ${style.position.x}%`);
        css.push(`top: ${style.position.y}%`);
        css.push(`transform: translate(-50%, -50%)`);
        css.push(`text-align: ${style.position.align}`);
        // Shadow
        if (style.shadow) {
            const { offsetX, offsetY, blur, color } = style.shadow;
            css.push(`text-shadow: ${offsetX}px ${offsetY}px ${blur}px ${color}`);
        }
        // Outline
        if (style.outline) {
            css.push(`-webkit-text-stroke: ${style.outline.width}px ${style.outline.color}`);
        }
        return css.join('; ');
    }
    /**
     * 애니메이션 CSS 생성
     */
    generateAnimationCSS(animation) {
        const keyframes = this.getKeyframesForAnimation(animation.type);
        const duration = animation.duration / 1000; // Convert to seconds
        const delay = (animation.delay || 0) / 1000;
        const easing = animation.easing || 'ease-in-out';
        return `
      animation: ${animation.type} ${duration}s ${easing} ${delay}s forwards;
      ${keyframes}
    `;
    }
    /**
     * 애니메이션별 키프레임 정의
     */
    getKeyframesForAnimation(type) {
        const animations = {
            'fade-in': `
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `,
            'fade-out': `
        @keyframes fade-out {
          from { opacity: 1; }
          to { opacity: 0; }
        }
      `,
            'slide-up': `
        @keyframes slide-up {
          from { 
            transform: translate(-50%, 20px);
            opacity: 0;
          }
          to { 
            transform: translate(-50%, 0);
            opacity: 1;
          }
        }
      `,
            'slide-down': `
        @keyframes slide-down {
          from { 
            transform: translate(-50%, -20px);
            opacity: 0;
          }
          to { 
            transform: translate(-50%, 0);
            opacity: 1;
          }
        }
      `,
            'slide-left': `
        @keyframes slide-left {
          from { 
            transform: translate(20px, -50%);
            opacity: 0;
          }
          to { 
            transform: translate(-50%, -50%);
            opacity: 1;
          }
        }
      `,
            'slide-right': `
        @keyframes slide-right {
          from { 
            transform: translate(-120%, -50%);
            opacity: 0;
          }
          to { 
            transform: translate(-50%, -50%);
            opacity: 1;
          }
        }
      `,
            'typewriter': `
        @keyframes typewriter {
          from { width: 0; }
          to { width: 100%; }
        }
      `,
            'highlight': `
        @keyframes highlight {
          0% { background-color: transparent; }
          50% { background-color: rgba(255, 215, 0, 0.3); }
          100% { background-color: transparent; }
        }
      `,
            'bounce': `
        @keyframes bounce {
          0%, 100% { transform: translate(-50%, 0); }
          50% { transform: translate(-50%, -10px); }
        }
      `
        };
        return animations[type] || '';
    }
    /**
     * 반응형 폰트 크기 계산
     */
    getResponsiveFontSize(baseSize, viewportWidth) {
        const minWidth = 320;
        const maxWidth = 1920;
        const minFontSize = baseSize * 0.6;
        const maxFontSize = baseSize * 1.2;
        if (viewportWidth <= minWidth)
            return minFontSize;
        if (viewportWidth >= maxWidth)
            return maxFontSize;
        const scale = (viewportWidth - minWidth) / (maxWidth - minWidth);
        return minFontSize + (maxFontSize - minFontSize) * scale;
    }
    /**
     * 키워드 하이라이팅
     */
    highlightKeywords(text, keywords) {
        let highlighted = text;
        keywords.forEach(keyword => {
            const regex = new RegExp(`\\b(${keyword})\\b`, 'gi');
            highlighted = highlighted.replace(regex, `<span class="keyword-highlight">$1</span>`);
        });
        return highlighted;
    }
    /**
     * 스타일 프리셋
     */
    getPreset(presetName) {
        const presets = {
            'minimal': {
                ...this.defaultStyle,
                backgroundColor: undefined,
                shadow: undefined
            },
            'bold': {
                ...this.defaultStyle,
                fontSize: 28,
                shadow: {
                    offsetX: 3,
                    offsetY: 3,
                    blur: 6,
                    color: 'rgba(0, 0, 0, 1)'
                }
            },
            'elegant': {
                ...this.defaultStyle,
                fontFamily: "'Nanum Myeongjo', serif",
                fontSize: 22,
                color: '#F8F8F8',
                backgroundColor: 'rgba(30, 30, 30, 0.6)'
            },
            'tech': {
                ...this.defaultStyle,
                fontFamily: "'IBM Plex Sans KR', sans-serif",
                color: '#00FF88',
                backgroundColor: 'rgba(0, 20, 40, 0.8)',
                outline: {
                    width: 1,
                    color: '#004444'
                }
            },
            'youtube': {
                ...this.defaultStyle,
                fontSize: 24,
                backgroundColor: 'rgba(0, 0, 0, 0.75)',
                shadow: {
                    offsetX: 2,
                    offsetY: 2,
                    blur: 3,
                    color: 'rgba(0, 0, 0, 0.9)'
                }
            }
        };
        return presets[presetName] || this.defaultStyle;
    }
}
exports.SubtitleStyler = SubtitleStyler;
