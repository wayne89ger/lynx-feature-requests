import { Feature } from "@/types/feature";
import { Bug } from "lucide-react";
import { BugCard } from "./BugCard";

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
          <BugCard
            id={bug.id}
            title={bug.title}
            description={bug.description}
            status={bug.status}
            product={bug.product}
            votes={bug.votes}
            comments={bug.comments}
            reporter={bug.reporter}
            onEdit={onEdit}
          />
        </div>
      ))}
    </div>
  );
};