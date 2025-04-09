
import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import Boat from '@/components/trawl/Boat';
import Sensor from '@/components/trawl/Sensor';
import Net from '@/components/trawl/Net';
import Seabed from '@/components/trawl/Seabed';
import WaterEffect from '@/components/trawl/WaterEffect';
import DepthMarkers from '@/components/trawl/DepthMarkers';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Slider } from '@/components/ui/slider';
import { Anchor, Waves, HelpCircle } from 'lucide-react';

const TrawlDashboard = () => {
  const { toast } = useToast();
  const [sensor1Depth, setSensor1Depth] = useState(120);
  const [sensor2Depth, setSensor2Depth] = useState(180);
  const [isSimulating, setIsSimulating] = useState(false);
  const [seabedDepth, setSeabedDepth] = useState(220);
  const [boatMovement, setBoatMovement] = useState(0);

  useEffect(() => {
    let intervalId: number | null = null;
    
    if (isSimulating) {
      intervalId = window.setInterval(() => {
        setSensor1Depth(prev => Math.max(50, Math.min(200, prev + (Math.random() * 10) - 5)));
        setSensor2Depth(prev => Math.max(80, Math.min(210, prev + (Math.random() * 10) - 5)));
        setBoatMovement(prev => (prev + 1) % 20);
      }, 2000);
    }
    
    return () => {
      if (intervalId !== null) {
        clearInterval(intervalId);
      }
    };
  }, [isSimulating]);

  const toggleSimulation = () => {
    setIsSimulating(!isSimulating);
    
    toast({
      title: isSimulating ? "Simulation paused" : "Simulation started",
      description: isSimulating 
        ? "Manual control enabled" 
        : "Sensors will now update automatically",
      duration: 3000,
    });
  };

  const handleSeabedAdjust = (value: number[]) => {
    setSeabedDepth(value[0]);
  };

  return (
    <div className="container py-6 max-w-5xl">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <Anchor className="text-primary" />
        Smart Trawl Gear Dashboard
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="p-4 col-span-1">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Waves className="h-5 w-5" />
            Controls
          </h2>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Sensor 1 Depth: {sensor1Depth}m</label>
              <Slider 
                value={[sensor1Depth]} 
                min={50} 
                max={200}
                step={1}
                onValueChange={(value) => setSensor1Depth(value[0])}
                disabled={isSimulating}
                className="py-4"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Sensor 2 Depth: {sensor2Depth}m</label>
              <Slider 
                value={[sensor2Depth]} 
                min={80} 
                max={210}
                step={1}
                onValueChange={(value) => setSensor2Depth(value[0])}
                disabled={isSimulating}
                className="py-4"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Seabed Depth: {seabedDepth}m</label>
              <Slider 
                value={[seabedDepth]} 
                min={150} 
                max={300}
                step={1}
                onValueChange={handleSeabedAdjust}
                className="py-4"
              />
            </div>
            
            <Button 
              onClick={toggleSimulation} 
              className="w-full"
              variant={isSimulating ? "destructive" : "default"}
            >
              {isSimulating ? "Stop Simulation" : "Start Simulation"}
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full flex items-center gap-2"
              onClick={() => {
                toast({
                  title: "Help Information",
                  description: "This dashboard shows real-time trawl gear data. Start the simulation to see dynamic movement or manually adjust values.",
                  duration: 5000,
                });
              }}
            >
              <HelpCircle className="h-4 w-4" /> Help
            </Button>
          </div>
        </Card>
        
        <Card className="p-4 col-span-1 lg:col-span-3 overflow-hidden">
          <div className="relative w-full h-[600px] ocean-gradient rounded-md overflow-hidden">
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
              
              {/* Sensors */}
              <Sensor x={300} y={sensor1Depth} id={1} depth={sensor1Depth} />
              <Sensor x={500} y={sensor2Depth} id={2} depth={sensor2Depth} />
              
              {/* Net between sensors */}
              <Net x1={300} y1={sensor1Depth} x2={500} y2={sensor2Depth} />
              
              {/* Seabed */}
              <Seabed y={seabedDepth} />
            </svg>
            
            {/* Water effect overlay */}
            <WaterEffect />
          </div>
          
          <div className="mt-4 flex justify-between text-sm text-muted-foreground">
            <span>Real-time depth monitoring</span>
            <span>Distance between sensors: {Math.round(Math.sqrt(Math.pow(500-300, 2) + Math.pow(sensor2Depth-sensor1Depth, 2)))}m</span>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TrawlDashboard;
