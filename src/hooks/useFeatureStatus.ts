
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Feature } from "@/types/feature";

export const useFeatureStatus = (
  featureId: number, 
  initialStatus: Feature['status'],
  onStatusChange?: (id: number, newStatus: Feature['status']) => void
) => {
  const [currentStatus, setCurrentStatus] = useState(initialStatus);
  const { toast } = useToast();

  const handleStatusChange = async (newStatus: Feature['status']) => {
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
