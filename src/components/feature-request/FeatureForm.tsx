
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload } from "lucide-react";
import { 
  productLabels, 
  squadLabels, 
  defaultProducts, 
  clientExperienceProducts,
  onboardingProducts,
  demandCaptureProducts
} from "./constants";

interface FeatureFormProps {
  onSubmit: (feature: {
    title: string;
    description: string;
    product: string;
    squad: string;
    canContact: boolean;
    attachment?: File;
  }) => void;
}

export const FeatureForm = ({ onSubmit }: FeatureFormProps) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [product, setProduct] = useState(defaultProducts[0] || "");
  const [squad, setSquad] = useState("demand-capture");
  const [canContact, setCanContact] = useState(false);
  const [attachment, setAttachment] = useState<File | null>(null);
  const { toast } = useToast();

  // Update product options when squad changes
  useEffect(() => {
    if (squad === "client-experience" && !clientExperienceProducts.includes(product)) {
      setProduct(clientExperienceProducts[0]);
    } else if (squad === "onboarding" && !onboardingProducts.includes(product)) {
      setProduct(onboardingProducts[0]);
    } else if (squad === "demand-capture" && !demandCaptureProducts.includes(product)) {
      setProduct(demandCaptureProducts[0]);
    } else if (squad !== "client-experience" && squad !== "onboarding" && 
              squad !== "demand-capture" && !defaultProducts.includes(product)) {
      setProduct(defaultProducts[0]);
    }
  }, [squad, product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !product || !squad) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    onSubmit({ 
      title, 
      description, 
      product, 
      squad,
      canContact,
      attachment: attachment || undefined
    });
    
    setTitle("");
    setDescription("");
    setProduct(defaultProducts[0] || "");
    setSquad("demand-capture");
    setCanContact(false);
    setAttachment(null);
    setOpen(false);
    
    toast({
      title: "Feature request submitted",
      description: "Thank you for your feedback!",
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 5MB",
          variant: "destructive",
        });
        return;
      }
      setAttachment(file);
      toast({
        title: "File attached",
        description: file.name,
      });
    }
  };

  // Get the products to display based on squad selection
  const getProductsToDisplay = () => {
    if (squad === "client-experience") {
      return clientExperienceProducts;
    } else if (squad === "onboarding") {
      return onboardingProducts;
    } else if (squad === "demand-capture") {
      return demandCaptureProducts;
    } else {
      return defaultProducts;
    }
  };

  const productsToDisplay = getProductsToDisplay();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="px-8">
          Submit idea
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Submit feature request</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a clear, concise title"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your feature request in detail"
              className="min-h-[100px]"
            />
          </div>
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
          <div className="space-y-2">
            <Label htmlFor="attachment">Attachment</Label>
            <div className="flex items-center gap-2">
              <Input
                id="attachment"
                type="file"
                onChange={handleFileChange}
                accept=".jpg,.png,.gif,.mp4"
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById("attachment")?.click()}
                className="w-full"
              >
                <Upload className="w-4 h-4 mr-2" />
                {attachment ? attachment.name : "Upload jpg, png, gif, mp4"}
              </Button>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="canContact"
              checked={canContact}
              onCheckedChange={(checked) => setCanContact(checked as boolean)}
            />
            <Label htmlFor="canContact" className="text-sm font-normal">
              Can we contact you about this feature request?
            </Label>
          </div>
          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
