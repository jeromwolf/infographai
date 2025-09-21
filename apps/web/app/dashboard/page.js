"use client";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DashboardPage;
const react_1 = __importDefault(require("react"));
const link_1 = __importDefault(require("next/link"));
function DashboardPage() {
    const sections = [
        {
            title: 'Scene Builder',
            description: 'Create professional educational animations with drag-and-drop interface',
            href: '/dashboard/builder',
            icon: '🎨',
            color: 'from-purple-500 to-pink-500',
            features: ['Drag & Drop', 'Real-time Preview', 'Export to Code']
        },
        {
            title: 'Templates',
            description: 'Ready-to-use KodeKloud style templates for various topics',
            href: '/dashboard/templates',
            icon: '📋',
            color: 'from-blue-500 to-cyan-500',
            features: ['Network Diagrams', 'Process Flows', 'Comparisons']
        },
        {
            title: 'Animation Engine',
            description: 'Advanced animation system with command-based control',
            href: '/dashboard/animation',
            icon: '🎬',
            color: 'from-green-500 to-emerald-500',
            features: ['Typewriter Text', 'Path Animations', 'Particle Effects']
        },
        {
            title: 'Analytics',
            description: 'Visual data analytics and dashboard components',
            href: '/dashboard/analytics',
            icon: '📊',
            color: 'from-orange-500 to-red-500',
            features: ['Network Graphs', 'Geo Maps', 'Radial Networks']
        },
        {
            title: 'Generate',
            description: 'AI-powered video generation from topics',
            href: '/dashboard/generate',
            icon: '🤖',
            color: 'from-indigo-500 to-purple-500',
            features: ['AI Scripts', 'Auto Animation', 'Voice Synthesis']
        }
    ];
    return (<div className="min-h-screen bg-gray-950 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              SceneCraft Studio
            </span>
          </h1>
          <p className="text-xl text-gray-400" style={{ fontFamily: 'Kalam, cursive' }}>
            Professional Educational Animation Creation Platform
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <div className="px-4 py-2 bg-gray-800 rounded-lg">
              <span className="text-green-400 font-bold">KodeKloud Style</span>
            </div>
            <div className="px-4 py-2 bg-gray-800 rounded-lg">
              <span className="text-blue-400 font-bold">Hand-Drawn Effects</span>
            </div>
            <div className="px-4 py-2 bg-gray-800 rounded-lg">
              <span className="text-yellow-400 font-bold">Export Ready</span>
            </div>
          </div>
        </div>

        {/* Main Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {sections.map((section) => (<link_1.default key={section.href} href={section.href}>
              <div className="group relative overflow-hidden rounded-2xl bg-gray-900 p-6 transition-all hover:scale-105 hover:shadow-2xl cursor-pointer">
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${section.color} opacity-0 group-hover:opacity-10 transition-opacity`}/>

                {/* Icon */}
                <div className="text-5xl mb-4">{section.icon}</div>

                {/* Title */}
                <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Kalam, cursive' }}>
                  {section.title}
                </h2>

                {/* Description */}
                <p className="text-gray-400 mb-4">
                  {section.description}
                </p>

                {/* Features */}
                <div className="flex flex-wrap gap-2">
                  {section.features.map((feature) => (<span key={feature} className="px-2 py-1 bg-gray-800 rounded-lg text-xs text-gray-300">
                      {feature}
                    </span>))}
                </div>

                {/* Arrow Icon */}
                <div className="absolute bottom-4 right-4 text-3xl opacity-0 group-hover:opacity-100 transition-opacity">
                  →
                </div>
              </div>
            </link_1.default>))}
        </div>

        {/* Quick Stats */}
        <div className="bg-gray-900 rounded-2xl p-8 mb-12">
          <h3 className="text-2xl font-bold mb-6 text-center text-green-400" style={{ fontFamily: 'Kalam, cursive' }}>
            Project Statistics
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">5</div>
              <div className="text-gray-400 text-sm">Template Types</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">15+</div>
              <div className="text-gray-400 text-sm">Animation Effects</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">100%</div>
              <div className="text-gray-400 text-sm">KodeKloud Style</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">∞</div>
              <div className="text-gray-400 text-sm">Possibilities</div>
            </div>
          </div>
        </div>

        {/* Recent Updates */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8">
          <h3 className="text-2xl font-bold mb-6 text-yellow-400" style={{ fontFamily: 'Kalam, cursive' }}>
            Recent Updates
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="text-2xl">✨</div>
              <div>
                <h4 className="font-bold text-green-400">Scene Builder Launch</h4>
                <p className="text-sm text-gray-400">
                  New drag-and-drop interface for creating animated scenes
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="text-2xl">🎨</div>
              <div>
                <h4 className="font-bold text-blue-400">KodeKloud Templates</h4>
                <p className="text-sm text-gray-400">
                  Pre-built templates matching KodeKloud's signature style
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="text-2xl">🚀</div>
              <div>
                <h4 className="font-bold text-purple-400">Animation Engine</h4>
                <p className="text-sm text-gray-400">
                  Command-based animation system with precise timing control
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <link_1.default href="/dashboard/builder">
            <button className="px-8 py-4 bg-gradient-to-r from-green-500 to-blue-500 text-white text-xl font-bold rounded-xl hover:scale-105 transition-transform shadow-lg">
              Start Creating →
            </button>
          </link_1.default>
        </div>
      </div>
    </div>);
}
