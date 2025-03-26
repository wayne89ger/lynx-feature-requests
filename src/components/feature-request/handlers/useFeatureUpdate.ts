
import { Feature } from "@/types/feature";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useFeatureUpdate = (features: Feature[], setFeatures: (features: Feature[]) => void) => {
  const { toast } = useToast();

  const handleFeatureUpdate = async (id: number, updatedFeature: any) => {
    try {
      console.log('Updating feature with id:', id, 'Updated data:', updatedFeature);
      
      // Convert squads to tags for the database update (since database still uses tags)
      const dataToUpdate = {
        ...updatedFeature,
        tags: updatedFeature.squads,  // Convert squads to tags for database
      };
      
      // Remove squads from the data sent to the database
      delete dataToUpdate.squads;
      
      const { data, error } = await supabase
        .from('features')
        .update(dataToUpdate)
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
      
      // Use the 'as any' approach to safely handle unknown fields from the API
      const anyData = data as any;
      const updatedFeatureWithComments: Feature = {
        id: anyData.id,
        title: anyData.title,
        description: anyData.description,
        status: (anyData.status || 'new') as Feature['status'],
        product: anyData.product,
        location: anyData.location || '',
        votes: anyData.votes || 0,
        reporter: anyData.reporter,
        urgency: (anyData.urgency || 'medium') as "low" | "medium" | "high",
        comments: existingFeature?.comments || [],
        created_at: anyData.created_at || new Date().toISOString(),
        updated_at: anyData.updated_at || new Date().toISOString(),
        squads: anyData.tags || [], // Convert tags from database to squads in UI
      };

      // Add optional fields if they exist in the response
      if (anyData.hypothesis !== undefined) {
        updatedFeatureWithComments.hypothesis = String(anyData.hypothesis);
      }
      
      if (anyData.expected_outcome !== undefined) {
        updatedFeatureWithComments.expected_outcome = String(anyData.expected_outcome);
      }
      
      if (anyData.type !== undefined) {
        updatedFeatureWithComments.type = String(anyData.type);
      }
      
      if (anyData.experiment_owner !== undefined) {
        updatedFeatureWithComments.experiment_owner = String(anyData.experiment_owner);
      }
      
      if (anyData.timeframe !== undefined) {
        updatedFeatureWithComments.timeframe = String(anyData.timeframe);
      }
      
      if (anyData.metrics !== undefined && Array.isArray(anyData.metrics)) {
        updatedFeatureWithComments.metrics = anyData.metrics.map(String);
      }
      
      if (anyData.user_research !== undefined) {
        updatedFeatureWithComments.user_research = String(anyData.user_research);
      }
      
      if (anyData.mvp !== undefined) {
        updatedFeatureWithComments.mvp = String(anyData.mvp);
      }
      
      if (anyData.rice_score !== undefined && typeof anyData.rice_score === 'object') {
        updatedFeatureWithComments.rice_score = {
          reach: typeof anyData.rice_score.reach === 'number' ? anyData.rice_score.reach : 1,
          impact: typeof anyData.rice_score.impact === 'number' ? anyData.rice_score.impact : 1,
          confidence: typeof anyData.rice_score.confidence === 'number' ? anyData.rice_score.confidence : 100,
          effort: typeof anyData.rice_score.effort === 'number' ? anyData.rice_score.effort : 1,
          total: typeof anyData.rice_score.total === 'number' ? anyData.rice_score.total : 0
        };
      }

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
      
      // Update only the status field for this feature
      const updatedFeatureWithComments: Feature = {
        ...existingFeature,
        status: newStatus
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
