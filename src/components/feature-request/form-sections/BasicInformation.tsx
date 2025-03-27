
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Paperclip, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BasicInformationProps {
  title: string;
  description: string;
  expectedBehavior?: string;
  url?: string;
  product: string;
  location: string;
  isBug: boolean;
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

  const removeImage = (setImage: (file: File | null) => void) => () => {
    setImage(null);
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
        />
        {descriptionImage && (
          <div className="mt-2 flex items-center gap-2 p-2 bg-gray-50 rounded-md">
            <Paperclip className="h-4 w-4" />
            <span className="text-sm truncate flex-1">{descriptionImage.name}</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={removeImage(setDescriptionImage)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
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
            />
            {expectedBehaviorImage && (
              <div className="mt-2 flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                <Paperclip className="h-4 w-4" />
                <span className="text-sm truncate flex-1">{expectedBehaviorImage.name}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={removeImage(setExpectedBehaviorImage)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
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
