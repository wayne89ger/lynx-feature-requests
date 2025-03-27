
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface BugHeaderProps {
  id: number;
  status: "new" | "progress" | "completed" | "unresolvable";
  product: string;
}

const statusConfig = {
  new: { 
    label: "New", 
    mobileLabel: "New",
    bg: "bg-status-new", 
    text: "text-status-new-text" 
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
    bg: "bg-green-100", 
    text: "text-green-700" 
  },
  unresolvable: {
    label: "Unresolvable",
    mobileLabel: "Unresolv",
    bg: "bg-gray-300",
    text: "text-gray-700"
  }
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
  // Ensure we have a valid status
  const validStatus = (status && statusConfig[status]) ? status : "new";
  
  const handleStatusChange = async (newStatus: "new" | "progress" | "completed" | "unresolvable") => {
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
      <Select value={validStatus} onValueChange={handleStatusChange}>
        <SelectTrigger className={cn(
          "h-8 text-xs font-medium px-2.5 py-0.5 rounded-full w-auto",
          statusConfig[validStatus].bg,
          statusConfig[validStatus].text
        )}>
          <SelectValue>
            <span className="hidden sm:inline">{statusConfig[validStatus].label}</span>
            <span className="sm:hidden">{statusConfig[validStatus].mobileLabel}</span>
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
            {productLabels[product as keyof typeof productLabels]?.full || product}
          </span>
          <span className="sm:hidden">
            {productLabels[product as keyof typeof productLabels]?.mobile || product}
          </span>
        </span>
      )}
    </div>
  );
};
