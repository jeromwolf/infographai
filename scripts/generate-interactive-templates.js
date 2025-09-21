#!/usr/bin/env node

/**
 * Interactive Templates Generator
 * Phase 4: 인터랙티브 요소 및 고급 애니메이션 템플릿
 */

const fs = require('fs').promises;
const path = require('path');

// 색상 팔레트
const colors = {
  primary: '#667eea',
  secondary: '#764ba2',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#06b6d4',
  dark: '#1a1a2e',
  light: '#f7fafc'
};

const ASSETS_DIR = path.join(__dirname, '..', 'assets', 'templates');

// ============= Interactive Quiz Templates =============

async function generateInteractiveQuizTemplates() {
  console.log('📝 Creating interactive quiz templates...');

  // 1. Multiple Choice Quiz
  const multipleChoiceQuiz = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
  <defs>
    <linearGradient id="quizGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1920" height="1080" fill="${colors.dark}"/>

  <!-- Quiz Header -->
  <rect x="200" y="100" width="1520" height="120" fill="url(#quizGradient)" rx="15"/>
  <text x="960" y="140" font-family="'Inter', sans-serif" font-size="24" fill="white" text-anchor="middle" font-weight="bold">
    Knowledge Check
  </text>
  <text x="960" y="180" font-family="'Inter', sans-serif" font-size="18" fill="white" text-anchor="middle" opacity="0.9">
    Choose the best answer for each question
  </text>

  <!-- Progress Bar -->
  <rect x="200" y="250" width="1520" height="10" fill="#2d2d4a" rx="5"/>
  <rect x="200" y="250" width="760" height="10" fill="${colors.success}" rx="5">
    <animate attributeName="width" values="0;760;1140;1520" dur="8s" repeatCount="indefinite"/>
  </rect>
  <text x="1750" y="245" font-family="'Inter', sans-serif" font-size="14" fill="white">
    <animate attributeName="fill" values="white;${colors.success};white" dur="2s" repeatCount="indefinite"/>
    2/4 Complete
  </text>

  <!-- Question -->
  <rect x="200" y="300" width="1520" height="100" fill="#2d2d4a" stroke="${colors.primary}" stroke-width="2" rx="10"/>
  <text x="220" y="340" font-family="'Inter', sans-serif" font-size="20" fill="white" font-weight="600">
    Q2: What is the main benefit of Docker containers?
  </text>

  <!-- Answer Options -->
  <g id="option-a" transform="translate(200, 450)">
    <rect width="1520" height="80" fill="#2d2d4a" stroke="#444" stroke-width="2" rx="8" opacity="0">
      <animate attributeName="opacity" values="0;1" dur="0.5s" begin="0.5s" fill="freeze"/>
    </rect>
    <circle cx="40" cy="40" r="15" fill="transparent" stroke="#666" stroke-width="2" opacity="0">
      <animate attributeName="opacity" values="0;1" dur="0.5s" begin="0.5s" fill="freeze"/>
    </circle>
    <text x="80" y="50" font-family="'Inter', sans-serif" font-size="18" fill="white" opacity="0">
      <animate attributeName="opacity" values="0;1" dur="0.5s" begin="0.5s" fill="freeze"/>
      A) Faster boot times compared to virtual machines
    </text>

    <!-- Hover effect -->
    <rect width="1520" height="80" fill="transparent" opacity="0">
      <animate attributeName="fill" values="transparent;${colors.primary}" dur="0.3s" begin="2s" fill="freeze"/>
      <animate attributeName="opacity" values="0;0.1" dur="0.3s" begin="2s" fill="freeze"/>
    </rect>
  </g>

  <g id="option-b" transform="translate(200, 550)">
    <rect width="1520" height="80" fill="#2d2d4a" stroke="#666" stroke-width="2" rx="8" opacity="0">
      <animate attributeName="opacity" values="0;1" dur="0.5s" begin="0.7s" fill="freeze"/>
    </rect>
    <circle cx="40" cy="40" r="15" fill="transparent" stroke="#666" stroke-width="2" opacity="0">
      <animate attributeName="opacity" values="0;1" dur="0.5s" begin="0.7s" fill="freeze"/>
    </circle>
    <text x="80" y="50" font-family="'Inter', sans-serif" font-size="18" fill="white" opacity="0">
      <animate attributeName="opacity" values="0;1" dur="0.5s" begin="0.7s" fill="freeze"/>
      B) Better security than traditional applications
    </text>
  </g>

  <g id="option-c" transform="translate(200, 650)">
    <rect width="1520" height="80" fill="#2d2d4a" stroke="${colors.success}" stroke-width="3" rx="8" opacity="0">
      <animate attributeName="opacity" values="0;1" dur="0.5s" begin="0.9s" fill="freeze"/>
      <animate attributeName="stroke" values="${colors.success};#666;${colors.success}" dur="1s" begin="3s" repeatCount="3"/>
    </rect>
    <circle cx="40" cy="40" r="15" fill="${colors.success}" stroke="${colors.success}" stroke-width="2" opacity="0">
      <animate attributeName="opacity" values="0;1" dur="0.5s" begin="0.9s" fill="freeze"/>
    </circle>
    <path d="M 32 40 L 38 46 L 48 34" stroke="white" stroke-width="2" fill="none" opacity="0">
      <animate attributeName="opacity" values="0;1" dur="0.3s" begin="3s" fill="freeze"/>
    </path>
    <text x="80" y="50" font-family="'Inter', sans-serif" font-size="18" fill="white" opacity="0">
      <animate attributeName="opacity" values="0;1" dur="0.5s" begin="0.9s" fill="freeze"/>
      C) Consistent deployment across different environments ✓
    </text>
  </g>

  <g id="option-d" transform="translate(200, 750)">
    <rect width="1520" height="80" fill="#2d2d4a" stroke="#666" stroke-width="2" rx="8" opacity="0">
      <animate attributeName="opacity" values="0;1" dur="0.5s" begin="1.1s" fill="freeze"/>
    </rect>
    <circle cx="40" cy="40" r="15" fill="transparent" stroke="#666" stroke-width="2" opacity="0">
      <animate attributeName="opacity" values="0;1" dur="0.5s" begin="1.1s" fill="freeze"/>
    </circle>
    <text x="80" y="50" font-family="'Inter', sans-serif" font-size="18" fill="white" opacity="0">
      <animate attributeName="opacity" values="0;1" dur="0.5s" begin="1.1s" fill="freeze"/>
      D) Automatically scales based on demand
    </text>
  </g>

  <!-- Feedback -->
  <g transform="translate(960, 900)" opacity="0">
    <animate attributeName="opacity" values="0;1" dur="0.5s" begin="4s" fill="freeze"/>
    <rect x="-300" y="-40" width="600" height="80" fill="${colors.success}" rx="10"/>
    <text x="0" y="-10" font-family="'Inter', sans-serif" font-size="18" fill="white" text-anchor="middle" font-weight="bold">
      Correct! 🎉
    </text>
    <text x="0" y="20" font-family="'Inter', sans-serif" font-size="14" fill="white" text-anchor="middle">
      Docker ensures consistent environments across development, testing, and production
    </text>
  </g>

  <!-- Next Button -->
  <g transform="translate(1600, 980)" opacity="0">
    <animate attributeName="opacity" values="0;1" dur="0.5s" begin="5s" fill="freeze"/>
    <rect x="-100" y="-25" width="200" height="50" fill="${colors.primary}" rx="25"/>
    <text x="0" y="5" font-family="'Inter', sans-serif" font-size="16" fill="white" text-anchor="middle">
      Next Question →
    </text>
  </g>
