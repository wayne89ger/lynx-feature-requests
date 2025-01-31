import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ScreenshotUploadProps {
  screenshot: File | null;
  setScreenshot: (file: File | null) => void;
}

export const ScreenshotUpload = ({ screenshot, setScreenshot }: ScreenshotUploadProps) => {
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 5MB",
          variant: "destructive",
        });
        return;
      }
      setScreenshot(file);
      toast({
        title: "Screenshot attached",
        description: file.name,
      });
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="screenshot">Screenshot</Label>
      <div className="flex items-center gap-2">
        <Input
          id="screenshot"
          type="file"
          onChange={handleFileChange}
          accept=".jpg,.png,.gif"
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => document.getElementById("screenshot")?.click()}
          className="w-full"
        >
          <Upload className="w-4 h-4 mr-2" />
          {screenshot ? screenshot.name : "Upload screenshot"}
        </Button>
      </div>
    </div>
  );
};