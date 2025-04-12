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
  const [sensor1Depth, setSensor1Depth] = useState(230.0);
  const [sensor2Depth, setSensor2Depth] = useState(250.0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [seabedDepth, setSeabedDepth] = useState(260.0);
  const [winchStatus, setWinchStatus] = useState<'idle' | 'lifting' | 'lowering'>('idle');
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [winchSpeed, setWinchSpeed] = useState(2.5);

  // Simplified depth formatting
  const formatDepth = (value: number) => Number(value.toFixed(1));

  // Generate random depth within range
  const getRandomDepth = (min: number, max: number) => 
    formatDepth(min + Math.random() * (max - min));

  // Generate initial historical data
  useEffect(() => {
    const initialData = Array.from({ length: 20 }, (_, i) => ({
      time: new Date(Date.now() - (20 - i) * 60000).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      sensor1Depth: getRandomDepth(100, 150),
      sensor2Depth: getRandomDepth(160, 210),
      seabedDistance: getRandomDepth(30, 50),
    }));
    setHistoryData(initialData);
  }, []);

  useEffect(() => {
    if (!isSimulating) return;

    const intervalId = setInterval(() => {
      // Calculate new depths based on winch status
      const getNewDepth = (current: number, min: number, max: number) => {
        let change = 0;
        if (winchStatus === 'lifting') change = -1;
        if (winchStatus === 'lowering') change = 1;
        if (winchStatus === 'idle') change = (Math.random() * 6) - 3;
        
        return formatDepth(Math.max(min, Math.min(max, current + change)));
      };

      const newSensor1Depth = getNewDepth(sensor1Depth, 50, 200);
      const newSensor2Depth = getNewDepth(sensor2Depth, 80, 210);
      
      setSensor1Depth(newSensor1Depth);
      setSensor2Depth(newSensor2Depth);

      // Update historical data
      const seabedDist = formatDepth(Math.max(5, seabedDepth - Math.max(newSensor1Depth, newSensor2Depth)));
      
      setHistoryData(prev => [
        ...prev.slice(1),
        {
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sensor1Depth: newSensor1Depth,
          sensor2Depth: newSensor2Depth,
          seabedDistance: seabedDist
        }
      ]);
    }, 100);

    return () => clearInterval(intervalId);
  }, [isSimulating, sensor1Depth, sensor2Depth, winchStatus, seabedDepth]);

  const toggleSimulation = () => {
    setIsSimulating(!isSimulating);
    toast({
      title: isSimulating ? "Simulation paused" : "Simulation started",
      description: isSimulating ? "Manual control enabled" : "Sensors will now update automatically",
      duration: 3000,
    });
  };

  const handleSeabedAdjust = (value: number[]) => {
    setSeabedDepth(value[0]);
  };

  const handleWinchOperation = (operation: 'lift' | 'lower' | 'stop') => {
    setWinchStatus(operation === 'lift' ? 'lifting' : operation === 'lower' ? 'lowering' : 'idle');
    toast({
      title: `Winch ${operation === 'stop' ? 'stopped' : operation + 'ing'}`,
      description: operation === 'stop' 
        ? "Winch operation has been stopped" 
        : `Winch is now ${operation}ing the trawl gear`,
      duration: 2000,
    });
  };

  const currentSeabedDistance = formatDepth(seabedDepth - Math.max(sensor1Depth, sensor2Depth));

  return (
    <div className="container py-6 max-w-full px-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2 text-white">
          <Ship className="text-blue-400" /> Smart Trawl Control System
        </h1>
        <div className="flex items-center gap-4 text-white">
          <span className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-sm">Captain Smith</span>
          </span>
          <Button
            onClick={toggleSimulation}
            variant="outline"
            size="sm"
            className="border-slate-600 text-slate-200 hover:text-white hover:bg-slate-700"
          >
            {isSimulating ? "Stop Simulation" : "Start Simulation"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-8 p-4 bg-slate-800/50 border-slate-700 text-white">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Real-Time Seabed Distance</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="border-slate-600 text-slate-200 hover:text-white hover:bg-slate-700">1H</Button>
              <Button variant="outline" size="sm" className="border-slate-600 bg-slate-700 text-white">6H</Button>
              <Button variant="outline" size="sm" className="border-slate-600 text-slate-200 hover:text-white hover:bg-slate-700">24H</Button>
            </div>
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
              <Sensor x={400} y={sensor1Depth} id={1} depth={sensor1Depth} />
              <Sensor x={500} y={sensor2Depth} id={2} depth={sensor2Depth} />

              <path
                d={`M 650 75 Q ${(400 + 400) / 2} ${(85 + sensor1Depth) / 2 + 60} ${400} ${sensor1Depth}`}
                fill="none" stroke="#a8a29e" strokeWidth="2.5" strokeDasharray="5,3" className="rope-transition"
              />
              <path
                d={`M 660 75 Q ${(400 + 500) / 2} ${(85 + sensor2Depth) / 2 + 60} ${500} ${sensor2Depth}`}
                fill="none" stroke="#a8a29e" strokeWidth="2.5" strokeDasharray="5,3" className="rope-transition"
              />

              <Net x1={400} y1={sensor1Depth} x2={500} y2={sensor2Depth} />
              <Seabed y={500} width={1200} x={-200} />
            </svg>

            <WaterEffect />
            <div className="absolute bottom-20 right-4 bg-black/70 text-white px-4 py-2 rounded-md backdrop-blur-sm flex items-center gap-2 border border-white/10">
              <Gauge className="h-5 w-5" />
              <div>
                <div className="text-xs opacity-70">Distance to seabed</div>
                <div className="text-xl font-bold">{currentSeabedDistance.toFixed(1)}m</div>
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
            seabedDistance={currentSeabedDistance}
            seabedThreshold={30}
            initialAlerts={[
              {
                id: 'proximity-1',
                type: 'warning',
                message: 'Seabed distance below threshold',
                timestamp: new Date(),
                details: 'Current: 28m'
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
          <TrawlCharts data={historyData} />
        </Card>
      </div>
    </div>
  );
};

export default TrawlDashboard;