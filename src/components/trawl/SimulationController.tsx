
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface SimulationControllerProps {
  isSimulating: boolean;
  sensor1Depth: number;
  sensor2Depth: number;
  winchStatus: 'idle' | 'lifting' | 'lowering';
  seabedDepth: number;
  onSensorDepthChange: (sensor1: number, sensor2: number) => void;
  onBoatMovementChange: (movement: number) => void;
  onHistoryDataChange: (data: any) => void;
}

const SimulationController = ({
  isSimulating,
  sensor1Depth,
  sensor2Depth,
  winchStatus,
  seabedDepth,
  onSensorDepthChange,
  onBoatMovementChange,
  onHistoryDataChange
}: SimulationControllerProps) => {
  const { toast } = useToast();
  const [boatMovement, setBoatMovement] = useState(0);

  // Run simulation loop
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
        
        onSensorDepthChange(newSensor1Depth, newSensor2Depth);
        
        const newBoatMovement = (boatMovement + 1) % 20;
        setBoatMovement(newBoatMovement);
        onBoatMovementChange(newBoatMovement);
        
        // Update historical data
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const seabedDist = Math.max(5, seabedDepth - Math.max(newSensor1Depth, newSensor2Depth));
        
        onHistoryDataChange((prev: any[]) => [
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
  }, [isSimulating, sensor1Depth, sensor2Depth, winchStatus, seabedDepth, boatMovement, onBoatMovementChange, onHistoryDataChange, onSensorDepthChange]);

  return null; // This is a logic-only component, no UI
};

export default SimulationController;
