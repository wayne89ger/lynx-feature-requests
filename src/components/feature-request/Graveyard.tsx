
import { Feature } from "@/types/feature";
import { Button } from "@/components/ui/button";
import { Recycle, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { DeleteConfirmationDialog } from "./components/DeleteConfirmationDialog";
import { useState } from "react";
import { productLabels } from "./constants";
import { Badge } from "@/components/ui/badge";

interface GraveyardProps {
  deletedFeatures: Feature[];
  onRestore: (id: number) => Promise<boolean>;
  onPermanentDelete: (id: number) => Promise<boolean>;
}

export const Graveyard = ({ deletedFeatures, onRestore, onPermanentDelete }: GraveyardProps) => {
  const [featureToDelete, setFeatureToDelete] = useState<Feature | null>(null);

  if (deletedFeatures.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        The graveyard is empty. No feature requests have been deleted.
      </div>
    );
  }

  const handlePermanentDelete = async () => {
    if (featureToDelete) {
      await onPermanentDelete(featureToDelete.id);
      setFeatureToDelete(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-destructive">Graveyard</h2>
        <p className="text-muted-foreground">
          Deleted feature requests can be restored or permanently deleted.
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {deletedFeatures.map((feature) => (
          <div 
            key={feature.id} 
            className="border border-gray-200 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
              <div>
                <h3 className="font-medium">{feature.title}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <Badge variant="outline">{productLabels[feature.product]?.short || feature.product}</Badge>
                  {feature.deleted_at && (
                    <span>
                      Deleted: {format(new Date(feature.deleted_at), 'MMM d, yyyy')}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onRestore(feature.id)}
                  className="flex items-center gap-1"
                >
                  <Recycle className="h-4 w-4" />
                  Restore
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => setFeatureToDelete(feature)}
                  className="flex items-center gap-1"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Forever
                </Button>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">{feature.description}</p>
          </div>
        ))}
      </div>
      
      {featureToDelete && (
        <DeleteConfirmationDialog
          isOpen={featureToDelete !== null}
          onClose={() => setFeatureToDelete(null)}
          onConfirm={handlePermanentDelete}
          title={`permanently delete "${featureToDelete.title}"`}
        />
      )}
    </div>
  );
};
