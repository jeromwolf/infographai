// Architecture Diagram 템플릿 생성 스크립트
const fs = require('fs').promises;
const path = require('path');

// 아키텍처 다이어그램 템플릿 생성 함수들
const templates = {
  // 1. 3-Tier Architecture
  generateThreeTierArchitecture: () => `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <defs>
    <style>
      .tier-box { fill: #f0f4f8; stroke: #4a5568; stroke-width: 2; rx: 8; }
      .tier-title { font-size: 18px; font-weight: bold; fill: #2d3748; }
      .component { fill: #ffffff; stroke: #3182ce; stroke-width: 2; rx: 4; }
      .component-text { font-size: 14px; fill: #2d3748; text-anchor: middle; }
      .arrow { stroke: #3182ce; stroke-width: 2; fill: none; marker-end: url(#arrowhead); }
      @keyframes flowDown {
        0% { stroke-dashoffset: 10; }
        100% { stroke-dashoffset: 0; }
      }
      .animated-arrow {
        stroke-dasharray: 5, 5;
        animation: flowDown 1s linear infinite;
      }
    </style>
    <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <polygon points="0 0, 10 3, 0 6" fill="#3182ce" />
    </marker>
  </defs>
  
  <!-- Presentation Tier -->
  <g id="presentation-tier">
    <rect class="tier-box" x="50" y="50" width="700" height="150"/>
    <text class="tier-title" x="400" y="80">Presentation Tier</text>
    <rect class="component" x="100" y="100" width="120" height="60"/>
    <text class="component-text" x="160" y="135">Web UI</text>
    <rect class="component" x="340" y="100" width="120" height="60"/>
    <text class="component-text" x="400" y="135">Mobile App</text>
    <rect class="component" x="580" y="100" width="120" height="60"/>
    <text class="component-text" x="640" y="135">Admin Panel</text>
  </g>
  
  <!-- Business Logic Tier -->
  <g id="business-tier">
    <rect class="tier-box" x="50" y="250" width="700" height="150"/>
    <text class="tier-title" x="400" y="280">Business Logic Tier</text>
    <rect class="component" x="150" y="300" width="120" height="60"/>
    <text class="component-text" x="210" y="335">API Gateway</text>
    <rect class="component" x="340" y="300" width="120" height="60"/>
    <text class="component-text" x="400" y="335">Services</text>
    <rect class="component" x="530" y="300" width="120" height="60"/>
    <text class="component-text" x="590" y="335">Auth Service</text>
  </g>
  
  <!-- Data Tier -->
  <g id="data-tier">
    <rect class="tier-box" x="50" y="450" width="700" height="150"/>
    <text class="tier-title" x="400" y="480">Data Tier</text>
    <rect class="component" x="150" y="500" width="120" height="60"/>
    <text class="component-text" x="210" y="535">PostgreSQL</text>
    <rect class="component" x="340" y="500" width="120" height="60"/>
    <text class="component-text" x="400" y="535">Redis Cache</text>
    <rect class="component" x="530" y="500" width="120" height="60"/>
    <text class="component-text" x="590" y="535">S3 Storage</text>
  </g>
  
  <!-- Arrows -->
  <path class="arrow animated-arrow" d="M 400 200 L 400 250"/>
  <path class="arrow animated-arrow" d="M 400 400 L 400 450"/>
</svg>`,

  // 2. Microservices Architecture
  generateMicroservicesArchitecture: () => `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <defs>
    <style>
      .service-box { fill: #e6fffa; stroke: #00b5d8; stroke-width: 2; rx: 8; }
      .api-gateway { fill: #fef5e7; stroke: #f39c12; stroke-width: 3; rx: 8; }
      .database { fill: #f0f4f8; stroke: #718096; stroke-width: 2; rx: 4; }
      .client { fill: #fed7d7; stroke: #fc8181; stroke-width: 2; rx: 8; }
      .text { font-size: 12px; fill: #2d3748; text-anchor: middle; }
      .title { font-size: 14px; font-weight: bold; fill: #2d3748; text-anchor: middle; }
      .connection { stroke: #cbd5e0; stroke-width: 1; fill: none; stroke-dasharray: 3,3; }
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
      .service-box { animation: pulse 2s ease-in-out infinite; }
    </style>
  </defs>
  
  <!-- Clients -->
  <rect class="client" x="50" y="50" width="100" height="60"/>
  <text class="title" x="100" y="85">Web Client</text>
  
  <rect class="client" x="200" y="50" width="100" height="60"/>
  <text class="title" x="250" y="85">Mobile App</text>
  
  <rect class="client" x="350" y="50" width="100" height="60"/>
  <text class="title" x="400" y="85">Third Party</text>
  
  <!-- API Gateway -->
  <rect class="api-gateway" x="150" y="180" width="200" height="80"/>
  <text class="title" x="250" y="215">API Gateway</text>
  <text class="text" x="250" y="235">Load Balancer</text>
  
  <!-- Microservices -->
  <g id="services">
    <!-- User Service -->
    <rect class="service-box" x="50" y="330" width="120" height="80"/>
    <text class="title" x="110" y="360">User Service</text>
    <rect class="database" x="60" y="430" width="100" height="40"/>
    <text class="text" x="110" y="455">User DB</text>
    
    <!-- Product Service -->
    <rect class="service-box" x="200" y="330" width="120" height="80"/>
    <text class="title" x="260" y="360">Product Service</text>
    <rect class="database" x="210" y="430" width="100" height="40"/>
    <text class="text" x="260" y="455">Product DB</text>
    
    <!-- Order Service -->
    <rect class="service-box" x="350" y="330" width="120" height="80"/>
    <text class="title" x="410" y="360">Order Service</text>
    <rect class="database" x="360" y="430" width="100" height="40"/>
    <text class="text" x="410" y="455">Order DB</text>
    
    <!-- Payment Service -->
    <rect class="service-box" x="500" y="330" width="120" height="80"/>
    <text class="title" x="560" y="360">Payment Service</text>
    <rect class="database" x="510" y="430" width="100" height="40"/>
    <text class="text" x="560" y="455">Payment DB</text>
    
    <!-- Notification Service -->
    <rect class="service-box" x="650" y="330" width="120" height="80"/>
    <text class="title" x="710" y="360">Notification</text>
    <rect class="database" x="660" y="430" width="100" height="40"/>
    <text class="text" x="710" y="455">Queue</text>
  </g>
  
  <!-- Message Bus -->
  <rect class="api-gateway" x="50" y="510" width="720" height="50"/>
  <text class="title" x="410" y="540">Message Bus (RabbitMQ / Kafka)</text>
  
  <!-- Connections -->
  <path class="connection" d="M 100 110 L 250 180"/>
  <path class="connection" d="M 250 110 L 250 180"/>
  <path class="connection" d="M 400 110 L 250 180"/>
  <path class="connection" d="M 250 260 L 110 330"/>
  <path class="connection" d="M 250 260 L 260 330"/>
  <path class="connection" d="M 250 260 L 410 330"/>
  <path class="connection" d="M 250 260 L 560 330"/>
  <path class="connection" d="M 250 260 L 710 330"/>
</svg>`,

  // 3. Cloud Architecture (AWS Style)
  generateCloudArchitecture: () => `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <defs>
    <style>
      .cloud-region { fill: #f7fafc; stroke: #cbd5e0; stroke-width: 2; stroke-dasharray: 10,5; rx: 10; }
      .availability-zone { fill: #edf2f7; stroke: #a0aec0; stroke-width: 1; stroke-dasharray: 5,3; rx: 5; }
      .service { fill: #ffffff; stroke: #4299e1; stroke-width: 2; rx: 4; }
      .database { fill: #f0fff4; stroke: #48bb78; stroke-width: 2; rx: 4; }
      .storage { fill: #fef5e7; stroke: #f6ad55; stroke-width: 2; rx: 4; }
      .network { fill: #fbb6ce; stroke: #ed64a6; stroke-width: 2; rx: 4; }
      .text { font-size: 11px; fill: #2d3748; text-anchor: middle; }
      .title { font-size: 14px; font-weight: bold; fill: #2d3748; }
      @keyframes cloudFloat {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-5px); }
      }
      .cloud-region { animation: cloudFloat 3s ease-in-out infinite; }
    </style>
  </defs>
  
  <!-- Cloud Region -->
  <rect class="cloud-region" x="30" y="30" width="740" height="540"/>
  <text class="title" x="50" y="60">AWS Region: us-east-1</text>
  
  <!-- VPC -->
  <rect class="availability-zone" x="60" y="100" width="680" height="440"/>
  <text class="title" x="80" y="125">Virtual Private Cloud (VPC)</text>
  
  <!-- Public Subnet -->
  <g id="public-subnet">
    <rect class="availability-zone" x="90" y="150" width="300" height="170"/>
    <text class="text" x="100" y="170">Public Subnet</text>
    
    <rect class="network" x="110" y="190" width="100" height="50"/>
    <text class="text" x="160" y="220">Load Balancer</text>
    
    <rect class="network" x="230" y="190" width="100" height="50"/>
    <text class="text" x="280" y="220">NAT Gateway</text>
    
    <rect class="service" x="110" y="260" width="100" height="50"/>
    <text class="text" x="160" y="290">Web Server</text>
  </g>
  
  <!-- Private Subnet -->
  <g id="private-subnet">
    <rect class="availability-zone" x="420" y="150" width="300" height="170"/>
    <text class="text" x="430" y="170">Private Subnet</text>
    
    <rect class="service" x="440" y="190" width="100" height="50"/>
    <text class="text" x="490" y="220">App Server 1</text>
    
    <rect class="service" x="560" y="190" width="100" height="50"/>
    <text class="text" x="610" y="220">App Server 2</text>
    
    <rect class="service" x="500" y="260" width="100" height="50"/>
    <text class="text" x="550" y="290">Worker Node</text>
  </g>
  
  <!-- Database Subnet -->
  <g id="database-subnet">
    <rect class="availability-zone" x="90" y="340" width="630" height="170"/>
    <text class="text" x="100" y="360">Database Subnet</text>
    
    <rect class="database" x="110" y="380" width="120" height="60"/>
    <text class="text" x="170" y="415">RDS Primary</text>
    
    <rect class="database" x="260" y="380" width="120" height="60"/>
    <text class="text" x="320" y="415">RDS Standby</text>
    
    <rect class="database" x="410" y="380" width="120" height="60"/>
    <text class="text" x="470" y="415">ElastiCache</text>
    
    <rect class="storage" x="560" y="380" width="120" height="60"/>
    <text class="text" x="620" y="415">S3 Bucket</text>
  </g>
  
  <!-- External Services -->
  <rect class="service" x="90" y="460" width="100" height="40"/>
  <text class="text" x="140" y="485">CloudWatch</text>
  
  <rect class="service" x="210" y="460" width="100" height="40"/>
  <text class="text" x="260" y="485">Route 53</text>
  
  <rect class="service" x="330" y="460" width="100" height="40"/>
  <text class="text" x="380" y="485">CloudFront</text>
</svg>`,

  // 4. Docker/Kubernetes Architecture
  generateKubernetesArchitecture: () => `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <defs>
    <style>
      .cluster { fill: #e6f3ff; stroke: #326ce5; stroke-width: 3; rx: 10; }
      .node { fill: #f0f9ff; stroke: #0284c7; stroke-width: 2; rx: 8; }
      .pod { fill: #ffffff; stroke: #10b981; stroke-width: 2; rx: 4; }
      .container { fill: #ecfdf5; stroke: #059669; stroke-width: 1; rx: 2; }
      .service { fill: #fef3c7; stroke: #f59e0b; stroke-width: 2; rx: 4; }
      .ingress { fill: #fce7f3; stroke: #ec4899; stroke-width: 2; rx: 4; }
      .text { font-size: 10px; fill: #1f2937; text-anchor: middle; }
      .title { font-size: 14px; font-weight: bold; fill: #1f2937; }
      @keyframes rotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      .kubernetes-logo {
        animation: rotate 10s linear infinite;
        transform-origin: center;
      }
    </style>
  </defs>
  
  <!-- Kubernetes Cluster -->
  <rect class="cluster" x="50" y="50" width="700" height="500"/>
  <text class="title" x="70" y="80">Kubernetes Cluster</text>
  
  <!-- Master Node -->
  <g id="master-node">
    <rect class="node" x="80" y="100" width="200" height="120"/>
    <text class="title" x="90" y="120">Master Node</text>
    <rect class="service" x="90" y="130" width="80" height="30"/>
    <text class="text" x="130" y="150">API Server</text>
    <rect class="service" x="185" y="130" width="80" height="30"/>
    <text class="text" x="225" y="150">Scheduler</text>
    <rect class="service" x="90" y="170" width="80" height="30"/>
    <text class="text" x="130" y="190">Controller</text>
    <rect class="service" x="185" y="170" width="80" height="30"/>
    <text class="text" x="225" y="190">etcd</text>
  </g>
  
  <!-- Worker Node 1 -->
  <g id="worker-node-1">
    <rect class="node" x="320" y="100" width="200" height="200"/>
    <text class="title" x="330" y="120">Worker Node 1</text>
    
    <!-- Pod 1 -->
    <rect class="pod" x="330" y="130" width="80" height="60"/>
    <text class="text" x="370" y="145">Pod</text>
    <rect class="container" x="335" y="155" width="70" height="25"/>
    <text class="text" x="370" y="172">Container</text>
    
    <!-- Pod 2 -->
    <rect class="pod" x="420" y="130" width="80" height="60"/>
    <text class="text" x="460" y="145">Pod</text>
    <rect class="container" x="425" y="155" width="70" height="25"/>
    <text class="text" x="460" y="172">Container</text>
    
    <!-- Kubelet & Proxy -->
    <rect class="service" x="330" y="200" width="80" height="30"/>
    <text class="text" x="370" y="220">Kubelet</text>
    <rect class="service" x="420" y="200" width="80" height="30"/>
    <text class="text" x="460" y="220">Kube-proxy</text>
    
    <!-- Docker -->
    <rect class="service" x="375" y="240" width="80" height="30"/>
    <text class="text" x="415" y="260">Docker</text>
  </g>
  
  <!-- Worker Node 2 -->
  <g id="worker-node-2">
    <rect class="node" x="540" y="100" width="200" height="200"/>
    <text class="title" x="550" y="120">Worker Node 2</text>
    
    <!-- Pod 3 -->
    <rect class="pod" x="550" y="130" width="80" height="60"/>
    <text class="text" x="590" y="145">Pod</text>
    <rect class="container" x="555" y="155" width="70" height="25"/>
    <text class="text" x="590" y="172">Container</text>
    
    <!-- Pod 4 -->
    <rect class="pod" x="640" y="130" width="80" height="60"/>
    <text class="text" x="680" y="145">Pod</text>
    <rect class="container" x="645" y="155" width="70" height="25"/>
    <text class="text" x="680" y="172">Container</text>
    
    <!-- Kubelet & Proxy -->
    <rect class="service" x="550" y="200" width="80" height="30"/>
    <text class="text" x="590" y="220">Kubelet</text>
    <rect class="service" x="640" y="200" width="80" height="30"/>
    <text class="text" x="680" y="220">Kube-proxy</text>
    
    <!-- Docker -->
    <rect class="service" x="595" y="240" width="80" height="30"/>
    <text class="text" x="635" y="260">Docker</text>
  </g>
  
  <!-- Services Layer -->
  <g id="services">
    <rect class="ingress" x="80" y="330" width="150" height="50"/>
    <text class="text" x="155" y="360">Ingress Controller</text>
    
    <rect class="service" x="250" y="330" width="150" height="50"/>
    <text class="text" x="325" y="360">Load Balancer Service</text>
    
    <rect class="service" x="420" y="330" width="150" height="50"/>
    <text class="text" x="495" y="360">ClusterIP Service</text>
    
    <rect class="service" x="590" y="330" width="150" height="50"/>
    <text class="text" x="665" y="360">NodePort Service</text>
  </g>
  
  <!-- Persistent Storage -->
  <g id="storage">
    <rect class="node" x="80" y="410" width="660" height="100"/>
    <text class="title" x="90" y="430">Persistent Storage</text>
    
    <rect class="service" x="100" y="450" width="120" height="40"/>
    <text class="text" x="160" y="475">PV (NFS)</text>
    
    <rect class="service" x="240" y="450" width="120" height="40"/>
    <text class="text" x="300" y="475">PV (EBS)</text>
    
    <rect class="service" x="380" y="450" width="120" height="40"/>
    <text class="text" x="440" y="475">ConfigMaps</text>
    
    <rect class="service" x="520" y="450" width="120" height="40"/>
    <text class="text" x="580" y="475">Secrets</text>
  </g>
</svg>`,

  // 5. Event-Driven Architecture
  generateEventDrivenArchitecture: () => `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <defs>
    <style>
      .producer { fill: #dcfce7; stroke: #22c55e; stroke-width: 2; rx: 8; }
      .event-bus { fill: #fef3c7; stroke: #f59e0b; stroke-width: 3; rx: 10; }
      .consumer { fill: #ddd6fe; stroke: #9333ea; stroke-width: 2; rx: 8; }
      .event-store { fill: #e0e7ff; stroke: #6366f1; stroke-width: 2; rx: 8; }
      .text { font-size: 12px; fill: #1f2937; text-anchor: middle; }
      .title { font-size: 14px; font-weight: bold; fill: #1f2937; }
      .event-flow { stroke: #94a3b8; stroke-width: 2; fill: none; marker-end: url(#arrow); stroke-dasharray: 5,5; }
      @keyframes eventFlow {
        0% { stroke-dashoffset: 10; }
        100% { stroke-dashoffset: 0; }
      }
      .event-flow { animation: eventFlow 1s linear infinite; }
    </style>
    <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <polygon points="0 0, 10 3, 0 6" fill="#94a3b8" />
    </marker>
  </defs>
  
  <!-- Event Producers -->
  <text class="title" x="100" y="40">Event Producers</text>
  <rect class="producer" x="50" y="60" width="120" height="60"/>
  <text class="text" x="110" y="95">Web API</text>
  
  <rect class="producer" x="50" y="140" width="120" height="60"/>
  <text class="text" x="110" y="175">Mobile API</text>
  
  <rect class="producer" x="50" y="220" width="120" height="60"/>
  <text class="text" x="110" y="255">IoT Devices</text>
  
  <rect class="producer" x="50" y="300" width="120" height="60"/>
  <text class="text" x="110" y="335">Scheduled Jobs</text>
  
  <!-- Event Bus -->
  <rect class="event-bus" x="250" y="150" width="300" height="120"/>
  <text class="title" x="400" y="180">Event Bus / Message Broker</text>
  <text class="text" x="400" y="210">Kafka / RabbitMQ / AWS EventBridge</text>
  <text class="text" x="400" y="235">Topics: orders, users, inventory, payments</text>
  
  <!-- Event Store -->
  <rect class="event-store" x="300" y="320" width="200" height="80"/>
  <text class="title" x="400" y="350">Event Store</text>
  <text class="text" x="400" y="375">Event Sourcing DB</text>
  
  <!-- Event Consumers -->
  <text class="title" x="680" y="40">Event Consumers</text>
  
  <rect class="consumer" x="630" y="60" width="120" height="60"/>
  <text class="text" x="690" y="95">Order Service</text>
  
  <rect class="consumer" x="630" y="140" width="120" height="60"/>
  <text class="text" x="690" y="175">Inventory Service</text>
  
  <rect class="consumer" x="630" y="220" width="120" height="60"/>
  <text class="text" x="690" y="255">Notification Service</text>
  
  <rect class="consumer" x="630" y="300" width="120" height="60"/>
  <text class="text" x="690" y="335">Analytics Service</text>
  
  <rect class="consumer" x="630" y="380" width="120" height="60"/>
  <text class="text" x="690" y="415">Audit Service</text>
  
  <!-- Event Flows -->
  <path class="event-flow" d="M 170 90 L 250 180"/>
  <path class="event-flow" d="M 170 170 L 250 190"/>
  <path class="event-flow" d="M 170 250 L 250 210"/>
  <path class="event-flow" d="M 170 330 L 250 230"/>
  
  <path class="event-flow" d="M 550 180 L 630 90"/>
  <path class="event-flow" d="M 550 190 L 630 170"/>
  <path class="event-flow" d="M 550 210 L 630 250"/>
  <path class="event-flow" d="M 550 230 L 630 330"/>
  <path class="event-flow" d="M 550 240 L 630 410"/>
  
  <path class="event-flow" d="M 400 270 L 400 320"/>
  
  <!-- Legend -->
  <g id="legend" transform="translate(50, 450)">
    <text class="title" x="0" y="0">Event Flow Pattern:</text>
    <text class="text" x="0" y="20">1. Producers publish events</text>
    <text class="text" x="0" y="40">2. Event Bus routes messages</text>
    <text class="text" x="0" y="60">3. Consumers process events</text>
    <text class="text" x="0" y="80">4. Events stored for replay</text>
  </g>
</svg>`,

  // 6. Serverless Architecture
  generateServerlessArchitecture: () => `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <defs>
    <style>
      .api-gateway { fill: #fef3c7; stroke: #f59e0b; stroke-width: 2; rx: 8; }
      .lambda { fill: #fed7e2; stroke: #f43f5e; stroke-width: 2; rx: 8; }
      .database { fill: #d1fae5; stroke: #10b981; stroke-width: 2; rx: 8; }
      .storage { fill: #e0e7ff; stroke: #6366f1; stroke-width: 2; rx: 8; }
      .queue { fill: #fce7f3; stroke: #ec4899; stroke-width: 2; rx: 8; }
      .text { font-size: 11px; fill: #1f2937; text-anchor: middle; }
      .title { font-size: 14px; font-weight: bold; fill: #1f2937; }
      @keyframes scaleUp {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }
      .lambda { animation: scaleUp 2s ease-in-out infinite; }
    </style>
  </defs>
  
  <!-- Client Layer -->
  <text class="title" x="50" y="30">Client Applications</text>
  <rect class="api-gateway" x="50" y="50" width="100" height="50"/>
  <text class="text" x="100" y="80">Web App</text>
  
  <rect class="api-gateway" x="170" y="50" width="100" height="50"/>
  <text class="text" x="220" y="80">Mobile App</text>
  
  <rect class="api-gateway" x="290" y="50" width="100" height="50"/>
  <text class="text" x="340" y="80">IoT Device</text>
  
  <!-- API Gateway -->
  <rect class="api-gateway" x="150" y="140" width="200" height="60"/>
  <text class="title" x="250" y="165">API Gateway</text>
  <text class="text" x="250" y="185">REST / GraphQL / WebSocket</text>
  
  <!-- Lambda Functions -->
  <text class="title" x="100" y="240">Lambda Functions</text>
  
  <rect class="lambda" x="50" y="260" width="110" height="50"/>
  <text class="text" x="105" y="290">Auth Function</text>
  
  <rect class="lambda" x="180" y="260" width="110" height="50"/>
  <text class="text" x="235" y="290">User Function</text>
  
  <rect class="lambda" x="310" y="260" width="110" height="50"/>
  <text class="text" x="365" y="290">Order Function</text>
  
  <rect class="lambda" x="440" y="260" width="110" height="50"/>
  <text class="text" x="495" y="290">Payment Function</text>
  
  <rect class="lambda" x="570" y="260" width="110" height="50"/>
  <text class="text" x="625" y="290">Notification</text>
  
  <!-- Event Sources -->
  <rect class="queue" x="50" y="350" width="120" height="50"/>
  <text class="text" x="110" y="380">SQS Queue</text>
  
  <rect class="queue" x="190" y="350" width="120" height="50"/>
  <text class="text" x="250" y="380">SNS Topic</text>
  
  <rect class="queue" x="330" y="350" width="120" height="50"/>
  <text class="text" x="390" y="380">EventBridge</text>
  
  <rect class="storage" x="470" y="350" width="120" height="50"/>
  <text class="text" x="530" y="380">S3 Events</text>
  
  <rect class="database" x="610" y="350" width="120" height="50"/>
  <text class="text" x="670" y="380">DynamoDB Streams</text>
  
  <!-- Data Layer -->
  <text class="title" x="50" y="440">Managed Services</text>
  
  <rect class="database" x="50" y="460" width="120" height="60"/>
  <text class="text" x="110" y="495">DynamoDB</text>
  
  <rect class="database" x="190" y="460" width="120" height="60"/>
  <text class="text" x="250" y="495">RDS Aurora</text>
  
  <rect class="storage" x="330" y="460" width="120" height="60"/>
  <text class="text" x="390" y="495">S3 Storage</text>
  
  <rect class="storage" x="470" y="460" width="120" height="60"/>
  <text class="text" x="530" y="495">ElastiCache</text>
  
  <rect class="database" x="610" y="460" width="120" height="60"/>
  <text class="text" x="670" y="495">Cognito</text>
  
  <!-- Monitoring -->
  <rect class="api-gateway" x="50" y="540" width="680" height="40"/>
  <text class="text" x="390" y="565">CloudWatch Logs | X-Ray Tracing | CloudWatch Metrics</text>
</svg>`
};

