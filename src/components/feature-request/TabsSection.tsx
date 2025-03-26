
import { useState } from "react";
import { FeatureList } from "./FeatureList";
import { Filters } from "./Filters";
import { Feature } from "@/types/feature";
import { productLabels } from "./constants";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { exportFeaturesAsCSV } from "@/utils/exportUtils";
import { SortDropdown, SortOption } from "./components/SortDropdown";

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
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
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
  sortOption,
  setSortOption,
}: TabsSectionProps) => {
  const [activeTab] = useState("features");
  const [searchTerm, setSearchTerm] = useState("");

  // Apply search filter in addition to the existing filters
  const searchFilteredFeatures = filteredFeatures.filter(feature => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    
    // Search in title
    const titleMatch = feature.title.toLowerCase().includes(searchLower);
    
    // Search in product name
    const productMatch = productLabels[feature.product]?.full.toLowerCase().includes(searchLower) ||
                         feature.product.toLowerCase().includes(searchLower);
    
    // Search in requester name
    const requesterMatch = feature.reporter.toLowerCase().includes(searchLower);
    
    return titleMatch || productMatch || requesterMatch;
  });

  const handleExportCSV = () => {
    exportFeaturesAsCSV(searchFilteredFeatures);
  };

  return (
    <div className="mt-8">
      <div className="mb-6">
        <div className="mb-4 w-full">
          <div className="relative flex-1 bg-[#F2FCE2] p-2 rounded-md">
            Feature Requests
            {searchFilteredFeatures.length > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-[#F2FCE2] text-primary text-xs rounded-full">
                {searchFilteredFeatures.length}
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
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </div>
      </div>

      <div className="mt-0 border border-[rgba(22,162,73,0.2)] rounded-lg p-4 sm:p-6">
        <div className="flex flex-col items-center mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-center text-primary">Feature Requests</h2>
          <p className="text-center text-muted-foreground">Browse and vote on proposed features</p>
          <div className="mt-4 flex gap-2">
            <Button 
              onClick={handleExportCSV} 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1 text-xs"
            >
              <Download className="h-3 w-3" />
              Export CSV
            </Button>
            <SortDropdown currentSort={sortOption} onSortChange={setSortOption} />
          </div>
        </div>
        
        {searchFilteredFeatures.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No feature requests found. Try adjusting your filters or submit a new feature request.
          </div>
        ) : (
          <FeatureList 
            features={searchFilteredFeatures} 
            onEdit={onEdit}
            onDelete={onDeleteFeature}
            onStatusChange={onStatusChange}
          />
        )}
      </div>
    </div>
  );
};
