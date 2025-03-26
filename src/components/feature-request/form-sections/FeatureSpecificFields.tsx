
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EXPERIMENT_OWNERS } from "@/constants/experimentOwners";

interface FeatureSpecificFieldsProps {
  reviewers: string[];
  setReviewers: (value: string[]) => void;
  hypothesis?: string;
  setHypothesis: (value: string) => void;
  expectedOutcome?: string;
  setExpectedOutcome: (value: string) => void;
  type?: string;
  setType: (value: string) => void;
  experimentOwner?: string;
  setExperimentOwner: (value: string) => void;
  timeframe?: string;
  setTimeframe: (value: string) => void;
  userResearch?: string;
  setUserResearch: (value: string) => void;
  mvp?: string;
  setMvp: (value: string) => void;
}

export const FeatureSpecificFields = ({
  reviewers,
  setReviewers,
  hypothesis,
  setHypothesis,
  expectedOutcome,
  setExpectedOutcome,
  type,
  setType,
  experimentOwner,
  setExperimentOwner,
  timeframe,
  setTimeframe,
  userResearch,
  setUserResearch,
  mvp,
  setMvp,
}: FeatureSpecificFieldsProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="hypothesis">Hypothesis</Label>
          <Textarea
            id="hypothesis"
            value={hypothesis}
            onChange={(e) => setHypothesis(e.target.value)}
            placeholder="If we do X, then Y will happen"
            className="min-h-[80px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="expectedOutcome">Expected Outcome</Label>
          <Textarea
            id="expectedOutcome"
            value={expectedOutcome}
            onChange={(e) => setExpectedOutcome(e.target.value)}
            placeholder="What result do you expect?"
            className="min-h-[80px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger id="type">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="experiment">Experiment</SelectItem>
              <SelectItem value="mvp">MVP</SelectItem>
              <SelectItem value="research">Research</SelectItem>
              <SelectItem value="feature">Feature</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="experimentOwner">Experiment Owner</Label>
          <Select value={experimentOwner} onValueChange={setExperimentOwner}>
            <SelectTrigger id="experimentOwner">
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
          <Label htmlFor="timeframe">Timeframe</Label>
          <Input
            id="timeframe"
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            placeholder="e.g., Q3 2023"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="userResearch">User Research</Label>
          <Textarea
            id="userResearch"
            value={userResearch}
            onChange={(e) => setUserResearch(e.target.value)}
            placeholder="What user research supports this idea?"
            className="min-h-[80px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="mvp">MVP Definition</Label>
          <Textarea
            id="mvp"
            value={mvp}
            onChange={(e) => setMvp(e.target.value)}
            placeholder="What is the minimal viable product?"
            className="min-h-[80px]"
          />
        </div>
      </div>
    </div>
  );
};
