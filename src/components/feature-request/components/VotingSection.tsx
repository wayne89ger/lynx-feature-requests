
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowBigUp, ArrowBigDown } from "lucide-react";

interface VotingSectionProps {
  votes: number;
  voteStatus: 'none' | 'up' | 'down';
  onVote: (direction: 'up' | 'down') => void;
}

export const VotingSection = ({ votes, voteStatus, onVote }: VotingSectionProps) => {
  return (
    <div className="flex items-center gap-0.5 sm:gap-1">
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "h-6 w-6 sm:h-7 sm:w-7 p-0 hover:bg-gray-100",
          voteStatus === 'up' && "text-primary bg-primary/10 hover:bg-primary/20"
        )}
        onClick={() => onVote('up')}
      >
        <ArrowBigUp className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
      </Button>
      <span className="text-xs sm:text-sm font-medium min-w-[1ch] text-center">{votes}</span>
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "h-6 w-6 sm:h-7 sm:w-7 p-0 hover:bg-gray-100",
          voteStatus === 'down' && "text-destructive bg-destructive/10 hover:bg-destructive/20"
        )}
        onClick={() => onVote('down')}
      >
        <ArrowBigDown className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
      </Button>
    </div>
  );
};
