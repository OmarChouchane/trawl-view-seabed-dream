interface BoatProps {
  x: number;
  y: number;
}

const Boat = ({ x, y }: BoatProps) => {
  // Professional trawler dimensions
  const length = 180;
  const beam = 40;
  const draft = 20;
  const verticalOffset = 35;
  const horizontalOffset = 250; // New: Moves boat right by 50px
  const adjustedY = y + verticalOffset;
  const adjustedX = x + horizontalOffset; // New: Adjusted X position

  return (
    <g className="animate-boat-rock" style={{ 
      transformOrigin: `${adjustedX + length/2}px ${adjustedY + draft/2}px`
    }}>
      <defs>
        <linearGradient id="hull-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#9ca3af" />
          <stop offset="50%" stopColor="#6b7280" />
          <stop offset="100%" stopColor="#9ca3af" />
        </linearGradient>
        <pattern id="deck-texture" patternUnits="userSpaceOnUse" width="15" height="15">
          <rect width="15" height="15" fill="#e5e7eb" />
          <path d="M0 0 L15 15 M15 0 L0 15" stroke="#d1d5db" strokeWidth="0.5" />
        </pattern>
      </defs>

      {/* Hull - positioned lower and to the right */}
      <path 
        d={`M${adjustedX} ${adjustedY}
           C${adjustedX+length*0.2} ${adjustedY-8}, ${adjustedX+length*0.8} ${adjustedY-8}, ${adjustedX+length} ${adjustedY}
           L${adjustedX+length} ${adjustedY+draft}
           C${adjustedX+length*0.8} ${adjustedY+draft+5}, ${adjustedX+length*0.2} ${adjustedY+draft+5}, ${adjustedX} ${adjustedY+draft}
           Z`}
        fill="url(#hull-gradient)"
        stroke="#4b5563"
        strokeWidth="1.5"
      />

      {/* Main deck */}
      <rect
        x={adjustedX}
        y={adjustedY-10}
        width={length}
        height="10"
        fill="url(#deck-texture)"
        stroke="#4b5563"
        strokeWidth="1"
      />

      {/* Wheelhouse */}
      <rect
        x={adjustedX+length*0.4}
        y={adjustedY-35}
        width={length*0.3}
        height="25"
        fill="#f3f4f6"
        stroke="#374151"
        strokeWidth="1.2"
        rx="2"
      />

      {/* Wheelhouse windows */}
      <rect
        x={adjustedX+length*0.45}
        y={adjustedY-30}
        width={length*0.2}
        height="12"
        fill="#bfdbfe"
        rx="1"
      />
      

      {/* Trawling gear */}
      <g className="trawling-equipment">
        <rect
          x={adjustedX+length-15}
          y={adjustedY-5}
          width="12"
          height="5"
          fill="#4b5563"
          rx="1"
        />
        <circle cx={adjustedX+length-25} cy={adjustedY} r="3" fill="#6b7280" />
        <circle cx={adjustedX+25} cy={adjustedY} r="3" fill="#6b7280" />
      </g>

      {/* Navigation lights */}
      <circle cx={adjustedX+15} cy={adjustedY-5} r="3" fill="#ef4444" />
      <circle cx={adjustedX+length-15} cy={adjustedY-5} r="3" fill="#22c55e" />
      <circle cx={adjustedX+length/2} cy={adjustedY-38} r="2" fill="#fbbf24" />

      <circle cx={x + 250} cy={y + 25} r="2" fill="blue" id="rope-connection-port" />
<circle cx={x + 260} cy={y + 25} r="2" fill="blue" id="rope-connection-starboard" />


      {/* Waterline */}
      <path
        d={`M${adjustedX} ${adjustedY} L${adjustedX+length} ${adjustedY}`}
        stroke="#1e40af"
        strokeWidth="1.2"
        strokeDasharray="4,2"
      />
    </g>
  );
};

export default Boat;