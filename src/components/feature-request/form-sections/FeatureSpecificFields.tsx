
import { EXPERIMENT_OWNERS } from "@/constants/experimentOwners";
import { MetricsSection } from "./MetricsSection";
import { RiceScoreSection } from "./RiceScoreSection";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FeatureSpecificFieldsProps {
  hypothesis: string;
  setHypothesis: (value: string) => void;
  expectedOutcome: string;
  setExpectedOutcome: (value: string) => void;
  type: "ab-test" | "seo-experiment";
  setType: (value: "ab-test" | "seo-experiment") => void;
  selectedMetrics: string[];
  setSelectedMetrics: (value: string[]) => void;
  userResearch: string;
  setUserResearch: (value: string) => void;
  mvpStates: string;
  setMvpStates: (value: string) => void;
  experimentOwner: string;
  setExperimentOwner: (value: string) => void;
  metrics: string[];
  setMetrics: (value: string[]) => void;
  newMetric: string;
  setNewMetric: (value: string) => void;
  reach: number;
  impact: number;
  confidence: number;
  effort: number;
  setReach: (value: number) => void;
  setImpact: (value: number) => void;
  setConfidence: (value: number) => void;
  setEffort: (value: number) => void;
  reviewers: string[];
  setReviewers: (value: string[]) => void;
  timeframe: string;
  setTimeframe: (value: string) => void;
}

export const FeatureSpecificFields = ({
  hypothesis,
  setHypothesis,
  expectedOutcome,
  setExpectedOutcome,
  type,
  setType,
  selectedMetrics,
  setSelectedMetrics,
  userResearch,
  setUserResearch,
  mvpStates,
  setMvpStates,
  experimentOwner,
  setExperimentOwner,
  metrics,
  setMetrics,
  newMetric,
  setNewMetric,
  reach,
  impact,
  confidence,
  effort,
  setReach,
  setImpact,
  setConfidence,
  setEffort,
  reviewers,
  setReviewers,
  timeframe,
  setTimeframe,
}: FeatureSpecificFieldsProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Hypothesis</Label>
          <Textarea
            placeholder="Enter your hypothesis..."
            value={hypothesis}
            onChange={(e) => setHypothesis(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Expected Outcome</Label>
          <Textarea
            placeholder="What results do you expect..."
            value={expectedOutcome}
            onChange={(e) => setExpectedOutcome(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Type</Label>
          <RadioGroup value={type} onValueChange={(value: "ab-test" | "seo-experiment") => setType(value)}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="ab-test" id="ab-test" />
              <Label htmlFor="ab-test">A/B Test</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="seo-experiment" id="seo-experiment" />
              <Label htmlFor="seo-experiment">SEO Experiment</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label>Experiment Owner</Label>
          <Select value={experimentOwner} onValueChange={setExperimentOwner}>
            <SelectTrigger>
              <SelectValue placeholder="Select experiment owner" />
            </SelectTrigger>
            <SelectContent>
              {EXPERIMENT_OWNERS.map((owner) => (
                <SelectItem key={owner} value={owner}>
                  {owner}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Timeframe</Label>
          <Input
            placeholder="e.g., 3 months"
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
          />
        </div>

        <MetricsSection
          metrics={metrics}
          selectedMetrics={selectedMetrics}
          newMetric={newMetric}
          setNewMetric={setNewMetric}
          setMetrics={setMetrics}
          setSelectedMetrics={setSelectedMetrics}
        />

        <div className="space-y-2">
          <Label>User Research / Inspiration</Label>
          <Textarea
            placeholder="Enter user research findings or inspiration..."
            value={userResearch}
            onChange={(e) => setUserResearch(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>MVP / Expansion Stages</Label>
          <Textarea
            placeholder="Describe the MVP and expansion stages..."
            value={mvpStates}
            onChange={(e) => setMvpStates(e.target.value)}
          />
        </div>

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
      </div>
    </div>
  );
};
