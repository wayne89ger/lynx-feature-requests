
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
import { Paperclip, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EditBugFormFieldsProps {
  title: string;
  currentSituation: string;
  expectedBehavior: string;
  url: string;
  product: string;
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

  const removeImage = (setImage: (file: File | null) => void) => () => {
    setImage(null);
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
        />
        {currentSituationImage && (
          <div className="mt-2 flex items-center gap-2 p-2 bg-gray-50 rounded-md">
            <Paperclip className="h-4 w-4" />
            <span className="text-sm truncate flex-1">{currentSituationImage.name}</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={removeImage(setCurrentSituationImage)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
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
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Page URL where the issue occurred"
        />
      </div>
    </>
  );
};
