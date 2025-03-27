
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CommentsList } from "@/components/shared/comments/CommentsList";
import { CommentForm } from "@/components/shared/comments/CommentForm";
import { Comment } from "@/types/feature";

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
  const handleAddComment = (text: string, attachment?: File) => {
    onCommentChange(text);
    onAddComment(attachment);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Comments on: {featureTitle}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 pt-2">
          <CommentsList 
            comments={comments} 
            onEditComment={onEditComment || (() => {})} 
          />
          <CommentForm 
            onAddComment={handleAddComment} 
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
