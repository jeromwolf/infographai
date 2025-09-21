"use client";
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = NetworkGraph;
const react_1 = __importStar(require("react"));
const d3 = __importStar(require("d3"));
function NetworkGraph({ nodes, links, width = 1200, height = 800 }) {
    const svgRef = (0, react_1.useRef)(null);
    const [hoveredNode, setHoveredNode] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        if (!svgRef.current)
            return;
        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();
        // Create gradient background
        const defs = svg.append('defs');
        const gradient = defs.append('radialGradient')
            .attr('id', 'backgroundGradient');
        gradient.append('stop')
            .attr('offset', '0%')
            .attr('stop-color', '#1a1a2e');
        gradient.append('stop')
            .attr('offset', '100%')
            .attr('stop-color', '#0f0f23');
        // Background
        svg.append('rect')
            .attr('width', width)
            .attr('height', height)
            .attr('fill', 'url(#backgroundGradient)');
        // Create container for zoom
        const g = svg.append('g');
        // Create zoom behavior
        const zoom = d3.zoom()
            .scaleExtent([0.5, 3])
            .on('zoom', (event) => {
            g.attr('transform', event.transform.toString());
        });
        svg.call(zoom);
        // Create force simulation
        const simulation = d3.forceSimulation(nodes)
            .force('link', d3.forceLink(links)
            .id((d) => d.id)
            .distance(150))
            .force('charge', d3.forceManyBody().strength(-500))
            .force('center', d3.forceCenter(width / 2, height / 2))
            .force('collision', d3.forceCollide().radius(50));
        // Create links
        const link = g.append('g')
            .selectAll('line')
            .data(links)
            .enter()
            .append('line')
            .attr('stroke', '#4a5568')
            .attr('stroke-opacity', 0.6)
            .attr('stroke-width', 1.5);
        // Create link labels
        const linkLabel = g.append('g')
            .selectAll('text')
            .data(links.filter(l => l.label))
            .enter()
            .append('text')
            .attr('font-size', 10)
            .attr('fill', '#9ca3af')
            .text(d => d.label || '');
        // Create node groups
        const nodeGroup = g.append('g')
            .selectAll('g')
            .data(nodes)
            .enter()
            .append('g')
            .call(d3.drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended))
            .on('mouseenter', (event, d) => setHoveredNode(d.id))
            .on('mouseleave', () => setHoveredNode(null));
        // Add circles for nodes
        nodeGroup.each(function (d) {
            const group = d3.select(this);
            if (d.type === 'center') {
                // Center node - white circle
                group.append('circle')
                    .attr('r', 80)
                    .attr('fill', 'white')
                    .attr('stroke', '#6366f1')
                    .attr('stroke-width', 3);
                group.append('text')
                    .attr('text-anchor', 'middle')
                    .attr('dy', 5)
                    .attr('font-size', 20)
                    .attr('font-weight', 'bold')
                    .attr('fill', 'black')
                    .text(d.label);
            }
            else if (d.type === 'primary') {
                // Primary nodes - blue circles
                group.append('circle')
                    .attr('r', 50)
                    .attr('fill', '#4338ca')
                    .attr('stroke', '#6366f1')
                    .attr('stroke-width', 2);
                group.append('text')
                    .attr('text-anchor', 'middle')
                    .attr('dy', 5)
                    .attr('font-size', 14)
                    .attr('fill', 'white')
                    .text(d.label);
            }
            else if (d.type === 'secondary') {
                // Secondary nodes - purple circles
                group.append('circle')
                    .attr('r', 35)
                    .attr('fill', '#7c3aed')
                    .attr('stroke', '#a78bfa')
                    .attr('stroke-width', 2);
                group.append('text')
                    .attr('text-anchor', 'middle')
                    .attr('dy', 5)
                    .attr('font-size', 12)
                    .attr('fill', 'white')
                    .text(d.label);
            }
            else if (d.type === 'person' && d.imageUrl) {
                // Person nodes with images
                const pattern = defs.append('pattern')
                    .attr('id', `image-${d.id}`)
                    .attr('x', 0)
                    .attr('y', 0)
                    .attr('width', 1)
                    .attr('height', 1);
                pattern.append('image')
                    .attr('x', 0)
                    .attr('y', 0)
                    .attr('width', 80)
                    .attr('height', 80)
                    .attr('href', d.imageUrl);
                group.append('circle')
                    .attr('r', 40)
                    .attr('fill', `url(#image-${d.id})`)
                    .attr('stroke', '#6366f1')
                    .attr('stroke-width', 2);
                group.append('text')
                    .attr('text-anchor', 'middle')
                    .attr('dy', 55)
                    .attr('font-size', 11)
                    .attr('fill', '#e2e8f0')
                    .text(d.label);
            }
        });
        // Add glow effect on hover
        nodeGroup
            .style('filter', d => hoveredNode === d.id ? 'drop-shadow(0 0 20px rgba(99, 102, 241, 0.8))' : 'none')
            .style('cursor', 'pointer');
        // Update positions on tick
        simulation.on('tick', () => {
            link
                .attr('x1', (d) => d.source.x)
                .attr('y1', (d) => d.source.y)
                .attr('x2', (d) => d.target.x)
                .attr('y2', (d) => d.target.y);
            linkLabel
                .attr('x', (d) => (d.source.x + d.target.x) / 2)
                .attr('y', (d) => (d.source.y + d.target.y) / 2);
            nodeGroup
                .attr('transform', (d) => `translate(${d.x},${d.y})`);
        });
        function dragstarted(event, d) {
            if (!event.active)
                simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }
        function dragged(event, d) {
            d.fx = event.x;
            d.fy = event.y;
        }
        function dragended(event, d) {
            if (!event.active)
                simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }
        return () => {
            simulation.stop();
        };
    }, [nodes, links, width, height, hoveredNode]);
    return (<div className="relative">
      <svg ref={svgRef} width={width} height={height} className="rounded-lg shadow-2xl"/>
      {hoveredNode && (<div className="absolute top-4 right-4 bg-gray-900 text-white p-3 rounded-lg shadow-lg">
          <p className="text-sm font-semibold">Node: {hoveredNode}</p>
        </div>)}
    </div>);
}
