"use client";

import React, { useState } from 'react';
import NetworkGraph from '@/components/data-viz/NetworkGraph';
import GeoMap from '@/components/data-viz/GeoMap';
import RadialNetwork from '@/components/data-viz/RadialNetwork';

// Sample data for Network Graph (Palantir Ontology style)
const networkData = {
  nodes: [
    { id: 'palantir', label: 'Palantir', type: 'center' as const },
    { id: 'cia', label: 'CIA', type: 'primary' as const },
    { id: 'fbi', label: 'FBI', type: 'primary' as const },
    { id: 'pentagon', label: '펜타곤', type: 'primary' as const },
    { id: 'nsa', label: '엔지니어', type: 'secondary' as const },
    { id: 'gotham', label: '고담', type: 'secondary' as const },
    { id: 'foundry', label: '파운드리', type: 'secondary' as const },
    { id: 'apollo', label: '아폴로', type: 'secondary' as const },
    { id: 'ai', label: 'AI', type: 'secondary' as const },
    { id: 'ml', label: '머신러닝', type: 'secondary' as const },
    { id: 'analytics', label: '분석', type: 'secondary' as const },
    { id: 'surveillance', label: '감시', type: 'secondary' as const },
    { id: 'ceo', label: '창업자', type: 'person' as const, imageUrl: '/api/placeholder/80/80' },
    { id: 'cto', label: '대학 동문', type: 'person' as const, imageUrl: '/api/placeholder/80/80' },
    { id: 'investor', label: '창업자', type: 'person' as const, imageUrl: '/api/placeholder/80/80' },
    { id: 'gov1', label: '정부 관계자', type: 'person' as const, imageUrl: '/api/placeholder/80/80' },
  ],
  links: [
    { source: 'palantir', target: 'cia', label: '계약' },
    { source: 'palantir', target: 'fbi', label: '파트너십' },
    { source: 'palantir', target: 'pentagon', label: '국방 계약' },
    { source: 'cia', target: 'nsa', label: '정보 공유' },
    { source: 'palantir', target: 'gotham', label: '제품' },
    { source: 'palantir', target: 'foundry', label: '제품' },
    { source: 'palantir', target: 'apollo', label: '운영 제품' },
    { source: 'gotham', target: 'ai', label: '기술' },
    { source: 'foundry', target: 'ml', label: '기술' },
    { source: 'ai', target: 'analytics', label: '적용' },
    { source: 'ml', target: 'surveillance', label: '적용' },
    { source: 'palantir', target: 'ceo' },
    { source: 'palantir', target: 'cto' },
    { source: 'palantir', target: 'investor' },
    { source: 'pentagon', target: 'gov1' },
  ]
};

// Sample data for GeoMap (South China Sea situation)
const geoData = {
  points: [
    { id: 'base1', name: 'Hainan Naval Base', coordinates: [110.3, 18.2] as [number, number], type: 'base' as const },
    { id: 'vessel1', name: 'Fishing Vessel', coordinates: [112.5, 15.5] as [number, number], type: 'target' as const, activity: 'Active' },
    { id: 'vessel2', name: 'Cargo Ship', coordinates: [114.0, 12.0] as [number, number], type: 'target' as const, activity: 'Monitoring' },
    { id: 'route1', name: 'Waypoint Alpha', coordinates: [116.0, 10.5] as [number, number], type: 'route' as const },
    { id: 'route2', name: 'Waypoint Bravo', coordinates: [118.5, 9.0] as [number, number], type: 'route' as const },
    { id: 'base2', name: 'Spratly Outpost', coordinates: [114.0, 10.0] as [number, number], type: 'base' as const },
  ],
  routes: [
    { from: 'base1', to: 'vessel1', type: 'active' as const },
    { from: 'vessel1', to: 'route1', type: 'projected' as const },
    { from: 'route1', to: 'route2', type: 'projected' as const },
    { from: 'base2', to: 'vessel2', type: 'active' as const },
  ]
};

// Sample data for Radial Network
const radialData = {
  centerLabel: '$6.9M',
  nodes: Array.from({ length: 48 }, (_, i) => ({
    id: `node${i}`,
    label: `Contract ${i + 1}`,
    value: Math.floor(Math.random() * 100),
    highlighted: [3, 8, 15, 22, 29, 35, 41].includes(i),
    category: i % 3 === 0 ? 'defense' : i % 3 === 1 ? 'intelligence' : 'commercial'
  }))
};

export default function DataVizPage() {
  const [activeView, setActiveView] = useState<'network' | 'geo' | 'radial'>('network');

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          Advanced Data Visualization Components
        </h1>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setActiveView('network')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeView === 'network'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/50'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Network Graph (Palantir Style)
          </button>
          <button
            onClick={() => setActiveView('geo')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeView === 'geo'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/50'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Geospatial Map
          </button>
          <button
            onClick={() => setActiveView('radial')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeView === 'radial'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/50'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Radial Network
          </button>
        </div>

        {/* Visualization Container */}
        <div className="bg-gray-900 rounded-2xl p-8 shadow-2xl">
          {activeView === 'network' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold mb-4">Ontology Network Visualization</h2>
              <p className="text-gray-400 mb-6">
                Interactive network graph showing relationships between entities.
                Drag nodes to reposition, scroll to zoom, and hover for details.
              </p>
              <NetworkGraph
                nodes={networkData.nodes}
                links={networkData.links}
                width={1100}
                height={700}
              />
            </div>
          )}

          {activeView === 'geo' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold mb-4">Geospatial Intelligence Map</h2>
              <p className="text-gray-400 mb-6">
                Real-time tracking and monitoring of maritime activities.
                Click on points for details, scroll to zoom, and drag to pan.
              </p>
              <GeoMap
                points={geoData.points}
                routes={geoData.routes}
                width={1100}
                height={700}
                center={[114, 12]}
                scale={2000}
              />
            </div>
          )}

          {activeView === 'radial' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold mb-4">Government Contracts Visualization</h2>
              <p className="text-gray-400 mb-6">
                Radial network showing contract relationships and values.
                Highlighted nodes indicate active contracts with pulsing animations.
              </p>
              <RadialNetwork
                centerLabel={radialData.centerLabel}
                nodes={radialData.nodes}
                width={1100}
                height={700}
              />
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-900 p-6 rounded-xl">
            <h3 className="text-xl font-bold mb-3 text-blue-400">Interactive</h3>
            <p className="text-gray-400">
              All visualizations support interactive features including drag, zoom, pan,
              and hover effects for enhanced data exploration.
            </p>
          </div>
          <div className="bg-gray-900 p-6 rounded-xl">
            <h3 className="text-xl font-bold mb-3 text-green-400">Real-time Updates</h3>
            <p className="text-gray-400">
              Components are designed to handle real-time data updates with smooth
              transitions and animations.
            </p>
          </div>
          <div className="bg-gray-900 p-6 rounded-xl">
            <h3 className="text-xl font-bold mb-3 text-purple-400">Customizable</h3>
            <p className="text-gray-400">
              Fully customizable components with adjustable colors, sizes, animations,
              and data structures.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}