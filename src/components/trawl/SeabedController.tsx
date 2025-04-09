
import { Slider } from '@/components/ui/slider';

interface SeabedControllerProps {
  seabedDepth: number;
  onSeabedAdjust: (value: number[]) => void;
}

const SeabedController = ({ seabedDepth, onSeabedAdjust }: SeabedControllerProps) => {
  return (
    <div className="absolute bottom-4 left-4 bg-black/70 text-white px-4 py-2 rounded-md backdrop-blur-sm border border-white/10 w-64">
      <div className="text-xs opacity-70 mb-1">Adjust Seabed Depth</div>
      <Slider 
        value={[seabedDepth]} 
        min={150} 
        max={300} 
        step={5} 
        onValueChange={onSeabedAdjust} 
      />
    </div>
  );
};

export default SeabedController;
