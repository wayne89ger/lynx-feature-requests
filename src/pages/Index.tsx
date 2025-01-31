import { useState } from "react";
import { FeatureCard } from "@/components/feature-request/FeatureCard";
import { FeatureForm } from "@/components/feature-request/FeatureForm";
import { BugReportForm } from "@/components/bug-report/BugReportForm";
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
  const [features, setFeatures] = useState<Feature[]>([
    {
      id: 1,
      title: "Add dark mode support",
      description: "Implement a dark mode theme for better visibility in low-light conditions",
      status: "new",
      product: "website-demand-capture",
      location: "knowledge-portal",
      votes: 5,
      comments: [],
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
      comments: [],
      reporter: "LYNX - Wanja Aram"
    },
    {
      id: 3,
      title: "Add export to PDF feature",
      description: "Allow users to export their data to PDF format",
      status: "review",
      product: "dof-onboarding",
      votes: 3,
      comments: [],
      reporter: "LYNX - Wanja Aram"
    }
  ]);
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);
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
      <div className="flex gap-4 mb-8">
        <FeatureForm onSubmit={handleFeatureSubmit} />
        <BugReportForm onSubmit={handleBugSubmit} />
      </div>

      {showEditForm && selectedFeature && (
        <EditFeatureForm
          feature={selectedFeature}
          onSave={handleFeatureUpdate}
          onClose={() => {
            setShowEditForm(false);
            setSelectedFeature(null);
          }}
        />
      )}

      <div className="grid grid-cols-1 gap-4 mt-8">
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