import { useState } from "react";
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

interface Comment {
  id: number;
  text: string;
  timestamp: string;
  reporter: string;
}

interface Feature {
  id: number;
  title: string;
  description: string;
  status: "new" | "review" | "progress" | "completed";
  product: string;
  location?: string;
  votes: number;
  comments: Comment[];
  attachment?: string;
  reporter: string;
  experimentOwner?: string;
}

interface FeatureCardProps {
  id: number;
  title: string;
  description: string;
  status: "new" | "review" | "progress" | "completed";
  product: string;
  location?: string;
  votes: number;
  comments: Comment[];
  attachment?: string;
  reporter?: string;
  experimentOwner?: string;
  onStatusChange?: (id: number, newStatus: "new" | "review" | "progress" | "completed") => void;
  onAddComment?: (id: number, text: string) => void;
  onEdit?: (feature: Feature) => void;
}

const statusConfig = {
  new: { label: "New", bg: "bg-status-new", text: "text-status-new-text" },
  review: { label: "Under Review", bg: "bg-status-review", text: "text-status-review-text" },
  progress: { label: "In Progress", bg: "bg-status-progress", text: "text-status-progress-text" },
  completed: { label: "Completed", bg: "bg-status-completed", text: "text-status-completed-text" },
};

const productLabels = {
  "website-demand-capture": "Website / Demand Capture",
  "dof-onboarding": "DOF / Onboarding",
  "lynx-plus": "LYNX+ / Client Experience"
};

const locationLabels = {
  "knowledge-portal": "Knowledge Portal",
  "marketing-section": "Marketing Section",
  "service-portal": "Service Portal"
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
  reporter = "LYNX - Wanja Aram",
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

  const handleVote = (direction: 'up' | 'down') => {
    if (voteStatus === direction) {
      // Remove vote
      setCurrentVotes(prev => direction === 'up' ? prev - 1 : prev + 1);
      setVoteStatus('none');
    } else {
      // If changing vote direction, need to account for both changes
      if (voteStatus !== 'none') {
        setCurrentVotes(prev => direction === 'up' ? prev + 2 : prev - 2);
      } else {
        setCurrentVotes(prev => direction === 'up' ? prev + 1 : prev - 1);
      }
      setVoteStatus(direction);
    }

    toast({
      title: "Vote recorded",
      description: `You ${voteStatus === direction ? 'removed your vote' : direction === 'up' ? 'upvoted' : 'downvoted'} this feature request.`,
    });
  };

  const handleStatusChange = (newStatus: "new" | "review" | "progress" | "completed") => {
    onStatusChange?.(id, newStatus);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) {
      toast({
        title: "Error",
        description: "Please enter a comment",
        variant: "destructive",
      });
      return;
    }
    onAddComment?.(id, newComment);
    setNewComment("");
    toast({
      title: "Comment added",
      description: "Your comment has been added successfully.",
    });
  };

  return (
    <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-200 animate-scale-in">
      <div className="flex flex-col gap-4">
        {/* Status and Tags Section */}
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <div className="w-full sm:w-auto min-w-[200px] sm:min-w-0">
              <Select value={status} onValueChange={handleStatusChange}>
                <SelectTrigger className={cn(
                  "h-8 text-xs font-medium px-2.5 py-0.5 rounded-full w-full sm:w-auto",
                  statusConfig[status].bg,
                  statusConfig[status].text
                )}>
                  <SelectValue placeholder={statusConfig[status].label} />
                </SelectTrigger>
                <SelectContent className="min-w-[200px]">
                  {Object.entries(statusConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 whitespace-nowrap">
              {productLabels[product as keyof typeof productLabels]}
            </span>
            {location && (
              <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 whitespace-nowrap">
                {locationLabels[location as keyof typeof locationLabels]}
              </span>
            )}
          </div>

          {/* Edit Button */}
          {onEdit && (
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 self-start"
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
              Edit
            </Button>
          )}
        </div>

        {/* Content Section */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-gray-600 text-sm">{description}</p>
          <p className="text-xs text-gray-500">
            Reported by: {reporter}
            {experimentOwner && ` • Experiment Owner: ${experimentOwner}`}
          </p>
        </div>

        {/* Attachment Section */}
        {attachment && (
          <div>
            <a 
              href={attachment} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm text-primary hover:underline"
            >
              <Paperclip className="w-4 h-4 mr-1" />
              View attachment
            </a>
          </div>
        )}

        {/* Actions Section */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "p-2 hover:bg-gray-100",
                voteStatus === 'up' && "text-primary bg-primary/10 hover:bg-primary/20"
              )}
              onClick={() => handleVote('up')}
            >
              <ArrowBigUp className="w-4 h-4" />
            </Button>
            <span className="min-w-[2rem] text-center">{currentVotes}</span>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "p-2 hover:bg-gray-100",
                voteStatus === 'down' && "text-destructive bg-destructive/10 hover:bg-destructive/20"
              )}
              onClick={() => handleVote('down')}
            >
              <ArrowBigDown className="w-4 h-4" />
            </Button>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-1 hover:bg-gray-100"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageCircle className="w-4 h-4" />
            <span>{comments.length}</span>
          </Button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-4 space-y-4">
            <ScrollArea className="h-[200px] w-full rounded-md border p-4">
              {comments.map((comment) => (
                <div key={comment.id} className="mb-4 last:mb-0 border-b last:border-0 pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm text-gray-600">{comment.text}</p>
                  </div>
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
    </div>
  );
};