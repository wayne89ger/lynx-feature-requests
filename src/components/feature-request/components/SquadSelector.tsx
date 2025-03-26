
import { useState } from "react";
import { Tag, Check } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface SquadSelectorProps {
  selectedSquads: string[];
  availableSquads: string[];
  onChange: (squads: string[]) => void;
}

export const SquadSelector = ({
  selectedSquads,
  availableSquads,
  onChange,
}: SquadSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Toggle a squad in the selected squads array
  const toggleSquad = (squad: string) => {
    if (selectedSquads.includes(squad)) {
      onChange(selectedSquads.filter((s) => s !== squad));
    } else {
      onChange([...selectedSquads, squad]);
    }
  };

  const displayValue = selectedSquads.length
    ? `${selectedSquads.length} Squad${selectedSquads.length > 1 ? "s" : ""} Selected`
    : "Select Squads";

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between bg-white border-lynx-border shadow-sm"
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
          <div className="text-sm font-medium mb-2">Filter by squads</div>
          <div className="grid grid-cols-1 gap-1 max-h-60 overflow-y-auto">
            {availableSquads.map((squad) => (
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
  );
};
