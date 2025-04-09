
import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { useToast } from '@/components/ui/use-toast';
import TrawlVisualization from '@/components/trawl/TrawlVisualization';
import WinchControl from '@/components/trawl/WinchControl';
import AlertsPanel from '@/components/trawl/AlertsPanel';
import TrawlCharts from '@/components/trawl/TrawlCharts';
import DashboardHeader from '@/components/trawl/DashboardHeader';
import SimulationController from '@/components/trawl/SimulationController';
import SeabedController from '@/components/trawl/SeabedController';

const TrawlDashboard = () => {
  const { toast } = useToast();
  const [sensor1Depth, setSensor1Depth] = useState(120);
  const [sensor2Depth, setSensor2Depth] = useState(180);
  const [isSimulating, setIsSimulating] = useState(false);
  const [seabedDepth, setSeabedDepth] = useState(220);
  const [boatMovement, setBoatMovement] = useState(0);
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

  const handleSensorDepthChange = (sensor1: number, sensor2: number) => {
    setSensor1Depth(sensor1);
    setSensor2Depth(sensor2);
  };

  const currentSeabedDistance = seabedDepth - Math.max(sensor1Depth, sensor2Depth);

  return (
    <div className="container py-6 max-w-full px-6">
      <DashboardHeader 
        isSimulating={isSimulating}
        toggleSimulation={toggleSimulation}
      />
      
      <SimulationController 
        isSimulating={isSimulating}
        sensor1Depth={sensor1Depth}
        sensor2Depth={sensor2Depth}
        winchStatus={winchStatus}
        seabedDepth={seabedDepth}
        onSensorDepthChange={handleSensorDepthChange}
        onBoatMovementChange={setBoatMovement}
        onHistoryDataChange={setHistoryData}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main visualization panel - 8 columns on large screens */}
        <Card className="lg:col-span-8 p-4 bg-slate-800/50 border-slate-700 text-white">
          <div className="relative">
            <TrawlVisualization 
              sensor1Depth={sensor1Depth}
              sensor2Depth={sensor2Depth}
              boatMovement={boatMovement}
              seabedDepth={seabedDepth}
            />
            <SeabedController
              seabedDepth={seabedDepth}
              onSeabedAdjust={handleSeabedAdjust}
            />
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
