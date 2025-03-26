
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
        <div className="flex items-center space-x-2 border rounded-md p-2 hover:bg-gray-50 cursor-pointer">
          <RadioGroupItem value="low" id="low" className="text-gray-400" />
          <Label htmlFor="low" className="cursor-pointer">Low</Label>
        </div>
        <div className="flex items-center space-x-2 border rounded-md p-2 hover:bg-gray-50 cursor-pointer">
          <RadioGroupItem value="medium" id="medium" className="text-amber-500" />
          <Label htmlFor="medium" className="cursor-pointer">Medium</Label>
        </div>
        <div className="flex items-center space-x-2 border rounded-md p-2 hover:bg-gray-50 cursor-pointer">
          <RadioGroupItem value="high" id="high" className="text-red-500" />
          <Label htmlFor="high" className="cursor-pointer">High</Label>
        </div>
      </RadioGroup>
    </div>
  );
};
