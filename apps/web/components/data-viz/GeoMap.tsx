"use client";

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { feature } from 'topojson-client';

interface MapPoint {
  id: string;
  name: string;
  coordinates: [number, number]; // [longitude, latitude]
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

export default function GeoMap({
  points,
  routes = [],
  width = 1200,
  height = 800,
  center = [117, 10], // South China Sea center
  scale = 1200
}: GeoMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [worldData, setWorldData] = useState<any>(null);
  const [selectedPoint, setSelectedPoint] = useState<MapPoint | null>(null);

  useEffect(() => {
    // Load world map data
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
      .then(response => response.json())
      .then(data => {
        setWorldData(feature(data, data.objects.countries));
      });
  }, []);

  useEffect(() => {
    if (!svgRef.current || !worldData) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Create projection
    const projection = d3.geoMercator()
      .center(center)
      .scale(scale)
      .translate([width / 2, height / 2]);

    const pathGenerator = d3.geoPath().projection(projection);

    // Background
    svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', '#0a0f1c');

    // Create main group
    const g = svg.append('g');

    // Add zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 8])
      .on('zoom', (event) => {
        g.attr('transform', event.transform.toString());
      });

    svg.call(zoom);

    // Draw countries
    g.append('g')
      .selectAll('path')
      .data(worldData.features)
      .enter()
      .append('path')
      .attr('d', pathGenerator as any)
      .attr('fill', '#1a3a52')
      .attr('stroke', '#2a5a7a')
      .attr('stroke-width', 0.5);

    // Draw ocean/water overlay with gradient
    const defs = svg.append('defs');
    const oceanGradient = defs.append('radialGradient')
      .attr('id', 'oceanGradient');

    oceanGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#001f3f')
      .attr('stop-opacity', 0.6);

    oceanGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#000814')
      .attr('stop-opacity', 0.8);

    // Add routes
    routes.forEach(route => {
      const fromPoint = points.find(p => p.id === route.from);
      const toPoint = points.find(p => p.id === route.to);

      if (fromPoint && toPoint) {
        const fromCoords = projection(fromPoint.coordinates);
        const toCoords = projection(toPoint.coordinates);

        if (fromCoords && toCoords) {
          // Route line
          const line = g.append('line')
            .attr('x1', fromCoords[0])
            .attr('y1', fromCoords[1])
            .attr('x2', toCoords[0])
            .attr('y2', toCoords[1])
            .attr('stroke', route.type === 'active' ? '#ff4444' : '#ffaa00')
            .attr('stroke-width', 2)
            .attr('stroke-opacity', 0.7)
            .attr('stroke-dasharray', route.type === 'projected' ? '5,5' : 'none');

          // Animate active routes
          if (route.type === 'active') {
            line.append('animate')
              .attr('attributeName', 'stroke-opacity')
              .attr('values', '0.3;1;0.3')
              .attr('dur', '2s')
              .attr('repeatCount', 'indefinite');
          }
        }
      }
    });

    // Add points
    points.forEach(point => {
      const coords = projection(point.coordinates);
      if (!coords) return;

      const pointGroup = g.append('g')
        .attr('transform', `translate(${coords[0]}, ${coords[1]})`)
        .style('cursor', 'pointer')
        .on('click', () => setSelectedPoint(point));

      if (point.type === 'base') {
        // Base/main points - larger circles
        pointGroup.append('circle')
          .attr('r', 8)
          .attr('fill', '#ff4444')
          .attr('stroke', '#ffffff')
          .attr('stroke-width', 2);

        // Pulsing effect
        pointGroup.append('circle')
          .attr('r', 8)
          .attr('fill', 'none')
          .attr('stroke', '#ff4444')
          .attr('stroke-width', 2)
          .append('animate')
          .attr('attributeName', 'r')
          .attr('from', '8')
          .attr('to', '20')
          .attr('dur', '1.5s')
          .attr('repeatCount', 'indefinite');

        pointGroup.append('circle')
          .attr('r', 8)
          .attr('fill', 'none')
          .attr('stroke', '#ff4444')
          .attr('stroke-width', 2)
          .attr('opacity', 0.5)
          .append('animate')
          .attr('attributeName', 'opacity')
          .attr('values', '0.5;0;0.5')
          .attr('dur', '1.5s')
          .attr('repeatCount', 'indefinite');
      } else {
        // Regular points
        pointGroup.append('circle')
          .attr('r', 5)
          .attr('fill', point.type === 'target' ? '#ffaa00' : '#4a90e2')
          .attr('stroke', '#ffffff')
          .attr('stroke-width', 1);
      }

      // Add labels
      pointGroup.append('text')
        .attr('x', 12)
        .attr('y', 4)
        .attr('fill', 'white')
        .attr('font-size', '12px')
        .attr('font-weight', 'bold')
        .text(point.name);

      if (point.activity) {
        pointGroup.append('text')
          .attr('x', 12)
          .attr('y', 18)
          .attr('fill', '#aaaaaa')
          .attr('font-size', '10px')
          .text(point.activity);
      }
    });

    // Add grid lines
    const gridLines = g.append('g')
      .attr('opacity', 0.1);

    // Latitude lines
    d3.range(-90, 91, 10).forEach(lat => {
      const path = d3.geoPath().projection(projection);
      const lineData: any = {
        type: 'LineString',
        coordinates: d3.range(-180, 181, 5).map(lon => [lon, lat])
      };

      gridLines.append('path')
        .datum(lineData)
        .attr('d', path)
        .attr('stroke', 'white')
        .attr('stroke-width', 0.5)
        .attr('fill', 'none');
    });

    // Longitude lines
    d3.range(-180, 181, 10).forEach(lon => {
      const path = d3.geoPath().projection(projection);
      const lineData: any = {
        type: 'LineString',
        coordinates: d3.range(-90, 91, 5).map(lat => [lon, lat])
      };

      gridLines.append('path')
        .datum(lineData)
        .attr('d', path)
        .attr('stroke', 'white')
        .attr('stroke-width', 0.5)
        .attr('fill', 'none');
    });

  }, [worldData, points, routes, width, height, center, scale]);

  return (
    <div className="relative bg-gray-900 rounded-lg overflow-hidden">
      <svg ref={svgRef} width={width} height={height} />

      {/* Info Panel */}
      <div className="absolute top-4 left-4 bg-black bg-opacity-80 text-white p-4 rounded-lg max-w-xs">
        <h3 className="text-lg font-bold mb-2">South China Sea Situation</h3>
        <div className="text-sm space-y-1">
          <p>Active monitoring: {points.filter(p => p.type === 'base').length} bases</p>
          <p>Tracked vessels: {points.filter(p => p.type === 'target').length}</p>
        </div>
      </div>

      {/* Selected Point Details */}
      {selectedPoint && (
        <div className="absolute bottom-4 left-4 bg-black bg-opacity-90 text-white p-4 rounded-lg">
          <h4 className="font-bold text-lg">{selectedPoint.name}</h4>
          {selectedPoint.activity && (
            <p className="text-sm text-gray-300 mt-1">Activity: {selectedPoint.activity}</p>
          )}
          <p className="text-xs text-gray-400 mt-2">
            Coordinates: {selectedPoint.coordinates[1].toFixed(2)}°N, {selectedPoint.coordinates[0].toFixed(2)}°E
          </p>
          <button
            onClick={() => setSelectedPoint(null)}
            className="mt-2 text-xs text-blue-400 hover:text-blue-300"
          >
            Close
          </button>
        </div>
      )}

      {/* Legend */}
      <div className="absolute top-4 right-4 bg-black bg-opacity-80 text-white p-3 rounded-lg">
        <h4 className="text-sm font-bold mb-2">Legend</h4>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-xs">Military Base</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-xs">Fishing Vessel</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-xs">Route Point</span>
          </div>
        </div>
      </div>
    </div>
  );
}