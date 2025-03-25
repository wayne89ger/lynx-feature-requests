
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Bug } from "lucide-react";
import { ScreenshotUpload } from "./form-sections/ScreenshotUpload";
import { BugFormActions } from "./form-sections/BugFormActions";
import { productLabels } from "../feature-request/constants";

interface BugReportFormProps {
  onSubmit: (bug: {
    title: string;
    currentSituation: string;
    expectedBehavior: string;
    url: string;
    screenshot?: File;
    product: string;
  }) => void;
}

export const BugReportForm = ({ onSubmit }: BugReportFormProps) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [currentSituation, setCurrentSituation] = useState("");
  const [expectedBehavior, setExpectedBehavior] = useState("");
  const [url, setUrl] = useState(window.location.href);
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [product, setProduct] = useState(Object.keys(productLabels)[0] || "");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !currentSituation || !expectedBehavior || !url || !product) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    onSubmit({
      title,
      currentSituation,
      expectedBehavior,
      url,
      screenshot: screenshot || undefined,
      product,
    });

    setTitle("");
    setCurrentSituation("");
    setExpectedBehavior("");
    setUrl(window.location.href);
    setScreenshot(null);
    setProduct(Object.keys(productLabels)[0] || "");
    setOpen(false);

    toast({
      title: "Bug report submitted",
      description: "Thank you for your report!",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg" className="px-8">
          <Bug className="w-4 h-4 mr-2" />
          Report a bug
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Report a bug</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="product">Product</Label>
            <Select value={product} onValueChange={setProduct}>
              <SelectTrigger>
                <SelectValue placeholder="Select a product" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(productLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label.full}</SelectItem>
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
            <Textarea
              id="currentSituation"
              value={currentSituation}
              onChange={(e) => setCurrentSituation(e.target.value)}
              placeholder="Describe what's happening"
              className="min-h-[100px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="expectedBehavior">Expected Behavior</Label>
            <Textarea
              id="expectedBehavior"
              value={expectedBehavior}
              onChange={(e) => setExpectedBehavior(e.target.value)}
              placeholder="Describe how it should work"
              className="min-h-[100px]"
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
          
          <ScreenshotUpload
            screenshot={screenshot}
            setScreenshot={setScreenshot}
          />
          
          <BugFormActions onSubmit={handleSubmit} />
        </form>
      </DialogContent>
    </Dialog>
  );
};
