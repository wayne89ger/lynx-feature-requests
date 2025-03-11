
import { useState, useEffect } from "react";
import { Feature } from "@/types/feature";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useBugs = () => {
  const [bugs, setBugs] = useState<Feature[]>([]);
  const { toast } = useToast();

  const createExampleBugs = async () => {
    const exampleBugs = [
      {
        title: "Login button not working on mobile",
        current_situation: "When clicking the login button on mobile devices, nothing happens",
        expected_behavior: "The login form should appear when clicking the button",
        url: "https://example.com/login",
        product: "website-demand-capture",
        reporter: "w.aram@lynxbroker.de",
        votes: 3
      },
      {
        title: "Form validation error message unclear",
        current_situation: "Error message just says 'Invalid input' without specifying which field",
        expected_behavior: "Error message should specify which field has the invalid input",
        url: "https://example.com/signup",
        product: "dof-onboarding",
        reporter: "w.aram@lynxbroker.de",
        votes: 2
      },
      {
        title: "Dashboard loading time too long",
        current_situation: "Dashboard takes more than 10 seconds to load on slow connections",
        expected_behavior: "Dashboard should load within 3 seconds with proper loading states",
        url: "https://example.com/dashboard",
        product: "lynx-plus",
        reporter: "w.aram@lynxbroker.de",
        votes: 5
      }
    ];

    for (const bug of exampleBugs) {
      const { error } = await supabase
        .from('bugs')
        .insert([bug]);
      
      if (error) {
        console.error('Error creating example bug:', error);
      }
    }
  };

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

      // Create example bugs if none exist
      if (bugsAsFeatures.length === 0) {
        console.log('No bugs found, creating examples...');
        await createExampleBugs();
        // Fetch bugs again after creating examples
        fetchBugs();
      }
    } catch (error) {
      console.error('Error in useBugs:', error);
      toast({
        title: "Error fetching bugs",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const deleteBug = async (id: number) => {
    try {
      // First delete any comments related to this bug
      await supabase
        .from('comments')
        .delete()
        .eq('bug_id', id);
      
      // Then delete the bug itself
      const { error } = await supabase
        .from('bugs')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setBugs(bugs.filter(bug => bug.id !== id));
      
      toast({
        title: "Bug deleted",
        description: "The bug report has been successfully deleted.",
      });
      return true;
    } catch (error) {
      console.error('Error deleting bug:', error);
      toast({
        title: "Error deleting bug",
        description: "Please try again later",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchBugs();
  }, []);

  return { bugs, setBugs, fetchBugs, deleteBug };
};
