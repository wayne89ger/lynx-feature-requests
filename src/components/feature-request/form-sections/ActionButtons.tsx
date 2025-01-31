import { Button } from "@/components/ui/button";
import { Bookmark, FileText } from "lucide-react";

interface ActionButtonsProps {
  onSubmit: () => void;
  onShortcutAction: () => void;
  onConfluenceAction: () => void;
  hasShortcutStory: boolean;
  hasConfluenceDoc: boolean;
}

export const ActionButtons = ({
  onSubmit,
  onShortcutAction,
  onConfluenceAction,
  hasShortcutStory,
  hasConfluenceDoc,
}: ActionButtonsProps) => {
  return (
    <div className="flex gap-2">
      <Button onClick={onSubmit} className="flex-1">
        Save Changes
      </Button>
      <Button onClick={onShortcutAction} variant="outline" className="gap-2">
        <Bookmark className="w-4 h-4" />
        {hasShortcutStory ? "Sync with Shortcut" : "Add to Shortcut Story"}
      </Button>
      <Button onClick={onConfluenceAction} variant="outline" className="gap-2">
        <FileText className="w-4 h-4" />
        {hasConfluenceDoc ? "Sync with Confluence" : "Add to Confluence"}
      </Button>
    </div>
  );
};