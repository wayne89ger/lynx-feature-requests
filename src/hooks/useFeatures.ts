
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
        const featureObj: Partial<Feature> = {
          id: feature.id,
          title: feature.title,
          description: feature.description,
          status: feature.status || 'new',
          product: feature.product,
          location: feature.location,
          votes: feature.votes || 0,
          reporter: feature.reporter,
          urgency: (feature.urgency || 'medium') as "low" | "medium" | "high",
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
          squads: feature.tags || [], // Convert tags to squads
        };
        
        // Use type assertion with any to safely access properties
        const anyFeature = feature as any;
        
        // Add optional properties using a safer approach
        if (anyFeature.hypothesis !== undefined && anyFeature.hypothesis !== null) {
          featureObj.hypothesis = String(anyFeature.hypothesis);
        }
        
        if (anyFeature.expected_outcome !== undefined && anyFeature.expected_outcome !== null) {
          featureObj.expected_outcome = String(anyFeature.expected_outcome);
          featureObj.expectedOutcome = String(anyFeature.expected_outcome); // Add both versions
        }
        
        if (anyFeature.type !== undefined && anyFeature.type !== null) {
          featureObj.type = String(anyFeature.type);
        }
        
        if (anyFeature.experiment_owner !== undefined && anyFeature.experiment_owner !== null) {
          featureObj.experiment_owner = String(anyFeature.experiment_owner);
          featureObj.experimentOwner = String(anyFeature.experiment_owner); // Add both versions
        }
        
        if (anyFeature.timeframe !== undefined && anyFeature.timeframe !== null) {
          featureObj.timeframe = String(anyFeature.timeframe);
        }
        
        if (anyFeature.metrics !== undefined && anyFeature.metrics !== null) {
          // Ensure metrics is an array of strings
          if (Array.isArray(anyFeature.metrics)) {
            featureObj.metrics = anyFeature.metrics.map(String);
          } else {
            featureObj.metrics = [];
          }
        }
        
        if (anyFeature.user_research !== undefined && anyFeature.user_research !== null) {
          featureObj.user_research = String(anyFeature.user_research);
          featureObj.userResearch = String(anyFeature.user_research); // Add both versions
        }
        
        if (anyFeature.mvp !== undefined && anyFeature.mvp !== null) {
          featureObj.mvp = String(anyFeature.mvp);
        }
        
        if (anyFeature.rice_score !== undefined && anyFeature.rice_score !== null) {
          // Only assign rice_score if it has the expected structure
          const riceScore = anyFeature.rice_score;
          if (typeof riceScore === 'object' && riceScore !== null) {
            featureObj.rice_score = {
              reach: typeof riceScore.reach === 'number' ? riceScore.reach : 1,
              impact: typeof riceScore.impact === 'number' ? riceScore.impact : 1,
              confidence: typeof riceScore.confidence === 'number' ? riceScore.confidence : 100,
              effort: typeof riceScore.effort === 'number' ? riceScore.effort : 1,
              total: typeof riceScore.total === 'number' ? riceScore.total : 0
            };
          }
        }
        
        if (anyFeature.current_situation !== undefined && anyFeature.current_situation !== null) {
          featureObj.current_situation = String(anyFeature.current_situation);
        }
        
        if (anyFeature.url !== undefined && anyFeature.url !== null) {
          featureObj.url = String(anyFeature.url);
        }
        
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
