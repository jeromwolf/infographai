import React from 'react';
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
interface ModernSceneBuilderProps {
    initialCommands?: any[];
    onSave?: (elements: CanvasElement[]) => void;
}
export default function ModernSceneBuilder({ initialCommands, onSave }: ModernSceneBuilderProps): React.JSX.Element;
export {};
//# sourceMappingURL=ModernSceneBuilder.d.ts.map