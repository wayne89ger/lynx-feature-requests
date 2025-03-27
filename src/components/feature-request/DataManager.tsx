
import { useState, useMemo } from "react";
import { Feature } from "@/types/feature";
import { useFeatures } from "@/hooks/useFeatures";
import { EditFeatureForm } from "./EditFeatureForm";
import { FormActions } from "./FormActions";
import { TabsSection } from "./TabsSection";
import { useFeatureSubmission } from "./handlers/useFeatureSubmission";
import { useFeatureUpdate } from "./handlers/useFeatureUpdate";
import { SortOption } from "./components/SortDropdown";

export const DataManager = () => {
  const { features, setFeatures, deleteFeature } = useFeatures();
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedRequester, setSelectedRequester] = useState("all");
  const [sortOption, setSortOption] = useState<SortOption>("votes-desc");

  const { handleFeatureSubmit } = useFeatureSubmission(features, setFeatures);
  const { handleFeatureUpdate, handleStatusUpdate } = useFeatureUpdate(features, setFeatures);

  const filteredFeatures = features.filter((feature) => {
    const productMatch =
      selectedProduct === "all" || feature.product === selectedProduct;

    const statusMatch =
      selectedStatus === "all" || feature.status === selectedStatus;

    const requesterMatch =
      selectedRequester === "all" || feature.reporter === selectedRequester;

    return productMatch && statusMatch && requesterMatch;
  });

  const sortedFeatures = filteredFeatures.sort((a, b) => {
    switch (sortOption) {
      case "votes-desc":
        return (b.votes || 0) - (a.votes || 0);
      case "votes-asc":
        return (a.votes || 0) - (b.votes || 0);
      case "date-desc":
        return new Date(b.created_at || "").getTime() - new Date(a.created_at || "").getTime();
      case "date-asc":
        return new Date(a.created_at || "").getTime() - new Date(b.created_at || "").getTime();
      default:
        return (b.votes || 0) - (a.votes || 0);
    }
  });

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
    <div className="space-y-8">
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
        filteredFeatures={sortedFeatures}
        onEdit={handleEdit}
        onDeleteFeature={handleFeatureDelete}
        onStatusChange={handleStatusChange}
        selectedProduct={selectedProduct}
        setSelectedProduct={setSelectedProduct}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        selectedRequester={selectedRequester}
        setSelectedRequester={setSelectedRequester}
        sortOption={sortOption}
        setSortOption={setSortOption}
      />
    </div>
  );
};
