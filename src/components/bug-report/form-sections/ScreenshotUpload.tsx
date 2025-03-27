
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Clipboard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ScreenshotUploadProps {
  screenshot: File | null;
  setScreenshot: (file: File | null) => void;
}

export const ScreenshotUpload = ({ screenshot, setScreenshot }: ScreenshotUploadProps) => {
  const { toast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file: File) => {
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
  };

  // Handle clipboard paste events
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (e.clipboardData?.files.length) {
        e.preventDefault();
        const file = e.clipboardData.files[0];
        validateAndSetFile(file);
      }
    };

    // Add the paste event listener to the container element
    const container = containerRef.current;
    if (container) {
      container.addEventListener('paste', handlePaste);
    }

    // Add the paste event listener to the document
    document.addEventListener('paste', handlePaste);

    return () => {
      if (container) {
        container.removeEventListener('paste', handlePaste);
      }
      document.removeEventListener('paste', handlePaste);
    };
  }, []);

  return (
    <div className="space-y-2" ref={containerRef} tabIndex={0}>
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
          className="flex-1"
        >
          <Upload className="w-4 h-4 mr-2" />
          {screenshot ? screenshot.name : "Upload screenshot"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => toast({
            title: "Clipboard paste enabled",
            description: "You can paste an image directly from your clipboard (Ctrl+V or Cmd+V)"
          })}
        >
          <Clipboard className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
