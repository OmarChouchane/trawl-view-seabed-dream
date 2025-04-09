
import { useState } from 'react';
import { ArrowUp, ArrowDown, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

type WinchStatus = 'idle' | 'lifting' | 'lowering' | 'maintenance';

interface WinchControlProps {
  onWinchOperation: (operation: 'lift' | 'lower' | 'stop') => void;
  status: string;
  speed: number;
}

const WinchControl = ({ onWinchOperation, status, speed }: WinchControlProps) => {
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const handleOperation = (operation: 'lift' | 'lower' | 'stop') => {
    if (maintenanceMode) return;
    onWinchOperation(operation);
  };

  const toggleMaintenance = () => {
    handleOperation('stop');
    setMaintenanceMode(!maintenanceMode);
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700 text-white h-full">
      <CardHeader className="border-b border-slate-700 pb-4">
        <h2 className="text-lg font-semibold">Winch Control</h2>
      </CardHeader>
      <CardContent className="p-6">
        {maintenanceMode && (
          <Alert className="mb-4 bg-red-900/30 text-red-300 border border-red-900">
            <AlertDescription>
              Maintenance mode active. Controls disabled.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-sm text-slate-400">Current Status</div>
              <div className="text-lg font-medium">{status}</div>
            </div>
            
            <div className="space-y-1">
              <div className="text-sm text-slate-400">Speed</div>
              <div className="text-lg font-medium">{speed} m/s</div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              size="lg"
              disabled={maintenanceMode} 
              onClick={() => handleOperation('lift')}
              className="h-16 border-slate-600 bg-slate-700/50 hover:bg-slate-600 text-white"
            >
              <ArrowUp className="mr-2 h-5 w-5" />
              Lift
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              disabled={maintenanceMode} 
              onClick={() => handleOperation('lower')}
              className="h-16 border-slate-600 bg-slate-700/50 hover:bg-slate-600 text-white"
            >
              <ArrowDown className="mr-2 h-5 w-5" />
              Lower
            </Button>
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            disabled={maintenanceMode} 
            onClick={() => handleOperation('stop')}
            className="w-full border-slate-600 hover:bg-slate-700 text-slate-300"
          >
            <Pause className="mr-2 h-4 w-4" />
            Stop
          </Button>
          
          <Button 
            variant={maintenanceMode ? "destructive" : "outline"} 
            className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
            onClick={toggleMaintenance}
          >
            {maintenanceMode ? "Exit Maintenance Mode" : "Enter Maintenance Mode"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WinchControl;
