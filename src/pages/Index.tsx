import { useState } from "react";
import { FeatureCard } from "@/components/feature-request/FeatureCard";
import { FeatureForm } from "@/components/feature-request/FeatureForm";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

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
  votes: number;
  comments: Comment[];
  canContact?: boolean;
}

const initialFeatures: Feature[] = [
  {
    id: 1,
    title: "Email notification before an ad expires",
    description: "Send an email notification 5 days before an ad expires to check if renewal is desired.",
    status: "progress",
    product: "website-demand-capture",
    votes: 202,
    comments: [
      { id: 1, text: "This would be really helpful!", timestamp: "2024-01-30 10:00" },
      { id: 2, text: "Looking forward to this feature", timestamp: "2024-01-30 11:30" }
    ],
  },
  {
    id: 2,
    title: "Rename placement feature",
    description: "Allow renaming placements for better organization and clarity.",
    status: "review",
    product: "dof-onboarding",
    votes: 132,
    comments: [
      { id: 3, text: "This would make organization much easier", timestamp: "2024-01-29 15:20" }
    ],
  },
  {
    id: 3,
    title: "Multiple image support for ads",
    description: "Enable uploading multiple images for different devices and date ranges.",
    status: "new",
    product: "website-demand-capture",
    votes: 111,
    comments: [],
  },
];

const Index = () => {
  const [features, setFeatures] = useState<Feature[]>(initialFeatures);
  const [productFilter, setProductFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { toast } = useToast();

  const handleSubmit = (newFeature: {
    title: string;
    description: string;
    product: string;
    canContact: boolean;
  }) => {
    const feature: Feature = {
      id: features.length + 1,
      ...newFeature,
      status: "new",
      votes: 0,
      comments: [],
    };
    setFeatures((prev) => [feature, ...prev]);
  };

  const handleStatusChange = (id: number, newStatus: "new" | "review" | "progress" | "completed") => {
    setFeatures((prev) =>
      prev.map((feature) =>
        feature.id === id ? { ...feature, status: newStatus } : feature
      )
    );
    toast({
      title: "Status updated",
      description: "The feature request status has been updated successfully.",
    });
  };

  const handleAddComment = (featureId: number, text: string) => {
    setFeatures((prev) =>
      prev.map((feature) => {
        if (feature.id === featureId) {
          const newComment: Comment = {
            id: feature.comments.length + 1,
            text,
            timestamp: new Date().toLocaleString(),
          };
          return {
            ...feature,
            comments: [...feature.comments, newComment],
          };
        }
        return feature;
      })
    );
  };

  const filteredFeatures = features.filter((feature) => {
    const matchesProduct = productFilter === "all" || feature.product === productFilter;
    const matchesStatus = statusFilter === "all" || feature.status === statusFilter;
    return matchesProduct && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50 animate-fade-in">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Feature Requests</h1>
          <p className="text-gray-600 mb-8">Help shape the future by submitting and voting on features.</p>
          <FeatureForm onSubmit={handleSubmit} />
        </div>

        <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Filter by Product</Label>
              <Select value={productFilter} onValueChange={setProductFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Products</SelectItem>
                  <SelectItem value="website-demand-capture">Website / Demand Capture</SelectItem>
                  <SelectItem value="dof-onboarding">DOF / Onboarding</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Filter by Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="review">Under Review</SelectItem>
                  <SelectItem value="progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {filteredFeatures.map((feature) => (
            <FeatureCard 
              key={feature.id} 
              {...feature} 
              onStatusChange={handleStatusChange}
              onAddComment={handleAddComment}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;