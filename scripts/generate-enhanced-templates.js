#!/usr/bin/env node

/**
 * InfoGraphAI Enhanced Templates Generator - Phase 1
 * 고품질 교육 비디오용 확장 템플릿 생성
 */

const fs = require('fs').promises;
const path = require('path');

// Professional color palette
const colors = {
  primary: '#3B82F6',
  secondary: '#8B5CF6',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#06B6D4',
  dark: '#1F2937',
  light: '#F3F4F6',
  gradient: {
    purple: ['#667eea', '#764ba2'],
    teal: ['#4fd1c7', '#81e6d9'],
    orange: ['#f6ad55', '#ed8936']
  }
};

const ASSETS_DIR = path.join(__dirname, '..', 'assets', 'templates');

// ============= Phase 1: Enhanced Code Editor Templates =============

async function generateEnhancedCodeEditors() {
  console.log('🚀 Phase 1: Creating enhanced code editor templates...');

  // 1. TypeScript Advanced Editor
  const typescriptAdvanced = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
  <defs>
    <linearGradient id="tsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3178c6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#235a9f;stop-opacity:1" />
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- Editor Background -->
  <rect width="1920" height="1080" fill="#1e1e1e"/>

  <!-- Title Bar -->
  <rect width="1920" height="60" fill="#2d2d30"/>
  <text x="960" y="40" font-family="'Cascadia Code', monospace" font-size="24" fill="#ffffff" text-anchor="middle">TypeScript Advanced Features</text>

  <!-- Line Numbers -->
  <rect x="0" y="60" width="80" height="1020" fill="#252526"/>
  <g id="lineNumbers" font-family="'Cascadia Code', monospace" font-size="16" fill="#858585">
    <text x="50" y="90" text-anchor="end">1</text>
    <text x="50" y="120" text-anchor="end">2</text>
    <text x="50" y="150" text-anchor="end">3</text>
    <text x="50" y="180" text-anchor="end">4</text>
    <text x="50" y="210" text-anchor="end">5</text>
    <text x="50" y="240" text-anchor="end">6</text>
    <text x="50" y="270" text-anchor="end">7</text>
    <text x="50" y="300" text-anchor="end">8</text>
    <text x="50" y="330" text-anchor="end">9</text>
    <text x="50" y="360" text-anchor="end">10</text>
  </g>

  <!-- Code Content with Syntax Highlighting -->
  <g font-family="'Cascadia Code', monospace" font-size="18">
    <!-- Interface Definition -->
    <text x="100" y="90" fill="#3178c6">interface</text>
    <text x="220" y="90" fill="#4ec9b0">User</text>
    <text x="280" y="90" fill="#d4d4d4">&lt;</text>
    <text x="300" y="90" fill="#4ec9b0">T</text>
    <text x="320" y="90" fill="#3178c6">extends</text>
    <text x="420" y="90" fill="#4ec9b0">BaseEntity</text>
    <text x="540" y="90" fill="#d4d4d4">&gt; {</text>

    <!-- Property with Type -->
    <text x="130" y="120" fill="#9cdcfe">id</text>
    <text x="170" y="120" fill="#d4d4d4">:</text>
    <text x="190" y="120" fill="#4ec9b0">string</text>
    <text x="260" y="120" fill="#d4d4d4">;</text>

    <!-- Generic Property -->
    <text x="130" y="150" fill="#9cdcfe">data</text>
    <text x="190" y="150" fill="#d4d4d4">:</text>
    <text x="210" y="150" fill="#4ec9b0">T</text>
    <text x="230" y="150" fill="#d4d4d4">;</text>

    <!-- Method with Decorators -->
    <text x="130" y="180" fill="#c586c0">@cached</text>
    <text x="130" y="210" fill="#dcdcaa">async getUserData</text>
    <text x="320" y="210" fill="#d4d4d4">()</text>
    <text x="360" y="210" fill="#d4d4d4">:</text>
    <text x="380" y="210" fill="#4ec9b0">Promise</text>
    <text x="460" y="210" fill="#d4d4d4">&lt;</text>
    <text x="480" y="210" fill="#4ec9b0">UserData</text>
    <text x="580" y="210" fill="#d4d4d4">&gt; {</text>

    <!-- Async/Await -->
    <text x="160" y="240" fill="#c586c0">const</text>
    <text x="230" y="240" fill="#9cdcfe">result</text>
    <text x="310" y="240" fill="#d4d4d4">=</text>
    <text x="340" y="240" fill="#c586c0">await</text>
    <text x="410" y="240" fill="#dcdcaa">fetchUser</text>
    <text x="520" y="240" fill="#d4d4d4">(</text>
    <text x="540" y="240" fill="#c586c0">this</text>
    <text x="590" y="240" fill="#d4d4d4">.</text>
    <text x="610" y="240" fill="#9cdcfe">id</text>
    <text x="640" y="240" fill="#d4d4d4">);</text>

    <!-- Return Statement -->
    <text x="160" y="270" fill="#c586c0">return</text>
    <text x="240" y="270" fill="#9cdcfe">result</text>
    <text x="310" y="270" fill="#d4d4d4">;</text>

    <text x="130" y="300" fill="#d4d4d4">}</text>
    <text x="100" y="330" fill="#d4d4d4">}</text>
  </g>

  <!-- Type Hints Popup -->
  <g opacity="0">
    <rect x="400" y="200" width="400" height="120" fill="#252526" stroke="#007acc" stroke-width="2" rx="5">
      <animate attributeName="opacity" values="0;1;1;0" dur="4s" repeatCount="indefinite"/>
    </rect>
    <text x="420" y="230" font-family="'Cascadia Code', monospace" font-size="14" fill="#d4d4d4">
      <animate attributeName="opacity" values="0;1;1;0" dur="4s" repeatCount="indefinite"/>
      getUserData(): Promise&lt;UserData&gt;
    </text>
    <text x="420" y="250" font-family="'Cascadia Code', monospace" font-size="12" fill="#858585">
      <animate attributeName="opacity" values="0;1;1;0" dur="4s" repeatCount="indefinite"/>
      Fetches user data with caching
    </text>
  </g>

  <!-- IntelliSense Suggestion -->
  <g opacity="0">
    <rect x="650" y="230" width="300" height="200" fill="#252526" stroke="#007acc" stroke-width="1" rx="3">
      <animate attributeName="opacity" values="0;0;0;1;1;0" dur="6s" repeatCount="indefinite"/>
    </rect>
    <g font-family="'Cascadia Code', monospace" font-size="14">
      <text x="670" y="260" fill="#dcdcaa">
        <animate attributeName="opacity" values="0;0;0;1;1;0" dur="6s" repeatCount="indefinite"/>
        getUserData
      </text>
      <text x="670" y="290" fill="#dcdcaa">
        <animate attributeName="opacity" values="0;0;0;1;1;0" dur="6s" repeatCount="indefinite"/>
        getUserProfile
      </text>
      <text x="670" y="320" fill="#dcdcaa">
        <animate attributeName="opacity" values="0;0;0;1;1;0" dur="6s" repeatCount="indefinite"/>
        getUserSettings
      </text>
    </g>
  </g>

  <!-- Error Highlighting -->
  <line x1="100" y1="365" x2="300" y2="365" stroke="#f44747" stroke-width="2" stroke-dasharray="5,5" opacity="0">
    <animate attributeName="opacity" values="0;0;1;1;0;0" dur="8s" repeatCount="indefinite"/>
  </line>
</svg>`;

  // 2. Kubernetes YAML Editor
  const kubernetesYaml = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
  <defs>
    <linearGradient id="k8sGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#326ce5;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#366bc4;stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- Editor Background -->
  <rect width="1920" height="1080" fill="#1e1e1e"/>

  <!-- Title Bar with K8s Icon -->
  <rect width="1920" height="60" fill="#2d2d30"/>
  <text x="960" y="40" font-family="'Cascadia Code', monospace" font-size="24" fill="#326ce5" text-anchor="middle">Kubernetes Deployment Configuration</text>

  <!-- Line Numbers -->
  <rect x="0" y="60" width="80" height="1020" fill="#252526"/>

  <!-- YAML Content with Indentation Guides -->
  <g font-family="'Cascadia Code', monospace" font-size="18">
    <!-- API Version -->
    <text x="100" y="90" fill="#9cdcfe">apiVersion</text>
    <text x="230" y="90" fill="#d4d4d4">:</text>
    <text x="250" y="90" fill="#ce9178">apps/v1</text>

    <!-- Kind -->
    <text x="100" y="120" fill="#9cdcfe">kind</text>
    <text x="160" y="120" fill="#d4d4d4">:</text>
    <text x="180" y="120" fill="#ce9178">Deployment</text>

    <!-- Metadata -->
    <text x="100" y="150" fill="#9cdcfe">metadata</text>
    <text x="210" y="150" fill="#d4d4d4">:</text>
    <text x="130" y="180" fill="#9cdcfe">name</text>
    <text x="190" y="180" fill="#d4d4d4">:</text>
    <text x="210" y="180" fill="#ce9178">nginx-deployment</text>
    <text x="130" y="210" fill="#9cdcfe">labels</text>
    <text x="210" y="210" fill="#d4d4d4">:</text>
    <text x="160" y="240" fill="#9cdcfe">app</text>
    <text x="210" y="240" fill="#d4d4d4">:</text>
    <text x="230" y="240" fill="#ce9178">nginx</text>

    <!-- Spec -->
    <text x="100" y="270" fill="#9cdcfe">spec</text>
    <text x="160" y="270" fill="#d4d4d4">:</text>
    <text x="130" y="300" fill="#9cdcfe">replicas</text>
    <text x="230" y="300" fill="#d4d4d4">:</text>
    <text x="250" y="300" fill="#b5cea8">3</text>

    <!-- Selector -->
    <text x="130" y="330" fill="#9cdcfe">selector</text>
    <text x="230" y="330" fill="#d4d4d4">:</text>
    <text x="160" y="360" fill="#9cdcfe">matchLabels</text>
    <text x="290" y="360" fill="#d4d4d4">:</text>
    <text x="190" y="390" fill="#9cdcfe">app</text>
    <text x="240" y="390" fill="#d4d4d4">:</text>
    <text x="260" y="390" fill="#ce9178">nginx</text>

    <!-- Template -->
    <text x="130" y="420" fill="#9cdcfe">template</text>
    <text x="230" y="420" fill="#d4d4d4">:</text>
    <text x="160" y="450" fill="#9cdcfe">metadata</text>
    <text x="270" y="450" fill="#d4d4d4">:</text>
    <text x="190" y="480" fill="#9cdcfe">labels</text>
    <text x="270" y="480" fill="#d4d4d4">:</text>
    <text x="220" y="510" fill="#9cdcfe">app</text>
    <text x="270" y="510" fill="#d4d4d4">:</text>
    <text x="290" y="510" fill="#ce9178">nginx</text>
  </g>

  <!-- Indentation Lines -->
  <g stroke="#404040" stroke-width="1" opacity="0.5">
    <line x1="120" y1="180" x2="120" y2="240"/>
    <line x1="150" y1="240" x2="150" y2="240"/>
    <line x1="120" y1="300" x2="120" y2="510"/>
    <line x1="150" y1="360" x2="150" y2="390"/>
    <line x1="150" y1="450" x2="150" y2="510"/>
    <line x1="180" y1="480" x2="180" y2="510"/>
  </g>

  <!-- Validation Indicators -->
  <circle cx="70" cy="90" r="4" fill="#10b981">
    <animate attributeName="opacity" values="0;1;1;0" dur="2s" repeatCount="indefinite"/>
  </circle>
  <circle cx="70" cy="120" r="4" fill="#10b981">
    <animate attributeName="opacity" values="0;0;1;1;0" dur="2s" begin="0.2s" repeatCount="indefinite"/>
  </circle>
  <circle cx="70" cy="150" r="4" fill="#10b981">
    <animate attributeName="opacity" values="0;0;1;1;0" dur="2s" begin="0.4s" repeatCount="indefinite"/>
  </circle>
</svg>`;

  // 3. Terraform Infrastructure as Code Editor
  const terraformIac = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
  <defs>
    <linearGradient id="tfGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#7e3ff2;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#5c2fb7;stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- Editor Background -->
  <rect width="1920" height="1080" fill="#1e1e1e"/>

  <!-- Title Bar -->
  <rect width="1920" height="60" fill="#2d2d30"/>
  <text x="960" y="40" font-family="'Cascadia Code', monospace" font-size="24" fill="#7e3ff2" text-anchor="middle">Terraform AWS Infrastructure</text>

  <!-- Code Area -->
  <g font-family="'Cascadia Code', monospace" font-size="18">
    <!-- Provider Block -->
    <text x="100" y="90" fill="#c586c0">provider</text>
    <text x="210" y="90" fill="#ce9178">"aws"</text>
    <text x="280" y="90" fill="#d4d4d4">{</text>
    <text x="130" y="120" fill="#9cdcfe">region</text>
    <text x="210" y="120" fill="#d4d4d4">=</text>
    <text x="240" y="120" fill="#ce9178">"us-west-2"</text>
    <text x="130" y="150" fill="#9cdcfe">profile</text>
    <text x="220" y="150" fill="#d4d4d4">=</text>
    <text x="250" y="150" fill="#ce9178">"production"</text>
    <text x="100" y="180" fill="#d4d4d4">}</text>

    <!-- Resource Block -->
    <text x="100" y="240" fill="#c586c0">resource</text>
    <text x="210" y="240" fill="#ce9178">"aws_instance"</text>
    <text x="380" y="240" fill="#ce9178">"web_server"</text>
    <text x="520" y="240" fill="#d4d4d4">{</text>
    <text x="130" y="270" fill="#9cdcfe">ami</text>
    <text x="210" y="270" fill="#d4d4d4">=</text>
    <text x="240" y="270" fill="#ce9178">"ami-0c55b159cbfafe1f0"</text>
    <text x="130" y="300" fill="#9cdcfe">instance_type</text>
    <text x="280" y="300" fill="#d4d4d4">=</text>
    <text x="310" y="300" fill="#ce9178">"t3.micro"</text>

    <!-- Tags -->
    <text x="130" y="360" fill="#9cdcfe">tags</text>
    <text x="190" y="360" fill="#d4d4d4">=</text>
    <text x="220" y="360" fill="#d4d4d4">{</text>
    <text x="160" y="390" fill="#9cdcfe">Name</text>
    <text x="240" y="390" fill="#d4d4d4">=</text>
    <text x="270" y="390" fill="#ce9178">"WebServer"</text>
    <text x="160" y="420" fill="#9cdcfe">Environment</text>
    <text x="310" y="420" fill="#d4d4d4">=</text>
    <text x="340" y="420" fill="#ce9178">"Production"</text>
    <text x="130" y="450" fill="#d4d4d4">}</text>
    <text x="100" y="480" fill="#d4d4d4">}</text>

    <!-- Output Block -->
    <text x="100" y="540" fill="#c586c0">output</text>
    <text x="190" y="540" fill="#ce9178">"instance_ip"</text>
    <text x="340" y="540" fill="#d4d4d4">{</text>
    <text x="130" y="570" fill="#9cdcfe">value</text>
    <text x="210" y="570" fill="#d4d4d4">=</text>
    <text x="240" y="570" fill="#9cdcfe">aws_instance</text>
    <text x="390" y="570" fill="#d4d4d4">.</text>
    <text x="410" y="570" fill="#9cdcfe">web_server</text>
    <text x="530" y="570" fill="#d4d4d4">.</text>
    <text x="550" y="570" fill="#9cdcfe">public_ip</text>
    <text x="100" y="600" fill="#d4d4d4">}</text>
  </g>

  <!-- Plan Preview Animation -->
  <g opacity="0">
    <rect x="1000" y="200" width="800" height="400" fill="#252526" stroke="#7e3ff2" stroke-width="2" rx="5">
      <animate attributeName="opacity" values="0;1;1;0" dur="6s" repeatCount="indefinite"/>
    </rect>
    <text x="1020" y="230" font-family="'Cascadia Code', monospace" font-size="16" fill="#10b981">
      <animate attributeName="opacity" values="0;1;1;0" dur="6s" repeatCount="indefinite"/>
      + aws_instance.web_server will be created
    </text>
    <text x="1040" y="260" font-family="'Cascadia Code', monospace" font-size="14" fill="#d4d4d4">
      <animate attributeName="opacity" values="0;1;1;0" dur="6s" repeatCount="indefinite"/>
      + ami: "ami-0c55b159cbfafe1f0"
    </text>
    <text x="1040" y="290" font-family="'Cascadia Code', monospace" font-size="14" fill="#d4d4d4">
      <animate attributeName="opacity" values="0;1;1;0" dur="6s" repeatCount="indefinite"/>
      + instance_type: "t3.micro"
    </text>
  </g>
</svg>`;

  // 4. Go Microservice Editor
  const golangMicroservice = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
  <defs>
    <linearGradient id="goGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#00add8;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#007d9c;stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- Editor Background -->
  <rect width="1920" height="1080" fill="#1e1e1e"/>

  <!-- Title Bar -->
  <rect width="1920" height="60" fill="#2d2d30"/>
  <text x="960" y="40" font-family="'Cascadia Code', monospace" font-size="24" fill="#00add8" text-anchor="middle">Go Microservice Handler</text>

  <!-- Code Content -->
  <g font-family="'Cascadia Code', monospace" font-size="18">
    <!-- Package Declaration -->
    <text x="100" y="90" fill="#c586c0">package</text>
    <text x="200" y="90" fill="#d4d4d4">main</text>

    <!-- Imports -->
    <text x="100" y="150" fill="#c586c0">import</text>
    <text x="180" y="150" fill="#d4d4d4">(</text>
    <text x="130" y="180" fill="#ce9178">"encoding/json"</text>
    <text x="130" y="210" fill="#ce9178">"net/http"</text>
    <text x="130" y="240" fill="#ce9178">"github.com/gorilla/mux"</text>
    <text x="100" y="270" fill="#d4d4d4">)</text>

    <!-- Struct Definition -->
    <text x="100" y="330" fill="#c586c0">type</text>
    <text x="160" y="330" fill="#4ec9b0">Response</text>
    <text x="260" y="330" fill="#c586c0">struct</text>
    <text x="340" y="330" fill="#d4d4d4">{</text>
    <text x="130" y="360" fill="#9cdcfe">Status</text>
    <text x="230" y="360" fill="#4ec9b0">string</text>
    <text x="320" y="360" fill="#ce9178">&#96;json:"status"&#96;</text>
    <text x="130" y="390" fill="#9cdcfe">Message</text>
    <text x="240" y="390" fill="#4ec9b0">string</text>
    <text x="330" y="390" fill="#ce9178">&#96;json:"message"&#96;</text>
    <text x="130" y="420" fill="#9cdcfe">Data</text>
    <text x="200" y="420" fill="#c586c0">interface{}</text>
    <text x="340" y="420" fill="#ce9178">&#96;json:"data"&#96;</text>
    <text x="100" y="450" fill="#d4d4d4">}</text>

    <!-- Handler Function -->
    <text x="100" y="510" fill="#c586c0">func</text>
    <text x="160" y="510" fill="#dcdcaa">HandleRequest</text>
    <text x="320" y="510" fill="#d4d4d4">(</text>
    <text x="340" y="510" fill="#9cdcfe">w</text>
    <text x="360" y="510" fill="#4ec9b0">http.ResponseWriter</text>
    <text x="560" y="510" fill="#d4d4d4">,</text>
    <text x="580" y="510" fill="#9cdcfe">r</text>
    <text x="600" y="510" fill="#d4d4d4">*</text>
    <text x="620" y="510" fill="#4ec9b0">http.Request</text>
    <text x="760" y="510" fill="#d4d4d4">) {</text>

    <!-- Function Body -->
    <text x="130" y="540" fill="#9cdcfe">response</text>
    <text x="230" y="540" fill="#d4d4d4">:=</text>
    <text x="260" y="540" fill="#4ec9b0">Response</text>
    <text x="360" y="540" fill="#d4d4d4">{</text>
    <text x="160" y="570" fill="#9cdcfe">Status</text>
    <text x="240" y="570" fill="#d4d4d4">:</text>
    <text x="270" y="570" fill="#ce9178">"success"</text>
    <text x="380" y="570" fill="#d4d4d4">,</text>
    <text x="160" y="600" fill="#9cdcfe">Message</text>
    <text x="250" y="600" fill="#d4d4d4">:</text>
    <text x="280" y="600" fill="#ce9178">"Request processed"</text>
    <text x="480" y="600" fill="#d4d4d4">,</text>
    <text x="130" y="630" fill="#d4d4d4">}</text>

    <!-- JSON Encoding -->
    <text x="130" y="690" fill="#9cdcfe">w</text>
    <text x="150" y="690" fill="#d4d4d4">.</text>
    <text x="170" y="690" fill="#dcdcaa">Header</text>
    <text x="250" y="690" fill="#d4d4d4">().</text>
    <text x="290" y="690" fill="#dcdcaa">Set</text>
    <text x="330" y="690" fill="#d4d4d4">(</text>
    <text x="350" y="690" fill="#ce9178">"Content-Type"</text>
    <text x="500" y="690" fill="#d4d4d4">,</text>
    <text x="520" y="690" fill="#ce9178">"application/json"</text>
    <text x="700" y="690" fill="#d4d4d4">)</text>
    <text x="130" y="720" fill="#9cdcfe">json</text>
    <text x="180" y="720" fill="#d4d4d4">.</text>
    <text x="200" y="720" fill="#dcdcaa">NewEncoder</text>
    <text x="320" y="720" fill="#d4d4d4">(</text>
    <text x="340" y="720" fill="#9cdcfe">w</text>
    <text x="360" y="720" fill="#d4d4d4">).</text>
    <text x="400" y="720" fill="#dcdcaa">Encode</text>
    <text x="480" y="720" fill="#d4d4d4">(</text>
    <text x="500" y="720" fill="#9cdcfe">response</text>
    <text x="600" y="720" fill="#d4d4d4">)</text>
    <text x="100" y="750" fill="#d4d4d4">}</text>
  </g>

  <!-- Go Gopher Mascot -->
  <g transform="translate(1500, 800)" opacity="0.3">
    <ellipse cx="0" cy="0" rx="60" ry="80" fill="#00add8"/>
    <circle cx="-20" cy="-20" r="8" fill="#ffffff"/>
    <circle cx="20" cy="-20" r="8" fill="#ffffff"/>
  </g>
</svg>`;

  // 5. Rust System Programming Editor
  const rustSystem = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
  <defs>
    <linearGradient id="rustGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#ce422b;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#a62c1c;stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- Editor Background -->
  <rect width="1920" height="1080" fill="#1e1e1e"/>

  <!-- Title Bar -->
  <rect width="1920" height="60" fill="#2d2d30"/>
  <text x="960" y="40" font-family="'Cascadia Code', monospace" font-size="24" fill="#ce422b" text-anchor="middle">Rust System Programming</text>

  <!-- Code Content -->
  <g font-family="'Cascadia Code', monospace" font-size="18">
    <!-- Use Statements -->
    <text x="100" y="90" fill="#c586c0">use</text>
    <text x="150" y="90" fill="#4ec9b0">std</text>
    <text x="190" y="90" fill="#d4d4d4">::</text>
    <text x="220" y="90" fill="#4ec9b0">io</text>
    <text x="250" y="90" fill="#d4d4d4">::{</text>
    <text x="290" y="90" fill="#4ec9b0">self</text>
    <text x="340" y="90" fill="#d4d4d4">,</text>
    <text x="360" y="90" fill="#4ec9b0">Write</text>
    <text x="430" y="90" fill="#d4d4d4">};</text>

    <!-- Struct Definition -->
    <text x="100" y="150" fill="#c586c0">pub struct</text>
    <text x="230" y="150" fill="#4ec9b0">Buffer</text>
    <text x="310" y="150" fill="#d4d4d4">&lt;</text>
    <text x="330" y="150" fill="#4ec9b0">T</text>
    <text x="350" y="150" fill="#d4d4d4">&gt; {</text>
    <text x="130" y="180" fill="#9cdcfe">data</text>
    <text x="190" y="180" fill="#d4d4d4">:</text>
    <text x="210" y="180" fill="#4ec9b0">Vec</text>
    <text x="250" y="180" fill="#d4d4d4">&lt;</text>
    <text x="270" y="180" fill="#4ec9b0">T</text>
    <text x="290" y="180" fill="#d4d4d4">&gt;,</text>
    <text x="130" y="210" fill="#9cdcfe">capacity</text>
    <text x="240" y="210" fill="#d4d4d4">:</text>
    <text x="260" y="210" fill="#4ec9b0">usize</text>
    <text x="330" y="210" fill="#d4d4d4">,</text>
    <text x="100" y="240" fill="#d4d4d4">}</text>

    <!-- Implementation Block -->
    <text x="100" y="300" fill="#c586c0">impl</text>
    <text x="160" y="300" fill="#d4d4d4">&lt;</text>
    <text x="180" y="300" fill="#4ec9b0">T</text>
    <text x="200" y="300" fill="#d4d4d4">:</text>
    <text x="220" y="300" fill="#4ec9b0">Clone</text>
    <text x="290" y="300" fill="#d4d4d4">&gt;</text>
    <text x="320" y="300" fill="#4ec9b0">Buffer</text>
    <text x="400" y="300" fill="#d4d4d4">&lt;</text>
    <text x="420" y="300" fill="#4ec9b0">T</text>
    <text x="440" y="300" fill="#d4d4d4">&gt; {</text>

    <!-- Method -->
    <text x="130" y="330" fill="#c586c0">pub fn</text>
    <text x="220" y="330" fill="#dcdcaa">new</text>
    <text x="270" y="330" fill="#d4d4d4">(</text>
    <text x="290" y="330" fill="#9cdcfe">capacity</text>
    <text x="390" y="330" fill="#d4d4d4">:</text>
    <text x="410" y="330" fill="#4ec9b0">usize</text>
    <text x="480" y="330" fill="#d4d4d4">) -&gt;</text>
    <text x="550" y="330" fill="#4ec9b0">Self</text>
    <text x="610" y="330" fill="#d4d4d4">{</text>
    <text x="160" y="360" fill="#4ec9b0">Self</text>
    <text x="220" y="360" fill="#d4d4d4">{</text>
    <text x="190" y="390" fill="#9cdcfe">data</text>
    <text x="250" y="390" fill="#d4d4d4">:</text>
    <text x="270" y="390" fill="#4ec9b0">Vec</text>
    <text x="310" y="390" fill="#d4d4d4">::</text>
    <text x="340" y="390" fill="#dcdcaa">with_capacity</text>
    <text x="500" y="390" fill="#d4d4d4">(</text>
    <text x="520" y="390" fill="#9cdcfe">capacity</text>
    <text x="620" y="390" fill="#d4d4d4">),</text>
    <text x="190" y="420" fill="#9cdcfe">capacity</text>
    <text x="290" y="420" fill="#d4d4d4">,</text>
    <text x="160" y="450" fill="#d4d4d4">}</text>
    <text x="130" y="480" fill="#d4d4d4">}</text>

    <!-- Unsafe Block -->
    <text x="130" y="540" fill="#c586c0">pub fn</text>
    <text x="220" y="540" fill="#dcdcaa">raw_ptr</text>
    <text x="320" y="540" fill="#d4d4d4">(&amp;</text>
    <text x="360" y="540" fill="#c586c0">mut</text>
    <text x="410" y="540" fill="#c586c0">self</text>
    <text x="470" y="540" fill="#d4d4d4">) -&gt; *</text>
    <text x="540" y="540" fill="#c586c0">mut</text>
    <text x="590" y="540" fill="#4ec9b0">T</text>
    <text x="620" y="540" fill="#d4d4d4">{</text>
    <text x="160" y="570" fill="#f44747">unsafe</text>
    <text x="250" y="570" fill="#d4d4d4">{</text>
    <text x="190" y="600" fill="#c586c0">self</text>
    <text x="250" y="600" fill="#d4d4d4">.</text>
    <text x="270" y="600" fill="#9cdcfe">data</text>
    <text x="330" y="600" fill="#d4d4d4">.</text>
    <text x="350" y="600" fill="#dcdcaa">as_mut_ptr</text>
    <text x="490" y="600" fill="#d4d4d4">()</text>
    <text x="160" y="630" fill="#d4d4d4">}</text>
    <text x="130" y="660" fill="#d4d4d4">}</text>
    <text x="100" y="690" fill="#d4d4d4">}</text>
  </g>

  <!-- Memory Safety Indicator -->
  <g transform="translate(1600, 100)">
    <rect x="0" y="0" width="250" height="80" fill="#252526" stroke="#ce422b" stroke-width="2" rx="5"/>
    <text x="125" y="30" font-family="'Cascadia Code', monospace" font-size="14" fill="#10b981" text-anchor="middle">Memory Safe ✓</text>
    <text x="125" y="55" font-family="'Cascadia Code', monospace" font-size="12" fill="#858585" text-anchor="middle">Zero-cost abstractions</text>
  </g>
</svg>`;

  // Save all enhanced code editor templates
  const codeEditorDir = path.join(ASSETS_DIR, 'code-editors');
  await fs.mkdir(codeEditorDir, { recursive: true });

  await fs.writeFile(path.join(codeEditorDir, 'typescript-advanced.svg'), typescriptAdvanced);
  await fs.writeFile(path.join(codeEditorDir, 'kubernetes-yaml.svg'), kubernetesYaml);
  await fs.writeFile(path.join(codeEditorDir, 'terraform-iac.svg'), terraformIac);
  await fs.writeFile(path.join(codeEditorDir, 'golang-microservice.svg'), golangMicroservice);
  await fs.writeFile(path.join(codeEditorDir, 'rust-system.svg'), rustSystem);

  console.log('✅ Created 5 enhanced code editor templates');
}

// ============= Enhanced Terminal Templates =============

async function generateEnhancedTerminals() {
  console.log('🖥️ Creating enhanced terminal templates...');

  // 1. AWS CLI Terminal
  const awsCli = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
  <rect width="1920" height="1080" fill="#0c0c0c"/>

  <!-- Terminal Header -->
  <rect width="1920" height="40" fill="#1a1a1a"/>
  <text x="960" y="28" font-family="'Cascadia Code', monospace" font-size="16" fill="#ff9900" text-anchor="middle">AWS CLI - Production Environment</text>

  <!-- Command Lines -->
  <g font-family="'Cascadia Code', monospace" font-size="16">
    <text x="40" y="80" fill="#00ff00">$ aws s3 ls s3://my-bucket/</text>
    <text x="40" y="110" fill="#ffffff" opacity="0">
      <animate attributeName="opacity" values="0;1" dur="0.5s" begin="1s" fill="freeze"/>
      2024-01-15 10:30:00    1024 config.json
    </text>
    <text x="40" y="140" fill="#ffffff" opacity="0">
      <animate attributeName="opacity" values="0;1" dur="0.5s" begin="1.2s" fill="freeze"/>
      2024-01-15 10:35:00    2048 data.csv
    </text>

    <text x="40" y="200" fill="#00ff00" opacity="0">
      <animate attributeName="opacity" values="0;1" dur="0.5s" begin="2s" fill="freeze"/>
      $ aws ec2 describe-instances --region us-west-2
    </text>

    <!-- JSON Output -->
    <text x="40" y="240" fill="#ffff00" opacity="0">
      <animate attributeName="opacity" values="0;1" dur="0.5s" begin="3s" fill="freeze"/>
      {
    </text>
    <text x="60" y="270" fill="#00ffff" opacity="0">
      <animate attributeName="opacity" values="0;1" dur="0.5s" begin="3.2s" fill="freeze"/>
      "Instances": [
    </text>
    <text x="80" y="300" fill="#ffffff" opacity="0">
      <animate attributeName="opacity" values="0;1" dur="0.5s" begin="3.4s" fill="freeze"/>
      {
    </text>
    <text x="100" y="330" fill="#ff9900" opacity="0">
      <animate attributeName="opacity" values="0;1" dur="0.5s" begin="3.6s" fill="freeze"/>
      "InstanceId": "i-0123456789abcdef0",
    </text>
    <text x="100" y="360" fill="#ff9900" opacity="0">
      <animate attributeName="opacity" values="0;1" dur="0.5s" begin="3.8s" fill="freeze"/>
      "State": "running",
    </text>
    <text x="100" y="390" fill="#ff9900" opacity="0">
      <animate attributeName="opacity" values="0;1" dur="0.5s" begin="4s" fill="freeze"/>
      "InstanceType": "t3.medium"
    </text>
  </g>

  <!-- Status Bar -->
  <rect y="1040" width="1920" height="40" fill="#1a1a1a"/>
  <text x="40" y="1065" font-family="'Cascadia Code', monospace" font-size="14" fill="#00ff00">AWS Region: us-west-2 | Profile: production</text>
</svg>`;

  // 2. Kubernetes kubectl Terminal
  const kubectlTerminal = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
  <rect width="1920" height="1080" fill="#0c0c0c"/>

  <!-- Terminal Header -->
  <rect width="1920" height="40" fill="#1a1a1a"/>
  <text x="960" y="28" font-family="'Cascadia Code', monospace" font-size="16" fill="#326ce5" text-anchor="middle">Kubernetes Control - Production Cluster</text>

  <!-- Commands -->
  <g font-family="'Cascadia Code', monospace" font-size="16">
    <text x="40" y="80" fill="#00ff00">$ kubectl get pods -n production</text>
    <text x="40" y="110" fill="#ffffff" opacity="0">
      <animate attributeName="opacity" values="0;1" dur="0.5s" begin="0.5s" fill="freeze"/>
      NAME                          READY   STATUS    RESTARTS   AGE
    </text>
    <text x="40" y="140" fill="#00ff00" opacity="0">
      <animate attributeName="opacity" values="0;1" dur="0.5s" begin="1s" fill="freeze"/>
      api-server-7d9c476c7c-2kxmt  1/1     Running   0          2d
    </text>
    <text x="40" y="170" fill="#00ff00" opacity="0">
      <animate attributeName="opacity" values="0;1" dur="0.5s" begin="1.2s" fill="freeze"/>
      api-server-7d9c476c7c-5jnqw  1/1     Running   0          2d
    </text>
    <text x="40" y="200" fill="#00ff00" opacity="0">
      <animate attributeName="opacity" values="0;1" dur="0.5s" begin="1.4s" fill="freeze"/>
      api-server-7d9c476c7c-8wmfx  1/1     Running   0          2d
    </text>

    <text x="40" y="260" fill="#00ff00" opacity="0">
      <animate attributeName="opacity" values="0;1" dur="0.5s" begin="2s" fill="freeze"/>
      $ kubectl scale deployment api-server --replicas=5
    </text>
    <text x="40" y="290" fill="#ffff00" opacity="0">
      <animate attributeName="opacity" values="0;1" dur="0.5s" begin="3s" fill="freeze"/>
      deployment.apps/api-server scaled
    </text>

    <text x="40" y="350" fill="#00ff00" opacity="0">
      <animate attributeName="opacity" values="0;1" dur="0.5s" begin="3.5s" fill="freeze"/>
      $ kubectl rollout status deployment/api-server
    </text>
    <text x="40" y="380" fill="#00ffff" opacity="0">
      <animate attributeName="opacity" values="0;1" dur="0.5s" begin="4s" fill="freeze"/>
      Waiting for deployment "api-server" rollout to finish...
    </text>
    <text x="40" y="410" fill="#00ff00" opacity="0">
      <animate attributeName="opacity" values="0;1" dur="0.5s" begin="5s" fill="freeze"/>
      deployment "api-server" successfully rolled out
    </text>
  </g>

  <!-- Cluster Info -->
  <rect y="1040" width="1920" height="40" fill="#1a1a1a"/>
  <text x="40" y="1065" font-family="'Cascadia Code', monospace" font-size="14" fill="#326ce5">Context: production | Namespace: default | Cluster: eks-prod</text>
</svg>`;

  // 3. Terraform Apply Terminal
  const terraformApply = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
  <rect width="1920" height="1080" fill="#0c0c0c"/>

  <!-- Terminal Header -->
  <rect width="1920" height="40" fill="#1a1a1a"/>
  <text x="960" y="28" font-family="'Cascadia Code', monospace" font-size="16" fill="#7e3ff2" text-anchor="middle">Terraform Infrastructure Deployment</text>

  <!-- Commands and Output -->
  <g font-family="'Cascadia Code', monospace" font-size="16">
    <text x="40" y="80" fill="#00ff00">$ terraform plan</text>
    <text x="40" y="110" fill="#ffffff" opacity="0">
      <animate attributeName="opacity" values="0;1" dur="0.5s" begin="0.5s" fill="freeze"/>
      Refreshing Terraform state in-memory prior to plan...
    </text>

    <text x="40" y="170" fill="#00ffff" opacity="0">
      <animate attributeName="opacity" values="0;1" dur="0.5s" begin="1.5s" fill="freeze"/>
      Terraform will perform the following actions:
    </text>

    <text x="40" y="210" fill="#00ff00" opacity="0">
      <animate attributeName="opacity" values="0;1" dur="0.5s" begin="2s" fill="freeze"/>
      + aws_instance.web_server
    </text>
    <text x="60" y="240" fill="#ffffff" opacity="0">
      <animate attributeName="opacity" values="0;1" dur="0.5s" begin="2.2s" fill="freeze"/>
      ami:           "ami-0c55b159cbfafe1f0"
    </text>
    <text x="60" y="270" fill="#ffffff" opacity="0">
      <animate attributeName="opacity" values="0;1" dur="0.5s" begin="2.4s" fill="freeze"/>
      instance_type: "t3.micro"
    </text>

    <text x="40" y="330" fill="#ffff00" opacity="0">
      <animate attributeName="opacity" values="0;1" dur="0.5s" begin="3s" fill="freeze"/>
      Plan: 1 to add, 0 to change, 0 to destroy.
    </text>

    <text x="40" y="390" fill="#00ff00" opacity="0">
      <animate attributeName="opacity" values="0;1" dur="0.5s" begin="3.5s" fill="freeze"/>
      $ terraform apply -auto-approve
    </text>

    <text x="40" y="420" fill="#00ffff" opacity="0">
      <animate attributeName="opacity" values="0;1" dur="0.5s" begin="4s" fill="freeze"/>
      aws_instance.web_server: Creating...
    </text>

    <!-- Progress Bar -->
    <rect x="40" y="450" width="500" height="20" fill="#1a1a1a" stroke="#7e3ff2" stroke-width="2" opacity="0">
      <animate attributeName="opacity" values="0;1" dur="0.5s" begin="4.5s" fill="freeze"/>
    </rect>
    <rect x="42" y="452" width="0" height="16" fill="#7e3ff2">
      <animate attributeName="width" values="0;496" dur="3s" begin="4.5s" fill="freeze"/>
    </rect>

    <text x="40" y="510" fill="#00ff00" opacity="0">
      <animate attributeName="opacity" values="0;1" dur="0.5s" begin="7.5s" fill="freeze"/>
      aws_instance.web_server: Creation complete after 42s
    </text>

    <text x="40" y="570" fill="#00ff00" opacity="0">
      <animate attributeName="opacity" values="0;1" dur="0.5s" begin="8s" fill="freeze"/>
      Apply complete! Resources: 1 added, 0 changed, 0 destroyed.
    </text>
  </g>
</svg>`;

  // 4. System Monitoring Terminal
  const monitoringTerminal = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
  <rect width="1920" height="1080" fill="#0c0c0c"/>

  <!-- Terminal Header -->
  <rect width="1920" height="40" fill="#1a1a1a"/>
  <text x="960" y="28" font-family="'Cascadia Code', monospace" font-size="16" fill="#00ff00" text-anchor="middle">System Monitoring Dashboard</text>

  <!-- htop-style display -->
  <g font-family="'Cascadia Code', monospace" font-size="14">
    <text x="40" y="80" fill="#00ffff">CPU [||||||||||||||||        76%]</text>
    <text x="40" y="110" fill="#00ffff">MEM [||||||||||||||          62%]</text>
    <text x="40" y="140" fill="#00ffff">SWP [|||                     12%]</text>

    <text x="40" y="200" fill="#ffffff">  PID USER      PRI  NI  VIRT   RES   SHR S CPU% MEM%   TIME+  Command</text>
    <text x="40" y="230" fill="#00ff00"> 2514 root       20   0  162M  24.1M  8.5M S 45.2  3.2  2:15.23 nginx</text>
    <text x="40" y="260" fill="#00ff00"> 3421 postgres   20   0  384M  128M  12.3M S 32.1 16.4  5:42.15 postgres</text>
    <text x="40" y="290" fill="#00ff00"> 4532 node       20   0  512M  96.5M  6.2M S 28.4 12.3  3:21.42 node app.js</text>

    <!-- Docker Stats -->
    <text x="40" y="380" fill="#00ff00">$ docker stats --no-stream</text>
    <text x="40" y="410" fill="#ffffff" opacity="0">
      <animate attributeName="opacity" values="0;1" dur="0.5s" begin="1s" fill="freeze"/>
      CONTAINER ID   NAME         CPU %   MEM USAGE / LIMIT   MEM %   NET I/O
    </text>
    <text x="40" y="440" fill="#00ffff" opacity="0">
      <animate attributeName="opacity" values="0;1" dur="0.5s" begin="1.5s" fill="freeze"/>
      a3f4c3d2e1f0   api-server   23.5%   512MiB / 2GiB       25%     1.2GB / 890MB
    </text>
    <text x="40" y="470" fill="#00ffff" opacity="0">
      <animate attributeName="opacity" values="0;1" dur="0.5s" begin="1.7s" fill="freeze"/>
      b5e6d7c8f9a1   database     45.2%   1.2GiB / 4GiB       30%     5.6GB / 3.2GB
    </text>
  </g>

  <!-- Real-time Graph -->
  <g transform="translate(1200, 200)">
    <rect width="600" height="300" fill="#1a1a1a" stroke="#00ff00" stroke-width="2"/>
    <polyline points="0,250 50,240 100,220 150,230 200,210 250,190 300,200 350,180 400,170 450,160 500,150 550,140"
              fill="none" stroke="#00ff00" stroke-width="2">
      <animate attributeName="points"
               values="0,250 50,240 100,220 150,230 200,210 250,190 300,200 350,180 400,170 450,160 500,150 550,140;
                       50,240 100,220 150,230 200,210 250,190 300,200 350,180 400,170 450,160 500,150 550,140 600,130"
               dur="2s" repeatCount="indefinite"/>
    </polyline>
  </g>
</svg>`;

  // 5. Security Audit Terminal
  const securityAudit = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
  <rect width="1920" height="1080" fill="#0c0c0c"/>

  <!-- Terminal Header -->
  <rect width="1920" height="40" fill="#1a1a1a"/>
  <text x="960" y="28" font-family="'Cascadia Code', monospace" font-size="16" fill="#ff0000" text-anchor="middle">Security Audit Scanner</text>

  <!-- Security Scan -->
  <g font-family="'Cascadia Code', monospace" font-size="16">
    <text x="40" y="80" fill="#00ff00">$ security-scan --deep --verbose</text>

    <text x="40" y="120" fill="#ffff00" opacity="0">
      <animate attributeName="opacity" values="0;1" dur="0.5s" begin="0.5s" fill="freeze"/>
      [*] Starting security audit...
    </text>

    <text x="40" y="160" fill="#00ffff" opacity="0">
      <animate attributeName="opacity" values="0;1" dur="0.5s" begin="1s" fill="freeze"/>
      [+] Checking SSL certificates...
    </text>
    <text x="60" y="190" fill="#00ff00" opacity="0">
      <animate attributeName="opacity" values="0;1" dur="0.5s" begin="1.5s" fill="freeze"/>
      ✓ All certificates valid
    </text>

    <text x="40" y="230" fill="#00ffff" opacity="0">
      <animate attributeName="opacity" values="0;1" dur="0.5s" begin="2s" fill="freeze"/>
      [+] Scanning for vulnerabilities...
    </text>
    <text x="60" y="260" fill="#ffff00" opacity="0">
      <animate attributeName="opacity" values="0;1" dur="0.5s" begin="2.5s" fill="freeze"/>
      ⚠ Found 2 medium severity issues
    </text>

    <text x="40" y="300" fill="#00ffff" opacity="0">
      <animate attributeName="opacity" values="0;1" dur="0.5s" begin="3s" fill="freeze"/>
      [+] Checking open ports...
    </text>
    <text x="60" y="330" fill="#00ff00" opacity="0">
      <animate attributeName="opacity" values="0;1" dur="0.5s" begin="3.5s" fill="freeze"/>
      ✓ Only expected ports open: 22, 80, 443
    </text>

    <text x="40" y="370" fill="#00ffff" opacity="0">
      <animate attributeName="opacity" values="0;1" dur="0.5s" begin="4s" fill="freeze"/>
      [+] Analyzing dependencies...
    </text>
    <text x="60" y="400" fill="#ff0000" opacity="0">
      <animate attributeName="opacity" values="0;1" dur="0.5s" begin="4.5s" fill="freeze"/>
      ✗ Found 1 critical vulnerability in lodash@4.17.11
    </text>

    <text x="40" y="460" fill="#ffffff" opacity="0">
      <animate attributeName="opacity" values="0;1" dur="0.5s" begin="5s" fill="freeze"/>
      Summary: 1 critical, 2 medium, 0 low
    </text>

    <text x="40" y="490" fill="#ffff00" opacity="0">
      <animate attributeName="opacity" values="0;1" dur="0.5s" begin="5.5s" fill="freeze"/>
      Recommended action: Update lodash to version 4.17.21
    </text>
  </g>

  <!-- Severity Indicators -->
  <g transform="translate(1400, 200)">
    <rect width="400" height="200" fill="#1a1a1a" stroke="#ff0000" stroke-width="2" rx="5"/>
    <text x="200" y="30" font-family="'Cascadia Code', monospace" font-size="18" fill="#ffffff" text-anchor="middle">Severity Levels</text>
    <circle cx="50" cy="70" r="10" fill="#ff0000"/>
    <text x="80" y="75" font-family="'Cascadia Code', monospace" font-size="14" fill="#ff0000">Critical: 1</text>
    <circle cx="50" cy="110" r="10" fill="#ffff00"/>
    <text x="80" y="115" font-family="'Cascadia Code', monospace" font-size="14" fill="#ffff00">Medium: 2</text>
    <circle cx="50" cy="150" r="10" fill="#00ff00"/>
    <text x="80" y="155" font-family="'Cascadia Code', monospace" font-size="14" fill="#00ff00">Low: 0</text>
  </g>
</svg>`;

  // Save all enhanced terminal templates
  const terminalDir = path.join(ASSETS_DIR, 'terminals');
  await fs.mkdir(terminalDir, { recursive: true });

  await fs.writeFile(path.join(terminalDir, 'aws-cli.svg'), awsCli);
  await fs.writeFile(path.join(terminalDir, 'kubectl-terminal.svg'), kubectlTerminal);
  await fs.writeFile(path.join(terminalDir, 'terraform-apply.svg'), terraformApply);
  await fs.writeFile(path.join(terminalDir, 'monitoring-commands.svg'), monitoringTerminal);
  await fs.writeFile(path.join(terminalDir, 'security-audit.svg'), securityAudit);

  console.log('✅ Created 5 enhanced terminal templates');
}

