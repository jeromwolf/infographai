"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import GIF from 'gif.js';

interface CanvasElement {
  id: string;
  type: 'text' | 'rect' | 'circle' | 'arrow' | 'image';
  x: number;
  y: number;
  props: any;
  animation?: {
    type: 'fadeIn' | 'slideIn' | 'zoomIn' | 'rotate' | 'bounce';
    duration: number;
    delay: number;
    easing: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
  };
}

interface ProfessionalSceneBuilderProps {
  initialCommands?: any[];
  onSave?: (elements: CanvasElement[]) => void;
}

export default function ProfessionalSceneBuilder({ initialCommands = [], onSave }: ProfessionalSceneBuilderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Core state
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<CanvasElement | null>(null);
  const [selectedElements, setSelectedElements] = useState<CanvasElement[]>([]);

  // Canvas state
  const [canvasZoom, setCanvasZoom] = useState(60);
  const [showGrid, setShowGrid] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(true);

  // UI state
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'properties' | 'layers' | 'animation'>('properties');

  // History for undo/redo
  const [history, setHistory] = useState<CanvasElement[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Drag state
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Export state
  const [isExportingGIF, setIsExportingGIF] = useState(false);

  // Canvas dimensions
  const CANVAS_WIDTH = 1920;
  const CANVAS_HEIGHT = 1080;
  const GRID_SIZE = 20;

  // Initialize from props
  useEffect(() => {
    if (initialCommands && initialCommands.length > 0) {
      const convertedElements = initialCommands.map((cmd: any, index: number) => {
        const element: CanvasElement = {
          id: `element-${Date.now()}-${index}`,
          type: cmd.type,
          x: cmd.x || 600,
          y: cmd.y || 400,
          props: {}
        };

        switch (cmd.type) {
          case 'text':
            element.props = {
              text: cmd.text || '',
              size: cmd.size || 24,
              color: cmd.color || '#ffffff',
              font: cmd.font || 'Arial',
              bold: cmd.bold || false,
              italic: cmd.italic || false
            };
            break;
          case 'rect':
            element.props = {
              width: cmd.width || 200,
              height: cmd.height || 100,
              color: cmd.color || '#3b82f6',
              filled: cmd.filled !== false,
              borderRadius: cmd.borderRadius || 0
            };
            break;
          case 'circle':
            element.props = {
              radius: cmd.radius || 50,
              color: cmd.color || '#ef4444',
              filled: cmd.filled !== false
            };
            break;
          case 'arrow':
            element.props = {
              x2: cmd.endX ? cmd.endX - cmd.x : 100,
              y2: cmd.endY ? cmd.endY - cmd.y : 0,
              color: cmd.color || '#fbbf24',
              strokeWidth: cmd.strokeWidth || 2
            };
            break;
        }
        return element;
      });
      setElements(convertedElements);
      addToHistory(convertedElements);
    }
  }, [initialCommands]);

  // Add to history
  const addToHistory = (newElements: CanvasElement[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([...newElements]);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // Undo
  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setElements([...history[newIndex]]);
    }
  };

  // Redo
  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setElements([...history[newIndex]]);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'z':
            if (e.shiftKey) {
              redo();
            } else {
              undo();
            }
            e.preventDefault();
            break;
          case 's':
            if (onSave) {
              onSave(elements);
              e.preventDefault();
            }
            break;
          case 'a':
            setSelectedElements([...elements]);
            e.preventDefault();
            break;
          case 'd':
            if (selectedElement) {
              duplicateElement();
              e.preventDefault();
            }
            break;
        }
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedElement) {
          deleteElement(selectedElement.id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElement, elements, historyIndex]);

  // Add element
  const addElement = (type: CanvasElement['type']) => {
    const newElement: CanvasElement = {
      id: `element-${Date.now()}-${Math.random()}`,
      type,
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT / 2,
      props: {},
      animation: {
        type: 'fadeIn',
        duration: 1000,
        delay: 0,
        easing: 'ease'
      }
    };

    switch (type) {
      case 'text':
        newElement.props = {
          text: 'New Text',
          size: 48,
          color: '#ffffff',
          font: 'Arial',
          bold: false,
          italic: false
        };
        break;
      case 'rect':
        newElement.props = {
          width: 200,
          height: 100,
          color: '#3b82f6',
          filled: false,
          borderRadius: 0
        };
        break;
      case 'circle':
        newElement.props = {
          radius: 50,
          color: '#ef4444',
          filled: false
        };
        break;
      case 'arrow':
        newElement.props = {
          x2: 100,
          y2: 0,
          color: '#fbbf24',
          strokeWidth: 3
        };
        break;
    }

    const newElements = [...elements, newElement];
    setElements(newElements);
    setSelectedElement(newElement);
    addToHistory(newElements);
  };

  // Delete element
  const deleteElement = (id: string) => {
    const newElements = elements.filter(el => el.id !== id);
    setElements(newElements);
    setSelectedElement(null);
    addToHistory(newElements);
  };

  // Duplicate element
  const duplicateElement = () => {
    if (selectedElement) {
      const duplicated = {
        ...selectedElement,
        id: `element-${Date.now()}-${Math.random()}`,
        x: selectedElement.x + 20,
        y: selectedElement.y + 20
      };
      const newElements = [...elements, duplicated];
      setElements(newElements);
      setSelectedElement(duplicated);
      addToHistory(newElements);
    }
  };

  // Update element
  const updateElement = (id: string, updates: Partial<CanvasElement>, skipHistory = false) => {
    const newElements = elements.map(el =>
      el.id === id ? { ...el, ...updates } : el
    );
    setElements(newElements);
    if (!skipHistory) {
      addToHistory(newElements);
    }
  };

  // Canvas mouse events
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scale = canvasZoom / 100;
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;

    // Find clicked element
    const clickedElement = elements.slice().reverse().find(el => {
      switch (el.type) {
        case 'text':
          // For text, use approximate bounds based on size
          const textWidth = el.props.text.length * el.props.size * 0.6;
          const textHeight = el.props.size;
          return x >= el.x - textWidth / 2 && x <= el.x + textWidth / 2 &&
                 y >= el.y - textHeight / 2 && y <= el.y + textHeight / 2;
        case 'rect':
          return x >= el.x - el.props.width / 2 && x <= el.x + el.props.width / 2 &&
                 y >= el.y - el.props.height / 2 && y <= el.y + el.props.height / 2;
        case 'circle':
          const dx = x - el.x;
          const dy = y - el.y;
          return Math.sqrt(dx * dx + dy * dy) <= el.props.radius;
        case 'arrow':
          // For arrow, check if click is near the line
          const endX = el.x + el.props.x2;
          const endY = el.y + el.props.y2;
          const lineLength = Math.sqrt(el.props.x2 * el.props.x2 + el.props.y2 * el.props.y2);
          const t = Math.max(0, Math.min(1, ((x - el.x) * el.props.x2 + (y - el.y) * el.props.y2) / (lineLength * lineLength)));
          const projX = el.x + t * el.props.x2;
          const projY = el.y + t * el.props.y2;
          const distance = Math.sqrt((x - projX) * (x - projX) + (y - projY) * (y - projY));
          return distance <= 10; // 10px tolerance for clicking on arrow
        default:
          return false;
      }
    });

    if (clickedElement) {
      setSelectedElement(clickedElement);
      setIsDragging(true);
      setDragOffset({
        x: x - clickedElement.x,
        y: y - clickedElement.y
      });
    } else {
      setSelectedElement(null);
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging && selectedElement) {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const scale = canvasZoom / 100;
      let x = (e.clientX - rect.left) / scale - dragOffset.x;
      let y = (e.clientY - rect.top) / scale - dragOffset.y;

      // Snap to grid
      if (snapToGrid) {
        x = Math.round(x / GRID_SIZE) * GRID_SIZE;
        y = Math.round(y / GRID_SIZE) * GRID_SIZE;
      }

      updateElement(selectedElement.id, { x, y }, true); // Skip history during drag
    }
  };

  const handleCanvasMouseUp = () => {
    if (isDragging && selectedElement) {
      // Add final position to history when drag ends
      addToHistory(elements);
    }
    setIsDragging(false);
  };

  // Render canvas
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw grid
    if (showGrid) {
      ctx.strokeStyle = '#1a1a1a';
      ctx.lineWidth = 1;

      for (let x = 0; x <= CANVAS_WIDTH; x += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, CANVAS_HEIGHT);
        ctx.stroke();
      }

      for (let y = 0; y <= CANVAS_HEIGHT; y += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(CANVAS_WIDTH, y);
        ctx.stroke();
      }
    }

    // Draw elements
    elements.forEach(element => {
      ctx.save();

      switch (element.type) {
        case 'text':
          ctx.font = `${element.props.bold ? 'bold ' : ''}${element.props.italic ? 'italic ' : ''}${element.props.size}px ${element.props.font}`;
          ctx.fillStyle = element.props.color;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(element.props.text, element.x, element.y);
          break;

        case 'rect':
          const rectX = element.x - element.props.width / 2;
          const rectY = element.y - element.props.height / 2;

          if (element.props.borderRadius > 0) {
            // Rounded rectangle
            const r = element.props.borderRadius;
            ctx.beginPath();
            ctx.moveTo(rectX + r, rectY);
            ctx.lineTo(rectX + element.props.width - r, rectY);
            ctx.quadraticCurveTo(rectX + element.props.width, rectY, rectX + element.props.width, rectY + r);
            ctx.lineTo(rectX + element.props.width, rectY + element.props.height - r);
            ctx.quadraticCurveTo(rectX + element.props.width, rectY + element.props.height, rectX + element.props.width - r, rectY + element.props.height);
            ctx.lineTo(rectX + r, rectY + element.props.height);
            ctx.quadraticCurveTo(rectX, rectY + element.props.height, rectX, rectY + element.props.height - r);
            ctx.lineTo(rectX, rectY + r);
            ctx.quadraticCurveTo(rectX, rectY, rectX + r, rectY);
            ctx.closePath();
          } else {
            ctx.beginPath();
            ctx.rect(rectX, rectY, element.props.width, element.props.height);
          }

          ctx.strokeStyle = element.props.color;
          ctx.fillStyle = element.props.color;
          ctx.lineWidth = 2;

          if (element.props.filled) {
            ctx.fill();
          } else {
            ctx.stroke();
          }
          break;

        case 'circle':
          ctx.beginPath();
          ctx.arc(element.x, element.y, element.props.radius, 0, Math.PI * 2);
          ctx.strokeStyle = element.props.color;
          ctx.fillStyle = element.props.color;
          ctx.lineWidth = 2;

          if (element.props.filled) {
            ctx.fill();
          } else {
            ctx.stroke();
          }
          break;

        case 'arrow':
          const endX = element.x + element.props.x2;
          const endY = element.y + element.props.y2;

          // Draw line
          ctx.beginPath();
          ctx.moveTo(element.x, element.y);
          ctx.lineTo(endX, endY);
          ctx.strokeStyle = element.props.color;
          ctx.lineWidth = element.props.strokeWidth;
          ctx.stroke();

          // Draw arrowhead
          const angle = Math.atan2(endY - element.y, endX - element.x);
          const headLength = 15;
          ctx.beginPath();
          ctx.moveTo(endX, endY);
          ctx.lineTo(endX - headLength * Math.cos(angle - Math.PI / 6), endY - headLength * Math.sin(angle - Math.PI / 6));
          ctx.moveTo(endX, endY);
          ctx.lineTo(endX - headLength * Math.cos(angle + Math.PI / 6), endY - headLength * Math.sin(angle + Math.PI / 6));
          ctx.stroke();
          break;
      }

      // Draw selection box
      if (selectedElement?.id === element.id) {
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);

        let selectionBox = { x: 0, y: 0, width: 0, height: 0 };

        switch (element.type) {
          case 'text':
            const metrics = ctx.measureText(element.props.text);
            selectionBox = {
              x: element.x - metrics.width / 2 - 10,
              y: element.y - element.props.size / 2 - 10,
              width: metrics.width + 20,
              height: element.props.size + 20
            };
            break;
          case 'rect':
            selectionBox = {
              x: element.x - element.props.width / 2 - 10,
              y: element.y - element.props.height / 2 - 10,
              width: element.props.width + 20,
              height: element.props.height + 20
            };
            break;
          case 'circle':
            selectionBox = {
              x: element.x - element.props.radius - 10,
              y: element.y - element.props.radius - 10,
              width: element.props.radius * 2 + 20,
              height: element.props.radius * 2 + 20
            };
            break;
        }

        ctx.strokeRect(selectionBox.x, selectionBox.y, selectionBox.width, selectionBox.height);
        ctx.setLineDash([]);

        // Draw resize handles
        const handleSize = 8;
        ctx.fillStyle = '#3b82f6';

        // Top-left
        ctx.fillRect(selectionBox.x - handleSize/2, selectionBox.y - handleSize/2, handleSize, handleSize);
        // Top-right
        ctx.fillRect(selectionBox.x + selectionBox.width - handleSize/2, selectionBox.y - handleSize/2, handleSize, handleSize);
        // Bottom-left
        ctx.fillRect(selectionBox.x - handleSize/2, selectionBox.y + selectionBox.height - handleSize/2, handleSize, handleSize);
        // Bottom-right
        ctx.fillRect(selectionBox.x + selectionBox.width - handleSize/2, selectionBox.y + selectionBox.height - handleSize/2, handleSize, handleSize);
      }

      ctx.restore();
    });
  }, [elements, selectedElement, showGrid]);

  // Render canvas on changes
  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // Export as PNG
  const exportAsPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'scene.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  // Export as GIF
  const exportAsGIF = async () => {
    const canvas = canvasRef.current;
    if (!canvas || elements.length === 0) return;

    setIsExportingGIF(true);

    // Create GIF encoder
    const gif = new GIF({
      workers: 2,
      quality: 10,
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
      workerScript: '/gif.worker.js',
      debug: true
    });

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const fps = 30;
    const duration = 3000; // 3 seconds
    const totalFrames = (duration / 1000) * fps;

    console.log(`Creating GIF with ${totalFrames} frames at ${fps} fps`);

    for (let frame = 0; frame < totalFrames; frame++) {
      const progress = frame / (totalFrames - 1); // Ensure progress goes from 0 to 1

      // Create new canvas for this frame
      const frameCanvas = document.createElement('canvas');
      frameCanvas.width = CANVAS_WIDTH;
      frameCanvas.height = CANVAS_HEIGHT;
      const frameCtx = frameCanvas.getContext('2d');
      if (!frameCtx) continue;

      // Clear frame
      frameCtx.fillStyle = '#000000';
      frameCtx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Draw grid if enabled
      if (showGrid) {
        frameCtx.strokeStyle = '#1a1a1a';
        frameCtx.lineWidth = 1;

        for (let x = 0; x <= CANVAS_WIDTH; x += GRID_SIZE) {
          frameCtx.beginPath();
          frameCtx.moveTo(x, 0);
          frameCtx.lineTo(x, CANVAS_HEIGHT);
          frameCtx.stroke();
        }

        for (let y = 0; y <= CANVAS_HEIGHT; y += GRID_SIZE) {
          frameCtx.beginPath();
          frameCtx.moveTo(0, y);
          frameCtx.lineTo(CANVAS_WIDTH, y);
          frameCtx.stroke();
        }
      }

      // Draw elements with animations
      elements.forEach((element, index) => {
        frameCtx.save();

        // Calculate animation progress for each element
        // Stagger the animations for better visual effect
        const staggerDelay = index * 200; // 200ms delay between each element
        const elementDelay = (element.animation?.delay || 0) + staggerDelay;
        const elementDuration = element.animation?.duration || 1000;

        const elementStartTime = elementDelay / duration;
        const elementEndTime = (elementDelay + elementDuration) / duration;

        if (progress < elementStartTime) {
          frameCtx.restore();
          return; // Element hasn't started animating yet
        }

        let elementProgress = 1; // Default to fully visible
        if (progress < elementEndTime) {
          elementProgress = (progress - elementStartTime) / (elementEndTime - elementStartTime);

          // Apply easing
          if (element.animation) {
            switch (element.animation.easing) {
              case 'ease-in':
                elementProgress = elementProgress * elementProgress;
                break;
              case 'ease-out':
                elementProgress = 1 - Math.pow(1 - elementProgress, 2);
                break;
              case 'ease-in-out':
                elementProgress = elementProgress < 0.5
                  ? 2 * elementProgress * elementProgress
                  : 1 - Math.pow(-2 * elementProgress + 2, 2) / 2;
                break;
            }

          }
        }

        // Apply animation type
        if (element.animation && elementProgress < 1) {
          switch (element.animation.type) {
            case 'fadeIn':
              frameCtx.globalAlpha = elementProgress;
              break;
            case 'slideIn':
              const slideOffset = (1 - elementProgress) * 100;
              frameCtx.translate(-slideOffset, 0);
              break;
            case 'zoomIn':
              const scale = elementProgress;
              frameCtx.translate(element.x, element.y);
              frameCtx.scale(scale, scale);
              frameCtx.translate(-element.x, -element.y);
              break;
            case 'rotate':
              frameCtx.translate(element.x, element.y);
              frameCtx.rotate(elementProgress * Math.PI * 2);
              frameCtx.translate(-element.x, -element.y);
              break;
            case 'bounce':
              const bounce = Math.sin(elementProgress * Math.PI);
              frameCtx.translate(0, -bounce * 50);
              break;
          }
        }

        // Draw element
        switch (element.type) {
          case 'text':
            frameCtx.font = `${element.props.bold ? 'bold ' : ''}${element.props.italic ? 'italic ' : ''}${element.props.size}px ${element.props.font}`;
            frameCtx.fillStyle = element.props.color;
            frameCtx.textAlign = 'center';
            frameCtx.textBaseline = 'middle';
            frameCtx.fillText(element.props.text, element.x, element.y);
            break;

          case 'rect':
            const rectX = element.x - element.props.width / 2;
            const rectY = element.y - element.props.height / 2;

            frameCtx.strokeStyle = element.props.color;
            frameCtx.fillStyle = element.props.color;
            frameCtx.lineWidth = 2;

            if (element.props.filled) {
              frameCtx.fillRect(rectX, rectY, element.props.width, element.props.height);
            } else {
              frameCtx.strokeRect(rectX, rectY, element.props.width, element.props.height);
            }
            break;

          case 'circle':
            frameCtx.beginPath();
            frameCtx.arc(element.x, element.y, element.props.radius, 0, Math.PI * 2);
            frameCtx.strokeStyle = element.props.color;
            frameCtx.fillStyle = element.props.color;
            frameCtx.lineWidth = 2;

            if (element.props.filled) {
              frameCtx.fill();
            } else {
              frameCtx.stroke();
            }
            break;
        }

        frameCtx.restore();
      });

      gif.addFrame(frameCanvas, { copy: true, delay: 1000 / fps });
    }

    gif.on('finished', (blob: Blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = 'animation.gif';
      link.href = url;
      link.click();
      setIsExportingGIF(false);
    });

    gif.render();
  };

  return (
    <div className="h-screen bg-gray-950 text-white flex flex-col">
      {/* Top Toolbar */}
      <div className="bg-gray-900 border-b border-gray-800 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
            Professional Scene Builder
          </h1>

          {/* File operations */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setElements([]);
                setHistory([[]]);
                setHistoryIndex(0);
              }}
              className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded text-sm"
            >
              New
            </button>
            <button
              onClick={() => onSave && onSave(elements)}
              className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded text-sm"
            >
              Save
            </button>
            <button
              onClick={exportAsPNG}
              className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm"
            >
              Export PNG
            </button>
            <button
              onClick={exportAsGIF}
              disabled={isExportingGIF || elements.length === 0}
              className="px-3 py-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 rounded text-sm"
            >
              {isExportingGIF ? 'Exporting...' : 'Export GIF'}
            </button>
          </div>

          {/* Undo/Redo */}
          <div className="flex items-center gap-1">
            <button
              onClick={undo}
              disabled={historyIndex <= 0}
              className="p-1 hover:bg-gray-700 rounded disabled:opacity-50"
              title="Undo (Ctrl+Z)"
            >
              ↶
            </button>
            <button
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
              className="p-1 hover:bg-gray-700 rounded disabled:opacity-50"
              title="Redo (Ctrl+Shift+Z)"
            >
              ↷
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Zoom controls */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 font-bold">16:9</span>
            <button
              onClick={() => setCanvasZoom(Math.max(25, canvasZoom - 10))}
              className="px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded text-sm"
            >
              -
            </button>
            <span className="text-sm w-12 text-center">{canvasZoom}%</span>
            <button
              onClick={() => setCanvasZoom(Math.min(200, canvasZoom + 10))}
              className="px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded text-sm"
            >
              +
            </button>
          </div>

          {/* Grid toggle */}
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showGrid}
              onChange={(e) => setShowGrid(e.target.checked)}
              className="rounded"
            />
            Grid
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={snapToGrid}
              onChange={(e) => setSnapToGrid(e.target.checked)}
              className="rounded"
            />
            Snap
          </label>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Tools */}
        <div className={`bg-gray-900 border-r border-gray-800 transition-all ${leftPanelOpen ? 'w-64' : 'w-12'}`}>
          <div className="p-4">
            {leftPanelOpen ? (
              <>
                <h3 className="text-sm font-bold mb-4 text-gray-400">ADD ELEMENTS</h3>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => addElement('text')}
                    className="px-3 py-2 bg-green-600 hover:bg-green-700 rounded text-sm"
                  >
                    Text
                  </button>
                  <button
                    onClick={() => addElement('rect')}
                    className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm"
                  >
                    Rectangle
                  </button>
                  <button
                    onClick={() => addElement('circle')}
                    className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded text-sm"
                  >
                    Circle
                  </button>
                  <button
                    onClick={() => addElement('arrow')}
                    className="px-3 py-2 bg-yellow-600 hover:bg-yellow-700 rounded text-sm"
                  >
                    Arrow
                  </button>
                </div>

                <h3 className="text-sm font-bold mt-6 mb-2 text-gray-400">ELEMENTS ({elements.length})</h3>
                <div className="space-y-1 max-h-96 overflow-y-auto">
                  {elements.map((element) => (
                    <div
                      key={element.id}
                      onClick={() => setSelectedElement(element)}
                      className={`p-2 rounded cursor-pointer text-sm ${
                        selectedElement?.id === element.id
                          ? 'bg-blue-600'
                          : 'bg-gray-800 hover:bg-gray-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{element.type}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteElement(element.id);
                          }}
                          className="text-red-400 hover:text-red-300"
                        >
                          ×
                        </button>
                      </div>
                      {element.type === 'text' && (
                        <div className="text-xs text-gray-400 mt-1 truncate">
                          {element.props.text}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <button
                onClick={() => setLeftPanelOpen(true)}
                className="p-1"
              >
                →
              </button>
            )}
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 flex items-center justify-center bg-gray-900 overflow-auto p-8">
          <div
            style={{
              transform: `scale(${canvasZoom / 100})`,
              transformOrigin: 'center'
            }}
          >
            <canvas
              ref={canvasRef}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              className="border border-gray-700 shadow-2xl"
              style={{
                imageRendering: 'crisp-edges',
                maxWidth: 'none',
                cursor: isDragging ? 'grabbing' : (selectedElement ? 'grab' : 'crosshair')
              }}
              onMouseDown={handleCanvasMouseDown}
              onMouseMove={handleCanvasMouseMove}
              onMouseUp={handleCanvasMouseUp}
              onMouseLeave={handleCanvasMouseUp}
            />
          </div>
        </div>

        {/* Right Panel - Properties */}
        <div className={`bg-gray-900 border-l border-gray-800 transition-all ${rightPanelOpen ? 'w-80' : 'w-12'}`}>
          <div className="p-4">
            {rightPanelOpen ? (
              <>
                {/* Tabs */}
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setActiveTab('properties')}
                    className={`px-3 py-1 rounded text-sm ${
                      activeTab === 'properties'
                        ? 'bg-blue-600'
                        : 'bg-gray-800 hover:bg-gray-700'
                    }`}
                  >
                    Properties
                  </button>
                  <button
                    onClick={() => setActiveTab('animation')}
                    className={`px-3 py-1 rounded text-sm ${
                      activeTab === 'animation'
                        ? 'bg-blue-600'
                        : 'bg-gray-800 hover:bg-gray-700'
                    }`}
                  >
                    Animation
                  </button>
                </div>

                {selectedElement && activeTab === 'properties' && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-gray-400">POSITION</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs text-gray-500">X</label>
                        <input
                          type="number"
                          value={selectedElement.x}
                          onChange={(e) => updateElement(selectedElement.id, { x: parseInt(e.target.value) })}
                          className="w-full px-2 py-1 bg-gray-800 rounded text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Y</label>
                        <input
                          type="number"
                          value={selectedElement.y}
                          onChange={(e) => updateElement(selectedElement.id, { y: parseInt(e.target.value) })}
                          className="w-full px-2 py-1 bg-gray-800 rounded text-sm"
                        />
                      </div>
                    </div>

                    {selectedElement.type === 'text' && (
                      <>
                        <h3 className="text-sm font-bold text-gray-400 mt-4">TEXT PROPERTIES</h3>
                        <div>
                          <label className="text-xs text-gray-500">Text</label>
                          <input
                            type="text"
                            value={selectedElement.props.text}
                            onChange={(e) => updateElement(selectedElement.id, {
                              props: { ...selectedElement.props, text: e.target.value }
                            })}
                            className="w-full px-2 py-1 bg-gray-800 rounded text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500">Size</label>
                          <input
                            type="range"
                            min="12"
                            max="120"
                            value={selectedElement.props.size}
                            onChange={(e) => updateElement(selectedElement.id, {
                              props: { ...selectedElement.props, size: parseInt(e.target.value) }
                            })}
                            className="w-full"
                          />
                          <span className="text-xs">{selectedElement.props.size}px</span>
                        </div>
                        <div>
                          <label className="text-xs text-gray-500">Color</label>
                          <input
                            type="color"
                            value={selectedElement.props.color}
                            onChange={(e) => updateElement(selectedElement.id, {
                              props: { ...selectedElement.props, color: e.target.value }
                            })}
                            className="w-full h-8 bg-gray-800 rounded cursor-pointer"
                          />
                        </div>
                      </>
                    )}

                    {(selectedElement.type === 'rect' || selectedElement.type === 'circle') && (
                      <>
                        <h3 className="text-sm font-bold text-gray-400 mt-4">SHAPE PROPERTIES</h3>
                        <div>
                          <label className="text-xs text-gray-500">Color</label>
                          <input
                            type="color"
                            value={selectedElement.props.color}
                            onChange={(e) => updateElement(selectedElement.id, {
                              props: { ...selectedElement.props, color: e.target.value }
                            })}
                            className="w-full h-8 bg-gray-800 rounded cursor-pointer"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedElement.props.filled}
                            onChange={(e) => updateElement(selectedElement.id, {
                              props: { ...selectedElement.props, filled: e.target.checked }
                            })}
                            className="rounded"
                          />
                          <label className="text-sm">Filled</label>
                        </div>
                      </>
                    )}

                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={duplicateElement}
                        className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded text-sm"
                      >
                        Duplicate
                      </button>
                      <button
                        onClick={() => deleteElement(selectedElement.id)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}

                {selectedElement && activeTab === 'animation' && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-gray-400">ANIMATION</h3>
                    <div>
                      <label className="text-xs text-gray-500">Type</label>
                      <select
                        value={selectedElement.animation?.type || 'fadeIn'}
                        onChange={(e) => updateElement(selectedElement.id, {
                          animation: {
                            ...selectedElement.animation,
                            type: e.target.value as any
                          }
                        })}
                        className="w-full px-2 py-1 bg-gray-800 rounded text-sm"
                      >
                        <option value="fadeIn">Fade In</option>
                        <option value="slideIn">Slide In</option>
                        <option value="zoomIn">Zoom In</option>
                        <option value="rotate">Rotate</option>
                        <option value="bounce">Bounce</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Duration (ms)</label>
                      <input
                        type="number"
                        value={selectedElement.animation?.duration || 1000}
                        onChange={(e) => updateElement(selectedElement.id, {
                          animation: {
                            ...selectedElement.animation,
                            duration: parseInt(e.target.value)
                          }
                        })}
                        className="w-full px-2 py-1 bg-gray-800 rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Delay (ms)</label>
                      <input
                        type="number"
                        value={selectedElement.animation?.delay || 0}
                        onChange={(e) => updateElement(selectedElement.id, {
                          animation: {
                            ...selectedElement.animation,
                            delay: parseInt(e.target.value)
                          }
                        })}
                        className="w-full px-2 py-1 bg-gray-800 rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Easing</label>
                      <select
                        value={selectedElement.animation?.easing || 'ease'}
                        onChange={(e) => updateElement(selectedElement.id, {
                          animation: {
                            ...selectedElement.animation,
                            easing: e.target.value as any
                          }
                        })}
                        className="w-full px-2 py-1 bg-gray-800 rounded text-sm"
                      >
                        <option value="linear">Linear</option>
                        <option value="ease">Ease</option>
                        <option value="ease-in">Ease In</option>
                        <option value="ease-out">Ease Out</option>
                        <option value="ease-in-out">Ease In Out</option>
                      </select>
                    </div>
                  </div>
                )}

                {!selectedElement && (
                  <div className="text-gray-500 text-sm">
                    Select an element to edit properties
                  </div>
                )}
              </>
            ) : (
              <button
                onClick={() => setRightPanelOpen(true)}
                className="p-1"
              >
                ←
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-gray-900 border-t border-gray-800 px-4 py-1 flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center gap-4">
          <span>Canvas: {CANVAS_WIDTH}×{CANVAS_HEIGHT} (16:9)</span>
          <span>Elements: {elements.length}</span>
          {selectedElement && <span>Selected: {selectedElement.type}</span>}
        </div>
        <div className="flex items-center gap-4">
          <span>Ctrl+Z: Undo | Ctrl+Shift+Z: Redo | Ctrl+D: Duplicate | Delete: Remove</span>
        </div>
      </div>
    </div>
  );
}