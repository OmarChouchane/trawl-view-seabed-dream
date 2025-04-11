
interface SensorProps {
  x: number;
  y: number;
  id: number;
  depth: number;
}

const Sensor = ({ x, y, id, depth }: SensorProps) => {
  return (
    <g>
      {/* Sensor body */}
      <circle 
        cx={x} 
        cy={y} 
        r="15" 
        fill="#f97316" 
        stroke="#7c2d12" 
        strokeWidth="1" 
        className="animate-depth-pulse"
      />
      
      {/* Sensor details */}
      <circle 
        cx={x} 
        cy={y} 
        r="5" 
        fill="#fbbf24" 
      />
      
      {/* Sensor ID */}
      <text 
        x={x} 
        y={y+1} 
        textAnchor="middle" 
        dominantBaseline="middle" 
        fill="#000" 
        fontSize="10"
        fontWeight="bold"
      >
        {id}
      </text>
      
      {/* Depth label */}
      <g>
        <rect 
          x={x-25} 
          y={y-40} 
          width="50" 
          height="22" 
          rx="5" 
          fill="white" 
          fillOpacity="0.8" 
          stroke="#64748b"
          strokeWidth="1"
        />
        <text 
          x={x} 
          y={y-28} 
          textAnchor="middle" 
          dominantBaseline="middle" 
          fontSize="12"
          fontWeight="semibold"
          fill="#0f172a"
        >
          {depth/10 - 16}m
        </text>
      </g>
      
      {/* Signal waves */}
      <circle cx={x} cy={y} r="20" stroke="#fbbf24" strokeWidth="2" strokeOpacity="0.5" fill="none" />
      <circle cx={x} cy={y} r="25" stroke="#fbbf24" strokeWidth="1" strokeOpacity="0.3" fill="none" />
    </g>
  );
};

export default Sensor;
