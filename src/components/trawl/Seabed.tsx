interface SeabedProps {
  y: number;
  width?: number;
  x?: number; // Add x position prop
}

const Seabed = ({ y, width = 800, x = 0 }: SeabedProps) => {
  // Create a wavy seabed line
  const createWavyPath = () => {
    const segmentCount = 40;
    const segmentWidth = width / segmentCount;
    let path = `M${x} ${y}`;
    
    // Generate random bumps
    for (let i = 0; i <= segmentCount; i++) {
      const currentX = x + (i * segmentWidth);
      const bumpHeight = Math.random() * 8 + 15;
      path += ` L${currentX} ${y + bumpHeight}`;
    }
    
    // Close the path
    path += ` L${x + width} ${y + 600} L${x} ${y + 600} Z`;
    
    return path;
  };
  
  return (
    <g className="seabed">
      {/* Main seabed */}
      <path
        d={createWavyPath()}
        fill="url(#seabed-gradient)"
        stroke="#92400e"
        strokeWidth="1"
      />
      

      {/* Random rocks distributed across the width */}
      {Array.from({ length: 10 }).map((_, i) => (
        <circle 
          key={`rock-${i}`}
          cx={x + Math.random() * width} 
          cy={y + 50 + Math.random() * 10} 
          r={2 + Math.random() * 8} 
          fill="#78350f" 
        />
      ))}
      
      {/* Define gradient for seabed */}
      <defs>
        <linearGradient id="seabed-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5a1e07" />
          <stop offset="10%" stopColor="#2a1e07" />
        </linearGradient>
      </defs>
    </g>
  );
};

export default Seabed;