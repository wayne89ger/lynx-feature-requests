import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowBigUp, ArrowBigDown, MessageCircle, Paperclip, Edit } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Feature } from "@/types/feature";
import { supabase } from "@/integrations/supabase/client";

interface Comment {
  id: number;
  text: string;
  timestamp: string;
  reporter: string;
}

interface FeatureCardProps extends Feature {
  onStatusChange?: (id: number, newStatus: "new" | "review" | "progress" | "completed") => void;
  onAddComment?: (id: number, text: string) => void;
  onEdit?: (feature: Feature) => void;
}

const statusConfig = {
  new: { 
    label: "New", 
    mobileLabel: "New",
    bg: "bg-status-new", 
    text: "text-status-new-text" 
  },
  review: { 
    label: "Under Review", 
    mobileLabel: "Review",
    bg: "bg-status-review", 
    text: "text-status-review-text" 
  },
  progress: { 
    label: "In Progress", 
    mobileLabel: "Progress",
    bg: "bg-status-progress", 
    text: "text-status-progress-text" 
  },
  completed: { 
    label: "Completed", 
    mobileLabel: "Done",
    bg: "bg-status-completed", 
    text: "text-status-completed-text" 
  },
};

const productLabels = {
  "website-demand-capture": {
    full: "Website / Demand Capture",
    mobile: "Website"
  },
  "dof-onboarding": {
    full: "DOF / Onboarding",
    mobile: "DOF"
  },
  "lynx-plus": {
    full: "LYNX+ / Client Experience",
    mobile: "LYNX+"
  }
};

const locationLabels = {
  "knowledge-portal": {
    full: "Knowledge Portal",
    mobile: "Knowledge"
  },
  "marketing-section": {
    full: "Marketing Section",
    mobile: "Marketing"
  },
  "service-portal": {
    full: "Service Portal",
    mobile: "Service"
  }
};

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
  const [voteStatus, setVoteStatus] = useState<'none' | 'up' | 'down'>('none');
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const checkVoteStatus = async () => {
      try {
        const { data: voteData, error } = await supabase
          .from('feature_votes')
          .select('vote_type')
          .eq('feature_id', id)
          .eq('reporter', reporter)
          .single();

        if (error) {
          if (error.code !== 'PGRST116') { // PGRST116 is the error code for no rows returned
            console.error('Error checking vote status:', error);
          }
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
  }, [id, reporter]);

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
        description: `Status changed to ${statusConfig[newStatus].label}`,
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

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger className={cn(
              "h-8 text-xs font-medium px-2.5 py-0.5 rounded-full w-auto",
              statusConfig[status].bg,
              statusConfig[status].text
            )}>
              <SelectValue>
                <span className="hidden sm:inline">{statusConfig[status].label}</span>
                <span className="sm:hidden">{statusConfig[status].mobileLabel}</span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {Object.entries(statusConfig).map(([key, config]) => (
                <SelectItem key={key} value={key}>
                  {config.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {product && (
            <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600">
              <span className="hidden sm:inline">
                {productLabels[product as keyof typeof productLabels]?.full}
              </span>
              <span className="sm:hidden">
                {productLabels[product as keyof typeof productLabels]?.mobile}
              </span>
            </span>
          )}
          {location && (
            <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600">
              <span className="hidden sm:inline">
                {locationLabels[location as keyof typeof locationLabels]?.full}
              </span>
              <span className="sm:hidden">
                {locationLabels[location as keyof typeof locationLabels]?.mobile}
              </span>
            </span>
          )}
        </div>
        {onEdit && (
          <Button
            variant="ghost"
            size="sm"
            className="gap-1"
            onClick={() => onEdit({
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
            })}
          >
            <Edit className="w-4 h-4" />
            <span className="hidden sm:inline">
              {product === "bug" ? "Edit Bug" : "Edit Feature"}
            </span>
          </Button>
        )}
      </div>

      <div className="space-y-2 mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
        <p className="text-xs text-gray-500">
          Reported by: {reporter}
          {experimentOwner && ` • Experiment Owner: ${experimentOwner}`}
        </p>
      </div>

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
        <div className="space-y-4 border-t pt-4 mt-4">
          <ScrollArea className="h-[200px] w-full rounded-md border p-4">
            {comments.map((comment) => (
              <div key={comment.id} className="mb-4 last:mb-0 border-b last:border-0 pb-3">
                <p className="text-sm text-gray-600">{comment.text}</p>
                <div className="mt-1 flex items-center gap-2 text-xs text-gray-400">
                  <span className="font-medium text-gray-500">{comment.reporter}</span>
                  <span>•</span>
                  <span>{comment.timestamp}</span>
                </div>
              </div>
            ))}
          </ScrollArea>
          <div className="flex gap-2">
            <Input
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleAddComment}>Comment</Button>
          </div>
        </div>
      )}
    </div>
  );
};
