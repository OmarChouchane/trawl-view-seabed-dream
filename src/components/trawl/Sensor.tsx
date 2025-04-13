interface SensorProps {
  x: number;          // X position in SVG
  y: number;          // Y position in SVG
  id: number;         // Sensor ID (1 or 2)
  distance: number;   // Distance from seabed in meters
}

const Sensor = ({ x, y, id, distance }: SensorProps) => {
  // Format distance with units
  const formatDistance = (value: number) => {
    return `${value.toFixed(1)}m`;
  };

  return (
    <g className="sensor-group">
      {/* Signal waves (outer rings) */}
      <circle cx={x} cy={y} r="25" stroke="#fbbf24" strokeWidth="1" strokeOpacity="0.3" fill="none" />
      <circle cx={x} cy={y} r="20" stroke="#fbbf24" strokeWidth="2" strokeOpacity="0.5" fill="none" />
      
      {/* Sensor body */}
      <circle 
        cx={x} 
        cy={y} 
        r="15" 
        fill="#f97316" 
        stroke="#7c2d12" 
        strokeWidth="1.5" 
        className="animate-depth-pulse"
      />
      
      {/* Sensor center */}
      <circle 
        cx={x} 
        cy={y} 
        r="5" 
        fill="#fbbf24" 
      />
      
      {/* Sensor ID */}
      <text 
        x={x} 
        y={y + 1} 
        textAnchor="middle" 
        dominantBaseline="middle" 
        fill="#000" 
        fontSize="10"
        fontWeight="bold"
      >
        {id}
      </text>
      
      {/* Distance from seabed label */}
      <g>
        <rect 
          x={x - 25} 
          y={y - 40} 
          width="50" 
          height="22" 
          rx="5" 
          fill="white" 
          fillOpacity="0.85" 
          stroke="#64748b"
          strokeWidth="1"
          className="shadow-sm"
        />
        
        <text 
          x={x} 
          y={y - 28} 
          textAnchor="middle" 
          fontSize="12"
          fontWeight="500"
          fill="#1e40af"
        >
          {formatDistance(distance)}
        </text>
      </g>
    </g>
  );
};

export default Sensor;