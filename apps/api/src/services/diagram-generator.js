/**
 * Diagram Generator - 다이어그램 생성 시스템
 * 플로우차트, 아키텍처 다이어그램, 프로세스 플로우 등을 생성
 */

class DiagramGenerator {
  constructor() {
    this.colors = {
      primary: '#667eea',
      secondary: '#764ba2',
      accent: '#4fd1c7',
      success: '#48bb78',
      warning: '#f6ad55',
      danger: '#fc8181',
      neutral: '#94a3b8'
    };

    this.shapes = {
      rectangle: 'rect',
      circle: 'circle',
      diamond: 'diamond',
      cylinder: 'cylinder',
      cloud: 'cloud'
    };
  }

  /**
   * RAG 아키텍처 다이어그램 생성
   */
  generateRAGArchitecture(options = {}) {
    const { width = 800, height = 500, animated = true } = options;

    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`;

    // 그라데이션 정의
    svg += `
      <defs>
        <linearGradient id="userGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#667eea" />
          <stop offset="100%" style="stop-color:#764ba2" />
        </linearGradient>
        <linearGradient id="dbGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#48bb78" />
          <stop offset="100%" style="stop-color:#38a169" />
        </linearGradient>
        <linearGradient id="llmGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#4fd1c7" />
          <stop offset="100%" style="stop-color:#319795" />
        </linearGradient>

        <!-- 화살표 마커 -->
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7"
                  refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#667eea"/>
          </marker>
        </defs>
      </defs>
    `;

    // 배경
    svg += `<rect width="${width}" height="${height}" fill="#f8fafc" rx="15"/>`;

    // 제목
    svg += `<text x="${width/2}" y="40" text-anchor="middle" font-size="24" font-weight="bold" fill="#1a1a2e">RAG System Architecture</text>`;

    // 1. 사용자 (왼쪽)
    const userX = 80;
    const userY = height / 2;
    svg += this.createNode({
      x: userX - 40,
      y: userY - 30,
      width: 80,
      height: 60,
      fill: 'url(#userGrad)',
      text: 'User\nQuery',
      animated,
      delay: 0
    });

    // 2. 벡터 데이터베이스 (상단)
    const dbX = width / 2;
    const dbY = 120;
    svg += this.createNode({
      x: dbX - 80,
      y: dbY - 30,
      width: 160,
      height: 60,
      fill: 'url(#dbGrad)',
      text: 'Vector Database\n(Embeddings)',
      animated,
      delay: 0.5
    });

    // 3. LLM (하단)
    const llmX = width / 2;
    const llmY = height - 120;
    svg += this.createNode({
      x: llmX - 80,
      y: llmY - 30,
      width: 160,
      height: 60,
      fill: 'url(#llmGrad)',
      text: 'Large Language\nModel (LLM)',
      animated,
      delay: 1
    });

    // 4. 응답 (오른쪽)
    const responseX = width - 80;
    const responseY = height / 2;
    svg += this.createNode({
      x: responseX - 40,
      y: responseY - 30,
      width: 80,
      height: 60,
      fill: 'url(#userGrad)',
      text: 'Enhanced\nResponse',
      animated,
      delay: 1.5
    });

    // 화살표들
    const arrows = [
      // 1. User → DB (검색)
      {
        x1: userX + 40, y1: userY - 10,
        x2: dbX - 80, y2: dbY + 10,
        label: '1. Vector Search',
        delay: 2
      },
      // 2. DB → LLM (컨텍스트)
      {
        x1: dbX, y1: dbY + 30,
        x2: llmX, y2: llmY - 30,
        label: '2. Retrieved Context',
        delay: 2.5
      },
      // 3. User → LLM (쿼리)
      {
        x1: userX + 40, y1: userY + 10,
        x2: llmX - 80, y2: llmY,
        label: '3. Query + Context',
        delay: 3
      },
      // 4. LLM → Response (생성)
      {
        x1: llmX + 80, y1: llmY,
        x2: responseX - 40, y2: responseY,
        label: '4. Generate Response',
        delay: 3.5
      }
    ];

    arrows.forEach(arrow => {
      svg += this.createArrow(arrow, animated);
    });

    // 프로세스 단계 설명
    const steps = [
      { text: '1. Query Analysis & Vectorization', y: height - 60 },
      { text: '2. Similarity Search in Vector DB', y: height - 40 },
      { text: '3. Context Augmentation', y: height - 20 },
      { text: '4. LLM Response Generation', y: height }
    ];

    steps.forEach((step, index) => {
      svg += `
        <text x="50" y="${step.y}" font-size="12" fill="#64748b">
          ${step.text}
          ${animated ? `<animate attributeName="opacity" from="0" to="1" dur="0.5s" begin="${4 + index * 0.3}s"/>` : ''}
        </text>
      `;
    });

    svg += `</svg>`;
    return svg;
  }

  /**
   * 4단계 프로세스 플로우 다이어그램
   */
  generateProcessFlow(steps, options = {}) {
    const { width = 800, height = 300, animated = true } = options;

    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`;

    // 마커 정의
    svg += `
      <defs>
        <marker id="flowArrow" markerWidth="8" markerHeight="8"
                refX="7" refY="4" orient="auto">
          <polygon points="0 0, 8 4, 0 8" fill="#667eea"/>
        </marker>
      </defs>
    `;

    // 배경
    svg += `<rect width="${width}" height="${height}" fill="#ffffff" rx="10"/>`;

    const stepWidth = (width - 100) / steps.length;
    const stepY = height / 2;

    steps.forEach((step, index) => {
      const x = 50 + stepWidth * index + stepWidth / 2;

      // 단계 원
      const circleRadius = 30;
      svg += `
        <circle cx="${x}" cy="${stepY}" r="${circleRadius}"
                fill="${this.colors.gradients[index % this.colors.gradients.length]}"
                stroke="white" stroke-width="3">
          ${animated ? `
            <animate attributeName="r" from="0" to="${circleRadius}" dur="0.8s" begin="${index * 0.5}s"/>
          ` : ''}
        </circle>
      `;

      // 단계 번호
      svg += `
        <text x="${x}" y="${stepY - 5}" text-anchor="middle"
              font-size="18" font-weight="bold" fill="white">
          ${index + 1}
          ${animated ? `<animate attributeName="opacity" from="0" to="1" dur="0.5s" begin="${index * 0.5 + 0.5}s"/>` : ''}
        </text>
      `;

      // 단계 제목
      svg += `
        <text x="${x}" y="${stepY + 60}" text-anchor="middle"
              font-size="14" font-weight="bold" fill="#1a1a2e">
          ${step.title}
          ${animated ? `<animate attributeName="opacity" from="0" to="1" dur="0.5s" begin="${index * 0.5 + 0.7}s"/>` : ''}
        </text>
      `;

      // 단계 설명
      svg += `
        <text x="${x}" y="${stepY + 80}" text-anchor="middle"
              font-size="11" fill="#64748b">
          ${step.description}
          ${animated ? `<animate attributeName="opacity" from="0" to="1" dur="0.5s" begin="${index * 0.5 + 0.9}s"/>` : ''}
        </text>
      `;

      // 화살표 (마지막 단계 제외)
      if (index < steps.length - 1) {
        const nextX = 50 + stepWidth * (index + 1) + stepWidth / 2;
        svg += `
          <line x1="${x + circleRadius + 5}" y1="${stepY}"
                x2="${nextX - circleRadius - 5}" y2="${stepY}"
                stroke="#667eea" stroke-width="3" marker-end="url(#flowArrow)">
            ${animated ? `
              <animate attributeName="stroke-dasharray" from="0,100" to="100,0"
                       dur="0.8s" begin="${index * 0.5 + 1}s"/>
            ` : ''}
          </line>
        `;
      }
    });

    svg += `</svg>`;
    return svg;
  }

