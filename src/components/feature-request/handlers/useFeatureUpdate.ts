
import { Feature } from "@/types/feature";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useFeatureUpdate = (features: Feature[], setFeatures: (features: Feature[]) => void) => {
  const { toast } = useToast();

  const handleFeatureUpdate = async (id: number, updatedFeature: any) => {
    try {
      console.log('Updating feature with id:', id, 'Updated data:', updatedFeature);
      
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

      if (error) {
        console.error('Supabase update error:', error);
        throw error;
      }

      console.log('Supabase update success, received data:', data);

      const existingFeature = features.find(f => f.id === id);
      if (!existingFeature) {
        console.error('Could not find existing feature with id:', id);
        throw new Error('Feature not found');
      }
      
      const updatedFeatureWithComments: Feature = {
        ...data,
        comments: existingFeature?.comments || []
      };

      // Update the features state
      const updatedFeatures = features.map(f => 
        f.id === id ? updatedFeatureWithComments : f
      );
      
      console.log('Setting updated features:', updatedFeatures);
      setFeatures(updatedFeatures);
      
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

  // Add a new function to handle status updates
  const handleStatusUpdate = async (id: number, newStatus: Feature['status']) => {
    try {
      console.log('Updating status of feature with id:', id, 'New status:', newStatus);
      
      const { data, error } = await supabase
        .from('features')
        .update({ status: newStatus })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Supabase status update error:', error);
        throw error;
      }

      console.log('Supabase status update success, received data:', data);

      const existingFeature = features.find(f => f.id === id);
      if (!existingFeature) {
        console.error('Could not find existing feature with id:', id);
        throw new Error('Feature not found');
      }
      
      const updatedFeatureWithComments: Feature = {
        ...data,
        comments: existingFeature?.comments || []
      };

      // Update the features state
      const updatedFeatures = features.map(f => 
        f.id === id ? updatedFeatureWithComments : f
      );
      
      console.log('Setting updated features after status change:', updatedFeatures);
      setFeatures(updatedFeatures);

      return true;
    } catch (error) {
      console.error('Error updating feature status:', error);
      return false;
    }
  };

  return { handleFeatureUpdate, handleStatusUpdate };
};
