/**
 * Chart Generator - 동적 차트 생성 시스템
 * SVG 기반 차트를 프로그래밍 방식으로 생성
 */

class ChartGenerator {
  constructor() {
    this.colors = {
      primary: '#667eea',
      secondary: '#764ba2',
      accent: '#4fd1c7',
      success: '#48bb78',
      warning: '#f6ad55',
      danger: '#fc8181',
      gradients: [
        '#667eea', '#764ba2', '#4fd1c7', '#48bb78', '#f6ad55', '#fc8181'
      ]
    };
  }

  /**
   * 막대 차트 생성
   */
  generateBarChart(data, options = {}) {
    const {
      width = 600,
      height = 400,
      title = 'Chart Title',
      animated = true,
      showValues = true,
      colorScheme = 'gradient'
    } = options;

    const maxValue = Math.max(...data.map(d => d.value));
    const padding = 80;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    const barWidth = chartWidth / data.length * 0.7;
    const barSpacing = chartWidth / data.length * 0.3;

    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`;

    // 그라데이션 정의
    svg += `<defs>`;
    data.forEach((_, index) => {
      const color1 = this.colors.gradients[index % this.colors.gradients.length];
      const color2 = this.darkenColor(color1, 20);
      svg += `
        <linearGradient id="barGradient${index}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
        </linearGradient>
      `;
    });
    svg += `</defs>`;

    // 배경
    svg += `<rect width="${width}" height="${height}" fill="#ffffff" rx="10"/>`;

    // 제목
    svg += `<text x="${width/2}" y="40" text-anchor="middle" font-size="24" font-weight="bold" fill="#1a1a2e">${title}</text>`;

    // Y축 (세로선)
    svg += `<line x1="${padding}" y1="${padding}" x2="${padding}" y2="${height - padding}" stroke="#e2e8f0" stroke-width="2"/>`;

    // X축 (가로선)
    svg += `<line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="#e2e8f0" stroke-width="2"/>`;

    // Y축 눈금과 레이블
    for (let i = 0; i <= 5; i++) {
      const y = height - padding - (chartHeight / 5) * i;
      const value = (maxValue / 5) * i;

      svg += `<line x1="${padding - 5}" y1="${y}" x2="${padding + 5}" y2="${y}" stroke="#94a3b8" stroke-width="1"/>`;
      svg += `<text x="${padding - 10}" y="${y + 5}" text-anchor="end" font-size="12" fill="#64748b">${Math.round(value)}</text>`;

      // 격자선
      if (i > 0) {
        svg += `<line x1="${padding}" y1="${y}" x2="${width - padding}" y2="${y}" stroke="#f1f5f9" stroke-width="1" stroke-dasharray="3,3"/>`;
      }
    }

    // 막대와 레이블
    data.forEach((item, index) => {
      const x = padding + (barWidth + barSpacing) * index + barSpacing / 2;
      const barHeight = (item.value / maxValue) * chartHeight;
      const y = height - padding - barHeight;

      // 막대
      svg += `
        <rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}"
              fill="url(#barGradient${index})" rx="4">
          ${animated ? `
            <animate attributeName="height" from="0" to="${barHeight}" dur="1s" begin="${index * 0.2}s"/>
            <animate attributeName="y" from="${height - padding}" to="${y}" dur="1s" begin="${index * 0.2}s"/>
          ` : ''}
        </rect>
      `;

      // 값 레이블
      if (showValues) {
        svg += `
          <text x="${x + barWidth/2}" y="${y - 10}" text-anchor="middle"
                font-size="14" font-weight="bold" fill="${this.colors.primary}">
            ${item.value}
            ${animated ? `<animate attributeName="opacity" from="0" to="1" dur="0.5s" begin="${index * 0.2 + 1}s"/>` : ''}
          </text>
        `;
      }

      // X축 레이블
      svg += `
        <text x="${x + barWidth/2}" y="${height - padding + 20}" text-anchor="middle"
              font-size="12" fill="#475569">
          ${item.label}
        </text>
      `;
    });

    svg += `</svg>`;
    return svg;
  }

  /**
   * 원형 차트 생성
   */
  generatePieChart(data, options = {}) {
    const {
      width = 400,
      height = 400,
      title = 'Pie Chart',
      showPercentages = true,
      animated = true
    } = options;

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 60;

    const total = data.reduce((sum, item) => sum + item.value, 0);

    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`;

