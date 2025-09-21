"use client";

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

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

export default function RadialNetwork({
  centerLabel,
  nodes,
  width = 1200,
  height = 800,
  innerRadius = 100,
  outerRadius = 350
}: RadialNetworkProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [animationProgress, setAnimationProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationProgress(1);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Background gradient
    const defs = svg.append('defs');

    // Radial gradient for background
    const bgGradient = defs.append('radialGradient')
      .attr('id', 'bgRadialGradient')
      .attr('cx', '50%')
      .attr('cy', '50%')
      .attr('r', '50%');

    bgGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#1a1a1a');

    bgGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#000000');

    // Background
    svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'url(#bgRadialGradient)');

    const g = svg.append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    // Calculate positions for nodes
    const angleStep = (2 * Math.PI) / nodes.length;
    const nodesWithPositions = nodes.map((node, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const radius = innerRadius + (outerRadius - innerRadius) * (node.value / 100);
      return {
        ...node,
        angle,
        radius,
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius
      };
    });

    // Draw radial grid
    const gridGroup = g.append('g').attr('class', 'grid');

    // Concentric circles
    const circles = [0.25, 0.5, 0.75, 1];
    circles.forEach(factor => {
      gridGroup.append('circle')
        .attr('r', innerRadius + (outerRadius - innerRadius) * factor)
        .attr('fill', 'none')
        .attr('stroke', '#333')
        .attr('stroke-width', 0.5)
        .attr('stroke-dasharray', '2,2')
        .style('opacity', 0.3);
    });

    // Radial lines
    nodesWithPositions.forEach((node, i) => {
      if (i % 3 === 0) { // Draw every 3rd line to avoid clutter
        gridGroup.append('line')
          .attr('x1', Math.cos(node.angle) * innerRadius)
          .attr('y1', Math.sin(node.angle) * innerRadius)
          .attr('x2', Math.cos(node.angle) * outerRadius)
          .attr('y2', Math.sin(node.angle) * outerRadius)
          .attr('stroke', '#333')
          .attr('stroke-width', 0.5)
          .style('opacity', 0.3);
      }
    });

    // Draw connections from center to nodes
    const connections = g.append('g').attr('class', 'connections');

    nodesWithPositions.forEach(node => {
      const connection = connections.append('g');

      // Main connection line
      connection.append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', node.x * animationProgress)
        .attr('y2', node.y * animationProgress)
        .attr('stroke', node.highlighted ? '#ff4444' : '#666')
        .attr('stroke-width', node.highlighted ? 2 : 1)
        .attr('stroke-opacity', hoveredNode === node.id ? 1 : 0.6)
        .transition()
        .duration(1000)
        .attr('x2', node.x)
        .attr('y2', node.y);

      // Add glow effect for highlighted connections
      if (node.highlighted) {
        connection.append('line')
          .attr('x1', 0)
          .attr('y1', 0)
          .attr('x2', node.x)
          .attr('y2', node.y)
          .attr('stroke', '#ff4444')
          .attr('stroke-width', 4)
          .attr('stroke-opacity', 0.3)
          .style('filter', 'blur(4px)');
      }
    });

    // Draw nodes
    const nodeGroups = g.append('g').attr('class', 'nodes');

    nodesWithPositions.forEach(node => {
      const nodeGroup = nodeGroups.append('g')
        .attr('transform', `translate(${node.x}, ${node.y})`)
        .style('cursor', 'pointer')
        .on('mouseenter', () => setHoveredNode(node.id))
        .on('mouseleave', () => setHoveredNode(null));

      // Node circle with animation
      const circle = nodeGroup.append('circle')
        .attr('r', 0)
        .attr('fill', node.highlighted ? '#ff4444' : '#4a90e2')
        .attr('stroke', 'white')
        .attr('stroke-width', 2)
        .style('filter', hoveredNode === node.id ? 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.8))' : 'none')
        .transition()
        .duration(800)
        .delay(node.highlighted ? 0 : Math.random() * 500)
        .attr('r', node.highlighted ? 8 : 6);

      // Add pulsing effect for highlighted nodes
      if (node.highlighted) {
        nodeGroup.append('circle')
          .attr('r', 8)
          .attr('fill', 'none')
          .attr('stroke', '#ff4444')
          .attr('stroke-width', 2)
          .append('animate')
          .attr('attributeName', 'r')
          .attr('from', '8')
          .attr('to', '16')
          .attr('dur', '1.5s')
          .attr('repeatCount', 'indefinite');

        nodeGroup.append('circle')
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
      }

      // Node label
      const labelAngle = (node.angle + Math.PI / 2) * 180 / Math.PI;
      const flipText = labelAngle > 90 && labelAngle < 270;

      nodeGroup.append('text')
        .attr('dy', '0.35em')
        .attr('x', flipText ? -12 : 12)
        .attr('text-anchor', flipText ? 'end' : 'start')
        .attr('transform', flipText ? 'rotate(180)' : '')
        .attr('fill', 'white')
        .attr('font-size', '11px')
        .attr('font-weight', node.highlighted ? 'bold' : 'normal')
        .style('opacity', 0)
        .text(node.label)
        .transition()
        .duration(800)
        .delay(800)
        .style('opacity', 1);

      // Value label (for highlighted nodes)
      if (node.highlighted && node.value) {
        nodeGroup.append('text')
          .attr('dy', '1.5em')
          .attr('x', flipText ? -12 : 12)
          .attr('text-anchor', flipText ? 'end' : 'start')
          .attr('transform', flipText ? 'rotate(180)' : '')
          .attr('fill', '#ff6666')
          .attr('font-size', '9px')
          .text(`${node.value}%`)
          .style('opacity', 0)
          .transition()
          .duration(800)
          .delay(1000)
          .style('opacity', 0.8);
      }
    });

    // Center node
    const centerGroup = g.append('g');

    // Center circle with gradient
    const centerGradient = defs.append('radialGradient')
      .attr('id', 'centerGradient');

    centerGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#ffffff');

    centerGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#e0e0e0');

    centerGroup.append('circle')
      .attr('r', 0)
      .attr('fill', 'url(#centerGradient)')
      .attr('stroke', '#4a90e2')
      .attr('stroke-width', 3)
      .transition()
      .duration(600)
      .attr('r', 60);

    // Center text
    centerGroup.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('fill', '#333')
      .attr('font-size', '16px')
      .attr('font-weight', 'bold')
      .text(centerLabel)
      .style('opacity', 0)
      .transition()
      .duration(600)
      .delay(400)
      .style('opacity', 1);

    // Add decorative elements
    const decorGroup = g.append('g').attr('class', 'decorations');

    // Rotating outer ring
    const outerRing = decorGroup.append('g');

    outerRing.append('circle')
      .attr('r', outerRadius + 20)
      .attr('fill', 'none')
      .attr('stroke', '#333')
      .attr('stroke-width', 0.5)
      .attr('stroke-dasharray', '5,10')
      .style('opacity', 0.3);

    // Animate rotation
    outerRing.append('animateTransform')
      .attr('attributeName', 'transform')
      .attr('type', 'rotate')
      .attr('from', '0 0 0')
      .attr('to', '360 0 0')
      .attr('dur', '120s')
      .attr('repeatCount', 'indefinite');

  }, [centerLabel, nodes, width, height, innerRadius, outerRadius, hoveredNode, animationProgress]);

  return (
    <div className="relative">
      <svg ref={svgRef} width={width} height={height} className="rounded-lg" />

      {/* Info panel */}
      <div className="absolute top-4 left-4 bg-black bg-opacity-80 text-white p-4 rounded-lg">
        <h3 className="text-sm font-bold mb-2 uppercase tracking-wide">GOVT CONTRACTS</h3>
        <div className="text-xs space-y-1 text-gray-300">
          <p>Total Nodes: {nodes.length}</p>
          <p>Active Contracts: {nodes.filter(n => n.highlighted).length}</p>
        </div>
      </div>

      {/* Hovered node details */}
      {hoveredNode && (
        <div className="absolute bottom-4 right-4 bg-black bg-opacity-90 text-white p-3 rounded-lg">
          <p className="text-sm font-semibold">
            {nodes.find(n => n.id === hoveredNode)?.label}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Value: {nodes.find(n => n.id === hoveredNode)?.value}%
          </p>
        </div>
      )}
    </div>
  );
}