// 템플릿 생성 및 저장
async function generateArchitectureTemplates() {
  console.log('🏗️  Architecture 템플릿 생성 시작...\n');
  
  const baseDir = path.join(__dirname, '..', 'assets', 'templates', 'architecture');
  
  // 디렉토리 생성
  await fs.mkdir(baseDir, { recursive: true });
  
  // 각 템플릿 생성
  const templateGenerators = [
    { name: 'three-tier', generator: templates.generateThreeTierArchitecture, description: '3-Tier Architecture' },
    { name: 'microservices', generator: templates.generateMicroservicesArchitecture, description: 'Microservices Architecture' },
    { name: 'cloud-aws', generator: templates.generateCloudArchitecture, description: 'Cloud Architecture (AWS)' },
    { name: 'kubernetes', generator: templates.generateKubernetesArchitecture, description: 'Kubernetes Architecture' },
    { name: 'event-driven', generator: templates.generateEventDrivenArchitecture, description: 'Event-Driven Architecture' },
    { name: 'serverless', generator: templates.generateServerlessArchitecture, description: 'Serverless Architecture' }
  ];
  
  let count = 0;
  for (const template of templateGenerators) {
    const svgContent = template.generator();
    const filePath = path.join(baseDir, `${template.name}.svg`);
    await fs.writeFile(filePath, svgContent);
    console.log(`✅ ${template.description} 생성 완료`);
    count++;
  }
  
  // 인덱스 파일 생성
  const indexContent = `# Architecture Templates

## Available Templates

${templateGenerators.map(t => `- **${t.name}.svg**: ${t.description}`).join('\n')}

## Usage

These templates can be used as base components for generating educational videos about system architecture.

### Features
- Animated components
- Consistent color scheme
- Scalable SVG format
- Easy to customize

### Animation Classes
- \`.animated-arrow\`: Flow animation for connections
- \`.pulse\`: Pulsing effect for highlights
- \`.cloudFloat\`: Floating animation for cloud components
- \`.scaleUp\`: Scale animation for serverless functions
- \`.eventFlow\`: Event flow animation

## Customization

Each template uses CSS classes for easy styling:
- \`.tier-box\`: Main container boxes
- \`.component\`: Individual components
- \`.service\`: Service elements
- \`.database\`: Database components
- \`.arrow\`: Connection arrows
`;
  
  await fs.writeFile(path.join(baseDir, 'README.md'), indexContent);
  
  console.log(`\n📊 Architecture 템플릿 생성 완료!`);
  console.log(`   총 ${count}개 템플릿 생성`);
  console.log(`   저장 위치: ${baseDir}`);
  
  // 사용 예시 출력
  console.log('\n💡 사용 예시:');
  console.log('   - Docker/Kubernetes 설명 비디오');
  console.log('   - 마이크로서비스 아키텍처 튜토리얼');
  console.log('   - AWS 클라우드 인프라 가이드');
  console.log('   - 이벤트 기반 시스템 설계');
  console.log('   - 서버리스 아키텍처 소개');
}

// 실행
generateArchitectureTemplates().catch(console.error);