/**
 * Template Loader System
 * 실제 SVG 템플릿 파일을 로드해서 동적 콘텐츠를 삽입하는 시스템
 */

import fs from 'fs/promises';
import path from 'path';

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

export class TemplateLoader {
  private templateCache: Map<string, string> = new Map();
  private assetsPath: string;

  constructor() {
    // assets 경로를 절대 경로로 설정
    this.assetsPath = path.resolve(__dirname, '../../../../assets');
  }

  /**
   * 템플릿 파일을 로드하고 캐싱
   */
  async loadTemplate(templatePath: string): Promise<string> {
    if (this.templateCache.has(templatePath)) {
      return this.templateCache.get(templatePath)!;
    }

    try {
      const fullPath = path.join(this.assetsPath, templatePath);
      const templateContent = await fs.readFile(fullPath, 'utf-8');

      this.templateCache.set(templatePath, templateContent);
      return templateContent;
    } catch (error) {
      console.warn(`Template not found: ${templatePath}. Using fallback.`);
      return this.getFallbackTemplate();
    }
  }

  /**
   * 템플릿에 동적 데이터를 삽입
   */
  async renderTemplateWithData(templatePath: string, data: TemplateData): Promise<string> {
    const template = await this.loadTemplate(templatePath);
    return this.injectData(template, data);
  }

