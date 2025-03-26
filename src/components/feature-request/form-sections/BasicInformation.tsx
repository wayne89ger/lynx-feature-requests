
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  productLabels, 
  allProducts
} from "../constants";

// Available squads
const AVAILABLE_SQUADS = ["Demand Capture", "Onboarding", "Client Experience", "CPI"];

interface BasicInformationProps {
  title: string;
  description: string;
  expectedBehavior?: string;
  url?: string;
  product: string;
  location: string;
  squad: string;
  isBug: boolean;
  setTitle: (value: string) => void;
  setDescription: (value: string) => void;
  setExpectedBehavior?: (value: string) => void;
  setUrl?: (value: string) => void;
  setProduct: (value: string) => void;
  setLocation: (value: string) => void;
  setSquad: (value: string) => void;
}

export const BasicInformation = ({
  title,
  description,
  expectedBehavior,
  url,
  product,
  location,
  squad,
  isBug,
  setTitle,
  setDescription,
  setExpectedBehavior,
  setUrl,
  setProduct,
  setLocation,
  setSquad,
}: BasicInformationProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">
          {isBug ? "Current Situation" : "Description"}
        </Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="min-h-[100px]"
        />
      </div>
      {isBug && (
        <>
          <div className="space-y-2">
            <Label htmlFor="expectedBehavior">Expected Behavior</Label>
            <Textarea
              id="expectedBehavior"
              value={expectedBehavior}
              onChange={(e) => setExpectedBehavior?.(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              value={url}
              onChange={(e) => setUrl?.(e.target.value)}
            />
          </div>
        </>
      )}
      <div className="space-y-2">
        <Label htmlFor="product">Product</Label>
        <Select value={product} onValueChange={setProduct}>
          <SelectTrigger>
            <SelectValue placeholder="Select a product" />
          </SelectTrigger>
          <SelectContent>
            {allProducts.map((productKey) => (
              <SelectItem key={productKey} value={productKey}>
                {productLabels[productKey]?.full || productKey}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {!isBug && (
        <>
          <div className="space-y-2">
            <Label htmlFor="squad">Squad</Label>
            <Select value={squad} onValueChange={setSquad}>
              <SelectTrigger>
                <SelectValue placeholder="Select a squad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {AVAILABLE_SQUADS.map((squadName) => (
                  <SelectItem key={squadName} value={squadName}>
                    {squadName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Homepage, Cart, etc."
            />
          </div>
        </>
      )}
    </>
  );
};
