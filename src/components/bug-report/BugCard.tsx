
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Feature } from "@/types/feature";
import { BugHeader } from "./components/BugHeader";
import { BugContent } from "./components/BugContent";
import { BugActions } from "./components/BugActions";
import { BugCommentsDialog } from "./components/BugCommentsDialog";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface BugCardProps {
  id: number;
  title: string;
  description: string;
  status: "new" | "review" | "progress" | "completed";
  product: string;
  votes: number;
  comments: any[];
  reporter: string;
  onEdit: (bug: Feature) => void;
  onDelete?: (id: number) => void;
  className?: string;
}

export const BugCard = ({
  id,
  title,
  description,
  status = "new",
  product,
  votes,
  comments,
  reporter,
  onEdit,
  onDelete,
  className
}: BugCardProps) => {
  const [showComments, setShowComments] = useState(false);
  
  const handleDelete = async () => {
    if (onDelete) {
      onDelete(id);
    }
  };

  return (
    <div className={cn("bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200", className)}>
      <div className="flex items-center justify-between mb-4">
        <BugHeader 
          id={id}
          status={status} 
          product={product} 
        />
        <div className="flex flex-col gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 h-8 justify-start"
            onClick={() => onEdit({
              id,
              title,
              description,
              status,
              product,
              votes,
              comments,
              reporter,
              urgency: 'medium'
            } as Feature)}
          >
            <Edit className="w-4 h-4" />
            <span className="hidden sm:inline">Edit Bug</span>
          </Button>
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 h-8 justify-start text-destructive hover:text-destructive hover:bg-destructive/10 hidden sm:flex"
              onClick={handleDelete}
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Delete</span>
            </Button>
          )}
        </div>
      </div>

      <BugContent
        title={title}
        description={description}
        reporter={reporter}
      />

      <BugActions
        id={id}
        votes={votes}
        commentsCount={comments.length}
        onShowComments={() => setShowComments(true)}
      />

      <BugCommentsDialog
        isOpen={showComments}
        onClose={() => setShowComments(false)}
        bugId={id}
        comments={comments}
        title={title}
        reporter={reporter}
      />
    </div>
  );
};
