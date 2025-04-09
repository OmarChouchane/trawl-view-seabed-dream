
import { useState, useEffect } from 'react';
import { Bell, AlertTriangle, Info, Check, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Alert {
  id: string;
  type: 'warning' | 'info' | 'success';
  message: string;
  timestamp: Date;
}

interface AlertsPanelProps {
  initialAlerts?: Alert[];
  seabedDistance?: number;
  seabedThreshold?: number;
}

const AlertsPanel = ({ 
  initialAlerts = [], 
  seabedDistance = 40,
  seabedThreshold = 30 
}: AlertsPanelProps) => {
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  
  useEffect(() => {
    // Create a seabed proximity alert when too close
    if (seabedDistance < seabedThreshold) {
      const proximityAlert: Alert = {
        id: `proximity-${Date.now()}`,
        type: 'warning',
        message: `Trawl gear approaching seabed (${seabedDistance}m)`,
        timestamp: new Date()
      };
      
      // Check if we already have a proximity alert
      const hasProximityAlert = alerts.some(alert => 
        alert.message.includes('approaching seabed')
      );
      
      if (!hasProximityAlert) {
        setAlerts(prev => [proximityAlert, ...prev]);
      }
    } else {
      // Remove proximity alerts if we're at a safe distance
      setAlerts(prev => prev.filter(alert => 
        !alert.message.includes('approaching seabed')
      ));
    }
  }, [seabedDistance, seabedThreshold, alerts]);

  const dismissAlert = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  const clearAllAlerts = () => {
    setAlerts([]);
  };

  const getAlertIcon = (type: 'warning' | 'info' | 'success') => {
    switch (type) {
      case 'warning': return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'info': return <Info className="h-4 w-4 text-blue-500" />;
      case 'success': return <Check className="h-4 w-4 text-green-500" />;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center">
            <Bell className="mr-2 h-5 w-5" />
            Alerts & Notifications
          </div>
          {alerts.length > 0 && (
            <Badge variant="destructive" className="ml-2">
              {alerts.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
          {alerts.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No active alerts
            </div>
          ) : (
            alerts.map(alert => (
              <div 
                key={alert.id}
                className={`p-3 rounded-lg flex justify-between items-start border
                  ${alert.type === 'warning' ? 'bg-amber-50 border-amber-200' : 
                    alert.type === 'info' ? 'bg-blue-50 border-blue-200' :
                    'bg-green-50 border-green-200'}`}
              >
                <div className="flex items-start gap-2">
                  <div className="mt-0.5">
                    {getAlertIcon(alert.type)}
                  </div>
                  <div>
                    <div className="text-sm font-medium">
                      {alert.message}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {alert.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => dismissAlert(alert.id)}
                  className="h-6 w-6 p-0 rounded-full"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))
          )}
        </div>
        
        {alerts.length > 0 && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={clearAllAlerts}
            className="w-full mt-4"
          >
            Clear All
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default AlertsPanel;
