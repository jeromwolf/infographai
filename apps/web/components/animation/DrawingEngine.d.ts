import React from 'react';
export type DrawCommand = {
    type: 'line';
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    color?: string;
    width?: number;
} | {
    type: 'rect';
    x: number;
    y: number;
    width: number;
    height: number;
    color?: string;
    filled?: boolean;
} | {
    type: 'circle';
    x: number;
    y: number;
    radius: number;
    color?: string;
    filled?: boolean;
} | {
    type: 'text';
    text: string;
    x: number;
    y: number;
    size?: number;
    color?: string;
} | {
    type: 'arrow';
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    color?: string;
} | {
    type: 'path';
    points: Array<{
        x: number;
        y: number;
    }>;
    color?: string;
    closed?: boolean;
} | {
    type: 'clear';
} | {
    type: 'wait';
    duration: number;
} | {
    type: 'parallel';
    commands: DrawCommand[];
} | {
    type: 'highlight';
    x: number;
    y: number;
    width: number;
    height: number;
    color?: string;
};
interface DrawingEngineProps {
    commands: DrawCommand[];
    width?: number;
    height?: number;
    speed?: number;
    autoPlay?: boolean;
    loop?: boolean;
    onComplete?: () => void;
}
export default function DrawingEngine({ commands, width, height, speed, autoPlay, loop, onComplete }: DrawingEngineProps): React.JSX.Element;
export {};
//# sourceMappingURL=DrawingEngine.d.ts.map