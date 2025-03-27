
import { Feature } from "@/types/feature";
import { ArrowBigUp, ArrowBigDown } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useVoteStatus } from "@/hooks/useVoteStatus";
import { useFeatureVoting } from "@/hooks/useFeatureVoting";

interface FeaturedCardProps {
  feature: Feature;
  label: string;
  onEdit: (feature: Feature) => void;
}

const FeaturedCard = ({ feature, label, onEdit }: FeaturedCardProps) => {
  const { voteStatus } = useVoteStatus(feature.id, feature.reporter);
  
  const { 
    currentVotes, 
    upvotes, 
    downvotes, 
    handleVote 
  } = useFeatureVoting({
    featureId: feature.id,
    initialVotes: feature.votes,
    reporter: feature.reporter,
    initialVoteStatus: voteStatus
  });

  return (
    <div className="flex-1 bg-gray-50 p-5 rounded-lg">
      <div className="text-sm font-medium text-gray-500 mb-2">{label}</div>
      <h3 className="text-lg font-semibold mb-1 break-words">{feature.title}</h3>
      
      <div className="flex items-center gap-1 mt-4">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-7 w-7 p-0 hover:bg-gray-100",
            voteStatus === 'up' && "text-primary bg-primary/10 hover:bg-primary/20"
          )}
          onClick={() => handleVote('up')}
        >
          <ArrowBigUp className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium min-w-[1ch] text-center text-primary">{upvotes || currentVotes}</span>
        
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-7 w-7 p-0 hover:bg-gray-100 ml-1",
            voteStatus === 'down' && "text-destructive bg-destructive/10 hover:bg-destructive/20"
          )}
          onClick={() => handleVote('down')}
        >
          <ArrowBigDown className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium min-w-[1ch] text-center text-destructive">{downvotes}</span>
      </div>

      <div className="mt-3 text-xs text-gray-500">
        {feature.reporter && `Reported by: ${feature.reporter}`}
        {feature.created_at && ` • Submitted: ${format(new Date(feature.created_at), 'MMM d, yyyy')}`}
      </div>

      <div className="mt-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs px-2 py-1 h-7"
          onClick={() => onEdit(feature)}
        >
          Edit Feature
        </Button>
      </div>
    </div>
  );
};

interface FeaturedRequestsProps {
  features: Feature[];
  onEdit: (feature: Feature) => void;
}

export const FeaturedRequests = ({ features, onEdit }: FeaturedRequestsProps) => {
  if (features.length === 0) {
    return null;
  }

  // Find the newest feature
  const newestFeature = [...features].sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  })[0];

  // Find the most upvoted feature
  const mostUpvotedFeature = [...features].sort((a, b) => {
    return (b.votes || 0) - (a.votes || 0);
  })[0];

  // If they're the same feature, just show one card
  if (newestFeature.id === mostUpvotedFeature.id) {
    return (
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">Featured Request</h2>
        <div className="flex gap-4">
          <FeaturedCard 
            feature={newestFeature} 
            label="Newest & Most Upvoted" 
            onEdit={onEdit} 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-3">Featured Requests</h2>
      <div className="flex flex-col sm:flex-row gap-4">
        <FeaturedCard 
          feature={newestFeature} 
          label="Newest" 
          onEdit={onEdit} 
        />
        <FeaturedCard 
          feature={mostUpvotedFeature} 
          label="Most Upvoted" 
          onEdit={onEdit} 
        />
      </div>
    </div>
  );
};
