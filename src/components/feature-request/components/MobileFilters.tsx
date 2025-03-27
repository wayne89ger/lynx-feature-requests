
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchInput } from "./SearchInput";
import { productLabels, allProducts } from "../constants";

interface MobileFiltersProps {
  selectedProduct: string;
  setSelectedProduct: (value: string) => void;
  selectedStatus: string;
  setSelectedStatus: (value: string) => void;
  selectedRequester: string;
  setSelectedRequester: (value: string) => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

export const MobileFilters = ({
  selectedProduct,
  setSelectedProduct,
  selectedStatus,
  setSelectedStatus,
  selectedRequester,
  setSelectedRequester,
  searchTerm,
  setSearchTerm,
}: MobileFiltersProps) => {
  const [showAllFilters, setShowAllFilters] = useState(false);

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Search input - always visible on mobile */}
      <SearchInput 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
      />

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
};
