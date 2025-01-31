import { useState } from "react";
import { FeatureForm } from "@/components/feature-request/FeatureForm";
import { BugReportForm } from "@/components/bug-report/BugReportForm";
import { EditFeatureForm } from "@/components/feature-request/EditFeatureForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Feature } from "@/types/feature";
import { Filters } from "@/components/feature-request/Filters";
import { FeatureList } from "@/components/feature-request/FeatureList";
import { BugList } from "@/components/bug-report/BugList";
import { EXPERIMENT_OWNERS } from "@/constants/experimentOwners";

const Index = () => {
  const [features, setFeatures] = useState<Feature[]>([
    {
      id: 1,
      title: "Add dark mode support",
      description: "Implement a dark mode theme for better visibility in low-light conditions",
      status: "new",
      product: "website-demand-capture",
      location: "knowledge-portal",
      votes: 5,
      comments: [
        {
          id: 1,
          text: "This would be great for reducing eye strain during night shifts!",
          timestamp: "2024-03-15 14:30",
          reporter: "John Smith"
        },
        {
          id: 2,
          text: "Could we also add a system preference detection?",
          timestamp: "2024-03-15 15:45",
          reporter: "Sarah Johnson"
        }
      ],
      reporter: EXPERIMENT_OWNERS[0]
    },
    {
      id: 2,
      title: "Improve mobile responsiveness",
      description: "Enhance the mobile experience across all pages",
      status: "progress",
      product: "website-demand-capture",
      location: "service-portal",
      votes: 8,
      comments: [
        {
          id: 3,
          text: "The tables are currently overflowing on mobile devices",
          timestamp: "2024-03-14 09:15",
          reporter: "Alice Brown"
        }
      ],
      reporter: EXPERIMENT_OWNERS[0]
    },
    {
      id: 3,
      title: "Add export to PDF feature",
      description: "Allow users to export their data to PDF format",
      status: "review",
      product: "dof-onboarding",
      votes: 3,
      comments: [],
      reporter: EXPERIMENT_OWNERS[0],
      experimentOwner: EXPERIMENT_OWNERS[0]
    }
  ]);

  const [bugs, setBugs] = useState<Feature[]>([
    {
      id: 4,
      title: "Login button unresponsive on Safari",
      description: "Users report that the login button doesn't work on Safari mobile browsers",
      status: "new",
      product: "website-demand-capture",
      votes: 12,
      comments: [
        {
          id: 6,
          text: "Confirmed on iPhone 13 with iOS 16",
          timestamp: "2024-03-16 10:00",
          reporter: "Mark Taylor"
        }
      ],
      reporter: EXPERIMENT_OWNERS[0]
    },
    {
      id: 5,
      title: "Data not saving in forms",
      description: "Form data is lost when switching between tabs in the onboarding process",
      status: "progress",
      product: "dof-onboarding",
      votes: 15,
      comments: [
        {
          id: 7,
          text: "This is causing major issues for our users",
          timestamp: "2024-03-16 11:30",
          reporter: "Emma Wilson"
        }
      ],
      reporter: EXPERIMENT_OWNERS[1]
    }
  ]);

  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [selectedRequester, setSelectedRequester] = useState<string>("all");
  const [selectedExperimentOwner, setSelectedExperimentOwner] = useState<string>("all");

  const handleFeatureSubmit = (formData: { 
    title: string;
    description: string;
    product: string;
    location?: string;
    canContact: boolean;
    attachment?: File;
  }) => {
    const newFeature: Feature = {
      id: features.length + 1,
      title: formData.title,
      description: formData.description,
      status: "new",
      product: formData.product,
      location: formData.location,
      votes: 0,
      comments: [],
      reporter: EXPERIMENT_OWNERS[0],
      attachment: formData.attachment ? URL.createObjectURL(formData.attachment) : undefined
    };
    setFeatures([...features, newFeature]);
  };

  const handleBugSubmit = (bugData: {
    title: string;
    currentSituation: string;
    expectedBehavior: string;
    url: string;
    screenshot?: File;
  }) => {
    const newBug: Feature = {
      id: bugs.length + 1,
      title: bugData.title,
      description: `Current Situation: ${bugData.currentSituation}\nExpected Behavior: ${bugData.expectedBehavior}\nURL: ${bugData.url}`,
      status: "new",
      product: "bug",
      votes: 0,
      comments: [],
      reporter: EXPERIMENT_OWNERS[0],
      attachment: bugData.screenshot ? URL.createObjectURL(bugData.screenshot) : undefined
    };
    setBugs([...bugs, newBug]);
  };

  const handleFeatureUpdate = (id: number, updatedFeature: any) => {
    const updatedFeatures = features.map((f) =>
      f.id === id ? { ...f, ...updatedFeature } : f
    );
    setFeatures(updatedFeatures);
    setShowEditForm(false);
    setSelectedFeature(null);
  };

  const filteredAndSortedFeatures = [...features]
    .filter(feature => feature.product !== "bug" &&
      (selectedProduct === "all" || feature.product === selectedProduct) &&
      (selectedStatus === "all" || feature.status === selectedStatus) &&
      (selectedLocation === "all" || feature.location === selectedLocation) &&
      (selectedRequester === "all" || feature.reporter === selectedRequester) &&
      (selectedExperimentOwner === "all" || feature.experimentOwner === selectedExperimentOwner)
    )
    .sort((a, b) => b.votes - a.votes);

  const filteredAndSortedBugs = [...bugs]
    .sort((a, b) => b.votes - a.votes);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-5xl">
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-lynx-text mb-2">Help Shape Our Product</h1>
        <p className="text-lynx-text-secondary text-sm sm:text-base">
          Your feedback is valuable! Submit feature requests or report bugs to help us improve.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
        <div className="w-full sm:w-auto flex justify-center">
          <FeatureForm onSubmit={handleFeatureSubmit} />
        </div>
        <div className="w-full sm:w-auto flex justify-center">
          <BugReportForm onSubmit={handleBugSubmit} />
        </div>
      </div>

      {showEditForm && selectedFeature && (
        <EditFeatureForm
          feature={selectedFeature}
          open={showEditForm}
          onSave={handleFeatureUpdate}
          onClose={() => {
            setShowEditForm(false);
            setSelectedFeature(null);
          }}
        />
      )}

      <Tabs defaultValue="features" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px] mx-auto mb-8">
          <TabsTrigger value="features" className="text-sm sm:text-base">
            Feature Requests ({filteredAndSortedFeatures.length})
          </TabsTrigger>
          <TabsTrigger value="bugs" className="text-sm sm:text-base">
            Bug Reports ({filteredAndSortedBugs.length})
          </TabsTrigger>
        </TabsList>

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
            features={filteredAndSortedFeatures} 
            onEdit={(feature) => {
              setSelectedFeature(feature);
              setShowEditForm(true);
            }}
          />
        </TabsContent>

        <TabsContent value="bugs">
          <BugList 
            bugs={filteredAndSortedBugs}
            onEdit={(bug) => {
              setSelectedFeature(bug);
              setShowEditForm(true);
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;
