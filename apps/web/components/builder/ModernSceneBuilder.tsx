"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import GIF from 'gif.js';
import AssetsLibrary from './AssetsLibrary';
import { ParticleField, ParticleFieldArtElement } from '@/components/art/generators/ParticleField';
import { ArtAdapter, ArtConfig } from '@/lib/art-adapter';

interface CanvasElement {
  id: string;
  type: 'text' | 'rect' | 'circle' | 'arrow' | 'image' | 'line' | 'group';
  x: number;
  y: number;
  props: any;
  animation?: {
    type: 'fadeIn' | 'slideIn' | 'zoomIn' | 'rotate' | 'bounce';
    duration: number;
    delay: number;
    easing: string;
  };
  locked?: boolean;
  visible?: boolean;
  groupId?: string;
  children?: string[];
}

type ResizeHandle = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w';

interface ModernSceneBuilderProps {
  initialCommands?: any[];
  onSave?: (elements: CanvasElement[]) => void;
}

// Pre-designed color palettes
const colorPalettes = {
  modern: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
  pastel: ['#FCA5A5', '#FDE68A', '#A7F3D0', '#BFDBFE', '#DDD6FE'],
  dark: ['#1E293B', '#334155', '#475569', '#64748B', '#94A3B8'],
  neon: ['#00FF00', '#FF00FF', '#00FFFF', '#FF00FF', '#FFFF00']
};

