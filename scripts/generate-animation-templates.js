#!/usr/bin/env node

/**
 * InfoGraphAI 애니메이션 템플릿 대량 생성 스크립트
 * 교육 비디오용 SVG 애니메이션 템플릿을 자동 생성합니다
 */

const fs = require('fs').promises;
const path = require('path');

// 색상 팔레트
const colors = {
  primary: '#3B82F6',
  secondary: '#8B5CF6',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#06B6D4',
  dark: '#1F2937',
  light: '#F3F4F6'
};

// 교육 비디오용 템플릿 카테고리
const categories = {
  animations: 'animations',
  charts: 'charts',
  comparisons: 'comparisons',
  processes: 'processes',
  timelines: 'timelines',
  concepts: 'concepts',
  highlights: 'highlights',
  transitions: 'transitions'
};

// 기본 디렉토리 설정
const ASSETS_DIR = path.join(__dirname, '..', 'assets', 'templates');

async function ensureDirectories() {
  for (const category of Object.values(categories)) {
    await fs.mkdir(path.join(ASSETS_DIR, category), { recursive: true });
  }
}

// ============= 애니메이션 템플릿 생성 =============

async function generateAnimationTemplates() {
  console.log('🎬 애니메이션 템플릿 생성 중...');
  
  // 1. Pulse 애니메이션
  const pulseAnimation = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
    <defs>
      <style>
        @keyframes pulse {
          0% { r: 40; opacity: 1; }
          50% { r: 50; opacity: 0.7; }
          100% { r: 40; opacity: 1; }
        }
        .pulse-circle {
          animation: pulse 2s ease-in-out infinite;
        }
      </style>
    </defs>
    <circle class="pulse-circle" cx="100" cy="100" r="40" fill="${colors.primary}" />
    <circle cx="100" cy="100" r="30" fill="${colors.light}" />
  </svg>`;
  
  // 2. Slide In 애니메이션
  const slideInAnimation = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="100" viewBox="0 0 400 100">
    <defs>
      <style>
        @keyframes slideIn {
          from { transform: translateX(-100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .slide-rect {
          animation: slideIn 1s ease-out forwards;
        }
      </style>
    </defs>
    <rect class="slide-rect" x="50" y="25" width="300" height="50" rx="5" fill="${colors.secondary}" />
    <text x="200" y="55" text-anchor="middle" fill="white" font-size="20" font-weight="bold">SLIDE IN TEXT</text>
  </svg>`;
  
  // 3. Fade In 애니메이션
  const fadeInAnimation = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
    <defs>
      <style>
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .fade-group {
          animation: fadeIn 2s ease-in forwards;
        }
      </style>
    </defs>
    <g class="fade-group">
      <rect x="50" y="50" width="100" height="100" rx="10" fill="${colors.info}" />
      <text x="100" y="105" text-anchor="middle" fill="white" font-size="18">FADE IN</text>
    </g>
  </svg>`;
  
  // 4. Rotate 애니메이션
  const rotateAnimation = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
    <defs>
      <style>
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .rotate-group {
          animation: rotate 3s linear infinite;
          transform-origin: center;
        }
      </style>
    </defs>
    <g class="rotate-group">
      <rect x="75" y="75" width="50" height="50" fill="${colors.warning}" />
      <circle cx="100" cy="100" r="5" fill="${colors.dark}" />
    </g>
  </svg>`;
  
  // 5. Bounce 애니메이션
  const bounceAnimation = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
    <defs>
      <style>
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-30px); }
        }
        .bounce-circle {
          animation: bounce 1s ease-in-out infinite;
        }
      </style>
    </defs>
    <circle class="bounce-circle" cx="100" cy="150" r="25" fill="${colors.success}" />
  </svg>`;
  
  // 애니메이션 템플릿 저장
  const animations = {
    'pulse': pulseAnimation,
    'slide-in': slideInAnimation,
    'fade-in': fadeInAnimation,
    'rotate': rotateAnimation,
    'bounce': bounceAnimation
  };
  
  for (const [name, content] of Object.entries(animations)) {
    await fs.writeFile(
      path.join(ASSETS_DIR, categories.animations, `${name}.svg`),
      content
    );
  }
  
  console.log(`✅ ${Object.keys(animations).length}개 애니메이션 템플릿 생성 완료`);
}

// ============= 차트 템플릿 생성 =============

async function generateChartTemplates() {
  console.log('📊 차트 템플릿 생성 중...');
  
  // 1. 막대 차트
  const barChart = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
    <defs>
      <style>
        @keyframes growBar {
          from { height: 0; }
          to { height: var(--bar-height); }
        }
        .bar { animation: growBar 1s ease-out forwards; }
      </style>
    </defs>
    <!-- Grid Lines -->
    <line x1="50" y1="250" x2="350" y2="250" stroke="${colors.light}" stroke-width="2"/>
    <line x1="50" y1="50" x2="50" y2="250" stroke="${colors.light}" stroke-width="2"/>
    
    <!-- Bars -->
    <rect class="bar" x="80" y="150" width="40" height="100" fill="${colors.primary}" style="--bar-height: 100px"/>
    <rect class="bar" x="140" y="100" width="40" height="150" fill="${colors.secondary}" style="--bar-height: 150px"/>
    <rect class="bar" x="200" y="120" width="40" height="130" fill="${colors.success}" style="--bar-height: 130px"/>
    <rect class="bar" x="260" y="90" width="40" height="160" fill="${colors.warning}" style="--bar-height: 160px"/>
    
    <!-- Labels -->
    <text x="100" y="270" text-anchor="middle" font-size="12">Q1</text>
    <text x="160" y="270" text-anchor="middle" font-size="12">Q2</text>
    <text x="220" y="270" text-anchor="middle" font-size="12">Q3</text>
    <text x="280" y="270" text-anchor="middle" font-size="12">Q4</text>
  </svg>`;
  
  // 2. 파이 차트
  const pieChart = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">
    <defs>
      <style>
        @keyframes drawPie {
          from { stroke-dashoffset: 440; }
          to { stroke-dashoffset: 0; }
        }
        .pie-segment {
          animation: drawPie 2s ease-out forwards;
          stroke-dasharray: 440;
        }
      </style>
    </defs>
    <circle cx="150" cy="150" r="70" fill="none" stroke="${colors.primary}" stroke-width="60" 
            stroke-dasharray="110 330" stroke-dashoffset="-55" class="pie-segment"/>
    <circle cx="150" cy="150" r="70" fill="none" stroke="${colors.secondary}" stroke-width="60" 
            stroke-dasharray="88 352" stroke-dashoffset="-165" class="pie-segment"/>
    <circle cx="150" cy="150" r="70" fill="none" stroke="${colors.success}" stroke-width="60" 
            stroke-dasharray="66 374" stroke-dashoffset="-253" class="pie-segment"/>
    <circle cx="150" cy="150" r="70" fill="none" stroke="${colors.warning}" stroke-width="60" 
            stroke-dasharray="176 264" stroke-dashoffset="-319" class="pie-segment"/>
  </svg>`;
  
  // 3. 라인 차트
  const lineChart = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
    <defs>
      <style>
        @keyframes drawLine {
          from { stroke-dashoffset: 500; }
          to { stroke-dashoffset: 0; }
        }
        .chart-line {
          animation: drawLine 2s ease-out forwards;
          stroke-dasharray: 500;
        }
      </style>
    </defs>
    <!-- Grid -->
    <line x1="50" y1="250" x2="350" y2="250" stroke="${colors.light}" stroke-width="1"/>
    <line x1="50" y1="50" x2="50" y2="250" stroke="${colors.light}" stroke-width="1"/>
    
    <!-- Line -->
    <polyline class="chart-line" 
              points="50,200 100,150 150,170 200,120 250,100 300,80 350,90" 
              fill="none" stroke="${colors.primary}" stroke-width="3"/>
    
    <!-- Points -->
    <circle cx="50" cy="200" r="4" fill="${colors.primary}"/>
    <circle cx="100" cy="150" r="4" fill="${colors.primary}"/>
    <circle cx="150" cy="170" r="4" fill="${colors.primary}"/>
    <circle cx="200" cy="120" r="4" fill="${colors.primary}"/>
    <circle cx="250" cy="100" r="4" fill="${colors.primary}"/>
    <circle cx="300" cy="80" r="4" fill="${colors.primary}"/>
    <circle cx="350" cy="90" r="4" fill="${colors.primary}"/>
  </svg>`;
  
  const charts = {
    'bar-chart': barChart,
    'pie-chart': pieChart,
    'line-chart': lineChart
  };
  
  for (const [name, content] of Object.entries(charts)) {
    await fs.writeFile(
      path.join(ASSETS_DIR, categories.charts, `${name}.svg`),
      content
    );
  }
  
  console.log(`✅ ${Object.keys(charts).length}개 차트 템플릿 생성 완료`);
}

