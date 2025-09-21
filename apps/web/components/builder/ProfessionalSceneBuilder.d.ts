import React from 'react';
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
export default function ProfessionalSceneBuilder({ initialCommands, onSave }: ProfessionalSceneBuilderProps): React.JSX.Element;
export {};
//# sourceMappingURL=ProfessionalSceneBuilder.d.ts.map