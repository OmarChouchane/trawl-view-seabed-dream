import { useEffect, useState, useRef } from 'react';

interface NetProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

const Net = ({ x1, y1, x2, y2 }: NetProps) => {
  // Net dimensions
  const width = 150;
  const height = 300;

  // Use ref to store the initial horizontal position
  const initialXRef = useRef<number | null>(null);
  
  // Calculate net position
  const averageX = (x1 + x2) / 2;
  
  // Set initial horizontal position only once
  if (initialXRef.current === null) {
    initialXRef.current = averageX - width/2;
  }
  
  const netX = initialXRef.current; // Always use the initial horizontal position
  const netY = Math.max(y1, y2) + 100; // Fixed distance below sensors

  // Attachment points on the net (relative to net position)
  const leftAttachmentX = (netX + width + 880) * 0.2; // 20% from left
  const leftAttachmentY = (netY - 100) + height * 0.1; // 10% from top
  const rightAttachmentX = (netX + width - 50)* 0.8; // 80% from left
  const rightAttachmentY = (netY) + height * 0.1; // 10% from top

  // Create dynamic rope paths
  const createRopePath = (sensorX: number, sensorY: number, attachX: number, attachY: number) => {
    const controlX = (attachX + sensorX) / 2 - 40; // Sag amount
    const controlY = (attachY + sensorY) / 2 + 40; // Sag amount
    
    return `M${sensorX} ${sensorY} Q${controlX} ${controlY}, ${attachX} ${attachY}`;
  };

  return (
    <g className="net-container">
      {/* Ropes from sensors to net */}
      <path 
        d={createRopePath(x1 , y1, leftAttachmentX + 20, leftAttachmentY + 40)}
        fill="none"
        stroke="#a8a29e"
        strokeWidth="2.5"
        strokeDasharray="5,3"
        className="rope-transition"
      />
      <path 
        d={createRopePath(x2, y2, rightAttachmentX - 40, rightAttachmentY + 50)}
        fill="none"
        stroke="#a8a29e"
        strokeWidth="2.5"
        strokeDasharray="5,3"
        className="rope-transition"
      />

      {/* Net image */}
      <image
        href="/net1.png"
        x={netX}
        y={netY}
        width={width}
        height={height}
        preserveAspectRatio="none"
        opacity="0.9"
        className="net-transition"
      />
    </g>
  );
};

export default Net;