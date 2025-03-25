
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Comment } from "@/types/feature";
import { Paperclip } from "lucide-react";
import { AttachmentUpload } from "./AttachmentUpload";

interface CommentsSectionProps {
  comments: Comment[];
  newComment: string;
  onCommentChange: (value: string) => void;
  onAddComment: (attachment?: File) => void;
}

export const CommentsSection = ({
  comments,
  newComment,
  onCommentChange,
  onAddComment
}: CommentsSectionProps) => {
  const [attachment, setAttachment] = useState<File | null>(null);

  const handleAddComment = () => {
    onAddComment(attachment || undefined);
    setAttachment(null);
  };

  return (
    <div className="space-y-4 border-t pt-4 mt-4">
      <ScrollArea className="h-[200px] w-full rounded-md border p-4">
        {comments.map((comment) => (
          <div key={comment.id} className="mb-4 last:mb-0 border-b last:border-0 pb-3">
            <p className="text-sm text-gray-600">{comment.text}</p>
            {comment.attachment && (
              <a 
                href={comment.attachment} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center mt-1 text-xs text-primary hover:underline"
              >
                <Paperclip className="h-3 w-3 mr-1" />
                View attachment
              </a>
            )}
            <div className="mt-1 flex items-center gap-2 text-xs text-gray-400">
              <span className="font-medium text-gray-500">{comment.reporter}</span>
              <span>•</span>
              <span>{comment.timestamp}</span>
            </div>
          </div>
        ))}
      </ScrollArea>
      <div className="space-y-2">
        <AttachmentUpload attachment={attachment} setAttachment={setAttachment} />
        <div className="flex gap-2">
          <Input
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => onCommentChange(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleAddComment}>Comment</Button>
        </div>
      </div>
    </div>
  );
};
