
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
import { TagsSelection } from "./form-sections/TagsSelection";
import { MetricsSection } from "./form-sections/MetricsSection";
import { RiceScoreSection } from "./form-sections/RiceScoreSection";
import { EXPERIMENT_OWNERS } from "@/constants/experimentOwners";

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
    tags?: string[];
    hypothesis?: string;
    expected_outcome?: string;
    type?: string;
    experiment_owner?: string;
    timeframe?: string;
    metrics?: string[];
    user_research?: string;
    mvp?: string;
    rice_score?: {
      reach: number;
      impact: number;
      confidence: number;
      effort: number;
      total: number;
    };
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
  const [tags, setTags] = useState<string[]>(feature.tags || []);
  
  const [hypothesis, setHypothesis] = useState(feature.hypothesis || "");
  const [expectedOutcome, setExpectedOutcome] = useState(feature.expected_outcome || "");
  const [type, setType] = useState(feature.type || "");
  const [experimentOwner, setExperimentOwner] = useState(feature.experiment_owner || "");
  const [timeframe, setTimeframe] = useState(feature.timeframe || "");
  const [metrics, setMetrics] = useState<string[]>(["Engagement", "Retention", "Conversion", "Revenue"]);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(feature.metrics || []);
  const [newMetric, setNewMetric] = useState("");
  const [userResearch, setUserResearch] = useState(feature.user_research || "");
  const [mvp, setMvp] = useState(feature.mvp || "");
  
  const [reach, setReach] = useState(feature.rice_score?.reach || 1);
  const [impact, setImpact] = useState(feature.rice_score?.impact || 1);
  const [confidence, setConfidence] = useState(feature.rice_score?.confidence || 100);
  const [effort, setEffort] = useState(feature.rice_score?.effort || 1);
  const [riceScore, setRiceScore] = useState(feature.rice_score?.total || 0);
  
  const [reviewers, setReviewers] = useState<string[]>([]);
  
  const { toast } = useToast();

  const isBug = product === "bug";

  const handleSubmit = () => {
    if (!title) {
      toast({
        title: "Title is required",
        variant: "destructive",
      });
      return;
    }

    const totalRiceScore = ((reach * impact * confidence) / 100) / effort;

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
      reviewers,
      tags,
      hypothesis,
      expected_outcome: expectedOutcome,
      type,
      experiment_owner: experimentOwner,
      timeframe,
      metrics: selectedMetrics,
      user_research: userResearch,
      mvp,
      rice_score: {
        reach,
        impact,
        confidence,
        effort,
        total: totalRiceScore,
      }
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
            <>
              {/* Moved tags section here, right after basic information */}
              <TagsSelection 
                selectedTags={tags} 
                onChange={setTags} 
              />
              
              <FeatureSpecificFields
                reviewers={reviewers}
                setReviewers={setReviewers}
                hypothesis={hypothesis}
                setHypothesis={setHypothesis}
                expectedOutcome={expectedOutcome}
                setExpectedOutcome={setExpectedOutcome}
                type={type}
                setType={setType}
                experimentOwner={experimentOwner}
                setExperimentOwner={setExperimentOwner}
                timeframe={timeframe}
                setTimeframe={setTimeframe}
                userResearch={userResearch}
                setUserResearch={setUserResearch}
                mvp={mvp}
                setMvp={setMvp}
              />
              
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
                riceScore={riceScore}
                setReach={setReach}
                setImpact={setImpact}
                setConfidence={setConfidence}
                setEffort={setEffort}
                setRiceScore={setRiceScore}
              />
            </>
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
