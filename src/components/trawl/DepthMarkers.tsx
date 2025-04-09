
const DepthMarkers = () => {
  const depthLines = [];
  const depths = [50, 100, 150, 200, 250];
  
  for (const depth of depths) {
    depthLines.push(
      <g key={`depth-${depth}`}>
        <line 
          x1="0" 
          y1={depth} 
          x2="800" 
          y2={depth} 
          stroke="#ffffff" 
          strokeWidth="1" 
          strokeDasharray="5,5" 
          strokeOpacity="0.3" 
        />
        <text 
          x="10" 
          y={depth - 5} 
          fill="#ffffff" 
          fontSize="12" 
          opacity="0.7"
        >
          {depth}m
        </text>
      </g>
    );
  }
  
  return (
    <g className="depth-markers">
      {depthLines}
    </g>
  );
};

export default DepthMarkers;
