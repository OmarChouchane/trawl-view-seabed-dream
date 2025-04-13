interface SeabedProps {
  y: number;        // Vertical position of seabed
  width?: number;   // Width of seabed (default 1200 to cover viewbox)
  x?: number;       // Horizontal offset (default -200 to center under boat)
}

const Seabed = ({ y, width = 1200, x = -200 }: SeabedProps) => {
  // Create a more natural wavy seabed line
  const createWavyPath = () => {
    const segmentCount = 60;  // More segments for smoother waves
    const segmentWidth = width / segmentCount;
    let path = `M${x} ${y}`;
    
    // Generate smoother, more natural waves
    for (let i = 0; i <= segmentCount; i++) {
      const currentX = x + (i * segmentWidth);
      // Smoother wave pattern using sine function with random variation
      const waveHeight = Math.sin(i * 0.3) * 10;
      const randomVariation = Math.random() * 5;
      path += ` L${currentX} ${y + waveHeight + randomVariation}`;
    }
    
    // Close the path to create a solid fill
    path += ` L${x + width} ${y + 100} L${x} ${y + 100} Z`;
    
    return path;
  };
  
  return (
    <g className="seabed">
      {/* Define gradient for seabed */}
      <defs>
        <linearGradient id="seabed-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#5a1e07" />
          <stop offset="100%" stopColor="#2a1e07" />
        </linearGradient>
      </defs>

      {/* Main seabed path */}
      <path
        d={createWavyPath()}
        fill="url(#seabed-gradient)"
        stroke="#92400e"
        strokeWidth="1"
        opacity="0.8"
      />
      
      {/* Random rocks and debris - more natural distribution */}
      {Array.from({ length: 25 }).map((_, i) => {
        const rockX = x + Math.random() * width;
        const rockY = y + 5 + Math.random() * 15;
        const rockSize = 1 + Math.random() * 6;
        const rockType = Math.random() > 0.7 ? 'circle' : 'path';
        
        return rockType === 'circle' ? (
          <circle 
            key={`rock-${i}`}
            cx={rockX}
            cy={rockY}
            r={rockSize}
            fill="#78350f"
            opacity="0.8"
          />
        ) : (
          <path
            key={`rock-${i}`}
            d={`M${rockX} ${rockY} 
               Q${rockX + rockSize} ${rockY - rockSize}, 
                ${rockX + rockSize*2} ${rockY}
               Q${rockX + rockSize} ${rockY + rockSize}, 
                ${rockX} ${rockY} Z`}
            fill="#78350f"
            opacity="0.8"
          />
        );
      })}
    </g>
  );
};

export default Seabed;