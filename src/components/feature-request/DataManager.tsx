import { useState } from "react";
import { Feature } from "@/types/feature";
import { useFeatures } from "@/hooks/useFeatures";
import { useBugs } from "@/hooks/useBugs";
import { EditFeatureForm } from "./EditFeatureForm";
import { FormActions } from "./FormActions";
import { TabsSection } from "./TabsSection";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { EXPERIMENT_OWNERS } from "@/constants/experimentOwners";

export const DataManager = () => {
  const { features, setFeatures, fetchFeatures } = useFeatures();
  const { bugs, setBugs, fetchBugs } = useBugs();
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [selectedRequester, setSelectedRequester] = useState<string>("all");
  const [selectedExperimentOwner, setSelectedExperimentOwner] = useState<string>("all");
  const { toast } = useToast();

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

      const newFeature: Feature = {
        ...data,
        comments: []
      };

      setFeatures([...features, newFeature]);
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

      const newBug: Feature = {
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
      };

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

      const existingFeature = features.find(f => f.id === id);
      const updatedFeatureWithComments: Feature = {
        ...data,
        comments: existingFeature?.comments || []
      };

      setFeatures(features.map(f => f.id === id ? updatedFeatureWithComments : f));
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

  const filteredAndSortedFeatures = features
    .filter(feature => 
      (selectedProduct === "all" || feature.product === selectedProduct) &&
      (selectedStatus === "all" || feature.status === selectedStatus) &&
      (selectedLocation === "all" || feature.location === selectedLocation) &&
      (selectedRequester === "all" || feature.reporter === selectedRequester) &&
      (selectedExperimentOwner === "all" || feature.experimentOwner === selectedExperimentOwner)
    )
    .sort((a, b) => (b.votes || 0) - (a.votes || 0));

  const filteredAndSortedBugs = bugs
    .filter(bug => selectedProduct === "all" || bug.product === selectedProduct)
    .sort((a, b) => (b.votes || 0) - (a.votes || 0));

  return (
    <>
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
    </>
  );
};