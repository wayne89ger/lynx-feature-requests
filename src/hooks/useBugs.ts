import { useState, useEffect } from "react";
import { Feature } from "@/types/feature";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useBugs = () => {
  const [bugs, setBugs] = useState<Feature[]>([]);
  const { toast } = useToast();

  const fetchBugs = async () => {
    try {
      console.log('Fetching bugs...');
      const { data, error } = await supabase
        .from('bugs')
        .select('*')
        .order('votes', { ascending: false });
      
      if (error) {
        console.error('Error fetching bugs:', error);
        throw error;
      }

      console.log('Bugs data:', data);

      const bugsAsFeatures = (data || []).map(bug => ({
        id: bug.id,
        title: bug.title,
        description: bug.current_situation,
        status: bug.status || 'new',
        product: bug.product,
        votes: bug.votes || 0,
        reporter: bug.reporter,
        comments: [],
        created_at: bug.created_at,
        updated_at: bug.updated_at
      })) as Feature[];

      console.log('Bugs as features:', bugsAsFeatures);
      setBugs(bugsAsFeatures);
    } catch (error) {
      console.error('Error in useBugs:', error);
      toast({
        title: "Error fetching bugs",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchBugs();
  }, []);

  return { bugs, setBugs, fetchBugs };
};