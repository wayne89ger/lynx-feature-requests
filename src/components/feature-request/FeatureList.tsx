
import { FeatureCard } from "./FeatureCard";
import { Feature } from "@/types/feature";

interface FeatureListProps {
  features: Feature[];
  onEdit: (feature: Feature) => void;
  onDelete: (id: number) => void;
}

export const FeatureList = ({ features, onEdit, onDelete }: FeatureListProps) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {features.map((feature) => (
        <FeatureCard
          key={feature.id}
          {...feature}
          onEdit={() => onEdit(feature)}
          onDelete={onDelete}
          className="border-0 shadow-sm hover:shadow transition-shadow"
        />
      ))}
    </div>
  );
};
