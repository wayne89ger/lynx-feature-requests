
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UseFeatureVotingProps {
  featureId: number;
  initialVotes: number;
  reporter: string;
  initialVoteStatus: 'none' | 'up' | 'down';
}

export const useFeatureVoting = ({ 
  featureId, 
  initialVotes, 
  reporter, 
  initialVoteStatus 
}: UseFeatureVotingProps) => {
  const [currentVotes, setCurrentVotes] = useState(initialVotes);
  const [voteStatus, setVoteStatus] = useState(initialVoteStatus);
  const [upvotes, setUpvotes] = useState(0);
  const [downvotes, setDownvotes] = useState(0);
  const { toast } = useToast();

  const fetchVoteCounts = async () => {
    try {
      const { data: upvotesData, error: upvotesError } = await supabase
        .from('feature_votes')
        .select('*')
        .eq('feature_id', featureId)
        .eq('vote_type', 'up');

      const { data: downvotesData, error: downvotesError } = await supabase
        .from('feature_votes')
        .select('*')
        .eq('feature_id', featureId)
        .eq('vote_type', 'down');

      if (upvotesError || downvotesError) {
        console.error('Error fetching vote counts:', upvotesError || downvotesError);
        return;
      }

      setUpvotes(upvotesData?.length || 0);
      setDownvotes(downvotesData?.length || 0);
    } catch (error) {
      console.error('Error in fetchVoteCounts:', error);
    }
  };

  const handleVote = async (direction: 'up' | 'down') => {
    try {
      // Check if user already voted this way
      if (voteStatus === direction) {
        // Remove the vote
        const { error: deleteError } = await supabase
          .from('feature_votes')
          .delete()
          .eq('feature_id', featureId)
          .eq('reporter', reporter);

        if (deleteError) throw deleteError;

        // Update feature record
        const voteChange = direction === 'up' ? -1 : 1;
        const { data, error: updateError } = await supabase
          .from('features')
          .update({ votes: currentVotes + voteChange })
          .eq('id', featureId)
          .select()
          .single();

        if (updateError) throw updateError;

        setCurrentVotes(data.votes);
        setVoteStatus('none');
        
        if (direction === 'up') {
          setUpvotes(prev => Math.max(0, prev - 1));
        } else {
          setDownvotes(prev => Math.max(0, prev - 1));
        }
        
        toast({
          title: "Vote removed",
          description: "Your vote has been removed.",
        });
        return;
      }

      // If user already voted but in the other direction
      if (voteStatus !== 'none') {
        // Remove the existing vote
        const { error: deleteError } = await supabase
          .from('feature_votes')
          .delete()
          .eq('feature_id', featureId)
          .eq('reporter', reporter);

        if (deleteError) throw deleteError;

        // Adjust vote count for removing previous vote
        if (voteStatus === 'up') {
          setUpvotes(prev => Math.max(0, prev - 1));
        } else {
          setDownvotes(prev => Math.max(0, prev - 1));
        }
      }

      // Add the new vote
      const { error: insertError } = await supabase
        .from('feature_votes')
        .insert([{
          feature_id: featureId,
          reporter: reporter,
          vote_type: direction
        }]);

      if (insertError) throw insertError;

      // Calculate new vote total
      let newVoteTotal;
      if (voteStatus === 'none') {
        // No previous vote, simply add or subtract 1
        newVoteTotal = currentVotes + (direction === 'up' ? 1 : -1);
      } else {
        // Had previous vote in opposite direction, need to add or subtract 2
        newVoteTotal = currentVotes + (direction === 'up' ? 2 : -2);
      }

      // Update feature record
      const { data, error: updateError } = await supabase
        .from('features')
        .update({ votes: newVoteTotal })
        .eq('id', featureId)
        .select()
        .single();

      if (updateError) throw updateError;

      setCurrentVotes(data.votes);
      setVoteStatus(direction);
      
      if (direction === 'up') {
        setUpvotes(prev => prev + 1);
      } else {
        setDownvotes(prev => prev + 1);
      }
      
      toast({
        title: "Vote recorded",
        description: `You ${direction === 'up' ? 'upvoted' : 'downvoted'} this feature request.`,
      });
    } catch (error) {
      console.error('Error updating votes:', error);
      toast({
        title: "Error recording vote",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  return {
    currentVotes,
    voteStatus,
    upvotes,
    downvotes,
    fetchVoteCounts,
    handleVote
  };
};
