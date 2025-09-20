"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import DrawingEngine from '@/components/animation/DrawingEngine';

// Export DrawCommand type
export type DrawCommand =
  | { type: 'line'; x1: number; y1: number; x2: number; y2: number; color?: string; width?: number }
  | { type: 'rect'; x: number; y: number; width: number; height: number; color?: string; filled?: boolean }
  | { type: 'circle'; x: number; y: number; radius: number; color?: string; filled?: boolean }
  | { type: 'text'; text: string; x: number; y: number; size?: number; color?: string }
  | { type: 'arrow'; x1: number; y1: number; x2: number; y2: number; color?: string }
  | { type: 'path'; points: Array<{x: number; y: number}>; color?: string; closed?: boolean }
  | { type: 'clear' }
  | { type: 'wait'; duration: number }
  | { type: 'parallel'; commands: DrawCommand[] }
  | { type: 'highlight'; x: number; y: number; width: number; height: number; color?: string };

interface EnhancedSceneBuilderProps {
  initialCommands?: DrawCommand[];
  onSave?: (commands: DrawCommand[]) => void;
}

export default function EnhancedSceneBuilder({ initialCommands = [], onSave }: EnhancedSceneBuilderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [elements, setElements] = useState<any[]>([]);
  const [selectedElement, setSelectedElement] = useState<any>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<any[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Auto-save to localStorage
  const autoSave = useCallback(() => {
    if (elements.length > 0) {
      localStorage.setItem('scenecraft_autosave', JSON.stringify(elements));
      localStorage.setItem('scenecraft_autosave_time', new Date().toISOString());
    }
  }, [elements]);

  // Auto-save every 30 seconds
  useEffect(() => {
    const timer = setInterval(autoSave, 30000);
    return () => clearInterval(timer);
  }, [autoSave]);

  // Load initial commands when they change
  useEffect(() => {
    if (initialCommands && initialCommands.length > 0) {
      console.log('Loading initial commands:', initialCommands);

      const convertedElements = initialCommands.map((cmd, index) => {
        const id = `template-${index}-${Date.now()}-${Math.random()}`;

        switch (cmd.type) {
          case 'text':
            return {
              id,
              type: 'text',
              x: cmd.x,
              y: cmd.y,
              props: {
                text: cmd.text,
                size: cmd.size || 16,
                color: cmd.color || '#ffffff'
              },
              animation: {
                type: 'fadeIn',
                duration: 1000,
                delay: index * 500,
                easing: 'ease-in-out',
                loop: false
              }
            };
          case 'rect':
            return {
              id,
              type: 'rect',
              x: cmd.x,
              y: cmd.y,
              props: {
                width: cmd.width,
                height: cmd.height,
                color: cmd.color || '#ffffff',
                filled: cmd.filled || false
              },
              animation: {
                type: 'slideIn',
                duration: 1000,
                delay: index * 500,
                easing: 'ease-in-out',
                loop: false
              }
            };
          case 'circle':
            return {
              id,
              type: 'circle',
              x: cmd.x,
              y: cmd.y,
              props: {
                radius: cmd.radius,
                color: cmd.color || '#ffffff',
                filled: cmd.filled || false
              },
              animation: {
                type: 'zoomIn',
                duration: 1000,
                delay: index * 500,
                easing: 'ease-in-out',
                loop: false
              }
            };
          case 'arrow':
            return {
              id,
              type: 'arrow',
              x: cmd.x1,
              y: cmd.y1,
              props: {
                x2: cmd.x2 - cmd.x1,
                y2: cmd.y2 - cmd.y1,
                color: cmd.color || '#ffffff'
              },
              animation: {
                type: 'slideIn',
                duration: 1000,
                delay: index * 500,
                easing: 'ease-in-out',
                loop: false
              }
            };
          case 'line':
            return {
              id,
              type: 'line',
              x: cmd.x1,
              y: cmd.y1,
              props: {
                x2: cmd.x2 - cmd.x1,
                y2: cmd.y2 - cmd.y1,
                color: cmd.color || '#ffffff',
                width: cmd.width || 1
              },
              animation: {
                type: 'fadeIn',
                duration: 1000,
                delay: index * 500,
                easing: 'ease-in-out',
                loop: false
              }
            };
          default:
            return null;
        }
      }).filter(Boolean);

      console.log('Converted elements:', convertedElements);

      setElements(convertedElements);

      // Update history
      const newHistory = [convertedElements]; // Reset history
      setHistory(newHistory);
      setHistoryIndex(0);

      showNotification('success', `Template loaded with ${convertedElements.length} elements`);
    }
  }, [initialCommands]);

  // Canvas rendering
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw elements
    elements.forEach(element => {
      ctx.save();

      switch (element.type) {
        case 'text':
          ctx.font = `${element.props.size || 16}px Arial`;
          ctx.fillStyle = element.props.color || '#ffffff';
          ctx.fillText(element.props.text || '', element.x, element.y);
          break;

        case 'rect':
          ctx.strokeStyle = element.props.color || '#ffffff';
          ctx.fillStyle = element.props.color || '#ffffff';
          if (element.props.filled) {
            ctx.fillRect(element.x, element.y, element.props.width, element.props.height);
          } else {
            ctx.strokeRect(element.x, element.y, element.props.width, element.props.height);
          }
          break;

        case 'circle':
          ctx.beginPath();
          ctx.arc(element.x, element.y, element.props.radius, 0, 2 * Math.PI);
          ctx.strokeStyle = element.props.color || '#ffffff';
          ctx.fillStyle = element.props.color || '#ffffff';
          if (element.props.filled) {
            ctx.fill();
          } else {
            ctx.stroke();
          }
          break;

        case 'line':
          ctx.beginPath();
          ctx.moveTo(element.x, element.y);
          ctx.lineTo(element.x + element.props.x2, element.y + element.props.y2);
          ctx.strokeStyle = element.props.color || '#ffffff';
          ctx.lineWidth = element.props.width || 1;
          ctx.stroke();
          break;

        case 'arrow':
          const x1 = element.x;
          const y1 = element.y;
          const x2 = element.x + element.props.x2;
          const y2 = element.y + element.props.y2;

          // Draw line
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.strokeStyle = element.props.color || '#ffffff';
          ctx.stroke();

          // Draw arrowhead
          const angle = Math.atan2(y2 - y1, x2 - x1);
          const headLength = 10;
          ctx.beginPath();
          ctx.moveTo(x2, y2);
          ctx.lineTo(x2 - headLength * Math.cos(angle - Math.PI / 6), y2 - headLength * Math.sin(angle - Math.PI / 6));
          ctx.moveTo(x2, y2);
          ctx.lineTo(x2 - headLength * Math.cos(angle + Math.PI / 6), y2 - headLength * Math.sin(angle + Math.PI / 6));
          ctx.stroke();
          break;
      }

      // Draw selection highlight
      if (selectedElement?.id === element.id) {
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(element.x - 5, element.y - 5,
          (element.props?.width || element.props?.radius * 2 || 50) + 10,
          (element.props?.height || element.props?.radius * 2 || 20) + 10);
        ctx.setLineDash([]);
      }

      ctx.restore();
    });
  }, [elements, selectedElement]);

  // Render canvas when elements change
  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // Show notification
  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  // Undo/Redo functionality
  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setElements(history[historyIndex - 1]);
      showNotification('info', 'Undo successful');
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setElements(history[historyIndex + 1]);
      showNotification('info', 'Redo successful');
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      // Cmd/Ctrl + Z for undo
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      // Cmd/Ctrl + Shift + Z for redo
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        redo();
      }
      // Cmd/Ctrl + S for save
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
      // Delete key
      if (e.key === 'Delete' && selectedElement) {
        deleteSelectedElement();
      }
      // Escape to deselect
      if (e.key === 'Escape') {
        setSelectedElement(null);
      }
      // G for grid toggle
      if (e.key === 'g' && !e.metaKey && !e.ctrlKey) {
        setShowGrid(!showGrid);
      }
    };

    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [selectedElement, historyIndex, history, showGrid]);

  // Load autosaved work
  const loadAutoSave = () => {
    const saved = localStorage.getItem('scenecraft_autosave');
    const saveTime = localStorage.getItem('scenecraft_autosave_time');

    if (saved && saveTime) {
      const timeAgo = new Date(saveTime).toLocaleString();
      if (confirm(`Found autosaved work from ${timeAgo}. Load it?`)) {
        try {
          setElements(JSON.parse(saved));
          showNotification('success', 'Autosaved work loaded');
        } catch {
          showNotification('error', 'Failed to load autosaved work');
        }
      }
    }
  };

  // Delete selected element
  const deleteSelectedElement = () => {
    if (selectedElement) {
      setElements(elements.filter(el => el.id !== selectedElement.id));
      setSelectedElement(null);
      showNotification('info', 'Element deleted');
    }
  };

  // Generate animation commands
  const generateCommands = (): DrawCommand[] => {
    return elements.map(element => {
      const baseCommand = { type: element.type as any };

      switch (element.type) {
        case 'text':
          return { ...baseCommand, text: element.props.text, x: element.x, y: element.y, size: element.props.size, color: element.props.color };
        case 'rect':
          return { ...baseCommand, x: element.x, y: element.y, width: element.props.width, height: element.props.height, color: element.props.color, filled: element.props.filled };
        case 'circle':
          return { ...baseCommand, x: element.x, y: element.y, radius: element.props.radius, color: element.props.color, filled: element.props.filled };
        case 'arrow':
          return { ...baseCommand, x1: element.x, y1: element.y, x2: element.x + element.props.x2, y2: element.y + element.props.y2, color: element.props.color };
        case 'line':
          return { ...baseCommand, x1: element.x, y1: element.y, x2: element.x + element.props.x2, y2: element.y + element.props.y2, color: element.props.color, width: element.props.width };
        default:
          return baseCommand;
      }
    }).filter(cmd => cmd.type);
  };

  // Save handler
  const handleSave = () => {
    if (onSave) {
      const commands = generateCommands();
      onSave(commands);
      showNotification('success', 'Scene saved successfully!');
    }
  };

  // Export as JSON with full animation data
  const exportAsJSON = () => {
    const commands = generateCommands();

    // Include animation-specific data
    const data = {
      name: 'SceneCraft Export',
      created: new Date().toISOString(),
      version: '2.0.0',

      // Basic drawing commands
      commands,

      // Canvas elements with full properties
      elements,

      // Animation configuration
      animation: {
        totalDuration: 5000, // 5 seconds default
        speed: 1,
        autoPlay: true,
        loop: false,

        // Animation sequence with timing
        sequence: elements.map((element, index) => ({
          elementId: element.id,
          startTime: index * 500, // 0.5s intervals
          duration: 1000, // 1s per animation
          effect: 'fadeIn', // default effect
          easing: 'ease-in-out'
        })),

        // Global effects
        effects: {
          background: '#000000',
          grid: true,
          transitions: true
        }
      },

      // Template metadata if this came from a template
      template: selectedElement ? {
        source: 'user_creation',
        category: 'custom',
        description: 'User created scene'
      } : null,

      // Scene properties
      scene: {
        width: 1200,
        height: 700,
        fps: 30,
        quality: 'high'
      }
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scenecraft-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification('success', 'Exported as JSON');
  };

  // Export as GIF
  const exportAsGIF = async () => {
    setIsLoading(true);
    showNotification('info', 'Generating GIF... This may take a moment.');

    try {
      // Dynamic import of gif.js to avoid SSR issues
      const { default: GIF } = await import('gif.js');

      // Create GIF encoder
      const gif = new GIF({
        workers: 2,
        quality: 10,
        width: 1200,
        height: 700,
        workerScript: '/gif.worker.js' // We'll need to add this to public folder
      });

      // Create a temporary canvas for rendering frames
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = 1200;
      tempCanvas.height = 700;
      const tempCtx = tempCanvas.getContext('2d');
      if (!tempCtx) throw new Error('Failed to create canvas context');

      // Calculate animation timeline
      const totalElements = elements.length;
      const maxDelay = Math.max(...elements.map(el => (el.animation?.delay || 0) + (el.animation?.duration || 1000)));
      const frameDuration = 100; // 100ms per frame = 10 fps
      const totalFrames = Math.ceil(maxDelay / frameDuration) + 10; // Add buffer frames

      // Generate frames
      for (let frame = 0; frame < totalFrames; frame++) {
        const currentTime = frame * frameDuration;

        // Clear canvas
        tempCtx.fillStyle = '#000000';
        tempCtx.fillRect(0, 0, 1200, 700);

        // Draw grid background for visual reference
        if (showGrid) {
          tempCtx.strokeStyle = '#111111';
          tempCtx.lineWidth = 1;
          for (let x = 0; x < 1200; x += 50) {
            tempCtx.beginPath();
            tempCtx.moveTo(x, 0);
            tempCtx.lineTo(x, 700);
            tempCtx.stroke();
          }
          for (let y = 0; y < 700; y += 50) {
            tempCtx.beginPath();
            tempCtx.moveTo(0, y);
            tempCtx.lineTo(1200, y);
            tempCtx.stroke();
          }
        }

        // Render each element at current time
        elements.forEach(element => {
          const animation = element.animation || {};
          const startTime = animation.delay || 0;
          const duration = animation.duration || 1000;
          const endTime = startTime + duration;

          // Calculate animation progress (0 to 1)
          let progress = 0;
          if (currentTime >= startTime && currentTime <= endTime) {
            progress = (currentTime - startTime) / duration;
          } else if (currentTime > endTime) {
            progress = animation.loop ? ((currentTime - startTime) % duration) / duration : 1;
          }

          // Apply easing
          const easedProgress = applyEasing(progress, animation.easing || 'ease-in-out');

          // Render element with animation
          tempCtx.save();
          renderElementWithAnimation(tempCtx, element, easedProgress, animation.type || 'fadeIn');
          tempCtx.restore();
        });

        // Create a new image data copy for this frame
        const imageData = tempCtx.getImageData(0, 0, 1200, 700);

        // Create a new canvas for this frame
        const frameCanvas = document.createElement('canvas');
        frameCanvas.width = 1200;
        frameCanvas.height = 700;
        const frameCtx = frameCanvas.getContext('2d');
        if (frameCtx) {
          frameCtx.putImageData(imageData, 0, 0);
          // Add frame to GIF with copied canvas
          gif.addFrame(frameCanvas, { delay: frameDuration, copy: true });
        }
      }

      // Render GIF
      gif.on('finished', (blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `scenecraft-animation-${Date.now()}.gif`;
        a.click();
        URL.revokeObjectURL(url);

        setIsLoading(false);
        showNotification('success', 'GIF exported successfully!');
      });

      gif.render();

    } catch (error) {
      console.error('GIF export error:', error);
      setIsLoading(false);
      showNotification('error', 'Failed to export GIF. Please try again.');
    }
  };

  // Apply easing functions
  const applyEasing = (t: number, easing: string): number => {
    switch (easing) {
      case 'linear': return t;
      case 'ease-in': return t * t;
      case 'ease-out': return t * (2 - t);
      case 'ease-in-out': return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      case 'bounce': return t < 0.5 ? 4 * t * t * t : 1 + (--t) * t * t * 4;
      case 'elastic': return t === 0 ? 0 : t === 1 ? 1 : -Math.pow(2, 10 * (t - 1)) * Math.sin((t - 1.1) * 5 * Math.PI);
      default: return t * (2 - t); // ease-out as default
    }
  };

  // Render element with animation effects
  const renderElementWithAnimation = (ctx: CanvasRenderingContext2D, element: any, progress: number, animationType: string) => {
    // Don't render if progress is 0 (not started yet) except for 'none' animation
    if (progress <= 0 && animationType !== 'none') {
      return;
    }

    // Apply animation transformations
    switch (animationType) {
      case 'fadeIn':
        ctx.globalAlpha = Math.max(0, Math.min(1, progress));
        break;
      case 'slideIn':
        const slideOffset = (1 - progress) * -200; // Increased offset for more visible effect
        ctx.translate(slideOffset, 0);
        ctx.globalAlpha = Math.max(0, Math.min(1, progress));
        break;
      case 'zoomIn':
        const scale = Math.max(0.01, Math.min(1, progress)); // Prevent scale of 0
        ctx.translate(element.x * (1 - scale), element.y * (1 - scale));
        ctx.scale(scale, scale);
        ctx.globalAlpha = Math.max(0, Math.min(1, progress));
        break;
      case 'typewriter':
        // For typewriter effect on text, we'll render partial text
        ctx.globalAlpha = 1;
        break;
      case 'morphing':
        // Morphing effect with rotation and scale
        const morphScale = 0.5 + (progress * 0.5);
        const rotation = progress * Math.PI * 2;
        ctx.translate(element.x, element.y);
        ctx.rotate(rotation);
        ctx.translate(-element.x, -element.y);
        ctx.scale(morphScale, morphScale);
        ctx.globalAlpha = Math.max(0, Math.min(1, progress));
        break;
      case 'none':
        ctx.globalAlpha = 1;
        break;
      default:
        ctx.globalAlpha = Math.max(0, Math.min(1, progress));
    }

    // Render the element
    switch (element.type) {
      case 'text':
        ctx.font = `${element.props.size || 16}px Arial`;
        ctx.fillStyle = element.props.color || '#ffffff';

        // Handle typewriter effect for text
        if (animationType === 'typewriter') {
          const fullText = element.props.text || '';
          const charCount = Math.floor(fullText.length * progress);
          const partialText = fullText.substring(0, charCount);
          ctx.fillText(partialText, element.x, element.y);
        } else {
          ctx.fillText(element.props.text || '', element.x, element.y);
        }
        break;

      case 'rect':
        ctx.strokeStyle = element.props.color || '#ffffff';
        ctx.fillStyle = element.props.color || '#ffffff';
        if (element.props.filled) {
          ctx.fillRect(element.x, element.y, element.props.width, element.props.height);
        } else {
          ctx.strokeRect(element.x, element.y, element.props.width, element.props.height);
        }
        break;

      case 'circle':
        ctx.beginPath();
        ctx.arc(element.x, element.y, element.props.radius, 0, 2 * Math.PI);
        ctx.strokeStyle = element.props.color || '#ffffff';
        ctx.fillStyle = element.props.color || '#ffffff';
        if (element.props.filled) {
          ctx.fill();
        } else {
          ctx.stroke();
        }
        break;

      case 'line':
        ctx.beginPath();
        ctx.moveTo(element.x, element.y);
        ctx.lineTo(element.x + element.props.x2, element.y + element.props.y2);
        ctx.strokeStyle = element.props.color || '#ffffff';
        ctx.lineWidth = element.props.width || 1;
        ctx.stroke();
        break;

      case 'arrow':
        const x1 = element.x;
        const y1 = element.y;
        const x2 = element.x + element.props.x2;
        const y2 = element.y + element.props.y2;

        // Draw line
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = element.props.color || '#ffffff';
        ctx.stroke();

        // Draw arrowhead
        const angle = Math.atan2(y2 - y1, x2 - x1);
        const headLength = 10;
        ctx.beginPath();
        ctx.moveTo(x2, y2);
        ctx.lineTo(x2 - headLength * Math.cos(angle - Math.PI / 6), y2 - headLength * Math.sin(angle - Math.PI / 6));
        ctx.moveTo(x2, y2);
        ctx.lineTo(x2 - headLength * Math.cos(angle + Math.PI / 6), y2 - headLength * Math.sin(angle + Math.PI / 6));
        ctx.stroke();
        break;
    }
  };

  // Import JSON
  const importJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);

        console.log('Importing JSON data:', data);

        // Try to load elements from different possible formats
        let elementsToImport = [];

        if (data.elements && Array.isArray(data.elements)) {
          // Our new format with elements
          elementsToImport = data.elements;
        } else if (data.commands && Array.isArray(data.commands)) {
          // Convert commands to elements (for older formats)
          elementsToImport = data.commands.map((cmd, index) => {
            const id = `imported-${index}-${Date.now()}-${Math.random()}`;

            switch (cmd.type) {
              case 'text':
                return {
                  id,
                  type: 'text',
                  x: cmd.x,
                  y: cmd.y,
                  props: {
                    text: cmd.text,
                    size: cmd.size || 16,
                    color: cmd.color || '#ffffff'
                  }
                };
              case 'rect':
                return {
                  id,
                  type: 'rect',
                  x: cmd.x,
                  y: cmd.y,
                  props: {
                    width: cmd.width,
                    height: cmd.height,
                    color: cmd.color || '#ffffff',
                    filled: cmd.filled || false
                  }
                };
              case 'circle':
                return {
                  id,
                  type: 'circle',
                  x: cmd.x,
                  y: cmd.y,
                  props: {
                    radius: cmd.radius,
                    color: cmd.color || '#ffffff',
                    filled: cmd.filled || false
                  }
                };
              case 'arrow':
                return {
                  id,
                  type: 'arrow',
                  x: cmd.x1,
                  y: cmd.y1,
                  props: {
                    x2: cmd.x2 - cmd.x1,
                    y2: cmd.y2 - cmd.y1,
                    color: cmd.color || '#ffffff'
                  }
                };
              case 'line':
                return {
                  id,
                  type: 'line',
                  x: cmd.x1,
                  y: cmd.y1,
                  props: {
                    x2: cmd.x2 - cmd.x1,
                    y2: cmd.y2 - cmd.y1,
                    color: cmd.color || '#ffffff',
                    width: cmd.width || 1
                  }
                };
              default:
                return null;
            }
          }).filter(Boolean);
        }

        if (elementsToImport.length > 0) {
          // Regenerate IDs to avoid conflicts
          const uniqueElements = elementsToImport.map((element, index) => ({
            ...element,
            id: `imported-${index}-${Date.now()}-${Math.random()}`
          }));

          setElements(uniqueElements);

          // Reset history
          const newHistory = [uniqueElements];
          setHistory(newHistory);
          setHistoryIndex(0);

          showNotification('success', `Scene imported successfully with ${uniqueElements.length} elements`);
        } else {
          showNotification('error', 'No valid elements found in JSON file');
        }

        // Clear the file input
        event.target.value = '';
      } catch (error) {
        console.error('Import error:', error);
        showNotification('error', 'Invalid JSON file');
        event.target.value = '';
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="relative h-screen bg-gray-950">
      {/* Top Toolbar */}
      <div className="absolute top-0 left-0 right-0 bg-gray-900 border-b border-gray-800 p-3 z-10">
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <button
              onClick={undo}
              disabled={historyIndex === 0}
              className="px-3 py-1 bg-gray-800 text-white rounded hover:bg-gray-700 disabled:opacity-50"
              title="Undo (Cmd+Z)"
            >
              ↶ Undo
            </button>
            <button
              onClick={redo}
              disabled={historyIndex === history.length - 1}
              className="px-3 py-1 bg-gray-800 text-white rounded hover:bg-gray-700 disabled:opacity-50"
              title="Redo (Cmd+Shift+Z)"
            >
              ↷ Redo
            </button>
            <div className="border-l border-gray-700 mx-2" />
            <button
              onClick={() => setShowGrid(!showGrid)}
              className={`px-3 py-1 rounded ${showGrid ? 'bg-blue-600' : 'bg-gray-800'} text-white hover:bg-blue-700`}
              title="Toggle Grid (G)"
            >
              Grid
            </button>
            <button
              onClick={() => setSnapToGrid(!snapToGrid)}
              className={`px-3 py-1 rounded ${snapToGrid ? 'bg-blue-600' : 'bg-gray-800'} text-white hover:bg-blue-700`}
            >
              Snap
            </button>
            <button
              onClick={loadAutoSave}
              className="px-3 py-1 bg-gray-800 text-white rounded hover:bg-gray-700"
            >
              Load Autosave
            </button>
          </div>

          <div className="flex gap-2">
            <label className="px-3 py-1 bg-gray-800 text-white rounded hover:bg-gray-700 cursor-pointer">
              Import
              <input type="file" accept=".json" onChange={importJSON} className="hidden" />
            </label>
            <button
              onClick={exportAsJSON}
              className="px-3 py-1 bg-gray-800 text-white rounded hover:bg-gray-700"
            >
              Export JSON
            </button>
            <button
              onClick={exportAsGIF}
              className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              📱 Export GIF
            </button>
            {onSave && (
              <button
                onClick={handleSave}
                className="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700 font-semibold"
                title="Save (Cmd+S)"
              >
                💾 Save
              </button>
            )}
            <button
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className={`px-4 py-1 rounded font-semibold ${
                isPreviewMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-purple-600 hover:bg-purple-700'
              } text-white`}
            >
              {isPreviewMode ? '✏️ Edit' : '👁 Preview'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-full pt-14">
        {/* Left Sidebar - Asset Library */}
        {!isPreviewMode && (
          <div className="w-72 bg-gray-900 border-r border-gray-800 p-4 overflow-y-auto">
            <h3 className="text-xl font-bold text-green-400 mb-4">
              Asset Library
            </h3>

            <div className="space-y-4">
              {/* Add Elements */}
              <div>
                <h4 className="text-sm font-bold text-green-400 mb-2">Add Element</h4>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      const newElement = {
                        id: `text-${Date.now()}-${Math.random()}`,
                        type: 'text',
                        x: 600,
                        y: 350,
                        props: {
                          text: 'New Text',
                          size: 24,
                          color: '#ffffff'
                        },
                        animation: {
                          type: 'fadeIn',
                          duration: 1000,
                          delay: 0,
                          easing: 'ease-in-out',
                          loop: false
                        }
                      };
                      setElements([...elements, newElement]);
                      setSelectedElement(newElement);
                      showNotification('success', 'Text element added');
                    }}
                    className="p-3 bg-green-600 text-white rounded hover:bg-green-700 text-xs font-bold">
                    + Text
                  </button>
                  <button
                    onClick={() => {
                      const newElement = {
                        id: `rect-${Date.now()}-${Math.random()}`,
                        type: 'rect',
                        x: 500,
                        y: 300,
                        props: {
                          width: 200,
                          height: 100,
                          color: '#3b82f6',
                          filled: false
                        },
                        animation: {
                          type: 'slideIn',
                          duration: 1000,
                          delay: 0,
                          easing: 'ease-out',
                          loop: false
                        }
                      };
                      setElements([...elements, newElement]);
                      setSelectedElement(newElement);
                      showNotification('success', 'Rectangle added');
                    }}
                    className="p-3 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs font-bold">
                    + Rectangle
                  </button>
                  <button
                    onClick={() => {
                      const newElement = {
                        id: `arrow-${Date.now()}-${Math.random()}`,
                        type: 'arrow',
                        x: 400,
                        y: 350,
                        props: {
                          x2: 200,
                          y2: 0,
                          color: '#fbbf24'
                        },
                        animation: {
                          type: 'slideIn',
                          duration: 1000,
                          delay: 0,
                          easing: 'ease-out',
                          loop: false
                        }
                      };
                      setElements([...elements, newElement]);
                      setSelectedElement(newElement);
                      showNotification('success', 'Arrow added');
                    }}
                    className="p-3 bg-yellow-600 text-white rounded hover:bg-yellow-700 text-xs font-bold">
                    + Arrow
                  </button>
                  <button
                    onClick={() => {
                      const newElement = {
                        id: `circle-${Date.now()}-${Math.random()}`,
                        type: 'circle',
                        x: 600,
                        y: 350,
                        props: {
                          radius: 50,
                          color: '#ef4444',
                          filled: false
                        },
                        animation: {
                          type: 'zoomIn',
                          duration: 1000,
                          delay: 0,
                          easing: 'ease-out',
                          loop: false
                        }
                      };
                      setElements([...elements, newElement]);
                      setSelectedElement(newElement);
                      showNotification('success', 'Circle added');
                    }}
                    className="p-3 bg-red-600 text-white rounded hover:bg-red-700 text-xs font-bold">
                    + Circle
                  </button>
                </div>
              </div>

              {/* Quick Templates */}
              <div>
                <h4 className="text-sm font-bold text-blue-400 mb-2">Quick Templates</h4>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      const dockerElements = [
                        {
                          id: `title-${Date.now()}-1`,
                          type: 'text',
                          x: 600,
                          y: 100,
                          props: { text: 'Docker Setup', size: 36, color: '#4ade80' }
                        },
                        {
                          id: `container-${Date.now()}-1`,
                          type: 'rect',
                          x: 200,
                          y: 200,
                          props: { width: 300, height: 200, color: '#3b82f6', filled: true }
                        },
                        {
                          id: `label-${Date.now()}-1`,
                          type: 'text',
                          x: 350,
                          y: 300,
                          props: { text: 'Container', size: 28, color: '#ffffff' }
                        },
                        {
                          id: `arrow-${Date.now()}-1`,
                          type: 'arrow',
                          x: 500,
                          y: 300,
                          props: { x2: 200, y2: 0, color: '#fbbf24' }
                        },
                        {
                          id: `app-${Date.now()}-1`,
                          type: 'rect',
                          x: 700,
                          y: 200,
                          props: { width: 300, height: 200, color: '#ef4444', filled: true }
                        },
                        {
                          id: `label2-${Date.now()}-1`,
                          type: 'text',
                          x: 850,
                          y: 300,
                          props: { text: 'Application', size: 28, color: '#ffffff' }
                        }
                      ];
                      setElements(dockerElements);
                      showNotification('success', 'Docker template loaded');
                    }}
                    className="p-3 bg-gray-800 text-white rounded hover:bg-gray-700 text-xs">
                    Docker Setup
                  </button>
                  <button
                    onClick={() => {
                      const apiElements = [
                        {
                          id: `title-${Date.now()}-2`,
                          type: 'text',
                          x: 600,
                          y: 80,
                          props: { text: 'API Flow', size: 36, color: '#4ade80' }
                        },
                        {
                          id: `client-${Date.now()}-2`,
                          type: 'circle',
                          x: 200,
                          y: 300,
                          props: { radius: 60, color: '#3b82f6', filled: true }
                        },
                        {
                          id: `client-text-${Date.now()}-2`,
                          type: 'text',
                          x: 200,
                          y: 300,
                          props: { text: 'Client', size: 20, color: '#ffffff' }
                        },
                        {
                          id: `arrow1-${Date.now()}-2`,
                          type: 'arrow',
                          x: 260,
                          y: 300,
                          props: { x2: 240, y2: 0, color: '#4ade80' }
                        },
                        {
                          id: `api-${Date.now()}-2`,
                          type: 'rect',
                          x: 500,
                          y: 250,
                          props: { width: 200, height: 100, color: '#fbbf24', filled: false }
                        },
                        {
                          id: `api-text-${Date.now()}-2`,
                          type: 'text',
                          x: 600,
                          y: 300,
                          props: { text: 'API Gateway', size: 20, color: '#fbbf24' }
                        },
                        {
                          id: `arrow2-${Date.now()}-2`,
                          type: 'arrow',
                          x: 700,
                          y: 300,
                          props: { x2: 200, y2: 0, color: '#4ade80' }
                        },
                        {
                          id: `db-${Date.now()}-2`,
                          type: 'circle',
                          x: 950,
                          y: 300,
                          props: { radius: 60, color: '#ef4444', filled: true }
                        },
                        {
                          id: `db-text-${Date.now()}-2`,
                          type: 'text',
                          x: 950,
                          y: 300,
                          props: { text: 'Database', size: 20, color: '#ffffff' }
                        }
                      ];
                      setElements(apiElements);
                      showNotification('success', 'API Flow template loaded');
                    }}
                    className="p-3 bg-gray-800 text-white rounded hover:bg-gray-700 text-xs">
                    API Flow
                  </button>
                  <button
                    onClick={() => {
                      const dbElements = [
                        {
                          id: `title-${Date.now()}-3`,
                          type: 'text',
                          x: 600,
                          y: 80,
                          props: { text: 'Database Schema', size: 36, color: '#4ade80' }
                        },
                        {
                          id: `table1-${Date.now()}-3`,
                          type: 'rect',
                          x: 200,
                          y: 200,
                          props: { width: 250, height: 150, color: '#3b82f6', filled: false }
                        },
                        {
                          id: `table1-name-${Date.now()}-3`,
                          type: 'text',
                          x: 325,
                          y: 230,
                          props: { text: 'Users Table', size: 20, color: '#3b82f6' }
                        },
                        {
                          id: `table2-${Date.now()}-3`,
                          type: 'rect',
                          x: 500,
                          y: 200,
                          props: { width: 250, height: 150, color: '#fbbf24', filled: false }
                        },
                        {
                          id: `table2-name-${Date.now()}-3`,
                          type: 'text',
                          x: 625,
                          y: 230,
                          props: { text: 'Orders Table', size: 20, color: '#fbbf24' }
                        },
                        {
                          id: `table3-${Date.now()}-3`,
                          type: 'rect',
                          x: 800,
                          y: 200,
                          props: { width: 250, height: 150, color: '#ef4444', filled: false }
                        },
                        {
                          id: `table3-name-${Date.now()}-3`,
                          type: 'text',
                          x: 925,
                          y: 230,
                          props: { text: 'Products Table', size: 20, color: '#ef4444' }
                        },
                        {
                          id: `relation1-${Date.now()}-3`,
                          type: 'arrow',
                          x: 450,
                          y: 275,
                          props: { x2: 50, y2: 0, color: '#4ade80' }
                        },
                        {
                          id: `relation2-${Date.now()}-3`,
                          type: 'arrow',
                          x: 750,
                          y: 275,
                          props: { x2: 50, y2: 0, color: '#4ade80' }
                        }
                      ];
                      setElements(dbElements);
                      showNotification('success', 'Database template loaded');
                    }}
                    className="p-3 bg-gray-800 text-white rounded hover:bg-gray-700 text-xs">
                    Database
                  </button>
                  <button
                    onClick={() => {
                      const networkElements = [
                        {
                          id: `title-${Date.now()}-4`,
                          type: 'text',
                          x: 600,
                          y: 80,
                          props: { text: 'Network Architecture', size: 36, color: '#4ade80' }
                        },
                        {
                          id: `internet-${Date.now()}-4`,
                          type: 'circle',
                          x: 600,
                          y: 150,
                          props: { radius: 40, color: '#3b82f6', filled: true }
                        },
                        {
                          id: `internet-text-${Date.now()}-4`,
                          type: 'text',
                          x: 600,
                          y: 150,
                          props: { text: 'Internet', size: 16, color: '#ffffff' }
                        },
                        {
                          id: `firewall-${Date.now()}-4`,
                          type: 'rect',
                          x: 500,
                          y: 250,
                          props: { width: 200, height: 60, color: '#ef4444', filled: true }
                        },
                        {
                          id: `firewall-text-${Date.now()}-4`,
                          type: 'text',
                          x: 600,
                          y: 280,
                          props: { text: 'Firewall', size: 20, color: '#ffffff' }
                        },
                        {
                          id: `server1-${Date.now()}-4`,
                          type: 'rect',
                          x: 300,
                          y: 400,
                          props: { width: 150, height: 100, color: '#fbbf24', filled: false }
                        },
                        {
                          id: `server1-text-${Date.now()}-4`,
                          type: 'text',
                          x: 375,
                          y: 450,
                          props: { text: 'Web Server', size: 16, color: '#fbbf24' }
                        },
                        {
                          id: `server2-${Date.now()}-4`,
                          type: 'rect',
                          x: 525,
                          y: 400,
                          props: { width: 150, height: 100, color: '#fbbf24', filled: false }
                        },
                        {
                          id: `server2-text-${Date.now()}-4`,
                          type: 'text',
                          x: 600,
                          y: 450,
                          props: { text: 'App Server', size: 16, color: '#fbbf24' }
                        },
                        {
                          id: `server3-${Date.now()}-4`,
                          type: 'rect',
                          x: 750,
                          y: 400,
                          props: { width: 150, height: 100, color: '#fbbf24', filled: false }
                        },
                        {
                          id: `server3-text-${Date.now()}-4`,
                          type: 'text',
                          x: 825,
                          y: 450,
                          props: { text: 'DB Server', size: 16, color: '#fbbf24' }
                        }
                      ];
                      setElements(networkElements);
                      showNotification('success', 'Network template loaded');
                    }}
                    className="p-3 bg-gray-800 text-white rounded hover:bg-gray-700 text-xs">
                    Network
                  </button>
                </div>
              </div>

              {/* Elements List */}
              <div>
                <h4 className="text-sm font-bold text-yellow-400 mb-2">Scene Elements</h4>
                <div className="space-y-1 max-h-64 overflow-y-auto">
                  {elements.map((element, index) => (
                    <div
                      key={element.id}
                      onClick={() => setSelectedElement(element)}
                      className={`p-2 rounded cursor-pointer text-sm flex justify-between items-center ${
                        selectedElement?.id === element.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      <span>{element.type} #{index + 1}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setElements(elements.filter(el => el.id !== element.id));
                        }}
                        className="text-red-400 hover:text-red-300"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Canvas Area */}
        <div className="flex-1 flex items-center justify-center bg-gray-950 relative p-4 overflow-hidden">
          {isPreviewMode ? (
            <div className="w-full h-full flex items-center justify-center overflow-hidden">
              <div className="relative" style={{ maxWidth: '100%', maxHeight: 'calc(100vh - 300px)' }}>
                <DrawingEngine
                  commands={generateCommands()}
                  width={1200}
                  height={700}
                  speed={1}
                  autoPlay={true}
                  loop={true}
                />
              </div>
            </div>
          ) : (
            <div className="relative w-full h-full flex items-center justify-center">
              <canvas
                ref={canvasRef}
                width={1200}
                height={700}
                className="border border-gray-800 bg-black max-w-full"
                style={{
                  backgroundImage: showGrid
                    ? 'repeating-linear-gradient(0deg, #111 0, #111 1px, transparent 1px, transparent 50px), repeating-linear-gradient(90deg, #111 0, #111 1px, transparent 1px, transparent 50px)'
                    : undefined,
                  maxHeight: 'calc(100vh - 300px)'
                }}
              />
              <div className="absolute top-2 left-2 text-xs text-gray-500">
                {elements.length} elements • {selectedElement ? `Selected: ${selectedElement.type}` : 'Click to select'}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar - Properties */}
        {!isPreviewMode && selectedElement && (
          <div className="w-72 bg-gray-900 border-l border-gray-800 p-4">
            <h3 className="text-xl font-bold text-purple-400 mb-4">
              Properties
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400">Type</label>
                <div className="text-white font-semibold">{selectedElement.type}</div>
              </div>

              <div>
                <label className="text-sm text-gray-400">Position</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={selectedElement.x}
                    onChange={(e) => {
                      const updated = { ...selectedElement, x: Number(e.target.value) };
                      setElements(elements.map(el => el.id === selectedElement.id ? updated : el));
                      setSelectedElement(updated);
                    }}
                    className="w-20 px-2 py-1 bg-gray-800 text-white rounded"
                    placeholder="X"
                  />
                  <input
                    type="number"
                    value={selectedElement.y}
                    onChange={(e) => {
                      const updated = { ...selectedElement, y: Number(e.target.value) };
                      setElements(elements.map(el => el.id === selectedElement.id ? updated : el));
                      setSelectedElement(updated);
                    }}
                    className="w-20 px-2 py-1 bg-gray-800 text-white rounded"
                    placeholder="Y"
                  />
                </div>
              </div>

              {selectedElement.type === 'text' && selectedElement.props.text !== undefined && (
                <div>
                  <label className="text-sm text-gray-400">Text Content</label>
                  <input
                    type="text"
                    value={selectedElement.props.text}
                    onChange={(e) => {
                      const updated = {
                        ...selectedElement,
                        props: { ...selectedElement.props, text: e.target.value }
                      };
                      setElements(elements.map(el => el.id === selectedElement.id ? updated : el));
                      setSelectedElement(updated);
                    }}
                    className="w-full px-3 py-2 bg-gray-800 text-white rounded"
                    placeholder="Enter text..."
                  />
                </div>
              )}

              {selectedElement.type === 'text' && selectedElement.props.size !== undefined && (
                <div>
                  <label className="text-sm text-gray-400">Font Size</label>
                  <input
                    type="number"
                    value={selectedElement.props.size}
                    onChange={(e) => {
                      const updated = {
                        ...selectedElement,
                        props: { ...selectedElement.props, size: parseInt(e.target.value) }
                      };
                      setElements(elements.map(el => el.id === selectedElement.id ? updated : el));
                      setSelectedElement(updated);
                    }}
                    className="w-full px-3 py-2 bg-gray-800 text-white rounded"
                    min="10"
                    max="100"
                  />
                </div>
              )}

              {selectedElement.props.color && (
                <div>
                  <label className="text-sm text-gray-400">Color</label>
                  <input
                    type="color"
                    value={selectedElement.props.color}
                    onChange={(e) => {
                      const updated = {
                        ...selectedElement,
                        props: { ...selectedElement.props, color: e.target.value }
                      };
                      setElements(elements.map(el => el.id === selectedElement.id ? updated : el));
                      setSelectedElement(updated);
                    }}
                    className="w-full h-10 bg-gray-800 rounded cursor-pointer"
                  />
                </div>
              )}

              {/* Animation Properties */}
              {selectedElement.animation && (
                <div className="border-t border-gray-700 pt-4">
                  <h4 className="text-sm font-bold text-green-400 mb-3">Animation</h4>

                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-400">Animation Type</label>
                      <select
                        value={selectedElement.animation.type}
                        onChange={(e) => {
                          const updated = {
                            ...selectedElement,
                            animation: { ...selectedElement.animation, type: e.target.value }
                          };
                          setElements(elements.map(el => el.id === selectedElement.id ? updated : el));
                          setSelectedElement(updated);
                        }}
                        className="w-full px-3 py-2 bg-gray-800 text-white rounded"
                      >
                        <option value="fadeIn">Fade In</option>
                        <option value="slideIn">Slide In</option>
                        <option value="zoomIn">Zoom In</option>
                        <option value="typewriter">Typewriter</option>
                        <option value="morphing">Morphing</option>
                        <option value="none">No Animation</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm text-gray-400">Duration (ms)</label>
                      <input
                        type="number"
                        value={selectedElement.animation.duration}
                        onChange={(e) => {
                          const updated = {
                            ...selectedElement,
                            animation: { ...selectedElement.animation, duration: parseInt(e.target.value) }
                          };
                          setElements(elements.map(el => el.id === selectedElement.id ? updated : el));
                          setSelectedElement(updated);
                        }}
                        className="w-full px-3 py-2 bg-gray-800 text-white rounded"
                        min="100"
                        max="5000"
                        step="100"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-gray-400">Delay (ms)</label>
                      <input
                        type="number"
                        value={selectedElement.animation.delay}
                        onChange={(e) => {
                          const updated = {
                            ...selectedElement,
                            animation: { ...selectedElement.animation, delay: parseInt(e.target.value) }
                          };
                          setElements(elements.map(el => el.id === selectedElement.id ? updated : el));
                          setSelectedElement(updated);
                        }}
                        className="w-full px-3 py-2 bg-gray-800 text-white rounded"
                        min="0"
                        max="10000"
                        step="100"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-gray-400">Easing</label>
                      <select
                        value={selectedElement.animation.easing}
                        onChange={(e) => {
                          const updated = {
                            ...selectedElement,
                            animation: { ...selectedElement.animation, easing: e.target.value }
                          };
                          setElements(elements.map(el => el.id === selectedElement.id ? updated : el));
                          setSelectedElement(updated);
                        }}
                        className="w-full px-3 py-2 bg-gray-800 text-white rounded"
                      >
                        <option value="ease">Ease</option>
                        <option value="ease-in">Ease In</option>
                        <option value="ease-out">Ease Out</option>
                        <option value="ease-in-out">Ease In Out</option>
                        <option value="linear">Linear</option>
                        <option value="bounce">Bounce</option>
                        <option value="elastic">Elastic</option>
                      </select>
                    </div>

                    <div>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedElement.animation.loop}
                          onChange={(e) => {
                            const updated = {
                              ...selectedElement,
                              animation: { ...selectedElement.animation, loop: e.target.checked }
                            };
                            setElements(elements.map(el => el.id === selectedElement.id ? updated : el));
                            setSelectedElement(updated);
                          }}
                          className="form-checkbox bg-gray-800 text-green-500"
                        />
                        <span className="text-sm text-gray-400">Loop Animation</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={deleteSelectedElement}
                className="w-full px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete Element
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className={`fixed bottom-4 right-4 px-4 py-2 rounded-lg text-white shadow-lg z-50 ${
          notification.type === 'success' ? 'bg-green-600' :
          notification.type === 'error' ? 'bg-red-600' : 'bg-blue-600'
        }`}>
          {notification.message}
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
            <p className="text-white mt-4">Loading...</p>
          </div>
        </div>
      )}
    </div>
  );
}