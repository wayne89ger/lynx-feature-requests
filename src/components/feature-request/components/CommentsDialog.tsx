
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Comment } from "@/types/feature";
import { Paperclip, Edit, X, Save } from "lucide-react";
import { AttachmentUpload } from "./AttachmentUpload";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CommentsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  comments: Comment[];
  newComment: string;
  onCommentChange: (value: string) => void;
  onAddComment: (attachment?: File) => void;
  onEditComment?: (commentId: number, newText: string) => void;
  featureTitle: string;
}

export const CommentsDialog = ({
  isOpen,
  onClose,
  comments,
  newComment,
  onCommentChange,
  onAddComment,
  onEditComment,
  featureTitle,
}: CommentsDialogProps) => {
  const [attachment, setAttachment] = useState<File | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  const handleAddComment = () => {
    onAddComment(attachment || undefined);
    setAttachment(null);
  };

  const startEditing = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditText(comment.text);
  };

  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditText("");
  };

  const saveEdit = (commentId: number) => {
    if (onEditComment && editText.trim()) {
      onEditComment(commentId, editText);
      setEditingCommentId(null);
      setEditText("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Comments on: {featureTitle}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 pt-2">
          <ScrollArea className="h-[300px] w-full rounded-md border p-4">
            {comments.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No comments yet. Be the first to comment!</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="mb-4 last:mb-0 border-b last:border-0 pb-3">
                  {editingCommentId === comment.id ? (
                    <div className="space-y-2">
                      <Textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="w-full min-h-[80px] text-sm"
                      />
                      <div className="flex gap-2 justify-end">
                        <Button 
                          onClick={() => cancelEditing()} 
                          variant="outline" 
                          size="sm"
                          className="h-8 px-2 gap-1"
                        >
                          <X className="h-3 w-3" />
                          Cancel
                        </Button>
                        <Button 
                          onClick={() => saveEdit(comment.id)} 
                          size="sm"
                          className="h-8 px-2 gap-1"
                        >
                          <Save className="h-3 w-3" />
                          Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start justify-between group">
                        <p className="text-sm text-gray-600">{comment.text}</p>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => startEditing(comment)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-6 w-6"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
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
                    </>
                  )}
                </div>
              ))
            )}
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
      </DialogContent>
    </Dialog>
  );
};
