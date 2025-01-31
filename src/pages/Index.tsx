import { useState, useEffect } from "react";
import { EditFeatureForm } from "@/components/feature-request/EditFeatureForm";
import { Feature } from "@/types/feature";
import { EXPERIMENT_OWNERS } from "@/constants/experimentOwners";
import { PageHeader } from "@/components/feature-request/PageHeader";
import { FormActions } from "@/components/feature-request/FormActions";
import { TabsSection } from "@/components/feature-request/TabsSection";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [bugs, setBugs] = useState<Feature[]>([]);
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [selectedRequester, setSelectedRequester] = useState<string>("all");
  const [selectedExperimentOwner, setSelectedExperimentOwner] = useState<string>("all");
  const { toast } = useToast();

  useEffect(() => {
    fetchFeatures();
    fetchBugs();
  }, []);

  const fetchFeatures = async () => {
    try {
      const { data, error } = await supabase
        .from('features')
        .select('*');
      
      if (error) throw error;
      setFeatures(data || []);
    } catch (error) {
      console.error('Error fetching features:', error);
      toast({
        title: "Error fetching features",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const fetchBugs = async () => {
    try {
      const { data, error } = await supabase
        .from('bugs')
        .select('*');
      
      if (error) throw error;
      setBugs(data || []);
    } catch (error) {
      console.error('Error fetching bugs:', error);
      toast({
        title: "Error fetching bugs",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const handleFeatureSubmit = async (formData: {
    title: string;
    description: string;
    product: string;
    location?: string;
    canContact: boolean;
    attachment?: File;
  }) => {
    try {
      const { data, error } = await supabase
        .from('features')
        .insert([{
          title: formData.title,
          description: formData.description,
          product: formData.product,
          location: formData.location,
          reporter: EXPERIMENT_OWNERS[0],
          votes: 0
        }])
        .select()
        .single();

      if (error) throw error;

      setFeatures([...features, data]);
      toast({
        title: "Feature submitted",
        description: "Your feature request has been saved successfully.",
      });
    } catch (error) {
      console.error('Error submitting feature:', error);
      toast({
        title: "Error submitting feature",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const handleBugSubmit = async (bugData: {
    title: string;
    currentSituation: string;
    expectedBehavior: string;
    url: string;
    screenshot?: File;
  }) => {
    try {
      const { data, error } = await supabase
        .from('bugs')
        .insert([{
          title: bugData.title,
          current_situation: bugData.currentSituation,
          expected_behavior: bugData.expectedBehavior,
          url: bugData.url,
          product: "website-demand-capture",
          reporter: EXPERIMENT_OWNERS[0],
          votes: 0
        }])
        .select()
        .single();

      if (error) throw error;

      setBugs([...bugs, data]);
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

  const handleFeatureUpdate = async (id: number, updatedFeature: any) => {
    try {
      const { data, error } = await supabase
        .from('features')
        .update({
          title: updatedFeature.title,
          description: updatedFeature.description,
          product: updatedFeature.product,
          location: updatedFeature.location,
          status: updatedFeature.status,
          experiment_owner: updatedFeature.experimentOwner
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setFeatures(features.map(f => f.id === id ? data : f));
      setShowEditForm(false);
      setSelectedFeature(null);
      toast({
        title: "Feature updated",
        description: "Your changes have been saved successfully.",
      });
    } catch (error) {
      console.error('Error updating feature:', error);
      toast({
        title: "Error updating feature",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const filteredAndSortedFeatures = [...features]
    .filter(feature => 
      (selectedProduct === "all" || feature.product === selectedProduct) &&
      (selectedStatus === "all" || feature.status === selectedStatus) &&
      (selectedLocation === "all" || feature.location === selectedLocation) &&
      (selectedRequester === "all" || feature.reporter === selectedRequester) &&
      (selectedExperimentOwner === "all" || feature.experimentOwner === selectedExperimentOwner)
    )
    .sort((a, b) => b.votes - a.votes);

  const filteredAndSortedBugs = [...bugs].sort((a, b) => b.votes - a.votes);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-5xl">
      <PageHeader />

      <FormActions 
        onFeatureSubmit={handleFeatureSubmit}
        onBugSubmit={handleBugSubmit}
      />

      {showEditForm && selectedFeature && (
        <EditFeatureForm
          feature={selectedFeature}
          open={showEditForm}
          onSave={handleFeatureUpdate}
          onClose={() => {
            setShowEditForm(false);
            setSelectedFeature(null);
          }}
        />
      )}

      <TabsSection
        filteredFeatures={filteredAndSortedFeatures}
        filteredBugs={filteredAndSortedBugs}
        onEdit={(feature) => {
          setSelectedFeature(feature);
          setShowEditForm(true);
        }}
        selectedProduct={selectedProduct}
        setSelectedProduct={setSelectedProduct}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        selectedRequester={selectedRequester}
        setSelectedRequester={setSelectedRequester}
        selectedExperimentOwner={selectedExperimentOwner}
        setSelectedExperimentOwner={setSelectedExperimentOwner}
      />
    </div>
  );
};

export default Index;