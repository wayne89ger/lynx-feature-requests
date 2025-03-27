
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchInputProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  placeholder?: string;
}

export const SearchInput = ({ 
  searchTerm, 
  setSearchTerm, 
  placeholder = "Search titles, products, descriptions or squads..." 
}: SearchInputProps) => {
  return (
    <div className="relative w-full">
      <Input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-10 bg-white border-lynx-border shadow-sm"
      />
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
    </div>
  );
};
