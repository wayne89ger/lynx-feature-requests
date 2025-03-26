
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tag } from "lucide-react";

// The available tags
const AVAILABLE_TAGS = ["DC", "ON", "CE", "CPI"];

interface TagsSelectionProps {
  selectedTags: string[];
  onChange: (tags: string[]) => void;
}

export const TagsSelection = ({ selectedTags, onChange }: TagsSelectionProps) => {
  // Function to toggle a tag
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onChange(selectedTags.filter(t => t !== tag));
    } else {
      onChange([...selectedTags, tag]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Label htmlFor="tags">Tags</Label>
        <Tag className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="flex flex-wrap gap-2">
        {AVAILABLE_TAGS.map(tag => (
          <Badge
            key={tag}
            variant={selectedTags.includes(tag) ? "default" : "outline"}
            className={`cursor-pointer ${
              selectedTags.includes(tag) 
                ? "bg-primary hover:bg-primary/90" 
                : "hover:bg-primary/10"
            }`}
            onClick={() => toggleTag(tag)}
          >
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
};
