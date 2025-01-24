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

interface Feature {
  id: number;
  title: string;
  description: string;
  status: "new" | "review" | "progress" | "completed";
  category: string;
  votes: number;
  comments: number;
}

const initialFeatures: Feature[] = [
  {
    id: 1,
    title: "Email notification before an ad expires",
    description: "Send an email notification 5 days before an ad expires to check if renewal is desired.",
    status: "progress",
    category: "demand-capture",
    votes: 202,
    comments: 15,
  },
  {
    id: 2,
    title: "Rename placement feature",
    description: "Allow renaming placements for better organization and clarity.",
    status: "review",
    category: "onboarding",
    votes: 132,
    comments: 8,
  },
  {
    id: 3,
    title: "Multiple image support for ads",
    description: "Enable uploading multiple images for different devices and date ranges.",
    status: "new",
    category: "demand-capture",
    votes: 111,
    comments: 12,
  },
];

const Index = () => {
  const [features, setFeatures] = useState<Feature[]>(initialFeatures);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const handleSubmit = (newFeature: {
    title: string;
    description: string;
    category: string;
  }) => {
    const feature: Feature = {
      id: features.length + 1,
      ...newFeature,
      status: "new",
      votes: 0,
      comments: 0,
    };
    setFeatures((prev) => [feature, ...prev]);
  };

  const filteredFeatures = features.filter((feature) => {
    const matchesCategory = categoryFilter === "all" || feature.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || feature.status === statusFilter;
    return matchesCategory && matchesStatus;
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
              <Label>Filter by Category</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="demand-capture">Demand Capture</SelectItem>
                  <SelectItem value="onboarding">Onboarding</SelectItem>
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
            <FeatureCard key={feature.id} {...feature} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;