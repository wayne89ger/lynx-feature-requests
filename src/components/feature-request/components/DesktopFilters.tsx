
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchInput } from "./SearchInput";
import { productLabels, allProducts } from "../constants";

interface DesktopFiltersProps {
  selectedProduct: string;
  setSelectedProduct: (value: string) => void;
  selectedStatus: string;
  setSelectedStatus: (value: string) => void;
  selectedRequester: string;
  setSelectedRequester: (value: string) => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

export const DesktopFilters = ({
  selectedProduct,
  setSelectedProduct,
  selectedStatus,
  setSelectedStatus,
  selectedRequester,
  setSelectedRequester,
  searchTerm,
  setSearchTerm,
}: DesktopFiltersProps) => {
  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Search input on desktop */}
      <SearchInput 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
      />
      
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
