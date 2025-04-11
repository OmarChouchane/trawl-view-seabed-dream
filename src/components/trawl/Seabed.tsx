
interface SeabedProps {
  y: number;
}

const Seabed = ({ y }: SeabedProps) => {
  // Create a wavy seabed line
  const createWavyPath = () => {
    const length = 100;
    let path = `M0 ${y}`;
    
    // Generate random bumps
    for (let i = 0; i <= 40; i++) {
      const x = i * 20;
      const bumpHeight = Math.random() * 8 + 15;
      path += ` L${x} ${y + bumpHeight}`;
    }
    
    // Close the path
    path += ` L${length} ${y + 600} L0 ${y + 600} Z`;
    
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
      
      {/* Small rocks on seabed */}
      <circle cx="100" cy={y+10} r="5" fill="#78350f" />
      <circle cx="350" cy={y+8} r="6" fill="#78350f" />
      <circle cx="600" cy={y+7} r="4" fill="#78350f" />
      <circle cx="200" cy={y+5} r="3" fill="#78350f" />
      <circle cx="500" cy={y+9} r="5" fill="#78350f" />
      <circle cx="700" cy={y+6} r="4" fill="#78350f" />
      {Array.from({ length: 10 }).map((_, i) => (
        <circle 
          key={`rock-${i}`}
          cx={Math.random() * 1000} 
          cy={y + 50 + Math.random() * 10} 
          r={2 + Math.random() * 8} 
          fill="#78350f" 
        />
      ))}
      
      {/* Define gradient for seabed */}
      <defs>
      <linearGradient id="seabed-gradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#5a2e0a" />  {/* Darker brown */}
        <stop offset="100%" stopColor="#3d2006" /> {/* Darker brown */}
      </linearGradient>
      </defs>
    </g>
  );
};

export default Seabed;
