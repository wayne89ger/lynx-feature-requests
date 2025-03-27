
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type FeatureStatus = "new" | "progress" | "completed" | "unresolvable";

export const useFeatureStatus = (
  featureId: number, 
  initialStatus: FeatureStatus,
  onStatusChange?: (id: number, newStatus: FeatureStatus) => void
) => {
  const [currentStatus, setCurrentStatus] = useState(initialStatus);
  const { toast } = useToast();

  const handleStatusChange = async (newStatus: FeatureStatus) => {
    try {
      const { error } = await supabase
        .from('features')
        .update({ status: newStatus })
        .eq('id', featureId);

      if (error) throw error;
      
      setCurrentStatus(newStatus);
      
      if (onStatusChange) {
        onStatusChange(featureId, newStatus);
      }
      
      toast({
        title: "Status updated",
        description: `Status changed to ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error updating status",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  return {
    currentStatus,
    handleStatusChange
  };
};
