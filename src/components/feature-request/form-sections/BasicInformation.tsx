
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImagePasteTextarea } from "@/components/ui/image-paste-textarea";
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
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface BasicInformationProps {
  title: string;
  description: string;
  expectedBehavior?: string;
  url?: string;
  product: string;
  location: string;
  isBug: boolean;
  descriptionImages?: string[];
  expectedBehaviorImages?: string[];
  setTitle: (value: string) => void;
  setDescription: (value: string) => void;
  setExpectedBehavior?: (value: string) => void;
  setUrl?: (value: string) => void;
  setProduct: (value: string) => void;
  setLocation: (value: string) => void;
}

export const BasicInformation = ({
  title,
  description,
  expectedBehavior,
  url,
  product,
  location,
  isBug,
  descriptionImages = [],
  expectedBehaviorImages = [],
  setTitle,
  setDescription,
  setExpectedBehavior,
  setUrl,
  setProduct,
  setLocation,
}: BasicInformationProps) => {
  const [descriptionImage, setDescriptionImage] = useState<File | null>(null);
  const [expectedBehaviorImage, setExpectedBehaviorImage] = useState<File | null>(null);
  const { toast } = useToast();

  const handleImagePaste = (setImage: (file: File | null) => void) => (file: File) => {
    setImage(file);
  };

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
        <ImagePasteTextarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="min-h-[100px]"
          onImagePaste={handleImagePaste(setDescriptionImage)}
          existingImageUrls={descriptionImages}
        />
      </div>
      {isBug && (
        <>
          <div className="space-y-2">
            <Label htmlFor="expectedBehavior">Expected Behavior</Label>
            <ImagePasteTextarea
              id="expectedBehavior"
              value={expectedBehavior}
              onChange={(e) => setExpectedBehavior?.(e.target.value)}
              className="min-h-[100px]"
              onImagePaste={handleImagePaste(setExpectedBehaviorImage)}
              existingImageUrls={expectedBehaviorImages}
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
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g., Homepage, Cart, etc."
          />
        </div>
      )}
    </>
  );
};
