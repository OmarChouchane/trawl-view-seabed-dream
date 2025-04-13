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
import { Anchor, Waves, Ship, ArrowDown, ArrowUp, Gauge } from 'lucide-react';

const TrawlDashboard = () => {
  const { toast } = useToast();
  
  // Configuration using distance from seabed
  const depthConfig = {
    seabedDepth: 15,          // Static seabed depth in meters
    minDistance: 10,           // Minimum distance from seabed (1m)
    maxDistance: 20,          // Maximum distance from seabed (seabedDepth - minDepth)
    minSafeDistance: 1.5        // Minimum safe distance to seabed
  };

  // State tracking distance from seabed
  const [sensor1Distance, setSensor1Distance] = useState(10); // 30-7=23m from seabed
  const [sensor2Distance, setSensor2Distance] = useState(10); // 30-9=21m from seabed
  const [isSimulating, setIsSimulating] = useState(false);
  const [winchStatus, setWinchStatus] = useState<'idle' | 'lifting' | 'lowering'>('idle');
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [winchSpeed, setWinchSpeed] = useState(2.5);

  // Convert distance from seabed to y-position
  const getYPosition = (distance: number) => {
    return 200 + (depthConfig.seabedDepth - distance) * 20;
  };

  // Generate random distance from seabed
  const getRandomDistance = () => 
    Number((depthConfig.minDistance + Math.random() * 
           (depthConfig.maxDistance - depthConfig.minDistance)).toFixed(1));

  // Initialize historical data
  useEffect(() => {
    const initialData = Array.from({ length: 20 }, (_, i) => ({
      time: new Date(Date.now() - (20 - i) * 60000).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      sensor1Distance: getRandomDistance(),
      sensor2Distance: getRandomDistance(),
      seabedDistance: Math.min(getRandomDistance(), getRandomDistance())
    }));
    setHistoryData(initialData);
  }, []);

  // Simulation effect
  useEffect(() => {
    if (!isSimulating) return;

    const intervalId = setInterval(() => {
      const getNewDistance = (current: number) => {
        let change = 0;
        if (winchStatus === 'lifting') change = 0.1;    // Increase distance
        if (winchStatus === 'lowering') change = -0.1;  // Decrease distance
        if (winchStatus === 'idle') change = (Math.random() * 0.2) - 0.1;
        
        return Number(Math.max(
          depthConfig.minDistance, 
          Math.min(depthConfig.maxDistance, current + change)
        ).toFixed(1));
      };

      const newSensor1Distance = getNewDistance(sensor1Distance);
      const newSensor2Distance = getNewDistance(sensor2Distance);
      
      setSensor1Distance(newSensor1Distance);
      setSensor2Distance(newSensor2Distance);

      setHistoryData(prev => [
        ...prev.slice(1),
        {
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sensor1Distance: newSensor1Distance,
          sensor2Distance: newSensor2Distance,
          seabedDistance: Math.min(newSensor1Distance, newSensor2Distance)
        }
      ]);
    }, 100);

    return () => clearInterval(intervalId);
  }, [isSimulating, sensor1Distance, sensor2Distance, winchStatus]);

  // Current distance (using closest sensor)
  const currentSeabedDistance = (Math.min(sensor1Distance, sensor2Distance) - 10).toFixed(1);

  // Calculate positions
  const sensor1Y = getYPosition(sensor1Distance);
  const sensor2Y = getYPosition(sensor2Distance);

  // Winch control handler
  const handleWinchOperation = (operation: 'lift' | 'lower' | 'stop') => {
    const status = operation === 'lift' ? 'lifting' : 
                   operation === 'lower' ? 'lowering' : 'idle';
    setWinchStatus(status);
    toast({
      title: `Winch ${operation === 'stop' ? 'stopped' : operation + 'ing'}`,
      description: operation === 'stop' 
        ? "Winch operation has been stopped" 
        : `Winch is now ${operation}ing the trawl gear`,
      duration: 2000,
    });
  };

  const toggleSimulation = () => {
    setIsSimulating(!isSimulating);
    toast({
      title: isSimulating ? "Simulation paused" : "Simulation started",
      description: isSimulating ? "Manual control enabled" : "Sensors will now update automatically",
      duration: 3000,
    });
  };

  return (
    <div className="container py-6 max-w-full px-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="h-12 w-19"/>
          <h1 className="text-3xl font-bold text-white">Smart Trawl Control System</h1>
        </div>
        <div className="flex items-center gap-4 text-white">
          <span className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-sm">Captain Ali</span>
          </span>
          <Button
            onClick={toggleSimulation}
            variant="outline"
            size="sm"
            className="border-slate-600 text-slate-700 hover:text-white hover:bg-slate-700"
          >
            {isSimulating ? "Stop Simulation" : "Start Simulation"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-8 p-4 bg-slate-800/50 border-slate-700 text-white">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Real-Time Seabed Distance</h2>
          </div>

          <div className="relative w-full h-[500px] ocean-dark-gradient rounded-md overflow-hidden">
            <svg width="100%" height="100%" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid meet" className="relative z-10">
              <defs>
                <filter id="wave-filter" x="-20%" y="-20%" width="140%" height="140%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.02 0.05" numOctaves="2" result="turbulence" />
                  <feDisplacementMap in="SourceGraphic" in2="turbulence" scale="3" xChannelSelector="R" yChannelSelector="G" />
                </filter>
              </defs>
              
              <DepthMarkers boatY={0} />
              <Boat x={400} y={40} />
              
              <Sensor x={400} y={sensor1Y} id={1} distance={-5 + sensor1Distance} />
              <Sensor x={500} y={sensor2Y} id={2} distance={-5 + sensor2Distance}  />

              <path
                d={`M 650 75 Q ${(400 + 400) / 2} ${(85 + sensor1Y) / 2 + 60} ${400} ${sensor1Y}`}
                fill="none" stroke="#a8a29e" strokeWidth="2.5" strokeDasharray="5,3" 
              />
              <path
                d={`M 660 75 Q ${(400 + 500) / 2} ${(85 + sensor2Y) / 2 + 60} ${500} ${sensor2Y}`}
                fill="none" stroke="#a8a29e" strokeWidth="2.5" strokeDasharray="5,3" 
              />

              <Net x1={400} y1={sensor1Y} x2={500} y2={sensor2Y} />
              <Seabed y={getYPosition(0)} width={1200} x={-200} />
            </svg>

            <WaterEffect />
            <div className="absolute bottom-20 right-4 bg-black/70 text-white px-4 py-2 rounded-md backdrop-blur-sm flex items-center gap-2 border border-white/10">
              <Gauge className="h-5 w-5" />
              <div>
                <div className="text-xs opacity-70">Distance to seabed</div>
                <div className="text-xl font-bold">{currentSeabedDistance}m</div>
              </div>
            </div>
          </div>
        </Card>

        <div className="lg:col-span-4">
          <WinchControl
            onWinchOperation={handleWinchOperation}
            status={winchStatus === 'idle' ? 'Active' : winchStatus === 'lifting' ? 'Lifting' : 'Lowering'}
            speed={winchSpeed}
          />
        </div>

        <Card className="lg:col-span-4 p-4 bg-slate-800/50 border-slate-700 text-white">
          <h2 className="text-lg font-semibold mb-4">System Alerts</h2>
          <AlertsPanel
            seabedDistance={Number(currentSeabedDistance)}
            seabedThreshold={depthConfig.minSafeDistance}
            initialAlerts={[
              {
                id: 'proximity-1',
                type: 'warning',
                message: 'Seabed distance below threshold',
                timestamp: new Date(),
                details: `Current: ${(depthConfig.minSafeDistance - 2).toFixed(1)}m`
              },
              {
                id: 'maintenance-1',
                type: 'info',
                message: 'Maintenance Due',
                timestamp: new Date(),
                details: 'Schedule maintenance in 48 hours'
              }
            ]}
          />
        </Card>

        <Card className="lg:col-span-8 p-4 bg-slate-800/50 border-slate-700 text-white">
          <h2 className="text-lg font-semibold mb-4">Trend Analysis</h2>
          <TrawlCharts 
 
          />
        </Card>
      </div>
    </div>
  );
};

export default TrawlDashboard;