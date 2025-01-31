import { Button } from "@/components/ui/button";
import { Plus, Ticket } from "lucide-react";

interface EditBugFormActionsProps {
  onSubmit: (e: React.FormEvent) => void;
  onShortcut: () => void;
  onITopTicket: () => void;
}

export const EditBugFormActions = ({
  onSubmit,
  onShortcut,
  onITopTicket,
}: EditBugFormActionsProps) => {
  return (
    <div className="flex items-center gap-3">
      <Button type="submit" className="bg-primary text-white" onClick={onSubmit}>
        Save changes
      </Button>
      <Button 
        type="button" 
        variant="outline"
        onClick={onShortcut}
        className="gap-2"
      >
        <Plus className="w-4 h-4" />
        Shortcut
      </Button>
      <Button 
        type="button" 
        variant="outline"
        onClick={onITopTicket}
        className="gap-2"
      >
        <Ticket className="w-4 h-4" />
        iTop
      </Button>
    </div>
  );
};