</svg>`;

  // 2. Code Challenge Quiz
  const codeChallenge = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
  <defs>
    <linearGradient id="codeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1e1e1e;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#2d2d30;stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1920" height="1080" fill="url(#codeGradient)"/>

  <!-- Header -->
  <rect x="0" y="0" width="1920" height="80" fill="#252526"/>
  <text x="960" y="50" font-family="'Cascadia Code', monospace" font-size="24" fill="white" text-anchor="middle">
    Code Challenge: Fix the Bug
  </text>

  <!-- Problem Description -->
  <rect x="50" y="100" width="800" height="200" fill="#1e1e1e" stroke="#007acc" stroke-width="2" rx="8"/>
  <text x="70" y="130" font-family="'Inter', sans-serif" font-size="16" fill="#cccccc" font-weight="bold">
    Problem:
  </text>
  <text x="70" y="160" font-family="'Inter', sans-serif" font-size="14" fill="#cccccc">
    The following React component has a bug that causes
  </text>
  <text x="70" y="180" font-family="'Inter', sans-serif" font-size="14" fill="#cccccc">
    infinite re-renders. Identify and fix the issue.
  </text>

  <!-- Timer -->
  <rect x="70" y="220" width="200" height="60" fill="#2d2d30" stroke="#f59e0b" stroke-width="2" rx="5"/>
  <text x="170" y="245" font-family="'Inter', sans-serif" font-size="14" fill="#f59e0b" text-anchor="middle">
    Time Remaining
  </text>
  <text x="170" y="265" font-family="'Cascadia Code', monospace" font-size="18" fill="#f59e0b" text-anchor="middle">
    <animate attributeName="fill" values="#f59e0b;#ef4444;#f59e0b" dur="1s" repeatCount="indefinite"/>
    02:30
  </text>

  <!-- Code Editor -->
  <rect x="50" y="320" width="800" height="600" fill="#1e1e1e" stroke="#333" stroke-width="1" rx="5"/>

  <!-- Line Numbers -->
  <rect x="50" y="320" width="40" height="600" fill="#252526"/>
  <g font-family="'Cascadia Code', monospace" font-size="14" fill="#858585">
    <text x="70" y="345" text-anchor="middle">1</text>
    <text x="70" y="365" text-anchor="middle">2</text>
    <text x="70" y="385" text-anchor="middle">3</text>
    <text x="70" y="405" text-anchor="middle">4</text>
    <text x="70" y="425" text-anchor="middle">5</text>
    <text x="70" y="445" text-anchor="middle">6</text>
    <text x="70" y="465" text-anchor="middle">7</text>
    <text x="70" y="485" text-anchor="middle">8</text>
    <text x="70" y="505" text-anchor="middle">9</text>
    <text x="70" y="525" text-anchor="middle">10</text>
  </g>

  <!-- Code Content -->
  <g font-family="'Cascadia Code', monospace" font-size="14">
    <text x="100" y="345" fill="#c586c0">function</text>
    <text x="180" y="345" fill="#dcdcaa">Counter</text>
    <text x="240" y="345" fill="#d4d4d4">() {</text>

    <text x="120" y="365" fill="#c586c0">const</text>
    <text x="170" y="365" fill="#9cdcfe">[count, setCount]</text>
    <text x="300" y="365" fill="#d4d4d4">=</text>
    <text x="320" y="365" fill="#dcdcaa">useState</text>
    <text x="390" y="365" fill="#d4d4d4">(0);</text>

    <!-- Problematic line highlighted -->
    <rect x="90" y="375" width="650" height="20" fill="#ff4444" opacity="0.3">
      <animate attributeName="opacity" values="0.3;0.6;0.3" dur="1s" repeatCount="indefinite"/>
    </rect>
    <text x="120" y="385" fill="#dcdcaa">setCount</text>
    <text x="190" y="385" fill="#d4d4d4">(count + 1); // Bug is here!</text>

    <text x="120" y="425" fill="#c586c0">return</text>
    <text x="180" y="425" fill="#d4d4d4">(</text>
    <text x="140" y="445" fill="#d4d4d4">&lt;</text>
    <text x="160" y="445" fill="#4ec9b0">div</text>
    <text x="190" y="445" fill="#d4d4d4">&gt;</text>
    <text x="160" y="465" fill="#d4d4d4">&lt;</text>
    <text x="180" y="465" fill="#4ec9b0">p</text>
    <text x="195" y="465" fill="#d4d4d4">&gt;Count: {count}&lt;/</text>
    <text x="350" y="465" fill="#4ec9b0">p</text>
    <text x="365" y="465" fill="#d4d4d4">&gt;</text>
    <text x="160" y="485" fill="#d4d4d4">&lt;</text>
    <text x="180" y="485" fill="#4ec9b0">button</text>
    <text x="240" y="485" fill="#92c5f7">onClick</text>
    <text x="295" y="485" fill="#d4d4d4">={() =&gt;</text>
    <text x="360" y="485" fill="#dcdcaa">setCount</text>
    <text x="430" y="485" fill="#d4d4d4">(count + 1)}&gt;</text>
    <text x="180" y="505" fill="#d4d4d4">Increment</text>
    <text x="160" y="525" fill="#d4d4d4">&lt;/</text>
    <text x="185" y="525" fill="#4ec9b0">button</text>
    <text x="235" y="525" fill="#d4d4d4">&gt;</text>
    <text x="140" y="545" fill="#d4d4d4">&lt;/</text>
    <text x="165" y="545" fill="#4ec9b0">div</text>
    <text x="190" y="545" fill="#d4d4d4">&gt;</text>
    <text x="120" y="565" fill="#d4d4d4">);</text>
    <text x="100" y="585" fill="#d4d4d4">}</text>
  </g>

  <!-- Solution Panel -->
  <rect x="900" y="100" width="900" height="820" fill="#1e1e1e" stroke="#10b981" stroke-width="2" rx="8" opacity="0">
    <animate attributeName="opacity" values="0;1" dur="0.5s" begin="3s" fill="freeze"/>
  </rect>
  <text x="1350" y="140" font-family="'Inter', sans-serif" font-size="18" fill="#10b981" text-anchor="middle" font-weight="bold" opacity="0">
    <animate attributeName="opacity" values="0;1" dur="0.5s" begin="3s" fill="freeze"/>
    Solution Explanation
  </text>

  <g transform="translate(920, 170)" opacity="0">
    <animate attributeName="opacity" values="0;1" dur="0.5s" begin="3.5s" fill="freeze"/>
    <text x="0" y="0" font-family="'Inter', sans-serif" font-size="14" fill="#cccccc">
      The issue is on line 3: setCount(count + 1) is called
    </text>
    <text x="0" y="25" font-family="'Inter', sans-serif" font-size="14" fill="#cccccc">
      during render, causing infinite re-renders.
    </text>

    <text x="0" y="70" font-family="'Inter', sans-serif" font-size="14" fill="#10b981" font-weight="bold">
      Correct Solution:
    </text>
    <text x="0" y="95" font-family="'Cascadia Code', monospace" font-size="13" fill="#dcdcaa">
      // Remove the line causing infinite render
    </text>
    <text x="0" y="115" font-family="'Cascadia Code', monospace" font-size="13" fill="#c586c0">
      function
    </text>
    <text x="70" y="115" font-family="'Cascadia Code', monospace" font-size="13" fill="#dcdcaa">
      Counter
    </text>
    <text x="130" y="115" font-family="'Cascadia Code', monospace" font-size="13" fill="#d4d4d4">
      () {
    </text>

    <text x="20" y="135" font-family="'Cascadia Code', monospace" font-size="13" fill="#c586c0">
      const
    </text>
    <text x="70" y="135" font-family="'Cascadia Code', monospace" font-size="13" fill="#9cdcfe">
      [count, setCount]
    </text>
    <text x="200" y="135" font-family="'Cascadia Code', monospace" font-size="13" fill="#d4d4d4">
      = useState(0);
    </text>

    <text x="20" y="175" font-family="'Cascadia Code', monospace" font-size="13" fill="#c586c0">
      return
    </text>
    <text x="70" y="175" font-family="'Cascadia Code', monospace" font-size="13" fill="#d4d4d4">
      (/* JSX content */);
    </text>
    <text x="0" y="195" font-family="'Cascadia Code', monospace" font-size="13" fill="#d4d4d4">
      }
    </text>
  </g>

  <!-- Success Badge -->
  <g transform="translate(1350, 800)" opacity="0">
    <animate attributeName="opacity" values="0;1" dur="0.5s" begin="4s" fill="freeze"/>
    <circle cx="0" cy="0" r="40" fill="#10b981"/>
    <path d="M -15 0 L -5 10 L 15 -10" stroke="white" stroke-width="3" fill="none"/>
    <text x="0" y="70" font-family="'Inter', sans-serif" font-size="16" fill="#10b981" text-anchor="middle" font-weight="bold">
      Challenge Complete!
    </text>
  </g>
</svg>`;

  // 3. Interactive Rating Quiz
  const ratingQuiz = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
  <defs>
    <linearGradient id="ratingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1920" height="1080" fill="${colors.dark}"/>

  <!-- Header -->
  <rect x="200" y="100" width="1520" height="120" fill="url(#ratingGradient)" rx="15"/>
  <text x="960" y="140" font-family="'Inter', sans-serif" font-size="24" fill="white" text-anchor="middle" font-weight="bold">
    Rate Your Experience
  </text>
  <text x="960" y="180" font-family="'Inter', sans-serif" font-size="18" fill="white" text-anchor="middle" opacity="0.9">
    How would you rate this Docker tutorial?
  </text>

  <!-- Rating Scale -->
  <g transform="translate(960, 400)">
    <!-- Scale Labels -->
    <text x="-300" y="-30" font-family="'Inter', sans-serif" font-size="16" fill="white" text-anchor="middle">
      Poor
    </text>
    <text x="300" y="-30" font-family="'Inter', sans-serif" font-size="16" fill="white" text-anchor="middle">
      Excellent
    </text>

    <!-- Star Rating -->
    <g id="star-rating">
      <g transform="translate(-200, 0)">
        <polygon points="0,-20 6,-6 20,-6 10,2 15,16 0,8 -15,16 -10,2 -20,-6 -6,-6"
                 fill="#444" stroke="#666" stroke-width="2" opacity="0">
          <animate attributeName="opacity" values="0;1" dur="0.3s" begin="0.5s" fill="freeze"/>
          <animate attributeName="fill" values="#444;#ffd700;#444" dur="0.5s" begin="2s" fill="freeze"/>
        </polygon>
      </g>
      <g transform="translate(-100, 0)">
        <polygon points="0,-20 6,-6 20,-6 10,2 15,16 0,8 -15,16 -10,2 -20,-6 -6,-6"
                 fill="#444" stroke="#666" stroke-width="2" opacity="0">
          <animate attributeName="opacity" values="0;1" dur="0.3s" begin="0.7s" fill="freeze"/>
          <animate attributeName="fill" values="#444;#ffd700;#444" dur="0.5s" begin="2.2s" fill="freeze"/>
        </polygon>
      </g>
      <g transform="translate(0, 0)">
        <polygon points="0,-20 6,-6 20,-6 10,2 15,16 0,8 -15,16 -10,2 -20,-6 -6,-6"
                 fill="#444" stroke="#666" stroke-width="2" opacity="0">
          <animate attributeName="opacity" values="0;1" dur="0.3s" begin="0.9s" fill="freeze"/>
          <animate attributeName="fill" values="#444;#ffd700;#444" dur="0.5s" begin="2.4s" fill="freeze"/>
        </polygon>
      </g>
      <g transform="translate(100, 0)">
        <polygon points="0,-20 6,-6 20,-6 10,2 15,16 0,8 -15,16 -10,2 -20,-6 -6,-6"
                 fill="#444" stroke="#666" stroke-width="2" opacity="0">
          <animate attributeName="opacity" values="0;1" dur="0.3s" begin="1.1s" fill="freeze"/>
          <animate attributeName="fill" values="#444;#ffd700;#444" dur="0.5s" begin="2.6s" fill="freeze"/>
        </polygon>
      </g>
      <g transform="translate(200, 0)">
        <polygon points="0,-20 6,-6 20,-6 10,2 15,16 0,8 -15,16 -10,2 -20,-6 -6,-6"
                 fill="#444" stroke="#666" stroke-width="2" opacity="0">
          <animate attributeName="opacity" values="0;1" dur="0.3s" begin="1.3s" fill="freeze"/>
          <animate attributeName="fill" values="#444;#ffd700;#444" dur="0.5s" begin="2.8s" fill="freeze"/>
        </polygon>
      </g>
    </g>

    <!-- Hover Effect Simulation -->
    <circle cx="100" cy="0" r="35" fill="transparent" opacity="0">
      <animate attributeName="fill" values="transparent;${colors.primary}" dur="0.3s" begin="3.5s" fill="freeze"/>
      <animate attributeName="opacity" values="0;0.2" dur="0.3s" begin="3.5s" fill="freeze"/>
    </circle>
  </g>

  <!-- Selected Rating Display -->
  <g transform="translate(960, 600)" opacity="0">
    <animate attributeName="opacity" values="0;1" dur="0.5s" begin="4s" fill="freeze"/>
    <text x="0" y="0" font-family="'Inter', sans-serif" font-size="24" fill="#ffd700" text-anchor="middle" font-weight="bold">
      ★★★★☆
    </text>
    <text x="0" y="40" font-family="'Inter', sans-serif" font-size="18" fill="white" text-anchor="middle">
      4 out of 5 stars
    </text>
    <text x="0" y="70" font-family="'Inter', sans-serif" font-size="14" fill="#cccccc" text-anchor="middle">
      "Great tutorial! Very clear explanations."
    </text>
  </g>

  <!-- Feedback Form -->
  <rect x="400" y="750" width="1120" height="200" fill="#2d2d4a" stroke="${colors.primary}" stroke-width="2" rx="10" opacity="0">
    <animate attributeName="opacity" values="0;1" dur="0.5s" begin="4.5s" fill="freeze"/>
  </rect>
  <text x="960" y="780" font-family="'Inter', sans-serif" font-size="16" fill="white" text-anchor="middle" opacity="0">
    <animate attributeName="opacity" values="0;1" dur="0.5s" begin="4.5s" fill="freeze"/>
    Additional Comments (Optional)
  </text>

  <!-- Simulated typing -->
  <text x="420" y="820" font-family="'Inter', sans-serif" font-size="14" fill="#cccccc" opacity="0">
    <animate attributeName="opacity" values="0;1" dur="0.5s" begin="5s" fill="freeze"/>
    The Docker examples were really helpful for understanding
  </text>
  <text x="420" y="845" font-family="'Inter', sans-serif" font-size="14" fill="#cccccc" opacity="0">
    <animate attributeName="opacity" values="0;1" dur="0.5s" begin="5.5s" fill="freeze"/>
    containerization concepts. Would love more advanced topics!
  </text>

  <!-- Cursor -->
  <rect x="600" y="850" width="2" height="16" fill="${colors.primary}" opacity="0">
    <animate attributeName="opacity" values="0;1;0" dur="1s" begin="6s" repeatCount="indefinite"/>
  </rect>

  <!-- Submit Button -->
  <g transform="translate(960, 980)" opacity="0">
    <animate attributeName="opacity" values="0;1" dur="0.5s" begin="6s" fill="freeze"/>
    <rect x="-100" y="-25" width="200" height="50" fill="${colors.success}" rx="25"/>
    <text x="0" y="5" font-family="'Inter', sans-serif" font-size="16" fill="white" text-anchor="middle">
      Submit Feedback
    </text>
  </g>
