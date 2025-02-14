
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Feature } from "@/types/feature";
import { productLabels, locationLabels, statusConfig } from "../constants";

interface FeatureHeaderProps {
  status: Feature['status'];
  product: string;
  location?: string;
  onStatusChange: (newStatus: Feature['status']) => void;
  onEdit?: () => void;
}

export const FeatureHeader = ({
  status,
  product,
  location,
  onStatusChange,
  onEdit
}: FeatureHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger className={cn(
            "h-8 text-xs font-medium px-2.5 py-0.5 rounded-full w-auto",
            statusConfig[status].bg,
            statusConfig[status].text
          )}>
            <SelectValue>
              <span className="hidden sm:inline">{statusConfig[status].label}</span>
              <span className="sm:hidden">{statusConfig[status].mobileLabel}</span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {Object.entries(statusConfig).map(([key, config]) => (
              <SelectItem key={key} value={key}>
                {config.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {product && (
          <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600">
            <span className="hidden sm:inline">
              {productLabels[product as keyof typeof productLabels]?.full}
            </span>
            <span className="sm:hidden">
              {productLabels[product as keyof typeof productLabels]?.mobile}
            </span>
          </span>
        )}
        {location && (
          <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600">
            <span className="hidden sm:inline">
              {locationLabels[location as keyof typeof locationLabels]?.full}
            </span>
            <span className="sm:hidden">
              {locationLabels[location as keyof typeof locationLabels]?.mobile}
            </span>
          </span>
        )}
      </div>
      {onEdit && (
        <Button
          variant="ghost"
          size="sm"
          className="gap-1"
          onClick={onEdit}
        >
          <Edit className="w-4 h-4" />
          <span className="hidden sm:inline">
            {product === "bug" ? "Edit Bug" : "Edit Feature"}
          </span>
        </Button>
      )}
    </div>
  );
};
