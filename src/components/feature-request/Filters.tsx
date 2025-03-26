
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  productLabels,
  defaultProducts,
  clientExperienceProducts,
  onboardingProducts,
  demandCaptureProducts,
  cpiProducts
} from "./constants";

interface FiltersProps {
  activeTab: string;
  selectedProduct: string;
  setSelectedProduct: (value: string) => void;
  selectedStatus: string;
  setSelectedStatus: (value: string) => void;
  selectedRequester: string;
  setSelectedRequester: (value: string) => void;
  searchTerm?: string;
  setSearchTerm?: (value: string) => void;
}

export const Filters = ({
  activeTab,
  selectedProduct,
  setSelectedProduct,
  selectedStatus,
  setSelectedStatus,
  selectedRequester,
  setSelectedRequester,
  searchTerm = "",
  setSearchTerm = () => {},
}: FiltersProps) => {
  const isMobile = useIsMobile();
  const [showAllFilters, setShowAllFilters] = useState(false);

  // Combine all products for the dropdown
  const allProducts = [
    ...defaultProducts,
    ...clientExperienceProducts,
    ...onboardingProducts,
    ...demandCaptureProducts,
    ...cpiProducts
  ];

  // Mobile filters UI
  if (isMobile) {
    return (
      <div className="flex flex-col gap-4 w-full">
        {/* Search input - always visible on mobile */}
        <div className="relative w-full">
          <Input
            type="text"
            placeholder="Search titles, products or squads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white border-lynx-border shadow-sm"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        </div>

        {/* Product filter - always visible on mobile */}
        <div className="w-full">
          <Select value={selectedProduct} onValueChange={setSelectedProduct}>
            <SelectTrigger className="bg-white border-lynx-border shadow-sm">
              <SelectValue placeholder="All Products" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Products</SelectItem>
              {allProducts.map((productKey) => (
                <SelectItem key={productKey} value={productKey}>
                  {productLabels[productKey]?.full || productKey}
                </SelectItem>
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
    <div className="flex flex-col gap-3 w-full">
      {/* Search input on desktop */}
      <div className="relative w-full">
        <Input
          type="text"
          placeholder="Search titles, products or squads..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-white border-lynx-border shadow-sm"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      </div>
      
      <div className="flex flex-row gap-3 w-full">
        {/* Product filter */}
        <div className="w-full max-w-[200px]">
          <Select value={selectedProduct} onValueChange={setSelectedProduct}>
            <SelectTrigger className="bg-white border-lynx-border shadow-sm">
              <SelectValue placeholder="All Products" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Products</SelectItem>
              {allProducts.map((productKey) => (
                <SelectItem key={productKey} value={productKey}>
                  {productLabels[productKey]?.full || productKey}
                </SelectItem>
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
    </div>
  );
};
