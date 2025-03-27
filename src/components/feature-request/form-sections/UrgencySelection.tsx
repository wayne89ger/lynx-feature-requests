
import { Label } from "@/components/ui/label";
import {
  RadioGroup,
  RadioGroupItem
} from "@/components/ui/radio-group";

interface UrgencySelectionProps {
  urgency: string;
  setUrgency: (value: string) => void;
}

export const UrgencySelection = ({ urgency, setUrgency }: UrgencySelectionProps) => {
  return (
    <div className="space-y-2">
      <Label>Urgency</Label>
      <RadioGroup 
        value={urgency} 
        onValueChange={setUrgency}
        className="grid grid-cols-3 gap-2"
      >
        <label 
          htmlFor="low" 
          className="flex items-center space-x-2 border rounded-md p-2 hover:bg-gray-50 cursor-pointer"
          onClick={() => setUrgency("low")}
        >
          <RadioGroupItem value="low" id="low" className="text-gray-400" />
          <span className="cursor-pointer">Low</span>
        </label>
        
        <label 
          htmlFor="medium" 
          className="flex items-center space-x-2 border rounded-md p-2 hover:bg-gray-50 cursor-pointer"
          onClick={() => setUrgency("medium")}
        >
          <RadioGroupItem value="medium" id="medium" className="text-amber-500" />
          <span className="cursor-pointer">Medium</span>
        </label>
        
        <label 
          htmlFor="high" 
          className="flex items-center space-x-2 border rounded-md p-2 hover:bg-gray-50 cursor-pointer"
          onClick={() => setUrgency("high")}
        >
          <RadioGroupItem value="high" id="high" className="text-red-500" />
          <span className="cursor-pointer">High</span>
        </label>
      </RadioGroup>
    </div>
  );
};
