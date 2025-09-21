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
export interface PresetTemplate {
    name: string;
    category: string;
    commands: DrawCommand[];
    description?: string;
}
export declare const presetTemplates: PresetTemplate[];
export declare function getTemplatesByCategory(category: string): PresetTemplate[];
export declare function getCategories(): string[];
export declare function getTemplateByName(name: string): PresetTemplate | undefined;
export declare function searchTemplates(query: string): PresetTemplate[];
//# sourceMappingURL=preset-templates.d.ts.map