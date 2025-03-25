
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
  squadLabels, 
  clientExperienceProducts,
  onboardingProducts,
  defaultProducts 
} from "../constants";
import { useEffect } from "react";

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
  // When squad changes, reset the product based on squad
  useEffect(() => {
    if (squad === "client-experience" && !clientExperienceProducts.includes(product)) {
      // Reset to first CE product when switching to CE squad
      setProduct(clientExperienceProducts[0]);
    } else if (squad === "onboarding" && !onboardingProducts.includes(product)) {
      // Reset to first onboarding product when switching to onboarding squad
      setProduct(onboardingProducts[0]);
    } else if (squad !== "client-experience" && squad !== "onboarding" && 
              !defaultProducts.includes(product)) {
      // Reset to first default product when switching from CE or onboarding squad
      setProduct(defaultProducts[0]);
    }
  }, [squad, product, setProduct]);

  // Get the products to display based on squad selection
  const getProductsToDisplay = () => {
    if (squad === "client-experience") {
      return clientExperienceProducts;
    } else if (squad === "onboarding") {
      return onboardingProducts;
    } else {
      return defaultProducts;
    }
  };

  const productsToDisplay = getProductsToDisplay();

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
      {!isBug && (
        <div className="space-y-2">
          <Label htmlFor="squad">Squad</Label>
          <Select value={squad} onValueChange={setSquad}>
            <SelectTrigger>
              <SelectValue placeholder="Select a squad" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(squadLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>{label.full}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="product">Product</Label>
        <Select value={product} onValueChange={setProduct}>
          <SelectTrigger>
            <SelectValue placeholder="Select a product" />
          </SelectTrigger>
          <SelectContent>
            {productsToDisplay.map((productKey) => (
              <SelectItem key={productKey} value={productKey}>
                {productLabels[productKey]?.full || productKey}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
};