</svg>`;

  const quizDir = path.join(ASSETS_DIR, 'quiz');
  await fs.mkdir(quizDir, { recursive: true });

  await fs.writeFile(path.join(quizDir, 'multiple-choice.svg'), multipleChoiceQuiz);
  await fs.writeFile(path.join(quizDir, 'code-challenge.svg'), codeChallenge);
  await fs.writeFile(path.join(quizDir, 'rating-scale.svg'), ratingQuiz);

  console.log('✅ Created 3 interactive quiz templates');
}

// ============= Drag and Drop Templates =============

async function generateDragDropTemplates() {
  console.log('🔄 Creating drag-and-drop templates...');

  // 1. Component Matching Drag-Drop
  const componentMatching = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
  <defs>
    <linearGradient id="dragGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#6366f1;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" />
    </linearGradient>
    <filter id="shadow">
      <feDropShadow dx="3" dy="3" stdDeviation="3" flood-opacity="0.3"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1920" height="1080" fill="${colors.dark}"/>

  <!-- Header -->
  <rect x="200" y="50" width="1520" height="80" fill="url(#dragGradient)" rx="10"/>
  <text x="960" y="100" font-family="'Inter', sans-serif" font-size="24" fill="white" text-anchor="middle" font-weight="bold">
    Match Components to Their Functions
  </text>

  <!-- Left Side - Components -->
  <text x="300" y="180" font-family="'Inter', sans-serif" font-size="18" fill="white" font-weight="bold">
    Docker Components
  </text>

  <g id="draggable-components">
    <!-- Dockerfile Component -->
    <g transform="translate(150, 220)">
      <rect width="300" height="80" fill="#2d2d4a" stroke="${colors.primary}" stroke-width="2" rx="8" filter="url(#shadow)"/>
      <rect x="10" y="10" width="60" height="60" fill="${colors.primary}" rx="5"/>
      <text x="40" y="50" font-family="'Cascadia Code', monospace" font-size="24" fill="white" text-anchor="middle">
        📄
      </text>
      <text x="90" y="35" font-family="'Inter', sans-serif" font-size="16" fill="white" font-weight="bold">
        Dockerfile
      </text>
      <text x="90" y="55" font-family="'Inter', sans-serif" font-size="12" fill="#cccccc">
        Configuration file
      </text>

      <!-- Drag animation -->
      <animateTransform attributeName="transform"
                        values="translate(150, 220); translate(170, 200); translate(150, 220)"
                        dur="3s" begin="2s" repeatCount="1"/>
    </g>

    <!-- Image Component -->
    <g transform="translate(150, 320)">
      <rect width="300" height="80" fill="#2d2d4a" stroke="${colors.info}" stroke-width="2" rx="8" filter="url(#shadow)"/>
      <rect x="10" y="10" width="60" height="60" fill="${colors.info}" rx="5"/>
      <text x="40" y="50" font-family="'Cascadia Code', monospace" font-size="24" fill="white" text-anchor="middle">
        📦
      </text>
      <text x="90" y="35" font-family="'Inter', sans-serif" font-size="16" fill="white" font-weight="bold">
        Image
      </text>
      <text x="90" y="55" font-family="'Inter', sans-serif" font-size="12" fill="#cccccc">
        Template snapshot
      </text>
    </g>

    <!-- Container Component -->
    <g transform="translate(150, 420)">
      <rect width="300" height="80" fill="#2d2d4a" stroke="${colors.success}" stroke-width="2" rx="8" filter="url(#shadow)"/>
      <rect x="10" y="10" width="60" height="60" fill="${colors.success}" rx="5"/>
      <text x="40" y="50" font-family="'Cascadia Code', monospace" font-size="24" fill="white" text-anchor="middle">
        🏃
      </text>
      <text x="90" y="35" font-family="'Inter', sans-serif" font-size="16" fill="white" font-weight="bold">
        Container
      </text>
      <text x="90" y="55" font-family="'Inter', sans-serif" font-size="12" fill="#cccccc">
        Running instance
      </text>

      <!-- Successful drop animation -->
      <animateTransform attributeName="transform"
                        values="translate(150, 420); translate(1200, 420); translate(1200, 420)"
                        dur="2s" begin="4s" repeatCount="1"/>
    </g>
  </g>

  <!-- Right Side - Drop Zones -->
  <text x="1300" y="180" font-family="'Inter', sans-serif" font-size="18" fill="white" font-weight="bold">
    Functions
  </text>

  <g id="drop-zones">
    <!-- Build Instructions Drop Zone -->
    <g transform="translate(1100, 220)">
      <rect width="400" height="80" fill="transparent" stroke="#666" stroke-width="2" stroke-dasharray="5,5" rx="8"/>
      <text x="200" y="30" font-family="'Inter', sans-serif" font-size="14" fill="#999" text-anchor="middle">
        Contains build instructions and
      </text>
      <text x="200" y="50" font-family="'Inter', sans-serif" font-size="14" fill="#999" text-anchor="middle">
        configuration for creating images
      </text>

      <!-- Drop success -->
      <rect width="400" height="80" fill="${colors.primary}" opacity="0" rx="8">
        <animate attributeName="opacity" values="0;0.2;0" dur="1s" begin="2.5s" repeatCount="1"/>
      </rect>
    </g>

    <!-- Template Drop Zone -->
    <g transform="translate(1100, 320)">
      <rect width="400" height="80" fill="transparent" stroke="#666" stroke-width="2" stroke-dasharray="5,5" rx="8"/>
      <text x="200" y="30" font-family="'Inter', sans-serif" font-size="14" fill="#999" text-anchor="middle">
        Read-only template used to create
      </text>
      <text x="200" y="50" font-family="'Inter', sans-serif" font-size="14" fill="#999" text-anchor="middle">
        containers with specific software
      </text>
    </g>

    <!-- Running Instance Drop Zone -->
    <g transform="translate(1100, 420)">
      <rect width="400" height="80" fill="transparent" stroke="${colors.success}" stroke-width="3" stroke-dasharray="5,5" rx="8">
        <animate attributeName="stroke" values="${colors.success};#666;${colors.success}" dur="1s" begin="4s" repeatCount="3"/>
      </rect>
      <text x="200" y="30" font-family="'Inter', sans-serif" font-size="14" fill="#999" text-anchor="middle">
        Executable instance of an image
      </text>
      <text x="200" y="50" font-family="'Inter', sans-serif" font-size="14" fill="#999" text-anchor="middle">
        that runs applications
      </text>

      <!-- Drop success animation -->
      <rect width="400" height="80" fill="${colors.success}" opacity="0" rx="8">
        <animate attributeName="opacity" values="0;0.3;0" dur="1s" begin="6s" repeatCount="1"/>
      </rect>

      <!-- Success checkmark -->
      <g opacity="0">
        <animate attributeName="opacity" values="0;1" dur="0.5s" begin="6.5s" fill="freeze"/>
        <circle cx="360" cy="20" r="15" fill="${colors.success}"/>
        <path d="M 352 20 L 358 26 L 368 16" stroke="white" stroke-width="2" fill="none"/>
      </g>
    </g>
  </g>

  <!-- Connection Lines -->
  <g opacity="0">
    <animate attributeName="opacity" values="0;1" dur="0.5s" begin="7s" fill="freeze"/>
    <!-- Correct connections -->
    <line x1="450" y1="260" x2="1100" y2="260" stroke="${colors.success}" stroke-width="3" stroke-dasharray="5,5"/>
    <line x1="450" y1="460" x2="1100" y2="460" stroke="${colors.success}" stroke-width="3" stroke-dasharray="5,5"/>

    <!-- Incorrect connection -->
    <line x1="450" y1="360" x2="1100" y2="360" stroke="${colors.danger}" stroke-width="3" stroke-dasharray="5,5" opacity="0.5"/>
    <text x="775" y="350" font-family="'Inter', sans-serif" font-size="12" fill="${colors.danger}" text-anchor="middle">
      Try again!
    </text>
  </g>

  <!-- Score Display -->
  <g transform="translate(960, 600)" opacity="0">
    <animate attributeName="opacity" values="0;1" dur="0.5s" begin="8s" fill="freeze"/>
    <rect x="-150" y="-40" width="300" height="80" fill="${colors.success}" rx="10"/>
    <text x="0" y="-10" font-family="'Inter', sans-serif" font-size="18" fill="white" text-anchor="middle" font-weight="bold">
      Great Job! 🎉
    </text>
    <text x="0" y="15" font-family="'Inter', sans-serif" font-size="14" fill="white" text-anchor="middle">
      2/3 Correct Matches
    </text>
  </g>
</svg>`;

  // 2. Sequence Ordering Drag-Drop
  const sequenceOrdering = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
  <!-- Background -->
  <rect width="1920" height="1080" fill="${colors.dark}"/>

  <!-- Header -->
  <rect x="200" y="50" width="1520" height="80" fill="url(#dragGradient)" rx="10"/>
  <text x="960" y="100" font-family="'Inter', sans-serif" font-size="24" fill="white" text-anchor="middle" font-weight="bold">
    Arrange CI/CD Pipeline Steps in Correct Order
  </text>

  <!-- Shuffled Steps -->
  <text x="200" y="180" font-family="'Inter', sans-serif" font-size="18" fill="white" font-weight="bold">
    Drag to Reorder:
  </text>

  <g id="shuffled-steps">
    <!-- Step 4 (Deploy) - Out of order -->
    <g transform="translate(200, 220)">
      <rect width="400" height="60" fill="#2d2d4a" stroke="${colors.warning}" stroke-width="2" rx="8"/>
      <text x="20" y="25" font-family="'Inter', sans-serif" font-size="14" fill="${colors.warning}" font-weight="bold">
        4
      </text>
      <text x="50" y="25" font-family="'Inter', sans-serif" font-size="16" fill="white">
        Deploy to Production
      </text>
      <text x="50" y="45" font-family="'Inter', sans-serif" font-size="12" fill="#cccccc">
        Release the application to users
      </text>
    </g>

    <!-- Step 1 (Code) - Correct position -->
    <g transform="translate(200, 300)">
      <rect width="400" height="60" fill="#2d2d4a" stroke="${colors.success}" stroke-width="2" rx="8"/>
      <text x="20" y="25" font-family="'Inter', sans-serif" font-size="14" fill="${colors.success}" font-weight="bold">
        1
      </text>
      <text x="50" y="25" font-family="'Inter', sans-serif" font-size="16" fill="white">
        Code Commit
      </text>
      <text x="50" y="45" font-family="'Inter', sans-serif" font-size="12" fill="#cccccc">
        Push changes to repository
      </text>
    </g>

    <!-- Step 3 (Test) - Out of order -->
    <g transform="translate(200, 380)">
      <rect width="400" height="60" fill="#2d2d4a" stroke="${colors.warning}" stroke-width="2" rx="8"/>
      <text x="20" y="25" font-family="'Inter', sans-serif" font-size="14" fill="${colors.warning}" font-weight="bold">
        3
      </text>
      <text x="50" y="25" font-family="'Inter', sans-serif" font-size="16" fill="white">
        Run Tests
      </text>
      <text x="50" y="45" font-family="'Inter', sans-serif" font-size="12" fill="#cccccc">
        Execute automated test suite
      </text>
    </g>

    <!-- Step 2 (Build) - Out of order -->
    <g transform="translate(200, 460)">
      <rect width="400" height="60" fill="#2d2d4a" stroke="${colors.warning}" stroke-width="2" rx="8"/>
      <text x="20" y="25" font-family="'Inter', sans-serif" font-size="14" fill="${colors.warning}" font-weight="bold">
        2
      </text>
      <text x="50" y="25" font-family="'Inter', sans-serif" font-size="16" fill="white">
        Build Application
      </text>
      <text x="50" y="45" font-family="'Inter', sans-serif" font-size="12" fill="#cccccc">
        Compile and package the code
      </text>
    </g>
  </g>

  <!-- Correct Order Zone -->
  <text x="800" y="180" font-family="'Inter', sans-serif" font-size="18" fill="white" font-weight="bold">
    Correct Order:
  </text>

  <!-- Drop zones for correct order -->
  <g id="correct-order">
    <g transform="translate(800, 220)">
      <rect width="500" height="60" fill="transparent" stroke="${colors.success}" stroke-width="2" stroke-dasharray="5,5" rx="8"/>
      <text x="20" y="35" font-family="'Inter', sans-serif" font-size="14" fill="${colors.success}" text-anchor="middle">
        1st
      </text>
      <text x="250" y="35" font-family="'Inter', sans-serif" font-size="14" fill="#999" text-anchor="middle">
        Code Commit ✓
      </text>
    </g>

    <g transform="translate(800, 300)">
      <rect width="500" height="60" fill="transparent" stroke="#666" stroke-width="2" stroke-dasharray="5,5" rx="8"/>
      <text x="20" y="35" font-family="'Inter', sans-serif" font-size="14" fill="#666" text-anchor="middle">
        2nd
      </text>
    </g>

    <g transform="translate(800, 380)">
      <rect width="500" height="60" fill="transparent" stroke="#666" stroke-width="2" stroke-dasharray="5,5" rx="8"/>
      <text x="20" y="35" font-family="'Inter', sans-serif" font-size="14" fill="#666" text-anchor="middle">
        3rd
      </text>
    </g>

    <g transform="translate(800, 460)">
      <rect width="500" height="60" fill="transparent" stroke="#666" stroke-width="2" stroke-dasharray="5,5" rx="8"/>
      <text x="20" y="35" font-family="'Inter', sans-serif" font-size="14" fill="#666" text-anchor="middle">
        4th
      </text>
    </g>
  </g>

  <!-- Animation showing correct reordering -->
  <g opacity="0">
    <animate attributeName="opacity" values="0;1" dur="0.5s" begin="3s" fill="freeze"/>

    <!-- Step 2 moving to position -->
    <g transform="translate(800, 300)">
      <rect width="500" height="60" fill="#2d2d4a" stroke="${colors.success}" stroke-width="2" rx="8"/>
      <text x="50" y="25" font-family="'Inter', sans-serif" font-size="16" fill="white">
        Build Application
      </text>
      <text x="50" y="45" font-family="'Inter', sans-serif" font-size="12" fill="#cccccc">
        Compile and package the code
      </text>
    </g>

    <!-- Step 3 moving to position -->
    <g transform="translate(800, 380)">
      <rect width="500" height="60" fill="#2d2d4a" stroke="${colors.success}" stroke-width="2" rx="8"/>
      <text x="50" y="25" font-family="'Inter', sans-serif" font-size="16" fill="white">
        Run Tests
      </text>
      <text x="50" y="45" font-family="'Inter', sans-serif" font-size="12" fill="#cccccc">
        Execute automated test suite
      </text>
    </g>

    <!-- Step 4 moving to position -->
    <g transform="translate(800, 460)">
      <rect width="500" height="60" fill="#2d2d4a" stroke="${colors.success}" stroke-width="2" rx="8"/>
      <text x="50" y="25" font-family="'Inter', sans-serif" font-size="16" fill="white">
        Deploy to Production
      </text>
      <text x="50" y="45" font-family="'Inter', sans-serif" font-size="12" fill="#cccccc">
        Release the application to users
      </text>
    </g>
  </g>

  <!-- Success Message -->
  <g transform="translate(960, 600)" opacity="0">
    <animate attributeName="opacity" values="0;1" dur="0.5s" begin="4s" fill="freeze"/>
    <rect x="-200" y="-50" width="400" height="100" fill="${colors.success}" rx="10"/>
    <text x="0" y="-20" font-family="'Inter', sans-serif" font-size="20" fill="white" text-anchor="middle" font-weight="bold">
      Perfect Order! 🎯
    </text>
    <text x="0" y="10" font-family="'Inter', sans-serif" font-size="14" fill="white" text-anchor="middle">
      You've correctly arranged the CI/CD pipeline steps
    </text>
  </g>
