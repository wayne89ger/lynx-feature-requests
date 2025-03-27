
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileFilters } from "./components/MobileFilters";
import { DesktopFilters } from "./components/DesktopFilters";

// Available squads
const AVAILABLE_SQUADS = ["Demand Capture", "Onboarding", "Client Experience", "CPI"];

interface FiltersProps {
  activeTab: string;
  selectedProduct: string;
  setSelectedProduct: (value: string) => void;
  selectedStatus: string;
  setSelectedStatus: (value: string) => void;
  selectedRequester: string;
  setSelectedRequester: (value: string) => void;
  selectedSquads: string[];
  setSelectedSquads: (value: string[]) => void;
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
  selectedSquads,
  setSelectedSquads,
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
        selectedSquads={selectedSquads}
        setSelectedSquads={setSelectedSquads}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        availableSquads={AVAILABLE_SQUADS}
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
      selectedSquads={selectedSquads}
      setSelectedSquads={setSelectedSquads}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      availableSquads={AVAILABLE_SQUADS}
    />
  );
};
