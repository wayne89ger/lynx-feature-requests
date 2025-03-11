
import { useState } from "react";
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

interface FeatureFormProps {
  onSubmit: (feature: {
    title: string;
    description: string;
    product: string;
    location?: string;
    canContact: boolean;
    attachment?: File;
  }) => void;
}

export const FeatureForm = ({ onSubmit }: FeatureFormProps) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [product, setProduct] = useState("");
  const [location, setLocation] = useState("");
  const [canContact, setCanContact] = useState(false);
  const [attachment, setAttachment] = useState<File | null>(null);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !product) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (product === "website-demand-capture" && !location) {
      toast({
        title: "Please select a location",
        variant: "destructive",
      });
      return;
    }

    onSubmit({ 
      title, 
      description, 
      product, 
      location: product === "website-demand-capture" ? location : undefined,
      canContact,
      attachment: attachment || undefined
    });
    
    setTitle("");
    setDescription("");
    setProduct("");
    setLocation("");
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
            <Label htmlFor="product">Product</Label>
            <Select value={product} onValueChange={(value) => {
              setProduct(value);
              if (value !== "website-demand-capture") {
                setLocation("");
              }
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Select a product" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="website-demand-capture">Website / Demand Capture</SelectItem>
                <SelectItem value="dof-onboarding">DOF / Onboarding</SelectItem>
                <SelectItem value="lynx-plus">LYNX+ / Product Discovery</SelectItem>
                <SelectItem value="proactive-service">Proactive Service</SelectItem>
                <SelectItem value="operational-efficiency">Operational Efficiency</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {product === "website-demand-capture" && (
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="knowledge-portal">Knowledge Portal</SelectItem>
                  <SelectItem value="marketing-section">Marketing Section</SelectItem>
                  <SelectItem value="service-portal">Service Portal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
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
