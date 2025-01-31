import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowBigUp, MessageCircle } from "lucide-react";
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
}

interface FeatureCardProps {
  id: number;
  title: string;
  description: string;
  status: "new" | "review" | "progress" | "completed";
  product: string;
  votes: number;
  comments: Comment[];
  onStatusChange?: (id: number, newStatus: "new" | "review" | "progress" | "completed") => void;
  onAddComment?: (id: number, text: string) => void;
}

const statusConfig = {
  new: { label: "New", bg: "bg-status-new", text: "text-status-new-text" },
  review: { label: "Under Review", bg: "bg-status-review", text: "text-status-review-text" },
  progress: { label: "In Progress", bg: "bg-status-progress", text: "text-status-progress-text" },
  completed: { label: "Completed", bg: "bg-status-completed", text: "text-status-completed-text" },
};

const productLabels = {
  "website-demand-capture": "Website / Demand Capture",
  "dof-onboarding": "DOF / Onboarding"
};

export const FeatureCard = ({
  id,
  title,
  description,
  status,
  product,
  votes,
  comments,
  onStatusChange,
  onAddComment,
}: FeatureCardProps) => {
  const [currentVotes, setCurrentVotes] = useState(votes);
  const [hasVoted, setHasVoted] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const { toast } = useToast();

  const handleVote = () => {
    if (!hasVoted) {
      setCurrentVotes((prev) => prev + 1);
      setHasVoted(true);
    } else {
      setCurrentVotes((prev) => prev - 1);
      setHasVoted(false);
    }
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
    <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200 animate-scale-in">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Select value={status} onValueChange={handleStatusChange}>
              <SelectTrigger className={cn(
                "h-6 text-xs font-medium px-2.5 py-0.5 rounded-full w-auto min-w-32",
                statusConfig[status].bg,
                statusConfig[status].text
              )}>
                <SelectValue placeholder={statusConfig[status].label} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="review">Under Review</SelectItem>
                <SelectItem value="progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600">
              {productLabels[product as keyof typeof productLabels]}
            </span>
          </div>
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-gray-600 text-sm mb-4">{description}</p>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "gap-1 hover:bg-gray-100",
                hasVoted && "text-primary bg-primary/10 hover:bg-primary/20"
              )}
              onClick={handleVote}
            >
              <ArrowBigUp className="w-4 h-4" />
              <span>{currentVotes}</span>
            </Button>
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

          {showComments && (
            <div className="mt-4 space-y-4">
              <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="mb-3 last:mb-0">
                    <p className="text-sm text-gray-600">{comment.text}</p>
                    <span className="text-xs text-gray-400">{comment.timestamp}</span>
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
    </div>
  );
};