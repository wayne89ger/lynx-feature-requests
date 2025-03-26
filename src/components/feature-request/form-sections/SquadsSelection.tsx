
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tag, Check } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

// The available squads
const AVAILABLE_SQUADS = ["Demand Capture", "Onboarding", "Client Experience", "CPI"];

interface SquadsSelectionProps {
  selectedSquads: string[];
  onChange: (squads: string[]) => void;
}

export const SquadsSelection = ({ selectedSquads, onChange }: SquadsSelectionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Function to toggle a squad
  const toggleSquad = (squad: string) => {
    if (selectedSquads.includes(squad)) {
      onChange(selectedSquads.filter(s => s !== squad));
    } else {
      onChange([...selectedSquads, squad]);
    }
  };

  const displayValue = selectedSquads.length
    ? `${selectedSquads.length} Squad${selectedSquads.length > 1 ? "s" : ""} Selected`
    : "Select Squads";

  return (
    <div className="space-y-2">
      <Label htmlFor="squads">Squads</Label>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="squads"
            className="w-full justify-between"
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-normal">{displayValue}</span>
            </div>
            <Tag className="h-4 w-4 ml-2 text-muted-foreground" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <div className="p-2">
            <div className="text-sm font-medium mb-2">Select squads</div>
            <div className="grid grid-cols-1 gap-1 max-h-60 overflow-y-auto">
              {AVAILABLE_SQUADS.map((squad) => (
                <div
                  key={squad}
                  className="flex items-center justify-between px-2 py-1.5 hover:bg-muted rounded-sm cursor-pointer"
                  onClick={() => toggleSquad(squad)}
                >
                  <span className="text-sm">{squad}</span>
                  {selectedSquads.includes(squad) && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
      
      {/* Display selected squads below */}
      {selectedSquads.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedSquads.map(squad => (
            <Badge
              key={squad}
              variant="secondary"
              className="cursor-pointer bg-primary/10 hover:bg-primary/20 text-primary"
              onClick={() => toggleSquad(squad)}
            >
              {squad}
              <span className="ml-1">×</span>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};
