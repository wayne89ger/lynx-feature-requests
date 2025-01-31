import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RiceScoreSectionProps {
  reach: number;
  impact: number;
  confidence: number;
  effort: number;
  setReach: (value: number) => void;
  setImpact: (value: number) => void;
  setConfidence: (value: number) => void;
  setEffort: (value: number) => void;
}

export const RiceScoreSection = ({
  reach,
  impact,
  confidence,
  effort,
  setReach,
  setImpact,
  setConfidence,
  setEffort,
}: RiceScoreSectionProps) => {
  const calculateRiceScore = () => {
    return ((reach * impact * confidence) / effort).toFixed(2);
  };

  return (
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
        <Label>Total RICE Score: {calculateRiceScore()}</Label>
      </div>
    </div>
  );
};