import React from 'react';
interface RadialNode {
    id: string;
    label: string;
    value: number;
    category?: string;
    highlighted?: boolean;
}
interface RadialNetworkProps {
    centerLabel: string;
    nodes: RadialNode[];
    width?: number;
    height?: number;
    innerRadius?: number;
    outerRadius?: number;
}
export default function RadialNetwork({ centerLabel, nodes, width, height, innerRadius, outerRadius }: RadialNetworkProps): React.JSX.Element;
export {};
//# sourceMappingURL=RadialNetwork.d.ts.map