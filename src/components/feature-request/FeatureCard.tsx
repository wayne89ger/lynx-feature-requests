import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowBigUp, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  id: number;
  title: string;
  description: string;
  status: "new" | "review" | "progress" | "completed";
  category: string;
  votes: number;
  comments: number;
}

const statusConfig = {
  new: { label: "New", bg: "bg-status-new", text: "text-status-new-text" },
  review: { label: "Under Review", bg: "bg-status-review", text: "text-status-review-text" },
  progress: { label: "In Progress", bg: "bg-status-progress", text: "text-status-progress-text" },
  completed: { label: "Completed", bg: "bg-status-completed", text: "text-status-completed-text" },
};

export const FeatureCard = ({
  id,
  title,
  description,
  status,
  category,
  votes,
  comments,
}: FeatureCardProps) => {
  const [currentVotes, setCurrentVotes] = useState(votes);
  const [hasVoted, setHasVoted] = useState(false);

  const handleVote = () => {
    if (!hasVoted) {
      setCurrentVotes((prev) => prev + 1);
      setHasVoted(true);
    } else {
      setCurrentVotes((prev) => prev - 1);
      setHasVoted(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200 animate-scale-in">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={cn(
                "text-xs font-medium px-2.5 py-0.5 rounded-full",
                statusConfig[status].bg,
                statusConfig[status].text
              )}
            >
              {statusConfig[status].label}
            </span>
            <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600">
              {category}
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
            <Button variant="ghost" size="sm" className="gap-1 hover:bg-gray-100">
              <MessageCircle className="w-4 h-4" />
              <span>{comments}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};