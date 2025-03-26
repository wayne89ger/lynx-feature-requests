
import { useState, useEffect } from "react";
import { Feature } from "@/types/feature";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useFeatures = () => {
  const [features, setFeatures] = useState<Feature[]>([]);
  const { toast } = useToast();

  const fetchFeatures = async () => {
    try {
      console.log('Fetching features...');
      const { data: featuresData, error: featuresError } = await supabase
        .from('features')
        .select('*')
        .order('votes', { ascending: false });
      
      if (featuresError) {
        console.error('Error fetching features:', featuresError);
        throw featuresError;
      }

      console.log('Features data:', featuresData);

      // Then fetch all comments
      const { data: commentsData, error: commentsError } = await supabase
        .from('comments')
        .select('*');

      if (commentsError) {
        console.error('Error fetching comments:', commentsError);
        throw commentsError;
      }

      console.log('Comments data:', commentsData);

      // Map comments to features
      const featuresWithComments = (featuresData || []).map(feature => {
        // Create the base feature object with required properties
        const featureObj: any = {
          id: feature.id,
          title: feature.title,
          description: feature.description,
          status: feature.status || 'new',
          product: feature.product,
          location: feature.location,
          votes: feature.votes || 0,
          reporter: feature.reporter,
          urgency: (feature.urgency || 'medium') as "low" | "medium" | "high",
          experimentOwner: feature.experiment_owner,
          comments: commentsData
            ?.filter(comment => comment.feature_id === feature.id)
            ?.map(comment => ({
              id: comment.id,
              text: comment.text,
              timestamp: comment.created_at,
              reporter: comment.reporter,
              attachment: comment.attachment
            })) || [],
          created_at: feature.created_at || new Date().toISOString(),
          updated_at: feature.updated_at || new Date().toISOString(),
          tags: feature.tags || [],
        };
        
        // Add optional properties only if they exist in the API response
        if (feature.hypothesis) featureObj.hypothesis = feature.hypothesis;
        if (feature.expected_outcome) featureObj.expected_outcome = feature.expected_outcome;
        if (feature.type) featureObj.type = feature.type;
        if (feature.experiment_owner) featureObj.experiment_owner = feature.experiment_owner;
        if (feature.timeframe) featureObj.timeframe = feature.timeframe;
        if (feature.metrics) featureObj.metrics = feature.metrics;
        if (feature.user_research) featureObj.user_research = feature.user_research;
        if (feature.mvp) featureObj.mvp = feature.mvp;
        if (feature.rice_score) featureObj.rice_score = feature.rice_score;
        
        return featureObj as Feature;
      });

      console.log('Features with comments:', featuresWithComments);
      setFeatures(featuresWithComments);
    } catch (error) {
      console.error('Error in useFeatures:', error);
      toast({
        title: "Error fetching features",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const deleteFeature = async (id: number) => {
    try {
      // First delete any votes related to this feature
      await supabase
        .from('feature_votes')
        .delete()
        .eq('feature_id', id);
      
      // Then delete any comments related to this feature
      await supabase
        .from('comments')
        .delete()
        .eq('feature_id', id);
      
      // Finally delete the feature itself
      const { error } = await supabase
        .from('features')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setFeatures(features.filter(feature => feature.id !== id));
      
      toast({
        title: "Feature deleted",
        description: "The feature request has been successfully deleted.",
      });
      return true;
    } catch (error) {
      console.error('Error deleting feature:', error);
      toast({
        title: "Error deleting feature",
        description: "Please try again later",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchFeatures();
  }, []);

  return { features, setFeatures, fetchFeatures, deleteFeature };
};
