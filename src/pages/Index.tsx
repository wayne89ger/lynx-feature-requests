import { useState } from "react";
import { FeatureCard } from "@/components/feature-request/FeatureCard";
import { FeatureForm } from "@/components/feature-request/FeatureForm";
import { BugReportForm } from "@/components/bug-report/BugReportForm";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { EditFeatureForm } from "@/components/feature-request/EditFeatureForm";

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

const Index = () => {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [formType, setFormType] = useState<"feature" | "bug">("feature");
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

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <Label htmlFor="form-type">Select Form Type</Label>
        <Select
          value={formType}
          onValueChange={(value: "feature" | "bug") => setFormType(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select form type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="feature">Feature Request</SelectItem>
            <SelectItem value="bug">Bug Report</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {formType === "feature" ? (
        <FeatureForm onSubmit={handleFeatureSubmit} />
      ) : (
        <BugReportForm onSubmit={handleBugSubmit} />
      )}

      {showEditForm && selectedFeature && (
        <EditFeatureForm
          feature={selectedFeature}
          open={showEditForm}
          onClose={() => {
            setShowEditForm(false);
            setSelectedFeature(null);
          }}
          onSave={handleFeatureUpdate}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {features.map((feature) => (
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
