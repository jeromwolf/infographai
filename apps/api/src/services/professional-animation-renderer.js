"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfessionalAnimationRenderer = void 0;
const sharp_1 = __importDefault(require("sharp"));
class ProfessionalAnimationRenderer {
    width = 1920;
    height = 1080;
    fps = 30;
    // Professional color palette
    colors = {
        primary: '#667eea',
        secondary: '#764ba2',
        accent: '#4fd1c7',
        success: '#48bb78',
        warning: '#f6ad55',
        danger: '#fc8181',
        dark: '#2d3748',
        light: '#f7fafc',
        gradient: {
            purple: ['#667eea', '#764ba2'],
            teal: ['#4fd1c7', '#81e6d9'],
            orange: ['#f6ad55', '#ed8936'],
            pink: ['#fc8181', '#f687b3']
        }
    };
    async renderScene(scene, frameNumber, totalFrames) {
        const progress = frameNumber / totalFrames;
        // Select rendering method based on layout
        switch (scene.layout) {
            case 'center':
                return this.renderCenterLayout(scene, progress);
            case 'split':
                return this.renderSplitLayout(scene, progress);
            case 'grid':
                return this.renderGridLayout(scene, progress);
            case 'timeline':
                return this.renderTimelineLayout(scene, progress);
            case 'comparison':
                return this.renderComparisonLayout(scene, progress);
            default:
                return this.renderCenterLayout(scene, progress);
        }
    }
    async renderCenterLayout(scene, progress) {
        const svg = `
      <svg width="${this.width}" height="${this.height}" xmlns="http://www.w3.org/2000/svg">
        ${this.createBackground('gradient-radial')}
        ${this.createAnimatedBackground(progress)}
        
        <!-- Main Title -->
        <g transform="translate(${this.width / 2}, ${this.height / 2})">
          ${this.renderTitle(scene.title, scene.subtitle, progress)}
          ${this.renderVisualElements(scene.visualElements, progress, scene.animations)}
        </g>
        
        ${this.renderDataPoints(scene.dataPoints, progress)}
      </svg>
    `;
        return (0, sharp_1.default)(Buffer.from(svg)).png().toBuffer();
    }
    async renderSplitLayout(scene, progress) {
        const svg = `
      <svg width="${this.width}" height="${this.height}" xmlns="http://www.w3.org/2000/svg">
        ${this.createBackground('gradient-diagonal')}
        
        <!-- Left Panel -->
        <g transform="translate(${this.width / 4}, ${this.height / 2})">
          ${this.renderTitle(scene.title, scene.subtitle, progress)}
        </g>
        
        <!-- Right Panel -->
        <g transform="translate(${this.width * 0.75}, ${this.height / 2})">
          ${this.renderVisualElements(scene.visualElements, progress, scene.animations)}
        </g>
        
        <!-- Divider Line -->
        <line x1="${this.width / 2}" y1="100" x2="${this.width / 2}" y2="${this.height - 100}" 
              stroke="rgba(255,255,255,0.2)" stroke-width="2" 
              stroke-dasharray="${progress * 1000} 1000"/>
      </svg>
    `;
        return (0, sharp_1.default)(Buffer.from(svg)).png().toBuffer();
    }
    async renderGridLayout(scene, progress) {
        const gridCols = 3;
        const gridRows = 2;
        const cellWidth = this.width / gridCols;
        const cellHeight = (this.height - 200) / gridRows;
        const svg = `
      <svg width="${this.width}" height="${this.height}" xmlns="http://www.w3.org/2000/svg">
        ${this.createBackground('gradient-mesh')}
        
        <!-- Title Area -->
        <g transform="translate(${this.width / 2}, 80)">
          ${this.renderTitle(scene.title, scene.subtitle, progress)}
        </g>
        
        <!-- Grid Items -->
        ${scene.visualElements.map((element, index) => {
            const col = index % gridCols;
            const row = Math.floor(index / gridCols);
            const x = cellWidth * col + cellWidth / 2;
            const y = 200 + cellHeight * row + cellHeight / 2;
            const delay = index * 0.1;
            return `
            <g transform="translate(${x}, ${y})" opacity="${this.getAnimatedOpacity(progress, delay)}">
              ${this.renderGridItem(element, progress)}
            </g>
          `;
        }).join('')}
      </svg>
    `;
        return (0, sharp_1.default)(Buffer.from(svg)).png().toBuffer();
    }
    async renderTimelineLayout(scene, progress) {
        const steps = Math.min(scene.visualElements.length, 5);
        const stepWidth = (this.width - 200) / steps;
        const svg = `
      <svg width="${this.width}" height="${this.height}" xmlns="http://www.w3.org/2000/svg">
        ${this.createBackground('gradient-horizontal')}
        
        <!-- Title -->
        <text x="${this.width / 2}" y="100" font-family="Arial, sans-serif" font-size="60" 
              font-weight="bold" fill="white" text-anchor="middle">
          ${scene.title}
        </text>
        
        <!-- Timeline Line -->
        <line x1="100" y1="${this.height / 2}" x2="${100 + progress * (this.width - 200)}" y2="${this.height / 2}" 
              stroke="${this.colors.accent}" stroke-width="4"/>
        
        <!-- Timeline Steps -->
        ${Array.from({ length: steps }).map((_, index) => {
            const x = 100 + stepWidth * index + stepWidth / 2;
            const isActive = progress >= (index / steps);
            return `
            <g transform="translate(${x}, ${this.height / 2})">
              <!-- Step Circle -->
              <circle cx="0" cy="0" r="${isActive ? 30 : 20}" 
                      fill="${isActive ? this.colors.accent : this.colors.dark}" 
                      stroke="white" stroke-width="3"/>
              
              <!-- Step Number -->
              <text x="0" y="8" font-family="Arial" font-size="24" font-weight="bold" 
                    fill="white" text-anchor="middle">${index + 1}</text>
              
              <!-- Step Label -->
              <text x="0" y="70" font-family="Arial" font-size="18" 
                    fill="white" text-anchor="middle" opacity="${isActive ? 1 : 0.5}">
                ${scene.visualElements[index]?.content || `Step ${index + 1}`}
              </text>
            </g>
          `;
        }).join('')}
      </svg>
    `;
        return (0, sharp_1.default)(Buffer.from(svg)).png().toBuffer();
    }
    async renderComparisonLayout(scene, progress) {
        const svg = `
      <svg width="${this.width}" height="${this.height}" xmlns="http://www.w3.org/2000/svg">
        ${this.createBackground('gradient-vertical')}
        
        <!-- Title -->
        <text x="${this.width / 2}" y="80" font-family="Arial, sans-serif" font-size="60" 
              font-weight="bold" fill="white" text-anchor="middle">
          ${scene.title}
        </text>
        
        <!-- VS Divider -->
        <g transform="translate(${this.width / 2}, ${this.height / 2})">
          <circle cx="0" cy="0" r="50" fill="${this.colors.accent}" opacity="${Math.sin(progress * Math.PI)}"/>
          <text x="0" y="10" font-family="Arial" font-size="36" font-weight="bold" 
                fill="white" text-anchor="middle">VS</text>
        </g>
        
        <!-- Left Option -->
        <g transform="translate(${this.width / 4}, ${this.height / 2})" 
           opacity="${this.getAnimatedOpacity(progress, 0)}">
          ${this.renderComparisonCard(scene.visualElements[0], 'left')}
        </g>
        
        <!-- Right Option -->
        <g transform="translate(${this.width * 0.75}, ${this.height / 2})" 
           opacity="${this.getAnimatedOpacity(progress, 0.3)}">
          ${this.renderComparisonCard(scene.visualElements[1], 'right')}
        </g>
      </svg>
    `;
        return (0, sharp_1.default)(Buffer.from(svg)).png().toBuffer();
    }
    // Helper methods for rendering components
    createBackground(type) {
        const gradients = {
            'gradient-radial': `
        <defs>
          <radialGradient id="bg">
            <stop offset="0%" style="stop-color:${this.colors.primary};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${this.colors.secondary};stop-opacity:1" />
          </radialGradient>
        </defs>
        <rect width="${this.width}" height="${this.height}" fill="url(#bg)"/>
      `,
            'gradient-diagonal': `
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${this.colors.gradient.purple[0]};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${this.colors.gradient.purple[1]};stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="${this.width}" height="${this.height}" fill="url(#bg)"/>
      `,
            'gradient-horizontal': `
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:${this.colors.gradient.teal[0]};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${this.colors.gradient.teal[1]};stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="${this.width}" height="${this.height}" fill="url(#bg)"/>
      `,
            'gradient-vertical': `
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:${this.colors.gradient.orange[0]};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${this.colors.gradient.orange[1]};stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="${this.width}" height="${this.height}" fill="url(#bg)"/>
      `,
            'gradient-mesh': `
        <defs>
          <pattern id="mesh" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <rect width="100" height="100" fill="${this.colors.dark}" opacity="0.1"/>
            <circle cx="50" cy="50" r="1" fill="white" opacity="0.3"/>
          </pattern>
        </defs>
        <rect width="${this.width}" height="${this.height}" fill="${this.colors.primary}"/>
        <rect width="${this.width}" height="${this.height}" fill="url(#mesh)"/>
      `
        };
        return gradients[type] || gradients['gradient-radial'];
    }
    createAnimatedBackground(progress) {
        const particleCount = 20;
        const particles = Array.from({ length: particleCount }).map((_, i) => {
            const x = (i / particleCount) * this.width;
            const y = this.height * (0.3 + 0.4 * Math.sin(progress * Math.PI * 2 + i));
            const size = 2 + Math.sin(progress * Math.PI * 2 + i) * 2;
            const opacity = 0.1 + 0.2 * Math.sin(progress * Math.PI * 2 + i);
            return `<circle cx="${x}" cy="${y}" r="${size}" fill="white" opacity="${opacity}"/>`;
        });
        return `
      <g id="animated-bg">
        ${particles.join('')}
      </g>
    `;
    }
    renderTitle(title, subtitle, progress) {
        const fadeIn = Math.min(progress * 2, 1);
        const scale = 0.8 + progress * 0.2;
        return `
      <g transform="scale(${scale})">
        <text x="0" y="-20" font-family="Arial, sans-serif" font-size="72" font-weight="bold" 
              fill="white" text-anchor="middle" opacity="${fadeIn}">
          ${title}
        </text>
        ${subtitle ? `
          <text x="0" y="30" font-family="Arial, sans-serif" font-size="32" 
                fill="${this.colors.accent}" text-anchor="middle" opacity="${fadeIn * 0.8}">
            ${subtitle}
          </text>
        ` : ''}
      </g>
    `;
    }
    renderVisualElements(elements, progress, animations) {
        return elements.map((element, index) => {
            const animation = animations.find(a => a.target === element.id);
            const elementProgress = this.calculateElementProgress(progress, animation);
            switch (element.type) {
                case 'icon':
                    return this.renderIcon(element, elementProgress);
                case 'chart':
                    return this.renderChart(element, elementProgress);
                case 'diagram':
                    return this.renderDiagram(element, elementProgress);
                case 'code':
                    return this.renderCode(element, elementProgress);
                case 'text':
                    return this.renderText(element, elementProgress);
                default:
                    return '';
            }
        }).join('');
    }
    renderIcon(element, progress) {
        const size = element.style?.size === 'large' ? 100 : element.style?.size === 'small' ? 40 : 60;
        const rotation = progress * 360;
        return `
      <g transform="rotate(${rotation})" opacity="${progress}">
        <rect x="${-size / 2}" y="${-size / 2}" width="${size}" height="${size}" 
              rx="10" fill="${element.style?.color || this.colors.accent}" opacity="0.8"/>
        <text x="0" y="10" font-family="Arial" font-size="${size / 2}" fill="white" text-anchor="middle">
          ${element.content || '✓'}
        </text>
      </g>
    `;
    }
    renderChart(element, progress) {
        // Simple bar chart animation
        const bars = [0.7, 0.9, 0.5, 0.8, 0.6];
        const barWidth = 30;
        const maxHeight = 150;
        return `
      <g transform="translate(-75, 50)">
        ${bars.map((value, i) => {
            const height = value * maxHeight * Math.min(progress * 2, 1);
            const x = i * (barWidth + 10);
            return `
            <rect x="${x}" y="${-height}" width="${barWidth}" height="${height}" 
                  fill="${this.colors.gradient.teal[i % 2]}" opacity="0.9" rx="4"/>
          `;
        }).join('')}
      </g>
    `;
    }
    renderDiagram(element, progress) {
        // Simple network diagram
        const nodes = 5;
        const radius = 100;
        return `
      <g>
        ${Array.from({ length: nodes }).map((_, i) => {
            const angle = (i / nodes) * Math.PI * 2;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            const nodeProgress = Math.min((progress - i * 0.1) * 2, 1);
            return `
            <g transform="translate(${x}, ${y})" opacity="${Math.max(0, nodeProgress)}">
              <circle cx="0" cy="0" r="20" fill="${this.colors.accent}" stroke="white" stroke-width="2"/>
              ${i > 0 ? `<line x1="0" y1="0" x2="${-x}" y2="${-y}" 
                               stroke="white" stroke-width="1" opacity="0.3"/>` : ''}
            </g>
          `;
        }).join('')}
      </g>
    `;
    }
    renderCode(element, progress) {
        const lines = [
            'const result = await',
            '  process.analyze(data)',
            '  .transform()',
            '  .optimize();'
        ];
        return `
      <g transform="translate(-200, -50)">
        <rect x="-10" y="-10" width="420" height="${30 * lines.length + 20}" 
              fill="${this.colors.dark}" opacity="0.8" rx="8"/>
        ${lines.map((line, i) => {
            const charCount = Math.floor(line.length * Math.min((progress - i * 0.1) * 2, 1));
            const displayText = line.substring(0, charCount);
            return `
            <text x="0" y="${i * 30}" font-family="monospace" font-size="18" 
                  fill="${this.colors.accent}" opacity="0.9">
              ${displayText}
            </text>
          `;
        }).join('')}
      </g>
    `;
    }
    renderText(element, progress) {
        const fadeIn = Math.min(progress * 2, 1);
        return `
      <text x="0" y="0" font-family="Arial" font-size="36" fill="white" 
            text-anchor="middle" opacity="${fadeIn}">
        ${element.content}
      </text>
    `;
    }
    renderGridItem(element, progress) {
        return `
      <g>
        <rect x="-80" y="-80" width="160" height="160" rx="12" 
              fill="${this.colors.dark}" opacity="0.2"/>
        <rect x="-80" y="-80" width="160" height="160" rx="12" 
              fill="none" stroke="${this.colors.accent}" stroke-width="2" opacity="0.5"/>
        ${this.renderIcon(element, progress)}
      </g>
    `;
    }
    renderComparisonCard(element, side) {
        if (!element)
            return '';
        const color = side === 'left' ? this.colors.gradient.purple[0] : this.colors.gradient.teal[0];
        return `
      <g>
        <rect x="-150" y="-200" width="300" height="400" rx="20" 
              fill="${color}" opacity="0.1"/>
        <rect x="-150" y="-200" width="300" height="400" rx="20" 
              fill="none" stroke="${color}" stroke-width="3"/>
        <text x="0" y="0" font-family="Arial" font-size="28" fill="white" text-anchor="middle">
          ${element.content || side.toUpperCase()}
        </text>
      </g>
    `;
    }
    renderDataPoints(dataPoints, progress) {
        if (!dataPoints || dataPoints.length === 0)
            return '';
        return `
      <g transform="translate(100, ${this.height - 150})">
        ${dataPoints.map((point, index) => {
            const x = index * 300;
            const opacity = Math.min((progress - index * 0.2) * 2, 1);
            return `
            <g transform="translate(${x}, 0)" opacity="${Math.max(0, opacity)}">
              <text x="0" y="0" font-family="Arial" font-size="48" font-weight="bold" 
                    fill="${point.highlight ? this.colors.accent : 'white'}">
                ${point.value}
              </text>
              <text x="0" y="35" font-family="Arial" font-size="18" fill="white" opacity="0.8">
                ${point.label}
              </text>
            </g>
          `;
        }).join('')}
      </g>
    `;
    }
    calculateElementProgress(sceneProgress, animation) {
        if (!animation)
            return sceneProgress;
        const delay = animation.delay || 0;
        const duration = animation.duration || 1;
        const totalDuration = 5; // 5 seconds per scene
        const startTime = delay / totalDuration;
        const endTime = (delay + duration) / totalDuration;
        if (sceneProgress < startTime)
            return 0;
        if (sceneProgress > endTime)
            return 1;
        return (sceneProgress - startTime) / (endTime - startTime);
    }
    getAnimatedOpacity(progress, delay = 0) {
        const adjustedProgress = Math.max(0, progress - delay);
        return Math.min(adjustedProgress * 2, 1);
    }
}
exports.ProfessionalAnimationRenderer = ProfessionalAnimationRenderer;
