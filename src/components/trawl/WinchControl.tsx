
import { useState } from 'react';
import { ArrowUp, ArrowDown, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

type WinchStatus = 'idle' | 'lifting' | 'lowering' | 'maintenance';

interface WinchControlProps {
  onWinchOperation: (operation: 'lift' | 'lower' | 'stop') => void;
}

const WinchControl = ({ onWinchOperation }: WinchControlProps) => {
  const [status, setStatus] = useState<WinchStatus>('idle');
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const handleOperation = (operation: 'lift' | 'lower' | 'stop') => {
    if (maintenanceMode) return;
    
    setStatus(operation === 'lift' ? 'lifting' : 
              operation === 'lower' ? 'lowering' : 'idle');
    
    onWinchOperation(operation);
  };

  const toggleMaintenance = () => {
    if (status !== 'idle') {
      handleOperation('stop');
    }
    setMaintenanceMode(!maintenanceMode);
    setStatus(maintenanceMode ? 'idle' : 'maintenance');
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-lg">
          Winch Control
          <Badge 
            variant={status === 'idle' ? "outline" : 
                   status === 'maintenance' ? "destructive" : "default"}
            className="ml-2"
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {maintenanceMode && (
          <Alert className="mb-4 bg-destructive/10 text-destructive border-destructive">
            <AlertDescription>
              Maintenance mode active. Controls disabled.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="grid grid-cols-3 gap-2">
          <Button 
            variant="outline" 
            size="lg"
            disabled={maintenanceMode || status === 'lifting'} 
            onClick={() => handleOperation('lift')}
            className="flex flex-col h-20 items-center justify-center bg-green-50 hover:bg-green-100 border-green-200"
          >
            <ArrowUp className="h-6 w-6 text-green-600" />
            <span className="text-xs mt-1 text-green-700">Lift</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="lg"
            disabled={maintenanceMode || status === 'idle'}
            onClick={() => handleOperation('stop')} 
            className="flex flex-col h-20 items-center justify-center"
          >
            <Pause className="h-6 w-6 text-gray-600" />
            <span className="text-xs mt-1">Stop</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="lg"
            disabled={maintenanceMode || status === 'lowering'} 
            onClick={() => handleOperation('lower')}
            className="flex flex-col h-20 items-center justify-center bg-blue-50 hover:bg-blue-100 border-blue-200"
          >
            <ArrowDown className="h-6 w-6 text-blue-600" />
            <span className="text-xs mt-1 text-blue-700">Lower</span>
          </Button>
        </div>
        
        <Button 
          variant={maintenanceMode ? "destructive" : "outline"} 
          className="w-full mt-4"
          onClick={toggleMaintenance}
        >
          {maintenanceMode ? "Exit Maintenance Mode" : "Enter Maintenance Mode"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default WinchControl;
