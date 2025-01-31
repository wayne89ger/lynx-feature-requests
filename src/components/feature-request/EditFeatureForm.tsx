import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { MetricsSection } from "./form-sections/MetricsSection";
import { RiceScoreSection } from "./form-sections/RiceScoreSection";
import { ActionButtons } from "./form-sections/ActionButtons";
import { EXPERIMENT_OWNERS } from "@/constants/experimentOwners";

const defaultMetrics = [
  "Avg. Organic Position",
  "Visits / Users",
  "Number of Leads / Conversions",
  "DOF Prefill CVR",
  "DOF Compl. CVR",
  "Bounce Rate",
  "Time spend on page",
  "Engagement Rate",
];

interface EditFeatureFormProps {
  feature: {
    id: number;
    title: string;
    description: string;
    product: string;
    location?: string;
  };
  open: boolean;
  onClose: () => void;
  onSave: (id: number, updatedFeature: any) => void;
}

export const EditFeatureForm = ({ feature, open, onClose, onSave }: EditFeatureFormProps) => {
  const [title, setTitle] = useState(feature.title);
  const [description, setDescription] = useState(feature.description);
  const [product, setProduct] = useState(feature.product);
  const [location, setLocation] = useState(feature.location || "");
  const [hypothesis, setHypothesis] = useState("");
  const [expectedOutcome, setExpectedOutcome] = useState("");
  const [type, setType] = useState<"ab-test" | "seo-experiment">("ab-test");
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [userResearch, setUserResearch] = useState("");
  const [mvpStates, setMvpStates] = useState("");
  const [reach, setReach] = useState<number>(1);
  const [impact, setImpact] = useState<number>(1);
  const [confidence, setConfidence] = useState<number>(1);
  const [effort, setEffort] = useState<number>(1);
  const [metrics, setMetrics] = useState<string[]>(defaultMetrics);
  const [newMetric, setNewMetric] = useState("");
  const [experimentOwner, setExperimentOwner] = useState<string>(EXPERIMENT_OWNERS[0]);
  const [hasShortcutStory, setHasShortcutStory] = useState(false);
  const [hasConfluenceDoc, setHasConfluenceDoc] = useState(false);
  const { toast } = useToast();

  const isBug = product === "bug";

  const handleSubmit = () => {
    if (!title || !description || !product) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const updatedData = isBug ? {
      title,
      current_situation: description,
      product,
    } : {
      title,
      description,
      product,
      location: product === "website-demand-capture" ? location : undefined,
      hypothesis,
      expectedOutcome,
      type,
      selectedMetrics,
      userResearch,
      mvpStates,
      experimentOwner,
      riceScore: {
        reach,
        impact,
        confidence,
        effort,
        total: ((reach * impact * confidence) / effort).toFixed(2),
      },
    };

    onSave(feature.id, updatedData);
    onClose();
    
    toast({
      title: isBug ? "Bug updated" : "Feature updated",
      description: "Your changes have been saved successfully.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isBug ? "Edit bug report" : "Edit feature request"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 mt-4 max-h-[70vh] overflow-y-auto">
          {/* Basic Information */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">
              {isBug ? "Current Situation" : "Description"}
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          {/* Product Selection */}
          <div className="space-y-2">
            <Label htmlFor="product">Product</Label>
            <Select value={product} onValueChange={setProduct}>
              <SelectTrigger>
                <SelectValue placeholder="Select a product" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="website-demand-capture">Website / Demand Capture</SelectItem>
                <SelectItem value="dof-onboarding">DOF / Onboarding</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Feature-specific fields */}
          {!isBug && (
            <>
              {product === "website-demand-capture" && (
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="knowledge-portal">Knowledge Portal</SelectItem>
                      <SelectItem value="marketing-section">Marketing Section</SelectItem>
                      <SelectItem value="service-portal">Service Portal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <MetricsSection
                metrics={metrics}
                selectedMetrics={selectedMetrics}
                newMetric={newMetric}
                setNewMetric={setNewMetric}
                setMetrics={setMetrics}
                setSelectedMetrics={setSelectedMetrics}
              />

              <RiceScoreSection
                reach={reach}
                impact={impact}
                confidence={confidence}
                effort={effort}
                setReach={setReach}
                setImpact={setImpact}
                setConfidence={setConfidence}
                setEffort={setEffort}
              />
            </>
          )}

          {/* Action Buttons */}
          <ActionButtons
            onSubmit={handleSubmit}
            onShortcutAction={() => {
              setHasShortcutStory(true);
              toast({
                title: hasShortcutStory ? "Synced with Shortcut" : "Added to Shortcut",
                description: "This functionality will be implemented soon",
              });
            }}
            onConfluenceAction={() => {
              setHasConfluenceDoc(true);
              toast({
                title: hasConfluenceDoc ? "Synced with Confluence" : "Added to Confluence",
                description: "This functionality will be implemented soon",
              });
            }}
            hasShortcutStory={hasShortcutStory}
            hasConfluenceDoc={hasConfluenceDoc}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};