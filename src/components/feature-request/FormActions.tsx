import { FeatureForm } from "./FeatureForm";
import { BugReportForm } from "../bug-report/BugReportForm";

interface FormActionsProps {
  onFeatureSubmit: (formData: {
    title: string;
    description: string;
    product: string;
    location?: string;
    canContact: boolean;
    attachment?: File;
  }) => void;
  onBugSubmit: (bugData: {
    title: string;
    currentSituation: string;
    expectedBehavior: string;
    url: string;
    screenshot?: File;
  }) => void;
}

export const FormActions = ({ onFeatureSubmit, onBugSubmit }: FormActionsProps) => {
  return (
    <div className="flex flex-row justify-center items-center gap-4 mb-8">
      <FeatureForm onSubmit={onFeatureSubmit} />
      <BugReportForm onSubmit={onBugSubmit} />
    </div>
  );
};