// ============= 비교 템플릿 생성 =============

async function generateComparisonTemplates() {
  console.log('⚖️ 비교 템플릿 생성 중...');
  
  // 1. Before/After 비교
  const beforeAfter = `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="300" viewBox="0 0 500 300">
    <defs>
      <style>
        @keyframes slideLeft { from { transform: translateX(-100%); } to { transform: translateX(0); } }
        @keyframes slideRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
        .before { animation: slideLeft 1s ease-out forwards; }
        .after { animation: slideRight 1s ease-out forwards; }
      </style>
    </defs>
    
    <!-- Before -->
    <g class="before">
      <rect x="20" y="50" width="200" height="200" rx="10" fill="${colors.danger}" opacity="0.8"/>
      <text x="120" y="40" text-anchor="middle" font-size="20" font-weight="bold">BEFORE</text>
      <text x="120" y="150" text-anchor="middle" fill="white" font-size="16">Old Method</text>
    </g>
    
    <!-- Arrow -->
    <path d="M 230 150 L 270 150" stroke="${colors.dark}" stroke-width="3" marker-end="url(#arrowhead)"/>
    <defs>
      <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
        <polygon points="0 0, 10 3.5, 0 7" fill="${colors.dark}"/>
      </marker>
    </defs>
    
    <!-- After -->
    <g class="after">
      <rect x="280" y="50" width="200" height="200" rx="10" fill="${colors.success}" opacity="0.8"/>
      <text x="380" y="40" text-anchor="middle" font-size="20" font-weight="bold">AFTER</text>
      <text x="380" y="150" text-anchor="middle" fill="white" font-size="16">New Method</text>
    </g>
  </svg>`;
  
  // 2. VS 비교
  const vsComparison = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
    <defs>
      <style>
        @keyframes zoomIn {
          from { transform: scale(0); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .option1 { animation: zoomIn 0.5s ease-out forwards; }
        .option2 { animation: zoomIn 0.5s ease-out 0.3s forwards; opacity: 0; }
        .vs-text { animation: zoomIn 0.5s ease-out 0.6s forwards; opacity: 0; }
      </style>
    </defs>
    
    <!-- Option 1 -->
    <g class="option1">
      <circle cx="100" cy="150" r="80" fill="${colors.primary}"/>
      <text x="100" y="155" text-anchor="middle" fill="white" font-size="18" font-weight="bold">Option A</text>
    </g>
    
    <!-- VS -->
    <g class="vs-text">
      <text x="200" y="155" text-anchor="middle" font-size="30" font-weight="bold" fill="${colors.dark}">VS</text>
    </g>
    
    <!-- Option 2 -->
    <g class="option2">
      <circle cx="300" cy="150" r="80" fill="${colors.secondary}"/>
      <text x="300" y="155" text-anchor="middle" fill="white" font-size="18" font-weight="bold">Option B</text>
    </g>
  </svg>`;
  
  const comparisons = {
    'before-after': beforeAfter,
    'vs-comparison': vsComparison
  };
  
  for (const [name, content] of Object.entries(comparisons)) {
    await fs.writeFile(
      path.join(ASSETS_DIR, categories.comparisons, `${name}.svg`),
      content
    );
  }
  
  console.log(`✅ ${Object.keys(comparisons).length}개 비교 템플릿 생성 완료`);
}

// ============= 프로세스 템플릿 생성 =============

async function generateProcessTemplates() {
  console.log('🔄 프로세스 템플릿 생성 중...');
  
  // 1. Step by Step 프로세스
  const stepProcess = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="150" viewBox="0 0 600 150">
    <defs>
      <style>
        @keyframes stepIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .step1 { animation: stepIn 0.5s ease-out forwards; }
        .step2 { animation: stepIn 0.5s ease-out 0.3s forwards; opacity: 0; }
        .step3 { animation: stepIn 0.5s ease-out 0.6s forwards; opacity: 0; }
        .step4 { animation: stepIn 0.5s ease-out 0.9s forwards; opacity: 0; }
      </style>
    </defs>
    
    <!-- Step 1 -->
    <g class="step1">
      <circle cx="75" cy="75" r="40" fill="${colors.primary}"/>
      <text x="75" y="80" text-anchor="middle" fill="white" font-size="20" font-weight="bold">1</text>
      <text x="75" y="130" text-anchor="middle" font-size="12">Start</text>
    </g>
    
    <!-- Arrow 1 -->
    <line x1="115" y1="75" x2="185" y2="75" stroke="${colors.dark}" stroke-width="2" marker-end="url(#arrow)"/>
    
    <!-- Step 2 -->
    <g class="step2">
      <circle cx="225" cy="75" r="40" fill="${colors.secondary}"/>
      <text x="225" y="80" text-anchor="middle" fill="white" font-size="20" font-weight="bold">2</text>
      <text x="225" y="130" text-anchor="middle" font-size="12">Process</text>
    </g>
    
    <!-- Arrow 2 -->
    <line x1="265" y1="75" x2="335" y2="75" stroke="${colors.dark}" stroke-width="2" marker-end="url(#arrow)"/>
    
    <!-- Step 3 -->
    <g class="step3">
      <circle cx="375" cy="75" r="40" fill="${colors.warning}"/>
      <text x="375" y="80" text-anchor="middle" fill="white" font-size="20" font-weight="bold">3</text>
      <text x="375" y="130" text-anchor="middle" font-size="12">Review</text>
    </g>
    
    <!-- Arrow 3 -->
    <line x1="415" y1="75" x2="485" y2="75" stroke="${colors.dark}" stroke-width="2" marker-end="url(#arrow)"/>
    
    <!-- Step 4 -->
    <g class="step4">
      <circle cx="525" cy="75" r="40" fill="${colors.success}"/>
      <text x="525" y="80" text-anchor="middle" fill="white" font-size="20" font-weight="bold">✓</text>
      <text x="525" y="130" text-anchor="middle" font-size="12">Complete</text>
    </g>
    
    <defs>
      <marker id="arrow" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
        <polygon points="0 0, 10 3.5, 0 7" fill="${colors.dark}"/>
      </marker>
    </defs>
  </svg>`;
  
  // 2. Cycle 프로세스
  const cycleProcess = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
    <defs>
      <style>
        @keyframes rotateCycle {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .cycle-group {
          animation: rotateCycle 10s linear infinite;
          transform-origin: center;
        }
      </style>
    </defs>
    
    <g class="cycle-group">
      <!-- Top -->
      <circle cx="200" cy="100" r="40" fill="${colors.primary}"/>
      <text x="200" y="105" text-anchor="middle" fill="white" font-size="16" font-weight="bold">Plan</text>
      
      <!-- Right -->
      <circle cx="300" cy="200" r="40" fill="${colors.secondary}"/>
      <text x="300" y="205" text-anchor="middle" fill="white" font-size="16" font-weight="bold">Do</text>
      
      <!-- Bottom -->
      <circle cx="200" cy="300" r="40" fill="${colors.warning}"/>
      <text x="200" y="305" text-anchor="middle" fill="white" font-size="16" font-weight="bold">Check</text>
      
      <!-- Left -->
      <circle cx="100" cy="200" r="40" fill="${colors.success}"/>
      <text x="100" y="205" text-anchor="middle" fill="white" font-size="16" font-weight="bold">Act</text>
      
      <!-- Arrows -->
      <path d="M 230 120 Q 270 120, 280 170" fill="none" stroke="${colors.dark}" stroke-width="2" marker-end="url(#cycleArrow)"/>
      <path d="M 280 230 Q 280 270, 230 280" fill="none" stroke="${colors.dark}" stroke-width="2" marker-end="url(#cycleArrow)"/>
      <path d="M 170 280 Q 120 280, 120 230" fill="none" stroke="${colors.dark}" stroke-width="2" marker-end="url(#cycleArrow)"/>
      <path d="M 120 170 Q 120 120, 170 120" fill="none" stroke="${colors.dark}" stroke-width="2" marker-end="url(#cycleArrow)"/>
    </g>
    
    <defs>
      <marker id="cycleArrow" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
        <polygon points="0 0, 10 3.5, 0 7" fill="${colors.dark}"/>
      </marker>
    </defs>
  </svg>`;
  
  const processes = {
    'step-process': stepProcess,
    'cycle-process': cycleProcess
  };
  
  for (const [name, content] of Object.entries(processes)) {
    await fs.writeFile(
      path.join(ASSETS_DIR, categories.processes, `${name}.svg`),
      content
    );
  }
  
  console.log(`✅ ${Object.keys(processes).length}개 프로세스 템플릿 생성 완료`);
}

// ============= 타임라인 템플릿 생성 =============

async function generateTimelineTemplates() {
  console.log('📅 타임라인 템플릿 생성 중...');
  
  const timeline = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="200" viewBox="0 0 600 200">
    <defs>
      <style>
        @keyframes drawTimeline {
          from { stroke-dashoffset: 500; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes popIn {
          from { transform: scale(0); }
          to { transform: scale(1); }
        }
        .timeline-line {
          animation: drawTimeline 2s ease-out forwards;
          stroke-dasharray: 500;
        }
        .event1 { animation: popIn 0.3s ease-out 0.5s forwards; transform: scale(0); }
        .event2 { animation: popIn 0.3s ease-out 0.8s forwards; transform: scale(0); }
        .event3 { animation: popIn 0.3s ease-out 1.1s forwards; transform: scale(0); }
        .event4 { animation: popIn 0.3s ease-out 1.4s forwards; transform: scale(0); }
      </style>
    </defs>
    
    <!-- Timeline Line -->
    <line class="timeline-line" x1="50" y1="100" x2="550" y2="100" stroke="${colors.dark}" stroke-width="3"/>
    
    <!-- Event 1 -->
    <g class="event1">
      <circle cx="100" cy="100" r="15" fill="${colors.primary}"/>
      <text x="100" y="140" text-anchor="middle" font-size="12">2020</text>
      <rect x="60" y="30" width="80" height="40" rx="5" fill="${colors.primary}" opacity="0.8"/>
      <text x="100" y="55" text-anchor="middle" fill="white" font-size="10">Launch</text>
    </g>
    
    <!-- Event 2 -->
    <g class="event2">
      <circle cx="250" cy="100" r="15" fill="${colors.secondary}"/>
      <text x="250" y="140" text-anchor="middle" font-size="12">2021</text>
      <rect x="210" y="30" width="80" height="40" rx="5" fill="${colors.secondary}" opacity="0.8"/>
      <text x="250" y="55" text-anchor="middle" fill="white" font-size="10">Growth</text>
    </g>
    
    <!-- Event 3 -->
    <g class="event3">
      <circle cx="400" cy="100" r="15" fill="${colors.warning}"/>
      <text x="400" y="140" text-anchor="middle" font-size="12">2022</text>
      <rect x="360" y="30" width="80" height="40" rx="5" fill="${colors.warning}" opacity="0.8"/>
      <text x="400" y="55" text-anchor="middle" fill="white" font-size="10">Expansion</text>
    </g>
    
    <!-- Event 4 -->
    <g class="event4">
      <circle cx="500" cy="100" r="15" fill="${colors.success}"/>
      <text x="500" y="140" text-anchor="middle" font-size="12">2023</text>
      <rect x="460" y="30" width="80" height="40" rx="5" fill="${colors.success}" opacity="0.8"/>
      <text x="500" y="55" text-anchor="middle" fill="white" font-size="10">Success</text>
    </g>
  </svg>`;
  
  const timelines = {
    'horizontal-timeline': timeline
  };
  
  for (const [name, content] of Object.entries(timelines)) {
    await fs.writeFile(
      path.join(ASSETS_DIR, categories.timelines, `${name}.svg`),
      content
    );
  }
  
  console.log(`✅ ${Object.keys(timelines).length}개 타임라인 템플릿 생성 완료`);
}

// ============= 개념 설명 템플릿 생성 =============

async function generateConceptTemplates() {
  console.log('💡 개념 설명 템플릿 생성 중...');
  
  // 1. 계층 구조
  const hierarchy = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
    <defs>
      <style>
        @keyframes expandTree {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        .level1 { animation: expandTree 0.5s ease-out forwards; }
        .level2 { animation: expandTree 0.5s ease-out 0.3s forwards; opacity: 0; }
        .level3 { animation: expandTree 0.5s ease-out 0.6s forwards; opacity: 0; }
      </style>
    </defs>
    
    <!-- Level 1 -->
    <g class="level1">
      <rect x="150" y="20" width="100" height="40" rx="5" fill="${colors.primary}"/>
      <text x="200" y="45" text-anchor="middle" fill="white" font-size="14" font-weight="bold">Main</text>
    </g>
    
    <!-- Connections -->
    <line x1="200" y1="60" x2="120" y2="100" stroke="${colors.dark}" stroke-width="2"/>
    <line x1="200" y1="60" x2="200" y2="100" stroke="${colors.dark}" stroke-width="2"/>
    <line x1="200" y1="60" x2="280" y2="100" stroke="${colors.dark}" stroke-width="2"/>
    
    <!-- Level 2 -->
    <g class="level2">
      <rect x="70" y="100" width="100" height="40" rx="5" fill="${colors.secondary}"/>
      <text x="120" y="125" text-anchor="middle" fill="white" font-size="12">Branch 1</text>
      
      <rect x="150" y="100" width="100" height="40" rx="5" fill="${colors.secondary}"/>
      <text x="200" y="125" text-anchor="middle" fill="white" font-size="12">Branch 2</text>
      
      <rect x="230" y="100" width="100" height="40" rx="5" fill="${colors.secondary}"/>
      <text x="280" y="125" text-anchor="middle" fill="white" font-size="12">Branch 3</text>
    </g>
    
    <!-- Sub connections -->
    <line x1="120" y1="140" x2="90" y2="180" stroke="${colors.dark}" stroke-width="1"/>
    <line x1="120" y1="140" x2="150" y2="180" stroke="${colors.dark}" stroke-width="1"/>
    
    <!-- Level 3 -->
    <g class="level3">
      <rect x="50" y="180" width="80" height="30" rx="5" fill="${colors.info}"/>
      <text x="90" y="200" text-anchor="middle" fill="white" font-size="10">Leaf 1</text>
      
      <rect x="140" y="180" width="80" height="30" rx="5" fill="${colors.info}"/>
      <text x="180" y="200" text-anchor="middle" fill="white" font-size="10">Leaf 2</text>
    </g>
  </svg>`;
  
  // 2. 벤다이어그램
  const vennDiagram = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
    <defs>
      <style>
        @keyframes fadeInCircle {
          from { opacity: 0; }
          to { opacity: 0.6; }
        }
        .circle1 { animation: fadeInCircle 1s ease-out forwards; }
        .circle2 { animation: fadeInCircle 1s ease-out 0.3s forwards; opacity: 0; }
        .circle3 { animation: fadeInCircle 1s ease-out 0.6s forwards; opacity: 0; }
      </style>
    </defs>
    
    <!-- Circle 1 -->
    <circle class="circle1" cx="150" cy="130" r="80" fill="${colors.primary}" opacity="0.6"/>
    <text x="120" y="100" font-size="14" font-weight="bold" fill="${colors.dark}">Set A</text>
    
    <!-- Circle 2 -->
    <circle class="circle2" cx="250" cy="130" r="80" fill="${colors.secondary}" opacity="0.6"/>
    <text x="250" y="100" font-size="14" font-weight="bold" fill="${colors.dark}">Set B</text>
    
    <!-- Circle 3 -->
    <circle class="circle3" cx="200" cy="200" r="80" fill="${colors.warning}" opacity="0.6"/>
    <text x="180" y="250" font-size="14" font-weight="bold" fill="${colors.dark}">Set C</text>
    
    <!-- Intersection -->
    <text x="200" y="150" text-anchor="middle" font-size="12" fill="${colors.dark}">A∩B∩C</text>
  </svg>`;
  
  const concepts = {
    'hierarchy': hierarchy,
    'venn-diagram': vennDiagram
  };
  
  for (const [name, content] of Object.entries(concepts)) {
    await fs.writeFile(
      path.join(ASSETS_DIR, categories.concepts, `${name}.svg`),
      content
    );
  }
  
  console.log(`✅ ${Object.keys(concepts).length}개 개념 템플릿 생성 완료`);
}

// ============= 하이라이트 효과 템플릿 생성 =============

async function generateHighlightTemplates() {
  console.log('✨ 하이라이트 효과 템플릿 생성 중...');
  
  // 1. Glow 효과
  const glowEffect = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200">
    <defs>
      <filter id="glow">
        <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      <style>
        @keyframes pulse-glow {
          0%, 100% { filter: url(#glow) brightness(1); }
          50% { filter: url(#glow) brightness(1.5); }
        }
        .glow-rect {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      </style>
    </defs>
    
    <rect class="glow-rect" x="50" y="50" width="200" height="100" rx="10" 
          fill="${colors.primary}" filter="url(#glow)"/>
    <text x="150" y="105" text-anchor="middle" fill="white" font-size="20" font-weight="bold">
      IMPORTANT
    </text>
  </svg>`;
  
  // 2. Spotlight 효과
  const spotlightEffect = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
    <defs>
      <radialGradient id="spotlight">
        <stop offset="0%" stop-color="white" stop-opacity="0.8"/>
        <stop offset="100%" stop-color="white" stop-opacity="0"/>
      </radialGradient>
      <mask id="spot-mask">
        <rect width="400" height="300" fill="black"/>
        <circle cx="200" cy="150" r="100" fill="url(#spotlight)"/>
      </mask>
      <style>
        @keyframes moveSpotlight {
          0%, 100% { cx: 200; cy: 150; }
          50% { cx: 250; cy: 120; }
        }
        .spotlight-circle {
          animation: moveSpotlight 3s ease-in-out infinite;
        }
      </style>
    </defs>
    
    <!-- Background -->
    <rect width="400" height="300" fill="${colors.dark}" opacity="0.8"/>
    
    <!-- Content -->
    <g mask="url(#spot-mask)">
      <rect x="150" y="100" width="100" height="100" fill="${colors.success}"/>
      <text x="200" y="155" text-anchor="middle" fill="white" font-size="18">FOCUS</text>
    </g>
  </svg>`;
  
  const highlights = {
    'glow-effect': glowEffect,
    'spotlight-effect': spotlightEffect
  };
  
  for (const [name, content] of Object.entries(highlights)) {
    await fs.writeFile(
      path.join(ASSETS_DIR, categories.highlights, `${name}.svg`),
      content
    );
  }
  
  console.log(`✅ ${Object.keys(highlights).length}개 하이라이트 템플릿 생성 완료`);
}

// ============= 트랜지션 효과 템플릿 생성 =============

async function generateTransitionTemplates() {
  console.log('🎭 트랜지션 효과 템플릿 생성 중...');
  
  // 1. Wipe 트랜지션
  const wipeTransition = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
    <defs>
      <style>
        @keyframes wipe {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        .wipe-rect {
          animation: wipe 1s ease-out forwards;
        }
      </style>
    </defs>
    
    <!-- Old content -->
    <rect width="400" height="300" fill="${colors.danger}" opacity="0.5"/>
    <text x="200" y="150" text-anchor="middle" fill="white" font-size="30">OLD</text>
    
    <!-- New content with wipe -->
    <g class="wipe-rect">
      <rect width="400" height="300" fill="${colors.success}"/>
      <text x="200" y="150" text-anchor="middle" fill="white" font-size="30">NEW</text>
    </g>
  </svg>`;
  
  // 2. Dissolve 트랜지션
  const dissolveTransition = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
    <defs>
      <style>
        @keyframes dissolve {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .dissolve-group {
          animation: dissolve 2s ease-in-out forwards;
        }
      </style>
    </defs>
    
    <!-- Old content -->
    <rect width="400" height="300" fill="${colors.secondary}"/>
    <text x="200" y="150" text-anchor="middle" fill="white" font-size="30">SCENE 1</text>
    
    <!-- New content with dissolve -->
    <g class="dissolve-group">
      <rect width="400" height="300" fill="${colors.primary}"/>
      <text x="200" y="150" text-anchor="middle" fill="white" font-size="30">SCENE 2</text>
    </g>
  </svg>`;
  
  const transitions = {
    'wipe-transition': wipeTransition,
    'dissolve-transition': dissolveTransition
  };
  
  for (const [name, content] of Object.entries(transitions)) {
    await fs.writeFile(
      path.join(ASSETS_DIR, categories.transitions, `${name}.svg`),
      content
    );
  }
  
  console.log(`✅ ${Object.keys(transitions).length}개 트랜지션 템플릿 생성 완료`);
}

// ============= 메인 실행 함수 =============

async function main() {
  console.log('🚀 InfoGraphAI 템플릿 생성 시작...\n');
  
  try {
    await ensureDirectories();
    
    await generateAnimationTemplates();
    await generateChartTemplates();
    await generateComparisonTemplates();
    await generateProcessTemplates();
    await generateTimelineTemplates();
    await generateConceptTemplates();
    await generateHighlightTemplates();
    await generateTransitionTemplates();
    
    // 통계 출력
    console.log('\n📊 생성 완료 통계:');
    console.log('------------------------');
    
    let total = 0;
    for (const [category, dirName] of Object.entries(categories)) {
      const files = await fs.readdir(path.join(ASSETS_DIR, dirName));
      const svgCount = files.filter(f => f.endsWith('.svg')).length;
      console.log(`${category}: ${svgCount}개`);
      total += svgCount;
    }
    
    console.log('------------------------');
    console.log(`총 템플릿: ${total}개`);
    console.log('\n✅ 모든 템플릿 생성 완료!');
    console.log(`📁 저장 위치: ${ASSETS_DIR}`);
    
  } catch (error) {
    console.error('❌ 에러 발생:', error);
  }
}

// 실행
main();