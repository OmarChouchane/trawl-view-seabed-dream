
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
  
  // Create net pattern
  const numVerticalLines = 15;
  const netLines = [];
  
  // Add the main top line of the net
  const topPath = `M${x1} ${y1} Q ${midX} ${midY + 10}, ${x2} ${y2}`;
  netLines.push(<path key="top" d={topPath} fill="none" stroke="#cbd5e1" strokeWidth="3" />);
  
  // Add the bottom curved line of the net
  const bottomPath = `M${x1} ${y1+10} Q ${midX} ${midY + 25}, ${x2} ${y2+10}`;
  netLines.push(<path key="bottom" d={bottomPath} fill="none" stroke="#cbd5e1" strokeWidth="2" />);
  
  // Create vertical lines for the net
  for (let i = 0; i <= numVerticalLines; i++) {
    const t = i / numVerticalLines;
    const topX = x1 + (x2 - x1) * t;
    const topY = y1 + (y2 - y1) * t + Math.sin(t * Math.PI) * 20;
    const bottomX = topX;
    const bottomY = topY + 10 + Math.sin(t * Math.PI) * 5;
    
    netLines.push(
      <line 
        key={`v-${i}`} 
        x1={topX} 
        y1={topY} 
        x2={bottomX} 
        y2={bottomY} 
        stroke="#cbd5e1" 
        strokeWidth="1.5"
        strokeDasharray="3,2"
      />
    );
  }
  
  // Create horizontal lines for the net
  for (let j = 0; j < 3; j++) {
    const factor = (j + 1) / 4;
    const horizontalPath = `M${x1} ${y1 + 10 * factor} Q ${midX} ${midY + 10 * factor + 5}, ${x2} ${y2 + 10 * factor}`;
    
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
