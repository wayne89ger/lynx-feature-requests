
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useVoteStatus = (featureId: number, reporter: string) => {
  const [voteStatus, setVoteStatus] = useState<'none' | 'up' | 'down'>('none');
  const [upvoteCount, setUpvoteCount] = useState(0);
  const [downvoteCount, setDownvoteCount] = useState(0);

  useEffect(() => {
    const fetchVoteData = async () => {
      try {
        // Check user's vote status
        const { data: voteData, error } = await supabase
          .from('feature_votes')
          .select('vote_type')
          .eq('feature_id', featureId)
          .eq('reporter', reporter)
          .maybeSingle();

        if (error) {
          console.error('Error checking vote status:', error);
          return;
        }

        if (voteData) {
          setVoteStatus(voteData.vote_type);
        }

        // Get upvotes count
        const { count: upvotes, error: upvotesError } = await supabase
          .from('feature_votes')
          .select('*', { count: 'exact', head: true })
          .eq('feature_id', featureId)
          .eq('vote_type', 'up');

        if (upvotesError) {
          console.error('Error fetching upvotes count:', upvotesError);
        } else {
          setUpvoteCount(upvotes || 0);
        }

        // Get downvotes count
        const { count: downvotes, error: downvotesError } = await supabase
          .from('feature_votes')
          .select('*', { count: 'exact', head: true })
          .eq('feature_id', featureId)
          .eq('vote_type', 'down');

        if (downvotesError) {
          console.error('Error fetching downvotes count:', downvotesError);
        } else {
          setDownvoteCount(downvotes || 0);
        }
      } catch (error) {
        console.error('Error in fetchVoteData:', error);
      }
    };

    fetchVoteData();
  }, [featureId, reporter]);

  return { 
    voteStatus, 
    setVoteStatus,
    upvoteCount,
    downvoteCount
  };
};
