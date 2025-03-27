import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { Feature } from "@/types/feature";
import { productLabels, locationLabels, allProducts } from "./constants";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PlusCircle, CheckCircle, AlertCircle } from "lucide-react";

interface EditFeatureFormProps {
  feature: Feature;
  open: boolean;
  onSave: (id: number, updatedFeature: any) => void;
  onClose: () => void;
}

const BasicInformation = ({
  title,
  description,
  expectedBehavior,
  url,
  product,
  location,
  isBug,
  setTitle,
  setDescription,
  setExpectedBehavior,
  setUrl,
  setProduct,
  setLocation,
}: {
  title: string;
  description: string;
  expectedBehavior: string;
  url: string;
  product: string;
  location: string;
  isBug: boolean;
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setExpectedBehavior: (expectedBehavior: string) => void;
  setUrl: (url: string) => void;
  setProduct: (product: string) => void;
  setLocation: (location: string) => void;
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      {isBug && (
        <>
          <div>
            <Label htmlFor="currentSituation">Current Situation</Label>
            <Textarea
              id="currentSituation"
              value={expectedBehavior}
              onChange={(e) => setExpectedBehavior(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
        </>
      )}
      <div>
        <Label htmlFor="product">Product</Label>
        <Select value={product} onValueChange={setProduct}>
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="Select a product" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(productLabels).map((key) => (
              <SelectItem key={key} value={key}>
                {productLabels[key as keyof typeof productLabels].full}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="location">Location</Label>
        <Select value={location} onValueChange={setLocation}>
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="Select a location" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(locationLabels).map((key) => (
              <SelectItem key={key} value={key}>
                {locationLabels[key as keyof typeof locationLabels].full}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

const UrgencySelection = ({
  urgency,
  setUrgency,
}: {
  urgency: string;
  setUrgency: (urgency: string) => void;
}) => {
  return (
    <div>
      <Label htmlFor="urgency">Urgency</Label>
      <Select value={urgency} onValueChange={setUrgency}>
        <SelectTrigger className="bg-white">
          <SelectValue placeholder="Select urgency" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="low">Low</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="high">High</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

const FeatureSpecificFields = ({
  hypothesis,
  expectedOutcome,
  type,
  experimentOwner,
  timeframe,
  setHypothesis,
  setExpectedOutcome,
  setType,
  setExperimentOwner,
  setTimeframe,
}: {
  hypothesis: string;
  expectedOutcome: string;
  type: string;
  experimentOwner: string;
  timeframe: string;
  setHypothesis: (hypothesis: string) => void;
  setExpectedOutcome: (expectedOutcome: string) => void;
  setType: (type: string) => void;
  setExperimentOwner: (experimentOwner: string) => void;
  setTimeframe: (timeframe: string) => void;
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="hypothesis">Hypothesis</Label>
        <Textarea
          id="hypothesis"
          value={hypothesis}
          onChange={(e) => setHypothesis(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="expectedOutcome">Expected Outcome</Label>
        <Textarea
          id="expectedOutcome"
          value={expectedOutcome}
          onChange={(e) => setExpectedOutcome(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="type">Type</Label>
        <Input
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="experimentOwner">Experiment Owner</Label>
        <Input
          id="experimentOwner"
          value={experimentOwner}
          onChange={(e) => setExperimentOwner(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="timeframe">Timeframe</Label>
        <Input
          id="timeframe"
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
        />
      </div>
    </div>
  );
};

const MetricsSection = ({
  metrics,
  setMetrics,
  userResearch,
  setUserResearch,
  mvp,
  setMvp,
}: {
  metrics: string[];
  setMetrics: (metrics: string[]) => void;
  userResearch: string;
  setUserResearch: (userResearch: string) => void;
  mvp: string;
  setMvp: (mvp: string) => void;
}) => {
  const handleAddMetric = () => {
    setMetrics([...metrics, ""]);
  };

  const handleMetricChange = (index: number, value: string) => {
    const newMetrics = [...metrics];
    newMetrics[index] = value;
    setMetrics(newMetrics);
  };

  const handleRemoveMetric = (index: number) => {
    const newMetrics = [...metrics];
    newMetrics.splice(index, 1);
    setMetrics(newMetrics);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Metrics</Label>
        {metrics.map((metric, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Input
              type="text"
              value={metric}
              onChange={(e) => handleMetricChange(index, e.target.value)}
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => handleRemoveMetric(index)}
            >
              <AlertCircle className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button type="button" variant="ghost" onClick={handleAddMetric}>
          Add Metric <PlusCircle className="h-4 w-4 ml-2" />
        </Button>
      </div>
      <div>
        <Label htmlFor="userResearch">User Research</Label>
        <Textarea
          id="userResearch"
          value={userResearch}
          onChange={(e) => setUserResearch(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="mvp">MVP</Label>
        <Textarea
          id="mvp"
          value={mvp}
          onChange={(e) => setMvp(e.target.value)}
        />
      </div>
    </div>
  );
};

const RiceScoreSection = ({
  riceScore,
  setRiceScore,
}: {
  riceScore: {
    reach: number;
    impact: number;
    confidence: number;
    effort: number;
    total: number;
  };
  setRiceScore: (riceScore: any) => void;
}) => {
  const handleScoreChange = (field: string, value: number) => {
    const newRiceScore = {
      ...riceScore,
      [field]: value,
    };
    newRiceScore.total =
      (newRiceScore.reach * newRiceScore.impact * newRiceScore.confidence) /
      newRiceScore.effort;
    setRiceScore(newRiceScore);
  };

  return (
    <div className="space-y-4">
      <Label>RICE Score</Label>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="reach">Reach</Label>
          <Input
            type="number"
            id="reach"
            value={riceScore.reach}
            onChange={(e) =>
              handleScoreChange("reach", Number(e.target.value))
            }
          />
        </div>
        <div>
          <Label htmlFor="impact">Impact</Label>
          <Input
            type="number"
            id="impact"
            value={riceScore.impact}
            onChange={(e) =>
              handleScoreChange("impact", Number(e.target.value))
            }
          />
        </div>
        <div>
          <Label htmlFor="confidence">Confidence</Label>
          <Input
            type="number"
            id="confidence"
            value={riceScore.confidence}
            onChange={(e) =>
              handleScoreChange("confidence", Number(e.target.value))
            }
          />
        </div>
        <div>
          <Label htmlFor="effort">Effort</Label>
          <Input
            type="number"
            id="effort"
            value={riceScore.effort}
            onChange={(e) =>
              handleScoreChange("effort", Number(e.target.value))
            }
          />
        </div>
      </div>
      <div>
        <Label htmlFor="total">Total</Label>
        <Input type="number" id="total" value={riceScore.total} disabled />
      </div>
    </div>
  );
};

export const EditFeatureForm = ({
  feature,
  open,
  onSave,
  onClose,
}: EditFeatureFormProps) => {
  const [title, setTitle] = useState(feature.title);
  const [description, setDescription] = useState(feature.description);
  const [currentSituation, setCurrentSituation] = useState("");
  const [url, setUrl] = useState("");
  const [product, setProduct] = useState(feature.product);
  const [location, setLocation] = useState(feature.location || "");
  const [urgency, setUrgency] = useState(feature.urgency || "medium");
  const [hypothesis, setHypothesis] = useState(feature.hypothesis || "");
  const [expectedOutcome, setExpectedOutcome] = useState(
    feature.expected_outcome || ""
  );
  const [type, setType] = useState(feature.type || "");
  const [experimentOwner, setExperimentOwner] = useState(
    feature.experiment_owner || ""
  );
  const [timeframe, setTimeframe] = useState(feature.timeframe || "");
  const [metrics, setMetrics] = useState(feature.metrics || []);
  const [userResearch, setUserResearch] = useState(feature.user_research || "");
  const [mvp, setMvp] = useState(feature.mvp || "");
  const [riceScore, setRiceScore] = useState(feature.rice_score || {
    reach: 1,
    impact: 1,
    confidence: 100,
    effort: 1,
    total: 0,
  });

  const isBug = feature.product === "bug";

  useEffect(() => {
    if (isBug) {
      setTitle(feature.title);
      setDescription(feature.description);
      setCurrentSituation(feature.current_situation || "");
      setUrl(feature.url || "");
      setProduct(feature.product);
    } else {
      setTitle(feature.title);
      setDescription(feature.description);
      setProduct(feature.product);
      setLocation(feature.location || "");
      setUrgency(feature.urgency || "medium");
      setHypothesis(feature.hypothesis || "");
      setExpectedOutcome(feature.expected_outcome || "");
      setType(feature.type || "");
      setExperimentOwner(feature.experiment_owner || "");
      setTimeframe(feature.timeframe || "");
      setMetrics(feature.metrics || []);
      setUserResearch(feature.user_research || "");
      setMvp(feature.mvp || "");
      setRiceScore(feature.rice_score || {
        reach: 1,
        impact: 1,
        confidence: 100,
        effort: 1,
        total: 0,
      });
    }
  }, [feature, isBug]);

  const handleSave = () => {
    const updatedFeature = {
      title,
      description,
      product,
      location,
      urgency,
      hypothesis,
      expected_outcome,
      type,
      experiment_owner,
      timeframe,
      metrics,
      user_research,
      mvp,
      rice_score: riceScore,
      current_situation: currentSituation,
      url: url,
    };
    onSave(feature.id, updatedFeature);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Feature Request</DialogTitle>
          <DialogDescription>
            Make changes to the feature request. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-6">
          <BasicInformation
            title={title}
            description={description}
            expectedBehavior={currentSituation}
            url={url}
            product={product}
            location={location}
            isBug={isBug}
            setTitle={setTitle}
            setDescription={setDescription}
            setExpectedBehavior={setCurrentSituation}
            setUrl={setUrl}
            setProduct={setProduct}
            setLocation={setLocation}
          />

          {!isBug && (
            <>
              <UrgencySelection urgency={urgency} setUrgency={setUrgency} />
              <FeatureSpecificFields
                hypothesis={hypothesis}
                expectedOutcome={expectedOutcome}
                type={type}
                experimentOwner={experimentOwner}
                timeframe={timeframe}
                setHypothesis={setHypothesis}
                setExpectedOutcome={setExpectedOutcome}
                setType={setType}
                setExperimentOwner={setExperimentOwner}
                setTimeframe={setTimeframe}
              />
              <MetricsSection
                metrics={metrics}
                setMetrics={setMetrics}
                userResearch={userResearch}
                setUserResearch={setUserResearch}
                mvp={mvp}
                setMvp={setMvp}
              />
              <RiceScoreSection
                riceScore={riceScore}
                setRiceScore={setRiceScore}
              />
            </>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSave}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
