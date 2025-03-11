
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FeatureList } from "./FeatureList";
import { BugList } from "../bug-report/BugList";
import { Filters } from "./Filters";
import { Feature } from "@/types/feature";

interface TabsSectionProps {
  filteredFeatures: Feature[];
  filteredBugs: Feature[];
  onEdit: (feature: Feature) => void;
  onEditBug: (bug: Feature) => void;
  onDeleteFeature: (id: number) => void;
  onDeleteBug: (id: number) => void;
  selectedProduct: string;
  setSelectedProduct: (product: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  selectedLocation: string;
  setSelectedLocation: (location: string) => void;
  selectedRequester: string;
  setSelectedRequester: (requester: string) => void;
  selectedExperimentOwner: string;
  setSelectedExperimentOwner: (owner: string) => void;
}

export const TabsSection = ({
  filteredFeatures,
  filteredBugs,
  onEdit,
  onEditBug,
  onDeleteFeature,
  onDeleteBug,
  selectedProduct,
  setSelectedProduct,
  selectedStatus,
  setSelectedStatus,
  selectedLocation,
  setSelectedLocation,
  selectedRequester,
  setSelectedRequester,
  selectedExperimentOwner,
  setSelectedExperimentOwner,
}: TabsSectionProps) => {
  const [activeTab, setActiveTab] = useState("features");

  return (
    <Tabs defaultValue="features" className="mt-8" onValueChange={setActiveTab}>
      <div className="mb-6">
        <TabsList className="mb-4 w-full">
          <TabsTrigger 
            value="features" 
            className="relative flex-1 data-[state=active]:bg-[#F2FCE2]"
          >
            Feature Requests
            {filteredFeatures.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {filteredFeatures.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger 
            value="bugs" 
            className="relative flex-1 data-[state=active]:bg-red-50"
          >
            Bug Reports
            {filteredBugs.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-destructive text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {filteredBugs.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <div className="flex flex-row gap-3 mt-4 mb-6">
          <Filters
            activeTab={activeTab}
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
      </div>

      <TabsContent value="features" className="mt-0 border-2 border-primary rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-center text-primary mb-2">Feature Requests</h2>
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
          />
        )}
      </TabsContent>

      <TabsContent value="bugs" className="mt-0 border-2 border-[#ea384c] rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-center text-destructive mb-2">Bug Reports</h2>
        <p className="text-center text-muted-foreground mb-6">Help us track and fix issues</p>
        
        {filteredBugs.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No bugs found. Try adjusting your filters or submit a new bug report.
          </div>
        ) : (
          <BugList 
            bugs={filteredBugs} 
            onEdit={onEditBug}
            onDelete={onDeleteBug}
          />
        )}
      </TabsContent>
    </Tabs>
  );
};
