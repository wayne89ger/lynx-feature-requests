import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FeatureList } from "./FeatureList";
import { BugList } from "../bug-report/BugList";
import { Filters } from "./Filters";
import { Feature } from "@/types/feature";

interface TabsSectionProps {
  filteredFeatures: Feature[];
  filteredBugs: Feature[];
  onEdit: (feature: Feature) => void;
  selectedProduct: string;
  setSelectedProduct: (value: string) => void;
  selectedStatus: string;
  setSelectedStatus: (value: string) => void;
  selectedLocation: string;
  setSelectedLocation: (value: string) => void;
  selectedRequester: string;
  setSelectedRequester: (value: string) => void;
  selectedExperimentOwner: string;
  setSelectedExperimentOwner: (value: string) => void;
}

export const TabsSection = ({
  filteredFeatures,
  filteredBugs,
  onEdit,
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
  return (
    <Tabs defaultValue="features" className="w-full">
      <div className="flex justify-center mb-8">
        <TabsList className="grid w-full max-w-[400px] grid-cols-2 bg-secondary/20 p-1 rounded-lg">
          <TabsTrigger 
            value="features" 
            className="rounded-md data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
          >
            Feature Requests ({filteredFeatures.length})
          </TabsTrigger>
          <TabsTrigger 
            value="bugs" 
            className="rounded-md data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
          >
            Bug Reports ({filteredBugs.length})
          </TabsTrigger>
        </TabsList>
      </div>

      <Filters
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

      <TabsContent value="features">
        <FeatureList 
          features={filteredFeatures} 
          onEdit={onEdit}
        />
      </TabsContent>

      <TabsContent value="bugs">
        <BugList 
          bugs={filteredBugs}
          onEdit={onEdit}
        />
      </TabsContent>
    </Tabs>
  );
};