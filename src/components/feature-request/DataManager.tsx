import { useState } from "react";
import { Feature } from "@/types/feature";
import { useFeatures } from "@/hooks/useFeatures";
import { useBugs } from "@/hooks/useBugs";
import { EditFeatureForm } from "./EditFeatureForm";
import { EditBugForm } from "../bug-report/EditBugForm";
import { FormActions } from "./FormActions";
import { TabsSection } from "./TabsSection";
import { useFeatureSubmission } from "./handlers/useFeatureSubmission";
import { useBugSubmission } from "./handlers/useBugSubmission";
import { useFeatureUpdate } from "./handlers/useFeatureUpdate";

export const DataManager = () => {
  const { features, setFeatures } = useFeatures();
  const { bugs, setBugs } = useBugs();
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const [selectedBug, setSelectedBug] = useState<any>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showEditBugForm, setShowEditBugForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [selectedRequester, setSelectedRequester] = useState<string>("all");
  const [selectedExperimentOwner, setSelectedExperimentOwner] = useState<string>("all");

  const { handleFeatureSubmit } = useFeatureSubmission(features, setFeatures);
  const { handleBugSubmit } = useBugSubmission(bugs, setBugs);
  const { handleFeatureUpdate } = useFeatureUpdate(features, setFeatures);

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

  const handleEdit = (feature: Feature) => {
    setSelectedFeature(feature);
    setShowEditForm(true);
  };

  const handleEditBug = (bug: any) => {
    setSelectedBug(bug);
    setShowEditBugForm(true);
  };

  const handleCloseEdit = () => {
    setShowEditForm(false);
    setSelectedFeature(null);
  };

  const handleCloseBugEdit = () => {
    setShowEditBugForm(false);
    setSelectedBug(null);
  };

  const handleSave = async (id: number, updatedFeature: any) => {
    const success = await handleFeatureUpdate(id, updatedFeature);
    if (success) {
      handleCloseEdit();
    }
  };

  const handleBugSave = async (id: number, updatedBug: any) => {
    // This will be implemented later when we rebuild the bug edit form
    handleCloseBugEdit();
  };

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
          onSave={handleSave}
          onClose={handleCloseEdit}
        />
      )}

      {showEditBugForm && selectedBug && (
        <EditBugForm
          bug={selectedBug}
          open={showEditBugForm}
          onSave={handleBugSave}
          onClose={handleCloseBugEdit}
        />
      )}

      <TabsSection
        filteredFeatures={filteredAndSortedFeatures}
        filteredBugs={filteredAndSortedBugs}
        onEdit={handleEdit}
        onEditBug={handleEditBug}
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