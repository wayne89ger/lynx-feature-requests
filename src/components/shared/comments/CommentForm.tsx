
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AttachmentUpload } from "@/components/feature-request/components/AttachmentUpload";

interface CommentFormProps {
  onAddComment: (text: string, attachment?: File) => void;
}

export const CommentForm = ({ onAddComment }: CommentFormProps) => {
  const [newComment, setNewComment] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);

  const handleAddComment = () => {
    if (newComment.trim() || attachment) {
      onAddComment(newComment, attachment || undefined);
      setNewComment("");
      setAttachment(null);
    }
  };

  return (
    <div className="space-y-2">
      <AttachmentUpload attachment={attachment} setAttachment={setAttachment} />
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
  );
};
