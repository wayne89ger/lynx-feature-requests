
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface FeatureSpecificFieldsProps {
  reviewers: string[];
  setReviewers: (value: string[]) => void;
}

export const FeatureSpecificFields = ({
  reviewers,
  setReviewers,
}: FeatureSpecificFieldsProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {/* All fields have been removed as requested */}
        <div className="text-sm text-muted-foreground">
          Additional feature information will be collected during the review process.
        </div>
      </div>
    </div>
  );
};
