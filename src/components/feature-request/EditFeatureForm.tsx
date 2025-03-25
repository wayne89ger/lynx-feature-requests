
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
    squad?: string;
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
  const [squad, setSquad] = useState(feature.squad || "");
  const [location, setLocation] = useState(feature.location || "");
  const [hasShortcutStory, setHasShortcutStory] = useState(false);
  const [hasConfluenceDoc, setHasConfluenceDoc] = useState(false);
  
  // Feature-specific states - simplified
  const [reviewers, setReviewers] = useState<string[]>([]);
  
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
      squad,
      location,
      reviewers
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
            squad={squad}
            location={location}
            isBug={isBug}
            setTitle={setTitle}
            setDescription={isBug ? setCurrentSituation : setDescription}
            setExpectedBehavior={setExpectedBehavior}
            setUrl={setUrl}
            setProduct={setProduct}
            setSquad={setSquad}
            setLocation={setLocation}
          />

          {!isBug && (
            <FeatureSpecificFields
              reviewers={reviewers}
              setReviewers={setReviewers}
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
