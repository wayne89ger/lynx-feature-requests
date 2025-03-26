
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

// The available tags
const AVAILABLE_TAGS = ["DC", "ON", "CE", "CPI"];

interface TagsSelectionProps {
  selectedTags: string[];
  onChange: (tags: string[]) => void;
}

export const TagsSelection = ({ selectedTags, onChange }: TagsSelectionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Function to toggle a tag
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onChange(selectedTags.filter(t => t !== tag));
    } else {
      onChange([...selectedTags, tag]);
    }
  };

  const displayValue = selectedTags.length
    ? `${selectedTags.length} Tag${selectedTags.length > 1 ? "s" : ""} Selected`
    : "Select Tags";

  return (
    <div className="space-y-2">
      <Label htmlFor="tags">Tags</Label>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="tags"
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
            <div className="text-sm font-medium mb-2">Select tags</div>
            <div className="grid grid-cols-1 gap-1 max-h-60 overflow-y-auto">
              {AVAILABLE_TAGS.map((tag) => (
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
      
      {/* Display selected tags below */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedTags.map(tag => (
            <Badge
              key={tag}
              variant="secondary"
              className="cursor-pointer bg-primary/10 hover:bg-primary/20 text-primary"
              onClick={() => toggleTag(tag)}
            >
              {tag}
              <span className="ml-1">×</span>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};
