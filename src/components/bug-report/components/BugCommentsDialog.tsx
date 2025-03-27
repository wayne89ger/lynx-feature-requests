
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Paperclip, Edit, X, Save } from "lucide-react";
import { AttachmentUpload } from "@/components/feature-request/components/AttachmentUpload";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

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
  const [newComment, setNewComment] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  const handleAddComment = async () => {
    if (!newComment.trim() && !attachment) {
      const { toast } = await import("@/hooks/use-toast");
      toast({
        title: "Error",
        description: "Please enter a comment or attach a file",
        variant: "destructive",
      });
      return;
    }

    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { toast } = await import("@/hooks/use-toast");
      
      let attachmentUrl = "";
      
      if (attachment) {
        const fileName = `bug_${bugId}_${Date.now()}_${attachment.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('attachments')
          .upload(fileName, attachment);

        if (uploadError) {
          console.error('Error uploading attachment:', uploadError);
          throw uploadError;
        }

        const { data: urlData } = supabase.storage
          .from('attachments')
          .getPublicUrl(fileName);
          
        attachmentUrl = urlData.publicUrl;
      }

      const { data, error } = await supabase
        .from('comments')
        .insert([{
          bug_id: bugId,
          text: newComment.trim() || (attachment ? `Attached: ${attachment.name}` : ""),
          reporter: reporter,
          attachment: attachmentUrl || null
        }])
        .select()
        .single();

      if (error) throw error;

      setNewComment("");
      setAttachment(null);
      
      toast({
        title: "Comment added",
        description: "Your comment has been added successfully.",
      });

      // Close and reopen to refresh comments
      onClose();
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.error('Error adding comment:', error);
      const { toast } = await import("@/hooks/use-toast");
      toast({
        title: "Error adding comment",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const startEditing = (comment: any) => {
    setEditingCommentId(comment.id);
    setEditText(comment.text);
  };

  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditText("");
  };

  const saveEdit = async (commentId: number) => {
    if (!editText.trim()) return;
    
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { toast } = await import("@/hooks/use-toast");
      
      const { error } = await supabase
        .from('comments')
        .update({ text: editText })
        .eq('id', commentId);

      if (error) throw error;
      
      setEditingCommentId(null);
      setEditText("");
      
      toast({
        title: "Comment updated",
        description: "Your comment has been updated successfully.",
      });
      
      // Close and reopen to refresh comments
      onClose();
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.error('Error updating comment:', error);
      const { toast } = await import("@/hooks/use-toast");
      toast({
        title: "Error updating comment",
        description: "Please try again later",
        variant: "destructive",
      });
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
                        {comment.reporter === localStorage.getItem('reporter') && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => startEditing(comment)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-6 w-6"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        )}
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
                onChange={(e) => setNewComment(e.target.value)}
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
