
interface NetProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

const Net = ({ x1, y1, x2, y2 }: NetProps) => {
  // Calculate the midpoint with a slight sag
  const midX = (x1 + x2) / 2;
  const midY = Math.max(y1, y2) + 20;
  
  // Calculate control points for the net curves
  const controlX1 = (x1 + midX) / 2;
  const controlY1 = (y1 + midY) / 2 + 10;
  const controlX2 = (midX + x2) / 2;
  const controlY2 = (midY + y2) / 2 + 10;
  
  // Define net width and height
  const netWidth = x2 - x1;
  const netHeight = 50;
  const netBottomY = midY + 20;
  
  // Create net pattern
  const netLines = [];
  
  // Add the main top line of the net
  const topPath = `M${x1} ${y1} Q ${midX} ${midY - 10}, ${x2} ${y2}`;
  netLines.push(<path key="top" d={topPath} fill="none" stroke="#cbd5e1" strokeWidth="3" />);
  
  // Ropes from sensors to top of net
  netLines.push(
    <line 
      key="rope1" 
      x1={x1} 
      y1={y1} 
      x2={x1 + 10} 
      y2={midY - 20}
      stroke="#cbd5e1" 
      strokeWidth="2" 
    />
  );
  
  netLines.push(
    <line 
      key="rope2" 
      x1={x2} 
      y1={y2} 
      x2={x2 - 10} 
      y2={midY - 20}
      stroke="#cbd5e1" 
      strokeWidth="2" 
    />
  );
  
  // Add the bottom curved line of the net
  const bottomPath = `M${x1 + 20} ${netBottomY} Q ${midX} ${netBottomY + 15}, ${x2 - 20} ${netBottomY}`;
  netLines.push(<path key="bottom" d={bottomPath} fill="none" stroke="#cbd5e1" strokeWidth="2" />);
  
  // Create vertical lines for the net
  const numVerticalLines = 10;
  for (let i = 0; i <= numVerticalLines; i++) {
    const t = i / numVerticalLines;
    const topX = x1 + netWidth * t;
    const topY = midY - 10 + Math.sin(t * Math.PI) * 10;
    const bottomX = topX;
    const bottomY = netBottomY;
    
    netLines.push(
      <line 
        key={`v-${i}`} 
        x1={topX} 
        y1={topY} 
        x2={bottomX} 
        y2={bottomY} 
        stroke="#cbd5e1" 
        strokeWidth="1.5"
        strokeDasharray="5,3"
      />
    );
  }
  
  // Create horizontal lines for the net
  for (let j = 1; j < 4; j++) {
    const factor = j / 4;
    const horizontalY = midY - 10 + factor * (netBottomY - (midY - 10));
    const horizontalPath = `M${x1 + 20} ${horizontalY} Q ${midX} ${horizontalY + 5}, ${x2 - 20} ${horizontalY}`;
    
    netLines.push(
      <path 
        key={`h-${j}`} 
        d={horizontalPath} 
        fill="none" 
        stroke="#cbd5e1" 
        strokeWidth="1.5"
        strokeDasharray="4,3"
      />
    );
  }
  
  return <g className="net">{netLines}</g>;
};

export default Net;
