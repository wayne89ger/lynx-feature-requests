
import { Feature } from "@/types/feature";
import { FeatureCard } from "./FeatureCard";

interface FeatureListProps {
  features: Feature[];
  onEdit: (feature: Feature) => void;
  onDelete: (id: number) => void;
  onStatusChange: (id: number, newStatus: Feature['status']) => void;
}

export const FeatureList = ({ features, onEdit, onDelete, onStatusChange }: FeatureListProps) => {
  if (features.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        No feature requests found.
      </div>
    );
  }

  return (
    <div className="space-y-2 sm:space-y-4">
      {features.map((feature) => (
        <FeatureCard
          key={feature.id}
          {...feature}
          onEdit={() => onEdit(feature)}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
};
