
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface PrivacyOptionsProps {
  canContact: boolean;
  isAnonymous: boolean;
  setCanContact: (value: boolean) => void;
  setIsAnonymous: (value: boolean) => void;
}

export const PrivacyOptions = ({ 
  canContact, 
  isAnonymous, 
  setCanContact, 
  setIsAnonymous 
}: PrivacyOptionsProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="canContact"
          checked={canContact}
          onCheckedChange={(checked) => setCanContact(checked as boolean)}
        />
        <Label htmlFor="canContact" className="text-sm font-normal">
          Can we contact you about this feature request?
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="isAnonymous"
          checked={isAnonymous}
          onCheckedChange={(checked) => setIsAnonymous(checked as boolean)}
        />
        <Label htmlFor="isAnonymous" className="text-sm font-normal">
          Submit anonymously
        </Label>
      </div>
    </div>
  );
};
