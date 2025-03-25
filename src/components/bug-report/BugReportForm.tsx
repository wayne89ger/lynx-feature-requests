
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Bug } from "lucide-react";
import { ScreenshotUpload } from "./form-sections/ScreenshotUpload";
import { BugFormActions } from "./form-sections/BugFormActions";
import { EditBugFormFields } from "./form-sections/EditBugFormFields"; 
import { useToast } from "@/hooks/use-toast";
import { productLabels, defaultProducts } from "../feature-request/constants";

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
  const [product, setProduct] = useState(defaultProducts[0] || "");
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
    setProduct(defaultProducts[0] || "");
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
          <EditBugFormFields
            title={title}
            currentSituation={currentSituation}
            expectedBehavior={expectedBehavior}
            url={url}
            product={product}
            setTitle={setTitle}
            setCurrentSituation={setCurrentSituation}
            setExpectedBehavior={setExpectedBehavior}
            setUrl={setUrl}
            setProduct={setProduct}
          />
          
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
