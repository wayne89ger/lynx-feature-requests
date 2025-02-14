
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useVoteStatus = (featureId: number, reporter: string) => {
  const [voteStatus, setVoteStatus] = useState<'none' | 'up' | 'down'>('none');

  useEffect(() => {
    const checkVoteStatus = async () => {
      try {
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
      } catch (error) {
        console.error('Error checking vote status:', error);
      }
    };

    checkVoteStatus();
  }, [featureId, reporter]);

  return { voteStatus, setVoteStatus };
};
