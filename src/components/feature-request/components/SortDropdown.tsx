
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowDownAZ, ArrowUpAZ, ChevronDown } from "lucide-react";

export type SortOption = "votes-desc" | "votes-asc" | "date-desc" | "date-asc";

interface SortDropdownProps {
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export const SortDropdown = ({ currentSort, onSortChange }: SortDropdownProps) => {
  const getSortLabel = (sort: SortOption) => {
    switch (sort) {
      case "votes-desc":
        return "Most Upvotes";
      case "votes-asc":
        return "Least Upvotes";
      case "date-desc":
        return "Newest First";
      case "date-asc":
        return "Oldest First";
      default:
        return "Sort";
    }
  };

  const getSortIcon = (sort: SortOption) => {
    if (sort.includes("asc")) {
      return <ArrowUpAZ className="h-4 w-4 mr-2" />;
    }
    return <ArrowDownAZ className="h-4 w-4 mr-2" />;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          {getSortIcon(currentSort)}
          {getSortLabel(currentSort)}
          <ChevronDown className="h-3 w-3 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onSortChange("votes-desc")}>
          <ArrowDownAZ className="h-4 w-4 mr-2" />
          Most Upvotes
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSortChange("votes-asc")}>
          <ArrowUpAZ className="h-4 w-4 mr-2" />
          Least Upvotes
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSortChange("date-desc")}>
          <ArrowDownAZ className="h-4 w-4 mr-2" />
          Newest First
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSortChange("date-asc")}>
          <ArrowUpAZ className="h-4 w-4 mr-2" />
          Oldest First
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
