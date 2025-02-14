
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
}: FeatureCardProps) => {
  const [currentVotes, setCurrentVotes] = useState(votes);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const { toast } = useToast();
  const { voteStatus, setVoteStatus } = useVoteStatus(id, reporter);

  const handleStatusChange = async (newStatus: "new" | "review" | "progress" | "completed") => {
    try {
      const { error } = await supabase
        .from(product === 'bug' ? 'bugs' : 'features')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      onStatusChange?.(id, newStatus);
      
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

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
      <FeatureHeader
        status={status}
        product={product}
        location={location}
        onStatusChange={handleStatusChange}
        onEdit={onEdit ? () => onEdit({
          id,
          title,
          description,
          status,
          product,
          location,
          votes,
          comments,
          attachment,
          reporter,
          experimentOwner
        }) : undefined}
      />

      <div className="space-y-2 mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
        <p className="text-xs text-gray-500">
          Reported by: {reporter}
          {experimentOwner && ` • Experiment Owner: ${experimentOwner}`}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <VotingSection
          votes={currentVotes}
          voteStatus={voteStatus}
          onVote={handleVote}
        />

        {attachment && (
          <a 
            href={attachment} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm text-primary hover:underline"
          >
            <Paperclip className="w-4 h-4 mr-1" />
            View attachment
          </a>
        )}

        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-1"
          onClick={() => setShowComments(!showComments)}
        >
          <MessageCircle className="w-4 h-4" />
          <span>{comments.length}</span>
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
