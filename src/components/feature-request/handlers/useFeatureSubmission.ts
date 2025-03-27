
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
    isAnonymous: boolean;
    urgency?: string;
    attachment?: File;
  }) => {
    try {
      // Use "Anonymous" as the reporter name if isAnonymous is true
      const reporter = formData.isAnonymous ? "Anonymous" : EXPERIMENT_OWNERS[0];
      
      // Insert the feature into the database
      const { data, error } = await supabase
        .from('features')
        .insert([{
          title: formData.title,
          description: formData.description,
          product: formData.product,
          location: formData.location || null,
          reporter: reporter,
          votes: 0,
          urgency: formData.urgency || 'medium',
          tags: [] // Empty array as we removed squad selection
        }])
        .select()
        .single();

      if (error) {
        console.error('Error submitting feature:', error);
        throw error;
      }

      if (!data) {
        throw new Error('No data returned from feature submission');
      }

      // Create a properly typed feature object from the database response
      const newFeature: Feature = {
        id: data.id,
        title: data.title,
        description: data.description,
        status: data.status || 'new',
        product: data.product,
        location: typeof data.location === 'string' ? data.location : '',
        votes: data.votes || 0,
        comments: [],
        reporter: data.reporter,
        urgency: (data.urgency || 'medium') as "low" | "medium" | "high",
        created_at: data.created_at,
        updated_at: data.updated_at,
        squads: data.tags || [] // Convert tags from database to squads in UI
      };

      // Update the features state with the new feature
      setFeatures([...features, newFeature]);
      
      toast({
        title: "Feature submitted",
        description: "Your feature request has been saved successfully.",
      });

      return true;
    } catch (error) {
      console.error('Error submitting feature:', error);
      toast({
        title: "Error submitting feature",
        description: "Please try again later",
        variant: "destructive",
      });
      return false;
    }
  };

  return { handleFeatureSubmit };
};
