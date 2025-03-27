
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Comment } from "@/types/feature";

export const useFeatureComments = (
  featureId: number,
  initialComments: Comment[],
  reporter: string,
  onAddComment?: (id: number, text: string, attachment?: string) => void
) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const { toast } = useToast();

  const handleAddComment = async (attachment?: File) => {
    if (!newComment.trim() && !attachment) {
      toast({
        title: "Error",
        description: "Please enter a comment or attach a file",
        variant: "destructive",
      });
      return;
    }

    try {
      let attachmentUrl = "";
      
      if (attachment) {
        const fileName = `${featureId}_${Date.now()}_${attachment.name}`;
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
          feature_id: featureId,
          text: newComment.trim() || (attachment ? `Attached: ${attachment.name}` : ""),
          reporter: reporter,
          attachment: attachmentUrl || null
        }])
        .select()
        .single();

      if (error) throw error;

      const newCommentObj: Comment = {
        id: data.id,
        text: data.text,
        timestamp: data.created_at,
        reporter: data.reporter,
        attachment: data.attachment,
      };

      setComments([...comments, newCommentObj]);
      onAddComment?.(featureId, newComment, attachmentUrl);
      setNewComment("");
      
      toast({
        title: "Comment added",
        description: "Your comment has been added successfully.",
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error adding comment",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const handleEditComment = async (commentId: number, newText: string) => {
    try {
      const { error } = await supabase
        .from('comments')
        .update({ text: newText })
        .eq('id', commentId);

      if (error) throw error;

      // Update local comments state
      const updatedComments = comments.map(comment => 
        comment.id === commentId 
          ? { ...comment, text: newText } 
          : comment
      );
      
      setComments(updatedComments);

      toast({
        title: "Comment updated",
        description: "Your comment has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating comment:', error);
      toast({
        title: "Error updating comment",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  return {
    showComments,
    setShowComments,
    newComment,
    setNewComment,
    comments,
    handleAddComment,
    handleEditComment
  };
};
