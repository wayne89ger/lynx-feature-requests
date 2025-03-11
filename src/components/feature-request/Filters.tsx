
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EXPERIMENT_OWNERS } from "@/constants/experimentOwners";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface FiltersProps {
  activeTab: string;
  selectedProduct: string;
  setSelectedProduct: (value: string) => void;
  selectedStatus: string;
  setSelectedStatus: (value: string) => void;
  selectedLocation: string;
  setSelectedLocation: (value: string) => void;
  selectedRequester: string;
  setSelectedRequester: (value: string) => void;
  selectedExperimentOwner: string;
  setSelectedExperimentOwner: (value: string) => void;
}

const productLabels = {
  "website-demand-capture": "Website / Demand Capture",
  "dof-onboarding": "DOF / Onboarding",
  "lynx-plus": "LYNX+ / Product Discovery"
};

export const Filters = ({
  activeTab,
  selectedProduct,
  setSelectedProduct,
  selectedStatus,
  setSelectedStatus,
  selectedLocation,
  setSelectedLocation,
  selectedRequester,
  setSelectedRequester,
  selectedExperimentOwner,
  setSelectedExperimentOwner
}: FiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-wrap gap-4">
      {/* Product filter - always visible */}
      <div className="w-full sm:w-[200px]">
        <Select value={selectedProduct} onValueChange={setSelectedProduct}>
          <SelectTrigger className="w-full bg-white border-lynx-border shadow-sm hover:border-lynx-primary/50 transition-colors">
            <SelectValue placeholder="Filter by Product" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Products</SelectItem>
            {Object.entries(productLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Status filter */}
      <div className="w-full sm:w-[200px]">
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-full bg-white border-lynx-border shadow-sm hover:border-lynx-primary/50 transition-colors">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="review">Under Review</SelectItem>
            <SelectItem value="progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Location filter */}
      <div className="w-full sm:w-[200px]">
        <Select value={selectedLocation} onValueChange={setSelectedLocation}>
          <SelectTrigger className="w-full bg-white border-lynx-border shadow-sm hover:border-lynx-primary/50 transition-colors">
            <SelectValue placeholder="Filter by Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            <SelectItem value="knowledge-portal">Knowledge Portal</SelectItem>
            <SelectItem value="marketing-section">Marketing Section</SelectItem>
            <SelectItem value="service-portal">Service Portal</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Requester filter */}
      <div className="w-full sm:w-[200px]">
        <Select value={selectedRequester} onValueChange={setSelectedRequester}>
          <SelectTrigger className="w-full bg-white border-lynx-border shadow-sm hover:border-lynx-primary/50 transition-colors">
            <SelectValue placeholder="Filter by Requester" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Requesters</SelectItem>
            {EXPERIMENT_OWNERS.map((owner) => (
              <SelectItem key={owner} value={owner}>{owner}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Experiment Owner filter */}
      <div className="w-full sm:w-[200px]">
        <Select value={selectedExperimentOwner} onValueChange={setSelectedExperimentOwner}>
          <SelectTrigger className="w-full bg-white border-lynx-border shadow-sm hover:border-lynx-primary/50 transition-colors">
            <SelectValue placeholder="Filter by Experiment Owner" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Experiment Owners</SelectItem>
            {EXPERIMENT_OWNERS.map((owner) => (
              <SelectItem key={owner} value={owner}>{owner}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
