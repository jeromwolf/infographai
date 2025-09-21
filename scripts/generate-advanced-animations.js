#!/usr/bin/env node

/**
 * Advanced Animation Templates Generator
 * 고급 애니메이션: morph, particle-effect, 3d-rotation
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

// ============= Morph Animation Templates =============

async function generateMorphTemplates() {
  console.log('🔄 Creating morph animation templates...');

  // 1. Docker Container Morphing
  const dockerMorph = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
  <defs>
    <linearGradient id="morphGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
    <filter id="morphGlow">
      <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1920" height="1080" fill="${colors.dark}"/>

  <!-- Title -->
  <text x="960" y="80" font-family="'Inter', sans-serif" font-size="32" fill="white" text-anchor="middle" font-weight="bold">
    From Code to Container: The Docker Journey
  </text>

  <!-- Stage 1: Source Code -->
  <g transform="translate(960, 400)" opacity="1">
    <animate attributeName="opacity" values="1;1;0" dur="8s" repeatCount="indefinite"/>

    <!-- Code file icon -->
    <rect x="-80" y="-60" width="160" height="120" fill="#2d2d4a" stroke="${colors.primary}" stroke-width="3" rx="10" filter="url(#morphGlow)">
      <animate attributeName="width" values="160;160;200" dur="8s" repeatCount="indefinite"/>
      <animate attributeName="height" values="120;120;160" dur="8s" repeatCount="indefinite"/>
      <animate attributeName="x" values="-80;-80;-100" dur="8s" repeatCount="indefinite"/>
      <animate attributeName="y" values="-60;-60;-80" dur="8s" repeatCount="indefinite"/>
    </rect>

    <!-- Code lines -->
    <g opacity="1">
      <animate attributeName="opacity" values="1;1;0" dur="8s" repeatCount="indefinite"/>
      <rect x="-60" y="-40" width="80" height="4" fill="${colors.primary}" rx="2"/>
      <rect x="-60" y="-25" width="100" height="4" fill="${colors.info}" rx="2"/>
      <rect x="-60" y="-10" width="60" height="4" fill="${colors.success}" rx="2"/>
      <rect x="-60" y="5" width="90" height="4" fill="${colors.warning}" rx="2"/>
      <rect x="-60" y="20" width="70" height="4" fill="${colors.danger}" rx="2"/>
    </g>

    <!-- Label -->
    <text x="0" y="100" font-family="'Inter', sans-serif" font-size="18" fill="white" text-anchor="middle" font-weight="bold">
      Source Code
    </text>
    <text x="0" y="125" font-family="'Inter', sans-serif" font-size="14" fill="#cccccc" text-anchor="middle">
      app.js, package.json, etc.
    </text>
  </g>

  <!-- Stage 2: Dockerfile -->
  <g transform="translate(960, 400)" opacity="0">
    <animate attributeName="opacity" values="0;1;1;0" dur="8s" begin="2s" repeatCount="indefinite"/>

    <!-- Dockerfile icon -->
    <rect x="-80" y="-60" width="160" height="120" fill="#2d2d4a" stroke="${colors.info}" stroke-width="3" rx="10" filter="url(#morphGlow)"/>

    <!-- Docker logo -->
    <g transform="scale(2)">
      <rect x="-15" y="-10" width="8" height="6" fill="${colors.info}" rx="1"/>
      <rect x="-5" y="-10" width="8" height="6" fill="${colors.info}" rx="1"/>
      <rect x="5" y="-10" width="8" height="6" fill="${colors.info}" rx="1"/>
      <rect x="-10" y="-20" width="8" height="6" fill="${colors.info}" rx="1"/>
      <rect x="0" y="-20" width="8" height="6" fill="${colors.info}" rx="1"/>
    </g>

    <!-- Instructions -->
    <g transform="translate(-40, 20)" opacity="0.8">
      <text font-family="'Cascadia Code', monospace" font-size="8" fill="${colors.info}">
        <tspan x="0" y="0">FROM node:14</tspan>
        <tspan x="0" y="12">COPY . /app</tspan>
        <tspan x="0" y="24">RUN npm install</tspan>
      </text>
    </g>

    <!-- Label -->
    <text x="0" y="100" font-family="'Inter', sans-serif" font-size="18" fill="white" text-anchor="middle" font-weight="bold">
      Dockerfile
    </text>
    <text x="0" y="125" font-family="'Inter', sans-serif" font-size="14" fill="#cccccc" text-anchor="middle">
      Build instructions
    </text>
  </g>

  <!-- Stage 3: Docker Image -->
  <g transform="translate(960, 400)" opacity="0">
    <animate attributeName="opacity" values="0;0;1;1;0" dur="8s" begin="4s" repeatCount="indefinite"/>

    <!-- Image layers -->
    <g>
      <rect x="-90" y="-50" width="180" height="20" fill="${colors.warning}" rx="10" opacity="0.9"/>
      <rect x="-85" y="-30" width="170" height="20" fill="${colors.success}" rx="10" opacity="0.8"/>
      <rect x="-80" y="-10" width="160" height="20" fill="${colors.info}" rx="10" opacity="0.7"/>
      <rect x="-75" y="10" width="150" height="20" fill="${colors.primary}" rx="10" opacity="0.6"/>
      <rect x="-70" y="30" width="140" height="20" fill="${colors.secondary}" rx="10" opacity="0.5"/>
    </g>

    <!-- 3D effect -->
    <g transform="translate(5, -5)" opacity="0.3">
      <rect x="-90" y="-50" width="180" height="20" fill="#666" rx="10"/>
      <rect x="-85" y="-30" width="170" height="20" fill="#666" rx="10"/>
      <rect x="-80" y="-10" width="160" height="20" fill="#666" rx="10"/>
      <rect x="-75" y="10" width="150" height="20" fill="#666" rx="10"/>
      <rect x="-70" y="30" width="140" height="20" fill="#666" rx="10"/>
    </g>

    <!-- Label -->
    <text x="0" y="100" font-family="'Inter', sans-serif" font-size="18" fill="white" text-anchor="middle" font-weight="bold">
      Docker Image
    </text>
    <text x="0" y="125" font-family="'Inter', sans-serif" font-size="14" fill="#cccccc" text-anchor="middle">
      Immutable template
    </text>
  </g>

  <!-- Stage 4: Running Container -->
  <g transform="translate(960, 400)" opacity="0">
    <animate attributeName="opacity" values="0;0;0;1;1" dur="8s" begin="6s" repeatCount="indefinite"/>

    <!-- Container with running indicator -->
    <rect x="-100" y="-80" width="200" height="160" fill="#2d2d4a" stroke="${colors.success}" stroke-width="4" rx="15" filter="url(#morphGlow)">
      <animate attributeName="stroke" values="${colors.success};#4ade80;${colors.success}" dur="1s" repeatCount="indefinite"/>
    </rect>

    <!-- Running process indicators -->
    <g>
      <circle cx="-60" cy="-40" r="8" fill="${colors.success}">
        <animate attributeName="opacity" values="1;0.3;1" dur="1s" repeatCount="indefinite"/>
      </circle>
      <circle cx="-20" cy="-40" r="8" fill="${colors.info}">
        <animate attributeName="opacity" values="0.3;1;0.3" dur="1s" begin="0.3s" repeatCount="indefinite"/>
      </circle>
      <circle cx="20" cy="-40" r="8" fill="${colors.warning}">
        <animate attributeName="opacity" values="1;0.3;1" dur="1s" begin="0.6s" repeatCount="indefinite"/>
      </circle>
      <circle cx="60" cy="-40" r="8" fill="${colors.danger}">
        <animate attributeName="opacity" values="0.3;1;0.3" dur="1s" begin="0.9s" repeatCount="indefinite"/>
      </circle>
    </g>

    <!-- Port indicator -->
    <rect x="-30" y="20" width="60" height="25" fill="${colors.primary}" rx="5"/>
    <text x="0" y="37" font-family="'Cascadia Code', monospace" font-size="12" fill="white" text-anchor="middle">
      :3000
    </text>

    <!-- Running status -->
    <text x="0" y="-10" font-family="'Inter', sans-serif" font-size="14" fill="${colors.success}" text-anchor="middle" font-weight="bold">
      ● RUNNING
    </text>

    <!-- Label -->
    <text x="0" y="120" font-family="'Inter', sans-serif" font-size="18" fill="white" text-anchor="middle" font-weight="bold">
      Running Container
    </text>
    <text x="0" y="145" font-family="'Inter', sans-serif" font-size="14" fill="#cccccc" text-anchor="middle">
      Live application instance
    </text>
  </g>

  <!-- Progress Indicator -->
  <g transform="translate(960, 700)">
    <rect x="-200" y="-5" width="400" height="10" fill="#2d2d4a" rx="5"/>
    <rect x="-200" y="-5" width="0" height="10" fill="${colors.primary}" rx="5">
      <animate attributeName="width" values="0;100;200;300;400" dur="8s" repeatCount="indefinite"/>
    </rect>

    <!-- Stage labels -->
    <text x="-150" y="30" font-family="'Inter', sans-serif" font-size="12" fill="#666">Code</text>
    <text x="-50" y="30" font-family="'Inter', sans-serif" font-size="12" fill="#666">Dockerfile</text>
    <text x="50" y="30" font-family="'Inter', sans-serif" font-size="12" fill="#666">Image</text>
    <text x="150" y="30" font-family="'Inter', sans-serif" font-size="12" fill="#666">Container</text>
  </g>

  <!-- Timeline -->
  <g transform="translate(960, 800)">
    <text x="0" y="0" font-family="'Inter', sans-serif" font-size="16" fill="white" text-anchor="middle" font-weight="bold">
      Docker Build & Run Process
    </text>
    <text x="0" y="25" font-family="'Inter', sans-serif" font-size="14" fill="#cccccc" text-anchor="middle">
      Watch how your code transforms into a running container
    </text>
  </g>
</svg>`;

  // 2. Data Structure Morphing
  const dataStructureMorph = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
  <!-- Background -->
  <rect width="1920" height="1080" fill="${colors.dark}"/>

  <!-- Title -->
  <text x="960" y="80" font-family="'Inter', sans-serif" font-size="32" fill="white" text-anchor="middle" font-weight="bold">
    Array to Binary Tree Transformation
  </text>

  <!-- Stage 1: Array -->
  <g transform="translate(960, 300)" opacity="1">
    <animate attributeName="opacity" values="1;1;0" dur="6s" repeatCount="indefinite"/>

    <!-- Array elements -->
    <g id="array">
      <rect x="-240" y="-30" width="60" height="60" fill="${colors.primary}" stroke="white" stroke-width="2" rx="5"/>
      <text x="-210" y="5" font-family="'Cascadia Code', monospace" font-size="18" fill="white" text-anchor="middle">1</text>

      <rect x="-160" y="-30" width="60" height="60" fill="${colors.info}" stroke="white" stroke-width="2" rx="5"/>
      <text x="-130" y="5" font-family="'Cascadia Code', monospace" font-size="18" fill="white" text-anchor="middle">2</text>

      <rect x="-80" y="-30" width="60" height="60" fill="${colors.success}" stroke="white" stroke-width="2" rx="5"/>
      <text x="-50" y="5" font-family="'Cascadia Code', monospace" font-size="18" fill="white" text-anchor="middle">3</text>

      <rect x="0" y="-30" width="60" height="60" fill="${colors.warning}" stroke="white" stroke-width="2" rx="5"/>
      <text x="30" y="5" font-family="'Cascadia Code', monospace" font-size="18" fill="white" text-anchor="middle">4</text>

      <rect x="80" y="-30" width="60" height="60" fill="${colors.danger}" stroke="white" stroke-width="2" rx="5"/>
      <text x="110" y="5" font-family="'Cascadia Code', monospace" font-size="18" fill="white" text-anchor="middle">5</text>

      <rect x="160" y="-30" width="60" height="60" fill="${colors.secondary}" stroke="white" stroke-width="2" rx="5"/>
      <text x="190" y="5" font-family="'Cascadia Code', monospace" font-size="18" fill="white" text-anchor="middle">6</text>
    </g>

    <!-- Array indices -->
    <g opacity="0.7">
      <text x="-210" y="-50" font-family="'Cascadia Code', monospace" font-size="12" fill="#666" text-anchor="middle">0</text>
      <text x="-130" y="-50" font-family="'Cascadia Code', monospace" font-size="12" fill="#666" text-anchor="middle">1</text>
      <text x="-50" y="-50" font-family="'Cascadia Code', monospace" font-size="12" fill="#666" text-anchor="middle">2</text>
      <text x="30" y="-50" font-family="'Cascadia Code', monospace" font-size="12" fill="#666" text-anchor="middle">3</text>
      <text x="110" y="-50" font-family="'Cascadia Code', monospace" font-size="12" fill="#666" text-anchor="middle">4</text>
      <text x="190" y="-50" font-family="'Cascadia Code', monospace" font-size="12" fill="#666" text-anchor="middle">5</text>
    </g>

    <text x="0" y="100" font-family="'Inter', sans-serif" font-size="18" fill="white" text-anchor="middle" font-weight="bold">
      Linear Array Structure
    </text>
  </g>

  <!-- Stage 2: Tree Formation -->
  <g transform="translate(960, 300)" opacity="0">
    <animate attributeName="opacity" values="0;1;1;0" dur="6s" begin="2s" repeatCount="indefinite"/>

    <!-- Root -->
    <circle cx="0" cy="-100" r="25" fill="${colors.primary}" stroke="white" stroke-width="2"/>
    <text x="0" y="-95" font-family="'Cascadia Code', monospace" font-size="18" fill="white" text-anchor="middle">1</text>

    <!-- Level 1 -->
    <circle cx="-80" cy="-20" r="25" fill="${colors.info}" stroke="white" stroke-width="2"/>
    <text x="-80" y="-15" font-family="'Cascadia Code', monospace" font-size="18" fill="white" text-anchor="middle">2</text>

    <circle cx="80" cy="-20" r="25" fill="${colors.success}" stroke="white" stroke-width="2"/>
    <text x="80" y="-15" font-family="'Cascadia Code', monospace" font-size="18" fill="white" text-anchor="middle">3</text>

    <!-- Level 2 -->
    <circle cx="-140" cy="60" r="25" fill="${colors.warning}" stroke="white" stroke-width="2"/>
    <text x="-140" y="65" font-family="'Cascadia Code', monospace" font-size="18" fill="white" text-anchor="middle">4</text>

    <circle cx="-20" cy="60" r="25" fill="${colors.danger}" stroke="white" stroke-width="2"/>
    <text x="-20" y="65" font-family="'Cascadia Code', monospace" font-size="18" fill="white" text-anchor="middle">5</text>

    <circle cx="140" cy="60" r="25" fill="${colors.secondary}" stroke="white" stroke-width="2"/>
    <text x="140" y="65" font-family="'Cascadia Code', monospace" font-size="18" fill="white" text-anchor="middle">6</text>

    <!-- Tree edges with animation -->
    <g stroke="white" stroke-width="2" opacity="0">
      <animate attributeName="opacity" values="0;1" dur="1s" begin="3s" fill="freeze"/>
      <line x1="0" y1="-75" x2="-80" y2="-45"/>
      <line x1="0" y1="-75" x2="80" y2="-45"/>
      <line x1="-80" y1="5" x2="-140" y2="35"/>
      <line x1="-80" y1="5" x2="-20" y2="35"/>
      <line x1="80" y1="5" x2="140" y2="35"/>
    </g>

    <text x="0" y="150" font-family="'Inter', sans-serif" font-size="18" fill="white" text-anchor="middle" font-weight="bold">
      Binary Tree Structure
    </text>
  </g>

  <!-- Morphing animation indicators -->
  <g transform="translate(200, 300)" opacity="0">
    <animate attributeName="opacity" values="0;1;0" dur="2s" begin="1s" repeatCount="indefinite"/>

    <!-- Morphing arrows -->
    <path d="M 50 0 L 100 0 L 90 -10 M 100 0 L 90 10" stroke="${colors.primary}" stroke-width="3" fill="none"/>
    <text x="75" y="-20" font-family="'Inter', sans-serif" font-size="12" fill="${colors.primary}" text-anchor="middle">
      Morphing...
    </text>
  </g>

  <g transform="translate(1520, 300)" opacity="0">
    <animate attributeName="opacity" values="0;1;0" dur="2s" begin="3s" repeatCount="indefinite"/>

    <!-- Complete arrows -->
    <path d="M 50 0 L 100 0 L 90 -10 M 100 0 L 90 10" stroke="${colors.success}" stroke-width="3" fill="none"/>
    <text x="75" y="-20" font-family="'Inter', sans-serif" font-size="12" fill="${colors.success}" text-anchor="middle">
      Complete!
    </text>
  </g>

  <!-- Info Panel -->
  <g transform="translate(960, 600)" opacity="0">
    <animate attributeName="opacity" values="0;1" dur="1s" begin="4s" fill="freeze"/>

    <rect x="-300" y="-60" width="600" height="120" fill="#2d2d4a" stroke="${colors.primary}" stroke-width="2" rx="10"/>
    <text x="0" y="-30" font-family="'Inter', sans-serif" font-size="16" fill="white" text-anchor="middle" font-weight="bold">
      💡 Transformation Rules
    </text>
    <text x="0" y="-5" font-family="'Inter', sans-serif" font-size="14" fill="#cccccc" text-anchor="middle">
      Array[i] → Tree Node at level ⌊log₂(i+1)⌋
    </text>
    <text x="0" y="20" font-family="'Inter', sans-serif" font-size="14" fill="#cccccc" text-anchor="middle">
      Left child: 2i+1, Right child: 2i+2
    </text>
    <text x="0" y="45" font-family="'Inter', sans-serif" font-size="14" fill="#cccccc" text-anchor="middle">
      Perfect for heap operations and binary search
    </text>
  </g>
</svg>`;

  const morphDir = path.join(ASSETS_DIR, 'morph');
  await fs.mkdir(morphDir, { recursive: true });

  await fs.writeFile(path.join(morphDir, 'docker-stages.svg'), dockerMorph);
  await fs.writeFile(path.join(morphDir, 'data-structure-transform.svg'), dataStructureMorph);

  console.log('✅ Created 2 morph animation templates');
}

// ============= Particle Effect Templates =============

async function generateParticleTemplates() {
  console.log('✨ Creating particle effect templates...');

  // 1. Data Flow Particles
  const dataFlowParticles = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
  <defs>
    <radialGradient id="particleGradient" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:#4fd1c7;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#4fd1c7;stop-opacity:0" />
    </radialGradient>
    <filter id="blur">
      <feGaussianBlur in="SourceGraphic" stdDeviation="1"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1920" height="1080" fill="${colors.dark}"/>

  <!-- Title -->
  <text x="960" y="80" font-family="'Inter', sans-serif" font-size="32" fill="white" text-anchor="middle" font-weight="bold">
    Real-time Data Processing Pipeline
  </text>

  <!-- Source Node -->
  <g transform="translate(200, 400)">
    <circle cx="0" cy="0" r="40" fill="${colors.primary}" stroke="white" stroke-width="3"/>
    <text x="0" y="5" font-family="'Inter', sans-serif" font-size="12" fill="white" text-anchor="middle" font-weight="bold">
      DATA
    </text>
    <text x="0" y="-15" font-family="'Inter', sans-serif" font-size="12" fill="white" text-anchor="middle" font-weight="bold">
      SOURCE
    </text>
    <text x="0" y="70" font-family="'Inter', sans-serif" font-size="14" fill="white" text-anchor="middle">
      Kafka Stream
    </text>

    <!-- Data emission effect -->
    <g opacity="0.8">
      <circle cx="0" cy="0" r="45" fill="none" stroke="${colors.primary}" stroke-width="2" opacity="0.6">
        <animate attributeName="r" values="45;60;45" dur="2s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.6;0.1;0.6" dur="2s" repeatCount="indefinite"/>
      </circle>
    </g>
  </g>

  <!-- Processing Node 1 -->
  <g transform="translate(600, 300)">
    <rect x="-40" y="-40" width="80" height="80" fill="${colors.info}" stroke="white" stroke-width="3" rx="10"/>
    <text x="0" y="-10" font-family="'Inter', sans-serif" font-size="10" fill="white" text-anchor="middle" font-weight="bold">
      FILTER
    </text>
    <text x="0" y="5" font-family="'Inter', sans-serif" font-size="10" fill="white" text-anchor="middle" font-weight="bold">
      &amp;
    </text>
    <text x="0" y="20" font-family="'Inter', sans-serif" font-size="10" fill="white" text-anchor="middle" font-weight="bold">
      VALIDATE
    </text>
    <text x="0" y="70" font-family="'Inter', sans-serif" font-size="14" fill="white" text-anchor="middle">
      Data Cleaner
    </text>
  </g>

  <!-- Processing Node 2 -->
  <g transform="translate(600, 500)">
    <rect x="-40" y="-40" width="80" height="80" fill="${colors.warning}" stroke="white" stroke-width="3" rx="10"/>
    <text x="0" y="-10" font-family="'Inter', sans-serif" font-size="10" fill="white" text-anchor="middle" font-weight="bold">
      ENRICH
    </text>
    <text x="0" y="5" font-family="'Inter', sans-serif" font-size="10" fill="white" text-anchor="middle" font-weight="bold">
      &amp;
    </text>
    <text x="0" y="20" font-family="'Inter', sans-serif" font-size="10" fill="white" text-anchor="middle" font-weight="bold">
      TRANSFORM
    </text>
    <text x="0" y="70" font-family="'Inter', sans-serif" font-size="14" fill="white" text-anchor="middle">
      Data Enricher
    </text>
  </g>

  <!-- Aggregator Node -->
  <g transform="translate(1000, 400)">
    <polygon points="0,-40 35,0 0,40 -35,0" fill="${colors.success}" stroke="white" stroke-width="3"/>
    <text x="0" y="-5" font-family="'Inter', sans-serif" font-size="10" fill="white" text-anchor="middle" font-weight="bold">
      AGG
    </text>
    <text x="0" y="10" font-family="'Inter', sans-serif" font-size="10" fill="white" text-anchor="middle" font-weight="bold">
      5min
    </text>
    <text x="0" y="70" font-family="'Inter', sans-serif" font-size="14" fill="white" text-anchor="middle">
      Aggregator
    </text>
  </g>

  <!-- Destination Node -->
  <g transform="translate(1400, 400)">
    <rect x="-50" y="-30" width="100" height="60" fill="${colors.danger}" stroke="white" stroke-width="3" rx="15"/>
    <text x="0" y="-5" font-family="'Inter', sans-serif" font-size="12" fill="white" text-anchor="middle" font-weight="bold">
      DATABASE
    </text>
    <text x="0" y="10" font-family="'Inter', sans-serif" font-size="12" fill="white" text-anchor="middle" font-weight="bold">
      SINK
    </text>
    <text x="0" y="70" font-family="'Inter', sans-serif" font-size="14" fill="white" text-anchor="middle">
      PostgreSQL
    </text>
  </g>

  <!-- Data Particles Flow 1 -->
  <g id="particles-flow-1">
    <!-- Particle 1 -->
    <circle r="4" fill="url(#particleGradient)" filter="url(#blur)">
      <animateMotion dur="3s" repeatCount="indefinite" path="M 200,400 Q 400,350 600,300"/>
      <animate attributeName="opacity" values="1;1;0" dur="3s" repeatCount="indefinite"/>
    </circle>

    <!-- Particle 2 -->
    <circle r="3" fill="url(#particleGradient)" filter="url(#blur)">
      <animateMotion dur="3s" begin="0.5s" repeatCount="indefinite" path="M 200,400 Q 400,350 600,300"/>
      <animate attributeName="opacity" values="1;1;0" dur="3s" begin="0.5s" repeatCount="indefinite"/>
    </circle>

    <!-- Particle 3 -->
    <circle r="5" fill="url(#particleGradient)" filter="url(#blur)">
      <animateMotion dur="3s" begin="1s" repeatCount="indefinite" path="M 200,400 Q 400,350 600,300"/>
      <animate attributeName="opacity" values="1;1;0" dur="3s" begin="1s" repeatCount="indefinite"/>
    </circle>
  </g>

  <!-- Data Particles Flow 2 -->
  <g id="particles-flow-2">
    <!-- Particle 1 -->
    <circle r="4" fill="#f59e0b" opacity="0.8" filter="url(#blur)">
      <animateMotion dur="3s" begin="0.2s" repeatCount="indefinite" path="M 200,400 Q 400,450 600,500"/>
      <animate attributeName="opacity" values="1;1;0" dur="3s" begin="0.2s" repeatCount="indefinite"/>
    </circle>

    <!-- Particle 2 -->
    <circle r="3" fill="#f59e0b" opacity="0.8" filter="url(#blur)">
      <animateMotion dur="3s" begin="0.7s" repeatCount="indefinite" path="M 200,400 Q 400,450 600,500"/>
      <animate attributeName="opacity" values="1;1;0" dur="3s" begin="0.7s" repeatCount="indefinite"/>
    </circle>

    <!-- Particle 3 -->
    <circle r="6" fill="#f59e0b" opacity="0.8" filter="url(#blur)">
      <animateMotion dur="3s" begin="1.2s" repeatCount="indefinite" path="M 200,400 Q 400,450 600,500"/>
      <animate attributeName="opacity" values="1;1;0" dur="3s" begin="1.2s" repeatCount="indefinite"/>
    </circle>
  </g>

  <!-- Aggregated Data Particles -->
  <g id="particles-aggregated">
    <!-- Large aggregated particle -->
    <circle r="8" fill="#10b981" opacity="0.9" filter="url(#blur)">
      <animateMotion dur="2s" begin="3.5s" repeatCount="indefinite" path="M 600,400 L 1000,400"/>
      <animate attributeName="opacity" values="0;1;1;0" dur="2s" begin="3.5s" repeatCount="indefinite"/>
    </circle>

    <!-- Medium aggregated particle -->
    <circle r="6" fill="#10b981" opacity="0.8" filter="url(#blur)">
      <animateMotion dur="2s" begin="4s" repeatCount="indefinite" path="M 600,400 L 1000,400"/>
      <animate attributeName="opacity" values="0;1;1;0" dur="2s" begin="4s" repeatCount="indefinite"/>
    </circle>
  </g>

  <!-- Final Storage Particles -->
  <g id="particles-storage">
    <circle r="10" fill="#ef4444" opacity="0.9" filter="url(#blur)">
      <animateMotion dur="1.5s" begin="5.5s" repeatCount="indefinite" path="M 1000,400 L 1400,400"/>
      <animate attributeName="opacity" values="0;1;1;0" dur="1.5s" begin="5.5s" repeatCount="indefinite"/>
    </circle>
  </g>

  <!-- Throughput Metrics -->
  <g transform="translate(960, 700)">
    <rect x="-250" y="-50" width="500" height="100" fill="#2d2d4a" stroke="${colors.primary}" stroke-width="2" rx="10"/>
    <text x="0" y="-20" font-family="'Inter', sans-serif" font-size="16" fill="white" text-anchor="middle" font-weight="bold">
      Real-time Metrics
    </text>

    <text x="-150" y="10" font-family="'Cascadia Code', monospace" font-size="14" fill="${colors.info}">
      Input: <tspan fill="#4fd1c7">5.2K msg/s</tspan>
    </text>
    <text x="50" y="10" font-family="'Cascadia Code', monospace" font-size="14" fill="${colors.success}">
      Output: <tspan fill="#10b981">4.8K msg/s</tspan>
    </text>

    <text x="-150" y="35" font-family="'Cascadia Code', monospace" font-size="14" fill="${colors.warning}">
      Latency: <tspan fill="#f59e0b">142ms</tspan>
    </text>
    <text x="50" y="35" font-family="'Cascadia Code', monospace" font-size="14" fill="${colors.danger}">
      Backlog: <tspan fill="#ef4444">1.2K</tspan>
    </text>
  </g>

  <!-- Particle burst effect at nodes -->
  <g transform="translate(600, 300)" opacity="0">
    <animate attributeName="opacity" values="0;1;0" dur="0.5s" begin="3s" repeatCount="indefinite"/>

    <!-- Burst particles -->
    <g>
      <circle cx="0" cy="0" r="2" fill="#4fd1c7">
        <animate attributeName="cx" values="0;20;40" dur="0.5s" begin="3s" repeatCount="indefinite"/>
        <animate attributeName="cy" values="0;-10;-20" dur="0.5s" begin="3s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="1;0.5;0" dur="0.5s" begin="3s" repeatCount="indefinite"/>
      </circle>
      <circle cx="0" cy="0" r="2" fill="#4fd1c7">
        <animate attributeName="cx" values="0;-20;-40" dur="0.5s" begin="3s" repeatCount="indefinite"/>
        <animate attributeName="cy" values="0;10;20" dur="0.5s" begin="3s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="1;0.5;0" dur="0.5s" begin="3s" repeatCount="indefinite"/>
      </circle>
      <circle cx="0" cy="0" r="2" fill="#4fd1c7">
        <animate attributeName="cx" values="0;0;0" dur="0.5s" begin="3s" repeatCount="indefinite"/>
        <animate attributeName="cy" values="0;-30;-60" dur="0.5s" begin="3s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="1;0.5;0" dur="0.5s" begin="3s" repeatCount="indefinite"/>
      </circle>
    </g>
  </g>
</svg>`;

  const particleDir = path.join(ASSETS_DIR, 'particle-effects');
  await fs.mkdir(particleDir, { recursive: true });

  await fs.writeFile(path.join(particleDir, 'data-flow.svg'), dataFlowParticles);

  console.log('✅ Created 1 particle effect template');
}

// ============= 3D Rotation Templates =============

async function generate3DRotationTemplates() {
  console.log('🔄 Creating 3D rotation templates...');

  // 1. Kubernetes Cluster 3D View
  const k8sCluster3D = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
  <defs>
    <linearGradient id="node1Gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#326ce5;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1a56db;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="node2Gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#10b981;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#059669;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="node3Gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#f59e0b;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#d97706;stop-opacity:1" />
    </linearGradient>
    <filter id="shadow3d">
      <feDropShadow dx="5" dy="5" stdDeviation="3" flood-opacity="0.4"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1920" height="1080" fill="${colors.dark}"/>

  <!-- Title -->
  <text x="960" y="80" font-family="'Inter', sans-serif" font-size="32" fill="white" text-anchor="middle" font-weight="bold">
    Kubernetes Cluster - 3D Architecture View
  </text>

  <!-- Master Node (Control Plane) -->
  <g transform="translate(960, 300)" filter="url(#shadow3d)">
    <!-- 3D Box effect -->
    <g>
      <!-- Top face -->
      <path d="M -100,-60 L 0,-100 L 100,-60 L 0,-20 Z" fill="#4c7cf3" opacity="0.9"/>
      <!-- Front face -->
      <rect x="-100" y="-60" width="200" height="120" fill="url(#node1Gradient)" rx="10"/>
      <!-- Right face -->
      <path d="M 100,-60 L 120,-80 L 120,40 L 100,60 Z" fill="#1e40af" opacity="0.7"/>

      <!-- 3D rotation animation -->
      <animateTransform attributeName="transform" type="rotate"
                        values="0 0 0; 5 0 0; 0 0 0; -5 0 0; 0 0 0"
                        dur="8s" repeatCount="indefinite"/>
    </g>

    <!-- Master Node Content -->
    <text x="0" y="-20" font-family="'Inter', sans-serif" font-size="16" fill="white" text-anchor="middle" font-weight="bold">
      Master Node
    </text>
    <text x="0" y="0" font-family="'Inter', sans-serif" font-size="12" fill="white" text-anchor="middle">
      Control Plane
    </text>
    <text x="0" y="20" font-family="'Inter', sans-serif" font-size="10" fill="#cccccc" text-anchor="middle">
      API Server, etcd, Scheduler
    </text>

    <!-- Status indicator -->
    <circle cx="70" cy="-40" r="8" fill="#10b981">
      <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite"/>
    </circle>
  </g>

  <!-- Worker Node 1 -->
  <g transform="translate(500, 500)" filter="url(#shadow3d)">
    <g>
      <!-- Top face -->
      <path d="M -80,-50 L 0,-80 L 80,-50 L 0,-20 Z" fill="#34d399" opacity="0.9"/>
      <!-- Front face -->
      <rect x="-80" y="-50" width="160" height="100" fill="url(#node2Gradient)" rx="8"/>
      <!-- Right face -->
      <path d="M 80,-50 L 95,-65 L 95,35 L 80,50 Z" fill="#047857" opacity="0.7"/>

      <!-- 3D rotation animation -->
      <animateTransform attributeName="transform" type="rotate"
                        values="0 0 0; 8 0 0; 0 0 0; -3 0 0; 0 0 0"
                        dur="6s" begin="1s" repeatCount="indefinite"/>
    </g>

    <text x="0" y="-15" font-family="'Inter', sans-serif" font-size="14" fill="white" text-anchor="middle" font-weight="bold">
      Worker Node 1
    </text>
    <text x="0" y="5" font-family="'Inter', sans-serif" font-size="10" fill="white" text-anchor="middle">
      kubelet, kube-proxy
    </text>
    <text x="0" y="25" font-family="'Inter', sans-serif" font-size="8" fill="#cccccc" text-anchor="middle">
      Pods: 12/20 | CPU: 65%
    </text>

    <!-- Pods representation -->
    <g transform="translate(-40, -25)">
      <rect x="0" y="0" width="8" height="8" fill="#4fd1c7" rx="2" opacity="0.8"/>
      <rect x="12" y="0" width="8" height="8" fill="#4fd1c7" rx="2" opacity="0.8"/>
      <rect x="24" y="0" width="8" height="8" fill="#4fd1c7" rx="2" opacity="0.8"/>
      <rect x="36" y="0" width="8" height="8" fill="#4fd1c7" rx="2" opacity="0.8"/>

      <rect x="48" y="0" width="8" height="8" fill="#4fd1c7" rx="2" opacity="0.8"/>
      <rect x="60" y="0" width="8" height="8" fill="#4fd1c7" rx="2" opacity="0.8"/>
      <rect x="72" y="0" width="8" height="8" fill="#666" rx="2" opacity="0.3"/>
      <!-- Empty slots -->
    </g>

    <circle cx="60" cy="-35" r="6" fill="#10b981">
      <animate attributeName="opacity" values="1;0.5;1" dur="1.5s" repeatCount="indefinite"/>
    </circle>
  </g>

  <!-- Worker Node 2 -->
  <g transform="translate(1420, 500)" filter="url(#shadow3d)">
    <g>
      <!-- Top face -->
      <path d="M -80,-50 L 0,-80 L 80,-50 L 0,-20 Z" fill="#fbbf24" opacity="0.9"/>
      <!-- Front face -->
      <rect x="-80" y="-50" width="160" height="100" fill="url(#node3Gradient)" rx="8"/>
      <!-- Right face -->
      <path d="M 80,-50 L 95,-65 L 95,35 L 80,50 Z" fill="#b45309" opacity="0.7"/>

      <!-- 3D rotation animation -->
      <animateTransform attributeName="transform" type="rotate"
                        values="0 0 0; -6 0 0; 0 0 0; 4 0 0; 0 0 0"
                        dur="7s" begin="2s" repeatCount="indefinite"/>
    </g>

    <text x="0" y="-15" font-family="'Inter', sans-serif" font-size="14" fill="white" text-anchor="middle" font-weight="bold">
      Worker Node 2
    </text>
    <text x="0" y="5" font-family="'Inter', sans-serif" font-size="10" fill="white" text-anchor="middle">
      kubelet, kube-proxy
    </text>
    <text x="0" y="25" font-family="'Inter', sans-serif" font-size="8" fill="#cccccc" text-anchor="middle">
      Pods: 8/20 | CPU: 45%
    </text>

    <!-- Pods representation -->
    <g transform="translate(-40, -25)">
      <rect x="0" y="0" width="8" height="8" fill="#4fd1c7" rx="2" opacity="0.8"/>
      <rect x="12" y="0" width="8" height="8" fill="#4fd1c7" rx="2" opacity="0.8"/>
      <rect x="24" y="0" width="8" height="8" fill="#4fd1c7" rx="2" opacity="0.8"/>
      <rect x="36" y="0" width="8" height="8" fill="#4fd1c7" rx="2" opacity="0.8"/>

      <rect x="48" y="0" width="8" height="8" fill="#4fd1c7" rx="2" opacity="0.8"/>
      <rect x="60" y="0" width="8" height="8" fill="#666" rx="2" opacity="0.3"/>
      <!-- More empty slots -->
    </g>

    <circle cx="60" cy="-35" r="6" fill="#10b981">
      <animate attributeName="opacity" values="1;0.5;1" dur="2.5s" repeatCount="indefinite"/>
    </circle>
  </g>

  <!-- Connection Lines with 3D effect -->
  <g stroke="#4fd1c7" stroke-width="3" opacity="0.6">
    <!-- Master to Worker 1 -->
    <line x1="960" y1="360" x2="500" y2="450">
      <animate attributeName="opacity" values="0.6;0.3;0.6" dur="3s" repeatCount="indefinite"/>
    </line>
    <!-- Master to Worker 2 -->
    <line x1="960" y1="360" x2="1420" y2="450">
      <animate attributeName="opacity" values="0.6;0.3;0.6" dur="3s" begin="1s" repeatCount="indefinite"/>
    </line>
  </g>

  <!-- Data flow animation -->
  <g>
    <!-- Data packets between nodes -->
    <circle r="4" fill="#4fd1c7" opacity="0.8">
      <animateMotion dur="2s" repeatCount="indefinite" path="M 960,360 L 500,450"/>
      <animate attributeName="opacity" values="0.8;0.8;0" dur="2s" repeatCount="indefinite"/>
    </circle>

    <circle r="4" fill="#f59e0b" opacity="0.8">
      <animateMotion dur="2s" begin="0.5s" repeatCount="indefinite" path="M 500,450 L 960,360"/>
      <animate attributeName="opacity" values="0.8;0.8;0" dur="2s" begin="0.5s" repeatCount="indefinite"/>
    </circle>

    <circle r="4" fill="#4fd1c7" opacity="0.8">
      <animateMotion dur="2s" begin="1s" repeatCount="indefinite" path="M 960,360 L 1420,450"/>
      <animate attributeName="opacity" values="0.8;0.8;0" dur="2s" begin="1s" repeatCount="indefinite"/>
    </circle>
  </g>

  <!-- Cluster Info Panel -->
  <g transform="translate(960, 750)" filter="url(#shadow3d)">
    <!-- 3D Panel -->
    <g>
      <path d="M -300,-60 L -280,-80 L 280,-80 L 300,-60 Z" fill="#4a5568" opacity="0.9"/>
      <rect x="-300" y="-60" width="600" height="120" fill="#2d2d4a" stroke="${colors.primary}" stroke-width="2" rx="10"/>
      <path d="M 300,-60 L 320,-80 L 320,40 L 300,60 Z" fill="#1a202c" opacity="0.7"/>
    </g>

    <text x="0" y="-30" font-family="'Inter', sans-serif" font-size="18" fill="white" text-anchor="middle" font-weight="bold">
      Cluster Status Dashboard
    </text>

    <g font-family="'Cascadia Code', monospace" font-size="14">
      <text x="-200" y="0" fill="${colors.info}">
        Nodes: <tspan fill="#4fd1c7">3 Ready</tspan>
      </text>
      <text x="100" y="0" fill="${colors.success}">
        Pods: <tspan fill="#10b981">20 Running</tspan>
      </text>

      <text x="-200" y="25" fill="${colors.warning}">
        CPU: <tspan fill="#f59e0b">55% Used</tspan>
      </text>
      <text x="100" y="25" fill="${colors.danger}">
        Memory: <tspan fill="#ef4444">42% Used</tspan>
      </text>
    </g>
  </g>

  <!-- Rotation Controls Indicator -->
  <g transform="translate(100, 900)">
    <rect x="0" y="0" width="200" height="100" fill="#2d2d4a" stroke="${colors.primary}" stroke-width="2" rx="5"/>
    <text x="100" y="25" font-family="'Inter', sans-serif" font-size="12" fill="white" text-anchor="middle" font-weight="bold">
      3D View Controls
    </text>
    <text x="100" y="45" font-family="'Inter', sans-serif" font-size="10" fill="#cccccc" text-anchor="middle">
      Auto-rotating cluster view
    </text>
    <text x="100" y="65" font-family="'Inter', sans-serif" font-size="10" fill="#cccccc" text-anchor="middle">
      Drag to manually rotate
    </text>
    <circle cx="170" cy="80" r="5" fill="#10b981">
      <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite"/>
    </circle>
  </g>
</svg>`;

  const rotation3dDir = path.join(ASSETS_DIR, '3d-rotation');
  await fs.mkdir(rotation3dDir, { recursive: true });

  await fs.writeFile(path.join(rotation3dDir, 'k8s-cluster.svg'), k8sCluster3D);

  console.log('✅ Created 1 3D rotation template');
}

// Main execution
async function main() {
  console.log('🚀 Starting Advanced Animation Templates Generation');
  console.log('=' .repeat(60));

  try {
    await generateMorphTemplates();
    await generateParticleTemplates();
    await generate3DRotationTemplates();

    console.log('=' .repeat(60));
    console.log('✨ Advanced Animation Templates Complete! Created:');
    console.log('  🔄 Morph Templates: 2');
    console.log('  ✨ Particle Effect Templates: 1');
    console.log('  🔄 3D Rotation Templates: 1');
    console.log('📁 All templates saved to:', ASSETS_DIR);
  } catch (error) {
    console.error('❌ Error generating templates:', error);
  }
}

main();