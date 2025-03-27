
import { Button } from "@/components/ui/button";
import { ArrowBigUp, ArrowBigDown, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface BugActionsProps {
  id: number;
  votes: number;
  commentsCount: number;
  onShowComments: () => void;
}

export const BugActions = ({ id, votes, commentsCount, onShowComments }: BugActionsProps) => {
  const [currentVotes, setCurrentVotes] = useState(votes);
  const [voteStatus, setVoteStatus] = useState<'none' | 'up' | 'down'>('none');

  const handleVote = async (direction: 'up' | 'down') => {
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { toast } = await import("@/hooks/use-toast");
      
      const voteChange = direction === 'up' ? 1 : -1;
      const { data, error } = await supabase
        .from('bugs')
        .update({ votes: currentVotes + voteChange })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setCurrentVotes(data.votes);
      setVoteStatus(direction);
      
      toast({
        title: "Vote recorded",
        description: `You ${voteStatus === direction ? 'removed your vote' : direction === 'up' ? 'upvoted' : 'downvoted'} this bug report.`,
      });
    } catch (error) {
      console.error('Error updating votes:', error);
      const { toast } = await import("@/hooks/use-toast");
      toast({
        title: "Error recording vote",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "p-1 hover:bg-gray-100",
            voteStatus === 'up' && "text-primary bg-primary/10 hover:bg-primary/20"
          )}
          onClick={() => handleVote('up')}
        >
          <ArrowBigUp className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium min-w-[1ch] text-center">{currentVotes}</span>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "p-1 hover:bg-gray-100",
            voteStatus === 'down' && "text-destructive bg-destructive/10 hover:bg-destructive/20"
          )}
          onClick={() => handleVote('down')}
        >
          <ArrowBigDown className="h-4 w-4" />
        </Button>
      </div>

      <Button 
        variant="ghost" 
        size="sm" 
        className="gap-1"
        onClick={onShowComments}
      >
        <MessageCircle className="w-4 h-4" />
        <span>{commentsCount}</span>
      </Button>
    </div>
  );
};
