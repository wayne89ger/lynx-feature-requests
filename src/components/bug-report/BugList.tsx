import { FeatureCard } from "../feature-request/FeatureCard";
import { Feature } from "@/types/feature";

interface BugListProps {
  bugs: Feature[];
  onEdit: (bug: Feature) => void;
}

export const BugList = ({ bugs, onEdit }: BugListProps) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {bugs.map((bug) => (
        <FeatureCard
          key={bug.id}
          {...bug}
          onEdit={() => onEdit(bug)}
        />
      ))}
    </div>
  );
};