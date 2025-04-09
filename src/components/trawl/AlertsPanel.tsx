
import { useState, useEffect } from 'react';
import { AlertCircle, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type AlertType = 'warning' | 'error' | 'info' | 'success';

interface Alert {
  id: string;
  type: AlertType;
  message: string;
  timestamp: Date;
  details?: string;
}

interface AlertsPanelProps {
  seabedDistance: number;
  seabedThreshold: number;
  initialAlerts?: Alert[];
}

const AlertIcon = ({ type }: { type: AlertType }) => {
  switch (type) {
    case 'warning':
      return <AlertTriangle className="h-5 w-5 text-amber-500" />;
    case 'error':
      return <AlertCircle className="h-5 w-5 text-red-500" />;
    case 'info':
      return <Info className="h-5 w-5 text-blue-500" />;
    case 'success':
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
  }
};

const AlertsPanel = ({ seabedDistance, seabedThreshold, initialAlerts = [] }: AlertsPanelProps) => {
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  
  // Monitor seabed distance and create alerts
  useEffect(() => {
    // Check if we need to add a proximity warning
    const hasProximityWarning = alerts.some(alert => 
      alert.id.includes('proximity') && alert.type === 'warning'
    );
    
    if (seabedDistance < seabedThreshold && !hasProximityWarning) {
      // Add proximity warning
      const newAlert: Alert = {
        id: `proximity-${Date.now()}`,
        type: 'warning',
        message: 'Seabed distance below threshold',
        timestamp: new Date(),
        details: `Current: ${seabedDistance}m`
      };
      
      setAlerts(prev => [newAlert, ...prev]);
    }
    else if (seabedDistance > seabedThreshold + 5 && hasProximityWarning) {
      // Remove proximity warning when distance is safe again
      setAlerts(prev => prev.filter(alert => !alert.id.includes('proximity')));
      
      // Add a success alert
      const newAlert: Alert = {
        id: `safe-${Date.now()}`,
        type: 'success',
        message: 'Safe distance from seabed',
        timestamp: new Date(),
        details: `Current: ${seabedDistance}m`
      };
      
      setAlerts(prev => [newAlert, ...prev]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seabedDistance, seabedThreshold]);
  
  const removeAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };
  
  const getAlertVariant = (type: AlertType) => {
    switch (type) {
      case 'warning': return 'warning';
      case 'error': return 'destructive';
      case 'success': return 'success';
      default: return 'secondary';
    }
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className="space-y-3 max-h-[320px] overflow-y-auto pr-2 scrollbar-thin">
      {alerts.length === 0 ? (
        <div className="text-center py-8 text-slate-500">
          <CheckCircle2 className="mx-auto h-8 w-8 mb-2 opacity-50" />
          <p>No active alerts</p>
        </div>
      ) : (
        alerts.map(alert => (
          <div 
            key={alert.id}
            className={`flex items-start p-3 rounded-md border border-slate-700 ${
              alert.type === 'warning' ? 'bg-amber-900/20' : 
              alert.type === 'error' ? 'bg-red-900/20' :
              alert.type === 'success' ? 'bg-green-900/20' : 
              'bg-slate-700/30'
            }`}
          >
            <div className="mr-3 mt-0.5">
              <AlertIcon type={alert.type} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <p className="font-medium text-sm">{alert.message}</p>
                <Badge variant="outline" className="ml-2 text-xs">
                  {formatTime(alert.timestamp)}
                </Badge>
              </div>
              
              {alert.details && (
                <p className="text-xs text-slate-400 mt-1">{alert.details}</p>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AlertsPanel;
