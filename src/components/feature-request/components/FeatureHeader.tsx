
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Tag } from "lucide-react";
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
import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";

interface FeatureHeaderProps {
  status: Feature['status'];
  product: string;
  location?: string;
  squads?: string[];
  onStatusChange: (newStatus: Feature['status']) => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const FeatureHeader = ({
  status,
  product,
  location,
  squads,
  onStatusChange,
  onEdit,
  onDelete
}: FeatureHeaderProps) => {
  const isMobile = useIsMobile();
  
  // Make sure status is one of the valid statuses
  const validStatus = (status && statusConfig[status]) ? status : "new";

  // Combined label for mobile view
  const getCombinedLabel = () => {
    if (!product && !location) return null;
    if (!location) return productLabels[product as keyof typeof productLabels]?.mobile;
    if (!product) return locationLabels[location as keyof typeof locationLabels]?.mobile;
    
    return `${productLabels[product as keyof typeof productLabels]?.mobile} / ${locationLabels[location as keyof typeof locationLabels]?.mobile}`;
  };

  return (
    <div className="flex flex-wrap items-start justify-between mb-4 gap-2">
      <div className="flex flex-wrap items-center gap-1.5">
        <Select value={validStatus} onValueChange={onStatusChange}>
          <SelectTrigger className={cn(
            "h-7 text-xs font-medium px-2 py-0.5 rounded-full w-auto",
            statusConfig[validStatus].bg,
            statusConfig[validStatus].text
          )}>
            <SelectValue>
              <span className="hidden sm:inline">{statusConfig[validStatus].label}</span>
              <span className="sm:hidden">{statusConfig[validStatus].mobileLabel}</span>
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
        
        {/* Desktop view: separate tags */}
        {!isMobile && (
          <>
            {product && (
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                {productLabels[product as keyof typeof productLabels]?.full || product}
              </span>
            )}
            {location && (
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                {locationLabels[location as keyof typeof locationLabels]?.full || location}
              </span>
            )}
          </>
        )}
        
        {/* Mobile view: combined tag */}
        {isMobile && (product || location) && (
          <span className="text-[10px] leading-tight font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 max-w-[120px] truncate">
            {getCombinedLabel()}
          </span>
        )}

        {/* Display squads if they exist */}
        {squads && squads.length > 0 && (
          <div className="flex items-center gap-1 ml-1">
            <div className="flex flex-wrap gap-1">
              {squads.map(squad => (
                <Badge 
                  key={squad} 
                  variant="secondary" 
                  className="text-[10px] px-1.5 py-0 h-5 bg-primary/10 text-primary"
                >
                  {squad}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center gap-1">
        {onEdit && (
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 h-7 p-1 sm:p-2 justify-start"
            onClick={onEdit}
          >
            <Edit className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {product === "bug" ? "Edit Bug" : "Edit Feature"}
            </span>
          </Button>
        )}
        {onDelete && (
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 h-7 p-1 sm:p-2 justify-start text-destructive hover:text-destructive hover:bg-destructive/10 hidden sm:flex"
            onClick={onDelete}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Delete</span>
          </Button>
        )}
      </div>
    </div>
  );
};
