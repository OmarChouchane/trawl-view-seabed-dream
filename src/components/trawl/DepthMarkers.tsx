interface DepthMarkerConfig {
  boatY: number;      // Y-position of boat bottom (pixels)
  spacing: number;    // Vertical pixels between lines
  count: number;      // Total number of lines
  startDepth: number; // Starting depth in meters (0 = at boat)
  depthStep: number;  // Depth increment per line (meters)
}

const DepthMarkers = ({ boatY }: { boatY: number }) => {
  // Configuration
  const config: DepthMarkerConfig = {
    boatY: 100,       // Match to your boat's bottom position
    spacing: 105,     // Vertical spacing between lines
    count: 5,         // Number of depth lines
    startDepth: 0,    // 0m at boat level
    depthStep: 4      // Depth increment per line
  };

  // Generate wavy path for the boat level line
  const generateBoatLevelWave = () => {
    const waveHeight = 3; // Wave amplitude
    const waveLength = 50; // Wave period
    let path = `M-150 ${config.boatY}`;
    
    // Create wave pattern across the width
    for (let x = -150; x <= 1200; x += 10) {
      const y = config.boatY + Math.sin(x/waveLength) * waveHeight;
      path += ` L${x} ${y}`;
    }
    return path;
  };

  // Calculate markers
  const markers = Array.from({ length: config.count }, (_, i) => ({
    yPos: config.boatY + (i * config.spacing),
    depth: config.startDepth + (i * config.depthStep)
  }));

  return (
    <g className="depth-markers">
      {markers.map((marker, index) => {
        const isMajorLine = index % 2 === 0;
        const showLabel = marker.depth > 0;

        // Special case for boat level (0m) line
        if (marker.depth === 0) {
          return (
            <g key={`depth-${marker.yPos}`}>
              <path
                d={generateBoatLevelWave()}
                fill="none"
                stroke="rgba(255, 255, 255, 0.9)"
                strokeWidth="1.5"
                strokeDasharray="0"
                opacity="0.7"
              />
              <text
                x="-100"
                y={marker.yPos - 12}
                fill="rgba(255, 255, 255, 0.95)"
                fontSize="13"
                fontFamily="'Inter', sans-serif"
                fontWeight="600"
                opacity="0.95"
                className="drop-shadow-sm"
              >
                BOAT LEVEL (0m)
              </text>
            </g>
          );
        }

        // Regular depth lines
        return (
          <g key={`depth-${marker.yPos}`}>
            <line
              x1="-150"
              y1={marker.yPos}
              x2="1200"
              y2={marker.yPos}
              stroke={isMajorLine ? "rgba(255, 255, 255, 0.9)" : "rgba(100, 210, 255, 0.7)"}
              strokeWidth={isMajorLine ? 1.2 : 0.8}
              strokeDasharray={isMajorLine ? "0" : "8,4"}
              strokeOpacity={isMajorLine ? 0.6 : 0.4}
            />
            {showLabel && (
              <text
                x="-100"
                y={marker.yPos - 5}
                fill={isMajorLine ? "rgba(255, 255, 255, 0.9)" : "rgba(100, 210, 255, 0.7)"}
                fontSize="13"
                fontFamily="'Inter', sans-serif"
                fontWeight={isMajorLine ? "500" : "400"}
                opacity={isMajorLine ? 0.8 : 0.6}
              >
                {marker.depth}m
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
};

export default DepthMarkers;