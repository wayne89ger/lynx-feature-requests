import { useState } from "react";
import { FeatureCard } from "@/components/feature-request/FeatureCard";
import { FeatureForm } from "@/components/feature-request/FeatureForm";
import { BugReportForm } from "@/components/bug-report/BugReportForm";
import { useToast } from "@/hooks/use-toast";
import { EditFeatureForm } from "@/components/feature-request/EditFeatureForm";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
      reporter: "LYNX - Wanja Aram"
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
        },
        {
          id: 4,
          text: "We should prioritize this for our field teams",
          timestamp: "2024-03-14 10:30"
        }
      ],
      reporter: "LYNX - Wanja Aram"
    },
    {
      id: 3,
      title: "Add export to PDF feature",
      description: "Allow users to export their data to PDF format",
      status: "review",
      product: "dof-onboarding",
      votes: 3,
      comments: [
        {
          id: 5,
          text: "This would help with offline documentation needs",
          timestamp: "2024-03-13 16:20"
        }
      ],
      reporter: "LYNX - Wanja Aram",
      experimentOwner: "John Smith"
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
      reporter: "LYNX - Wanja Aram",
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
      reporter: "LYNX - Wanja Aram",
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

  // Filter and sort features
  const filteredAndSortedFeatures = [...features]
    .filter(feature => 
      (selectedProduct === "all" || feature.product === selectedProduct) &&
      (selectedStatus === "all" || feature.status === selectedStatus) &&
      (selectedLocation === "all" || feature.location === selectedLocation) &&
      (selectedRequester === "all" || feature.reporter === selectedRequester) &&
      (selectedExperimentOwner === "all" || feature.experimentOwner === selectedExperimentOwner)
    )
    .sort((a, b) => b.votes - a.votes);

  // Get unique requesters and experiment owners for filters
  const uniqueRequesters = Array.from(new Set(features.map(f => f.reporter))).filter(Boolean);
  const uniqueExperimentOwners = Array.from(new Set(features.map(f => f.experimentOwner))).filter(Boolean);

  return (
    <div className="container mx-auto p-4">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-lynx-text mb-2">Help Shape Our Product</h1>
        <p className="text-lynx-text-secondary">
          Your feedback is valuable! Submit feature requests or report bugs to help us improve.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
        <FeatureForm onSubmit={handleFeatureSubmit} />
        <BugReportForm onSubmit={handleBugSubmit} />
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

      <div className="flex flex-wrap gap-4 mb-6 justify-center">
        <Select value={selectedProduct} onValueChange={setSelectedProduct}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Product" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Products</SelectItem>
            <SelectItem value="website-demand-capture">Website / Demand Capture</SelectItem>
            <SelectItem value="dof-onboarding">DOF / Onboarding</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-[180px]">
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
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            <SelectItem value="knowledge-portal">Knowledge Portal</SelectItem>
            <SelectItem value="marketing-section">Marketing Section</SelectItem>
            <SelectItem value="service-portal">Service Portal</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedRequester} onValueChange={setSelectedRequester}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Requester" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Requesters</SelectItem>
            {uniqueRequesters.map((requester) => (
              <SelectItem key={requester} value={requester}>{requester}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedExperimentOwner} onValueChange={setSelectedExperimentOwner}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Experiment Owner" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Experiment Owners</SelectItem>
            {uniqueExperimentOwners.map((owner) => (
              <SelectItem key={owner} value={owner}>{owner}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 gap-4 mt-8">
        {filteredAndSortedFeatures.map((feature) => (
          <FeatureCard
            key={feature.id}
            {...feature}
            onEdit={() => handleEdit(feature)}
          />
        ))}
      </div>
    </div>
  );
};

export default Index;

