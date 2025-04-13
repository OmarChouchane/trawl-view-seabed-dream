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

  // Determine sensor status based on distance
  const getSensorStatus = () => {
    if (distance < 7.0) {
      return {
        color: '#ef4444',     // Red
        status: 'Danger',
        pulseClass: 'animate-pulse-danger'
      };
    } else if (distance <= 8) {
      return {
        color: '#f59e0b',    // Yellow
        status: 'Caution',
        pulseClass: 'animate-pulse-caution'
      };
    } else {
      return {
        color: '#10b981',    // Green
        status: 'Safe',
        pulseClass: ''
      };
    }
  };

  const status = getSensorStatus();

  return (
    <g className="sensor-group">
      {/* Signal waves (outer rings) - now color-coded */}
      <circle cx={x} cy={y} r="25" stroke={status.color} strokeWidth="1" strokeOpacity="0.3" fill="none" />
      <circle cx={x} cy={y} r="20" stroke={status.color} strokeWidth="2" strokeOpacity="0.5" fill="none" />
      
      {/* Sensor body - now color-coded */}
      <circle 
        cx={x} 
        cy={y} 
        r="15" 
        fill={status.color}
        stroke={status.color === '#10b981' ? '#065f46' : '#7c2d12'} // Darker border for contrast
        strokeWidth="1.5" 
        className={status.pulseClass}
      />
      
      {/* Sensor center - now white for better visibility */}
      <circle 
        cx={x} 
        cy={y} 
        r="5" 
        fill="#ffffff" 
      />
      
      {/* Sensor ID - now white for better contrast */}
      <text 
        x={x} 
        y={y + 1} 
        textAnchor="middle" 
        dominantBaseline="middle" 
        fill="#fff" 
        fontSize="10"
        fontWeight="bold"
      >
        {id}
      </text>
      
      {/* Distance from seabed label - now with status indicator */}
      <g>
        <rect 
          x={x - 25} 
          y={y - 40} 
          width="50" 
          height="22" 
          rx="5" 
          fill="white" 
          fillOpacity="0.85" 
          stroke={status.color}
          strokeWidth="1.5"
          className="shadow-sm"
        />
        
        <text 
          x={x} 
          y={y - 25} 
          textAnchor="middle" 
          fontSize="12"
          fontWeight="700"
          fill={status.color}
        >
          {formatDistance(distance)}
        </text>
      </g>

      
    </g>
  );
};

export default Sensor;