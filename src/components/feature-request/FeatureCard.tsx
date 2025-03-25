import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, Paperclip } from "lucide-react";
import { Feature } from "@/types/feature";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useVoteStatus } from "@/hooks/useVoteStatus";
import { FeatureHeader } from "./components/FeatureHeader";
import { VotingSection } from "./components/VotingSection";
import { CommentsSection } from "./components/CommentsSection";

interface FeatureCardProps extends Feature {
  onStatusChange?: (id: number, newStatus: "new" | "review" | "progress" | "completed") => void;
  onAddComment?: (id: number, text: string) => void;
  onEdit?: (feature: Feature) => void;
  onDelete?: (id: number) => void;
  className?: string;
}

export const FeatureCard = ({
  id,
  title,
  description,
  status = "new",
  product,
  location,
  votes,
  comments,
  attachment,
  reporter,
  experimentOwner,
  onStatusChange,
  onAddComment,
  onEdit,
  onDelete,
  className = "",
}: FeatureCardProps) => {
  const [currentVotes, setCurrentVotes] = useState(votes);
  const [upvotes, setUpvotes] = useState(0);
  const [downvotes, setDownvotes] = useState(0);
  const [currentStatus, setCurrentStatus] = useState(status);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const { toast } = useToast();
  const { voteStatus, setVoteStatus } = useVoteStatus(id, reporter);

  const fetchVoteCounts = async () => {
    try {
      const { data: upvotesData, error: upvotesError } = await supabase
        .from('feature_votes')
        .select('count')
        .eq('feature_id', id)
        .eq('vote_type', 'up')
        .count();

      const { data: downvotesData, error: downvotesError } = await supabase
        .from('feature_votes')
        .select('count')
        .eq('feature_id', id)
        .eq('vote_type', 'down')
        .count();

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

  const handleStatusChange = async (newStatus: "new" | "review" | "progress" | "completed") => {
    try {
      const { error } = await supabase
        .from('features')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      
      setCurrentStatus(newStatus);
      
      if (onStatusChange) {
        onStatusChange(id, newStatus);
      }
      
      toast({
        title: "Status updated",
        description: `Status changed to ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error updating status",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      toast({
        title: "Error",
        description: "Please enter a comment",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('comments')
        .insert([{
          feature_id: id,
          text: newComment.trim(),
          reporter: reporter
        }])
        .select()
        .single();

      if (error) throw error;

      onAddComment?.(id, newComment);
      setNewComment("");
      
      toast({
        title: "Comment added",
        description: "Your comment has been added successfully.",
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error adding comment",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const handleVote = async (direction: 'up' | 'down') => {
    try {
      if (voteStatus === direction) {
        const { error: deleteError } = await supabase
          .from('feature_votes')
          .delete()
          .eq('feature_id', id)
          .eq('reporter', reporter);

        if (deleteError) throw deleteError;

        const { data, error: updateError } = await supabase
          .from('features')
          .update({ votes: currentVotes - (direction === 'up' ? 1 : -1) })
          .eq('id', id)
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

      if (voteStatus !== 'none') {
        const { error: deleteError } = await supabase
          .from('feature_votes')
          .delete()
          .eq('feature_id', id)
          .eq('reporter', reporter);

        if (deleteError) throw deleteError;

        const voteAdjustment = voteStatus === 'up' ? -1 : 1;
        await supabase
          .from('features')
          .update({ votes: currentVotes + voteAdjustment })
          .eq('id', id);
          
        if (voteStatus === 'up') {
          setUpvotes(prev => Math.max(0, prev - 1));
        } else {
          setDownvotes(prev => Math.max(0, prev - 1));
        }
      }

      const { error: insertError } = await supabase
        .from('feature_votes')
        .insert([{
          feature_id: id,
          reporter: reporter,
          vote_type: direction
        }]);

      if (insertError) throw insertError;

      const voteChange = direction === 'up' ? 1 : -1;
      const { data, error: updateError } = await supabase
        .from('features')
        .update({ 
          votes: currentVotes + voteChange + (voteStatus !== 'none' ? (voteStatus === 'up' ? -1 : 1) : 0)
        })
        .eq('id', id)
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

  const handleDelete = () => {
    if (onDelete) {
      onDelete(id);
    }
  };

  useState(() => {
    fetchVoteCounts();
  });

  return (
    <div className={`bg-white rounded-lg p-3 sm:p-6 border border-gray-200 shadow-sm ${className}`}>
      <FeatureHeader
        status={currentStatus}
        product={product}
        location={location}
        onStatusChange={handleStatusChange}
        onEdit={onEdit ? () => onEdit({
          id,
          title,
          description,
          status: currentStatus,
          product,
          location,
          votes: currentVotes,
          comments,
          attachment,
          reporter,
          experimentOwner
        }) : undefined}
        onDelete={onDelete ? () => onDelete(id) : undefined}
      />

      <div className="space-y-2 mb-4">
        <h3 className="text-base sm:text-lg font-semibold break-words">{title}</h3>
        <p className="text-xs sm:text-sm text-gray-600 break-words">{description}</p>
        <p className="text-[10px] sm:text-xs text-gray-500 break-words">
          Reported by: {reporter}
          {experimentOwner && ` • Experiment Owner: ${experimentOwner}`}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 mt-3">
        <VotingSection
          votes={currentVotes}
          voteStatus={voteStatus}
          onVote={handleVote}
          upvotes={upvotes}
          downvotes={downvotes}
        />

        {attachment && (
          <a 
            href={attachment} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center text-[10px] sm:text-sm text-primary hover:underline"
          >
            <Paperclip className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            <span className="whitespace-nowrap">View attachment</span>
          </a>
        )}

        <Button 
          variant="ghost" 
          size="sm" 
          className="h-7 gap-1 px-1.5 sm:px-3"
          onClick={() => setShowComments(!showComments)}
        >
          <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="text-xs">{comments.length}</span>
        </Button>
      </div>

      {showComments && (
        <CommentsSection
          comments={comments}
          newComment={newComment}
          onCommentChange={setNewComment}
          onAddComment={handleAddComment}
        />
      )}
    </div>
  );
};