// ============= Interactive Process Template =============

async function generateInteractiveProcess() {
  console.log('📊 Creating interactive process template...');

  const interactiveProcess = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
  <defs>
    <linearGradient id="processGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
    <filter id="shadow">
      <feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.3"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1920" height="1080" fill="#1a1a2e"/>

  <!-- Title -->
  <text x="960" y="80" font-family="'Inter', sans-serif" font-size="36" fill="#ffffff" text-anchor="middle" font-weight="bold">CI/CD Pipeline Process</text>

  <!-- Progress Bar -->
  <rect x="260" y="140" width="1400" height="40" fill="#2d2d4a" rx="20"/>
  <rect x="260" y="140" width="0" height="40" fill="url(#processGradient)" rx="20">
    <animate attributeName="width" values="0;280;560;840;1120;1400" dur="10s" repeatCount="indefinite"/>
  </rect>

  <!-- Step Indicators -->
  <g id="steps">
    <!-- Step 1: Code Commit -->
    <g transform="translate(400, 300)">
      <circle cx="0" cy="0" r="60" fill="#2d2d4a" stroke="#667eea" stroke-width="3" filter="url(#shadow)">
        <animate attributeName="fill" values="#2d2d4a;#667eea;#667eea;#667eea;#667eea;#667eea" dur="10s" repeatCount="indefinite"/>
      </circle>
      <text x="0" y="5" font-family="'Inter', sans-serif" font-size="16" fill="#ffffff" text-anchor="middle">Commit</text>
      <text x="0" y="-80" font-family="'Inter', sans-serif" font-size="14" fill="#00ff00" text-anchor="middle" opacity="0">
        <animate attributeName="opacity" values="0;1;1;0;0;0" dur="10s" repeatCount="indefinite"/>
        ✓ Completed
      </text>
    </g>

    <!-- Step 2: Build -->
    <g transform="translate(680, 300)">
      <circle cx="0" cy="0" r="60" fill="#2d2d4a" stroke="#667eea" stroke-width="3" filter="url(#shadow)">
        <animate attributeName="fill" values="#2d2d4a;#2d2d4a;#667eea;#667eea;#667eea;#667eea" dur="10s" repeatCount="indefinite"/>
      </circle>
      <text x="0" y="5" font-family="'Inter', sans-serif" font-size="16" fill="#ffffff" text-anchor="middle">Build</text>
      <text x="0" y="-80" font-family="'Inter', sans-serif" font-size="14" fill="#00ff00" text-anchor="middle" opacity="0">
        <animate attributeName="opacity" values="0;0;1;1;0;0" dur="10s" repeatCount="indefinite"/>
        ✓ Completed
      </text>
    </g>

    <!-- Step 3: Test -->
    <g transform="translate(960, 300)">
      <circle cx="0" cy="0" r="60" fill="#2d2d4a" stroke="#667eea" stroke-width="3" filter="url(#shadow)">
        <animate attributeName="fill" values="#2d2d4a;#2d2d4a;#2d2d4a;#667eea;#667eea;#667eea" dur="10s" repeatCount="indefinite"/>
      </circle>
      <text x="0" y="5" font-family="'Inter', sans-serif" font-size="16" fill="#ffffff" text-anchor="middle">Test</text>
      <text x="0" y="-80" font-family="'Inter', sans-serif" font-size="14" fill="#00ff00" text-anchor="middle" opacity="0">
        <animate attributeName="opacity" values="0;0;0;1;1;0" dur="10s" repeatCount="indefinite"/>
        ✓ Completed
      </text>
    </g>

    <!-- Step 4: Deploy Staging -->
    <g transform="translate(1240, 300)">
      <circle cx="0" cy="0" r="60" fill="#2d2d4a" stroke="#667eea" stroke-width="3" filter="url(#shadow)">
        <animate attributeName="fill" values="#2d2d4a;#2d2d4a;#2d2d4a;#2d2d4a;#667eea;#667eea" dur="10s" repeatCount="indefinite"/>
      </circle>
      <text x="0" y="5" font-family="'Inter', sans-serif" font-size="16" fill="#ffffff" text-anchor="middle">Stage</text>
      <text x="0" y="-80" font-family="'Inter', sans-serif" font-size="14" fill="#00ff00" text-anchor="middle" opacity="0">
        <animate attributeName="opacity" values="0;0;0;0;1;1" dur="10s" repeatCount="indefinite"/>
        ✓ Completed
      </text>
    </g>

    <!-- Step 5: Deploy Production -->
    <g transform="translate(1520, 300)">
      <circle cx="0" cy="0" r="60" fill="#2d2d4a" stroke="#667eea" stroke-width="3" filter="url(#shadow)">
        <animate attributeName="fill" values="#2d2d4a;#2d2d4a;#2d2d4a;#2d2d4a;#2d2d4a;#667eea" dur="10s" repeatCount="indefinite"/>
      </circle>
      <text x="0" y="5" font-family="'Inter', sans-serif" font-size="16" fill="#ffffff" text-anchor="middle">Prod</text>
      <text x="0" y="-80" font-family="'Inter', sans-serif" font-size="14" fill="#00ff00" text-anchor="middle" opacity="0">
        <animate attributeName="opacity" values="0;0;0;0;0;1" dur="10s" repeatCount="indefinite"/>
        ✓ Deployed
      </text>
    </g>
  </g>

  <!-- Connecting Lines -->
  <g stroke="#667eea" stroke-width="3" fill="none">
    <line x1="460" y1="300" x2="620" y2="300">
      <animate attributeName="stroke-dasharray" values="0 200;200 0" dur="2s" begin="0s" repeatCount="indefinite"/>
    </line>
    <line x1="740" y1="300" x2="900" y2="300">
      <animate attributeName="stroke-dasharray" values="0 200;200 0" dur="2s" begin="2s" repeatCount="indefinite"/>
    </line>
    <line x1="1020" y1="300" x2="1180" y2="300">
      <animate attributeName="stroke-dasharray" values="0 200;200 0" dur="2s" begin="4s" repeatCount="indefinite"/>
    </line>
    <line x1="1300" y1="300" x2="1460" y2="300">
      <animate attributeName="stroke-dasharray" values="0 200;200 0" dur="2s" begin="6s" repeatCount="indefinite"/>
    </line>
  </g>

  <!-- Branch Condition -->
  <g transform="translate(960, 500)">
    <rect x="-150" y="-40" width="300" height="80" fill="#2d2d4a" stroke="#ffff00" stroke-width="2" rx="10" opacity="0">
      <animate attributeName="opacity" values="0;0;0;1;1;0;0;0;0;0" dur="10s" repeatCount="indefinite"/>
    </rect>
    <text x="0" y="0" font-family="'Inter', sans-serif" font-size="16" fill="#ffff00" text-anchor="middle" opacity="0">
      <animate attributeName="opacity" values="0;0;0;1;1;0;0;0;0;0" dur="10s" repeatCount="indefinite"/>
      Tests Passing: 142/142
    </text>
    <text x="0" y="25" font-family="'Inter', sans-serif" font-size="14" fill="#00ff00" text-anchor="middle" opacity="0">
      <animate attributeName="opacity" values="0;0;0;1;1;0;0;0;0;0" dur="10s" repeatCount="indefinite"/>
      Proceeding to Staging
    </text>
  </g>

  <!-- Error Handling Path -->
  <g transform="translate(960, 650)" opacity="0.5">
    <rect x="-150" y="-30" width="300" height="60" fill="#2d2d4a" stroke="#ff0000" stroke-width="2" rx="10" stroke-dasharray="5,5"/>
    <text x="0" y="5" font-family="'Inter', sans-serif" font-size="14" fill="#ff0000" text-anchor="middle">Error Path: Rollback</text>
  </g>

  <!-- Metrics Display -->
  <g transform="translate(960, 850)">
    <rect x="-200" y="-50" width="400" height="100" fill="#2d2d4a" stroke="#667eea" stroke-width="2" rx="10"/>
    <text x="0" y="-20" font-family="'Inter', sans-serif" font-size="18" fill="#ffffff" text-anchor="middle">Pipeline Metrics</text>
    <text x="-150" y="10" font-family="'Cascadia Code', monospace" font-size="14" fill="#00ff00">Duration: 4m 32s</text>
    <text x="-150" y="35" font-family="'Cascadia Code', monospace" font-size="14" fill="#00ffff">Success Rate: 98.5%</text>
    <text x="50" y="10" font-family="'Cascadia Code', monospace" font-size="14" fill="#ffff00">Queue: 2 pending</text>
    <text x="50" y="35" font-family="'Cascadia Code', monospace" font-size="14" fill="#ff9900">Resources: 65%</text>
  </g>
</svg>`;

  const processDir = path.join(ASSETS_DIR, 'processes');
  await fs.mkdir(processDir, { recursive: true });
  await fs.writeFile(path.join(processDir, 'interactive-pipeline.svg'), interactiveProcess);

  console.log('✅ Created interactive process template');
}

// ============= Data Pipeline Template =============

async function generateDataPipeline() {
  console.log('💾 Creating data pipeline template...');

  const dataPipeline = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
  <defs>
    <linearGradient id="dataGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#00d4ff;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0099ff;stop-opacity:1" />
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
  <rect width="1920" height="1080" fill="#0a0a0a"/>

  <!-- Title -->
  <text x="960" y="60" font-family="'Inter', sans-serif" font-size="32" fill="#ffffff" text-anchor="middle" font-weight="bold">Real-time Data Pipeline</text>

  <!-- Data Source -->
  <g transform="translate(200, 300)">
    <rect x="-80" y="-60" width="160" height="120" fill="#1a1a2e" stroke="#00d4ff" stroke-width="2" rx="10"/>
    <text x="0" y="-20" font-family="'Inter', sans-serif" font-size="16" fill="#00d4ff" text-anchor="middle">Data Source</text>
    <text x="0" y="5" font-family="'Cascadia Code', monospace" font-size="12" fill="#ffffff" text-anchor="middle">Kafka Stream</text>
    <text x="0" y="25" font-family="'Cascadia Code', monospace" font-size="10" fill="#00ff00" text-anchor="middle">
      <animate attributeName="fill" values="#00ff00;#ffff00;#00ff00" dur="2s" repeatCount="indefinite"/>
      5.2K msg/s
    </text>
  </g>

  <!-- Ingestion Queue -->
  <g transform="translate(500, 300)">
    <rect x="-80" y="-60" width="160" height="120" fill="#1a1a2e" stroke="#00d4ff" stroke-width="2" rx="10"/>
    <text x="0" y="-20" font-family="'Inter', sans-serif" font-size="16" fill="#00d4ff" text-anchor="middle">Queue</text>
    <rect x="-60" y="0" width="120" height="30" fill="#0a0a0a" stroke="#00d4ff" stroke-width="1"/>
    <!-- Queue Items Animation -->
    <rect x="-55" y="5" width="20" height="20" fill="#00ff00" opacity="0">
      <animate attributeName="opacity" values="0;1;1;0" dur="1s" repeatCount="indefinite"/>
      <animate attributeName="x" values="-55;-30;-5;20;45" dur="1s" repeatCount="indefinite"/>
    </rect>
    <rect x="-55" y="5" width="20" height="20" fill="#00ff00" opacity="0">
      <animate attributeName="opacity" values="0;1;1;0" dur="1s" begin="0.2s" repeatCount="indefinite"/>
      <animate attributeName="x" values="-55;-30;-5;20;45" dur="1s" begin="0.2s" repeatCount="indefinite"/>
    </rect>
    <rect x="-55" y="5" width="20" height="20" fill="#00ff00" opacity="0">
      <animate attributeName="opacity" values="0;1;1;0" dur="1s" begin="0.4s" repeatCount="indefinite"/>
      <animate attributeName="x" values="-55;-30;-5;20;45" dur="1s" begin="0.4s" repeatCount="indefinite"/>
    </rect>
  </g>

  <!-- Processing Node 1 -->
  <g transform="translate(800, 200)">
    <circle cx="0" cy="0" r="70" fill="#1a1a2e" stroke="#00d4ff" stroke-width="2" filter="url(#glow)"/>
    <text x="0" y="-10" font-family="'Inter', sans-serif" font-size="16" fill="#ffffff" text-anchor="middle">Transform</text>
    <text x="0" y="10" font-family="'Cascadia Code', monospace" font-size="12" fill="#00ff00" text-anchor="middle">JSON → Parquet</text>
    <!-- Processing Animation -->
    <circle cx="0" cy="0" r="60" fill="none" stroke="#00ff00" stroke-width="2" opacity="0.5">
      <animate attributeName="r" values="60;75;60" dur="2s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.5;0.1;0.5" dur="2s" repeatCount="indefinite"/>
    </circle>
  </g>

  <!-- Processing Node 2 -->
  <g transform="translate(800, 400)">
    <circle cx="0" cy="0" r="70" fill="#1a1a2e" stroke="#00d4ff" stroke-width="2" filter="url(#glow)"/>
    <text x="0" y="-10" font-family="'Inter', sans-serif" font-size="16" fill="#ffffff" text-anchor="middle">Aggregate</text>
    <text x="0" y="10" font-family="'Cascadia Code', monospace" font-size="12" fill="#00ff00" text-anchor="middle">5min Window</text>
    <!-- Processing Animation -->
    <circle cx="0" cy="0" r="60" fill="none" stroke="#ffff00" stroke-width="2" opacity="0.5">
      <animate attributeName="r" values="60;75;60" dur="2s" begin="0.5s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.5;0.1;0.5" dur="2s" begin="0.5s" repeatCount="indefinite"/>
    </circle>
  </g>

  <!-- Database Storage -->
  <g transform="translate(1200, 300)">
    <rect x="-90" y="-70" width="180" height="140" fill="#1a1a2e" stroke="#00d4ff" stroke-width="2" rx="10"/>
    <text x="0" y="-30" font-family="'Inter', sans-serif" font-size="16" fill="#00d4ff" text-anchor="middle">Database</text>
    <rect x="-70" y="-10" width="140" height="15" fill="#00ff00" opacity="0.8"/>
    <rect x="-70" y="10" width="140" height="15" fill="#00ff00" opacity="0.6"/>
    <rect x="-70" y="30" width="140" height="15" fill="#00ff00" opacity="0.4"/>
    <text x="0" y="65" font-family="'Cascadia Code', monospace" font-size="12" fill="#ffffff" text-anchor="middle">2.3TB Stored</text>
  </g>

  <!-- Analytics Dashboard -->
  <g transform="translate(1550, 300)">
    <rect x="-100" y="-80" width="200" height="160" fill="#1a1a2e" stroke="#00d4ff" stroke-width="2" rx="10"/>
    <text x="0" y="-50" font-family="'Inter', sans-serif" font-size="16" fill="#00d4ff" text-anchor="middle">Analytics</text>
    <!-- Mini Chart -->
    <polyline points="-80,-20 -60,0 -40,-10 -20,10 0,-5 20,5 40,-15 60,0 80,-25"
              fill="none" stroke="#00ff00" stroke-width="2"/>
    <text x="0" y="40" font-family="'Cascadia Code', monospace" font-size="12" fill="#00ff00" text-anchor="middle">Real-time Insights</text>
  </g>

  <!-- Data Flow Arrows with Animated Packets -->
  <g>
    <!-- Source to Queue -->
    <line x1="280" y1="300" x2="420" y2="300" stroke="#00d4ff" stroke-width="2"/>
    <circle cx="280" cy="300" r="5" fill="#00ff00">
      <animate attributeName="cx" values="280;420" dur="1s" repeatCount="indefinite"/>
    </circle>

    <!-- Queue to Processing -->
    <line x1="580" y1="300" x2="730" y2="250" stroke="#00d4ff" stroke-width="2"/>
    <line x1="580" y1="300" x2="730" y2="350" stroke="#00d4ff" stroke-width="2"/>
    <circle cx="580" cy="300" r="5" fill="#00ff00">
      <animate attributeName="cx" values="580;730" dur="1s" begin="0.5s" repeatCount="indefinite"/>
      <animate attributeName="cy" values="300;250" dur="1s" begin="0.5s" repeatCount="indefinite"/>
    </circle>
    <circle cx="580" cy="300" r="5" fill="#ffff00">
      <animate attributeName="cx" values="580;730" dur="1s" begin="0.7s" repeatCount="indefinite"/>
      <animate attributeName="cy" values="300;350" dur="1s" begin="0.7s" repeatCount="indefinite"/>
    </circle>

    <!-- Processing to Database -->
    <line x1="870" y1="200" x2="1110" y2="270" stroke="#00d4ff" stroke-width="2"/>
    <line x1="870" y1="400" x2="1110" y2="330" stroke="#00d4ff" stroke-width="2"/>

    <!-- Database to Analytics -->
    <line x1="1290" y1="300" x2="1450" y2="300" stroke="#00d4ff" stroke-width="2"/>
  </g>

  <!-- Throughput Metrics -->
  <g transform="translate(960, 700)">
    <rect x="-250" y="-60" width="500" height="120" fill="#1a1a2e" stroke="#00d4ff" stroke-width="2" rx="10"/>
    <text x="0" y="-30" font-family="'Inter', sans-serif" font-size="18" fill="#ffffff" text-anchor="middle">Pipeline Metrics</text>
    <text x="-200" y="0" font-family="'Cascadia Code', monospace" font-size="14" fill="#00ff00">Input: 5.2K msg/s</text>
    <text x="-200" y="25" font-family="'Cascadia Code', monospace" font-size="14" fill="#00ffff">Processing: 4.8K msg/s</text>
    <text x="50" y="0" font-family="'Cascadia Code', monospace" font-size="14" fill="#ffff00">Latency: 142ms</text>
    <text x="50" y="25" font-family="'Cascadia Code', monospace" font-size="14" fill="#ff9900">Queue: 1.2K msgs</text>
  </g>
</svg>`;

  const processDir = path.join(ASSETS_DIR, 'processes');
  await fs.mkdir(processDir, { recursive: true });
  await fs.writeFile(path.join(processDir, 'data-pipeline.svg'), dataPipeline);
  console.log('✅ Created data pipeline template');
}

// Main execution
async function main() {
  console.log('🚀 Starting InfoGraphAI Enhanced Templates Generation - Phase 1');
  console.log('=' .repeat(60));

  try {
    await generateEnhancedCodeEditors();
    await generateEnhancedTerminals();
    await generateInteractiveProcess();
    await generateDataPipeline();

    console.log('=' .repeat(60));
    console.log('✨ Phase 1 Complete! Created:');
    console.log('  - 5 Enhanced Code Editor Templates');
    console.log('  - 5 Enhanced Terminal Templates');
    console.log('  - 1 Interactive Process Template');
    console.log('  - 1 Data Pipeline Template');
    console.log('📁 All templates saved to:', ASSETS_DIR);
  } catch (error) {
    console.error('❌ Error generating templates:', error);
  }
}

main();