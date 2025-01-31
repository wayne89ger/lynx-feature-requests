import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { ActionButtons } from "./form-sections/ActionButtons";
import { BasicInformation } from "./form-sections/BasicInformation";
import { FeatureSpecificFields } from "./form-sections/FeatureSpecificFields";

interface EditFeatureFormProps {
  feature: {
    id: number;
    title: string;
    description?: string;
    current_situation?: string;
    expected_behavior?: string;
    product: string;
    location?: string;
    url?: string;
  };
  open: boolean;
  onClose: () => void;
  onSave: (id: number, updatedFeature: any) => void;
}

export const EditFeatureForm = ({ feature, open, onClose, onSave }: EditFeatureFormProps) => {
  const [title, setTitle] = useState(feature.title);
  const [description, setDescription] = useState(feature.description || "");
  const [currentSituation, setCurrentSituation] = useState(feature.current_situation || "");
  const [expectedBehavior, setExpectedBehavior] = useState(feature.expected_behavior || "");
  const [url, setUrl] = useState(feature.url || "");
  const [product, setProduct] = useState(feature.product);
  const [location, setLocation] = useState(feature.location || "");
  const [hasShortcutStory, setHasShortcutStory] = useState(false);
  const [hasConfluenceDoc, setHasConfluenceDoc] = useState(false);
  
  // Feature-specific states
  const [hypothesis, setHypothesis] = useState("");
  const [expectedOutcome, setExpectedOutcome] = useState("");
  const [type, setType] = useState<"ab-test" | "seo-experiment">("ab-test");
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [metrics, setMetrics] = useState<string[]>([]);
  const [newMetric, setNewMetric] = useState("");
  const [userResearch, setUserResearch] = useState("");
  const [mvpStates, setMvpStates] = useState("");
  const [reach, setReach] = useState<number>(1);
  const [impact, setImpact] = useState<number>(1);
  const [confidence, setConfidence] = useState<number>(1);
  const [effort, setEffort] = useState<number>(1);
  const [experimentOwner, setExperimentOwner] = useState<string>("");
  
  const { toast } = useToast();

  const isBug = product === "bug";

  const handleSubmit = () => {
    if (!title || (!isBug && !description) || (isBug && !currentSituation) || !product) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const updatedData = isBug ? {
      title,
      current_situation: currentSituation,
      expected_behavior: expectedBehavior,
      url,
      product,
    } : {
      title,
      description,
      product,
      location: product === "website-demand-capture" ? location : undefined,
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
          <BasicInformation
            title={title}
            description={isBug ? currentSituation : description}
            expectedBehavior={expectedBehavior}
            url={url}
            product={product}
            location={location}
            isBug={isBug}
            setTitle={setTitle}
            setDescription={isBug ? setCurrentSituation : setDescription}
            setExpectedBehavior={setExpectedBehavior}
            setUrl={setUrl}
            setProduct={setProduct}
            setLocation={setLocation}
          />

          {!isBug && (
            <FeatureSpecificFields
              hypothesis={hypothesis}
              setHypothesis={setHypothesis}
              expectedOutcome={expectedOutcome}
              setExpectedOutcome={setExpectedOutcome}
              type={type}
              setType={setType}
              selectedMetrics={selectedMetrics}
              setSelectedMetrics={setSelectedMetrics}
              userResearch={userResearch}
              setUserResearch={setUserResearch}
              mvpStates={mvpStates}
              setMvpStates={setMvpStates}
              experimentOwner={experimentOwner}
              setExperimentOwner={setExperimentOwner}
              metrics={metrics}
              setMetrics={setMetrics}
              newMetric={newMetric}
              setNewMetric={setNewMetric}
              reach={reach}
              impact={impact}
              confidence={confidence}
              effort={effort}
              setReach={setReach}
              setImpact={setImpact}
              setConfidence={setConfidence}
              setEffort={setEffort}
            />
          )}

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