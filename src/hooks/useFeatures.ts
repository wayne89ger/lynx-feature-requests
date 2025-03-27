
import { useState, useEffect } from "react";
import { Feature } from "@/types/feature";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useFeatures = () => {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [deletedFeatures, setDeletedFeatures] = useState<Feature[]>([]);
  const { toast } = useToast();

  const fetchFeatures = async () => {
    try {
      console.log('Fetching features...');
      // Fetch active features (not deleted)
      const { data: featuresData, error: featuresError } = await supabase
        .from('features')
        .select('*')
        .eq('deleted', false)
        .order('votes', { ascending: false });
      
      if (featuresError) {
        console.error('Error fetching features:', featuresError);
        throw featuresError;
      }

      console.log('Features data:', featuresData);

      // Fetch deleted features for the graveyard
      const { data: deletedFeaturesData, error: deletedFeaturesError } = await supabase
        .from('features')
        .select('*')
        .eq('deleted', true)
        .order('deleted_at', { ascending: false });
      
      if (deletedFeaturesError) {
        console.error('Error fetching deleted features:', deletedFeaturesError);
        throw deletedFeaturesError;
      }

      console.log('Deleted features data:', deletedFeaturesData);

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
      const processFeatures = (featureList: any[]) => featureList.map(feature => {
        // Create the base feature object with required properties
        const featureObj: Partial<Feature> = {
          id: feature.id,
          title: feature.title,
          description: feature.description,
          status: (feature.status || 'new') as "new" | "progress" | "completed" | "unresolvable",
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
          deleted: feature.deleted || false,
          deleted_at: feature.deleted_at || null,
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

      const featuresWithComments = processFeatures(featuresData || []);
      const deletedFeaturesWithComments = processFeatures(deletedFeaturesData || []);

      console.log('Features with comments:', featuresWithComments);
      console.log('Deleted features with comments:', deletedFeaturesWithComments);
      
      setFeatures(featuresWithComments);
      setDeletedFeatures(deletedFeaturesWithComments);
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
      const now = new Date().toISOString();
      
      // Mark the feature as deleted instead of actually deleting it
      const { error } = await supabase
        .from('features')
        .update({
          deleted: true,
          deleted_at: now
        })
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      const featureToDelete = features.find(feature => feature.id === id);
      if (featureToDelete) {
        // Remove from active features
        setFeatures(features.filter(feature => feature.id !== id));
        
        // Add to deleted features with deleted flag
        const deletedFeature = {
          ...featureToDelete,
          deleted: true,
          deleted_at: now
        };
        setDeletedFeatures([deletedFeature, ...deletedFeatures]);
      }
      
      toast({
        title: "Feature moved to graveyard",
        description: "The feature request has been moved to the graveyard.",
      });
      return true;
    } catch (error) {
      console.error('Error deleting feature:', error);
      toast({
        title: "Error moving feature to graveyard",
        description: "Please try again later",
        variant: "destructive",
      });
      return false;
    }
  };

  const restoreFeature = async (id: number) => {
    try {
      // Mark the feature as not deleted
      const { error } = await supabase
        .from('features')
        .update({
          deleted: false,
          deleted_at: null
        })
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      const featureToRestore = deletedFeatures.find(feature => feature.id === id);
      if (featureToRestore) {
        // Remove from deleted features
        setDeletedFeatures(deletedFeatures.filter(feature => feature.id !== id));
        
        // Add to active features
        const restoredFeature = {
          ...featureToRestore,
          deleted: false,
          deleted_at: null
        };
        setFeatures([...features, restoredFeature]);
      }
      
      toast({
        title: "Feature restored",
        description: "The feature request has been restored from the graveyard.",
      });
      return true;
    } catch (error) {
      console.error('Error restoring feature:', error);
      toast({
        title: "Error restoring feature",
        description: "Please try again later",
        variant: "destructive",
      });
      return false;
    }
  };

  const permanentlyDeleteFeature = async (id: number) => {
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
      setDeletedFeatures(deletedFeatures.filter(feature => feature.id !== id));
      
      toast({
        title: "Feature permanently deleted",
        description: "The feature request has been permanently deleted.",
      });
      return true;
    } catch (error) {
      console.error('Error permanently deleting feature:', error);
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

  return { 
    features, 
    deletedFeatures, 
    setFeatures, 
    fetchFeatures, 
    deleteFeature, 
    restoreFeature,
    permanentlyDeleteFeature
  };
};