</svg>`;

  const dragDropDir = path.join(ASSETS_DIR, 'drag-drop');
  await fs.mkdir(dragDropDir, { recursive: true });

  await fs.writeFile(path.join(dragDropDir, 'component-matching.svg'), componentMatching);
  await fs.writeFile(path.join(dragDropDir, 'sequence-ordering.svg'), sequenceOrdering);

  console.log('✅ Created 2 drag-and-drop templates');
}

// ============= Click-Reveal Templates =============

async function generateClickRevealTemplates() {
  console.log('👆 Creating click-reveal templates...');

  // 1. Progressive Disclosure Template
  const progressiveDisclosure = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
  <defs>
    <linearGradient id="revealGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#4f46e5;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#7c3aed;stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1920" height="1080" fill="${colors.dark}"/>

  <!-- Header -->
  <rect x="200" y="50" width="1520" height="80" fill="url(#revealGradient)" rx="10"/>
  <text x="960" y="100" font-family="'Inter', sans-serif" font-size="24" fill="white" text-anchor="middle" font-weight="bold">
    Docker Architecture Deep Dive
  </text>

  <!-- Main Container -->
  <rect x="200" y="180" width="1520" height="120" fill="#2d2d4a" stroke="${colors.primary}" stroke-width="2" rx="10"/>
  <text x="220" y="215" font-family="'Inter', sans-serif" font-size="20" fill="white" font-weight="bold">
    Docker Engine
  </text>
  <text x="220" y="240" font-family="'Inter', sans-serif" font-size="14" fill="#cccccc">
    The core runtime that manages containers
  </text>

  <!-- Click to reveal indicator -->
  <g transform="translate(1650, 240)">
    <circle cx="0" cy="0" r="25" fill="${colors.primary}" opacity="0.8">
      <animate attributeName="opacity" values="0.8;0.4;0.8" dur="2s" repeatCount="indefinite"/>
    </circle>
    <text x="0" y="5" font-family="'Inter', sans-serif" font-size="12" fill="white" text-anchor="middle">
      CLICK
    </text>
  </g>

  <!-- Level 1 Reveal - Components -->
  <g opacity="0">
    <animate attributeName="opacity" values="0;1" dur="0.5s" begin="2s" fill="freeze"/>

    <!-- Docker Daemon -->
    <rect x="250" y="340" width="400" height="80" fill="#3d3d5a" stroke="${colors.info}" stroke-width="2" rx="8"/>
    <text x="270" y="365" font-family="'Inter', sans-serif" font-size="16" fill="white" font-weight="bold">
      Docker Daemon (dockerd)
    </text>
    <text x="270" y="385" font-family="'Inter', sans-serif" font-size="12" fill="#cccccc">
      Background service managing Docker objects
    </text>

    <!-- Click indicator -->
    <g transform="translate(620, 380)">
      <circle cx="0" cy="0" r="15" fill="${colors.info}" opacity="0.8">
        <animate attributeName="opacity" values="0.8;0.4;0.8" dur="1.5s" begin="3s" repeatCount="indefinite"/>
      </circle>
      <text x="0" y="3" font-family="'Inter', sans-serif" font-size="8" fill="white" text-anchor="middle">
        +
      </text>
    </g>

    <!-- REST API -->
    <rect x="700" y="340" width="400" height="80" fill="#3d3d5a" stroke="${colors.warning}" stroke-width="2" rx="8"/>
    <text x="720" y="365" font-family="'Inter', sans-serif" font-size="16" fill="white" font-weight="bold">
      REST API
    </text>
    <text x="720" y="385" font-family="'Inter', sans-serif" font-size="12" fill="#cccccc">
      Interface for communicating with daemon
    </text>

    <!-- Docker CLI -->
    <rect x="1150" y="340" width="400" height="80" fill="#3d3d5a" stroke="${colors.success}" stroke-width="2" rx="8"/>
    <text x="1170" y="365" font-family="'Inter', sans-serif" font-size="16" fill="white" font-weight="bold">
      Docker CLI
    </text>
    <text x="1170" y="385" font-family="'Inter', sans-serif" font-size="12" fill="#cccccc">
      Command line interface for users
    </text>
  </g>

  <!-- Level 2 Reveal - Daemon Details -->
  <g opacity="0">
    <animate attributeName="opacity" values="0;1" dur="0.5s" begin="4s" fill="freeze"/>

    <!-- containerd -->
    <rect x="300" y="460" width="300" height="60" fill="#4d4d6a" stroke="${colors.info}" stroke-width="1" rx="6"/>
    <text x="320" y="485" font-family="'Inter', sans-serif" font-size="14" fill="white">
      containerd
    </text>
    <text x="320" y="505" font-family="'Inter', sans-serif" font-size="10" fill="#cccccc">
      Container lifecycle management
    </text>

    <!-- Image Store -->
    <rect x="300" y="540" width="140" height="40" fill="#5d5d7a" stroke="${colors.info}" stroke-width="1" rx="4"/>
    <text x="320" y="565" font-family="'Inter', sans-serif" font-size="12" fill="white">
      Image Store
    </text>

    <!-- Container Store -->
    <rect x="460" y="540" width="140" height="40" fill="#5d5d7a" stroke="${colors.info}" stroke-width="1" rx="4"/>
    <text x="480" y="565" font-family="'Inter', sans-serif" font-size="12" fill="white">
      Container Store
    </text>
  </g>

  <!-- Connection Lines -->
  <g opacity="0">
    <animate attributeName="opacity" values="0;1" dur="0.5s" begin="5s" fill="freeze"/>

    <!-- Arrows showing relationships -->
    <path d="M 450 320 L 450 340" stroke="${colors.info}" stroke-width="2" marker-end="url(#arrowhead)"/>
    <path d="M 900 320 L 900 340" stroke="${colors.warning}" stroke-width="2" marker-end="url(#arrowhead)"/>
    <path d="M 1350 320 L 1350 340" stroke="${colors.success}" stroke-width="2" marker-end="url(#arrowhead)"/>

    <!-- CLI to API -->
    <path d="M 1150 380 L 1100 380" stroke="${colors.primary}" stroke-width="2" stroke-dasharray="5,5"/>

    <!-- API to Daemon -->
    <path d="M 700 380 L 650 380" stroke="${colors.primary}" stroke-width="2" stroke-dasharray="5,5"/>
  </g>

  <!-- Information Panel -->
  <g transform="translate(200, 650)" opacity="0">
    <animate attributeName="opacity" values="0;1" dur="0.5s" begin="6s" fill="freeze"/>

    <rect width="1520" height="200" fill="#2d2d4a" stroke="${colors.primary}" stroke-width="2" rx="10"/>
    <text x="20" y="30" font-family="'Inter', sans-serif" font-size="16" fill="white" font-weight="bold">
      💡 Key Insights
    </text>

    <text x="20" y="60" font-family="'Inter', sans-serif" font-size="14" fill="#cccccc">
      • Docker Engine uses a client-server architecture with REST API communication
    </text>
    <text x="20" y="85" font-family="'Inter', sans-serif" font-size="14" fill="#cccccc">
      • The daemon (dockerd) is the persistent background service that does the heavy lifting
    </text>
    <text x="20" y="110" font-family="'Inter', sans-serif" font-size="14" fill="#cccccc">
      • containerd handles the container lifecycle while dockerd manages the overall orchestration
    </text>
    <text x="20" y="135" font-family="'Inter', sans-serif" font-size="14" fill="#cccccc">
      • CLI commands are translated into REST API calls that the daemon processes
    </text>
  </g>

  <!-- Progress Indicator -->
  <g transform="translate(100, 500)" opacity="0">
    <animate attributeName="opacity" values="0;1" dur="0.5s" begin="1s" fill="freeze"/>

    <text x="0" y="0" font-family="'Inter', sans-serif" font-size="12" fill="#666">
      Revealed:
    </text>

    <!-- Progress dots -->
    <circle cx="0" cy="30" r="6" fill="${colors.success}">
      <animate attributeName="fill" values="${colors.success};transparent;${colors.success}" dur="0.5s" begin="2s" fill="freeze"/>
    </circle>
    <circle cx="0" cy="60" r="6" fill="transparent" stroke="#666" stroke-width="1">
      <animate attributeName="fill" values="transparent;${colors.success}" dur="0.5s" begin="4s" fill="freeze"/>
    </circle>
    <circle cx="0" cy="90" r="6" fill="transparent" stroke="#666" stroke-width="1">
      <animate attributeName="fill" values="transparent;${colors.success}" dur="0.5s" begin="6s" fill="freeze"/>
    </circle>

    <text x="20" y="35" font-family="'Inter', sans-serif" font-size="10" fill="#cccccc">
      Basic Components
    </text>
    <text x="20" y="65" font-family="'Inter', sans-serif" font-size="10" fill="#cccccc">
      Internal Details
    </text>
    <text x="20" y="95" font-family="'Inter', sans-serif" font-size="10" fill="#cccccc">
      Key Insights
    </text>
  </g>

  <!-- Arrow marker definition -->
  <defs>
    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="${colors.primary}"/>
    </marker>
  </defs>
</svg>`;

  const clickRevealDir = path.join(ASSETS_DIR, 'click-reveal');
  await fs.mkdir(clickRevealDir, { recursive: true });

  await fs.writeFile(path.join(clickRevealDir, 'progressive-disclosure.svg'), progressiveDisclosure);

  console.log('✅ Created 1 click-reveal template');
}

// Main execution
async function main() {
  console.log('🚀 Starting Interactive Templates Generation');
  console.log('=' .repeat(60));

  try {
    await generateInteractiveQuizTemplates();
    await generateDragDropTemplates();
    await generateClickRevealTemplates();

    console.log('=' .repeat(60));
    console.log('✨ Interactive Templates Complete! Created:');
    console.log('  📝 Quiz Templates: 3');
    console.log('  🔄 Drag-Drop Templates: 2');
    console.log('  👆 Click-Reveal Templates: 1');
    console.log('📁 All templates saved to:', ASSETS_DIR);
  } catch (error) {
    console.error('❌ Error generating templates:', error);
  }
}

main();