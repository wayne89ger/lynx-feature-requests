
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChevronDown, ChevronUp } from "lucide-react";
import { productLabels, locationLabels } from "./constants";

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
}

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
}: FiltersProps) => {
  const isMobile = useIsMobile();
  const [showAllFilters, setShowAllFilters] = useState(false);

  // Mobile filters UI
  if (isMobile) {
    return (
      <div className="flex flex-col gap-4 w-full">
        {/* Product filter - always visible on mobile */}
        <div className="w-full">
          <Select value={selectedProduct} onValueChange={setSelectedProduct}>
            <SelectTrigger className="bg-white border-lynx-border shadow-sm">
              <SelectValue placeholder="All Products" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Products</SelectItem>
              {Object.entries(productLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>{label.full}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Show more filters toggle button */}
        <button 
          className="w-full flex items-center justify-between px-3 py-2 bg-white rounded-md border border-lynx-border shadow-sm text-left"
          onClick={() => setShowAllFilters(!showAllFilters)}
        >
          <span>Show {showAllFilters ? 'fewer' : 'more'} filters</span>
          {showAllFilters ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>

        {/* Additional filters - only shown when expanded */}
        {showAllFilters && (
          <div className="flex flex-col gap-4 w-full animate-fade-in">
            {/* Status filter */}
            <div className="w-full">
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="bg-white border-lynx-border shadow-sm">
                  <SelectValue placeholder="All Statuses" />
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
            <div className="w-full">
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="bg-white border-lynx-border shadow-sm">
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {Object.entries(locationLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label.full}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Requester filter */}
            <div className="w-full">
              <Select value={selectedRequester} onValueChange={setSelectedRequester}>
                <SelectTrigger className="bg-white border-lynx-border shadow-sm">
                  <SelectValue placeholder="All Requesters" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Requesters</SelectItem>
                  <SelectItem value="wanja-aram">Wanja Aram</SelectItem>
                  <SelectItem value="raquell-serrano">Raquell Serrano</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Desktop filters UI - horizontal layout with all filters visible
  return (
    <div className="flex flex-row gap-3 w-full">
      {/* Product filter */}
      <div className="w-full max-w-[200px]">
        <Select value={selectedProduct} onValueChange={setSelectedProduct}>
          <SelectTrigger className="bg-white border-lynx-border shadow-sm">
            <SelectValue placeholder="All Products" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Products</SelectItem>
            {Object.entries(productLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>{label.full}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Status filter */}
      <div className="w-full max-w-[200px]">
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="bg-white border-lynx-border shadow-sm">
            <SelectValue placeholder="All Statuses" />
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
      <div className="w-full max-w-[200px]">
        <Select value={selectedLocation} onValueChange={setSelectedLocation}>
          <SelectTrigger className="bg-white border-lynx-border shadow-sm">
            <SelectValue placeholder="All Locations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            {Object.entries(locationLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>{label.full}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Requester filter */}
      <div className="w-full max-w-[200px]">
        <Select value={selectedRequester} onValueChange={setSelectedRequester}>
          <SelectTrigger className="bg-white border-lynx-border shadow-sm">
            <SelectValue placeholder="All Requesters" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Requesters</SelectItem>
            <SelectItem value="wanja-aram">Wanja Aram</SelectItem>
            <SelectItem value="raquell-serrano">Raquell Serrano</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
