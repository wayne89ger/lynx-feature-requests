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
      const featuresWithComments = (featuresData || []).map(feature => ({
        id: feature.id,
        title: feature.title,
        description: feature.description,
        status: feature.status || 'new',
        product: feature.product,
        location: feature.location,
        votes: feature.votes || 0,
        reporter: feature.reporter,
        experimentOwner: feature.experiment_owner,
        comments: commentsData
          ?.filter(comment => comment.feature_id === feature.id)
          ?.map(comment => ({
            id: comment.id,
            text: comment.text,
            timestamp: comment.created_at,
            reporter: comment.reporter
          })) || [],
        created_at: feature.created_at,
        updated_at: feature.updated_at
      })) as Feature[];

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

  useEffect(() => {
    fetchFeatures();
  }, []);

  return { features, setFeatures, fetchFeatures };
};