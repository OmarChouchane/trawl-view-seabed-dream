
import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import Boat from '@/components/trawl/Boat';
import Sensor from '@/components/trawl/Sensor';
import Net from '@/components/trawl/Net';
import Seabed from '@/components/trawl/Seabed';
import WaterEffect from '@/components/trawl/WaterEffect';
import DepthMarkers from '@/components/trawl/DepthMarkers';
import WinchControl from '@/components/trawl/WinchControl';
import AlertsPanel from '@/components/trawl/AlertsPanel';
import TrawlCharts from '@/components/trawl/TrawlCharts';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Slider } from '@/components/ui/slider';
import { Anchor, Waves, HelpCircle, ArrowDown, ArrowUp, Gauge } from 'lucide-react';

const TrawlDashboard = () => {
  const { toast } = useToast();
  const [sensor1Depth, setSensor1Depth] = useState(120);
  const [sensor2Depth, setSensor2Depth] = useState(180);
  const [isSimulating, setIsSimulating] = useState(false);
  const [seabedDepth, setSeabedDepth] = useState(220);
  const [boatMovement, setBoatMovement] = useState(0);
  const [winchStatus, setWinchStatus] = useState<'idle' | 'lifting' | 'lowering'>('idle');
  const [historyData, setHistoryData] = useState<any[]>([]);

  // Generate initial historical data
  useEffect(() => {
    const initialData = Array.from({ length: 20 }, (_, i) => {
      const baseTime = new Date();
      baseTime.setMinutes(baseTime.getMinutes() - (20 - i));
      
      return {
        time: baseTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sensor1Depth: Math.floor(100 + Math.random() * 50),
        sensor2Depth: Math.floor(160 + Math.random() * 50),
        seabedDistance: Math.floor(30 + Math.random() * 20),
      };
    });
    
    setHistoryData(initialData);
  }, []);

  useEffect(() => {
    let intervalId: number | null = null;
    
    if (isSimulating) {
      intervalId = window.setInterval(() => {
        // Update sensor depths based on winch status
        let newSensor1Depth = sensor1Depth;
        let newSensor2Depth = sensor2Depth;
        
        if (winchStatus === 'lifting') {
          newSensor1Depth = Math.max(50, sensor1Depth - 3);
          newSensor2Depth = Math.max(80, sensor2Depth - 3);
        } else if (winchStatus === 'lowering') {
          newSensor1Depth = Math.min(200, sensor1Depth + 3);
          newSensor2Depth = Math.min(210, sensor2Depth + 3);
        } else {
          // Random slight movements when idle
          newSensor1Depth = Math.max(50, Math.min(200, sensor1Depth + (Math.random() * 6) - 3));
          newSensor2Depth = Math.max(80, Math.min(210, sensor2Depth + (Math.random() * 6) - 3));
        }
        
        setSensor1Depth(newSensor1Depth);
        setSensor2Depth(newSensor2Depth);
        setBoatMovement(prev => (prev + 1) % 20);
        
        // Update historical data
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const seabedDist = Math.max(5, seabedDepth - Math.max(sensor1Depth, sensor2Depth));
        
        setHistoryData(prev => [
          ...prev.slice(1),
          {
            time: timeString,
            sensor1Depth: newSensor1Depth,
            sensor2Depth: newSensor2Depth,
            seabedDistance: seabedDist
          }
        ]);
        
      }, 2000);
    }
    
    return () => {
      if (intervalId !== null) {
        clearInterval(intervalId);
      }
    };
  }, [isSimulating, sensor1Depth, sensor2Depth, winchStatus, seabedDepth]);

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

  const handleWinchOperation = (operation: 'lift' | 'lower' | 'stop') => {
    setWinchStatus(operation === 'lift' ? 'lifting' : 
                 operation === 'lower' ? 'lowering' : 'idle');
    
    // Show toast notification
    toast({
      title: `Winch ${operation === 'stop' ? 'stopped' : operation + 'ing'}`,
      description: operation === 'stop' 
        ? "Winch operation has been stopped" 
        : `Winch is now ${operation}ing the trawl gear`,
      duration: 2000,
    });
  };

  const currentSeabedDistance = seabedDepth - Math.max(sensor1Depth, sensor2Depth);

  return (
    <div className="container py-6 max-w-7xl">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <Anchor className="text-primary" />
        Smart Trawl Gear Dashboard
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main visualization panel - 6 columns on large screens */}
        <Card className="lg:col-span-7 p-4 overflow-hidden">
          <div className="relative w-full h-[500px] ocean-gradient rounded-md overflow-hidden">
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
            
            {/* Current distance indicator */}
            <div className="absolute bottom-4 right-4 bg-black/50 text-white px-4 py-2 rounded-md backdrop-blur-sm flex items-center gap-2 border border-white/10">
              <Gauge className="h-5 w-5" />
              <div>
                <div className="text-xs opacity-70">Distance to seabed</div>
                <div className="text-xl font-bold">{Math.max(0, currentSeabedDistance)}m</div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex justify-between text-sm text-muted-foreground">
            <span>Real-time depth monitoring</span>
            <span>Distance between sensors: {Math.round(Math.sqrt(Math.pow(500-300, 2) + Math.pow(sensor2Depth-sensor1Depth, 2)))}m</span>
          </div>
        </Card>
        
        {/* Right side control panels - 6 columns on large screens */}
        <div className="lg:col-span-5 grid grid-cols-1 gap-6">
          <WinchControl onWinchOperation={handleWinchOperation} />
          
          <AlertsPanel 
            seabedDistance={currentSeabedDistance}
            seabedThreshold={30}
            initialAlerts={[
              {
                id: 'system-1',
                type: 'info',
                message: 'System initialized and ready',
                timestamp: new Date()
              }
            ]}
          />
          
          <div className="bg-slate-50 p-4 rounded-lg border">
            <h3 className="font-medium mb-3 flex items-center">
              <Waves className="mr-2 h-5 w-5 text-blue-500" />
              Manual Controls
            </h3>
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium flex justify-between">
                  <span>Sensor 1 Depth: {sensor1Depth}m</span>
                  <span className="text-muted-foreground text-xs">Min: 50m | Max: 200m</span>
                </label>
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
                <label className="text-sm font-medium flex justify-between">
                  <span>Sensor 2 Depth: {sensor2Depth}m</span>
                  <span className="text-muted-foreground text-xs">Min: 80m | Max: 210m</span>
                </label>
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
                <label className="text-sm font-medium flex justify-between">
                  <span>Seabed Depth: {seabedDepth}m</span>
                  <span className="text-muted-foreground text-xs">Min: 150m | Max: 300m</span>
                </label>
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
            </div>
          </div>
        </div>
        
        {/* Charts panel - full width */}
        <div className="lg:col-span-12">
          <TrawlCharts data={historyData} />
        </div>
      </div>
    </div>
  );
};

export default TrawlDashboard;