export default function ModernSceneBuilder({ initialCommands = [], onSave }: ModernSceneBuilderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageCache = useRef<Map<string, HTMLImageElement>>(new Map());
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<CanvasElement | null>(null);
  const [selectedElements, setSelectedElements] = useState<Set<string>>(new Set());

  // History for undo/redo functionality
  const [history, setHistory] = useState<CanvasElement[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Save state to history for undo/redo
  const saveToHistory = (newElements: CanvasElement[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([...newElements]);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // Undo function
  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setElements([...history[newIndex]]);
      setHistoryIndex(newIndex);
      setSelectedElement(null);
      setSelectedElements(new Set());
    }
  };

  // Redo function
  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setElements([...history[newIndex]]);
      setHistoryIndex(newIndex);
      setSelectedElement(null);
      setSelectedElements(new Set());
    }
  };
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeMode, setResizeMode] = useState<ResizeHandle | null>(null);
  const [resizeStart, setResizeStart] = useState<{x: number; y: number; element: CanvasElement} | null>(null);
  const [canvasScale, setCanvasScale] = useState(1);
  const [showGrid, setShowGrid] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [currentPalette, setCurrentPalette] = useState<keyof typeof colorPalettes>('modern');
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationFrame, setAnimationFrame] = useState(0);
  const [isPanning, setIsPanning] = useState(false);
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [activeTab, setActiveTab] = useState<'templates' | 'assets' | 'lab'>('templates');
  const [artMode, setArtMode] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionRect, setSelectionRect] = useState<{x: number; y: number; width: number; height: number} | null>(null);
  const [selectionStart, setSelectionStart] = useState<{x: number; y: number} | null>(null);
  const [lockAspectRatio, setLockAspectRatio] = useState(false);

  // Error handling and notifications
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  // Performance optimization flags
  const [needsRender, setNeedsRender] = useState(true);
  const renderTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastRenderTime = useRef<number>(0);

  // Add error to notification queue
  const addError = useCallback((message: string) => {
    setErrors(prev => [...prev, `${Date.now()}: ${message}`]);
    setTimeout(() => {
      setErrors(prev => prev.slice(1));
    }, 5000);
  }, []);

  // Show loading state
  const showLoading = useCallback((message: string) => {
    setIsLoading(true);
    setLoadingMessage(message);
  }, []);

  // Hide loading state
  const hideLoading = useCallback(() => {
    setIsLoading(false);
    setLoadingMessage('');
  }, []);

  // Memory management - clean up unused images
  const cleanupImageCache = useCallback(() => {
    const usedSources = new Set<string>();
    elements.forEach(element => {
      if (element.type === 'image' && element.props.src) {
        usedSources.add(element.props.src);
      }
    });

    // Remove unused images from cache
    const currentCache = imageCache.current;
    for (const [src] of currentCache.entries()) {
      if (!usedSources.has(src)) {
        currentCache.delete(src);
      }
    }
  }, [elements]);

  // Cleanup cache when elements change
  useEffect(() => {
    // Debounce cleanup to avoid too frequent calls
    const timeout = setTimeout(cleanupImageCache, 2000);
    return () => clearTimeout(timeout);
  }, [cleanupImageCache]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (renderTimeoutRef.current) {
        clearTimeout(renderTimeoutRef.current);
      }
      imageCache.current.clear();
    };
  }, []);

  // Canvas dimensions - true 16:9
  const CANVAS_WIDTH = 1920;
  const CANVAS_HEIGHT = 1080;
  const GRID_SIZE = 30;

  // Calculate appropriate canvas scale based on viewport and auto-fit on load
  useEffect(() => {
    const calculateScale = () => {
      const container = document.getElementById('canvas-container');
      if (container) {
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        // Calculate scale to fit canvas with padding (similar to Fit button logic)
        const scaleX = (containerWidth - 64) / CANVAS_WIDTH;
        const scaleY = (containerHeight - 64) / CANVAS_HEIGHT;
        const scale = Math.min(scaleX, scaleY, 1); // Fit to container, max 100%
        setCanvasScale(scale);
        setCanvasOffset({ x: 0, y: 0 }); // Reset position to center
      }
    };

    // Delay for DOM ready
    setTimeout(calculateScale, 100);
    window.addEventListener('resize', calculateScale);
    return () => window.removeEventListener('resize', calculateScale);
  }, []);

  // Initialize from commands
  useEffect(() => {
    if (initialCommands && initialCommands.length > 0) {
      const converted = initialCommands.map((cmd: any, index: number) => {
        const element: CanvasElement = {
          id: `element-${Date.now()}-${index}`,
          type: cmd.type || 'text',
          x: cmd.x || CANVAS_WIDTH / 2,
          y: cmd.y || CANVAS_HEIGHT / 2,
          props: {},
          animation: {
            type: 'fadeIn',
            duration: 1000,
            delay: index * 100,
            easing: 'ease-out'
          }
        };

        // Map properties based on type
        switch (cmd.type) {
          case 'text':
            element.props = {
              text: cmd.text || 'Text',
              size: cmd.size || 48,
              color: cmd.color || '#FFFFFF',
              font: cmd.font || 'Inter, sans-serif',
              weight: cmd.weight || 'normal',
              align: cmd.align || 'center'
            };
            break;
          case 'rect':
            element.props = {
              width: cmd.width || 200,
              height: cmd.height || 100,
              color: cmd.color || colorPalettes[currentPalette][0],
              filled: cmd.filled !== false,
              borderRadius: cmd.borderRadius || 8,
              borderWidth: cmd.borderWidth || 2
            };
            break;
          case 'circle':
            element.props = {
              radius: cmd.radius || 50,
              color: cmd.color || colorPalettes[currentPalette][1],
              filled: cmd.filled !== false,
              borderWidth: cmd.borderWidth || 2
            };
            break;
          case 'arrow':
            element.props = {
              endX: cmd.endX || element.x + 100,
              endY: cmd.endY || element.y,
              color: cmd.color || colorPalettes[currentPalette][2],
              strokeWidth: cmd.strokeWidth || 3,
              arrowSize: 15
            };
            break;
          case 'line':
            element.props = {
              endX: cmd.endX || element.x + 100,
              endY: cmd.endY || element.y,
              color: cmd.color || '#94A3B8',
              strokeWidth: cmd.strokeWidth || 2,
              dashed: cmd.dashed || false
            };
            break;
        }

        return element;
      });
      setElements(converted);
    }
  }, [initialCommands, currentPalette]);

  // Add new element
  const addElement = (type: CanvasElement['type']) => {
    console.log('Adding element:', type);
    const colors = colorPalettes[currentPalette];
    const newElement: CanvasElement = {
      id: `element-${Date.now()}`,
      type,
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT / 2,
      props: {},
      animation: {
        type: 'fadeIn',
        duration: 1000,
        delay: elements.length * 100,
        easing: 'ease-out'
      }
    };

    switch (type) {
      case 'text':
        newElement.props = {
          text: 'New Text',
          size: 72,
          color: '#FFFFFF',
          font: 'Inter, sans-serif',
          weight: 'bold',
          align: 'center'
        };
        break;
      case 'rect':
        newElement.props = {
          width: 300,
          height: 150,
          color: colors[0],
          filled: true,
          borderRadius: 12,
          borderWidth: 0
        };
        break;
      case 'circle':
        newElement.props = {
          radius: 80,
          color: colors[1],
          filled: true,
          borderWidth: 0
        };
        break;
      case 'arrow':
        newElement.props = {
          endX: newElement.x + 150,
          endY: newElement.y,
          color: colors[2],
          strokeWidth: 4,
          arrowSize: 20
        };
        break;
      case 'line':
        newElement.props = {
          endX: newElement.x + 200,
          endY: newElement.y + 50,
          color: '#3B82F6',
          strokeWidth: 3,
          dashed: false
        };
        break;
      case 'image':
        newElement.props = {
          src: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150"><rect width="150" height="150" fill="%23374151"/><text x="75" y="75" text-anchor="middle" fill="%239ca3af" font-size="16">Placeholder</text></svg>',
          width: 150,
          height: 150,
          name: 'New Image'
        };
        break;
    }

    const newElements = [...elements, newElement];
    setElements(newElements);
    setSelectedElement(newElement);
    saveToHistory(newElements);
  };

  // Delete element(s)
  const deleteElement = () => {
    let newElements;
    if (selectedElements.size > 0) {
      newElements = elements.filter(el => !selectedElements.has(el.id));
      setElements(newElements);
      setSelectedElements(new Set());
      setSelectedElement(null);
      saveToHistory(newElements);
    } else if (selectedElement) {
      newElements = elements.filter(el => el.id !== selectedElement.id);
      setElements(newElements);
      setSelectedElement(null);
      saveToHistory(newElements);
    }
  };

  // Duplicate element
  const duplicateElement = () => {
    if (selectedElement) {
      const duplicated = {
        ...selectedElement,
        id: `element-${Date.now()}`,
        x: selectedElement.x + 30,
        y: selectedElement.y + 30
      };
      const newElements = [...elements, duplicated];
      setElements(newElements);
      setSelectedElement(duplicated);
      saveToHistory(newElements);
    }
  };

  // Group selected elements
  const groupElements = () => {
    if (selectedElements.size < 2) return;

    const groupId = `group-${Date.now()}`;
    const groupedElements = elements.filter(el => selectedElements.has(el.id));

    // Calculate center position of group
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;

    groupedElements.forEach(el => {
      minX = Math.min(minX, el.x);
      maxX = Math.max(maxX, el.x);
      minY = Math.min(minY, el.y);
      maxY = Math.max(maxY, el.y);
    });

    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    // Create group element
    const groupElement: CanvasElement = {
      id: groupId,
      type: 'group',
      x: centerX,
      y: centerY,
      props: {
        width: maxX - minX + 100,
        height: maxY - minY + 100
      },
      children: Array.from(selectedElements)
    };

    // Update children elements to reference the group
    const updatedElements = elements.map(el => {
      if (selectedElements.has(el.id)) {
        return { ...el, groupId };
      }
      return el;
    });

    setElements([...updatedElements, groupElement]);
    setSelectedElements(new Set([groupId]));
    setSelectedElement(groupElement);
  };

  // Ungroup elements
  const ungroupElements = () => {
    const groupsToUngroup = elements.filter(el =>
      el.type === 'group' && selectedElements.has(el.id)
    );

    if (groupsToUngroup.length === 0) return;

    const childIds = new Set<string>();
    groupsToUngroup.forEach(group => {
      group.children?.forEach(id => childIds.add(id));
    });

    // Remove group reference from children and remove group elements
    const updatedElements = elements
      .filter(el => !groupsToUngroup.some(g => g.id === el.id))
      .map(el => {
        if (childIds.has(el.id)) {
          const { groupId, ...rest } = el;
          return rest;
        }
        return el;
      });

    setElements(updatedElements);
    setSelectedElements(childIds);
  };

  // Select all elements
  const selectAll = () => {
    const allIds = new Set(elements.map(el => el.id));
    setSelectedElements(allIds);
  };

  // Update element property
  const updateElement = (id: string, updates: Partial<CanvasElement>, saveHistory: boolean = true) => {
    const newElements = elements.map(el =>
      el.id === id ? { ...el, ...updates } : el
    );
    setElements(newElements);
    if (selectedElement?.id === id) {
      // Find the updated element from newElements to ensure we have the latest data
      const updatedElement = newElements.find(el => el.id === id);
      if (updatedElement) {
        setSelectedElement(updatedElement);
      }
    }
    if (saveHistory) {
      saveToHistory(newElements);
    }
  };

  // Keyboard handlers for panning
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Space for panning
      if (e.code === 'Space') {
        e.preventDefault();
        if (!e.repeat) {
          setIsPanning(true);
          document.body.style.cursor = 'grab';
        }
      }

      // Delete key
      if (e.key === 'Delete' || e.key === 'Backspace') {
        deleteElement();
      }

      // Cmd/Ctrl+A to select all
      if ((e.metaKey || e.ctrlKey) && e.key === 'a') {
        e.preventDefault();
        selectAll();
      }

      // Cmd/Ctrl+Z for undo
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }

      // Cmd/Ctrl+Y or Cmd/Ctrl+Shift+Z for redo
      if (((e.metaKey || e.ctrlKey) && e.key === 'y') ||
          ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'z')) {
        e.preventDefault();
        redo();
      }

      // Cmd/Ctrl+D for duplicate
      if ((e.metaKey || e.ctrlKey) && e.key === 'd') {
        e.preventDefault();
        duplicateElement();
      }

      // Cmd/Ctrl+G to group
      if ((e.metaKey || e.ctrlKey) && e.key === 'g' && !e.shiftKey) {
        e.preventDefault();
        groupElements();
      }

      // Cmd/Ctrl+Shift+G for ungroup
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'g') {
        e.preventDefault();
        ungroupElements();
      }

      // Escape to deselect all
      if (e.key === 'Escape') {
        setSelectedElement(null);
        setSelectedElements(new Set());
      }

      // Cmd/Ctrl+Shift+G to ungroup
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'G') {
        e.preventDefault();
        ungroupElements();
      }

      // Cmd/Ctrl+D to duplicate
      if ((e.metaKey || e.ctrlKey) && e.key === 'd') {
        e.preventDefault();
        duplicateElement();
      }

      // Escape to clear selection
      if (e.key === 'Escape') {
        setSelectedElements(new Set());
        setSelectedElement(null);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault(); // Prevent default on keyup too
        setIsPanning(false);
        document.body.style.cursor = 'default';
      }
    };

    // Also prevent space key during capture phase
    const preventSpaceScroll = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('keydown', preventSpaceScroll, true); // Capture phase
    window.addEventListener('keyup', preventSpaceScroll, true); // Capture phase

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('keydown', preventSpaceScroll, true);
      window.removeEventListener('keyup', preventSpaceScroll, true);
      document.body.style.cursor = 'default';
    };
  }, [selectedElement, selectedElements, elements]);

  // Get resize handle at position
  const getResizeHandle = (element: CanvasElement, x: number, y: number): ResizeHandle | null => {
    const handleSize = 35; // Significantly increased to 35px for much easier clicking


    // Special handling for lines and arrows - only allow endpoint dragging
    if (element.type === 'line' || element.type === 'arrow') {
      const endX = element.props.endX || element.x + 200;
      const endY = element.props.endY || element.y;

      // Check if near start point
      if (Math.abs(x - element.x) <= handleSize && Math.abs(y - element.y) <= handleSize) {
        return 'nw'; // Use nw to represent start point
      }
      // Check if near end point
      if (Math.abs(x - endX) <= handleSize && Math.abs(y - endY) <= handleSize) {
        return 'se'; // Use se to represent end point
      }
      return null;
    }

    let bounds = { x: 0, y: 0, width: 0, height: 0 };

    switch (element.type) {
      case 'rect':
      case 'image':
        const width = element.props.width || 100;
        const height = element.props.height || 100;
        bounds = {
          x: element.x - width / 2 - 10,
          y: element.y - height / 2 - 10,
          width: width + 20,
          height: height + 20
        };
        break;
      case 'circle':
        const radius = element.props.radius || 50;
        bounds = {
          x: element.x - radius - 10,
          y: element.y - radius - 10,
          width: radius * 2 + 20,
          height: radius * 2 + 20
        };
        break;
      case 'text':
        const textWidth = element.props.text.length * element.props.size * 0.5;
        bounds = {
          x: element.x - textWidth/2 - 10,
          y: element.y - element.props.size/2 - 10,
          width: textWidth + 20,
          height: element.props.size + 20
        };
        break;
    }

    const handles: { x: number; y: number; handle: ResizeHandle }[] = [
      { x: bounds.x, y: bounds.y, handle: 'nw' },
      { x: bounds.x + bounds.width / 2, y: bounds.y, handle: 'n' },
      { x: bounds.x + bounds.width, y: bounds.y, handle: 'ne' },
      { x: bounds.x + bounds.width, y: bounds.y + bounds.height / 2, handle: 'e' },
      { x: bounds.x + bounds.width, y: bounds.y + bounds.height, handle: 'se' },
      { x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height, handle: 's' },
      { x: bounds.x, y: bounds.y + bounds.height, handle: 'sw' },
      { x: bounds.x, y: bounds.y + bounds.height / 2, handle: 'w' }
    ];

    for (const { x: hx, y: hy, handle } of handles) {
      const distX = Math.abs(x - hx);
      const distY = Math.abs(y - hy);
      if (distX <= handleSize && distY <= handleSize) {
        return handle;
      }
    }

    return null;
  };

  // Mouse handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    // Handle panning
    if (isPanning) {
      setPanStart({ x: e.clientX - canvasOffset.x, y: e.clientY - canvasOffset.y });
      document.body.style.cursor = 'grabbing';
      return;
    }

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (e.clientX - rect.left) / canvasScale;
    const y = (e.clientY - rect.top) / canvasScale;

    // Find clicked element
    const clicked = elements.slice().reverse().find(el => {
      switch (el.type) {
        case 'text':
          const textWidth = el.props.text.length * el.props.size * 0.5;
          const textHeight = el.props.size;
          return x >= el.x - textWidth/2 && x <= el.x + textWidth/2 &&
                 y >= el.y - textHeight/2 && y <= el.y + textHeight/2;
        case 'rect':
          return x >= el.x - el.props.width/2 && x <= el.x + el.props.width/2 &&
                 y >= el.y - el.props.height/2 && y <= el.y + el.props.height/2;
        case 'circle':
          const dx = x - el.x;
          const dy = y - el.y;
          return Math.sqrt(dx*dx + dy*dy) <= el.props.radius;
        case 'arrow':
        case 'line':
          // Check if click is near the line
          const lineVec = { x: el.props.endX - el.x, y: el.props.endY - el.y };
          const clickVec = { x: x - el.x, y: y - el.y };
          const lineLen = Math.sqrt(lineVec.x * lineVec.x + lineVec.y * lineVec.y);
          const t = Math.max(0, Math.min(1,
            (clickVec.x * lineVec.x + clickVec.y * lineVec.y) / (lineLen * lineLen)
          ));
          const projX = el.x + t * lineVec.x;
          const projY = el.y + t * lineVec.y;
          const dist = Math.sqrt((x - projX) * (x - projX) + (y - projY) * (y - projY));
          return dist <= 10;
        case 'image':
          const imgWidth = el.props.width || 100;
          const imgHeight = el.props.height || 100;
          return x >= el.x - imgWidth/2 && x <= el.x + imgWidth/2 &&
                 y >= el.y - imgHeight/2 && y <= el.y + imgHeight/2;
        case 'group':
          // For groups, use bounding box (similar to rect)
          const groupWidth = el.props.width || 100;
          const groupHeight = el.props.height || 100;
          return x >= el.x - groupWidth/2 && x <= el.x + groupWidth/2 &&
                 y >= el.y - groupHeight/2 && y <= el.y + groupHeight/2;
        default:
          console.warn('Unknown element type in click detection:', el.type);
          return false;
      }
    });

    if (clicked) {
      // First check if this element is already selected
      const isAlreadySelected = selectedElement?.id === clicked.id || selectedElements.has(clicked.id);

      // If already selected, check for resize handle
      if (isAlreadySelected) {
        const handle = getResizeHandle(clicked, x, y);

        if (handle) {
          // Start resizing
          console.log('🎯 Resize handle detected:', handle, 'for element:', clicked.type, clicked.id);
          setResizeMode(handle);
          setResizeStart({ x, y, element: { ...clicked } });
          setIsDragging(false);
          e.stopPropagation();
          return;
        } else {
          console.log('❌ No resize handle detected at position:', { x, y });
        }
      }

      // If not resizing, proceed with selection/dragging
      if (e.shiftKey) {
        // Multi-select with Shift key
        const newSelection = new Set(selectedElements);
        if (newSelection.has(clicked.id)) {
          newSelection.delete(clicked.id);
        } else {
          newSelection.add(clicked.id);
        }
        setSelectedElements(newSelection);
        setSelectedElement(clicked);
      } else if (e.ctrlKey || e.metaKey) {
        // Start selection rectangle with Ctrl/Cmd key
        setIsSelecting(true);
        setSelectionStart({ x, y });
        setSelectionRect({ x, y, width: 0, height: 0 });
        setSelectedElement(null);
        setSelectedElements(new Set());
      } else {
        // Normal single selection and dragging
        if (selectedElements.size > 1 && selectedElements.has(clicked.id)) {
          // If multiple selected and clicking on one of them, keep selection for group drag
          setIsDragging(true);
          setDragOffset({ x: x - clicked.x, y: y - clicked.y });
          console.log('🔵 Starting group drag for element:', clicked.type, 'at position:', {x: clicked.x, y: clicked.y}, 'with offset:', {x: x - clicked.x, y: y - clicked.y});
        } else {
          // Single selection
          setSelectedElement(clicked);
          setSelectedElements(new Set([clicked.id]));
          setIsDragging(true);
          setResizeMode(null);
          const offset = { x: x - clicked.x, y: y - clicked.y };
          setDragOffset(offset);
          console.log('🔵 Starting single drag for element:', clicked.type, 'at position:', {x: clicked.x, y: clicked.y}, 'with offset:', offset, 'mouse at:', {x, y});
        }
      }
    } else if (e.ctrlKey || e.metaKey) {
      // Start selection rectangle on empty space
      setIsSelecting(true);
      setSelectionStart({ x, y });
      setSelectionRect({ x, y, width: 0, height: 0 });
      setSelectedElement(null);
      setSelectedElements(new Set());
    } else {
      // Clear selection on empty space click
      setSelectedElement(null);
      setSelectedElements(new Set());
      setIsDragging(false);
      setResizeMode(null);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    // Handle canvas panning
    if (isPanning && e.buttons === 1) {
      const newOffset = {
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      };
      setCanvasOffset(newOffset);
      return;
    }

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (e.clientX - rect.left) / canvasScale;
    const y = (e.clientY - rect.top) / canvasScale;

    // Handle selection rectangle drawing
    if (isSelecting && selectionStart && e.buttons === 1) {
      const width = x - selectionStart.x;
      const height = y - selectionStart.y;
      setSelectionRect({
        x: width < 0 ? x : selectionStart.x,
        y: height < 0 ? y : selectionStart.y,
        width: Math.abs(width),
        height: Math.abs(height)
      });

      // Find elements within selection rectangle
      const selected = new Set<string>();
      elements.forEach(el => {
        const elLeft = el.x - (el.props.width || 50) / 2;
        const elRight = el.x + (el.props.width || 50) / 2;
        const elTop = el.y - (el.props.height || 50) / 2;
        const elBottom = el.y + (el.props.height || 50) / 2;

        const selLeft = Math.min(selectionStart.x, x);
        const selRight = Math.max(selectionStart.x, x);
        const selTop = Math.min(selectionStart.y, y);
        const selBottom = Math.max(selectionStart.y, y);

        if (elLeft < selRight && elRight > selLeft && elTop < selBottom && elBottom > selTop) {
          selected.add(el.id);
        }
      });
      setSelectedElements(selected);
      return;
    }

    // Update cursor based on hover position
    if (!resizeMode && !isDragging && selectedElement) {
      const handle = getResizeHandle(selectedElement, x, y);
      // Debug: Show cursor position relative to element
      if (Math.random() < 0.01) { // Log occasionally to avoid spam
        console.log('🖱️ Mouse position:', { x, y }, 'Element:', { x: selectedElement.x, y: selectedElement.y });
      }
      if (handle) {
        const cursors = {
          nw: 'nw-resize',
          n: 'n-resize',
          ne: 'ne-resize',
          e: 'e-resize',
          se: 'se-resize',
          s: 's-resize',
          sw: 'sw-resize',
          w: 'w-resize'
        };
        document.body.style.cursor = cursors[handle] || 'default';
      } else {
        document.body.style.cursor = 'default';
      }
    }

    // Handle resizing (only when mouse button is pressed)
    if (resizeMode && resizeStart && selectedElement && e.buttons === 1) {
      console.log('📐 Resizing:', resizeMode, 'Delta:', { x: x - resizeStart.x, y: y - resizeStart.y });

      const deltaX = x - resizeStart.x;
      const deltaY = y - resizeStart.y;
      const originalElement = resizeStart.element;
      let newProps = { ...originalElement.props }; // Use original props as base
      let newX = selectedElement.x;
      let newY = selectedElement.y;

      switch (selectedElement.type) {
        case 'line':
        case 'arrow':
          // For lines and arrows, adjust endpoints
          if (resizeMode === 'nw') {
            // Dragging start point
            newX = x;
            newY = y;
            if (snapToGrid) {
              newX = Math.round(newX / GRID_SIZE) * GRID_SIZE;
              newY = Math.round(newY / GRID_SIZE) * GRID_SIZE;
            }
          } else if (resizeMode === 'se') {
            // Dragging end point
            newProps.endX = x;
            newProps.endY = y;
            if (snapToGrid) {
              newProps.endX = Math.round(newProps.endX / GRID_SIZE) * GRID_SIZE;
              newProps.endY = Math.round(newProps.endY / GRID_SIZE) * GRID_SIZE;
            }
          }
          break;

        case 'rect':
        case 'image':
          const origWidth = originalElement.props.width || 100;
          const origHeight = originalElement.props.height || 100;
          const origX = originalElement.x;
          const origY = originalElement.y;

          // Calculate bounds based on center position
          const left = origX - origWidth/2;
          const right = origX + origWidth/2;
          const top = origY - origHeight/2;
          const bottom = origY + origHeight/2;

          // Calculate new dimensions based on handle position
          switch (resizeMode) {
            case 'se': // Bottom-right - drag corner
              if (lockAspectRatio) {
                const aspectRatio = origWidth / origHeight;
                const newWidth = Math.max(20, (x - left));
                const newHeight = Math.max(20, newWidth / aspectRatio);
                newProps.width = newWidth;
                newProps.height = newHeight;
                // Adjust position to keep top-left fixed
                newX = left + newProps.width/2;
                newY = top + newProps.height/2;
              } else {
                newProps.width = Math.max(20, (x - left));
                newProps.height = Math.max(20, (y - top));
                // Adjust position to keep top-left fixed
                newX = left + newProps.width/2;
                newY = top + newProps.height/2;
              }
              break;
            case 'e': // Right - drag right edge
              newProps.width = Math.max(20, (x - left));
              newProps.height = origHeight;
              // Adjust position to keep left side fixed
              newX = left + newProps.width/2;
              break;
            case 's': // Bottom - drag bottom edge
              newProps.width = origWidth;
              newProps.height = Math.max(20, (y - top));
              // Adjust position to keep top fixed
              newY = top + newProps.height/2;
              break;
            case 'sw': // Bottom-left - drag corner
              if (lockAspectRatio) {
                const aspectRatio = origWidth / origHeight;
                const newWidth = Math.max(20, (right - x));
                const newHeight = Math.max(20, newWidth / aspectRatio);
                newProps.width = newWidth;
                newProps.height = newHeight;
                // Adjust position to keep top-right fixed
                newX = right - newProps.width/2;
                newY = top + newProps.height/2;
              } else {
                newProps.width = Math.max(20, (right - x));
                newProps.height = Math.max(20, (y - top));
                // Adjust position to keep top-right fixed
                newX = right - newProps.width/2;
                newY = top + newProps.height/2;
              }
              break;
            case 'w': // Left - drag left edge
              newProps.width = Math.max(20, (right - x));
              newProps.height = origHeight;
              // Adjust position to keep right side fixed
              newX = right - newProps.width/2;
              break;
            case 'nw': // Top-left - drag corner
              if (lockAspectRatio) {
                const aspectRatio = origWidth / origHeight;
                const newWidth = Math.max(20, (right - x));
                const newHeight = Math.max(20, newWidth / aspectRatio);
                newProps.width = newWidth;
                newProps.height = newHeight;
                // Adjust position to keep bottom-right fixed
                newX = right - newProps.width/2;
                newY = bottom - newProps.height/2;
              } else {
                newProps.width = Math.max(20, (right - x));
                newProps.height = Math.max(20, (bottom - y));
                // Adjust position to keep bottom-right fixed
                newX = right - newProps.width/2;
                newY = bottom - newProps.height/2;
              }
              break;
            case 'n': // Top - drag top edge
              newProps.width = origWidth;
              newProps.height = Math.max(20, (bottom - y));
              // Adjust position to keep bottom fixed
              newY = bottom - newProps.height/2;
              break;
            case 'ne': // Top-right - drag corner
              if (lockAspectRatio) {
                const aspectRatio = origWidth / origHeight;
                const newWidth = Math.max(20, (x - left));
                const newHeight = Math.max(20, newWidth / aspectRatio);
                newProps.width = newWidth;
                newProps.height = newHeight;
                // Adjust position to keep bottom-left fixed
                newX = left + newProps.width/2;
                newY = bottom - newProps.height/2;
              } else {
                newProps.width = Math.max(20, (x - left));
                newProps.height = Math.max(20, (bottom - y));
                // Adjust position to keep bottom-left fixed
                newX = left + newProps.width/2;
                newY = bottom - newProps.height/2;
              }
              break;
          }
          break;

        case 'circle':
          const origRadius = originalElement.props.radius || 50;
          const centerX = originalElement.x;
          const centerY = originalElement.y;

          // Calculate distance from center to mouse position
          const distX = x - centerX;
          const distY = y - centerY;
          const distance = Math.sqrt(distX * distX + distY * distY);

          // Set radius based on distance (no need to use absolute values)
          newProps.radius = Math.max(10, Math.min(300, distance));
          break;

        case 'text':
          const origSize = originalElement.props.size || 48;
          const origTextWidth = (originalElement.props.text?.length || 0) * origSize * 0.5;
          const origTextHeight = origSize;

          // Calculate new size based on resize handle
          if (resizeMode === 'e' || resizeMode === 'w') {
            // Horizontal resize - adjust based on width
            const currentWidth = origTextWidth;
            const targetWidth = Math.abs(x - originalElement.x) * 2;
            const scale = targetWidth / currentWidth;
            newProps.size = Math.max(12, Math.min(200, origSize * scale));
          } else if (resizeMode === 'n' || resizeMode === 's') {
            // Vertical resize - adjust based on height
            const targetHeight = Math.abs(y - originalElement.y) * 2;
            newProps.size = Math.max(12, Math.min(200, targetHeight));
          } else {
            // Corner resize - use diagonal distance
            const distX = Math.abs(x - originalElement.x);
            const distY = Math.abs(y - originalElement.y);
            const avgDist = (distX + distY) / 2;
            newProps.size = Math.max(12, Math.min(200, avgDist));
          }
          break;
      }

      updateElement(selectedElement.id, { props: newProps, x: newX, y: newY });
      return;
    }

    // Handle dragging (only when not resizing)
    if (isDragging && !resizeMode && e.buttons === 1) {
      // Log the dragging state for debugging
      console.log('🟡 Drag check - isDragging:', isDragging, 'resizeMode:', resizeMode, 'buttons:', e.buttons);
      if (selectedElements.size > 1) {
        // Multi-element dragging
        const deltaX = x - dragOffset.x - (selectedElement?.x || 0);
        const deltaY = y - dragOffset.y - (selectedElement?.y || 0);

        elements.forEach(el => {
          if (selectedElements.has(el.id)) {
            let newX = el.x + deltaX;
            let newY = el.y + deltaY;

            // Snap to grid
            if (snapToGrid) {
              newX = Math.round(newX / GRID_SIZE) * GRID_SIZE;
              newY = Math.round(newY / GRID_SIZE) * GRID_SIZE;
            }

            // For lines and arrows, update both endpoints
            if (el.type === 'line' || el.type === 'arrow') {
              updateElement(el.id, {
                x: newX,
                y: newY,
                props: {
                  ...el.props,
                  endX: (el.props.endX || el.x + 200) + deltaX,
                  endY: (el.props.endY || el.y) + deltaY
                }
              });
            } else {
              updateElement(el.id, { x: newX, y: newY });
            }
          }
        });
      } else if (selectedElement) {
        // Single element dragging
        let newX = x - dragOffset.x;
        let newY = y - dragOffset.y;

        // Log drag calculation for debugging
        console.log('🟢 Dragging element:', selectedElement.type,
                   'Mouse:', {x, y},
                   'DragOffset:', dragOffset,
                   'NewPos:', {newX, newY},
                   'CurrentPos:', {x: selectedElement.x, y: selectedElement.y});

        // Snap to grid
        if (snapToGrid) {
          newX = Math.round(newX / GRID_SIZE) * GRID_SIZE;
          newY = Math.round(newY / GRID_SIZE) * GRID_SIZE;
        }

        // For lines and arrows, we need to update both start and end points
        if (selectedElement.type === 'line' || selectedElement.type === 'arrow') {
          const deltaX = newX - selectedElement.x;
          const deltaY = newY - selectedElement.y;

          updateElement(selectedElement.id, {
            x: newX,
            y: newY,
            props: {
              ...selectedElement.props,
              endX: (selectedElement.props.endX || selectedElement.x + 200) + deltaX,
              endY: (selectedElement.props.endY || selectedElement.y) + deltaY
            }
          });
        } else {
          updateElement(selectedElement.id, { x: newX, y: newY });
        }
      }
    }
  };

  const handleMouseUp = () => {
    // Save to history if we were dragging or resizing
    if (isDragging || resizeMode) {
      saveToHistory(elements);
    }

    setIsDragging(false);
    setResizeMode(null);
    setResizeStart(null);
    setIsSelecting(false);
    setSelectionRect(null);
    setSelectionStart(null);
    if (isPanning) {
      document.body.style.cursor = 'grab';
    } else {
      document.body.style.cursor = 'default';
    }
  };

  // Wheel handler for zooming - wrapped in useCallback to prevent re-creation
  const handleWheel = useCallback((e: React.WheelEvent<HTMLCanvasElement>) => {
    // Don't prevent default here to avoid passive event listener warning

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Calculate zoom factor based on wheel delta
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.max(0.1, Math.min(2.0, canvasScale * zoomFactor));

    if (newScale !== canvasScale) {
      // Calculate the mouse position in canvas coordinates before zoom
      const canvasMouseX = (mouseX - canvasOffset.x) / canvasScale;
      const canvasMouseY = (mouseY - canvasOffset.y) / canvasScale;

      // Calculate new offset to keep mouse position stable
      const newOffsetX = mouseX - canvasMouseX * newScale;
      const newOffsetY = mouseY - canvasMouseY * newScale;

      setCanvasScale(newScale);
      setCanvasOffset({ x: newOffsetX, y: newOffsetY });
    }
  }, [canvasScale, canvasOffset]);

  // Drag and Drop handlers for assets
  const handleCanvasDragOver = (e: React.DragEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(true);
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleCanvasDragLeave = (e: React.DragEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
  };

  const handleCanvasDrop = (e: React.DragEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);

    // Get canvas position
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - canvasOffset.x) / canvasScale;
    const y = (e.clientY - rect.top - canvasOffset.y) / canvasScale;

    try {
      // Try to get asset data
      const assetData = e.dataTransfer.getData('application/json');
      if (assetData) {
        const asset = JSON.parse(assetData);

        // Create new element based on asset type
        const newElement: CanvasElement = {
          id: `element-${Date.now()}`,
          type: asset.type === 'icon' || asset.type === 'shape' ? 'image' : 'image',
          x: snapToGrid ? Math.round(x / 20) * 20 : x,
          y: snapToGrid ? Math.round(y / 20) * 20 : y,
          props: {
            src: asset.path,
            width: 100,
            height: 100,
            name: asset.name,
            assetType: asset.type
          }
        };

        setElements(prev => [...prev, newElement]);
        setSelectedElement(newElement);
      }

      // Handle file drop
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFileDrop(files, x, y);
      }
    } catch (error) {
      console.error('Error handling drop:', error);
    }
  };

  // Handle file drop
  const handleFileDrop = (files: FileList, x: number, y: number) => {
    Array.from(files).forEach((file, index) => {
      if (file.type.startsWith('image/')) {
        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          addError(`파일이 너무 큽니다: ${file.name} (최대 10MB)`);
          return;
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
          addError(`지원하지 않는 파일 형식: ${file.name}`);
          return;
        }

        const reader = new FileReader();

        reader.onload = (e) => {
          try {
            const result = e.target?.result;
            if (!result) {
              addError(`파일 읽기 실패: ${file.name}`);
              return;
            }

            const newElement: CanvasElement = {
              id: `element-${Date.now()}-${index}`,
              type: 'image',
              x: (snapToGrid ? Math.round(x / 20) * 20 : x) + index * 20,
              y: (snapToGrid ? Math.round(y / 20) * 20 : y) + index * 20,
              props: {
                src: result,
                width: 150,
                height: 150,
                name: file.name
              }
            };
            setElements(prev => {
              const newElements = [...prev, newElement];
              saveToHistory(newElements);
              return newElements;
            });
          } catch (error) {
            addError(`파일 처리 실패: ${file.name}`);
            console.error('File processing error:', error);
          }
        };

        reader.onerror = () => {
          addError(`파일 읽기 실패: ${file.name}`);
        };

        reader.readAsDataURL(file);
      } else {
        addError(`이미지 파일만 지원됩니다: ${file.name}`);
      }
    });
  };

  // Handle asset selection from library
  const handleAssetSelect = (asset: any) => {
    // Add asset to center of visible canvas
    const centerX = (CANVAS_WIDTH / 2 - canvasOffset.x) / canvasScale;
    const centerY = (CANVAS_HEIGHT / 2 - canvasOffset.y) / canvasScale;

    const newElement: CanvasElement = {
      id: `element-${Date.now()}`,
      type: 'image',
      x: snapToGrid ? Math.round(centerX / 20) * 20 : centerX,
      y: snapToGrid ? Math.round(centerY / 20) * 20 : centerY,
      props: {
        src: asset.path,
        width: 100,
        height: 100,
        name: asset.name,
        assetType: asset.type
      }
    };

    setElements(prev => [...prev, newElement]);
    setSelectedElement(newElement);
  };

  // Request render with throttling
  const requestRender = useCallback(() => {
    setNeedsRender(true);
  }, []);

  // Optimized render canvas with throttling
  const renderCanvas = useCallback(() => {
    if (!needsRender) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Throttle rendering to max 60 FPS
    const now = Date.now();
    if (now - lastRenderTime.current < 16) {
      if (renderTimeoutRef.current) clearTimeout(renderTimeoutRef.current);
      renderTimeoutRef.current = setTimeout(() => {
        setNeedsRender(true);
      }, 16);
      return;
    }

    lastRenderTime.current = now;

    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Dark background
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw grid
    if (showGrid) {
      ctx.strokeStyle = '#1E293B';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);

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

      ctx.setLineDash([]);
    }

    // Draw elements
    elements.forEach(element => {
      ctx.save();

      // Calculate animation time
      let currentTime = 0;
      if (isPlaying) {
        const totalDuration = 3000; // 3 seconds total
        currentTime = (animationFrame / 90) * totalDuration; // 90 frames for 3 seconds at 30fps
      }

      // Apply animation if playing
      if (isPlaying && element.animation) {
        const delay = element.animation.delay || 0;
        const duration = element.animation.duration || 1000;

        if (currentTime < delay) {
          ctx.restore();
          return; // Skip if not started
        }

        const progress = Math.min(1, (currentTime - delay) / duration);

        switch (element.animation.type) {
          case 'fadeIn':
            ctx.globalAlpha = progress;
            break;
          case 'slideIn':
            ctx.translate(-200 * (1 - progress), 0);
            break;
          case 'zoomIn':
            const scale = progress;
            ctx.translate(element.x * (1 - scale), element.y * (1 - scale));
            ctx.scale(scale, scale);
            break;
          case 'rotate':
            ctx.translate(element.x, element.y);
            ctx.rotate(progress * Math.PI * 2);
            ctx.translate(-element.x, -element.y);
            break;
          case 'bounce':
            const bounce = Math.sin(progress * Math.PI) * 30;
            ctx.translate(0, -bounce);
            break;
        }
      }

      // Draw based on type
      switch (element.type) {
        case 'text':
          ctx.font = `${element.props.weight} ${element.props.size}px ${element.props.font}`;
          ctx.fillStyle = element.props.color;
          ctx.textAlign = element.props.align as CanvasTextAlign;
          ctx.textBaseline = 'middle';
          ctx.fillText(element.props.text, element.x, element.y);
          break;

        case 'rect':
          const x = element.x - element.props.width / 2;
          const y = element.y - element.props.height / 2;

          if (element.props.borderRadius > 0) {
            // Rounded rectangle
            const r = element.props.borderRadius;
            ctx.beginPath();
            ctx.moveTo(x + r, y);
            ctx.lineTo(x + element.props.width - r, y);
            ctx.quadraticCurveTo(x + element.props.width, y, x + element.props.width, y + r);
            ctx.lineTo(x + element.props.width, y + element.props.height - r);
            ctx.quadraticCurveTo(x + element.props.width, y + element.props.height, x + element.props.width - r, y + element.props.height);
            ctx.lineTo(x + r, y + element.props.height);
            ctx.quadraticCurveTo(x, y + element.props.height, x, y + element.props.height - r);
            ctx.lineTo(x, y + r);
            ctx.quadraticCurveTo(x, y, x + r, y);
            ctx.closePath();
          } else {
            ctx.beginPath();
            ctx.rect(x, y, element.props.width, element.props.height);
          }

          if (element.props.filled) {
            ctx.fillStyle = element.props.color;
            ctx.fill();
          } else {
            ctx.strokeStyle = element.props.color;
            ctx.lineWidth = element.props.borderWidth;
            ctx.stroke();
          }
          break;

        case 'circle':
          ctx.beginPath();
          ctx.arc(element.x, element.y, element.props.radius, 0, Math.PI * 2);

          if (element.props.filled) {
            ctx.fillStyle = element.props.color;
            ctx.fill();
          } else {
            ctx.strokeStyle = element.props.color;
            ctx.lineWidth = element.props.borderWidth;
            ctx.stroke();
          }
          break;

        case 'arrow':
          const endX = element.props.endX || element.x + 150;
          const endY = element.props.endY || element.y;

          // Apply progressive drawing for animation
          let drawEndX = endX;
          let drawEndY = endY;

          if (element.animation && currentTime > 0) {
            const delay = element.animation.delay || 0;
            const duration = element.animation.duration || 1000;

            if (currentTime >= delay) {
              const progress = Math.min(1, (currentTime - delay) / duration);
              // Progressive line drawing animation (additional to other animations)
              if (element.animation.type === 'slideIn' || !element.animation.type) {
                drawEndX = element.x + (endX - element.x) * progress;
                drawEndY = element.y + (endY - element.y) * progress;
              }
            }
          }

          ctx.strokeStyle = element.props.color || '#3B82F6';
          ctx.fillStyle = element.props.color || '#3B82F6';
          ctx.lineWidth = element.props.strokeWidth || 3;

          // Draw line
          ctx.beginPath();
          ctx.moveTo(element.x, element.y);
          ctx.lineTo(drawEndX, drawEndY);
          ctx.stroke();

          // Draw arrowhead (only if animation is complete or not animating)
          if (drawEndX === endX && drawEndY === endY) {
            const angle = Math.atan2(endY - element.y, endX - element.x);
            const arrowSize = element.props.arrowSize || 15;

            ctx.beginPath();
            ctx.moveTo(endX, endY);
            ctx.lineTo(
              endX - arrowSize * Math.cos(angle - Math.PI/6),
              endY - arrowSize * Math.sin(angle - Math.PI/6)
            );
            ctx.moveTo(endX, endY);
            ctx.lineTo(
              endX - arrowSize * Math.cos(angle + Math.PI/6),
              endY - arrowSize * Math.sin(angle + Math.PI/6)
            );
            ctx.stroke();
          }

          // Draw endpoints for better visibility when selected
          if (selectedElement?.id === element.id) {
            ctx.fillStyle = element.props.color || '#3B82F6';
            ctx.beginPath();
            ctx.arc(element.x, element.y, 4, 0, Math.PI * 2);
            ctx.fill();
          }
          break;

        case 'line':
          const lineEndX = element.props.endX || element.x + 200;
          const lineEndY = element.props.endY || element.y;

          // Apply progressive drawing for animation
          let drawLineEndX = lineEndX;
          let drawLineEndY = lineEndY;

          if (element.animation && currentTime > 0) {
            const delay = element.animation.delay || 0;
            const duration = element.animation.duration || 1000;

            if (currentTime >= delay) {
              const progress = Math.min(1, (currentTime - delay) / duration);
              // Progressive line drawing animation (additional to other animations)
              if (element.animation.type === 'slideIn' || !element.animation.type) {
                drawLineEndX = element.x + (lineEndX - element.x) * progress;
                drawLineEndY = element.y + (lineEndY - element.y) * progress;
              }
            }
          }

          ctx.strokeStyle = element.props.color || '#64748B';
          ctx.lineWidth = element.props.strokeWidth || 2;

          if (element.props.dashed) {
            ctx.setLineDash([10, 10]);
          }

          ctx.beginPath();
          ctx.moveTo(element.x, element.y);
          ctx.lineTo(drawLineEndX, drawLineEndY);
          ctx.stroke();

          ctx.setLineDash([]);

          // Draw endpoints for better visibility when selected
          if (selectedElement?.id === element.id) {
            ctx.fillStyle = element.props.color || '#64748B';
            ctx.beginPath();
            ctx.arc(element.x, element.y, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(lineEndX, lineEndY, 4, 0, Math.PI * 2);
            ctx.fill();
          }
          break;

        case 'image':
          if (element.props.src) {
            const src = element.props.src as string;
            let img = imageCache.current.get(src);

            if (!img) {
              img = new Image();
              img.src = src;
              imageCache.current.set(src, img);

              if (!img.complete) {
                img.onload = () => {
                  requestRender(); // Re-render only once when image first loads
                };
                img.onerror = () => {
                  console.error('Failed to load image:', src);
                  addError(`이미지 로드 실패: ${src.split('/').pop() || src}`);
                  // Remove failed image from cache to allow retry
                  imageCache.current.delete(src);
                };
              }
            }

            if (img.complete && img.naturalWidth > 0) {
              const width = element.props.width || 100;
              const height = element.props.height || 100;
              ctx.drawImage(
                img,
                element.x - width / 2,
                element.y - height / 2,
                width,
                height
              );
            } else {
              // Show placeholder while loading
              ctx.fillStyle = '#374151';
              ctx.fillRect(
                element.x - (element.props.width || 100) / 2,
                element.y - (element.props.height || 100) / 2,
                element.props.width || 100,
                element.props.height || 100
              );
              ctx.fillStyle = '#9ca3af';
              ctx.font = '14px sans-serif';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText('Loading...', element.x, element.y);
            }
          }
          break;
      }

      // Restore context after drawing element with animation
      if (element.animation && currentTime > 0) {
        ctx.restore();
      }

      // Draw selection indicator
      if (selectedElement?.id === element.id || selectedElements.has(element.id)) {
        ctx.strokeStyle = '#3B82F6';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);

        let bounds = { x: 0, y: 0, width: 0, height: 0 };

        switch (element.type) {
          case 'text':
            const textWidth = element.props.text.length * element.props.size * 0.5;
            bounds = {
              x: element.x - textWidth/2 - 10,
              y: element.y - element.props.size/2 - 10,
              width: textWidth + 20,
              height: element.props.size + 20
            };
            break;
          case 'rect':
            bounds = {
              x: element.x - element.props.width/2 - 10,
              y: element.y - element.props.height/2 - 10,
              width: element.props.width + 20,
              height: element.props.height + 20
            };
            break;
          case 'circle':
            bounds = {
              x: element.x - element.props.radius - 10,
              y: element.y - element.props.radius - 10,
              width: element.props.radius * 2 + 20,
              height: element.props.radius * 2 + 20
            };
            break;
          case 'image':
            const imgWidth = element.props.width || 100;
            const imgHeight = element.props.height || 100;
            bounds = {
              x: element.x - imgWidth/2 - 10,
              y: element.y - imgHeight/2 - 10,
              width: imgWidth + 20,
              height: imgHeight + 20
            };
            break;
          case 'arrow':
          case 'line':
            const minX = Math.min(element.x, element.props.endX || element.x + 200);
            const maxX = Math.max(element.x, element.props.endX || element.x + 200);
            const minY = Math.min(element.y, element.props.endY || element.y);
            const maxY = Math.max(element.y, element.props.endY || element.y);
            bounds = {
              x: minX - 10,
              y: minY - 10,
              width: maxX - minX + 20,
              height: maxY - minY + 20
            };
            break;
        }

        ctx.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
        ctx.setLineDash([]);

        // Draw resize handles
        if (element.type === 'line' || element.type === 'arrow') {
          // For lines and arrows, only show endpoint handles
          const handleSize = 10;
          const endX = element.props.endX || element.x + 200;
          const endY = element.props.endY || element.y;

          // Start point handle
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(element.x - handleSize/2, element.y - handleSize/2, handleSize, handleSize);
          ctx.fillStyle = '#3B82F6';
          ctx.fillRect(element.x - handleSize/2 + 1, element.y - handleSize/2 + 1, handleSize - 2, handleSize - 2);

          // End point handle
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(endX - handleSize/2, endY - handleSize/2, handleSize, handleSize);
          ctx.fillStyle = '#3B82F6';
          ctx.fillRect(endX - handleSize/2 + 1, endY - handleSize/2 + 1, handleSize - 2, handleSize - 2);
        } else {
          // For other elements, show 8 resize handles
          ctx.fillStyle = '#3B82F6';
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 2;
          const handleSize = 24; // Increased to 24px for better visibility and easier clicking

          // All 8 resize handles
          const handles = [
            { x: bounds.x, y: bounds.y }, // nw
            { x: bounds.x + bounds.width / 2, y: bounds.y }, // n
            { x: bounds.x + bounds.width, y: bounds.y }, // ne
            { x: bounds.x + bounds.width, y: bounds.y + bounds.height / 2 }, // e
            { x: bounds.x + bounds.width, y: bounds.y + bounds.height }, // se
            { x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height }, // s
            { x: bounds.x, y: bounds.y + bounds.height }, // sw
            { x: bounds.x, y: bounds.y + bounds.height / 2 } // w
          ];

          handles.forEach((handle, index) => {
            // Draw shadow for depth
            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.fillRect(handle.x - handleSize/2 + 2, handle.y - handleSize/2 + 2, handleSize, handleSize);

            // White background for better visibility
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(handle.x - handleSize/2, handle.y - handleSize/2, handleSize, handleSize);

            // Blue fill with border - more vibrant color
            ctx.fillStyle = index % 2 === 0 ? '#3B82F6' : '#10B981'; // Alternate blue and green for better visibility
            ctx.fillRect(handle.x - handleSize/2 + 2, handle.y - handleSize/2 + 2, handleSize - 4, handleSize - 4);
          });

          // Draw rotation handle if needed
          if (element.type === 'image' || element.type === 'rect') {
            ctx.strokeStyle = '#3B82F6';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(bounds.x + bounds.width / 2, bounds.y - 10);
            ctx.lineTo(bounds.x + bounds.width / 2, bounds.y - 30);
            ctx.stroke();

            ctx.fillStyle = '#3B82F6';
            ctx.beginPath();
            ctx.arc(bounds.x + bounds.width / 2, bounds.y - 30, 5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      ctx.restore();
    });

    // Draw selection rectangle if selecting
    if (isSelecting && selectionRect) {
      ctx.strokeStyle = '#3B82F6';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(selectionRect.x, selectionRect.y, selectionRect.width, selectionRect.height);
      ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
      ctx.fillRect(selectionRect.x, selectionRect.y, selectionRect.width, selectionRect.height);
      ctx.setLineDash([]);
    }

    // Draw 16:9 indicator
    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 5]);
    ctx.globalAlpha = 0.3;
    ctx.strokeRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;

    // Mark render as complete
    setNeedsRender(false);
  }, [elements, selectedElement, selectedElements, showGrid, isPlaying, animationFrame, isSelecting, selectionRect, needsRender]);

  // Add passive wheel event listener to avoid React warning
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const wheelHandler = (e: WheelEvent) => {
      // Prevent default scrolling
      e.preventDefault();

      // Manually trigger our handleWheel function
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Calculate zoom factor based on wheel delta
      const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
      const newScale = Math.max(0.1, Math.min(2.0, canvasScale * zoomFactor));

      if (newScale !== canvasScale) {
        // Calculate the mouse position in canvas coordinates before zoom
        const canvasMouseX = (mouseX - canvasOffset.x) / canvasScale;
        const canvasMouseY = (mouseY - canvasOffset.y) / canvasScale;

        // Calculate new offset to keep mouse position stable
        const newOffsetX = mouseX - canvasMouseX * newScale;
        const newOffsetY = mouseY - canvasMouseY * newScale;

        setCanvasScale(newScale);
        setCanvasOffset({ x: newOffsetX, y: newOffsetY });
      }
    };

    // Add event listener with { passive: false } to allow preventDefault
    canvas.addEventListener('wheel', wheelHandler, { passive: false });

    return () => {
      canvas.removeEventListener('wheel', wheelHandler);
    };
  }, [canvasScale, canvasOffset]);

  // Animation loop
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setAnimationFrame(prev => {
          if (prev >= 90) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000 / 30); // 30 fps

      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  // Render canvas on changes
  useEffect(() => {
    requestRender();
  }, [elements, selectedElement, selectedElements, showGrid, isPlaying, animationFrame, isSelecting, selectionRect]);

  // Render loop
  useEffect(() => {
    if (needsRender) {
      renderCanvas();
    }
  }, [needsRender, renderCanvas]);

  // Export functions
  const exportPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'scene.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  // Export as MP4 - fallback to WebM if server is not available
  const exportMP4 = async () => {
    const canvas = canvasRef.current;
    if (!canvas || elements.length === 0) return;

    const exportButton = document.querySelector('[data-export-mp4]') as HTMLButtonElement;
    if (exportButton) {
      exportButton.textContent = 'Generating MP4...';
      exportButton.disabled = true;
    }

    showLoading('Generating MP4 video...');

    try {
      // Generate frames
      const frames: string[] = [];
      const totalFrames = 60; // 2 seconds at 30fps
      const animationDuration = 3000; // 3 seconds

      console.log('Generating frames for MP4...');

      for (let frame = 0; frame < totalFrames; frame++) {
        // Create buffer canvas with extra space for glow effects
        const GLOW_BUFFER = 50;
        const bufferWidth = CANVAS_WIDTH + (GLOW_BUFFER * 2);
        const bufferHeight = CANVAS_HEIGHT + (GLOW_BUFFER * 2);

        const bufferCanvas = document.createElement('canvas');
        bufferCanvas.width = bufferWidth;
        bufferCanvas.height = bufferHeight;
        const bufferCtx = bufferCanvas.getContext('2d');
        if (!bufferCtx) continue;

        // Background
        bufferCtx.fillStyle = '#0F172A';
        bufferCtx.fillRect(0, 0, bufferWidth, bufferHeight);

        // Translate context to center the content
        bufferCtx.translate(GLOW_BUFFER, GLOW_BUFFER);

        // Calculate current time
        const currentTime = (frame / totalFrames) * animationDuration;

        // Draw elements with animations
        elements.forEach((element, index) => {
          bufferCtx.save();

          let shouldDraw = true;
          let elementProgress = 1;

          // Apply animations
          if (element.animation?.type && element.animation.type !== 'none') {
            const delay = (element.animation.delay || 0) + index * 100;
            const duration = element.animation.duration || 1000;

            elementProgress = 0;
            if (currentTime >= delay) {
              elementProgress = Math.min(1, (currentTime - delay) / duration);
            }

            switch (element.animation.type) {
              case 'fadeIn':
                bufferCtx.globalAlpha = elementProgress;
                shouldDraw = elementProgress > 0;
                break;
              case 'slideIn':
                if (elementProgress > 0) {
                  const slideDistance = 200 * (1 - elementProgress);
                  bufferCtx.translate(-slideDistance, 0);
                } else {
                  shouldDraw = false;
                }
                break;
              case 'zoomIn':
                if (elementProgress > 0) {
                  const scale = elementProgress;
                  bufferCtx.translate(element.x, element.y);
                  bufferCtx.scale(scale, scale);
                  bufferCtx.translate(-element.x, -element.y);
                } else {
                  shouldDraw = false;
                }
                break;
            }
          }

          if (!shouldDraw) {
            bufferCtx.restore();
            return;
          }

          // Draw element
          switch (element.type) {
            case 'text':
              bufferCtx.font = `${element.props.weight} ${element.props.size}px ${element.props.font}`;
              bufferCtx.fillStyle = element.props.color;
              bufferCtx.textAlign = 'center';
              bufferCtx.textBaseline = 'middle';
              bufferCtx.fillText(element.props.text, element.x, element.y);
              break;
            case 'image':
              if (element.props.src) {
                const img = imageCache.current?.get(element.props.src as string);
                if (img && img.complete && img.naturalWidth > 0) {
                  const width = element.props.width || 100;
                  const height = element.props.height || 100;
                  bufferCtx.drawImage(
                    img,
                    element.x - width / 2,
                    element.y - height / 2,
                    width,
                    height
                  );
                }
              }
              break;
            case 'rect':
              if (element.props.filled) {
                bufferCtx.fillStyle = element.props.color;
                bufferCtx.fillRect(
                  element.x - element.props.width/2,
                  element.y - element.props.height/2,
                  element.props.width,
                  element.props.height
                );
              } else {
                bufferCtx.strokeStyle = element.props.color;
                bufferCtx.lineWidth = element.props.borderWidth || 2;
                bufferCtx.strokeRect(
                  element.x - element.props.width/2,
                  element.y - element.props.height/2,
                  element.props.width,
                  element.props.height
                );
              }
              break;
            case 'circle':
              bufferCtx.beginPath();
              bufferCtx.arc(element.x, element.y, element.props.radius, 0, Math.PI * 2);
              if (element.props.filled) {
                bufferCtx.fillStyle = element.props.color;
                bufferCtx.fill();
              } else {
                bufferCtx.strokeStyle = element.props.color;
                bufferCtx.lineWidth = element.props.borderWidth || 2;
                bufferCtx.stroke();
              }
              break;
          }

          bufferCtx.restore();
        });

        // Crop to final size
        const frameCanvas = document.createElement('canvas');
        frameCanvas.width = CANVAS_WIDTH;
        frameCanvas.height = CANVAS_HEIGHT;
        const frameCtx = frameCanvas.getContext('2d');
        if (frameCtx) {
          frameCtx.drawImage(
            bufferCanvas,
            GLOW_BUFFER, GLOW_BUFFER,
            CANVAS_WIDTH, CANVAS_HEIGHT,
            0, 0,
            CANVAS_WIDTH, CANVAS_HEIGHT
          );
          frames.push(frameCanvas.toDataURL('image/png'));
        }
      }

      console.log(`Generated ${frames.length} frames`);

      // Send frames to server for FFmpeg processing
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4906/api/scene-video/generate-mp4', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          frames,
          fps: 30,
          duration: 2
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to generate MP4');
      }

      const result = await response.json();
      console.log('MP4 generated:', result);

      // Download the video
      const videoUrl = `http://localhost:4906${result.url}`;
      const link = document.createElement('a');
      link.href = videoUrl;
      link.download = result.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      hideLoading();
      if (exportButton) {
        exportButton.textContent = 'Export MP4';
        exportButton.disabled = false;
      }

    } catch (error) {
      console.error('MP4 generation error:', error);
      hideLoading();
      addError(`MP4 생성 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);

      if (exportButton) {
        exportButton.textContent = 'Export MP4';
        exportButton.disabled = false;
      }
    }
  };

  // Export as video with better error handling (WebM)
  const exportVideo = async () => {
    const canvas = canvasRef.current;
    if (!canvas || elements.length === 0) return;

    const exportButton = document.querySelector('[data-export-video]') as HTMLButtonElement;
    if (exportButton) {
      exportButton.textContent = 'Recording...';
      exportButton.disabled = true;
    }

    // Check if MediaRecorder is available
    if (typeof MediaRecorder === 'undefined') {
      alert('Video recording is not supported in your browser. Please use Chrome, Firefox, or Edge.');
      if (exportButton) {
        exportButton.textContent = 'Export Video';
        exportButton.disabled = false;
      }
      return;
    }

    try {
      // Test if captureStream is available
      const testCanvas = document.createElement('canvas');
      if (!testCanvas.captureStream && !(testCanvas as any).mozCaptureStream && !(testCanvas as any).webkitCaptureStream) {
        throw new Error('Canvas capture not supported');
      }

      // Get the stream with browser compatibility
      let stream;
      if (canvas.captureStream) {
        stream = canvas.captureStream(25);
      } else if ((canvas as any).mozCaptureStream) {
        stream = (canvas as any).mozCaptureStream(25);
      } else if ((canvas as any).webkitCaptureStream) {
        stream = (canvas as any).webkitCaptureStream(25);
      } else {
        throw new Error('Canvas stream capture not supported');
      }

      // Try different codec options
      let mediaRecorder: MediaRecorder | null = null;
      const codecs = [
        { mimeType: 'video/webm' },
        { mimeType: 'video/webm;codecs=vp8' },
        { mimeType: 'video/webm;codecs=h264' },
        {}  // No options as last resort
      ];

      for (const options of codecs) {
        try {
          mediaRecorder = new MediaRecorder(stream, options);
          console.log('Using codec:', options.mimeType || 'default');
          break;
        } catch (e) {
          console.warn('Codec not supported:', options, e);
        }
      }

      if (!mediaRecorder) {
        throw new Error('Could not create MediaRecorder');
      }

      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
      };

      mediaRecorder.onstop = () => {
        if (chunks.length > 0) {
          const blob = new Blob(chunks, { type: 'video/webm' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `canvas-animation-${Date.now()}.webm`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          setTimeout(() => URL.revokeObjectURL(url), 100);
        } else {
          alert('No video data was captured. Please try again.');
        }

        // Reset
        if (exportButton) {
          exportButton.textContent = 'Export Video';
          exportButton.disabled = false;
        }
        setIsPlaying(false);
        currentTimeRef.current = 0;
      };

      // Start recording
      try {
        mediaRecorder.start(1000); // Capture every 1 second
      } catch (e) {
        mediaRecorder.start(); // Try without timeslice
      }

      // Play animation
      setIsPlaying(true);
      currentTimeRef.current = 0;

      // Stop after 5 seconds
      setTimeout(() => {
        if (mediaRecorder && mediaRecorder.state === 'recording') {
          try {
            mediaRecorder.stop();
          } catch (e) {
            console.error('Error stopping recorder:', e);
          }
        }
      }, 5000);

    } catch (error) {
      console.error('Video export failed:', error);

      // Show specific error message
      if (error.message.includes('not supported')) {
        alert('Video recording is not supported in this browser. Please try Chrome or Firefox.');
      } else {
        alert(`Video export failed: ${error.message}\n\nUsing GIF export as fallback.`);
        // Fallback to GIF
        setTimeout(() => exportGIF(), 500);
      }

      if (exportButton) {
        exportButton.textContent = 'Export Video';
        exportButton.disabled = false;
      }
      setIsPlaying(false);
    }
  };

  // Export as frame sequence (alternative to video)
  const exportFrameSequence = async () => {
    const canvas = canvasRef.current;
    if (!canvas || elements.length === 0) return;

    const exportButton = document.querySelector('[data-export-frames]') as HTMLButtonElement;
    if (exportButton) {
      exportButton.textContent = 'Generating...';
      exportButton.disabled = true;
    }

    try {
      const frames: string[] = [];
      const totalFrames = 30; // 30 frames
      const animationDuration = 1500; // 1.5 seconds

      // Generate each frame
      for (let frame = 0; frame < totalFrames; frame++) {
        const frameCanvas = document.createElement('canvas');
        frameCanvas.width = CANVAS_WIDTH;
        frameCanvas.height = CANVAS_HEIGHT;
        const bufferCtx = frameCanvas.getContext('2d');
        if (!bufferCtx) continue;

        // Background
        bufferCtx.fillStyle = '#0F172A';
        bufferCtx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Calculate current time
        const currentTime = (frame / totalFrames) * animationDuration;
        const t = frame / totalFrames;

        // Draw elements with animations
        elements.forEach((element, index) => {
          bufferCtx.save();

          // Draw element based on type
          switch (element.type) {
            case 'text':
              bufferCtx.font = `${element.props.weight || 'normal'} ${element.props.size || 24}px ${element.props.font || 'Arial'}`;
              bufferCtx.fillStyle = element.props.color || '#ffffff';
              bufferCtx.textAlign = 'center';
              bufferCtx.textBaseline = 'middle';
              bufferCtx.fillText(element.props.text || '', element.x, element.y);
              break;

            case 'rect':
              if (element.props.filled !== false) {
                bufferCtx.fillStyle = element.props.color || '#3B82F6';
                bufferCtx.fillRect(
                  element.x - (element.props.width || 100)/2,
                  element.y - (element.props.height || 100)/2,
                  element.props.width || 100,
                  element.props.height || 100
                );
              } else {
                bufferCtx.strokeStyle = element.props.color || '#3B82F6';
                bufferCtx.lineWidth = element.props.borderWidth || 2;
                bufferCtx.strokeRect(
                  element.x - (element.props.width || 100)/2,
                  element.y - (element.props.height || 100)/2,
                  element.props.width || 100,
                  element.props.height || 100
                );
              }
              break;

            case 'circle':
              bufferCtx.beginPath();
              bufferCtx.arc(element.x, element.y, element.props.radius || 50, 0, Math.PI * 2);
              if (element.props.filled !== false) {
                bufferCtx.fillStyle = element.props.color || '#8B5CF6';
                bufferCtx.fill();
              } else {
                bufferCtx.strokeStyle = element.props.color || '#8B5CF6';
                bufferCtx.lineWidth = element.props.borderWidth || 2;
                bufferCtx.stroke();
              }
              break;

            case 'arrow':
              const endX = element.props.endX || element.x + 150;
              const endY = element.props.endY || element.y;

              bufferCtx.strokeStyle = element.props.color || '#3B82F6';
              bufferCtx.lineWidth = element.props.strokeWidth || 3;
              bufferCtx.beginPath();
              bufferCtx.moveTo(element.x, element.y);
              bufferCtx.lineTo(endX, endY);
              bufferCtx.stroke();

              // Arrowhead
              const angle = Math.atan2(endY - element.y, endX - element.x);
              const arrowSize = element.props.arrowSize || 15;
              bufferCtx.beginPath();
              bufferCtx.moveTo(endX, endY);
              bufferCtx.lineTo(
                endX - arrowSize * Math.cos(angle - Math.PI/6),
                endY - arrowSize * Math.sin(angle - Math.PI/6)
              );
              bufferCtx.moveTo(endX, endY);
              bufferCtx.lineTo(
                endX - arrowSize * Math.cos(angle + Math.PI/6),
                endY - arrowSize * Math.sin(angle + Math.PI/6)
              );
              bufferCtx.stroke();
              break;

            case 'line':
              const lineEndX = element.props.endX || element.x + 200;
              const lineEndY = element.props.endY || element.y;

              bufferCtx.strokeStyle = element.props.color || '#64748B';
              bufferCtx.lineWidth = element.props.strokeWidth || 2;
              if (element.props.dashed) {
                bufferCtx.setLineDash([10, 10]);
              }
              bufferCtx.beginPath();
              bufferCtx.moveTo(element.x, element.y);
              bufferCtx.lineTo(lineEndX, lineEndY);
              bufferCtx.stroke();
              bufferCtx.setLineDash([]);
              break;

            case 'image':
              if (element.props.src) {
                const src = element.props.src as string;

                // Check if this is a ParticleField
                if (element.props.artType === 'particle') {
                  // Draw particle field animation
                  const width = element.props.width || 400;
                  const height = element.props.height || 300;
                  const centerX = element.x;
                  const centerY = element.y;

                  // Particle system
                  const particleCount = 30;
                  const time = t * Math.PI * 2;

                  for (let i = 0; i < particleCount; i++) {
                    const angle = (i / particleCount) * Math.PI * 2 + time;
                    const radius = 50 + Math.sin(time + i) * 30;
                    const particleX = centerX + Math.cos(angle) * radius;
                    const particleY = centerY + Math.sin(angle) * radius;
                    const size = 2 + Math.sin(time * 2 + i) * 2;

                    bufferCtx.shadowBlur = 10;
                    bufferCtx.shadowColor = ['#06b6d4', '#8b5cf6', '#ec4899', '#fbbf24'][i % 4];
                    bufferCtx.fillStyle = bufferCtx.shadowColor;
                    bufferCtx.globalAlpha = 0.8;
                    bufferCtx.beginPath();
                    bufferCtx.arc(particleX, particleY, size, 0, Math.PI * 2);
                    bufferCtx.fill();
                  }
                } else {
                  // Regular image - draw placeholder
                  const width = element.props.width || 100;
                  const height = element.props.height || 100;

                  // Try to use cached image
                  const img = imageCache.current?.get(src);
                  if (img && img.complete && img.naturalWidth > 0) {
                    bufferCtx.drawImage(
                      img,
                      element.x - width / 2,
                      element.y - height / 2,
                      width,
                      height
                    );
                  } else {
                    // Draw placeholder
                    bufferCtx.fillStyle = '#374151';
                    bufferCtx.fillRect(
                      element.x - width / 2,
                      element.y - height / 2,
                      width,
                      height
                    );
                    bufferCtx.fillStyle = '#9ca3af';
                    bufferCtx.font = '14px sans-serif';
                    bufferCtx.textAlign = 'center';
                    bufferCtx.textBaseline = 'middle';
                    bufferCtx.fillText('Image', element.x, element.y);
                  }
                }
              }
              break;
          }

          bufferCtx.restore();
        });

        // Convert to data URL
        frames.push(frameCanvas.toDataURL('image/png'));
      }

      // Download frames as individual images
      frames.forEach((frame, index) => {
        const link = document.createElement('a');
        link.download = `frame_${String(index).padStart(3, '0')}.png`;
        link.href = frame;

        // Delay downloads to avoid browser blocking
        setTimeout(() => link.click(), index * 100);
      });

      alert(`Generated ${totalFrames} frames. Check your Downloads folder.`);

    } catch (error) {
      console.error('Error generating frames:', error);
      alert('Frame generation failed.');
    } finally {
      if (exportButton) {
        exportButton.textContent = 'Export Frames';
        exportButton.disabled = false;
      }
    }
  };

  const exportGIF = async () => {
    const canvas = canvasRef.current;
    if (!canvas || elements.length === 0) {
      addError('캔버스가 없거나 요소가 비어있습니다');
      return;
    }

    // Alert user that export is starting
    const exportButton = document.querySelector('[data-export-gif]') as HTMLButtonElement;

    try {
      showLoading('이미지 로딩 중...');
      if (exportButton) {
        exportButton.textContent = 'Loading images...';
        exportButton.disabled = true;
      }

    // Pre-load all images before starting GIF generation
    const imageElements = elements.filter(el => el.type === 'image' && el.props.src);
    const imageLoadPromises = imageElements.map(element => {
      return new Promise<void>((resolve) => {
        const src = element.props.src as string;
        let img = imageCache.current.get(src);
        if (!img) {
          img = new Image();
          img.src = src;
          imageCache.current.set(src, img);
        }
        if (img.complete && img.naturalWidth > 0) {
          resolve();
        } else {
          img.onload = () => resolve();
          img.onerror = () => resolve(); // Continue even if image fails to load
        }
      });
    });

    // Wait for all images to load
    await Promise.all(imageLoadPromises);

    showLoading('GIF 생성 중...');

    if (exportButton) {
      exportButton.textContent = 'Generating...';
    }

    // Add buffer for glow effects to prevent clipping
    const GLOW_BUFFER = 60; // Extra space for glow effects
    const bufferWidth = CANVAS_WIDTH + (GLOW_BUFFER * 2);
    const bufferHeight = CANVAS_HEIGHT + (GLOW_BUFFER * 2);

    const gif = new GIF({
      workers: 2,
      quality: 10,
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
      workerScript: '/gif.worker.js',
      transparent: null,  // Ensure no transparency issues
      repeat: 0,  // Loop forever
      debug: true // Enable debug mode to see progress
    });

    console.log('GIF initialized with dimensions:', CANVAS_WIDTH, 'x', CANVAS_HEIGHT);

    // Always create animated GIF even if no animations are set
    // This demonstrates the GIF is working
    const totalFrames = 60; // 60 frames for 3 second animation
    const animationDuration = 3000; // 3 seconds total (increased for better visibility)
    const hasAnimation = elements.some(el => el.animation?.type);

    console.log(`Creating GIF with ${totalFrames} frames, has animations: ${hasAnimation}`);
    console.log('Elements with animations:', elements.filter(el => el.animation?.type).map(el => ({
      type: el.type,
      animation: el.animation?.type
    })));

    for (let frame = 0; frame < totalFrames; frame++) {
      // Create a larger canvas with buffer for glow effects
      const bufferCanvas = document.createElement('canvas');
      bufferCanvas.width = bufferWidth;
      bufferCanvas.height = bufferHeight;
      const bufferCtx = bufferCanvas.getContext('2d');
      if (!bufferCtx) continue;

      // Background
      bufferCtx.fillStyle = '#0F172A';
      bufferCtx.fillRect(0, 0, bufferWidth, bufferHeight);

      // Translate context to center the content with buffer space
      bufferCtx.translate(GLOW_BUFFER, GLOW_BUFFER);

      // Calculate current time in milliseconds
      const currentTime = (frame / totalFrames) * animationDuration;

      // Debug first, middle and last frame
      if (frame === 0 || frame === Math.floor(totalFrames/2) || frame === totalFrames - 1) {
        console.log(`Frame ${frame}/${totalFrames}, time: ${currentTime}ms`);
        if (elements.length > 0) {
          console.log('First element animation:', elements[0].animation);
        }
      }

      elements.forEach((element, index) => {
        bufferCtx.save();

        let shouldDraw = true;
        let elementProgress = 1; // Default to fully visible

        // Check if element has animation (skip if type is 'none')
        if (element.animation?.type && element.animation.type !== 'none') {
          const delay = (element.animation.delay || 0) + index * 100;
          const duration = element.animation.duration || 1000;

          // Calculate element's animation progress
          elementProgress = 0;
          if (currentTime >= delay) {
            elementProgress = Math.min(1, (currentTime - delay) / duration);
          }

          // Apply animation transformations
          switch (element.animation.type) {
            case 'fadeIn':
              bufferCtx.globalAlpha = elementProgress;
              shouldDraw = elementProgress > 0;
              break;
            case 'slideIn':
              if (elementProgress > 0) {
                const slideDistance = 200 * (1 - elementProgress);
                bufferCtx.translate(-slideDistance, 0);
              } else {
                shouldDraw = false;
              }
              break;
            case 'zoomIn':
              if (elementProgress > 0) {
                const scale = elementProgress;
                bufferCtx.translate(element.x, element.y);
                bufferCtx.scale(scale, scale);
                bufferCtx.translate(-element.x, -element.y);
              } else {
                shouldDraw = false;
              }
              break;
            case 'rotate':
              bufferCtx.translate(element.x, element.y);
              bufferCtx.rotate(elementProgress * Math.PI * 2);
              bufferCtx.translate(-element.x, -element.y);
              shouldDraw = elementProgress > 0;
              break;
            case 'bounce':
              if (elementProgress > 0) {
                const bounceY = Math.abs(Math.sin(elementProgress * Math.PI * 3)) * 20;
                bufferCtx.translate(0, -bounceY);
              } else {
                shouldDraw = false;
              }
              break;
          }
        }

        // We'll apply special animations AFTER drawing but need to set them up before
        const t = frame / totalFrames;
        let imageAnimationApplied = false;

        // Store animation parameters for images to apply during drawing
        let imageAnimationParams: any = null;
        // Only apply image animations if animation.type is not 'none'
        if (element.type === 'image' && shouldDraw && element.animation?.type !== 'none') {
          // Debug: Log image element being processed
          if (frame === 0 || frame === 30) {
            console.log(`Frame ${frame} - Processing image:`, {
              name: element.props.name,
              src: element.props.src,
              animationType: element.animation?.type,
              hasStar: element.props.name === 'Star' || (element.props.src && typeof element.props.src === 'string' && element.props.src.includes('star'))
            });
          }

          // Enhanced image animations based on name/type - determine parameters
          if (element.props.name === 'Star' || (element.props.src && typeof element.props.src === 'string' && element.props.src.includes('star'))) {
            // Enhanced star sparkling animation
            const sparkle = Math.sin(t * Math.PI * 8) * 0.4 + 1;
            const rotation = t * Math.PI * 3;
            const orbit = Math.sin(t * Math.PI * 2) * 5;

            imageAnimationParams = {
              type: 'star',
              sparkle,
              rotation,
              orbit,
              shadowBlur: 35 + Math.sin(t * Math.PI * 6) * 25,
              shadowColor: ['#fbbf24', '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6'][Math.floor(t * 20) % 5]
            };
          } else if (element.props.name && element.props.name.toLowerCase().includes('heart')) {
            // Heart beating animation
            const heartbeat = Math.abs(Math.sin(t * Math.PI * 6)) * 0.3 + 1;
            const pulse = Math.sin(t * Math.PI * 12) > 0.5 ? 1.1 : 1;

            imageAnimationParams = {
              type: 'heart',
              scale: heartbeat * pulse,
              shadowBlur: 20 + Math.sin(t * Math.PI * 8) * 15,
              shadowColor: '#ec4899'
            };
          } else if (element.props.name && element.props.name.toLowerCase().includes('diamond')) {
            // Diamond crystal rotation with prismatic effect
            const rotation = t * Math.PI * 4;
            const shine = Math.sin(t * Math.PI * 10) * 0.2 + 1;

            imageAnimationParams = {
              type: 'diamond',
              rotation,
              scale: shine,
              shadowBlur: 30,
              shadowColor: `hsl(${(t * 720) % 360}, 100%, 70%)`
            };
          } else {
            // Default animation for all other assets - gentle pulse and glow
            const pulse = Math.sin(t * Math.PI * 4) * 0.15 + 1;
            const rotation = Math.sin(t * Math.PI * 2) * 0.1; // Subtle rotation

            imageAnimationParams = {
              type: 'default',
              scale: pulse,
              rotation,
              shadowBlur: 15 + Math.sin(t * Math.PI * 3) * 10,
              shadowColor: '#60a5fa'
            };
          }

          // Apply transformations if we have animation params
          if (imageAnimationParams) {
            imageAnimationApplied = true;

            if (imageAnimationParams.type === 'star') {
              bufferCtx.translate(element.x + imageAnimationParams.orbit, element.y);
              bufferCtx.scale(imageAnimationParams.sparkle, imageAnimationParams.sparkle);
              bufferCtx.rotate(imageAnimationParams.rotation);
              bufferCtx.translate(-element.x - imageAnimationParams.orbit, -element.y);
            } else if (imageAnimationParams.type === 'heart') {
              bufferCtx.translate(element.x, element.y);
              bufferCtx.scale(imageAnimationParams.scale, imageAnimationParams.scale);
              bufferCtx.translate(-element.x, -element.y);
            } else if (imageAnimationParams.type === 'diamond') {
              bufferCtx.translate(element.x, element.y);
              bufferCtx.rotate(imageAnimationParams.rotation);
              bufferCtx.scale(imageAnimationParams.scale, imageAnimationParams.scale);
              bufferCtx.translate(-element.x, -element.y);
            } else if (imageAnimationParams.type === 'default') {
              // Default animation for regular assets
              bufferCtx.translate(element.x, element.y);
              bufferCtx.rotate(imageAnimationParams.rotation);
              bufferCtx.scale(imageAnimationParams.scale, imageAnimationParams.scale);
              bufferCtx.translate(-element.x, -element.y);
            }

            bufferCtx.shadowBlur = imageAnimationParams.shadowBlur;
            bufferCtx.shadowColor = imageAnimationParams.shadowColor;
          }
        } else if (!element.animation?.type && !imageAnimationApplied) {
          // For non-image elements, only apply animations if no animation type is set
          if (element.type === 'circle') {
            // Enhanced glowing pulse effect for circles
            const pulse = Math.sin(t * Math.PI * 4) * 0.2 + 1;
            const breathe = Math.sin(t * Math.PI * 2) * 0.1 + 1;
            bufferCtx.translate(element.x, element.y);
            bufferCtx.scale(pulse * breathe, pulse * breathe);
            bufferCtx.translate(-element.x, -element.y);

            // Dynamic color-shifting glow
            const colorPhase = (t * Math.PI * 2) % (Math.PI * 2);
            const r = Math.sin(colorPhase) * 127 + 128;
            const g = Math.sin(colorPhase + Math.PI * 2/3) * 127 + 128;
            const b = Math.sin(colorPhase + Math.PI * 4/3) * 127 + 128;
            bufferCtx.shadowBlur = 25 + Math.sin(t * Math.PI * 3) * 15;
            bufferCtx.shadowColor = `rgb(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)})`;
          } else if (element.type === 'rect') {
            // Enhanced rectangle animation with morphing effect
            const rotation = t * Math.PI * 0.3;
            const skew = Math.sin(t * Math.PI * 4) * 0.1;
            const scale = Math.sin(t * Math.PI * 2) * 0.1 + 1;

            bufferCtx.translate(element.x, element.y);
            bufferCtx.rotate(rotation);
            bufferCtx.scale(scale, scale);
            bufferCtx.transform(1, skew, skew, 1, 0, 0); // Skew transformation
            bufferCtx.translate(-element.x, -element.y);

            // Pulsing border glow
            bufferCtx.shadowBlur = 15 + Math.sin(t * Math.PI * 4) * 10;
            bufferCtx.shadowColor = element.props.color || '#3b82f6';
          } else if (element.type === 'text') {
            // Enhanced text animation with typewriter and wave effects
            const wave = Math.sin(t * Math.PI * 2 + index) * 8;
            const jitter = (Math.random() - 0.5) * 2; // Small random jitter
            const scale = Math.sin(t * Math.PI * 3) * 0.05 + 1;

            bufferCtx.translate(jitter, wave);
            bufferCtx.scale(scale, scale);

            // Text glow effect
            bufferCtx.shadowBlur = 10 + Math.sin(t * Math.PI * 4) * 5;
            bufferCtx.shadowColor = element.props.color || '#ffffff';
          } else if (element.type === 'arrow' || element.type === 'line') {
            // Enhanced line animation with flow effect
            const flow = Math.sin(t * Math.PI * 6) * 3;
            const thickness = Math.sin(t * Math.PI * 4) * 0.3 + 1;

            bufferCtx.translate(flow, 0);
            bufferCtx.scale(1, thickness);

            // Dynamic color and glow
            const hue = (t * 360 + index * 45) % 360;
            bufferCtx.filter = `hue-rotate(${hue}deg) brightness(1.3) saturate(1.2)`;
            bufferCtx.shadowBlur = 8 + Math.sin(t * Math.PI * 5) * 5;
            bufferCtx.shadowColor = `hsl(${hue}, 70%, 60%)`;
          }
        }

        if (!shouldDraw) {
          bufferCtx.restore();
          return; // Use return instead of continue in forEach
        }

        // Draw element (simplified for GIF)
        switch (element.type) {
            case 'text':
              bufferCtx.font = `${element.props.weight} ${element.props.size}px ${element.props.font}`;
              bufferCtx.fillStyle = element.props.color;
              bufferCtx.textAlign = 'center';
              bufferCtx.textBaseline = 'middle';
              bufferCtx.fillText(element.props.text, element.x, element.y);
              break;
            case 'rect':
              if (element.props.filled) {
                bufferCtx.fillStyle = element.props.color;
                bufferCtx.fillRect(
                  element.x - element.props.width/2,
                  element.y - element.props.height/2,
                  element.props.width,
                  element.props.height
                );
              } else {
                bufferCtx.strokeStyle = element.props.color;
                bufferCtx.lineWidth = element.props.borderWidth || 2;
                bufferCtx.strokeRect(
                  element.x - element.props.width/2,
                  element.y - element.props.height/2,
                  element.props.width,
                  element.props.height
                );
              }
              break;
            case 'circle':
              bufferCtx.beginPath();
              bufferCtx.arc(element.x, element.y, element.props.radius, 0, Math.PI * 2);
              if (element.props.filled) {
                bufferCtx.fillStyle = element.props.color;
                bufferCtx.fill();
              } else {
                bufferCtx.strokeStyle = element.props.color;
                bufferCtx.lineWidth = element.props.borderWidth || 2;
                bufferCtx.stroke();
              }
              break;
            case 'arrow':
              const endX = element.props.endX || element.x + 150;
              const endY = element.props.endY || element.y;

              // Draw line with progressive animation
              let drawEndX = endX;
              let drawEndY = endY;
              if (element.animation?.type === 'slideIn' || !element.animation?.type) {
                drawEndX = element.x + (endX - element.x) * elementProgress;
                drawEndY = element.y + (endY - element.y) * elementProgress;
              }

              bufferCtx.strokeStyle = element.props.color || '#3B82F6';
              bufferCtx.lineWidth = element.props.strokeWidth || 3;
              bufferCtx.beginPath();
              bufferCtx.moveTo(element.x, element.y);
              bufferCtx.lineTo(drawEndX, drawEndY);
              bufferCtx.stroke();

              // Draw arrowhead if animation is complete
              if (drawEndX === endX && drawEndY === endY) {
                const angle = Math.atan2(endY - element.y, endX - element.x);
                const arrowSize = element.props.arrowSize || 15;
                bufferCtx.beginPath();
                bufferCtx.moveTo(endX, endY);
                bufferCtx.lineTo(
                  endX - arrowSize * Math.cos(angle - Math.PI/6),
                  endY - arrowSize * Math.sin(angle - Math.PI/6)
                );
                bufferCtx.moveTo(endX, endY);
                bufferCtx.lineTo(
                  endX - arrowSize * Math.cos(angle + Math.PI/6),
                  endY - arrowSize * Math.sin(angle + Math.PI/6)
                );
                bufferCtx.stroke();
              }
              break;
            case 'line':
              const lineEndX = element.props.endX || element.x + 200;
              const lineEndY = element.props.endY || element.y;

              // Draw line with progressive animation
              let drawLineEndX = lineEndX;
              let drawLineEndY = lineEndY;
              if (element.animation?.type === 'slideIn' || !element.animation?.type) {
                drawLineEndX = element.x + (lineEndX - element.x) * elementProgress;
                drawLineEndY = element.y + (lineEndY - element.y) * elementProgress;
              }

              bufferCtx.strokeStyle = element.props.color || '#64748B';
              bufferCtx.lineWidth = element.props.strokeWidth || 2;
              if (element.props.dashed) {
                bufferCtx.setLineDash([10, 10]);
              }
              bufferCtx.beginPath();
              bufferCtx.moveTo(element.x, element.y);
              bufferCtx.lineTo(drawLineEndX, drawLineEndY);
              bufferCtx.stroke();
              bufferCtx.setLineDash([]);
              break;
            case 'image':
              if (element.props.src) {
                const src = element.props.src as string;

                // Check if this is a ParticleField or other art element
                if (element.props.artType === 'particle') {
                  // Draw particle field effect
                  const width = element.props.width || 400;
                  const height = element.props.height || 300;
                  const centerX = element.x;
                  const centerY = element.y;

                  // Draw particle system
                  bufferCtx.save();

                  // Background gradient
                  const gradient = bufferCtx.createLinearGradient(
                    centerX - width/2, centerY - height/2,
                    centerX + width/2, centerY + height/2
                  );
                  gradient.addColorStop(0, '#0f172a');
                  gradient.addColorStop(1, '#1e293b');
                  bufferCtx.fillStyle = gradient;
                  bufferCtx.fillRect(centerX - width/2, centerY - height/2, width, height);

                  // Draw animated particles
                  const particleCount = 50;
                  const time = (frame / totalFrames) * Math.PI * 2;

                  for (let i = 0; i < particleCount; i++) {
                    const angle = (i / particleCount) * Math.PI * 2 + time;
                    const radius = 50 + Math.sin(time + i) * 30;
                    const particleX = centerX + Math.cos(angle) * radius;
                    const particleY = centerY + Math.sin(angle) * radius;
                    const size = 2 + Math.sin(time * 2 + i) * 2;

                    // Particle glow
                    bufferCtx.shadowBlur = 15;
                    bufferCtx.shadowColor = ['#06b6d4', '#8b5cf6', '#ec4899', '#fbbf24'][i % 4];

                    // Draw particle
                    bufferCtx.fillStyle = bufferCtx.shadowColor;
                    bufferCtx.globalAlpha = 0.8;
                    bufferCtx.beginPath();
                    bufferCtx.arc(particleX, particleY, size, 0, Math.PI * 2);
                    bufferCtx.fill();

                    // Draw connections between nearby particles
                    for (let j = i + 1; j < Math.min(i + 5, particleCount); j++) {
                      const angle2 = (j / particleCount) * Math.PI * 2 + time;
                      const radius2 = 50 + Math.sin(time + j) * 30;
                      const particleX2 = centerX + Math.cos(angle2) * radius2;
                      const particleY2 = centerY + Math.sin(angle2) * radius2;

                      const distance = Math.sqrt(
                        Math.pow(particleX - particleX2, 2) +
                        Math.pow(particleY - particleY2, 2)
                      );

                      if (distance < 60) {
                        bufferCtx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
                        bufferCtx.lineWidth = 0.5;
                        bufferCtx.globalAlpha = (60 - distance) / 60 * 0.3;
                        bufferCtx.beginPath();
                        bufferCtx.moveTo(particleX, particleY);
                        bufferCtx.lineTo(particleX2, particleY2);
                        bufferCtx.stroke();
                      }
                    }
                  }

                  bufferCtx.restore();
                } else {
                  // Regular image handling
                  const img = imageCache.current?.get(src);
                  if (img && img.complete && img.naturalWidth > 0) {
                    const width = element.props.width || 100;
                    const height = element.props.height || 100;
                    bufferCtx.drawImage(
                      img,
                      element.x - width / 2,
                      element.y - height / 2,
                      width,
                      height
                    );
                  } else {
                    // Draw placeholder
                    bufferCtx.fillStyle = '#374151';
                    bufferCtx.fillRect(
                      element.x - (element.props.width || 100) / 2,
                      element.y - (element.props.height || 100) / 2,
                      element.props.width || 100,
                      element.props.height || 100
                    );
                    bufferCtx.fillStyle = '#9ca3af';
                    bufferCtx.font = '14px sans-serif';
                    bufferCtx.textAlign = 'center';
                    bufferCtx.textBaseline = 'middle';
                    bufferCtx.fillText('Image', element.x, element.y);
                  }
                }
              }
              break;
          }

        bufferCtx.restore();
      });

      // Create final canvas with original dimensions by cropping the buffer
      const frameCanvas = document.createElement('canvas');
      frameCanvas.width = CANVAS_WIDTH;
      frameCanvas.height = CANVAS_HEIGHT;
      const frameCtx = frameCanvas.getContext('2d');
      if (frameCtx) {
        // Copy the cropped area from buffer canvas (removing glow buffer)
        frameCtx.drawImage(
          bufferCanvas,
          GLOW_BUFFER, // source x
          GLOW_BUFFER, // source y
          CANVAS_WIDTH, // source width
          CANVAS_HEIGHT, // source height
          0, // dest x
          0, // dest y
          CANVAS_WIDTH, // dest width
          CANVAS_HEIGHT // dest height
        );
      }

      // Add frame with proper delay for smooth animation
      // 3000ms total / 60 frames = 50ms per frame

      // Debug: Check if frameCanvas has content
      if (frame === 0 || frame === 30) {
        const testCtx = frameCanvas.getContext('2d');
        if (testCtx) {
          const imageData = testCtx.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
          const hasContent = imageData.data.some((value, index) => {
            // Check if any pixel is not black (skip alpha channel)
            return index % 4 !== 3 && value > 0;
          });
          console.log(`Frame ${frame} has content:`, hasContent);
          if (frame === 0 && elements.length > 0) {
            console.log('Element animation check:', elements[0].animation);
            const firstProgress = elements[0].animation?.type ?
              Math.min(1, ((frame / totalFrames) * animationDuration) / (elements[0].animation.duration || 1000)) : 1;
            console.log('First element progress would be:', firstProgress);
          }
        }
      }

      gif.addFrame(frameCanvas, { copy: true, delay: 50 }); // 50ms per frame for 20fps
    }

    console.log(`All ${totalFrames} frames added to GIF`);

    gif.on('progress', (progress: number) => {
      console.log(`GIF generation progress: ${Math.round(progress * 100)}%`);
      const exportButton = document.querySelector('[data-export-gif]') as HTMLButtonElement;
      if (exportButton && progress > 0) {
        exportButton.textContent = `Generating... ${Math.round(progress * 100)}%`;
      }
    });

    gif.on('finished', (blob: Blob) => {
      try {
        hideLoading();

        // Validate blob
        if (!blob || blob.size === 0) {
          throw new Error('GIF 생성 실패: 빈 파일');
        }

        console.log('GIF generated successfully, size:', blob.size);

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `scene-${Date.now()}.gif`;
        link.href = url;

        // Add link to document before clicking (for better compatibility)
        document.body.appendChild(link);
        link.click();

        // Clean up
        setTimeout(() => {
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }, 100);

        // Restore export button
        const exportButton = document.querySelector('[data-export-gif]') as HTMLButtonElement;
        if (exportButton) {
          exportButton.textContent = 'Export GIF';
          exportButton.disabled = false;
        }

        console.log('GIF export completed successfully');
      } catch (error) {
        hideLoading();
        addError('GIF 다운로드 실패');
        console.error('GIF download error:', error);

        // Restore button state
        const exportButton = document.querySelector('[data-export-gif]') as HTMLButtonElement;
        if (exportButton) {
          exportButton.textContent = 'Export GIF';
          exportButton.disabled = false;
        }
      }
    });

    // Add error handling for GIF generation
    gif.on('abort', () => {
      hideLoading();
      addError('GIF 생성이 중단되었습니다');
      const exportButton = document.querySelector('[data-export-gif]') as HTMLButtonElement;
      if (exportButton) {
        exportButton.textContent = 'Export GIF';
        exportButton.disabled = false;
      }
    });

    console.log(`Starting GIF render with ${totalFrames} frames...`);
    gif.render();

    } catch (error) {
      hideLoading();
      addError('GIF 생성 중 오류 발생');
      console.error('GIF generation error:', error);

      // Restore button state
      const exportButton = document.querySelector('[data-export-gif]') as HTMLButtonElement;
      if (exportButton) {
        exportButton.textContent = 'Export GIF';
        exportButton.disabled = false;
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Error Notifications */}
      {errors.length > 0 && (
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {errors.map((error, index) => (
            <div
              key={error}
              className="bg-red-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-slide-in"
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">{error.split(': ')[1]}</span>
            </div>
          ))}
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center">
          <div className="bg-gray-800 text-white px-6 py-4 rounded-lg shadow-xl flex items-center gap-3">
            <svg className="animate-spin h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{loadingMessage}</span>
          </div>
        </div>
      )}

      {/* Compact Professional Header - 2 Row Layout */}
      <div className="bg-gray-900 border-b border-gray-800 px-4 py-3">
        {/* First Row - Title, Info and Main Actions */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent whitespace-nowrap">
              Modern Scene Builder
            </h1>
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2 py-1 bg-blue-600/20 text-blue-400 rounded text-[11px]">
                16:9 • {CANVAS_WIDTH}×{CANVAS_HEIGHT}
              </span>
              <span className="px-2 py-1 bg-gray-800 text-gray-400 rounded text-[11px]">
                {elements.length} elements
              </span>
            </div>
          </div>

          {/* Main Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setAnimationFrame(0);
                setIsPlaying(true);
              }}
              className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-xs"
            >
              ▶ Preview
            </button>
            <button
              onClick={exportPNG}
              className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs"
            >
              Export PNG
            </button>
            <button
              onClick={exportGIF}
              data-export-gif
              className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-xs"
            >
              Export GIF
            </button>
            <button
              onClick={exportVideo}
              data-export-video
              className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs"
              title="Export as WebM video"
            >
              Export WebM
            </button>
            <button
              onClick={exportMP4}
              data-export-mp4
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs"
              title="Export as MP4 video (FFmpeg)"
            >
              Export MP4
            </button>
            {onSave && (
              <button
                onClick={() => onSave(elements)}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs"
              >
                Save Scene
              </button>
            )}
          </div>
        </div>

        {/* Second Row - Tools and Controls */}
        <div className="flex items-center justify-between">
          {/* Left Side - Controls */}
          <div className="flex items-center gap-2">
            <select
              value={currentPalette}
              onChange={(e) => setCurrentPalette(e.target.value as keyof typeof colorPalettes)}
              className="px-2 py-1 bg-gray-800 text-white rounded text-xs"
            >
              <option value="modern">Modern</option>
              <option value="pastel">Pastel</option>
              <option value="dark">Dark</option>
              <option value="neon">Neon</option>
            </select>

            <button
              onClick={() => setShowGrid(!showGrid)}
              className={`px-2 py-1 rounded text-xs ${
                showGrid ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400'
              }`}
            >
              Grid
            </button>

            <button
              onClick={() => setSnapToGrid(!snapToGrid)}
              className={`px-2 py-1 rounded text-xs ${
                snapToGrid ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400'
              }`}
            >
              Snap
            </button>

            <button
              onClick={groupElements}
              disabled={selectedElements.size < 2}
              className={`px-3 py-1 rounded text-xs ${
                selectedElements.size < 2
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
              title="Group selected elements (Cmd/Ctrl+G)"
            >
              Group
            </button>

            <button
              onClick={ungroupElements}
              disabled={!elements.some(el => el.type === 'group' && selectedElements.has(el.id))}
              className={`px-3 py-1 rounded text-xs ${
                !elements.some(el => el.type === 'group' && selectedElements.has(el.id))
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
              title="Ungroup selected groups (Cmd/Ctrl+Shift+G)"
            >
              Ungroup
            </button>
          </div>

          {/* Right Side - Zoom Controls */}
          <div className="flex items-center bg-gray-800 rounded px-2 py-1">
            <button
              onClick={() => setCanvasScale(Math.max(0.1, canvasScale - 0.1))}
              className="px-2 py-1 text-gray-400 hover:text-white transition-colors"
              title="Zoom Out"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <input
              type="range"
              min="10"
              max="200"
              value={canvasScale * 100}
              onChange={(e) => setCanvasScale(Number(e.target.value) / 100)}
              className="w-20 mx-2"
            />
            <span className="text-xs text-white font-medium min-w-[40px] text-center">
              {Math.round(canvasScale * 100)}%
            </span>
            <button
              onClick={() => setCanvasScale(Math.min(2, canvasScale + 0.1))}
              className="px-2 py-1 text-gray-400 hover:text-white transition-colors"
              title="Zoom In"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <div className="border-l border-gray-700 ml-2 pl-2 flex gap-1">
              <button
                onClick={() => setCanvasScale(1)}
                className="text-xs px-2 py-1 text-gray-500 hover:text-white transition-colors"
              >
                100%
              </button>
              <button
                onClick={() => {
                  const container = document.getElementById('canvas-container');
                  if (container) {
                    const scale = Math.min(
                      (container.clientWidth - 64) / 1920,
                      (container.clientHeight - 64) / 1080
                    );
                    setCanvasScale(Math.min(1, scale));
                    setCanvasOffset({ x: 0, y: 0 }); // Reset position
                  }
                }}
                className="text-xs px-2 py-1 text-gray-500 hover:text-white transition-colors"
              >
                Fit
              </button>
              <button
                onClick={() => {
                  setCanvasScale(0.4);
                  setCanvasOffset({ x: 0, y: 0 });
                }}
                className="text-xs px-2 py-1 text-gray-500 hover:text-white transition-colors"
                title="Reset View"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex" style={{ height: 'calc(100vh - 120px)' }}>
        {/* Tools Panel - Fixed Width for Content */}
        <div className="bg-gray-900 border-r border-gray-800 overflow-y-auto flex-shrink-0" style={{ width: '320px', height: '100%' }}>
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-800">
            <button
              onClick={() => setActiveTab('templates')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'templates'
                  ? 'text-blue-400 border-b-2 border-blue-400 bg-gray-800/50'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Elements
            </button>
            <button
              onClick={() => setActiveTab('assets')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'assets'
                  ? 'text-blue-400 border-b-2 border-blue-400 bg-gray-800/50'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Assets
            </button>
            <button
              onClick={() => setActiveTab('lab')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors relative ${
                activeTab === 'lab'
                  ? 'text-purple-400 border-b-2 border-purple-400 bg-gray-800/50'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              🧪 Lab
              <span className="absolute top-2 right-2 text-[8px] bg-purple-600 text-white px-1 rounded">NEW</span>
            </button>
          </div>

          {activeTab === 'templates' ? (
          <div className="space-y-4 p-4">
            {/* Add Elements */}
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2 tracking-wide">Add Elements</h3>
              <div className="grid grid-cols-3 gap-1">
                <button
                  onClick={() => addElement('text')}
                  className="p-2 bg-gray-800 hover:bg-gray-700 rounded text-xs text-white flex flex-col items-center gap-0.5 transition-colors"
                >
                  <span className="text-lg">T</span>
                  <span className="text-[10px]">Text</span>
                </button>
                <button
                  onClick={() => addElement('rect')}
                  className="p-2 bg-gray-800 hover:bg-gray-700 rounded text-xs text-white flex flex-col items-center gap-0.5 transition-colors"
                >
                  <span className="text-lg">□</span>
                  <span className="text-[10px]">Rect</span>
                </button>
                <button
                  onClick={() => addElement('circle')}
                  className="p-2 bg-gray-800 hover:bg-gray-700 rounded text-xs text-white flex flex-col items-center gap-0.5 transition-colors"
                >
                  <span className="text-lg">○</span>
                  <span className="text-[10px]">Circle</span>
                </button>
                <button
                  onClick={() => addElement('arrow')}
                  className="p-2 bg-gray-800 hover:bg-gray-700 rounded text-xs text-white flex flex-col items-center gap-0.5 transition-colors"
                >
                  <span className="text-lg">→</span>
                  <span className="text-[10px]">Arrow</span>
                </button>
                <button
                  onClick={() => addElement('line')}
                  className="p-2 bg-gray-800 hover:bg-gray-700 rounded text-xs text-white flex flex-col items-center gap-0.5 transition-colors"
                >
                  <span className="text-lg">—</span>
                  <span className="text-[10px]">Line</span>
                </button>
                <button
                  onClick={() => {
                    fileInputRef.current?.click();
                  }}
                  className="p-2 bg-gray-800 hover:bg-gray-700 rounded text-xs text-white flex flex-col items-center gap-0.5 transition-colors"
                >
                  <span className="text-lg">🖼</span>
                  <span className="text-[10px]">Image</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        const newElement: CanvasElement = {
                          id: `element-${Date.now()}`,
                          type: 'image',
                          x: CANVAS_WIDTH / 2,
                          y: CANVAS_HEIGHT / 2,
                          props: {
                            src: event.target?.result,
                            width: 200,
                            height: 200,
                            name: file.name
                          },
                          animation: {
                            type: 'fadeIn',
                            duration: 1000,
                            delay: elements.length * 100,
                            easing: 'ease-out'
                          }
                        };
                        setElements([...elements, newElement]);
                        setSelectedElement(newElement);
                      };
                      reader.readAsDataURL(file);
                      e.target.value = ''; // Reset file input
                    }
                  }}
                />
              </div>
            </div>

            {/* Selected Element Controls */}
            {selectedElement && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-400 uppercase">Properties</h3>

                {/* Position */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-gray-500">X</label>
                    <input
                      type="number"
                      value={Math.round(selectedElement.x)}
                      onChange={(e) => updateElement(selectedElement.id, { x: Number(e.target.value) })}
                      className="w-full px-2 py-1 bg-gray-800 rounded text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Y</label>
                    <input
                      type="number"
                      value={Math.round(selectedElement.y)}
                      onChange={(e) => updateElement(selectedElement.id, { y: Number(e.target.value) })}
                      className="w-full px-2 py-1 bg-gray-800 rounded text-sm text-white"
                    />
                  </div>
                </div>

                {/* Type-specific controls */}
                {selectedElement.type === 'text' && (
                  <>
                    <div>
                      <label className="text-xs text-gray-500">Text</label>
                      <input
                        type="text"
                        value={selectedElement.props.text}
                        onChange={(e) => updateElement(selectedElement.id, {
                          props: { ...selectedElement.props, text: e.target.value }
                        })}
                        className="w-full px-2 py-1 bg-gray-800 rounded text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Size</label>
                      <input
                        type="range"
                        min="12"
                        max="144"
                        value={selectedElement.props.size}
                        onChange={(e) => updateElement(selectedElement.id, {
                          props: { ...selectedElement.props, size: Number(e.target.value) }
                        })}
                        className="w-full"
                      />
                      <span className="text-xs text-gray-500">{selectedElement.props.size}px</span>
                    </div>
                  </>
                )}

                {/* Image Properties */}
                {selectedElement.type === 'image' && (
                  <>
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">Image Source</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              updateElement(selectedElement.id, {
                                props: { ...selectedElement.props, src: event.target?.result, name: file.name }
                              });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="w-full text-xs text-gray-400 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                      />
                    </div>

                    {/* Aspect Ratio Lock */}
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        type="checkbox"
                        id="lockAspectRatio"
                        checked={lockAspectRatio}
                        onChange={(e) => setLockAspectRatio(e.target.checked)}
                        className="rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-blue-500"
                      />
                      <label htmlFor="lockAspectRatio" className="text-xs text-gray-400 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        Lock Aspect Ratio
                      </label>
                    </div>

                    <div>
                      <label className="text-xs text-gray-500">Width</label>
                      <input
                        type="range"
                        min="50"
                        max="500"
                        value={selectedElement.props.width || 100}
                        onChange={(e) => {
                          const newWidth = Number(e.target.value);
                          if (lockAspectRatio) {
                            const aspectRatio = (selectedElement.props.width || 100) / (selectedElement.props.height || 100);
                            const newHeight = Math.round(newWidth / aspectRatio);
                            updateElement(selectedElement.id, {
                              props: { ...selectedElement.props, width: newWidth, height: newHeight }
                            });
                          } else {
                            updateElement(selectedElement.id, {
                              props: { ...selectedElement.props, width: newWidth }
                            });
                          }
                        }}
                        className="w-full"
                      />
                      <span className="text-xs text-gray-500">{selectedElement.props.width || 100}px</span>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Height</label>
                      <input
                        type="range"
                        min="50"
                        max="500"
                        value={selectedElement.props.height || 100}
                        onChange={(e) => {
                          const newHeight = Number(e.target.value);
                          if (lockAspectRatio) {
                            const aspectRatio = (selectedElement.props.width || 100) / (selectedElement.props.height || 100);
                            const newWidth = Math.round(newHeight * aspectRatio);
                            updateElement(selectedElement.id, {
                              props: { ...selectedElement.props, width: newWidth, height: newHeight }
                            });
                          } else {
                            updateElement(selectedElement.id, {
                              props: { ...selectedElement.props, height: newHeight }
                            });
                          }
                        }}
                        className="w-full"
                      />
                      <span className="text-xs text-gray-500">{selectedElement.props.height || 100}px</span>
                    </div>
                  </>
                )}

                {/* Color (for non-image elements) */}
                {selectedElement.type !== 'image' && (
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
                )}

                {/* Animation Section */}
                <div className="border-t border-gray-700 pt-3 mt-3">
                  <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">Animation</h4>

                  {/* Animation Type */}
                  <div className="mb-2">
                    <label className="text-xs text-gray-500">Type</label>
                    <select
                      value={selectedElement.animation?.type || 'fadeIn'}
                      onChange={(e) => updateElement(selectedElement.id, {
                        animation: {
                          ...selectedElement.animation!,
                          type: e.target.value as any
                        }
                      })}
                      className="w-full px-2 py-1 bg-gray-800 rounded text-sm text-white"
                    >
                      <option value="none">None</option>
                      <option value="fadeIn">Fade In</option>
                      <option value="slideIn">Slide In</option>
                      <option value="zoomIn">Zoom In</option>
                      <option value="rotate">Rotate</option>
                      <option value="bounce">Bounce</option>
                    </select>
                  </div>

                  {/* Duration */}
                  <div className="mb-2">
                    <label className="text-xs text-gray-500">Duration (ms)</label>
                    <input
                      type="number"
                      min="100"
                      max="5000"
                      step="100"
                      value={selectedElement.animation?.duration || 1000}
                      onChange={(e) => updateElement(selectedElement.id, {
                        animation: {
                          ...selectedElement.animation!,
                          duration: Number(e.target.value)
                        }
                      })}
                      className="w-full px-2 py-1 bg-gray-800 rounded text-sm text-white"
                    />
                  </div>

                  {/* Delay */}
                  <div className="mb-2">
                    <label className="text-xs text-gray-500">Delay (ms)</label>
                    <input
                      type="number"
                      min="0"
                      max="3000"
                      step="50"
                      value={selectedElement.animation?.delay || 0}
                      onChange={(e) => updateElement(selectedElement.id, {
                        animation: {
                          ...selectedElement.animation!,
                          delay: Number(e.target.value)
                        }
                      })}
                      className="w-full px-2 py-1 bg-gray-800 rounded text-sm text-white"
                    />
                  </div>

                  {/* Easing */}
                  <div className="mb-2">
                    <label className="text-xs text-gray-500">Easing</label>
                    <select
                      value={selectedElement.animation?.easing || 'ease-out'}
                      onChange={(e) => updateElement(selectedElement.id, {
                        animation: {
                          ...selectedElement.animation!,
                          easing: e.target.value
                        }
                      })}
                      className="w-full px-2 py-1 bg-gray-800 rounded text-sm text-white"
                    >
                      <option value="linear">Linear</option>
                      <option value="ease-in">Ease In</option>
                      <option value="ease-out">Ease Out</option>
                      <option value="ease-in-out">Ease In-Out</option>
                      <option value="bounce">Bounce</option>
                    </select>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={duplicateElement}
                    className="flex-1 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded text-sm text-white"
                  >
                    Duplicate
                  </button>
                  <button
                    onClick={deleteElement}
                    className="flex-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded text-sm text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}

            {/* Elements List */}
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase mb-3">Layers</h3>
              <div className="space-y-1 max-h-64 overflow-y-auto">
                {elements.slice().reverse().map((element, index) => (
                  <button
                    key={element.id}
                    onClick={() => setSelectedElement(element)}
                    className={`w-full px-3 py-2 rounded text-left text-xs transition-colors ${
                      selectedElement?.id === element.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="capitalize font-medium">{element.type}</span>
                      {element.type === 'text' && (
                        <span className="text-xs opacity-60 truncate ml-2 max-w-[100px]">
                          {element.props.text}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
                {elements.length === 0 && (
                  <div className="text-center text-gray-500 text-xs py-4">
                    No elements yet
                  </div>
                )}
              </div>
            </div>
          </div>
          ) : activeTab === 'assets' ? (
            /* Assets Library Tab */
            <AssetsLibrary onAssetSelect={handleAssetSelect} />
          ) : (
            /* Lab Tab - Experimental Art Features */
            <div className="space-y-4 p-4">
              <div className="bg-purple-900/20 border border-purple-600/30 rounded-lg p-3">
                <h3 className="text-sm font-semibold text-purple-400 mb-2">🧪 Experimental Lab</h3>
                <p className="text-xs text-gray-400">
                  Explore generative art and advanced visual effects. These features are experimental and may impact performance.
                </p>
              </div>

              {/* Art Mode Toggle */}
              <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                <div>
                  <h4 className="text-sm font-medium text-white">Art Mode</h4>
                  <p className="text-xs text-gray-400 mt-1">Enable experimental art features</p>
                </div>
                <button
                  onClick={() => setArtMode(!artMode)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    artMode ? 'bg-purple-600' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      artMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Quality Settings */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-gray-400 uppercase">Performance Settings</h4>
                <div className="flex gap-2">
                  <button
                    onClick={() => ArtConfig.setQuality('low')}
                    className="flex-1 px-2 py-1 text-xs bg-gray-800 hover:bg-gray-700 rounded text-white"
                  >
                    Low
                  </button>
                  <button
                    onClick={() => ArtConfig.setQuality('medium')}
                    className="flex-1 px-2 py-1 text-xs bg-gray-800 hover:bg-gray-700 rounded text-white"
                  >
                    Medium
                  </button>
                  <button
                    onClick={() => ArtConfig.setQuality('high')}
                    className="flex-1 px-2 py-1 text-xs bg-gray-800 hover:bg-gray-700 rounded text-white"
                  >
                    High
                  </button>
                </div>
              </div>

              {/* Generative Art Elements */}
              {artMode && (
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-gray-400 uppercase">Generative Art</h4>

                  {/* Particle System */}
                  <div className="bg-gray-800 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-white">Particle Field</span>
                      <span className="text-xs bg-purple-600/30 text-purple-400 px-2 py-1 rounded">NEW</span>
                    </div>

                    {/* Particle Preview */}
                    <div className="mb-3 rounded-lg overflow-hidden bg-gray-900">
                      <ParticleField
                        width={280}
                        height={150}
                        particleCount={50}
                        speed={0.5}
                        interactive={true}
                      />
                    </div>

                    <button
                      onClick={() => {
                        const particleElement = new ParticleFieldArtElement({
                          width: 400,
                          height: 300,
                          particleCount: 100,
                          colors: ['#06b6d4', '#8b5cf6', '#ec4899'],
                          speed: 1,
                          fadeOut: true
                        });
                        const canvasElement = ArtAdapter.convertToCanvasElement(particleElement);
                        setElements([...elements, canvasElement]);
                        setSelectedElement(canvasElement);
                      }}
                      className="w-full px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded text-sm text-white font-medium transition-colors"
                    >
                      Add to Canvas
                    </button>
                  </div>

                  {/* More Art Elements (Future) */}
                  <div className="space-y-2">
                    <button
                      disabled
                      className="w-full px-3 py-2 bg-gray-800/50 rounded text-sm text-gray-500 flex items-center justify-between cursor-not-allowed"
                    >
                      <span>Fractal Generator</span>
                      <span className="text-xs">Coming Soon</span>
                    </button>
                    <button
                      disabled
                      className="w-full px-3 py-2 bg-gray-800/50 rounded text-sm text-gray-500 flex items-center justify-between cursor-not-allowed"
                    >
                      <span>Wave Animation</span>
                      <span className="text-xs">Coming Soon</span>
                    </button>
                    <button
                      disabled
                      className="w-full px-3 py-2 bg-gray-800/50 rounded text-sm text-gray-500 flex items-center justify-between cursor-not-allowed"
                    >
                      <span>3D Objects</span>
                      <span className="text-xs">Coming Soon</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Info Section */}
              <div className="border-t border-gray-700 pt-3">
                <p className="text-xs text-gray-500">
                  💡 Tip: Art elements work best with dark backgrounds. Adjust quality settings if you experience performance issues.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Canvas Area */}
        <div id="canvas-container" className="flex-1 bg-gradient-to-br from-gray-900 to-gray-950 flex items-center justify-center overflow-auto" style={{ height: '100%', padding: '40px' }}>
          <div
            className="relative rounded-lg shadow-2xl"
            style={{
              transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px) scale(${canvasScale})`,
              transformOrigin: 'center',
              transition: isPanning ? 'none' : 'transform 0.2s',
              margin: 'auto',
              cursor: isPanning ? 'grab' : 'default'
            }}
          >
            <canvas
              ref={canvasRef}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              className="rounded-lg cursor-move"
              style={{
                background: '#0F172A',
                boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              // onWheel is handled by useEffect to avoid passive event listener warning
              onDragOver={handleCanvasDragOver}
              onDragLeave={handleCanvasDragLeave}
              onDrop={handleCanvasDrop}
            />

            {/* Drag Over Indicator */}
            {isDraggingOver && (
              <div className="absolute inset-0 bg-blue-500 bg-opacity-10 border-2 border-blue-500 border-dashed rounded-lg pointer-events-none flex items-center justify-center">
                <div className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg">
                  Drop here to add asset
                </div>
              </div>
            )}

            {/* 16:9 Indicator */}
            <div className="absolute -top-8 left-0 text-xs text-blue-400 font-medium">
              16:9 Aspect Ratio
            </div>
          </div>
        </div>
      </div>

      {/* Professional Status Bar */}
      <div className="bg-gray-900 border-t border-gray-800 px-6 py-2 flex items-center justify-between text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-gray-400">Ready</span>
          </div>
          <span className="text-gray-600">|</span>
          <span className="text-gray-400">
            Canvas: <span className="text-white font-medium">{Math.round(canvasScale * 100)}%</span>
          </span>
          <span className="text-gray-600">|</span>
          <span className="text-gray-400">
            16:9 <span className="text-blue-400 font-medium">1920×1080</span>
          </span>
          {selectedElements.size > 1 ? (
            <>
              <span className="text-gray-600">|</span>
              <span className="text-gray-400">
                <span className="text-blue-400 font-medium">{selectedElements.size} elements selected</span>
              </span>
            </>
          ) : selectedElement ? (
            <>
              <span className="text-gray-600">|</span>
              <span className="text-gray-400">
                {selectedElement.type} <span className="text-yellow-400">({Math.round(selectedElement.x)}, {Math.round(selectedElement.y)})</span>
              </span>
            </>
          ) : null}
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-400">{elements.length} elements</span>
          <span className="text-gray-600">|</span>
          <span className="text-gray-500">Shortcuts: Space+Drag to pan canvas • Drag to move element • Delete to remove • Ctrl+D to duplicate</span>
        </div>
      </div>
    </div>
  );
}