    // 그라데이션 정의
    svg += `<defs>`;
    data.forEach((_, index) => {
      const color = this.colors.gradients[index % this.colors.gradients.length];
      svg += `
        <radialGradient id="pieGradient${index}" cx="30%" cy="30%">
          <stop offset="0%" style="stop-color:${this.lightenColor(color, 20)}" />
          <stop offset="100%" style="stop-color:${color}" />
        </radialGradient>
      `;
    });
    svg += `</defs>`;

    // 제목
    svg += `<text x="${centerX}" y="30" text-anchor="middle" font-size="20" font-weight="bold" fill="#1a1a2e">${title}</text>`;

    let currentAngle = -90; // 12시 방향에서 시작

    data.forEach((item, index) => {
      const percentage = (item.value / total) * 100;
      const angle = (item.value / total) * 360;

      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;

      const startX = centerX + radius * Math.cos(startAngle * Math.PI / 180);
      const startY = centerY + radius * Math.sin(startAngle * Math.PI / 180);
      const endX = centerX + radius * Math.cos(endAngle * Math.PI / 180);
      const endY = centerY + radius * Math.sin(endAngle * Math.PI / 180);

      const largeArcFlag = angle > 180 ? 1 : 0;

      const pathData = [
        `M ${centerX} ${centerY}`,
        `L ${startX} ${startY}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`,
        'Z'
      ].join(' ');

      svg += `
        <path d="${pathData}" fill="url(#pieGradient${index})" stroke="#ffffff" stroke-width="2">
          ${animated ? `
            <animateTransform attributeName="transform" type="scale"
                            values="0;1" dur="1s" begin="${index * 0.2}s"/>
          ` : ''}
        </path>
      `;

      // 퍼센티지 레이블
      if (showPercentages && percentage > 5) {
        const labelAngle = startAngle + angle / 2;
        const labelRadius = radius * 0.7;
        const labelX = centerX + labelRadius * Math.cos(labelAngle * Math.PI / 180);
        const labelY = centerY + labelRadius * Math.sin(labelAngle * Math.PI / 180);

        svg += `
          <text x="${labelX}" y="${labelY}" text-anchor="middle"
                font-size="14" font-weight="bold" fill="white">
            ${percentage.toFixed(1)}%
            ${animated ? `<animate attributeName="opacity" from="0" to="1" dur="0.5s" begin="${index * 0.2 + 0.5}s"/>` : ''}
          </text>
        `;
      }

      currentAngle += angle;
    });

    // 범례
    const legendStartY = height - 80;
    data.forEach((item, index) => {
      const legendY = legendStartY + index * 20;
      const color = this.colors.gradients[index % this.colors.gradients.length];

      svg += `
        <rect x="20" y="${legendY - 8}" width="12" height="12" fill="${color}" rx="2"/>
        <text x="40" y="${legendY + 2}" font-size="12" fill="#475569">${item.label}: ${item.value}</text>
      `;
    });

