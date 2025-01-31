import { EXPERIMENT_OWNERS } from "@/constants/experimentOwners";
import { MetricsSection } from "./MetricsSection";
import { RiceScoreSection } from "./RiceScoreSection";

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
}

export const FeatureSpecificFields = ({
  metrics,
  selectedMetrics,
  newMetric,
  setNewMetric,
  setMetrics,
  setSelectedMetrics,
  reach,
  impact,
  confidence,
  effort,
  setReach,
  setImpact,
  setConfidence,
  setEffort,
}: FeatureSpecificFieldsProps) => {
  return (
    <>
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
  );
};