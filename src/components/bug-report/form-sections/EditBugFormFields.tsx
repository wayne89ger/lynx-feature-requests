
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
} from "@/components/feature-request/constants";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface EditBugFormFieldsProps {
  title: string;
  currentSituation: string;
  expectedBehavior: string;
  url: string;
  product: string;
  currentSituationImages?: string[];
  expectedBehaviorImages?: string[];
  setTitle: (value: string) => void;
  setCurrentSituation: (value: string) => void;
  setExpectedBehavior: (value: string) => void;
  setUrl: (value: string) => void;
  setProduct: (value: string) => void;
}

export const EditBugFormFields = ({
  title,
  currentSituation,
  expectedBehavior,
  url,
  product,
  currentSituationImages = [],
  expectedBehaviorImages = [],
  setTitle,
  setCurrentSituation,
  setExpectedBehavior,
  setUrl,
  setProduct,
}: EditBugFormFieldsProps) => {
  const [currentSituationImage, setCurrentSituationImage] = useState<File | null>(null);
  const [expectedBehaviorImage, setExpectedBehaviorImage] = useState<File | null>(null);
  const { toast } = useToast();

  const handleImagePaste = (setImage: (file: File | null) => void) => (file: File) => {
    setImage(file);
  };

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="product">Product</Label>
        <Select value={product} onValueChange={setProduct}>
          <SelectTrigger>
            <SelectValue placeholder="Select a product" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            {allProducts.map((productKey) => (
              <SelectItem key={productKey} value={productKey}>
                {productLabels[productKey]?.full || productKey}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Short summary of the issue"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="currentSituation">Current Situation</Label>
        <ImagePasteTextarea
          id="currentSituation"
          value={currentSituation}
          onChange={(e) => setCurrentSituation(e.target.value)}
          placeholder="Describe what's happening"
          className="min-h-[100px]"
          onImagePaste={handleImagePaste(setCurrentSituationImage)}
          existingImageUrls={currentSituationImages}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="expectedBehavior">Expected Behavior</Label>
        <ImagePasteTextarea
          id="expectedBehavior"
          value={expectedBehavior}
          onChange={(e) => setExpectedBehavior(e.target.value)}
          placeholder="Describe how it should work"
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
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Page URL where the issue occurred"
        />
      </div>
    </>
  );
};
