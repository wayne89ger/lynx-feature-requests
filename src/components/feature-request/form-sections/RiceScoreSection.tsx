
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RiceScoreSectionProps {
  reach: number;
  impact: number;
  confidence: number;
  effort: number;
  riceScore?: number; // Added this prop to match the props passed in EditFeatureForm
  setReach: (value: number) => void;
  setImpact: (value: number) => void;
  setConfidence: (value: number) => void;
  setEffort: (value: number) => void;
  setRiceScore?: (value: number) => void; // Added this prop to match the props passed in EditFeatureForm
}

export const RiceScoreSection = ({
  reach,
  impact,
  confidence,
  effort,
  riceScore,
  setReach,
  setImpact,
  setConfidence,
  setEffort,
  setRiceScore,
}: RiceScoreSectionProps) => {
  const calculateRiceScore = () => {
    const total = ((reach * impact * confidence) / 100) / effort;
    // Update riceScore state if the prop is provided
    if (setRiceScore) {
      setRiceScore(total);
    }
    return total.toFixed(2);
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
          <Label htmlFor="confidence">Confidence (1-100)</Label>
          <Input
            id="confidence"
            type="number"
            min="1"
            max="100"
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
