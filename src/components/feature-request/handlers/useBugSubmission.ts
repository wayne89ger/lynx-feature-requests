import { Feature, Bug } from "@/types/feature";
import { supabase } from "@/integrations/supabase/client";
import { EXPERIMENT_OWNERS } from "@/constants/experimentOwners";
import { useToast } from "@/hooks/use-toast";

export const useBugSubmission = (bugs: Feature[], setBugs: (bugs: Feature[]) => void) => {
  const { toast } = useToast();

  const handleBugSubmit = async (bugData: {
    title: string;
    currentSituation: string;
    expectedBehavior: string;
    url: string;
    screenshot?: File;
    product: string;
  }) => {
    try {
      console.log('Submitting bug:', bugData);
      const { data, error } = await supabase
        .from('bugs')
        .insert([{
          title: bugData.title,
          current_situation: bugData.currentSituation,
          expected_behavior: bugData.expectedBehavior,
          url: bugData.url,
          product: bugData.product,
          reporter: EXPERIMENT_OWNERS[0],
          votes: 0
        }])
        .select()
        .single();

      if (error) {
        console.error('Error submitting bug:', error);
        throw error;
      }

      console.log('Bug submitted successfully:', data);
      const newBug = {
        id: data.id,
        title: data.title,
        description: data.current_situation,
        status: data.status,
        product: data.product,
        votes: data.votes || 0,
        reporter: data.reporter,
        comments: [],
        created_at: data.created_at,
        updated_at: data.updated_at
      } as Feature;

      setBugs([...bugs, newBug]);
      toast({
        title: "Bug submitted",
        description: "Your bug report has been saved successfully.",
      });
    } catch (error) {
      console.error('Error submitting bug:', error);
      toast({
        title: "Error submitting bug",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  return { handleBugSubmit };
};