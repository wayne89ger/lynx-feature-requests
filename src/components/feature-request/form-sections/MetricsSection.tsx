import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MetricsSectionProps {
  metrics: string[];
  selectedMetrics: string[];
  newMetric: string;
  setNewMetric: (value: string) => void;
  setMetrics: (metrics: string[]) => void;
  setSelectedMetrics: (metrics: string[]) => void;
}

export const MetricsSection = ({
  metrics,
  selectedMetrics,
  newMetric,
  setNewMetric,
  setMetrics,
  setSelectedMetrics,
}: MetricsSectionProps) => {
  const { toast } = useToast();

  const handleMetricSelect = (metric: string) => {
    if (selectedMetrics.includes(metric)) {
      setSelectedMetrics(selectedMetrics.filter((m) => m !== metric));
    } else if (selectedMetrics.length < 3) {
      setSelectedMetrics([...selectedMetrics, metric]);
    } else {
      toast({
        title: "Maximum metrics reached",
        description: "You can only select up to 3 metrics",
        variant: "destructive",
      });
    }
  };

  const handleAddMetric = () => {
    if (!newMetric.trim()) {
      toast({
        title: "Invalid metric",
        description: "Please enter a metric name",
        variant: "destructive",
      });
      return;
    }

    if (metrics.includes(newMetric.trim())) {
      toast({
        title: "Duplicate metric",
        description: "This metric already exists",
        variant: "destructive",
      });
      return;
    }

    setMetrics([...metrics, newMetric.trim()]);
    setNewMetric("");
    toast({
      title: "Metric added",
      description: "New metric has been added successfully",
    });
  };

  return (
    <div className="space-y-2">
      <Label>Metrics (select up to 3)</Label>
      <div className="flex items-center gap-2 mb-2">
        <Input
          placeholder="Add new metric"
          value={newMetric}
          onChange={(e) => setNewMetric(e.target.value)}
          className="flex-1"
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleAddMetric}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {metrics.map((metric) => (
          <Badge
            key={metric}
            variant={selectedMetrics.includes(metric) ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => handleMetricSelect(metric)}
          >
            {metric}
            {selectedMetrics.includes(metric) && (
              <X className="w-3 h-3 ml-1" />
            )}
          </Badge>
        ))}
      </div>
    </div>
  );
};