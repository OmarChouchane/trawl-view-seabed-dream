
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import Boat from '@/components/trawl/Boat';
import Sensor from '@/components/trawl/Sensor';
import Net from '@/components/trawl/Net';
import Seabed from '@/components/trawl/Seabed';
import WaterEffect from '@/components/trawl/WaterEffect';
import DepthMarkers from '@/components/trawl/DepthMarkers';
import { Gauge } from 'lucide-react';

interface TrawlVisualizationProps {
  sensor1Depth: number;
  sensor2Depth: number;
  boatMovement: number;
  seabedDepth: number;
}

const TrawlVisualization = ({ 
  sensor1Depth, 
  sensor2Depth, 
  boatMovement, 
  seabedDepth 
}: TrawlVisualizationProps) => {
  const currentSeabedDistance = seabedDepth - Math.max(sensor1Depth, sensor2Depth);

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Real-Time Seabed Distance</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="border-slate-600 text-slate-200 hover:text-white hover:bg-slate-700">1H</Button>
          <Button variant="outline" size="sm" className="border-slate-600 bg-slate-700 text-white">6H</Button>
          <Button variant="outline" size="sm" className="border-slate-600 text-slate-200 hover:text-white hover:bg-slate-700">24H</Button>
        </div>
      </div>
      
      <div className="relative w-full h-[500px] ocean-dark-gradient rounded-md overflow-hidden">
        {/* SVG Visualization */}
        <svg 
          width="100%" 
          height="100%" 
          viewBox="0 0 800 600" 
          preserveAspectRatio="xMidYMid meet"
          className="relative z-10"
        >
          {/* Reference depth lines */}
          <DepthMarkers />
          
          {/* Boat with position updates */}
          <Boat x={380 + boatMovement} y={40} />
          
          {/* Sensors */}
          <Sensor x={300} y={sensor1Depth} id={1} depth={sensor1Depth} />
          <Sensor x={500} y={sensor2Depth} id={2} depth={sensor2Depth} />
          
          {/* Ropes from boat to sensors */}
          <path 
            d={`M ${380 + boatMovement + 30} 60 Q ${380 + boatMovement - 20} ${sensor1Depth/2} ${300} ${sensor1Depth}`} 
            fill="none" 
            stroke="#d1d5db" 
            strokeWidth="3" 
            className="rope"
          />
          
          <path 
            d={`M ${380 + boatMovement + 70} 60 Q ${380 + boatMovement + 120} ${sensor2Depth/2} ${500} ${sensor2Depth}`} 
            fill="none" 
            stroke="#d1d5db" 
            strokeWidth="3" 
            className="rope"
          />
          
          {/* Net between sensors with ropes to net */}
          <Net x1={300} y1={sensor1Depth} x2={500} y2={sensor2Depth} />
          
          {/* Seabed */}
          <Seabed y={seabedDepth} />
        </svg>
        
        {/* Water effect overlay */}
        <WaterEffect />
        
        {/* Current distance indicator */}
        <div className="absolute bottom-4 right-4 bg-black/70 text-white px-4 py-2 rounded-md backdrop-blur-sm flex items-center gap-2 border border-white/10">
          <Gauge className="h-5 w-5" />
          <div>
            <div className="text-xs opacity-70">Distance to seabed</div>
            <div className="text-xl font-bold">{Math.max(0, currentSeabedDistance)}m</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrawlVisualization;
