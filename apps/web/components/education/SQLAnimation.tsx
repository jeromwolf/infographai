"use client";

import React, { useEffect, useRef, useState } from 'react';

interface SQLAnimationProps {
  width?: number;
  height?: number;
}

export default function SQLAnimation({
  width = 1200,
  height = 700
}: SQLAnimationProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [animationStep, setAnimationStep] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const handwritingFont = 'Kalam, Comic Sans MS, cursive';

  useEffect(() => {
    const timer = setTimeout(() => {
      if (animationStep < 8) {
        setAnimationStep(prev => prev + 1);
      } else {
        setShowResults(true);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [animationStep]);

  return (
    <div className="relative bg-black rounded-lg overflow-hidden" style={{ width, height }}>
      <svg ref={svgRef} width={width} height={height} className="absolute inset-0">
        {/* Database Icon */}
        <g className={`transition-opacity duration-500 ${animationStep >= 0 ? 'opacity-100' : 'opacity-0'}`}>
          {/* Cylinder layers */}
          {[0, 1, 2].map(i => (
            <g key={i}>
              <ellipse
                cx="150"
                cy={200 + i * 40}
                rx="80"
                ry="20"
                fill="#3b82f6"
                stroke="#3b82f6"
                strokeWidth="2"
              />
              {i < 2 && (
                <>
                  <line
                    x1="70"
                    y1={200 + i * 40}
                    x2="70"
                    y2={240 + i * 40}
                    stroke="#3b82f6"
                    strokeWidth="2"
                  />
                  <line
                    x1="230"
                    y1={200 + i * 40}
                    x2="230"
                    y2={240 + i * 40}
                    stroke="#3b82f6"
                    strokeWidth="2"
                  />
                </>
              )}
            </g>
          ))}
          <text
            x="150"
            y="350"
            fill="white"
            fontSize="28"
            fontFamily={handwritingFont}
            textAnchor="middle"
          >
            SQL Database
          </text>
        </g>

        {/* Arrow pointing to table */}
        <g className={`transition-opacity duration-500 ${animationStep >= 1 ? 'opacity-100' : 'opacity-0'}`}>
          <path
            d="M 230 200 Q 300 150 400 150"
            stroke="#4ade80"
            strokeWidth="3"
            fill="none"
            markerEnd="url(#arrowhead)"
          />
          <text
            x="280"
            y="130"
            fill="#4ade80"
            fontSize="24"
            fontFamily={handwritingFont}
            transform="rotate(-15 280 130)"
          >
            Structured database
          </text>
        </g>

        {/* Table structure */}
        <g className={`transition-opacity duration-500 ${animationStep >= 2 ? 'opacity-100' : 'opacity-0'}`}>
          <rect x="400" y="120" width="400" height="240" fill="none" stroke="white" strokeWidth="2" />

          {/* Table header */}
          <line x1="400" y1="160" x2="800" y2="160" stroke="white" strokeWidth="2" />
          <line x1="480" y1="120" x2="480" y2="360" stroke="white" strokeWidth="2" />
          <line x1="580" y1="120" x2="580" y2="360" stroke="white" strokeWidth="2" />

          <text x="440" y="145" fill="white" fontSize="22" fontFamily={handwritingFont} textAnchor="middle">id</text>
          <text x="530" y="145" fill="white" fontSize="22" fontFamily={handwritingFont} textAnchor="middle">title</text>
          <text x="690" y="145" fill="white" fontSize="22" fontFamily={handwritingFont} textAnchor="middle">content</text>

          <text x="480" y="145" fill="white" fontSize="24" fontFamily={handwritingFont} textAnchor="middle">documents</text>
        </g>

        {/* Table rows */}
        {animationStep >= 3 && (
          <g className="transition-opacity duration-500 opacity-100">
            <text x="440" y="190" fill="white" fontSize="18" fontFamily={handwritingFont} textAnchor="middle">1</text>
            <text x="530" y="190" fill="white" fontSize="18" fontFamily={handwritingFont} textAnchor="middle">----</text>

            {animationStep >= 4 && (
              <>
                <rect x="590" y="175" width="200" height="25" fill="none" stroke="#ef4444" strokeWidth="2" rx="5" />
                <text x="690" y="193" fill="#ef4444" fontSize="18" fontFamily={handwritingFont} textAnchor="middle">dress code</text>
              </>
            )}
          </g>
        )}

        {animationStep >= 5 && (
          <g className="transition-opacity duration-500 opacity-100">
            <text x="440" y="230" fill="white" fontSize="18" fontFamily={handwritingFont} textAnchor="middle">2</text>
            <text x="530" y="230" fill="white" fontSize="18" fontFamily={handwritingFont} textAnchor="middle">--</text>
            <text x="690" y="230" fill="white" fontSize="18" fontFamily={handwritingFont} textAnchor="middle">-- equipment --</text>
          </g>
        )}

        {animationStep >= 6 && (
          <g className="transition-opacity duration-500 opacity-100">
            <text x="440" y="270" fill="white" fontSize="18" fontFamily={handwritingFont} textAnchor="middle">3</text>
            <text x="530" y="270" fill="white" fontSize="18" fontFamily={handwritingFont} textAnchor="middle">---</text>
            <text x="690" y="270" fill="white" fontSize="18" fontFamily={handwritingFont} textAnchor="middle">----- time off ----</text>
          </g>
        )}

        {animationStep >= 7 && (
          <g className="transition-opacity duration-500 opacity-100">
            <text x="440" y="310" fill="white" fontSize="18" fontFamily={handwritingFont} textAnchor="middle">4</text>
            <text x="530" y="310" fill="white" fontSize="18" fontFamily={handwritingFont} textAnchor="middle">---</text>
            <rect x="590" y="295" width="200" height="25" fill="none" stroke="#ef4444" strokeWidth="2" rx="5" />
            <text x="690" y="313" fill="#ef4444" fontSize="18" fontFamily={handwritingFont} textAnchor="middle">-- holiday policy --</text>
          </g>
        )}

        {/* Similarity Search annotation */}
        {animationStep >= 4 && (
          <g className="transition-opacity duration-500 opacity-100">
            <path
              d="M 790 190 Q 850 190 850 240"
              stroke="#ef4444"
              strokeWidth="3"
              fill="none"
              markerEnd="url(#arrowhead-red)"
            />
            <text x="860" y="250" fill="#ef4444" fontSize="20" fontFamily={handwritingFont}>
              Similarity
            </text>
            <text x="860" y="275" fill="#ef4444" fontSize="20" fontFamily={handwritingFont}>
              Search
            </text>
          </g>
        )}

        {/* SQL Query */}
        {animationStep >= 8 && (
          <g className="transition-opacity duration-500 opacity-100">
            <text x="860" y="190" fill="#3b82f6" fontSize="22" fontFamily="monospace">
              SELECT * FROM documents
            </text>
            <text x="860" y="220" fill="#3b82f6" fontSize="22" fontFamily="monospace">
              WHERE content LIKE "%holiday%"
            </text>
            <text x="860" y="250" fill="#3b82f6" fontSize="22" fontFamily="monospace">
              OR "%time off%"
            </text>
          </g>
        )}

        {/* Results highlighting */}
        {showResults && (
          <g className="animate-pulse">
            <path
              d="M 580 305 L 800 305"
              stroke="#4ade80"
              strokeWidth="3"
              strokeDasharray="5,5"
            />
            <path
              d="M 800 305 Q 900 305 950 350"
              stroke="#4ade80"
              strokeWidth="3"
              fill="none"
              markerEnd="url(#arrowhead-green)"
            />

            <circle cx="1000" cy="380" r="40" fill="none" stroke="#4ade80" strokeWidth="3" />
            <text x="1000" y="388" fill="#4ade80" fontSize="18" fontFamily={handwritingFont} textAnchor="middle">
              "%holiday%"
            </text>

            <path
              d="M 580 270 Q 520 350 560 420 Q 620 450 720 450 Q 820 450 900 420"
              stroke="#4ade80"
              strokeWidth="3"
              fill="none"
              markerEnd="url(#arrowhead-green)"
              strokeDasharray="5,5"
            />

            <circle cx="950" cy="420" r="40" fill="none" stroke="#4ade80" strokeWidth="3" />
            <text x="950" y="428" fill="#4ade80" fontSize="18" fontFamily={handwritingFont} textAnchor="middle">
              "%time off%"
            </text>
          </g>
        )}

        {/* Arrow markers */}
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <polygon points="0 0, 10 3, 0 6" fill="#4ade80" />
          </marker>
          <marker id="arrowhead-red" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <polygon points="0 0, 10 3, 0 6" fill="#ef4444" />
          </marker>
          <marker id="arrowhead-green" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <polygon points="0 0, 10 3, 0 6" fill="#4ade80" />
          </marker>
        </defs>
      </svg>

      {/* Control buttons */}
      <div className="absolute bottom-4 left-4 flex gap-2">
        <button
          onClick={() => {
            setAnimationStep(0);
            setShowResults(false);
          }}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-bold"
        >
          Restart
        </button>
        <button
          onClick={() => setAnimationStep(8)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-bold"
        >
          Skip to End
        </button>
      </div>
    </div>
  );
}