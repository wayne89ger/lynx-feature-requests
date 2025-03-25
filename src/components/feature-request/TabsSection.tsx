
import { useState } from "react";
import { FeatureList } from "./FeatureList";
import { Filters } from "./Filters";
import { Feature } from "@/types/feature";

interface TabsSectionProps {
  filteredFeatures: Feature[];
  onEdit: (feature: Feature) => void;
  onDeleteFeature: (id: number) => void;
  onStatusChange: (id: number, newStatus: Feature['status']) => void;
  selectedProduct: string;
  setSelectedProduct: (product: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  selectedRequester: string;
  setSelectedRequester: (requester: string) => void;
}

export const TabsSection = ({
  filteredFeatures,
  onEdit,
  onDeleteFeature,
  onStatusChange,
  selectedProduct,
  setSelectedProduct,
  selectedStatus,
  setSelectedStatus,
  selectedRequester,
  setSelectedRequester,
}: TabsSectionProps) => {
  const [activeTab] = useState("features");

  return (
    <div className="mt-8">
      <div className="mb-6">
        <div className="mb-4 w-full">
          <div className="relative flex-1 bg-[#F2FCE2] p-2 rounded-md">
            Feature Requests
            {filteredFeatures.length > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-[#F2FCE2] text-primary text-xs rounded-full">
                {filteredFeatures.length}
              </span>
            )}
          </div>
        </div>

        <div className="mt-4 mb-6">
          <Filters
            activeTab={activeTab}
            selectedProduct={selectedProduct}
            setSelectedProduct={setSelectedProduct}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            selectedRequester={selectedRequester}
            setSelectedRequester={setSelectedRequester}
          />
        </div>
      </div>

      <div className="mt-0 border border-[rgba(22,162,73,0.2)] rounded-lg p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-center text-primary mb-2">Feature Requests</h2>
        <p className="text-center text-muted-foreground mb-6">Browse and vote on proposed features</p>
        
        {filteredFeatures.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No feature requests found. Try adjusting your filters or submit a new feature request.
          </div>
        ) : (
          <FeatureList 
            features={filteredFeatures} 
            onEdit={onEdit}
            onDelete={onDeleteFeature}
            onStatusChange={onStatusChange}
          />
        )}
      </div>
    </div>
  );
};
