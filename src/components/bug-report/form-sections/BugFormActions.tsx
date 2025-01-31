import { Button } from "@/components/ui/button";
import { Plus, Ticket } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BugFormActionsProps {
  onSubmit: (e: React.FormEvent) => void;
}

export const BugFormActions = ({ onSubmit }: BugFormActionsProps) => {
  const { toast } = useToast();

  return (
    <div className="flex gap-2">
      <Button type="submit" className="flex-1" onClick={onSubmit}>
        Submit
      </Button>
      <Button 
        type="button" 
        variant="outline"
        onClick={() => {
          toast({
            title: "Coming soon",
            description: "This feature will be implemented soon.",
          });
        }}
      >
        <Plus className="w-4 h-4 mr-2" />
        Create story in shortcut
      </Button>
      <Button 
        type="button" 
        variant="outline"
        onClick={() => {
          toast({
            title: "Coming soon",
            description: "This feature will be implemented soon.",
          });
        }}
      >
        <Ticket className="w-4 h-4 mr-2" />
        Create itop ticket
      </Button>
    </div>
  );
};