import { useState, useEffect } from "react";
import { Feature } from "@/types/feature";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useFeatures = () => {
  const [features, setFeatures] = useState<Feature[]>([]);
  const { toast } = useToast();

  const fetchFeatures = async () => {
    try {
      const { data: featuresData, error: featuresError } = await supabase
        .from('features')
        .select('*');
      
      if (featuresError) throw featuresError;

      const { data: commentsData, error: commentsError } = await supabase
        .from('comments')
        .select('*');

      if (commentsError) throw commentsError;

      const featuresWithComments = featuresData?.map(feature => ({
        ...feature,
        comments: commentsData
          ?.filter(comment => comment.feature_id === feature.id)
          ?.map(comment => ({
            id: comment.id,
            text: comment.text,
            timestamp: comment.created_at,
            reporter: comment.reporter
          })) || []
      })) as Feature[];

      setFeatures(featuresWithComments || []);
    } catch (error) {
      console.error('Error fetching features:', error);
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