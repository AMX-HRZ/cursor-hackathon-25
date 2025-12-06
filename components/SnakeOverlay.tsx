"use client";

import React, { useEffect, useState } from "react";

interface Coordinate {
  x: number;
  y: number;
}

interface SnakeOverlayProps {
  coordinates: Coordinate[];
  width?: number;
  height?: number;
  animated?: boolean;
  stitchColor?: string;
}

export default function SnakeOverlay({
  coordinates,
  width = 640,
  height = 480,
  animated = true,
  stitchColor = "#00ff00",
}: SnakeOverlayProps) {
  const [visibleSegments, setVisibleSegments] = useState(0);
  const [showGlow, setShowGlow] = useState(false);

  useEffect(() => {
    if (!animated) {
      setVisibleSegments(coordinates.length);
      setShowGlow(true);
      return;
    }

    // Animate the snake stitching pattern
    let currentSegment = 0;
    const interval = setInterval(() => {
      currentSegment++;
      setVisibleSegments(currentSegment);
      
      if (currentSegment >= coordinates.length) {
        clearInterval(interval);
        setShowGlow(true);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [coordinates.length, animated]);

  // Generate snake-like path with stitch marks
  const generateSnakePath = (coords: Coordinate[], segments: number) => {
    if (coords.length < 2) return "";
    
    const visibleCoords = coords.slice(0, segments);
    let path = `M ${visibleCoords[0].x} ${visibleCoords[0].y}`;
    
    for (let i = 1; i < visibleCoords.length; i++) {
      const prev = visibleCoords[i - 1];
      const curr = visibleCoords[i];
      
      // Create a snake-like curved path
      const midX = (prev.x + curr.x) / 2;
      const midY = (prev.y + curr.y) / 2;
      
      // Add some waviness
      const waveOffset = (i % 2 === 0 ? 1 : -1) * 8;
      const perpX = -(curr.y - prev.y);
      const perpY = curr.x - prev.x;
      const len = Math.sqrt(perpX * perpX + perpY * perpY);
      
      if (len > 0) {
        const controlX = midX + (perpX / len) * waveOffset;
        const controlY = midY + (perpY / len) * waveOffset;
        path += ` Q ${controlX} ${controlY} ${curr.x} ${curr.y}`;
      } else {
        path += ` L ${curr.x} ${curr.y}`;
      }
    }
    
    return path;
  };

  // Generate stitch marks perpendicular to the path
  const generateStitchMarks = (coords: Coordinate[], segments: number) => {
    const marks: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];
    const visibleCoords = coords.slice(0, segments);
    
    for (let i = 0; i < visibleCoords.length - 1; i++) {
      const curr = visibleCoords[i];
      const next = visibleCoords[i + 1];
      
      // Direction vector
      const dx = next.x - curr.x;
      const dy = next.y - curr.y;
      const len = Math.sqrt(dx * dx + dy * dy);
      
      if (len > 0) {
        // Perpendicular vector
        const perpX = -dy / len;
        const perpY = dx / len;
        
        // Stitch mark length
        const stitchLen = 12;
        
        // Position stitch at midpoint
        const midX = (curr.x + next.x) / 2;
        const midY = (curr.y + next.y) / 2;
        
        marks.push({
          x1: midX - perpX * stitchLen,
          y1: midY - perpY * stitchLen,
          x2: midX + perpX * stitchLen,
          y2: midY + perpY * stitchLen,
        });
      }
    }
    
    return marks;
  };

  const snakePath = generateSnakePath(coordinates, visibleSegments);
  const stitchMarks = generateStitchMarks(coordinates, visibleSegments);

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="absolute inset-0 pointer-events-none"
      style={{ overflow: "visible" }}
    >
      <defs>
        {/* Glow filter */}
        <filter id="snakeGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        
        {/* Dash pattern for stitch effect */}
        <pattern
          id="stitchPattern"
          patternUnits="userSpaceOnUse"
          width="12"
          height="12"
        >
          <circle cx="6" cy="6" r="2" fill={stitchColor} />
        </pattern>
      </defs>

      {/* Main snake path - outer glow */}
      {showGlow && (
        <path
          d={snakePath}
          fill="none"
          stroke={stitchColor}
          strokeWidth="8"
          opacity="0.3"
          filter="url(#snakeGlow)"
        />
      )}

      {/* Main snake path - core line */}
      <path
        d={snakePath}
        fill="none"
        stroke={stitchColor}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={animated ? "transition-all duration-100" : ""}
      />

      {/* Inner highlight */}
      <path
        d={snakePath}
        fill="none"
        stroke="#ffffff"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.5"
      />

      {/* Stitch marks */}
      {stitchMarks.map((mark, index) => (
        <g key={index}>
          {/* Stitch line */}
          <line
            x1={mark.x1}
            y1={mark.y1}
            x2={mark.x2}
            y2={mark.y2}
            stroke={stitchColor}
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Stitch holes */}
          <circle cx={mark.x1} cy={mark.y1} r="2" fill="#0a0a0a" stroke={stitchColor} strokeWidth="1" />
          <circle cx={mark.x2} cy={mark.y2} r="2" fill="#0a0a0a" stroke={stitchColor} strokeWidth="1" />
        </g>
      ))}

      {/* Start point marker */}
      {coordinates.length > 0 && visibleSegments > 0 && (
        <g>
          <circle
            cx={coordinates[0].x}
            cy={coordinates[0].y}
            r="8"
            fill="#0a0a0a"
            stroke={stitchColor}
            strokeWidth="2"
          />
          <text
            x={coordinates[0].x}
            y={coordinates[0].y + 4}
            textAnchor="middle"
            fill={stitchColor}
            fontSize="10"
            fontFamily="monospace"
          >
            S
          </text>
        </g>
      )}

      {/* End point marker (snake head) */}
      {visibleSegments >= coordinates.length && coordinates.length > 1 && (
        <g>
          <circle
            cx={coordinates[coordinates.length - 1].x}
            cy={coordinates[coordinates.length - 1].y}
            r="10"
            fill={stitchColor}
            className={showGlow ? "animate-pulse" : ""}
          />
          <circle
            cx={coordinates[coordinates.length - 1].x - 3}
            cy={coordinates[coordinates.length - 1].y - 2}
            r="2"
            fill="#0a0a0a"
          />
          <circle
            cx={coordinates[coordinates.length - 1].x + 3}
            cy={coordinates[coordinates.length - 1].y - 2}
            r="2"
            fill="#0a0a0a"
          />
        </g>
      )}

      {/* Progress indicator */}
      {animated && visibleSegments < coordinates.length && (
        <text
          x={width / 2}
          y={height - 20}
          textAnchor="middle"
          fill={stitchColor}
          fontSize="14"
          fontFamily="monospace"
          className="animate-pulse"
        >
          STITCHING... {Math.round((visibleSegments / coordinates.length) * 100)}%
        </text>
      )}
    </svg>
  );
}

