import { Feature } from "@/types/feature";
import { supabase } from "@/integrations/supabase/client";
import { EXPERIMENT_OWNERS } from "@/constants/experimentOwners";
import { useToast } from "@/hooks/use-toast";

export const useFeatureSubmission = (features: Feature[], setFeatures: (features: Feature[]) => void) => {
  const { toast } = useToast();

  const handleFeatureSubmit = async (formData: {
    title: string;
    description: string;
    product: string;
    location?: string;
    canContact: boolean;
    attachment?: File;
  }) => {
    try {
      const { data, error } = await supabase
        .from('features')
        .insert([{
          title: formData.title,
          description: formData.description,
          product: formData.product,
          location: formData.location,
          reporter: EXPERIMENT_OWNERS[0],
          votes: 0
        }])
        .select()
        .single();

      if (error) throw error;

      const newFeature: Feature = {
        ...data,
        comments: []
      };

      setFeatures([...features, newFeature]);
      toast({
        title: "Feature submitted",
        description: "Your feature request has been saved successfully.",
      });
    } catch (error) {
      console.error('Error submitting feature:', error);
      toast({
        title: "Error submitting feature",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  return { handleFeatureSubmit };
};