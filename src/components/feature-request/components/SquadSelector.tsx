
import { useState, useRef, useEffect } from "react";
import { Tag, Check, Filter } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
  const [searchText, setSearchText] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter squads based on search input
  const filteredSquads = availableSquads.filter(squad => 
    squad.toLowerCase().includes(searchText.toLowerCase())
  );

  // Toggle a squad in the selected squads array
  const toggleSquad = (squad: string) => {
    if (selectedSquads.includes(squad)) {
      onChange(selectedSquads.filter((s) => s !== squad));
    } else {
      onChange([...selectedSquads, squad]);
    }
  };

  // Clear all selected squads
  const clearAll = () => {
    onChange([]);
    setIsOpen(false);
  };

  // Focus search input when popover opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const displayValue = selectedSquads.length
    ? `${selectedSquads.length} Squad${selectedSquads.length > 1 ? "s" : ""}`
    : "All Squads";

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between bg-white border-lynx-border shadow-sm"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-normal">{displayValue}</span>
          </div>
          {selectedSquads.length > 0 && (
            <Badge variant="secondary" className="ml-2 bg-primary/10 text-primary">
              {selectedSquads.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="start">
        <div className="p-2">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">Filter by squads</h3>
            {selectedSquads.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 px-2 text-xs text-muted-foreground"
                onClick={clearAll}
              >
                Clear all
              </Button>
            )}
          </div>

          <div className="relative mb-2">
            <Input
              ref={searchInputRef}
              type="text"
              placeholder="Search squads..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="pl-8 h-8 text-sm"
            />
            <Tag className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          </div>

          <div className="max-h-60 overflow-y-auto mt-1">
            {filteredSquads.length === 0 ? (
              <div className="py-2 px-2 text-sm text-muted-foreground">
                No squads found
              </div>
            ) : (
              filteredSquads.map((squad) => (
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
              ))
            )}
          </div>
        </div>

        {selectedSquads.length > 0 && (
          <div className="border-t p-2">
            <div className="text-xs font-medium mb-1 text-muted-foreground">Selected Squads:</div>
            <div className="flex flex-wrap gap-1">
              {selectedSquads.map(squad => (
                <Badge
                  key={squad}
                  variant="secondary"
                  className="cursor-pointer text-xs bg-primary/10 hover:bg-primary/20 text-primary"
                  onClick={() => toggleSquad(squad)}
                >
                  {squad}
                  <span className="ml-1">×</span>
                </Badge>
              ))}
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