  /**
   * 비교 다이어그램 (Before vs After)
   */
  generateComparisonDiagram(beforeData, afterData, options = {}) {
    const { width = 600, height = 400, animated = true } = options;

    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`;

    // 그라데이션
    svg += `
      <defs>
        <linearGradient id="beforeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#fc8181" />
          <stop offset="100%" style="stop-color:#f56565" />
        </linearGradient>
        <linearGradient id="afterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#48bb78" />
          <stop offset="100%" style="stop-color:#38a169" />
        </linearGradient>
      </defs>
    `;

    // 배경
    svg += `<rect width="${width}" height="${height}" fill="#f8fafc" rx="10"/>`;

    const leftX = width * 0.25;
    const rightX = width * 0.75;
    const centerY = height / 2;

    // Before 섹션
    svg += this.createComparisonSection({
      x: leftX,
      y: centerY,
      title: beforeData.title || 'Before',
      items: beforeData.items,
      fill: 'url(#beforeGrad)',
      animated,
      delay: 0
    });

    // After 섹션
    svg += this.createComparisonSection({
      x: rightX,
      y: centerY,
      title: afterData.title || 'After',
      items: afterData.items,
      fill: 'url(#afterGrad)',
      animated,
      delay: 1
    });

    // VS 텍스트
    svg += `
      <circle cx="${width/2}" cy="${centerY}" r="30" fill="white" stroke="#667eea" stroke-width="3">
        ${animated ? `<animate attributeName="r" from="0" to="30" dur="1s" begin="0.5s"/>` : ''}
      </circle>
      <text x="${width/2}" y="${centerY + 5}" text-anchor="middle"
            font-size="18" font-weight="bold" fill="#667eea">
        VS
        ${animated ? `<animate attributeName="opacity" from="0" to="1" dur="0.5s" begin="1s"/>` : ''}
      </text>
    `;

    svg += `</svg>`;
    return svg;
  }

  /**
   * 노드 생성 헬퍼
   */
  createNode({ x, y, width, height, fill, text, animated = false, delay = 0 }) {
    const lines = text.split('\n');
    let node = `
      <rect x="${x}" y="${y}" width="${width}" height="${height}"
            fill="${fill}" rx="8" stroke="white" stroke-width="2">
        ${animated ? `
          <animate attributeName="width" from="0" to="${width}" dur="0.8s" begin="${delay}s"/>
          <animate attributeName="height" from="0" to="${height}" dur="0.8s" begin="${delay}s"/>
        ` : ''}
      </rect>
    `;

    lines.forEach((line, index) => {
      const textY = y + height/2 + (index - (lines.length - 1)/2) * 16;
      node += `
        <text x="${x + width/2}" y="${textY}" text-anchor="middle"
              font-size="12" font-weight="bold" fill="white">
          ${line}
          ${animated ? `<animate attributeName="opacity" from="0" to="1" dur="0.5s" begin="${delay + 0.5}s"/>` : ''}
        </text>
      `;
    });

    return node;
  }

  /**
   * 화살표 생성 헬퍼
   */
  createArrow({ x1, y1, x2, y2, label, delay = 0 }, animated = false) {
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;

    let arrow = `
      <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"
            stroke="#667eea" stroke-width="2" marker-end="url(#arrowhead)">
        ${animated ? `
          <animate attributeName="stroke-dasharray" from="0,300" to="300,0" dur="1s" begin="${delay}s"/>
        ` : ''}
      </line>
    `;

    if (label) {
      arrow += `
        <text x="${midX}" y="${midY - 10}" text-anchor="middle"
              font-size="10" fill="#667eea" font-weight="500">
          ${label}
          ${animated ? `<animate attributeName="opacity" from="0" to="1" dur="0.5s" begin="${delay + 0.5}s"/>` : ''}
        </text>
      `;
    }

    return arrow;
  }

  /**
   * 비교 섹션 생성 헬퍼
   */
  createComparisonSection({ x, y, title, items, fill, animated = false, delay = 0 }) {
    let section = `
      <rect x="${x - 100}" y="${y - 80}" width="200" height="160"
            fill="${fill}" rx="10" stroke="white" stroke-width="2">
        ${animated ? `
          <animate attributeName="height" from="0" to="160" dur="1s" begin="${delay}s"/>
        ` : ''}
      </rect>
      <text x="${x}" y="${y - 50}" text-anchor="middle"
            font-size="16" font-weight="bold" fill="white">
        ${title}
        ${animated ? `<animate attributeName="opacity" from="0" to="1" dur="0.5s" begin="${delay + 0.5}s"/>` : ''}
      </text>
    `;

    items.forEach((item, index) => {
      section += `
        <text x="${x}" y="${y - 20 + index * 20}" text-anchor="middle"
              font-size="12" fill="white">
          • ${item}
          ${animated ? `<animate attributeName="opacity" from="0" to="1" dur="0.5s" begin="${delay + 0.8 + index * 0.2}s"/>` : ''}
        </text>
      `;
    });

    return section;
  }
}

module.exports = { DiagramGenerator };