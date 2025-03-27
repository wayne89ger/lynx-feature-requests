
import { Feature } from "@/types/feature";
import { Bug } from "lucide-react";
import { BugCard } from "./BugCard";

interface BugListProps {
  bugs: Feature[];
  onEdit: (bug: Feature) => void;
  onDelete: (id: number) => void;
}

export const BugList = ({ bugs, onEdit, onDelete }: BugListProps) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {bugs.map((bug) => (
        <div key={bug.id} className="relative">
          <Bug className="absolute left-4 top-4 text-destructive/70 w-5 h-5" />
          <BugCard
            id={bug.id}
            title={bug.title}
            description={bug.description}
            status={bug.status as "new" | "progress" | "completed" | "unresolvable"}
            product={bug.product}
            votes={bug.votes}
            comments={bug.comments}
            reporter={bug.reporter}
            onEdit={onEdit}
            onDelete={onDelete}
            className="border-0 shadow-sm hover:shadow transition-shadow"
          />
        </div>
      ))}
    </div>
  );
};
