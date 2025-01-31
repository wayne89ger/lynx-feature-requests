import { Feature } from "@/types/feature";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useFeatureUpdate = (features: Feature[], setFeatures: (features: Feature[]) => void) => {
  const { toast } = useToast();

  const handleFeatureUpdate = async (id: number, updatedFeature: any) => {
    try {
      const { data, error } = await supabase
        .from('features')
        .update({
          title: updatedFeature.title,
          description: updatedFeature.description,
          product: updatedFeature.product,
          location: updatedFeature.location,
          status: updatedFeature.status,
          experiment_owner: updatedFeature.experimentOwner
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const existingFeature = features.find(f => f.id === id);
      const updatedFeatureWithComments: Feature = {
        ...data,
        comments: existingFeature?.comments || []
      };

      setFeatures(features.map(f => f.id === id ? updatedFeatureWithComments : f));
      toast({
        title: "Feature updated",
        description: "Your changes have been saved successfully.",
      });

      return true;
    } catch (error) {
      console.error('Error updating feature:', error);
      toast({
        title: "Error updating feature",
        description: "Please try again later",
        variant: "destructive",
      });
      return false;
    }
  };

  return { handleFeatureUpdate };
};