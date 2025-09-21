"use client";

import React, { useState, useRef, useEffect } from 'react';
import DrawingEngine from '@/components/animation/DrawingEngine';

// Export DrawCommand type for use in other components
export type DrawCommand =
  | { type: 'line'; x1: number; y1: number; x2: number; y2: number; color?: string; width?: number }
  | { type: 'rect'; x: number; y: number; width: number; height: number; color?: string; filled?: boolean }
  | { type: 'circle'; x: number; y: number; radius: number; color?: string; filled?: boolean }
  | { type: 'text'; text: string; x: number; y: number; size?: number; color?: string }
  | { type: 'arrow'; x1: number; y1: number; x2: number; y2: number; color?: string };

// Asset types for the builder
interface Asset {
  id: string;
  type: 'text' | 'rect' | 'circle' | 'arrow' | 'line';
  label: string;
  icon: string;
  defaultProps?: any;
}

// Scene element (placed asset)
interface SceneElement {
  id: string;
  type: string;
  x: number;
  y: number;
  props: any;
  label: string;
}

// Available assets in the sidebar
const AVAILABLE_ASSETS: Asset[] = [
  // Text elements
  {
    id: 'text',
    type: 'text',
    label: 'Text',
    icon: 'T',
    defaultProps: { text: 'Sample Text', size: 24, color: '#ffffff' }
  },
  {
    id: 'title',
    type: 'text',
    label: 'Title',
    icon: 'H',
    defaultProps: { text: 'Title Text', size: 42, color: '#4ade80' }
  },
  {
    id: 'label',
    type: 'text',
    label: 'Label',
    icon: 'L',
    defaultProps: { text: 'Label', size: 16, color: '#9ca3af' }
  },

  // Shapes
  {
    id: 'rect',
    type: 'rect',
    label: 'Rectangle',
    icon: '□',
    defaultProps: { width: 150, height: 80, color: '#3b82f6', filled: false }
  },
  {
    id: 'rect-filled',
    type: 'rect',
    label: 'Filled Rect',
    icon: '■',
    defaultProps: { width: 150, height: 80, color: '#3b82f6', filled: true }
  },
  {
    id: 'circle',
    type: 'circle',
    label: 'Circle',
    icon: '○',
    defaultProps: { radius: 40, color: '#4ade80', filled: false }
  },
  {
    id: 'circle-filled',
    type: 'circle',
    label: 'Filled Circle',
    icon: '●',
    defaultProps: { radius: 40, color: '#4ade80', filled: true }
  },

  // Connectors
  {
    id: 'arrow',
    type: 'arrow',
    label: 'Arrow',
    icon: '→',
    defaultProps: { x2: 100, y2: 0, color: '#fbbf24' }
  },
  {
    id: 'arrow-down',
    type: 'arrow',
    label: 'Arrow Down',
    icon: '↓',
    defaultProps: { x2: 0, y2: 100, color: '#fbbf24' }
  },
  {
    id: 'arrow-diagonal',
    type: 'arrow',
    label: 'Arrow Diagonal',
    icon: '↘',
    defaultProps: { x2: 100, y2: 100, color: '#fbbf24' }
  },
  {
    id: 'line',
    type: 'line',
    label: 'Line',
    icon: '—',
    defaultProps: { x2: 100, y2: 0, color: '#6b7280', width: 3 }
  },
  {
    id: 'line-vertical',
    type: 'line',
    label: 'Vertical Line',
    icon: '|',
    defaultProps: { x2: 0, y2: 100, color: '#6b7280', width: 3 }
  },

  // Special KodeKloud elements
  {
    id: 'server',
    type: 'rect',
    label: 'Server',
    icon: '🖥',
    defaultProps: { width: 120, height: 100, color: '#3b82f6', filled: true }
  },
  {
    id: 'database',
    type: 'rect',
    label: 'Database',
    icon: '🗄',
    defaultProps: { width: 100, height: 120, color: '#ef4444', filled: true }
  },
  {
    id: 'cloud',
    type: 'rect',
    label: 'Cloud',
    icon: '☁',
    defaultProps: { width: 160, height: 100, color: '#9ca3af', filled: false }
  },
  {
    id: 'container',
    type: 'rect',
    label: 'Container',
    icon: '📦',
    defaultProps: { width: 140, height: 90, color: '#3b82f6', filled: false }
  },
  {
    id: 'user',
    type: 'circle',
    label: 'User',
    icon: '👤',
    defaultProps: { radius: 35, color: '#4ade80', filled: true }
  },
  {
    id: 'api',
    type: 'rect',
    label: 'API',
    icon: '🔌',
    defaultProps: { width: 130, height: 80, color: '#fbbf24', filled: true }
  },
];

