
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { Feature } from "@/types/feature";
import { useVoteStatus } from "@/hooks/useVoteStatus";
import { useFeatureVoting } from "@/hooks/useFeatureVoting";
import { useFeatureStatus } from "@/hooks/useFeatureStatus";
import { useFeatureComments } from "@/hooks/useFeatureComments";
import { FeatureHeader } from "./components/FeatureHeader";
import { VotingSection } from "./components/VotingSection";
import { CommentsSection } from "./components/CommentsSection";
import { AttachmentDisplay } from "./components/AttachmentDisplay";

interface FeatureCardProps extends Feature {
  onStatusChange?: (id: number, newStatus: "new" | "review" | "progress" | "completed") => void;
  onAddComment?: (id: number, text: string, attachment?: string) => void;
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
  urgency,
  onStatusChange,
  onAddComment,
  onEdit,
  onDelete,
  className = "",
}: FeatureCardProps) => {
  const { voteStatus } = useVoteStatus(id, reporter);
  
  const { 
    currentVotes, 
    upvotes, 
    downvotes, 
    fetchVoteCounts, 
    handleVote 
  } = useFeatureVoting({
    featureId: id,
    initialVotes: votes,
    reporter,
    initialVoteStatus: voteStatus
  });
  
  const { 
    currentStatus, 
    handleStatusChange 
  } = useFeatureStatus(id, status, onStatusChange);
  
  const { 
    showComments, 
    setShowComments, 
    newComment, 
    setNewComment, 
    handleAddComment 
  } = useFeatureComments(id, comments, reporter, onAddComment);

  const handleEdit = () => {
    if (onEdit) {
      onEdit({
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
        experimentOwner,
        urgency,
      });
    }
  };

  useEffect(() => {
    fetchVoteCounts();
  }, [id]);

  return (
    <div className={`bg-white rounded-lg p-3 sm:p-6 border border-gray-200 shadow-sm ${className}`}>
      <FeatureHeader
        status={currentStatus}
        product={product}
        location={location}
        onStatusChange={handleStatusChange}
        onEdit={onEdit ? handleEdit : undefined}
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

        <AttachmentDisplay attachment={attachment} />

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
