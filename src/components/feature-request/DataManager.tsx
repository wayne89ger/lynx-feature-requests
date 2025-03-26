
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
  const [selectedProduct, setSelectedProduct] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedRequester, setSelectedRequester] = useState<string>("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>("votes-desc");

  const { handleFeatureSubmit } = useFeatureSubmission(features, setFeatures);
  const { handleFeatureUpdate, handleStatusUpdate } = useFeatureUpdate(features, setFeatures);

  // Get all unique tags from features
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    features.forEach(feature => {
      if (feature.squads && Array.isArray(feature.squads)) {
        feature.squads.forEach(squad => tagsSet.add(squad));
      }
    });
    return Array.from(tagsSet);
  }, [features]);

  // Filter features based on selected filters (product, status, requester, tags)
  const filteredAndSortedFeatures = features
    .filter(feature => 
      (selectedProduct === "all" || feature.product === selectedProduct) &&
      (selectedStatus === "all" || feature.status === selectedStatus) &&
      (selectedRequester === "all" || feature.reporter === selectedRequester) &&
      (selectedTags.length === 0 || 
        (feature.squads && selectedTags.every(tag => feature.squads?.includes(tag))))
    )
    .sort((a, b) => {
      // Sort based on the selected sort option
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
        selectedRequester={selectedRequester}
        setSelectedRequester={setSelectedRequester}
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
        allTags={allTags}
        sortOption={sortOption}
        setSortOption={setSortOption}
      />
    </>
  );
};
