
interface BoatProps {
  x: number;
  y: number;
}

const Boat = ({ x, y }: BoatProps) => {
  return (
    <g className="animate-boat-rock" style={{ transformOrigin: `${x + 50}px ${y + 20}px` }}>
      {/* Main hull */}
      <path 
        d={`M${x} ${y+20} 
           C${x+20} ${y-10}, ${x+80} ${y-10}, ${x+100} ${y+20} 
           L${x+80} ${y+40} 
           C${x+60} ${y+50}, ${x+40} ${y+50}, ${x+20} ${y+40} 
           Z`} 
        fill="#f8fafc" 
        stroke="#64748b" 
        strokeWidth="2"
      />
      
      {/* Cabin */}
      <rect 
        x={x+30} 
        y={y} 
        width="40" 
        height="20" 
        fill="#cbd5e1" 
        stroke="#64748b" 
        strokeWidth="2" 
        rx="3"
      />
      
      {/* Windows */}
      <rect x={x+35} y={y+5} width="8" height="8" fill="#0ea5e9" rx="1" />
      <rect x={x+50} y={y+5} width="8" height="8" fill="#0ea5e9" rx="1" />
      
      {/* Antenna */}
      <line x1={x+50} y1={y} x2={x+50} y2={y-15} stroke="#64748b" strokeWidth="2" />
      <circle cx={x+50} cy={y-18} r="3" fill="#f97316" />
    </g>
  );
};

export default Boat;
