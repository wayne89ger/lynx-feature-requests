import { FeatureCard } from "../feature-request/FeatureCard";
import { Feature } from "@/types/feature";
import { Bug } from "lucide-react";

interface BugListProps {
  bugs: Feature[];
  onEdit: (bug: Feature) => void;
}

export const BugList = ({ bugs, onEdit }: BugListProps) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {bugs.map((bug) => (
        <div key={bug.id} className="relative">
          <Bug className="absolute left-4 top-4 text-destructive/70 w-5 h-5" />
          <FeatureCard
            {...bug}
            onEdit={() => onEdit(bug)}
          />
        </div>
      ))}
    </div>
  );
};