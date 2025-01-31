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
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";

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
  const { toast } = useToast();

  const handleMetricSelect = (metric: string) => {
    if (selectedMetrics.includes(metric)) {
      setSelectedMetrics(selectedMetrics.filter((m) => m !== metric));
    } else if (selectedMetrics.length < 3) {
      setSelectedMetrics([...selectedMetrics, metric]);
    } else {
      toast({
        title: "Maximum metrics reached",
        description: "You can only select up to 3 metrics",
        variant: "destructive",
      });
    }
  };

  const handleAddMetric = () => {
    if (!newMetric.trim()) {
      toast({
        title: "Invalid metric",
        description: "Please enter a metric name",
        variant: "destructive",
      });
      return;
    }

    if (metrics.includes(newMetric.trim())) {
      toast({
        title: "Duplicate metric",
        description: "This metric already exists",
        variant: "destructive",
      });
      return;
    }

    setMetrics([...metrics, newMetric.trim()]);
    setNewMetric("");
    toast({
      title: "Metric added",
      description: "New metric has been added successfully",
    });
  };

  const calculateRICEScore = () => {
    return ((reach * impact * confidence) / effort).toFixed(2);
  };

  const handleSubmit = () => {
    if (!title || !description || !product) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    onSave(feature.id, {
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
      riceScore: {
        reach,
        impact,
        confidence,
        effort,
        total: calculateRICEScore(),
      },
    });

    onClose();
    toast({
      title: "Feature updated",
      description: "Your changes have been saved successfully.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit feature request</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 mt-4 max-h-[70vh] overflow-y-auto">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="product">Product</Label>
            <Select value={product} onValueChange={(value) => {
              setProduct(value);
              if (value !== "website-demand-capture") {
                setLocation("");
              }
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Select a product" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="website-demand-capture">Website / Demand Capture</SelectItem>
                <SelectItem value="dof-onboarding">DOF / Onboarding</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
          <div className="space-y-2">
            <Label htmlFor="hypothesis">Hypothesis</Label>
            <Textarea
              id="hypothesis"
              value={hypothesis}
              onChange={(e) => setHypothesis(e.target.value)}
              placeholder="What is your hypothesis?"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="expectedOutcome">Expected Outcome</Label>
            <Textarea
              id="expectedOutcome"
              value={expectedOutcome}
              onChange={(e) => setExpectedOutcome(e.target.value)}
              placeholder="What outcome do you expect?"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select value={type} onValueChange={(value: "ab-test" | "seo-experiment") => setType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ab-test">A/B Test</SelectItem>
                <SelectItem value="seo-experiment">SEO Experiment</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Metrics (select up to 3)</Label>
            <div className="flex items-center gap-2 mb-2">
              <Input
                placeholder="Add new metric"
                value={newMetric}
                onChange={(e) => setNewMetric(e.target.value)}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleAddMetric}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {metrics.map((metric) => (
                <Badge
                  key={metric}
                  variant={selectedMetrics.includes(metric) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => handleMetricSelect(metric)}
                >
                  {metric}
                  {selectedMetrics.includes(metric) && (
                    <X className="w-3 h-3 ml-1" />
                  )}
                </Badge>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="userResearch">User Research / Inspiration</Label>
            <Textarea
              id="userResearch"
              value={userResearch}
              onChange={(e) => setUserResearch(e.target.value)}
              placeholder="Add any user research or inspiration"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mvpStates">MVP / Expansion states</Label>
            <Textarea
              id="mvpStates"
              value={mvpStates}
              onChange={(e) => setMvpStates(e.target.value)}
              placeholder="Describe MVP and expansion states"
            />
          </div>
          <div className="space-y-4">
            <Label>RICE Score</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="reach">Reach (1-10)</Label>
                <Input
                  id="reach"
                  type="number"
                  min="1"
                  max="10"
                  value={reach}
                  onChange={(e) => setReach(Number(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="impact">Impact (1-10)</Label>
                <Input
                  id="impact"
                  type="number"
                  min="1"
                  max="10"
                  value={impact}
                  onChange={(e) => setImpact(Number(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="confidence">Confidence (1-10)</Label>
                <Input
                  id="confidence"
                  type="number"
                  min="1"
                  max="10"
                  value={confidence}
                  onChange={(e) => setConfidence(Number(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="effort">Effort (1-10)</Label>
                <Input
                  id="effort"
                  type="number"
                  min="1"
                  max="10"
                  value={effort}
                  onChange={(e) => setEffort(Number(e.target.value))}
                />
              </div>
            </div>
            <div className="mt-2">
              <Label>Total RICE Score: {calculateRICEScore()}</Label>
            </div>
          </div>
          <Button onClick={handleSubmit} className="w-full">
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};