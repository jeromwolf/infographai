import React from 'react';
interface Scene {
    id: string;
    type: string;
    duration: number;
    title: string;
    narration: string;
    style: {
        backgroundColor: string;
        textColor: string;
        accentColor: string;
        animation: string;
        infographic: string;
    };
}
interface AutoVideoCompositionProps {
    title: string;
    scenes: Scene[];
    style?: {
        colorPalette?: string[];
        fontFamily?: string;
    };
}
export declare const AutoVideoComposition: React.FC<AutoVideoCompositionProps>;
export declare const AutoVideoCompositionMetadata: {
    id: string;
    component: React.FC<AutoVideoCompositionProps>;
    width: number;
    height: number;
    fps: number;
    durationInFrames: number;
    defaultProps: {
        title: string;
        scenes: any[];
    };
};
export {};
//# sourceMappingURL=AutoVideoComposition.d.ts.map