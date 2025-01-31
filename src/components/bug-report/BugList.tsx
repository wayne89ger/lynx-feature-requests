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
          <Bug className="absolute -left-2 -top-2 text-destructive/60 w-6 h-6 z-10" />
          <FeatureCard
            {...bug}
            onEdit={() => onEdit(bug)}
          />
        </div>
      ))}
    </div>
  );
};