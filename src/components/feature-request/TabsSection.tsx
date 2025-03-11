
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <TabsList>
          <TabsTrigger value="features" className="relative">
            Features
            {filteredFeatures.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {filteredFeatures.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="bugs" className="relative">
            Bugs
            {filteredBugs.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-destructive text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {filteredBugs.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

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

      <TabsContent value="features" className="mt-0">
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

      <TabsContent value="bugs" className="mt-0">
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
