import { useState } from "react";
import { FeatureCard } from "@/components/feature-request/FeatureCard";
import { FeatureForm } from "@/components/feature-request/FeatureForm";
import { BugReportForm } from "@/components/bug-report/BugReportForm";
import { useToast } from "@/hooks/use-toast";
import { EditFeatureForm } from "@/components/feature-request/EditFeatureForm";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EXPERIMENT_OWNERS } from "@/constants/experimentOwners";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Comment {
  id: number;
  text: string;
  timestamp: string;
}

interface Feature {
  id: number;
  title: string;
  description: string;
  status: "new" | "review" | "progress" | "completed";
  product: string;
  location?: string;
  votes: number;
  comments: Comment[];
  attachment?: string;
  reporter: string;
  experimentOwner?: string;
}

const productLabels = {
  "website-demand-capture": "Website / Demand Capture",
  "dof-onboarding": "DOF / Onboarding",
  "lynx-plus": "LYNX+ / Client Experience"
};

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
          timestamp: "2024-03-15 14:30"
        },
        {
          id: 2,
          text: "Could we also add a system preference detection?",
          timestamp: "2024-03-15 15:45"
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
          timestamp: "2024-03-14 09:15"
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

  // Add example bugs
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
          timestamp: "2024-03-16 10:00"
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
          timestamp: "2024-03-16 11:30"
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
  const { toast } = useToast();

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
    toast({
      title: "Success",
      description: "Feature request submitted successfully!"
    });
  };

  const handleBugSubmit = (bugData: {
    title: string;
    currentSituation: string;
    expectedBehavior: string;
    url: string;
    screenshot?: File;
  }) => {
    const newFeature: Feature = {
      id: features.length + 1,
      title: bugData.title,
      description: `Current Situation: ${bugData.currentSituation}\nExpected Behavior: ${bugData.expectedBehavior}\nURL: ${bugData.url}`,
      status: "new",
      product: "bug",
      votes: 0,
      comments: [],
      reporter: EXPERIMENT_OWNERS[0],
      attachment: bugData.screenshot ? URL.createObjectURL(bugData.screenshot) : undefined
    };
    setFeatures([...features, newFeature]);
    toast({
      title: "Success",
      description: "Bug report submitted successfully!"
    });
  };

  const handleFeatureUpdate = (id: number, updatedFeature: any) => {
    const updatedFeatures = features.map((f) =>
      f.id === id ? { ...f, ...updatedFeature } : f
    );
    setFeatures(updatedFeatures);
    setShowEditForm(false);
    setSelectedFeature(null);
    toast({
      title: "Success",
      description: "Feature updated successfully!"
    });
  };

  const handleEdit = (feature: Feature) => {
    setSelectedFeature(feature);
    setShowEditForm(true);
  };

  // Filter features and bugs separately
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
    .filter(bug => bug.product === "bug")
    .sort((a, b) => b.votes - a.votes);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-5xl">
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-lynx-text mb-2">Help Shape Our Product</h1>
        <p className="text-lynx-text-secondary text-sm sm:text-base">
          Your feedback is valuable! Submit feature requests or report bugs to help us improve.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
        <div className="w-full sm:w-1/2">
          <FeatureForm onSubmit={handleFeatureSubmit} />
        </div>
        <div className="w-full sm:w-1/2">
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

        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Select value={selectedProduct} onValueChange={setSelectedProduct}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by Product" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Products</SelectItem>
                {Object.entries(productLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="review">Under Review</SelectItem>
                <SelectItem value="progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="knowledge-portal">Knowledge Portal</SelectItem>
                <SelectItem value="marketing-section">Marketing Section</SelectItem>
                <SelectItem value="service-portal">Service Portal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="features">
          <div className="grid grid-cols-1 gap-4">
            {filteredAndSortedFeatures.map((feature) => (
              <FeatureCard
                key={feature.id}
                {...feature}
                onEdit={() => handleEdit(feature)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="bugs">
          <div className="grid grid-cols-1 gap-4">
            {filteredAndSortedBugs.map((bug) => (
              <FeatureCard
                key={bug.id}
                {...bug}
                onEdit={() => handleEdit(bug)}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;
