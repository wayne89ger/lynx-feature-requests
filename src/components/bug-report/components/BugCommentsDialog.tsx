
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CommentsList } from "@/components/shared/comments/CommentsList";
import { CommentForm } from "@/components/shared/comments/CommentForm";
import { BugCommentsService } from "./BugCommentsService";

interface BugCommentsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  bugId: number;
  comments: any[];
  title: string;
  reporter: string;
}

export const BugCommentsDialog = ({
  isOpen,
  onClose,
  bugId,
  comments,
  title,
  reporter,
}: BugCommentsDialogProps) => {
  const handleAddComment = async (text: string, attachment?: File) => {
    if (!text.trim() && !attachment) {
      const { toast } = await import("@/hooks/use-toast");
      toast({
        title: "Error",
        description: "Please enter a comment or attach a file",
        variant: "destructive",
      });
      return;
    }

    try {
      await BugCommentsService.addComment(bugId, text, reporter, attachment);
      
      // Close and reopen to refresh comments
      onClose();
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleEditComment = async (commentId: number, newText: string) => {
    try {
      await BugCommentsService.updateComment(commentId, newText);
      
      // Close and reopen to refresh comments
      onClose();
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Comments on: {title}</DialogTitle>
          <DialogDescription>View and add comments to this bug report</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 pt-2">
          <CommentsList 
            comments={comments} 
            onEditComment={handleEditComment} 
          />
          <CommentForm onAddComment={handleAddComment} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
