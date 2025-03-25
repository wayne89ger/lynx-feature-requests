
import { useState } from "react";
import { Feature } from "@/types/feature";
import { useFeatures } from "@/hooks/useFeatures";
import { EditFeatureForm } from "./EditFeatureForm";
import { FormActions } from "./FormActions";
import { TabsSection } from "./TabsSection";
import { useFeatureSubmission } from "./handlers/useFeatureSubmission";
import { useFeatureUpdate } from "./handlers/useFeatureUpdate";

export const DataManager = () => {
  const { features, setFeatures, deleteFeature } = useFeatures();
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [selectedRequester, setSelectedRequester] = useState<string>("all");

  const { handleFeatureSubmit } = useFeatureSubmission(features, setFeatures);
  const { handleFeatureUpdate, handleStatusUpdate } = useFeatureUpdate(features, setFeatures);

  const filteredAndSortedFeatures = features
    .filter(feature => 
      (selectedProduct === "all" || feature.product === selectedProduct) &&
      (selectedStatus === "all" || feature.status === selectedStatus) &&
      (selectedLocation === "all" || feature.location === selectedLocation) &&
      (selectedRequester === "all" || feature.reporter === selectedRequester)
    )
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

  const handleStatusChange = async (id: number, newStatus: Feature['status']) => {
    console.log('Status change requested for feature', id, 'to', newStatus);
    await handleStatusUpdate(id, newStatus);
  };

  const handleFeatureDelete = async (id: number) => {
    await deleteFeature(id);
  };

  return (
    <>
      <FormActions 
        onFeatureSubmit={handleFeatureSubmit}
      />

      {showEditForm && selectedFeature && (
        <EditFeatureForm
          feature={selectedFeature}
          open={showEditForm}
          onSave={handleSave}
          onClose={handleCloseEdit}
        />
      )}

      <TabsSection
        filteredFeatures={filteredAndSortedFeatures}
        onEdit={handleEdit}
        onDeleteFeature={handleFeatureDelete}
        onStatusChange={handleStatusChange}
        selectedProduct={selectedProduct}
        setSelectedProduct={setSelectedProduct}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        selectedRequester={selectedRequester}
        setSelectedRequester={setSelectedRequester}
      />
    </>
  );
};
