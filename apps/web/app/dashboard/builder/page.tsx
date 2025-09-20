"use client";

import React, { useState } from 'react';
import EnhancedSceneBuilder from '@/components/builder/EnhancedSceneBuilder';
import type { DrawCommand } from '@/components/animation/DrawingEngine';
import { presetTemplates, getCategories, getTemplatesByCategory, PresetTemplate } from '@/lib/preset-templates';

export default function BuilderPage() {
  const [savedScenes, setSavedScenes] = useState<{name: string; commands: DrawCommand[]}[]>([]);
  const [currentSceneName, setCurrentSceneName] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const categories = getCategories();

  // Get filtered templates based on selected category and search
  const filteredTemplates = React.useMemo(() => {
    let templates = selectedCategory === 'all'
      ? presetTemplates
      : getTemplatesByCategory(selectedCategory);

    if (searchQuery) {
      templates = templates.filter(t =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return templates;
  }, [selectedCategory, searchQuery]);

  const handleSaveScene = (commands: DrawCommand[]) => {
    if (currentSceneName.trim()) {
      setSavedScenes([...savedScenes, { name: currentSceneName, commands }]);
      setCurrentSceneName('');
      alert(`Scene "${currentSceneName}" saved successfully!`);
    } else {
      alert('Please enter a scene name first');
    }
  };

  const handleLoadPreset = (preset: PresetTemplate) => {
    console.log('Loading preset:', preset.name, preset);
    setSelectedPreset(preset.name);
  };

  // Get the current template commands
  const currentTemplateCommands = React.useMemo(() => {
    if (selectedPreset) {
      const template = presetTemplates.find(p => p.name === selectedPreset);
      console.log('Current template commands:', template?.commands);
      return template?.commands;
    }
    return undefined;
  }, [selectedPreset]);

  const handleExportAll = () => {
    const exportData = {
      scenes: savedScenes,
      exportDate: new Date().toISOString(),
      version: '1.0.0'
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'kodekloud-scenes.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="w-full">
        {/* Header */}
        <div className="text-center py-4">
          <h1 className="text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              KodeKloud Scene Builder
            </span>
          </h1>
          <p className="text-xl text-gray-400" style={{ fontFamily: 'Kalam, cursive' }}>
            50+ Professional Educational Animation Templates
          </p>
        </div>

        {/* Controls Bar */}
        <div className="bg-gray-900 p-3">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Scene Name Input */}
            <div className="flex-1 min-w-[200px]">
              <input
                type="text"
                placeholder="Enter scene name..."
                value={currentSceneName}
                onChange={(e) => setCurrentSceneName(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-green-500 focus:outline-none"
                style={{ fontFamily: 'Kalam, cursive' }}
              />
            </div>

            {/* Search Templates */}
            <div className="min-w-[200px]">
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
              style={{ fontFamily: 'Kalam, cursive' }}
            >
              <option value="all">All Categories ({presetTemplates.length})</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category} ({getTemplatesByCategory(category).length})
                </option>
              ))}
            </select>

            {/* Preset Templates */}
            <select
              onChange={(e) => {
                const preset = presetTemplates.find(p => p.name === e.target.value);
                if (preset) handleLoadPreset(preset);
              }}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-green-500 focus:outline-none"
              style={{ fontFamily: 'Kalam, cursive' }}
            >
              <option value="">Load Template ({filteredTemplates.length} available)...</option>
              {filteredTemplates.map(preset => (
                <option key={preset.name} value={preset.name}>
                  [{preset.category}] {preset.name}
                </option>
              ))}
            </select>

            {/* Export Button */}
            {savedScenes.length > 0 && (
              <button
                onClick={handleExportAll}
                className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 font-bold transition-all"
                style={{ fontFamily: 'Kalam, cursive' }}
              >
                Export All Scenes ({savedScenes.length})
              </button>
            )}
          </div>
        </div>

        {/* Template Gallery */}
        <div className="bg-gray-900 p-4">
          <h3 className="text-2xl font-bold mb-4 text-purple-400" style={{ fontFamily: 'Kalam, cursive' }}>
            Quick Access Template Gallery
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {filteredTemplates.slice(0, 15).map(template => (
              <button
                key={template.name}
                onClick={() => handleLoadPreset(template)}
                className="p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all text-left group"
              >
                <div className="text-xs text-blue-400 mb-1">{template.category}</div>
                <div className="text-sm font-medium text-white group-hover:text-green-400">
                  {template.name}
                </div>
                {template.description && (
                  <div className="text-xs text-gray-500 mt-1">{template.description}</div>
                )}
              </button>
            ))}
          </div>
          {filteredTemplates.length > 15 && (
            <div className="text-center mt-4 text-gray-400">
              + {filteredTemplates.length - 15} more templates available in dropdown
            </div>
          )}
        </div>

        {/* Main Builder */}
        <div className="bg-gray-900">
          <EnhancedSceneBuilder
            initialCommands={currentTemplateCommands}
            onSave={handleSaveScene}
          />
        </div>

        {/* Saved Scenes Gallery */}
        {savedScenes.length > 0 && (
          <div className="mt-8">
            <h2 className="text-3xl font-bold mb-4 text-green-400" style={{ fontFamily: 'Kalam, cursive' }}>
              Saved Scenes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {savedScenes.map((scene, index) => (
                <div key={index} className="bg-gray-900 rounded-lg p-4 border-2 border-gray-800 hover:border-green-500 transition-all">
                  <h3 className="text-lg font-bold mb-2 text-blue-400">{scene.name}</h3>
                  <p className="text-sm text-gray-400">{scene.commands.length} elements</p>
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => setSelectedPreset(scene.name)}
                      className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                    >
                      Load
                    </button>
                    <button
                      onClick={() => {
                        setSavedScenes(savedScenes.filter((_, i) => i !== index));
                      }}
                      className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Category Overview */}
        <div className="mt-8 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6">
          <h3 className="text-2xl font-bold mb-6 text-yellow-400" style={{ fontFamily: 'Kalam, cursive' }}>
            Template Categories
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-xl mb-2 text-blue-400">🚀 DevOps</div>
              <p className="text-sm text-gray-400">
                Docker, Kubernetes, CI/CD, Jenkins, Git workflows
              </p>
            </div>
            <div>
              <div className="text-xl mb-2 text-green-400">☁️ Cloud & Architecture</div>
              <p className="text-sm text-gray-400">
                AWS, Microservices, Load Balancing, Event-driven systems
              </p>
            </div>
            <div>
              <div className="text-xl mb-2 text-purple-400">💾 Database</div>
              <p className="text-sm text-gray-400">
                SQL/NoSQL, Indexing, Sharding, Database design patterns
              </p>
            </div>
            <div>
              <div className="text-xl mb-2 text-yellow-400">💻 Programming</div>
              <p className="text-sm text-gray-400">
                REST APIs, OAuth, MVC, Design patterns, Best practices
              </p>
            </div>
            <div>
              <div className="text-xl mb-2 text-red-400">🌐 Networking</div>
              <p className="text-sm text-gray-400">
                OSI Model, TCP/UDP, DNS, HTTP/HTTPS protocols
              </p>
            </div>
            <div>
              <div className="text-xl mb-2 text-indigo-400">🔒 Security</div>
              <p className="text-sm text-gray-400">
                Authentication, Encryption, Security best practices
              </p>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-6 bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-2xl p-6">
          <h3 className="text-2xl font-bold mb-4 text-cyan-400" style={{ fontFamily: 'Kalam, cursive' }}>
            Pro Tips for Using Templates
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-2xl mb-2">🎨</div>
              <h4 className="font-bold mb-1 text-green-400">Customize Templates</h4>
              <p className="text-sm text-gray-400">
                Load any template and modify colors, positions, and text to match your needs
              </p>
            </div>
            <div>
              <div className="text-2xl mb-2">🔄</div>
              <h4 className="font-bold mb-1 text-blue-400">Combine Templates</h4>
              <p className="text-sm text-gray-400">
                Mix elements from different templates to create unique educational content
              </p>
            </div>
            <div>
              <div className="text-2xl mb-2">💾</div>
              <h4 className="font-bold mb-1 text-purple-400">Save Your Work</h4>
              <p className="text-sm text-gray-400">
                Create your own template library by saving and exporting custom scenes
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}