interface SceneBuilderProps {
  initialCommands?: DrawCommand[];
  onSave?: (commands: DrawCommand[]) => void;
}

export default function SceneBuilder({ initialCommands, onSave }: SceneBuilderProps = {}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [elements, setElements] = useState<SceneElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<SceneElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedAsset, setDraggedAsset] = useState<Asset | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [exportCode, setExportCode] = useState('');

  // KodeKloud colors
  const COLORS = {
    bg: '#0a0a0a',
    primary: '#4ade80',
    white: '#ffffff',
    blue: '#3b82f6',
    yellow: '#fbbf24',
    red: '#ef4444',
    gray: '#6b7280'
  };

  // Draw scene on canvas (edit mode)
  const drawScene = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = COLORS.bg;
    ctx.fillRect(0, 0, 900, 600);

    // Set default styles
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Draw grid
    ctx.strokeStyle = '#1f2937';
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= 900; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 600);
      ctx.stroke();
    }
    for (let y = 0; y <= 600; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(900, y);
      ctx.stroke();
    }

    // Draw elements
    elements.forEach(element => {
      const isSelected = selectedElement?.id === element.id;

      ctx.save();

      switch (element.type) {
        case 'text':
          ctx.font = `${element.props.size}px Kalam, cursive`;
          ctx.fillStyle = element.props.color;
          ctx.fillText(element.props.text, element.x, element.y);
          break;

        case 'rect':
          ctx.strokeStyle = element.props.color;
          ctx.lineWidth = 3;
          if (element.props.filled) {
            ctx.fillStyle = element.props.color;
            ctx.globalAlpha = 0.3;
            ctx.fillRect(element.x, element.y, element.props.width, element.props.height);
            ctx.globalAlpha = 1;
          }
          ctx.strokeRect(element.x, element.y, element.props.width, element.props.height);
          break;

        case 'circle':
          ctx.strokeStyle = element.props.color;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(element.x, element.y, element.props.radius, 0, Math.PI * 2);
          if (element.props.filled) {
            ctx.fillStyle = element.props.color;
            ctx.globalAlpha = 0.3;
            ctx.fill();
            ctx.globalAlpha = 1;
          }
          ctx.stroke();
          break;

        case 'arrow':
          ctx.strokeStyle = element.props.color;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(element.x, element.y);
          ctx.lineTo(element.x + element.props.x2, element.y + element.props.y2);
          ctx.stroke();

          // Arrowhead
          const angle = Math.atan2(element.props.y2, element.props.x2);
          const headLength = 12;
          ctx.beginPath();
          ctx.moveTo(
            element.x + element.props.x2,
            element.y + element.props.y2
          );
          ctx.lineTo(
            element.x + element.props.x2 - headLength * Math.cos(angle - Math.PI / 6),
            element.y + element.props.y2 - headLength * Math.sin(angle - Math.PI / 6)
          );
          ctx.moveTo(
            element.x + element.props.x2,
            element.y + element.props.y2
          );
          ctx.lineTo(
            element.x + element.props.x2 - headLength * Math.cos(angle + Math.PI / 6),
            element.y + element.props.y2 - headLength * Math.sin(angle + Math.PI / 6)
          );
          ctx.stroke();
          break;

        case 'line':
          ctx.strokeStyle = element.props.color;
          ctx.lineWidth = element.props.width || 3;
          ctx.beginPath();
          ctx.moveTo(element.x, element.y);
          ctx.lineTo(element.x + element.props.x2, element.y + element.props.y2);
          ctx.stroke();
          break;
      }

      // Draw selection box
      if (isSelected) {
        ctx.strokeStyle = COLORS.primary;
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        let bounds = { x: element.x - 10, y: element.y - 10, w: 20, h: 20 };

        if (element.type === 'rect') {
          bounds = {
            x: element.x - 5,
            y: element.y - 5,
            w: element.props.width + 10,
            h: element.props.height + 10
          };
        } else if (element.type === 'circle') {
          bounds = {
            x: element.x - element.props.radius - 5,
            y: element.y - element.props.radius - 5,
            w: element.props.radius * 2 + 10,
            h: element.props.radius * 2 + 10
          };
        }

        ctx.strokeRect(bounds.x, bounds.y, bounds.w, bounds.h);
        ctx.setLineDash([]);
      }

      ctx.restore();
    });
  };

  // Handle canvas click
  const handleCanvasClick = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicking on an element
    let clickedElement: SceneElement | null = null;

    elements.forEach(element => {
      let hit = false;

      if (element.type === 'rect') {
        hit = x >= element.x && x <= element.x + element.props.width &&
              y >= element.y && y <= element.y + element.props.height;
      } else if (element.type === 'circle') {
        const dx = x - element.x;
        const dy = y - element.y;
        hit = Math.sqrt(dx * dx + dy * dy) <= element.props.radius;
      } else if (element.type === 'text') {
        // Rough approximation for text
        hit = x >= element.x - 10 && x <= element.x + 100 &&
              y >= element.y - 20 && y <= element.y + 20;
      }

      if (hit) clickedElement = element;
    });

    setSelectedElement(clickedElement);
  };

  // Handle drag start
  const handleDragStart = (e: React.DragEvent, asset: Asset) => {
    setDraggedAsset(asset);
    setIsDragging(true);
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Handle drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();

    if (!draggedAsset || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newElement: SceneElement = {
      id: `element-${Date.now()}`,
      type: draggedAsset.type,
      x: Math.round(x / 50) * 50, // Snap to grid
      y: Math.round(y / 50) * 50,
      props: { ...draggedAsset.defaultProps },
      label: draggedAsset.label
    };

    setElements([...elements, newElement]);
    setDraggedAsset(null);
    setIsDragging(false);
  };

  // Delete selected element
  const deleteSelectedElement = () => {
    if (selectedElement) {
      setElements(elements.filter(el => el.id !== selectedElement.id));
      setSelectedElement(null);
    }
  };

  // Update element property
  const updateElementProp = (propName: string, value: any) => {
    if (!selectedElement) return;

    setElements(elements.map(el => {
      if (el.id === selectedElement.id) {
        return {
          ...el,
          props: { ...el.props, [propName]: value }
        };
      }
      return el;
    }));

    setSelectedElement({
      ...selectedElement,
      props: { ...selectedElement.props, [propName]: value }
    });
  };

  // Generate animation commands
  const generateCommands = () => {
    return elements.map(element => {
      const command: any = { type: element.type };

      if (element.type === 'text') {
        return { ...command, text: element.props.text, x: element.x, y: element.y, size: element.props.size, color: element.props.color };
      } else if (element.type === 'rect') {
        return { ...command, x: element.x, y: element.y, width: element.props.width, height: element.props.height, color: element.props.color, filled: element.props.filled };
      } else if (element.type === 'circle') {
        return { ...command, x: element.x, y: element.y, radius: element.props.radius, color: element.props.color, filled: element.props.filled };
      } else if (element.type === 'arrow') {
        return { ...command, x1: element.x, y1: element.y, x2: element.x + element.props.x2, y2: element.y + element.props.y2, color: element.props.color };
      } else if (element.type === 'line') {
        return { ...command, x1: element.x, y1: element.y, x2: element.x + element.props.x2, y2: element.y + element.props.y2, color: element.props.color, width: element.props.width };
      }

      return command;
    });
  };

  // Export as code
  const exportAsCode = () => {
    const commands = generateCommands();
    const code = `const animationCommands = ${JSON.stringify(commands, null, 2)};

// Use with DrawingEngine component
<DrawingEngine
  commands={animationCommands}
  width={900}
  height={600}
  speed={1}
  autoPlay={true}
/>`;

    setExportCode(code);
  };

  // Save commands
  const handleSave = () => {
    if (onSave) {
      const commands = generateCommands();
      onSave(commands);
    }
  };

  // Load initial commands when provided
  useEffect(() => {
    if (initialCommands && initialCommands.length > 0) {
      const newElements: SceneElement[] = initialCommands.map((cmd, index) => {
        const id = `element-${Date.now()}-${index}`;

        if (cmd.type === 'text') {
          return {
            id,
            type: 'text',
            x: cmd.x,
            y: cmd.y,
            props: { text: cmd.text, size: cmd.size || 24, color: cmd.color || '#ffffff' },
            label: 'Text'
          };
        } else if (cmd.type === 'rect') {
          return {
            id,
            type: 'rect',
            x: cmd.x,
            y: cmd.y,
            props: { width: cmd.width, height: cmd.height, color: cmd.color || '#3b82f6', filled: cmd.filled || false },
            label: 'Rectangle'
          };
        } else if (cmd.type === 'circle') {
          return {
            id,
            type: 'circle',
            x: cmd.x,
            y: cmd.y,
            props: { radius: cmd.radius, color: cmd.color || '#4ade80', filled: cmd.filled || false },
            label: 'Circle'
          };
        } else if (cmd.type === 'arrow') {
          return {
            id,
            type: 'arrow',
            x: cmd.x1,
            y: cmd.y1,
            props: { x2: cmd.x2 - cmd.x1, y2: cmd.y2 - cmd.y1, color: cmd.color || '#fbbf24' },
            label: 'Arrow'
          };
        } else if (cmd.type === 'line') {
          return {
            id,
            type: 'line',
            x: cmd.x1,
            y: cmd.y1,
            props: { x2: cmd.x2 - cmd.x1, y2: cmd.y2 - cmd.y1, color: cmd.color || '#6b7280', width: cmd.width || 3 },
            label: 'Line'
          };
        }
        return null;
      }).filter(el => el !== null) as SceneElement[];

      setElements(newElements);
    }
  }, [initialCommands]);

  // Redraw when elements change
  useEffect(() => {
    if (!isPreviewMode) {
      drawScene();
    }
  }, [elements, selectedElement, isPreviewMode]);

  return (
    <div className="flex h-screen bg-gray-950">
      {/* Sidebar - Assets */}
      <div className="w-80 bg-gray-900 border-r border-gray-800 p-4 overflow-y-auto">
        <h3 className="text-xl font-bold text-green-400 mb-4"
            style={{ fontFamily: 'Kalam, cursive' }}>
          KodeKloud Assets
        </h3>

        {/* Text Elements */}
        <div className="mb-4">
          <h4 className="text-sm font-bold text-blue-400 mb-2">Text Elements</h4>
          <div className="grid grid-cols-3 gap-2">
            {AVAILABLE_ASSETS.filter(a => a.id.includes('text') || a.id.includes('title') || a.id.includes('label')).map(asset => (
              <div
                key={asset.id}
                draggable
                onDragStart={(e) => handleDragStart(e, asset)}
                className="bg-gray-800 p-3 rounded-lg cursor-move hover:bg-gray-700 transition-colors text-center"
                title={asset.label}
              >
                <span className="text-xl">{asset.icon}</span>
                <span className="text-[10px] block text-gray-400 mt-1">{asset.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Shapes */}
        <div className="mb-4">
          <h4 className="text-sm font-bold text-yellow-400 mb-2">Shapes</h4>
          <div className="grid grid-cols-3 gap-2">
            {AVAILABLE_ASSETS.filter(a => (a.type === 'rect' || a.type === 'circle') && !['server', 'database', 'cloud', 'container', 'user', 'api'].includes(a.id)).map(asset => (
              <div
                key={asset.id}
                draggable
                onDragStart={(e) => handleDragStart(e, asset)}
                className="bg-gray-800 p-3 rounded-lg cursor-move hover:bg-gray-700 transition-colors text-center"
                title={asset.label}
              >
                <span className="text-xl">{asset.icon}</span>
                <span className="text-[10px] block text-gray-400 mt-1">{asset.label.split(' ')[0]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Connectors */}
        <div className="mb-4">
          <h4 className="text-sm font-bold text-purple-400 mb-2">Connectors</h4>
          <div className="grid grid-cols-3 gap-2">
            {AVAILABLE_ASSETS.filter(a => a.type === 'arrow' || a.type === 'line').map(asset => (
              <div
                key={asset.id}
                draggable
                onDragStart={(e) => handleDragStart(e, asset)}
                className="bg-gray-800 p-3 rounded-lg cursor-move hover:bg-gray-700 transition-colors text-center"
                title={asset.label}
              >
                <span className="text-xl">{asset.icon}</span>
                <span className="text-[10px] block text-gray-400 mt-1">{asset.label.split(' ')[0]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* IT Components */}
        <div className="mb-4">
          <h4 className="text-sm font-bold text-red-400 mb-2">IT Components</h4>
          <div className="grid grid-cols-2 gap-2">
            {AVAILABLE_ASSETS.filter(a => ['server', 'database', 'cloud', 'container', 'user', 'api'].includes(a.id)).map(asset => (
              <div
                key={asset.id}
                draggable
                onDragStart={(e) => handleDragStart(e, asset)}
                className="bg-gray-800 p-3 rounded-lg cursor-move hover:bg-gray-700 transition-colors"
                title={asset.label}
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{asset.icon}</span>
                  <span className="text-xs text-gray-300">{asset.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-bold text-blue-400 mb-4"
              style={{ fontFamily: 'Kalam, cursive' }}>
            Scene Elements
          </h3>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {elements.map(element => (
              <div
                key={element.id}
                onClick={() => setSelectedElement(element)}
                className={`p-2 rounded cursor-pointer text-sm ${
                  selectedElement?.id === element.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {element.label} #{element.id.slice(-4)}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="bg-gray-900 border-b border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className={`px-4 py-2 rounded-lg font-bold ${
                  isPreviewMode
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
                style={{ fontFamily: 'Kalam, cursive' }}
              >
                {isPreviewMode ? 'Edit Mode' : 'Preview'}
              </button>

              <button
                onClick={() => setElements([])}
                className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 font-bold"
                style={{ fontFamily: 'Kalam, cursive' }}
              >
                Clear All
              </button>

              <button
                onClick={exportAsCode}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-bold"
                style={{ fontFamily: 'Kalam, cursive' }}
              >
                Export Code
              </button>
              {onSave && (
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 font-bold"
                  style={{ fontFamily: 'Kalam, cursive' }}
                >
                  Save Scene
                </button>
              )}
            </div>

            {selectedElement && (
              <button
                onClick={deleteSelectedElement}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-bold"
                style={{ fontFamily: 'Kalam, cursive' }}
              >
                Delete Element
              </button>
            )}
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 flex items-center justify-center p-8 bg-gray-950">
          {isPreviewMode ? (
            <DrawingEngine
              commands={generateCommands()}
              width={900}
              height={600}
              speed={1}
              autoPlay={true}
              loop={true}
            />
          ) : (
            <canvas
              ref={canvasRef}
              width={900}
              height={600}
              onClick={handleCanvasClick}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="rounded-lg shadow-2xl cursor-crosshair"
              style={{ backgroundColor: COLORS.bg }}
            />
          )}
        </div>
      </div>

      {/* Properties Panel */}
      {selectedElement && !isPreviewMode && (
        <div className="w-64 bg-gray-900 border-l border-gray-800 p-4">
          <h3 className="text-lg font-bold text-yellow-400 mb-4"
              style={{ fontFamily: 'Kalam, cursive' }}>
            Properties
          </h3>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400">Type</label>
              <div className="text-white">{selectedElement.type}</div>
            </div>

            <div>
              <label className="text-sm text-gray-400">Position</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={selectedElement.x}
                  onChange={(e) => {
                    const newX = parseInt(e.target.value);
                    setElements(elements.map(el =>
                      el.id === selectedElement.id ? { ...el, x: newX } : el
                    ));
                    setSelectedElement({ ...selectedElement, x: newX });
                  }}
                  className="w-20 p-1 bg-gray-800 text-white rounded"
                  placeholder="X"
                />
                <input
                  type="number"
                  value={selectedElement.y}
                  onChange={(e) => {
                    const newY = parseInt(e.target.value);
                    setElements(elements.map(el =>
                      el.id === selectedElement.id ? { ...el, y: newY } : el
                    ));
                    setSelectedElement({ ...selectedElement, y: newY });
                  }}
                  className="w-20 p-1 bg-gray-800 text-white rounded"
                  placeholder="Y"
                />
              </div>
            </div>

            {selectedElement.type === 'text' && (
              <>
                <div>
                  <label className="text-sm text-gray-400">Text</label>
                  <input
                    type="text"
                    value={selectedElement.props.text}
                    onChange={(e) => updateElementProp('text', e.target.value)}
                    className="w-full p-2 bg-gray-800 text-white rounded"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400">Size</label>
                  <input
                    type="number"
                    value={selectedElement.props.size}
                    onChange={(e) => updateElementProp('size', parseInt(e.target.value))}
                    className="w-full p-2 bg-gray-800 text-white rounded"
                  />
                </div>
              </>
            )}

            {(selectedElement.type === 'rect') && (
              <>
                <div>
                  <label className="text-sm text-gray-400">Width</label>
                  <input
                    type="number"
                    value={selectedElement.props.width}
                    onChange={(e) => updateElementProp('width', parseInt(e.target.value))}
                    className="w-full p-2 bg-gray-800 text-white rounded"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400">Height</label>
                  <input
                    type="number"
                    value={selectedElement.props.height}
                    onChange={(e) => updateElementProp('height', parseInt(e.target.value))}
                    className="w-full p-2 bg-gray-800 text-white rounded"
                  />
                </div>
              </>
            )}

            {selectedElement.type === 'circle' && (
              <div>
                <label className="text-sm text-gray-400">Radius</label>
                <input
                  type="number"
                  value={selectedElement.props.radius}
                  onChange={(e) => updateElementProp('radius', parseInt(e.target.value))}
                  className="w-full p-2 bg-gray-800 text-white rounded"
                />
              </div>
            )}

            <div>
              <label className="text-sm text-gray-400">Color</label>
              <select
                value={selectedElement.props.color}
                onChange={(e) => updateElementProp('color', e.target.value)}
                className="w-full p-2 bg-gray-800 text-white rounded"
              >
                <option value="#ffffff">White</option>
                <option value="#4ade80">Green</option>
                <option value="#3b82f6">Blue</option>
                <option value="#fbbf24">Yellow</option>
                <option value="#ef4444">Red</option>
                <option value="#6b7280">Gray</option>
              </select>
            </div>

            {(selectedElement.type === 'rect' || selectedElement.type === 'circle') && (
              <div>
                <label className="flex items-center gap-2 text-sm text-gray-400">
                  <input
                    type="checkbox"
                    checked={selectedElement.props.filled || false}
                    onChange={(e) => updateElementProp('filled', e.target.checked)}
                  />
                  Filled
                </label>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Export Code Modal */}
      {exportCode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg max-w-2xl max-h-screen overflow-auto">
            <h3 className="text-xl font-bold text-green-400 mb-4">Exported Code</h3>
            <pre className="bg-black p-4 rounded text-sm text-gray-300 overflow-x-auto">
              <code>{exportCode}</code>
            </pre>
            <button
              onClick={() => setExportCode('')}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}