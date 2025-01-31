import { Button } from "@/components/ui/button";
import { Plus, Ticket } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BugFormActionsProps {
  onSubmit: (e: React.FormEvent) => void;
}

export const BugFormActions = ({ onSubmit }: BugFormActionsProps) => {
  const { toast } = useToast();

  return (
    <div className="flex items-center gap-3">
      <Button type="submit" className="bg-primary text-white" onClick={onSubmit}>
        Submit
      </Button>
      <Button 
        type="button" 
        variant="outline"
        size="icon"
        onClick={() => {
          toast({
            title: "Coming soon",
            description: "This feature will be implemented soon.",
          });
        }}
      >
        <Plus className="w-4 h-4" />
      </Button>
      <Button 
        type="button" 
        variant="outline"
        size="icon"
        onClick={() => {
          toast({
            title: "Coming soon",
            description: "This feature will be implemented soon.",
          });
        }}
      >
        <Ticket className="w-4 h-4" />
      </Button>
    </div>
  );
};