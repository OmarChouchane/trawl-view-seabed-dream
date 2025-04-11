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
  const [sensor1Depth, setSensor1Depth] = useState(230);
  const [sensor2Depth, setSensor2Depth] = useState(250);
  const [isSimulating, setIsSimulating] = useState(false);
  const [seabedDepth, setSeabedDepth] = useState(220);
  const [winchStatus, setWinchStatus] = useState<'idle' | 'lifting' | 'lowering'>('idle');
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [winchSpeed, setWinchSpeed] = useState(2.5);

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
          newSensor1Depth = Math.max(50, sensor1Depth - 10);
          newSensor2Depth = Math.max(80, sensor2Depth - 10);
        } else if (winchStatus === 'lowering') {
          newSensor1Depth = Math.min(200, sensor1Depth + 10);
          newSensor2Depth = Math.min(210, sensor2Depth + 10);
        } else {
          // Random slight movements when idle
          newSensor1Depth = Math.max(50, Math.min(200, sensor1Depth + (Math.random() * 6) - 3));
          newSensor2Depth = Math.max(80, Math.min(210, sensor2Depth + (Math.random() * 6) - 3));
        }

        setSensor1Depth(newSensor1Depth);
        setSensor2Depth(newSensor2Depth);

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
    <div className="container py-6 max-w-full px-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2 text-white">
          <Ship className="text-blue-400" />
          Smart Trawl Control System
        </h1>

        <div className="flex items-center gap-4 text-white">
          <span className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
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
        {/* Main visualization panel - 8 columns on large screens */}
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
            {/* SVG Visualization */}
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 800 600"
              preserveAspectRatio="xMidYMid meet"
              className="relative z-10"
            >
              <defs>
                <filter id="wave-filter" x="-20%" y="-20%" width="140%" height="140%">
                  <feTurbulence
                    type="fractalNoise"
                    baseFrequency="0.02 0.05"
                    numOctaves="2"
                    result="turbulence"
                  />
                  <feDisplacementMap
                    in="SourceGraphic"
                    in2="turbulence"
                    scale="3"
                    xChannelSelector="R"
                    yChannelSelector="G"
                  />
                </filter>

                {/* Keep your existing gradients/patterns here */}
              </defs>
              {/* Reference depth lines */}
              <DepthMarkers boatY={0} />

              {/* Boat with fixed position */}
              <Boat x={400} y={40} />

              {/* Sensors */}
              <Sensor x={400} y={sensor1Depth} id={1} depth={sensor1Depth} />
              <Sensor x={500} y={sensor2Depth} id={2} depth={sensor2Depth} />

              {/* Ropes from boat to sensors - using fixed boat position */}
              <path
                d={`M 650 75 
                   Q ${(400 + 400) / 2} ${(85 + sensor1Depth) / 2 + 60}
                   ${400} ${sensor1Depth}`}
                fill="none"
                stroke="#a8a29e"
                strokeWidth="2.5"
                strokeDasharray="5,3"
                className="rope-transition"
              />

              <path
                d={`M 660 75 
                   Q ${(400 + 500) / 2} ${(85 + sensor2Depth) / 2 + 60}
                   ${500} ${sensor2Depth}`}
                fill="none"
                stroke="#a8a29e"
                strokeWidth="2.5"
                strokeDasharray="5,3"
                className="rope-transition"
              />

              {/* Net between sensors with ropes to net */}
              <Net x1={400} y1={sensor1Depth} x2={500} y2={sensor2Depth} />

              {/* Seabed */}
              <Seabed y={500} width={1200} x={-200} /> 
            </svg>

            {/* Water effect overlay */}
            <WaterEffect />

            {/* Current distance indicator */}
            <div className="absolute bottom-20 right-4 bg-black/70 text-white px-4 py-2 rounded-md backdrop-blur-sm flex items-center gap-2 border border-white/10">
  <Gauge className="h-5 w-5" />
  <div>
    <div className="text-xs opacity-70">Distance to seabed</div>
    <div className="text-xl font-bold">{Math.max(0, currentSeabedDistance) + 8}m</div>
  </div>
</div>
          </div>
        </Card>

        {/* Right side control panels - 4 columns on large screens */}
        <div className="lg:col-span-4">
          <WinchControl
            onWinchOperation={handleWinchOperation}
            status={winchStatus === 'idle' ? 'Active' : winchStatus === 'lifting' ? 'Lifting' : 'Lowering'}
            speed={winchSpeed}
          />
        </div>

        {/* System Alerts - 4 columns */}
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

        {/* Trend Analysis - 8 columns */}
        <Card className="lg:col-span-8 p-4 bg-slate-800/50 border-slate-700 text-white">
          <h2 className="text-lg font-semibold mb-4">Trend Analysis</h2>
          <TrawlCharts data={historyData} />
        </Card>
      </div>
    </div>
  );
};

export default TrawlDashboard;