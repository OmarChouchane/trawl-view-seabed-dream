
import { Button } from "@/components/ui/button";
import { Ship } from 'lucide-react';

interface DashboardHeaderProps {
  isSimulating: boolean;
  toggleSimulation: () => void;
}

const DashboardHeader = ({ isSimulating, toggleSimulation }: DashboardHeaderProps) => {
  return (
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
  );
};

export default DashboardHeader;
