
import { Feature } from "@/types/feature";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useFeatureUpdate = (features: Feature[], setFeatures: (features: Feature[]) => void) => {
  const { toast } = useToast();

  const handleFeatureUpdate = async (id: number, updatedFeature: any) => {
    try {
      console.log('Updating feature with id:', id, 'Updated data:', updatedFeature);
      
      // Filter out fields that don't exist in the database
      const {
        title,
        description,
        status,
        product,
        location,
        squad,
        urgency,
        votes,
        tags,
        expected_outcome,
        experiment_owner,
        user_research,
        hypothesis,
        timeframe,
        metrics,
        mvp,
        rice_score,
        current_situation,
        url
      } = updatedFeature;
      
      // Create an object with only the fields that exist in the database
      const dataToUpdate: any = {
        title,
        description,
        status,
        product,
        location,
        urgency,
      };
      
      // Add optional fields if they exist
      if (expected_outcome !== undefined) dataToUpdate.expected_outcome = expected_outcome;
      if (experiment_owner !== undefined) dataToUpdate.experiment_owner = experiment_owner;
      if (user_research !== undefined) dataToUpdate.user_research = user_research;
      if (hypothesis !== undefined) dataToUpdate.hypothesis = hypothesis;
      if (timeframe !== undefined) dataToUpdate.timeframe = timeframe;
      if (metrics !== undefined) dataToUpdate.metrics = metrics;
      if (mvp !== undefined) dataToUpdate.mvp = mvp;
      if (rice_score !== undefined) dataToUpdate.rice_score = rice_score;
      if (current_situation !== undefined) dataToUpdate.current_situation = current_situation;
      if (url !== undefined) dataToUpdate.url = url;
      
      // If votes are provided, include them
      if (typeof votes !== 'undefined') {
        dataToUpdate.votes = votes;
      }
      
      // Handle squads as tags
      if (squad) {
        dataToUpdate.tags = [squad];
      } else if (updatedFeature.squads && updatedFeature.squads.length > 0) {
        dataToUpdate.tags = updatedFeature.squads;
      }
      
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
      
      // Create updated feature object with appropriate type handling
      const updatedFeatureWithComments: Feature = {
        ...existingFeature,
        title: data.title,
        description: data.description,
        status: (data.status || 'new') as "new" | "progress" | "completed",
        product: data.product,
        location: data.location || '',
        votes: data.votes || 0,
        reporter: data.reporter,
        urgency: (data.urgency || 'medium') as "low" | "medium" | "high",
        updated_at: data.updated_at,
        squads: data.tags || [], // Convert tags from database to squads in UI
      };

      // Add optional fields if they exist in the data
      if (data.expected_outcome) {
        updatedFeatureWithComments.expected_outcome = data.expected_outcome;
        updatedFeatureWithComments.expectedOutcome = data.expected_outcome;
      }
      
      if (data.experiment_owner) {
        updatedFeatureWithComments.experiment_owner = data.experiment_owner;
        updatedFeatureWithComments.experimentOwner = data.experiment_owner;
      }
      
      if (data.user_research) {
        updatedFeatureWithComments.user_research = data.user_research;
        updatedFeatureWithComments.userResearch = data.user_research;
      }
      
      if (data.hypothesis) updatedFeatureWithComments.hypothesis = data.hypothesis;
      if (data.timeframe) updatedFeatureWithComments.timeframe = data.timeframe;
      if (data.metrics) updatedFeatureWithComments.metrics = data.metrics;
      if (data.mvp) updatedFeatureWithComments.mvp = data.mvp;
      if (data.rice_score) updatedFeatureWithComments.rice_score = data.rice_score;
      if (data.current_situation) updatedFeatureWithComments.current_situation = data.current_situation;
      if (data.url) updatedFeatureWithComments.url = data.url;

      // Extract the first tag as the squad if available
      if (data.tags && data.tags.length > 0) {
        updatedFeatureWithComments.squad = data.tags[0];
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
