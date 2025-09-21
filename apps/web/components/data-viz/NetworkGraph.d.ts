import React from 'react';
interface Node {
    id: string;
    label: string;
    type: 'center' | 'primary' | 'secondary' | 'person';
    x?: number;
    y?: number;
    fx?: number;
    fy?: number;
    imageUrl?: string;
}
interface Link {
    source: string;
    target: string;
    label?: string;
}
interface NetworkGraphProps {
    nodes: Node[];
    links: Link[];
    width?: number;
    height?: number;
}
export default function NetworkGraph({ nodes, links, width, height }: NetworkGraphProps): React.JSX.Element;
export {};
//# sourceMappingURL=NetworkGraph.d.ts.map