    svg += `</svg>`;
    return svg;
  }

  /**
   * 선 그래프 생성
   */
  generateLineChart(data, options = {}) {
    const {
      width = 600,
      height = 400,
      title = 'Line Chart',
      animated = true,
      showPoints = true,
      smooth = true
    } = options;

    const padding = 80;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    const maxValue = Math.max(...data.map(d => d.value));
    const minValue = Math.min(...data.map(d => d.value));
    const valueRange = maxValue - minValue;

    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`;

    // 그라데이션 정의
    svg += `
      <defs>
        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:${this.colors.primary}" />
          <stop offset="100%" style="stop-color:${this.colors.accent}" />
        </linearGradient>
        <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:${this.colors.primary};stop-opacity:0.3" />
          <stop offset="100%" style="stop-color:${this.colors.primary};stop-opacity:0.05" />
        </linearGradient>
      </defs>
    `;

    // 배경과 제목
    svg += `<rect width="${width}" height="${height}" fill="#ffffff" rx="10"/>`;
    svg += `<text x="${width/2}" y="40" text-anchor="middle" font-size="24" font-weight="bold" fill="#1a1a2e">${title}</text>`;

    // 축
    svg += `<line x1="${padding}" y1="${padding}" x2="${padding}" y2="${height - padding}" stroke="#e2e8f0" stroke-width="2"/>`;
    svg += `<line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="#e2e8f0" stroke-width="2"/>`;

    // 점들의 좌표 계산
    const points = data.map((item, index) => {
      const x = padding + (chartWidth / (data.length - 1)) * index;
      const y = height - padding - ((item.value - minValue) / valueRange) * chartHeight;
      return { x, y, value: item.value, label: item.label };
    });

    // 영역 채우기
    if (points.length > 1) {
      let areaPath = `M ${points[0].x} ${height - padding}`;
      points.forEach(point => {
        areaPath += ` L ${point.x} ${point.y}`;
      });
      areaPath += ` L ${points[points.length - 1].x} ${height - padding} Z`;

      svg += `<path d="${areaPath}" fill="url(#areaGradient)"/>`;
    }

    // 선 그리기
    if (points.length > 1) {
      let linePath = `M ${points[0].x} ${points[0].y}`;

      if (smooth && points.length > 2) {
        // 부드러운 곡선 (간단한 베지어 곡선)
        for (let i = 1; i < points.length; i++) {
          const prev = points[i - 1];
          const curr = points[i];
          const controlPointOffset = Math.abs(curr.x - prev.x) * 0.3;

          linePath += ` C ${prev.x + controlPointOffset} ${prev.y}, ${curr.x - controlPointOffset} ${curr.y}, ${curr.x} ${curr.y}`;
        }
      } else {
        // 직선
        points.slice(1).forEach(point => {
          linePath += ` L ${point.x} ${point.y}`;
        });
      }

      svg += `
        <path d="${linePath}" stroke="url(#lineGradient)" stroke-width="3" fill="none" stroke-linecap="round">
          ${animated ? `
            <animate attributeName="stroke-dasharray" from="0,1000" to="1000,0" dur="2s"/>
            <animate attributeName="stroke-dashoffset" from="1000" to="0" dur="2s"/>
          ` : ''}
        </path>
      `;
    }

    // 점과 값 표시
    if (showPoints) {
      points.forEach((point, index) => {
        svg += `
          <circle cx="${point.x}" cy="${point.y}" r="6" fill="white" stroke="${this.colors.primary}" stroke-width="3">
            ${animated ? `<animate attributeName="r" from="0" to="6" dur="0.5s" begin="${index * 0.2 + 1}s"/>` : ''}
          </circle>
          <text x="${point.x}" y="${point.y - 15}" text-anchor="middle" font-size="12" font-weight="bold" fill="${this.colors.primary}">
            ${point.value}
            ${animated ? `<animate attributeName="opacity" from="0" to="1" dur="0.5s" begin="${index * 0.2 + 1.2}s"/>` : ''}
          </text>
          <text x="${point.x}" y="${height - padding + 20}" text-anchor="middle" font-size="10" fill="#475569">
            ${point.label}
          </text>
        `;
      });
    }

    svg += `</svg>`;
    return svg;
  }

  /**
   * 색상 조정 헬퍼 함수들
   */
  lightenColor(color, percent) {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
  }

  darkenColor(color, percent) {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = (num >> 8 & 0x00FF) - amt;
    const B = (num & 0x0000FF) - amt;
    return "#" + (0x1000000 + (R > 255 ? 255 : R < 0 ? 0 : R) * 0x10000 +
      (G > 255 ? 255 : G < 0 ? 0 : G) * 0x100 +
      (B > 255 ? 255 : B < 0 ? 0 : B)).toString(16).slice(1);
  }
}

module.exports = { ChartGenerator };