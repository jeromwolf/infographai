import React from 'react';
interface MapPoint {
    id: string;
    name: string;
    coordinates: [number, number];
    type: 'base' | 'target' | 'route';
    activity?: string;
}
interface MapRoute {
    from: string;
    to: string;
    type: 'active' | 'projected';
}
interface GeoMapProps {
    points: MapPoint[];
    routes?: MapRoute[];
    width?: number;
    height?: number;
    center?: [number, number];
    scale?: number;
}
export default function GeoMap({ points, routes, width, height, center, // South China Sea center
scale }: GeoMapProps): React.JSX.Element;
export {};
//# sourceMappingURL=GeoMap.d.ts.map