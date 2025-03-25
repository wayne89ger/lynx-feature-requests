
import { FeatureForm } from "./FeatureForm";

interface FormActionsProps {
  onFeatureSubmit: (formData: {
    title: string;
    description: string;
    product: string;
    squad: string;
    location?: string;
    canContact: boolean;
    urgency?: string;
    attachment?: File;
  }) => void;
}

export const FormActions = ({ onFeatureSubmit }: FormActionsProps) => {
  return (
    <div className="flex flex-row justify-center items-center gap-4 mb-8">
      <FeatureForm onSubmit={onFeatureSubmit} />
    </div>
  );
};
