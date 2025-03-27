
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface BugHeaderProps {
  id: number; // Added id prop
  status: "new" | "review" | "progress" | "completed";
  product: string;
}

const statusConfig = {
  new: { 
    label: "New", 
    mobileLabel: "New",
    bg: "bg-status-new", 
    text: "text-status-new-text" 
  },
  review: { 
    label: "Under Review", 
    mobileLabel: "Review",
    bg: "bg-status-review", 
    text: "text-status-review-text" 
  },
  progress: { 
    label: "In Progress", 
    mobileLabel: "Progress",
    bg: "bg-status-progress", 
    text: "text-status-progress-text" 
  },
  completed: { 
    label: "Completed", 
    mobileLabel: "Done",
    bg: "bg-status-completed", 
    text: "text-status-completed-text" 
  },
};

const productLabels = {
  "website-demand-capture": {
    full: "Website / Demand Capture",
    mobile: "Website"
  },
  "dof-onboarding": {
    full: "DOF / Onboarding",
    mobile: "DOF"
  },
  "lynx-plus": {
    full: "LYNX+ / Client Experience",
    mobile: "LYNX+"
  }
};

export const BugHeader = ({ id, status, product }: BugHeaderProps) => {
  const handleStatusChange = async (newStatus: "new" | "review" | "progress" | "completed") => {
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { toast } = await import("@/hooks/use-toast");
      
      const { error } = await supabase
        .from('bugs')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Status updated",
        description: `Status changed to ${statusConfig[newStatus].label}`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      const { toast } = await import("@/hooks/use-toast");
      toast({
        title: "Error updating status",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Select value={status} onValueChange={handleStatusChange}>
        <SelectTrigger className={cn(
          "h-8 text-xs font-medium px-2.5 py-0.5 rounded-full w-auto",
          statusConfig[status].bg,
          statusConfig[status].text
        )}>
          <SelectValue>
            <span className="hidden sm:inline">{statusConfig[status].label}</span>
            <span className="sm:hidden">{statusConfig[status].mobileLabel}</span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {Object.entries(statusConfig).map(([key, config]) => (
            <SelectItem key={key} value={key}>
              {config.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {product && (
        <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600">
          <span className="hidden sm:inline">
            {productLabels[product as keyof typeof productLabels]?.full}
          </span>
          <span className="sm:hidden">
            {productLabels[product as keyof typeof productLabels]?.mobile}
          </span>
        </span>
      )}
    </div>
  );
};
