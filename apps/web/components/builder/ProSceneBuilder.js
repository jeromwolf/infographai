"use client";
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ProSceneBuilder;
const react_1 = __importStar(require("react"));
function ProSceneBuilder({ initialCommands = [], onSave }) {
    const canvasRef = (0, react_1.useRef)(null);
    const containerRef = (0, react_1.useRef)(null);
    // State
    const [elements, setElements] = (0, react_1.useState)([]);
    const [selectedElement, setSelectedElement] = (0, react_1.useState)(null);
    const [selectedElements, setSelectedElements] = (0, react_1.useState)([]);
    // Layout State
    const [leftPanelOpen, setLeftPanelOpen] = (0, react_1.useState)(true);
    const [rightPanelOpen, setRightPanelOpen] = (0, react_1.useState)(true);
    const [leftPanelWidth, setLeftPanelWidth] = (0, react_1.useState)(280);
    const [rightPanelWidth, setRightPanelWidth] = (0, react_1.useState)(320);
    const [layoutPreset, setLayoutPreset] = (0, react_1.useState)('default');
    // Canvas State
    const [canvasZoom, setCanvasZoom] = (0, react_1.useState)(100);
    const [canvasOffset, setCanvasOffset] = (0, react_1.useState)({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = (0, react_1.useState)(false);
    const [isDragging, setIsDragging] = (0, react_1.useState)(false);
    const [dragStart, setDragStart] = (0, react_1.useState)({ x: 0, y: 0 });
    // UI State
    const [showGrid, setShowGrid] = (0, react_1.useState)(true);
    const [snapToGrid, setSnapToGrid] = (0, react_1.useState)(true);
    const [isFullscreen, setIsFullscreen] = (0, react_1.useState)(false);
    const [activeTab, setActiveTab] = (0, react_1.useState)('properties');
    const [notification, setNotification] = (0, react_1.useState)(null);
    const [loadedImages, setLoadedImages] = (0, react_1.useState)({});
    // Canvas dimensions (16:9 ratio)
    const CANVAS_WIDTH = 1920;
    const CANVAS_HEIGHT = 1080;
    // Grid size
    const GRID_SIZE = 20;
    // Load saved layout preferences
    (0, react_1.useEffect)(() => {
        const savedLayout = localStorage.getItem('proSceneBuilder_layout');
        if (savedLayout) {
            const layout = JSON.parse(savedLayout);
            setLeftPanelOpen(layout.leftPanelOpen ?? true);
            setRightPanelOpen(layout.rightPanelOpen ?? true);
            setLeftPanelWidth(layout.leftPanelWidth ?? 280);
            setRightPanelWidth(layout.rightPanelWidth ?? 320);
            setCanvasZoom(layout.canvasZoom ?? 100);
            setShowGrid(layout.showGrid ?? true);
            setSnapToGrid(layout.snapToGrid ?? true);
        }
    }, []);
    // Save layout preferences
    const saveLayoutPreferences = (0, react_1.useCallback)(() => {
        const layout = {
            leftPanelOpen,
            rightPanelOpen,
            leftPanelWidth,
            rightPanelWidth,
            canvasZoom,
            showGrid,
            snapToGrid
        };
        localStorage.setItem('proSceneBuilder_layout', JSON.stringify(layout));
    }, [leftPanelOpen, rightPanelOpen, leftPanelWidth, rightPanelWidth, canvasZoom, showGrid, snapToGrid]);
    // Auto-save layout changes
    (0, react_1.useEffect)(() => {
        const timer = setTimeout(saveLayoutPreferences, 1000);
        return () => clearTimeout(timer);
    }, [saveLayoutPreferences]);
    // Apply layout preset
    const applyLayoutPreset = (preset) => {
        setLayoutPreset(preset);
        switch (preset) {
            case 'compact':
                setLeftPanelOpen(false);
                setRightPanelOpen(false);
                break;
            case 'default':
                setLeftPanelOpen(true);
                setRightPanelOpen(true);
                setLeftPanelWidth(280);
                setRightPanelWidth(320);
                break;
            case 'wide':
                setLeftPanelOpen(true);
                setRightPanelOpen(true);
                setLeftPanelWidth(200);
                setRightPanelWidth(200);
                break;
            case 'focus':
                setIsFullscreen(true);
                setLeftPanelOpen(false);
                setRightPanelOpen(false);
                break;
        }
    };
    // Handle zoom
    const handleZoom = (delta, centerX, centerY) => {
        const newZoom = Math.max(25, Math.min(400, canvasZoom + delta));
        setCanvasZoom(newZoom);
        // Adjust offset to zoom towards cursor position
        if (centerX !== undefined && centerY !== undefined && containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const x = centerX - rect.left;
            const y = centerY - rect.top;
            const zoomRatio = newZoom / canvasZoom;
            setCanvasOffset({
                x: x - (x - canvasOffset.x) * zoomRatio,
                y: y - (y - canvasOffset.y) * zoomRatio
            });
        }
    };
    // Fit canvas to screen
    const fitToScreen = () => {
        if (containerRef.current) {
            const container = containerRef.current;
            const scaleX = container.clientWidth / CANVAS_WIDTH;
            const scaleY = container.clientHeight / CANVAS_HEIGHT;
            const scale = Math.min(scaleX, scaleY) * 0.9; // 90% to leave some padding
            setCanvasZoom(Math.round(scale * 100));
            setCanvasOffset({ x: 0, y: 0 });
        }
    };
    // Reset zoom
    const resetZoom = () => {
        setCanvasZoom(100);
        setCanvasOffset({ x: 0, y: 0 });
    };
    // Handle wheel for zoom
    (0, react_1.useEffect)(() => {
        const handleWheel = (e) => {
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                const delta = -e.deltaY * 0.1;
                handleZoom(delta, e.clientX, e.clientY);
            }
        };
        const container = containerRef.current;
        if (container) {
            container.addEventListener('wheel', handleWheel, { passive: false });
        }
        return () => {
            if (container) {
                container.removeEventListener('wheel', handleWheel);
            }
        };
    }, [canvasZoom, canvasOffset]);
    // Handle panning
    const handleMouseDown = (e) => {
        if (e.button === 1 || (e.button === 0 && e.altKey)) { // Middle mouse or Alt+Left click
            setIsPanning(true);
            setDragStart({ x: e.clientX - canvasOffset.x, y: e.clientY - canvasOffset.y });
            e.preventDefault();
        }
    };
    const handleMouseMove = (e) => {
        if (isPanning) {
            setCanvasOffset({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y
            });
        }
    };
    const handleMouseUp = () => {
        setIsPanning(false);
        setIsDragging(false);
    };
    // Add element functions
    const addElement = (type) => {
        const centerX = CANVAS_WIDTH / 2;
        const centerY = CANVAS_HEIGHT / 2;
        let newElement = {
            id: `${type}-${Date.now()}-${Math.random()}`,
            type,
            x: centerX,
            y: centerY,
            animation: {
                type: 'fadeIn',
                duration: 1000,
                delay: 0,
                easing: 'ease-in-out',
                loop: false
            }
        };
        switch (type) {
            case 'text':
                newElement.props = {
                    text: 'New Text',
                    size: 24,
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
                    strokeWidth: 2
                };
                break;
            case 'image':
                newElement.props = {
                    src: '',
                    width: 200,
                    height: 150
                };
                break;
        }
        setElements([...elements, newElement]);
        setSelectedElement(newElement);
        showNotification('success', `${type} element added`);
    };
    // Show notification
    const showNotification = (type, message) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 3000);
    };
    // Convert initialCommands to elements when they change
    (0, react_1.useEffect)(() => {
        if (initialCommands && initialCommands.length > 0) {
            const convertedElements = initialCommands.map((cmd, index) => {
                const element = {
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
                            bold: false,
                            italic: false
                        };
                        break;
                    case 'rect':
                        element.props = {
                            width: cmd.width || 200,
                            height: cmd.height || 100,
                            color: cmd.color || '#3b82f6',
                            filled: cmd.filled !== false,
                            borderRadius: 0
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
                            strokeWidth: 2
                        };
                        break;
                }
                return element;
            });
            setElements(convertedElements);
        }
    }, [initialCommands]);
    // Preload images when elements change
    (0, react_1.useEffect)(() => {
        elements.forEach(element => {
            if (element.type === 'image' && element.props.src && !loadedImages[element.id]) {
                const img = new Image();
                img.onload = () => {
                    setLoadedImages(prev => ({
                        ...prev,
                        [element.id]: img
                    }));
                };
                img.src = element.props.src;
            }
        });
    }, [elements, loadedImages]);
    // Render canvas
    const renderCanvas = (0, react_1.useCallback)(() => {
        const canvas = canvasRef.current;
        if (!canvas)
            return;
        const ctx = canvas.getContext('2d');
        if (!ctx)
            return;
        // Clear canvas
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        // Draw background
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
                    ctx.strokeStyle = element.props.color;
                    ctx.fillStyle = element.props.color;
                    ctx.lineWidth = 2;
                    if (element.props.borderRadius > 0) {
                        // Rounded rectangle
                        const x = element.x - element.props.width / 2;
                        const y = element.y - element.props.height / 2;
                        const w = element.props.width;
                        const h = element.props.height;
                        const r = element.props.borderRadius;
                        ctx.beginPath();
                        ctx.moveTo(x + r, y);
                        ctx.lineTo(x + w - r, y);
                        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
                        ctx.lineTo(x + w, y + h - r);
                        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
                        ctx.lineTo(x + r, y + h);
                        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
                        ctx.lineTo(x, y + r);
                        ctx.quadraticCurveTo(x, y, x + r, y);
                        ctx.closePath();
                        if (element.props.filled) {
                            ctx.fill();
                        }
                        else {
                            ctx.stroke();
                        }
                    }
                    else {
                        if (element.props.filled) {
                            ctx.fillRect(element.x - element.props.width / 2, element.y - element.props.height / 2, element.props.width, element.props.height);
                        }
                        else {
                            ctx.strokeRect(element.x - element.props.width / 2, element.y - element.props.height / 2, element.props.width, element.props.height);
                        }
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
                    }
                    else {
                        ctx.stroke();
                    }
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
                    ctx.strokeStyle = element.props.color;
                    ctx.lineWidth = element.props.strokeWidth;
                    ctx.stroke();
                    // Draw arrowhead
                    const angle = Math.atan2(y2 - y1, x2 - x1);
                    const headLength = 15;
                    ctx.beginPath();
                    ctx.moveTo(x2, y2);
                    ctx.lineTo(x2 - headLength * Math.cos(angle - Math.PI / 6), y2 - headLength * Math.sin(angle - Math.PI / 6));
                    ctx.moveTo(x2, y2);
                    ctx.lineTo(x2 - headLength * Math.cos(angle + Math.PI / 6), y2 - headLength * Math.sin(angle + Math.PI / 6));
                    ctx.stroke();
                    break;
                case 'image':
                    if (element.props.src && loadedImages[element.id]) {
                        ctx.drawImage(loadedImages[element.id], element.x - element.props.width / 2, element.y - element.props.height / 2, element.props.width, element.props.height);
                    }
                    break;
            }
            // Draw selection box
            if (selectedElement?.id === element.id || selectedElements.find(el => el.id === element.id)) {
                ctx.strokeStyle = '#00ff00';
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
                const handles = [
                    { x: selectionBox.x, y: selectionBox.y }, // Top-left
                    { x: selectionBox.x + selectionBox.width / 2, y: selectionBox.y }, // Top-center
                    { x: selectionBox.x + selectionBox.width, y: selectionBox.y }, // Top-right
                    { x: selectionBox.x, y: selectionBox.y + selectionBox.height / 2 }, // Middle-left
                    { x: selectionBox.x + selectionBox.width, y: selectionBox.y + selectionBox.height / 2 }, // Middle-right
                    { x: selectionBox.x, y: selectionBox.y + selectionBox.height }, // Bottom-left
                    { x: selectionBox.x + selectionBox.width / 2, y: selectionBox.y + selectionBox.height }, // Bottom-center
                    { x: selectionBox.x + selectionBox.width, y: selectionBox.y + selectionBox.height } // Bottom-right
                ];
                ctx.fillStyle = '#00ff00';
                handles.forEach(handle => {
                    ctx.fillRect(handle.x - handleSize / 2, handle.y - handleSize / 2, handleSize, handleSize);
                });
            }
            ctx.restore();
        });
    }, [elements, selectedElement, selectedElements, showGrid, loadedImages]);
    // Update canvas when elements change
    (0, react_1.useEffect)(() => {
        renderCanvas();
    }, [renderCanvas]);
    // Handle fullscreen
    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setIsFullscreen(true);
        }
        else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };
    // Handle image upload
    const handleImageUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const imageUrl = event.target?.result;
                const newImageId = `image-${Date.now()}-${Math.random()}`;
                // Create and load the image
                const img = new Image();
                img.onload = () => {
                    // Store the loaded image
                    setLoadedImages(prev => ({
                        ...prev,
                        [newImageId]: img
                    }));
                };
                img.src = imageUrl;
                const newImage = {
                    id: newImageId,
                    type: 'image',
                    x: CANVAS_WIDTH / 2,
                    y: CANVAS_HEIGHT / 2,
                    props: {
                        src: imageUrl,
                        width: 300,
                        height: 200
                    }
                };
                setElements([...elements, newImage]);
                setSelectedElement(newImage);
                showNotification('success', 'Image added');
            };
            reader.readAsDataURL(file);
        }
    };
    return (<div className="h-screen bg-gray-950 text-white flex flex-col overflow-hidden">
      {/* Top Toolbar */}
      <div className="bg-gray-900 border-b border-gray-800 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Logo/Title */}
          <h1 className="text-xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            ProScene Builder
          </h1>

          {/* File Operations */}
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded text-sm">
              New
            </button>
            <button className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded text-sm">
              Open
            </button>
            <button onClick={() => onSave?.([])} className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded text-sm">
              Save
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Zoom Controls */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 font-bold border border-gray-700 px-2 py-1 rounded">16:9</span>
            <button onClick={() => handleZoom(-10)} className="px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded text-sm">
              -
            </button>
            <span className="text-sm w-16 text-center">{canvasZoom}%</span>
            <button onClick={() => handleZoom(10)} className="px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded text-sm">
              +
            </button>
            <button onClick={fitToScreen} className="px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm">
              Fit 16:9
            </button>
            <button onClick={resetZoom} className="px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded text-sm">
              100%
            </button>
          </div>

          {/* Layout Presets */}
          <div className="flex items-center gap-1">
            <button onClick={() => applyLayoutPreset('compact')} className={`px-2 py-1 rounded text-sm ${layoutPreset === 'compact' ? 'bg-blue-600' : 'bg-gray-800 hover:bg-gray-700'}`} title="Compact Layout">
              ⬚
            </button>
            <button onClick={() => applyLayoutPreset('default')} className={`px-2 py-1 rounded text-sm ${layoutPreset === 'default' ? 'bg-blue-600' : 'bg-gray-800 hover:bg-gray-700'}`} title="Default Layout">
              ⊞
            </button>
            <button onClick={() => applyLayoutPreset('wide')} className={`px-2 py-1 rounded text-sm ${layoutPreset === 'wide' ? 'bg-blue-600' : 'bg-gray-800 hover:bg-gray-700'}`} title="Wide Layout">
              ⬌
            </button>
            <button onClick={toggleFullscreen} className="px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded text-sm" title="Fullscreen">
              ⛶
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Tools & Elements */}
        <div className={`bg-gray-900 border-r border-gray-800 flex transition-all duration-300 ${leftPanelOpen ? '' : '-ml-64'}`} style={{ width: leftPanelOpen ? leftPanelWidth : 40 }}>
          {leftPanelOpen ? (<div className="flex-1 p-4 overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-green-400">Tools</h3>
                <button onClick={() => setLeftPanelOpen(false)} className="text-gray-400 hover:text-white">
                  ◀
                </button>
              </div>

              {/* Add Elements */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-400 mb-2">Add Element</h4>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => addElement('text')} className="px-3 py-2 bg-green-600 hover:bg-green-700 rounded text-sm font-medium">
                    Text
                  </button>
                  <button onClick={() => addElement('rect')} className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm font-medium">
                    Rectangle
                  </button>
                  <button onClick={() => addElement('circle')} className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded text-sm font-medium">
                    Circle
                  </button>
                  <button onClick={() => addElement('arrow')} className="px-3 py-2 bg-yellow-600 hover:bg-yellow-700 rounded text-sm font-medium">
                    Arrow
                  </button>
                  <label className="px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded text-sm font-medium cursor-pointer text-center col-span-2">
                    Upload Image
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden"/>
                  </label>
                </div>
              </div>

              {/* Elements List */}
              <div>
                <h4 className="text-sm font-semibold text-gray-400 mb-2">Elements ({elements.length})</h4>
                <div className="space-y-1 max-h-96 overflow-y-auto">
                  {elements.map((element, index) => (<div key={element.id} onClick={() => setSelectedElement(element)} className={`p-2 rounded cursor-pointer text-sm flex justify-between items-center ${selectedElement?.id === element.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>
                      <span className="flex items-center gap-2">
                        <span className="opacity-50">#{index + 1}</span>
                        <span className="capitalize">{element.type}</span>
                      </span>
                      <button onClick={(e) => {
                    e.stopPropagation();
                    setElements(elements.filter(el => el.id !== element.id));
                    if (selectedElement?.id === element.id) {
                        setSelectedElement(null);
                    }
                }} className="text-red-400 hover:text-red-300">
                        ×
                      </button>
                    </div>))}
                </div>
              </div>
            </div>) : (<button onClick={() => setLeftPanelOpen(true)} className="w-10 flex items-center justify-center hover:bg-gray-800">
              ▶
            </button>)}

          {/* Resize Handle */}
          {leftPanelOpen && (<div className="w-1 bg-gray-800 hover:bg-blue-500 cursor-col-resize" onMouseDown={(e) => {
                const startX = e.clientX;
                const startWidth = leftPanelWidth;
                const handleMouseMove = (e) => {
                    const newWidth = Math.max(200, Math.min(400, startWidth + e.clientX - startX));
                    setLeftPanelWidth(newWidth);
                };
                const handleMouseUp = () => {
                    document.removeEventListener('mousemove', handleMouseMove);
                    document.removeEventListener('mouseup', handleMouseUp);
                };
                document.addEventListener('mousemove', handleMouseMove);
                document.addEventListener('mouseup', handleMouseUp);
            }}/>)}
        </div>

        {/* Canvas Container */}
        <div ref={containerRef} className="flex-1 bg-gray-950 overflow-hidden relative" onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
          <div className="absolute" style={{
            transform: `scale(${canvasZoom / 100}) translate(${canvasOffset.x}px, ${canvasOffset.y}px)`,
            transformOrigin: 'top left',
            cursor: isPanning ? 'grabbing' : 'grab'
        }}>
            <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="border border-gray-800 shadow-2xl" style={{
            imageRendering: 'crisp-edges',
            maxWidth: '100%',
            height: 'auto',
            aspectRatio: '16 / 9',
            display: 'block'
        }}/>
          </div>

          {/* Canvas Status Bar */}
          <div className="absolute bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 px-4 py-1 flex items-center justify-between text-xs">
            <div className="flex items-center gap-4">
              <span>Canvas: {CANVAS_WIDTH}×{CANVAS_HEIGHT}</span>
              <span>Elements: {elements.length}</span>
              {selectedElement && <span>Selected: {selectedElement.type}</span>}
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={showGrid} onChange={(e) => setShowGrid(e.target.checked)} className="rounded"/>
                Grid
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={snapToGrid} onChange={(e) => setSnapToGrid(e.target.checked)} className="rounded"/>
                Snap
              </label>
            </div>
          </div>
        </div>

        {/* Right Panel - Properties & Layers */}
        <div className={`bg-gray-900 border-l border-gray-800 flex transition-all duration-300 ${rightPanelOpen ? '' : '-mr-64'}`} style={{ width: rightPanelOpen ? rightPanelWidth : 40 }}>
          {/* Resize Handle */}
          {rightPanelOpen && (<div className="w-1 bg-gray-800 hover:bg-blue-500 cursor-col-resize" onMouseDown={(e) => {
                const startX = e.clientX;
                const startWidth = rightPanelWidth;
                const handleMouseMove = (e) => {
                    const newWidth = Math.max(200, Math.min(400, startWidth - (e.clientX - startX)));
                    setRightPanelWidth(newWidth);
                };
                const handleMouseUp = () => {
                    document.removeEventListener('mousemove', handleMouseMove);
                    document.removeEventListener('mouseup', handleMouseUp);
                };
                document.addEventListener('mousemove', handleMouseMove);
                document.addEventListener('mouseup', handleMouseUp);
            }}/>)}

          {rightPanelOpen ? (<div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-gray-800">
                <div className="flex gap-2">
                  <button onClick={() => setActiveTab('properties')} className={`px-3 py-1 rounded text-sm ${activeTab === 'properties' ? 'bg-blue-600' : 'bg-gray-800 hover:bg-gray-700'}`}>
                    Properties
                  </button>
                  <button onClick={() => setActiveTab('layers')} className={`px-3 py-1 rounded text-sm ${activeTab === 'layers' ? 'bg-blue-600' : 'bg-gray-800 hover:bg-gray-700'}`}>
                    Layers
                  </button>
                </div>
                <button onClick={() => setRightPanelOpen(false)} className="text-gray-400 hover:text-white">
                  ▶
                </button>
              </div>

              {/* Tab Content */}
              <div className="flex-1 p-4 overflow-y-auto">
                {activeTab === 'properties' && selectedElement && (<div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-400">Type</label>
                      <div className="text-white font-semibold capitalize">{selectedElement.type}</div>
                    </div>

                    <div>
                      <label className="text-sm text-gray-400">Position</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input type="number" value={selectedElement.x} onChange={(e) => {
                    const updated = { ...selectedElement, x: Number(e.target.value) };
                    setElements(elements.map(el => el.id === selectedElement.id ? updated : el));
                    setSelectedElement(updated);
                }} className="px-2 py-1 bg-gray-800 text-white rounded" placeholder="X"/>
                        <input type="number" value={selectedElement.y} onChange={(e) => {
                    const updated = { ...selectedElement, y: Number(e.target.value) };
                    setElements(elements.map(el => el.id === selectedElement.id ? updated : el));
                    setSelectedElement(updated);
                }} className="px-2 py-1 bg-gray-800 text-white rounded" placeholder="Y"/>
                      </div>
                    </div>

                    {/* Type-specific properties */}
                    {selectedElement.type === 'text' && (<>
                        <div>
                          <label className="text-sm text-gray-400">Text</label>
                          <input type="text" value={selectedElement.props.text} onChange={(e) => {
                        const updated = {
                            ...selectedElement,
                            props: { ...selectedElement.props, text: e.target.value }
                        };
                        setElements(elements.map(el => el.id === selectedElement.id ? updated : el));
                        setSelectedElement(updated);
                    }} className="w-full px-2 py-1 bg-gray-800 text-white rounded"/>
                        </div>

                        <div>
                          <label className="text-sm text-gray-400">Font Size</label>
                          <input type="range" min="10" max="100" value={selectedElement.props.size} onChange={(e) => {
                        const updated = {
                            ...selectedElement,
                            props: { ...selectedElement.props, size: Number(e.target.value) }
                        };
                        setElements(elements.map(el => el.id === selectedElement.id ? updated : el));
                        setSelectedElement(updated);
                    }} className="w-full"/>
                          <div className="text-center text-sm text-gray-400">{selectedElement.props.size}px</div>
                        </div>

                        <div className="flex gap-2">
                          <button onClick={() => {
                        const updated = {
                            ...selectedElement,
                            props: { ...selectedElement.props, bold: !selectedElement.props.bold }
                        };
                        setElements(elements.map(el => el.id === selectedElement.id ? updated : el));
                        setSelectedElement(updated);
                    }} className={`px-3 py-1 rounded text-sm ${selectedElement.props.bold ? 'bg-blue-600' : 'bg-gray-800 hover:bg-gray-700'}`}>
                            Bold
                          </button>
                          <button onClick={() => {
                        const updated = {
                            ...selectedElement,
                            props: { ...selectedElement.props, italic: !selectedElement.props.italic }
                        };
                        setElements(elements.map(el => el.id === selectedElement.id ? updated : el));
                        setSelectedElement(updated);
                    }} className={`px-3 py-1 rounded text-sm ${selectedElement.props.italic ? 'bg-blue-600' : 'bg-gray-800 hover:bg-gray-700'}`}>
                            Italic
                          </button>
                        </div>
                      </>)}

                    {/* Color picker for all elements */}
                    {selectedElement.props.color && (<div>
                        <label className="text-sm text-gray-400">Color</label>
                        <input type="color" value={selectedElement.props.color} onChange={(e) => {
                        const updated = {
                            ...selectedElement,
                            props: { ...selectedElement.props, color: e.target.value }
                        };
                        setElements(elements.map(el => el.id === selectedElement.id ? updated : el));
                        setSelectedElement(updated);
                    }} className="w-full h-10 bg-gray-800 rounded cursor-pointer"/>
                      </div>)}
                  </div>)}

                {activeTab === 'layers' && (<div className="space-y-2">
                    {[...elements].reverse().map((element, reverseIndex) => {
                    const index = elements.length - 1 - reverseIndex;
                    return (<div key={element.id} className="flex items-center gap-2 p-2 bg-gray-800 rounded">
                          <button className="text-gray-400 hover:text-white">👁</button>
                          <button className="text-gray-400 hover:text-white">🔒</button>
                          <span className="flex-1 text-sm">
                            {element.type} #{index + 1}
                          </span>
                          <button className="text-gray-400 hover:text-white">↑</button>
                          <button className="text-gray-400 hover:text-white">↓</button>
                        </div>);
                })}
                  </div>)}
              </div>
            </div>) : (<button onClick={() => setRightPanelOpen(true)} className="w-10 flex items-center justify-center hover:bg-gray-800">
              ◀
            </button>)}
        </div>
      </div>

      {/* Notification */}
      {notification && (<div className={`fixed bottom-4 right-4 px-4 py-2 rounded-lg shadow-lg z-50 ${notification.type === 'success' ? 'bg-green-600' :
                notification.type === 'error' ? 'bg-red-600' : 'bg-blue-600'} text-white`}>
          {notification.message}
        </div>)}
    </div>);
}
