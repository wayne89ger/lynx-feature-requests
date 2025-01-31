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
  const [showEditForm, setShowEditForm] = useState(false);
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

  const handleCloseEdit = () => {
    setShowEditForm(false);
    setSelectedFeature(null);
  };

  const handleSave = async (id: number, updatedFeature: any) => {
    const success = await handleFeatureUpdate(id, updatedFeature);
    if (success) {
      handleCloseEdit();
    }
  };

  return (
    <>
      <FormActions 
        onFeatureSubmit={handleFeatureSubmit}
        onBugSubmit={handleBugSubmit}
      />

      {showEditForm && selectedFeature && (
        selectedFeature.product === "bug" ? (
          <EditBugForm
            feature={selectedFeature}
            open={showEditForm}
            onSave={handleSave}
            onClose={handleCloseEdit}
          />
        ) : (
          <EditFeatureForm
            feature={selectedFeature}
            open={showEditForm}
            onSave={handleSave}
            onClose={handleCloseEdit}
          />
        )
      )}

      <TabsSection
        filteredFeatures={filteredAndSortedFeatures}
        filteredBugs={filteredAndSortedBugs}
        onEdit={handleEdit}
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