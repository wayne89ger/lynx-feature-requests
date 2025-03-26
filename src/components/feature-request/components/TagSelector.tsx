
import { useState } from "react";
import { Tag, Check } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface TagSelectorProps {
  selectedTags: string[];
  availableTags: string[];
  onChange: (tags: string[]) => void;
}

export const TagSelector = ({
  selectedTags,
  availableTags,
  onChange,
}: TagSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Toggle a tag in the selected tags array
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onChange(selectedTags.filter((t) => t !== tag));
    } else {
      onChange([...selectedTags, tag]);
    }
  };

  const displayValue = selectedTags.length
    ? `${selectedTags.length} Tag${selectedTags.length > 1 ? "s" : ""} Selected`
    : "Select Tags";

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
          <div className="text-sm font-medium mb-2">Filter by tags</div>
          <div className="grid grid-cols-1 gap-1 max-h-60 overflow-y-auto">
            {availableTags.map((tag) => (
              <div
                key={tag}
                className="flex items-center justify-between px-2 py-1.5 hover:bg-muted rounded-sm cursor-pointer"
                onClick={() => toggleTag(tag)}
              >
                <span className="text-sm">{tag}</span>
                {selectedTags.includes(tag) && (
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
