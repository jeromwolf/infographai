"use client";

import React, { useState } from 'react';
import DrawingEngine from '@/components/animation/DrawingEngine';

export default function AnimationPage() {
  const [selectedDemo, setSelectedDemo] = useState<'kubernetes' | 'api' | 'database' | 'microservices'>('kubernetes');

  // Demo 1: Kubernetes Architecture
  const kubernetesCommands = [
    { type: 'text' as const, text: 'Kubernetes Architecture', x: 400, y: 50, size: 36, color: '#4ade80' },
    { type: 'wait' as const, duration: 500 },

    // Master Node
    { type: 'rect' as const, x: 100, y: 150, width: 400, height: 300, color: '#3b82f6' },
    { type: 'text' as const, text: 'Master Node', x: 250, y: 130, size: 20, color: '#3b82f6' },

    // API Server
    { type: 'circle' as const, x: 200, y: 250, radius: 40, color: '#fbbf24' },
    { type: 'text' as const, text: 'API Server', x: 160, y: 250, size: 14 },

    // Controller Manager
    { type: 'circle' as const, x: 300, y: 220, radius: 35, color: '#fbbf24' },
    { type: 'text' as const, text: 'Controller', x: 265, y: 220, size: 14 },

    // Scheduler
    { type: 'circle' as const, x: 400, y: 250, radius: 35, color: '#fbbf24' },
    { type: 'text' as const, text: 'Scheduler', x: 365, y: 250, size: 14 },

    // etcd
    { type: 'rect' as const, x: 225, y: 350, width: 150, height: 60, color: '#ef4444', filled: true },
    { type: 'text' as const, text: 'etcd', x: 290, y: 380, size: 18 },

    { type: 'wait' as const, duration: 1000 },

    // Worker Nodes
    { type: 'parallel' as const, commands: [
      { type: 'rect' as const, x: 600, y: 150, width: 180, height: 150, color: '#4ade80' },
      { type: 'text' as const, text: 'Worker Node 1', x: 640, y: 130, size: 16, color: '#4ade80' },
    ]},

    { type: 'parallel' as const, commands: [
      { type: 'rect' as const, x: 600, y: 350, width: 180, height: 150, color: '#4ade80' },
      { type: 'text' as const, text: 'Worker Node 2', x: 640, y: 330, size: 16, color: '#4ade80' },
    ]},

    { type: 'parallel' as const, commands: [
      { type: 'rect' as const, x: 850, y: 250, width: 180, height: 150, color: '#4ade80' },
      { type: 'text' as const, text: 'Worker Node 3', x: 890, y: 230, size: 16, color: '#4ade80' },
    ]},

    // Pods in nodes
    { type: 'circle' as const, x: 650, y: 220, radius: 25, color: '#ffffff', filled: true },
    { type: 'text' as const, text: 'Pod', x: 635, y: 220, size: 12 },
    { type: 'circle' as const, x: 720, y: 220, radius: 25, color: '#ffffff', filled: true },
    { type: 'text' as const, text: 'Pod', x: 705, y: 220, size: 12 },

    { type: 'circle' as const, x: 650, y: 420, radius: 25, color: '#ffffff', filled: true },
    { type: 'text' as const, text: 'Pod', x: 635, y: 420, size: 12 },
    { type: 'circle' as const, x: 720, y: 420, radius: 25, color: '#ffffff', filled: true },
    { type: 'text' as const, text: 'Pod', x: 705, y: 420, size: 12 },

    { type: 'circle' as const, x: 900, y: 320, radius: 25, color: '#ffffff', filled: true },
    { type: 'text' as const, text: 'Pod', x: 885, y: 320, size: 12 },
    { type: 'circle' as const, x: 970, y: 320, radius: 25, color: '#ffffff', filled: true },
    { type: 'text' as const, text: 'Pod', x: 955, y: 320, size: 12 },

    // Connections
    { type: 'arrow' as const, x1: 500, y1: 250, x2: 600, y2: 220, color: '#6b7280' },
    { type: 'arrow' as const, x1: 500, y1: 300, x2: 600, y2: 420, color: '#6b7280' },
    { type: 'arrow' as const, x1: 500, y1: 275, x2: 850, y2: 320, color: '#6b7280' },

    // Highlight master
    { type: 'highlight' as const, x: 100, y: 150, width: 400, height: 300, color: '#fbbf24' },

    { type: 'wait' as const, duration: 1000 },

    // Labels
    { type: 'text' as const, text: '• Control Plane manages cluster', x: 100, y: 500, size: 18, color: '#6b7280' },
    { type: 'text' as const, text: '• Worker nodes run applications', x: 100, y: 530, size: 18, color: '#6b7280' },
    { type: 'text' as const, text: '• Pods are smallest deployable units', x: 100, y: 560, size: 18, color: '#6b7280' },
  ];

  // Demo 2: REST API Flow
  const apiCommands = [
    { type: 'text' as const, text: 'REST API Request Flow', x: 400, y: 50, size: 36, color: '#4ade80' },
    { type: 'wait' as const, duration: 500 },

    // Client
    { type: 'circle' as const, x: 150, y: 300, radius: 50, color: '#3b82f6' },
    { type: 'text' as const, text: 'Client', x: 120, y: 300, size: 18 },

    // HTTP Request
    { type: 'arrow' as const, x1: 200, y1: 300, x2: 350, y2: 300, color: '#4ade80' },
    { type: 'text' as const, text: 'HTTP Request', x: 230, y: 280, size: 14, color: '#4ade80' },

    // API Gateway
    { type: 'rect' as const, x: 350, y: 250, width: 150, height: 100, color: '#fbbf24' },
    { type: 'text' as const, text: 'API Gateway', x: 380, y: 300, size: 16 },

    // Route to services
    { type: 'arrow' as const, x1: 500, y1: 280, x2: 650, y2: 200, color: '#6b7280' },
    { type: 'text' as const, text: 'Route', x: 550, y: 230, size: 12 },

    { type: 'arrow' as const, x1: 500, y1: 300, x2: 650, y2: 300, color: '#6b7280' },
    { type: 'arrow' as const, x1: 500, y1: 320, x2: 650, y2: 400, color: '#6b7280' },

    // Microservices
    { type: 'parallel' as const, commands: [
      { type: 'rect' as const, x: 650, y: 150, width: 120, height: 80, color: '#ef4444' },
      { type: 'text' as const, text: 'User Service', x: 670, y: 190, size: 14 },
    ]},

    { type: 'parallel' as const, commands: [
      { type: 'rect' as const, x: 650, y: 260, width: 120, height: 80, color: '#ef4444' },
      { type: 'text' as const, text: 'Order Service', x: 665, y: 300, size: 14 },
    ]},

    { type: 'parallel' as const, commands: [
      { type: 'rect' as const, x: 650, y: 370, width: 120, height: 80, color: '#ef4444' },
      { type: 'text' as const, text: 'Product Service', x: 660, y: 410, size: 14 },
    ]},

    // Database connections
    { type: 'arrow' as const, x1: 770, y1: 190, x2: 900, y2: 190, color: '#3b82f6' },
    { type: 'arrow' as const, x1: 770, y1: 300, x2: 900, y2: 300, color: '#3b82f6' },
    { type: 'arrow' as const, x1: 770, y1: 410, x2: 900, y2: 410, color: '#3b82f6' },

    // Databases
    { type: 'path' as const, points: [
      { x: 900, y: 170 },
      { x: 950, y: 170 },
      { x: 950, y: 210 },
      { x: 900, y: 210 }
    ], color: '#6b7280', closed: true },
    { type: 'text' as const, text: 'DB', x: 915, y: 190, size: 14 },

    { type: 'path' as const, points: [
      { x: 900, y: 280 },
      { x: 950, y: 280 },
      { x: 950, y: 320 },
      { x: 900, y: 320 }
    ], color: '#6b7280', closed: true },
    { type: 'text' as const, text: 'DB', x: 915, y: 300, size: 14 },

    { type: 'path' as const, points: [
      { x: 900, y: 390 },
      { x: 950, y: 390 },
      { x: 950, y: 430 },
      { x: 900, y: 430 }
    ], color: '#6b7280', closed: true },
    { type: 'text' as const, text: 'DB', x: 915, y: 410, size: 14 },

    // Response flow
    { type: 'wait' as const, duration: 1000 },
    { type: 'arrow' as const, x1: 350, y1: 320, x2: 200, y2: 320, color: '#4ade80' },
    { type: 'text' as const, text: 'HTTP Response', x: 230, y: 340, size: 14, color: '#4ade80' },

    // Key points
    { type: 'text' as const, text: '✓ Gateway handles authentication', x: 100, y: 500, size: 16, color: '#6b7280' },
    { type: 'text' as const, text: '✓ Services are independent', x: 100, y: 530, size: 16, color: '#6b7280' },
    { type: 'text' as const, text: '✓ Each service has own database', x: 100, y: 560, size: 16, color: '#6b7280' },
  ];

  // Demo 3: Database Transaction
  const databaseCommands = [
    { type: 'text' as const, text: 'Database Transaction Flow', x: 380, y: 50, size: 36, color: '#4ade80' },

    // Begin transaction
    { type: 'rect' as const, x: 100, y: 150, width: 200, height: 60, color: '#3b82f6' },
    { type: 'text' as const, text: 'BEGIN TRANSACTION', x: 120, y: 180, size: 16 },

    { type: 'arrow' as const, x1: 300, y1: 180, x2: 400, y2: 180, color: '#4ade80' },

    // Operations
    { type: 'rect' as const, x: 400, y: 150, width: 180, height: 60, color: '#fbbf24' },
    { type: 'text' as const, text: 'UPDATE balance', x: 425, y: 180, size: 16 },

    { type: 'arrow' as const, x1: 490, y1: 210, x2: 490, y2: 270, color: '#4ade80' },

    { type: 'rect' as const, x: 400, y: 270, width: 180, height: 60, color: '#fbbf24' },
    { type: 'text' as const, text: 'INSERT log', x: 445, y: 300, size: 16 },

    { type: 'arrow' as const, x1: 490, y1: 330, x2: 490, y2: 390, color: '#4ade80' },

    // Decision point
    { type: 'path' as const, points: [
      { x: 490, y: 390 },
      { x: 560, y: 440 },
      { x: 490, y: 490 },
      { x: 420, y: 440 }
    ], color: '#ef4444', closed: true },
    { type: 'text' as const, text: 'Success?', x: 455, y: 440, size: 16 },

    // Success path
    { type: 'arrow' as const, x1: 560, y1: 440, x2: 700, y2: 440, color: '#22c55e' },
    { type: 'rect' as const, x: 700, y: 410, width: 150, height: 60, color: '#22c55e' },
    { type: 'text' as const, text: 'COMMIT', x: 745, y: 440, size: 18 },

    // Failure path
    { type: 'arrow' as const, x1: 420, y1: 440, x2: 280, y2: 440, color: '#ef4444' },
    { type: 'rect' as const, x: 180, y: 410, width: 150, height: 60, color: '#ef4444' },
    { type: 'text' as const, text: 'ROLLBACK', x: 215, y: 440, size: 18 },

    // Database state
    { type: 'wait' as const, duration: 1000 },
    { type: 'circle' as const, x: 950, y: 300, radius: 80, color: '#6b7280' },
    { type: 'text' as const, text: 'Database', x: 910, y: 300, size: 18 },

    // Highlight ACID properties
    { type: 'text' as const, text: 'ACID Properties:', x: 100, y: 550, size: 20, color: '#4ade80' },
    { type: 'text' as const, text: 'A - Atomicity', x: 300, y: 550, size: 16, color: '#6b7280' },
    { type: 'text' as const, text: 'C - Consistency', x: 450, y: 550, size: 16, color: '#6b7280' },
    { type: 'text' as const, text: 'I - Isolation', x: 600, y: 550, size: 16, color: '#6b7280' },
    { type: 'text' as const, text: 'D - Durability', x: 750, y: 550, size: 16, color: '#6b7280' },
  ];

  // Demo 4: Microservices Communication
  const microservicesCommands = [
    { type: 'text' as const, text: 'Microservices Communication', x: 350, y: 50, size: 36, color: '#4ade80' },

    // Service Mesh
    { type: 'circle' as const, x: 600, y: 350, radius: 250, color: '#374151' },
    { type: 'text' as const, text: 'Service Mesh', x: 540, y: 150, size: 20, color: '#6b7280' },

    // Services
    { type: 'circle' as const, x: 500, y: 300, radius: 40, color: '#3b82f6', filled: true },
    { type: 'text' as const, text: 'Auth', x: 480, y: 300, size: 14 },

    { type: 'circle' as const, x: 700, y: 300, radius: 40, color: '#fbbf24', filled: true },
    { type: 'text' as const, text: 'API', x: 685, y: 300, size: 14 },

    { type: 'circle' as const, x: 600, y: 450, radius: 40, color: '#ef4444', filled: true },
    { type: 'text' as const, text: 'DB', x: 585, y: 450, size: 14 },

    { type: 'circle' as const, x: 450, y: 400, radius: 40, color: '#22c55e', filled: true },
    { type: 'text' as const, text: 'Cache', x: 425, y: 400, size: 14 },

    { type: 'circle' as const, x: 750, y: 400, radius: 40, color: '#a855f7', filled: true },
    { type: 'text' as const, text: 'Queue', x: 725, y: 400, size: 14 },

    // Connections with labels
    { type: 'arrow' as const, x1: 540, y1: 300, x2: 660, y2: 300, color: '#4ade80' },
    { type: 'text' as const, text: 'gRPC', x: 590, y: 285, size: 12 },

    { type: 'arrow' as const, x1: 700, y1: 340, x2: 630, y2: 420, color: '#4ade80' },
    { type: 'text' as const, text: 'SQL', x: 665, y: 380, size: 12 },

    { type: 'arrow' as const, x1: 500, y1: 340, x2: 470, y2: 370, color: '#4ade80' },
    { type: 'text' as const, text: 'Redis', x: 460, y: 355, size: 12 },

    { type: 'arrow' as const, x1: 730, y1: 330, x2: 750, y2: 360, color: '#4ade80' },
    { type: 'text' as const, text: 'Pub/Sub', x: 750, y: 345, size: 12 },

    // Load balancer
    { type: 'rect' as const, x: 550, y: 200, width: 100, height: 40, color: '#ffffff' },
    { type: 'text' as const, text: 'LB', x: 590, y: 220, size: 16 },

    { type: 'arrow' as const, x1: 600, y1: 240, x2: 500, y2: 260, color: '#6b7280' },
    { type: 'arrow' as const, x1: 600, y1: 240, x2: 700, y2: 260, color: '#6b7280' },

    // Highlight service mesh benefits
    { type: 'wait' as const, duration: 1000 },
    { type: 'highlight' as const, x: 350, y: 100, width: 500, height: 500, color: '#4ade80' },

    { type: 'text' as const, text: '• Service discovery', x: 100, y: 300, size: 16, color: '#6b7280' },
    { type: 'text' as const, text: '• Load balancing', x: 100, y: 330, size: 16, color: '#6b7280' },
    { type: 'text' as const, text: '• Circuit breaking', x: 100, y: 360, size: 16, color: '#6b7280' },
    { type: 'text' as const, text: '• Distributed tracing', x: 100, y: 390, size: 16, color: '#6b7280' },
  ];

  const getDemoCommands = () => {
    switch (selectedDemo) {
      case 'kubernetes': return kubernetesCommands;
      case 'api': return apiCommands;
      case 'database': return databaseCommands;
      case 'microservices': return microservicesCommands;
      default: return kubernetesCommands;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              Drawing Animation Engine
            </span>
          </h1>
          <p className="text-xl text-gray-400" style={{ fontFamily: 'Kalam, cursive' }}>
            KodeKloud-style animated technical diagrams
          </p>
        </div>

        {/* Demo Selector */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setSelectedDemo('kubernetes')}
            className={`px-6 py-3 rounded-xl font-bold text-lg transition-all transform hover:scale-105 ${
              selectedDemo === 'kubernetes'
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
            style={{ fontFamily: 'Kalam, cursive' }}
          >
            Kubernetes
          </button>
          <button
            onClick={() => setSelectedDemo('api')}
            className={`px-6 py-3 rounded-xl font-bold text-lg transition-all transform hover:scale-105 ${
              selectedDemo === 'api'
                ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
            style={{ fontFamily: 'Kalam, cursive' }}
          >
            REST API
          </button>
          <button
            onClick={() => setSelectedDemo('database')}
            className={`px-6 py-3 rounded-xl font-bold text-lg transition-all transform hover:scale-105 ${
              selectedDemo === 'database'
                ? 'bg-gradient-to-r from-yellow-500 to-red-500 text-white shadow-lg'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
            style={{ fontFamily: 'Kalam, cursive' }}
          >
            Database
          </button>
          <button
            onClick={() => setSelectedDemo('microservices')}
            className={`px-6 py-3 rounded-xl font-bold text-lg transition-all transform hover:scale-105 ${
              selectedDemo === 'microservices'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
            style={{ fontFamily: 'Kalam, cursive' }}
          >
            Microservices
          </button>
        </div>

        {/* Animation Display */}
        <div className="bg-gray-900 rounded-2xl p-8 shadow-2xl">
          <DrawingEngine
            key={selectedDemo}
            commands={getDemoCommands()}
            width={1100}
            height={600}
            speed={1.5}
            autoPlay={true}
            loop={true}
            onComplete={() => console.log('Animation complete!')}
          />
        </div>

        {/* Features */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-900 p-6 rounded-xl border-2 border-green-500/20">
            <h3 className="text-xl font-bold mb-3 text-green-400"
                style={{ fontFamily: 'Kalam, cursive' }}>
              Command-Based Animation
            </h3>
            <p className="text-gray-400">
              Define animations as a sequence of drawing commands - lines, shapes, text, and more.
            </p>
          </div>
          <div className="bg-gray-900 p-6 rounded-xl border-2 border-blue-500/20">
            <h3 className="text-xl font-bold mb-3 text-blue-400"
                style={{ fontFamily: 'Kalam, cursive' }}>
              Perfect Timing Control
            </h3>
            <p className="text-gray-400">
              Precise control over animation speed, delays, and parallel execution of commands.
            </p>
          </div>
          <div className="bg-gray-900 p-6 rounded-xl border-2 border-purple-500/20">
            <h3 className="text-xl font-bold mb-3 text-purple-400"
                style={{ fontFamily: 'Kalam, cursive' }}>
              KodeKloud Style
            </h3>
            <p className="text-gray-400">
              Authentic hand-drawn effect with wobble, organic lines, and professional aesthetics.
            </p>
          </div>
        </div>

        {/* Code Example */}
        <div className="mt-12 bg-gray-900 rounded-xl p-6">
          <h3 className="text-2xl font-bold mb-4 text-green-400"
              style={{ fontFamily: 'Kalam, cursive' }}>
            How It Works
          </h3>
          <pre className="bg-black p-4 rounded-lg overflow-x-auto">
            <code className="text-sm text-gray-300">{`const commands = [
  { type: 'text', text: 'Hello World', x: 100, y: 50 },
  { type: 'circle', x: 200, y: 200, radius: 50, color: '#4ade80' },
  { type: 'arrow', x1: 100, y1: 100, x2: 300, y2: 100 },
  { type: 'wait', duration: 1000 },
  { type: 'parallel', commands: [
    { type: 'rect', x: 50, y: 50, width: 100, height: 80 },
    { type: 'text', text: 'Parallel!', x: 100, y: 90 }
  ]}
];

<DrawingEngine
  commands={commands}
  speed={1.5}
  autoPlay={true}
  loop={true}
/>`}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}