  /**
   * 템플릿의 플레이스홀더를 실제 데이터로 교체
   */
  private injectData(template: string, data: TemplateData): string {
    let result = template;

    // 기본 텍스트 교체
    if (data.title) {
      result = result.replace(/\{\{title\}\}/g, this.escapeHtml(data.title));
      result = result.replace(/PLACEHOLDER_TITLE/g, this.escapeHtml(data.title));
    }

    if (data.subtitle) {
      result = result.replace(/\{\{subtitle\}\}/g, this.escapeHtml(data.subtitle));
      result = result.replace(/PLACEHOLDER_SUBTITLE/g, this.escapeHtml(data.subtitle));
    }

    if (data.content) {
      result = result.replace(/\{\{content\}\}/g, this.escapeHtml(data.content));
      result = result.replace(/PLACEHOLDER_CONTENT/g, this.escapeHtml(data.content));
    }

    // 코드 블록 교체 (구문 하이라이팅 포함)
    if (data.code) {
      const highlightedCode = this.highlightCode(data.code, data.language || 'javascript');
      result = result.replace(/\{\{code\}\}/g, highlightedCode);
      result = result.replace(/PLACEHOLDER_CODE/g, highlightedCode);
    }

    // 단계별 프로세스 교체
    if (data.steps && Array.isArray(data.steps)) {
      const stepsHtml = data.steps.map((step, index) =>
        `<text x="50" y="${100 + index * 40}" class="step-text">${index + 1}. ${this.escapeHtml(step)}</text>`
      ).join('\n');
      result = result.replace(/\{\{steps\}\}/g, stepsHtml);
      result = result.replace(/PLACEHOLDER_STEPS/g, stepsHtml);
    }

    // 데이터 배열 (차트용) 교체
    if (data.data && Array.isArray(data.data)) {
      const chartData = this.generateChartElements(data.data);
      result = result.replace(/\{\{chart_data\}\}/g, chartData);
      result = result.replace(/PLACEHOLDER_CHART/g, chartData);
    }

    // 동적 색상 적용
    if (data.primaryColor) {
      result = result.replace(/#667eea/g, data.primaryColor);
    }
    if (data.secondaryColor) {
      result = result.replace(/#764ba2/g, data.secondaryColor);
    }

    return result;
  }

  /**
   * 간단한 코드 구문 하이라이팅
   */
  private highlightCode(code: string, language: string): string {
    const lines = code.split('\n');
    const colorMap: { [key: string]: string } = {
      'python': {
        keyword: '#569cd6',
        string: '#ce9178',
        comment: '#6a9955',
        function: '#dcdcaa',
        number: '#b5cea8'
      },
      'javascript': {
        keyword: '#569cd6',
        string: '#ce9178',
        comment: '#6a9955',
        function: '#dcdcaa',
        number: '#b5cea8'
      }
    }[language] || {
      keyword: '#569cd6',
      string: '#ce9178',
      comment: '#6a9955',
      function: '#dcdcaa',
      number: '#b5cea8'
    };

    return lines.map((line, index) => {
      let highlightedLine = this.escapeHtml(line);

      // 키워드 하이라이팅
      const keywords = ['from', 'import', 'class', 'def', 'if', 'else', 'for', 'while', 'return', 'const', 'let', 'var', 'function'];
      keywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'g');
        highlightedLine = highlightedLine.replace(regex, `<tspan fill="${colorMap.keyword}">${keyword}</tspan>`);
      });

      // 문자열 하이라이팅
      highlightedLine = highlightedLine.replace(/(["'][^"']*["'])/g, `<tspan fill="${colorMap.string}">$1</tspan>`);

      // 주석 하이라이팅
      highlightedLine = highlightedLine.replace(/(#.*$|\/\/.*$)/g, `<tspan fill="${colorMap.comment}">$1</tspan>`);

      return `<text x="20" y="${30 + index * 20}" class="code-text" fill="#d4d4d4">${highlightedLine}</text>`;
    }).join('\n');
  }

  /**
   * 차트 데이터를 SVG 요소로 변환
   */
  private generateChartElements(data: any[]): string {
    if (!Array.isArray(data) || data.length === 0) return '';

    const maxValue = Math.max(...data.map(d => typeof d === 'object' ? d.value : d));
    const barWidth = 40;
    const barSpacing = 60;

    return data.map((item, index) => {
      const value = typeof item === 'object' ? item.value : item;
      const label = typeof item === 'object' ? item.label : `Item ${index + 1}`;
      const height = (value / maxValue) * 200;
      const x = 50 + index * barSpacing;
      const y = 300 - height;

      return `
        <rect x="${x}" y="${y}" width="${barWidth}" height="${height}" fill="#667eea" rx="4">
          <animate attributeName="height" from="0" to="${height}" dur="1s" begin="${index * 0.2}s"/>
          <animate attributeName="y" from="300" to="${y}" dur="1s" begin="${index * 0.2}s"/>
        </rect>
        <text x="${x + barWidth/2}" y="320" text-anchor="middle" class="chart-label" fill="#333">${this.escapeHtml(label)}</text>
        <text x="${x + barWidth/2}" y="${y - 5}" text-anchor="middle" class="chart-value" fill="#667eea">${value}</text>
      `;
    }).join('\n');
  }

  /**
   * HTML/XML 이스케이프
   */
  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /**
   * 템플릿을 찾을 수 없을 때 사용할 기본 템플릿
   */
  private getFallbackTemplate(): string {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
        <defs>
          <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="1920" height="1080" fill="url(#bgGradient)"/>
        <text x="960" y="400" text-anchor="middle" fill="white" font-size="72" font-weight="bold">{{title}}</text>
        <text x="960" y="500" text-anchor="middle" fill="white" font-size="36">{{subtitle}}</text>
        <text x="960" y="600" text-anchor="middle" fill="white" font-size="24">{{content}}</text>
      </svg>
    `;
  }

  /**
   * 특정 템플릿 유형에 맞는 데이터 구조 생성
   */
  static createTemplateData(type: string, sceneData: any): TemplateData {
    switch (type) {
      case 'code':
        return {
          title: sceneData.title,
          subtitle: sceneData.subtitle,
          code: sceneData.visualElements?.find((el: any) => el.type === 'code_block')?.content || '',
          language: sceneData.visualElements?.find((el: any) => el.type === 'code_block')?.style?.language || 'python'
        };

      case 'process':
        return {
          title: sceneData.title,
          subtitle: sceneData.subtitle,
          steps: sceneData.visualElements?.filter((el: any) => el.type === 'step' || el.type === 'process_step')
            .map((el: any) => el.content.replace(/\d+\.\s*/, '').replace(/\n/g, ' ')) || []
        };

      case 'chart':
        return {
          title: sceneData.title,
          subtitle: sceneData.subtitle,
          data: sceneData.dataPoints || sceneData.visualElements?.filter((el: any) => el.type === 'data') || []
        };

      default:
        return {
          title: sceneData.title,
          subtitle: sceneData.subtitle,
          content: sceneData.narration || sceneData.content || ''
        };
    }
  }
}