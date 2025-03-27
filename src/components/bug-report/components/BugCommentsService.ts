
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const BugCommentsService = {
  addComment: async (bugId: number, text: string, reporter: string, attachment?: File) => {
    try {
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
          text: text.trim() || (attachment ? `Attached: ${attachment.name}` : ""),
          reporter: reporter,
          attachment: attachmentUrl || null
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Comment added",
        description: "Your comment has been added successfully.",
      });

      return data;
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error adding comment",
        description: "Please try again later",
        variant: "destructive",
      });
      throw error;
    }
  },

  updateComment: async (commentId: number, newText: string) => {
    try {
      const { error } = await supabase
        .from('comments')
        .update({ text: newText })
        .eq('id', commentId);

      if (error) throw error;
      
      toast({
        title: "Comment updated",
        description: "Your comment has been updated successfully.",
      });
      
      return true;
    } catch (error) {
      console.error('Error updating comment:', error);
      toast({
        title: "Error updating comment",
        description: "Please try again later",
        variant: "destructive",
      });
      throw error;
    }
  }
};
