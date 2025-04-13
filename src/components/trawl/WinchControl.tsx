import { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, Pause, Settings, AlertTriangle, AlertOctagon, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

type WinchState = 'idle' | 'lifting' | 'lowering';
type SafetyStatus = 'Emergency' | 'Warning' | 'Safe';

interface WinchControlProps {
  onWinchOperation: (operation: 'lift' | 'lower' | 'stop') => void;
  speed: number;
  status: 'Active' | 'Lifting' | 'Lowering';
  seabedDistance: number; // Add this prop
}

const WinchControl = ({ onWinchOperation, speed, seabedDistance }: WinchControlProps) => {
  const [currentState, setCurrentState] = useState<WinchState>('idle');
  const [isManualMode, setIsManualMode] = useState(true);
  const [safetyStatus, setSafetyStatus] = useState<SafetyStatus>('Safe');

  // Update safety status based on seabed distance
  useEffect(() => {
    if (seabedDistance < 1.5) {
      setSafetyStatus('Emergency');
      // Auto-trigger lifting in emergency situations
      if (!isManualMode) handleOperation('lift');
    } else if (seabedDistance < 2.5) {
      setSafetyStatus('Warning');
    } else {
      setSafetyStatus('Safe');
    }
  }, [seabedDistance, isManualMode]);

  const handleOperation = (operation: 'lift' | 'lower' | 'stop') => {
    onWinchOperation(operation);

    switch (operation) {
      case 'lift':
        setCurrentState('lifting');
        break;
      case 'lower':
        // Prevent lowering if too close to seabed
        if (safetyStatus === 'Emergency') return;
        setCurrentState('lowering');
        break;
      case 'stop':
        setCurrentState('idle');
        break;
    }
  };

  // Get status color and icon
  const getSafetyStatusConfig = () => {
    switch (safetyStatus) {
      case 'Emergency':
        return { color: 'bg-red-500', icon: <AlertOctagon className="h-4 w-4" />, text: 'Emergency Lifting' };
      case 'Warning':
        return { color: 'bg-yellow-500', icon: <AlertTriangle className="h-4 w-4" />, text: 'Safe but Close' };
      default:
        return { color: 'bg-green-500', icon: <Check className="h-4 w-4" />, text: 'Safe' };
    }
  };

  const statusConfig = getSafetyStatusConfig();

  return (
    <Card className="bg-slate-800/50 border-slate-700 text-white h-full">
      <CardHeader className="border-b border-slate-700 pb-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Winch Control</h2>
          <div className="flex items-center space-x-2">
            <Settings className="h-4 w-4 text-slate-400" />
            <Label htmlFor="mode-toggle" className="text-sm text-slate-400">
              {isManualMode ? 'Manual' : 'Auto'}
            </Label>
            <Switch
              id="mode-toggle"
              checked={isManualMode}
              onCheckedChange={setIsManualMode}
              className="data-[state=checked]:bg-blue-500"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Safety Status Alert */}
          <div className={`flex items-center p-3 rounded-md ${statusConfig.color}/20 border ${statusConfig.color}/30`}>
            <div className={`p-2 rounded-full ${statusConfig.color} mr-3`}>
              {statusConfig.icon}
            </div>
            <div>
              <div className="text-sm font-medium">{statusConfig.text}</div>
              <div className="text-xs text-slate-400">Seabed distance: {seabedDistance.toFixed(2)}m</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-sm text-slate-400">Current State</div>
              <div className="text-lg font-medium flex items-center gap-2">
                {currentState}
                <span className={`h-2 w-2 rounded-full ${
                  currentState === 'idle' ? 'bg-gray-500' :
                  currentState === 'lifting' ? 'bg-green-500' : 'bg-blue-500'
                }`}></span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-sm text-slate-400">Speed</div>
              <div className="text-lg font-medium">{speed} m/s</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              variant={currentState === 'lifting' ? 'default' : 'outline'}
              size="lg"
              onClick={() => handleOperation('lift')}
              disabled={(!isManualMode && safetyStatus !== 'Emergency') || currentState === 'lifting'}
              className="h-16 border-slate-600 bg-slate-700/50 hover:bg-slate-600 text-white"
            >
              <ArrowUp className="mr-2 h-5 w-5" />
              {currentState === 'lifting' ? 'Lifting...' : 'Lift'}
            </Button>

            <Button
              variant={currentState === 'lowering' ? 'default' : 'outline'}
              size="lg"
              onClick={() => handleOperation('lower')}
              disabled={!isManualMode || currentState === 'lowering' || safetyStatus === 'Emergency'}
              className="h-16 border-slate-600 bg-slate-700/50 hover:bg-slate-600 text-white"
            >
              <ArrowDown className="mr-2 h-5 w-5" />
              {currentState === 'lowering' ? 'Lowering...' : 'Lower'}
            </Button>
          </div>

          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleOperation('stop')}
            disabled={currentState === 'idle'}
            className="w-full bg-red-800 hover:bg-red-700 text-white"
          >
            <Pause className="mr-2 h-4 w-4" />
            Stop
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WinchControl;