
import { useState, useMemo } from "react";
import { Feature } from "@/types/feature";
import { useFeatures } from "@/hooks/useFeatures";
import { EditFeatureForm } from "./EditFeatureForm";
import { FormActions } from "./FormActions";
import { TabsSection } from "./TabsSection";
import { useFeatureSubmission } from "./handlers/useFeatureSubmission";
import { useFeatureUpdate } from "./handlers/useFeatureUpdate";
import { SortOption } from "./components/SortDropdown";
import { Graveyard } from "./Graveyard";

export const DataManager = () => {
  const { features, deletedFeatures, setFeatures, deleteFeature, restoreFeature, permanentlyDeleteFeature } = useFeatures();
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedRequester, setSelectedRequester] = useState("all");
  const [sortOption, setSortOption] = useState<SortOption>("votes-desc");
  const [activeTab, setActiveTab] = useState<"features" | "graveyard">("features");

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

  const handleFeatureRestore = async (id: number) => {
    await restoreFeature(id);
  };

  const handleFeaturePermanentDelete = async (id: number) => {
    await permanentlyDeleteFeature(id);
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

      {/* Tab buttons */}
      <div className="flex border-b">
        <button
          className={`px-4 py-2 ${activeTab === 'features' ? 'border-b-2 border-primary text-primary font-medium' : 'text-gray-500'}`}
          onClick={() => setActiveTab('features')}
        >
          Feature Requests
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'graveyard' ? 'border-b-2 border-primary text-primary font-medium' : 'text-gray-500'}`}
          onClick={() => setActiveTab('graveyard')}
        >
          Graveyard
          {deletedFeatures.length > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
              {deletedFeatures.length}
            </span>
          )}
        </button>
      </div>

      {activeTab === 'features' ? (
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
      ) : (
        <Graveyard
          deletedFeatures={deletedFeatures}
          onRestore={handleFeatureRestore}
          onPermanentDelete={handleFeaturePermanentDelete}
        />
      )}
    </div>
  );
};
