
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileFilters } from "./components/MobileFilters";
import { DesktopFilters } from "./components/DesktopFilters";

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

  // Mobile filters UI
  if (isMobile) {
    return (
      <MobileFilters
        selectedProduct={selectedProduct}
        setSelectedProduct={setSelectedProduct}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        selectedRequester={selectedRequester}
        setSelectedRequester={setSelectedRequester}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
    );
  }

  // Desktop filters UI - horizontal layout with all filters visible
  return (
    <DesktopFilters
      selectedProduct={selectedProduct}
      setSelectedProduct={setSelectedProduct}
      selectedStatus={selectedStatus}
      setSelectedStatus={setSelectedStatus}
      selectedRequester={selectedRequester}
      setSelectedRequester={setSelectedRequester}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
    />
  );
};
