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
import { useToast } from "@/hooks/use-toast";
import { Bug, Plus, Upload } from "lucide-react";

interface BugReportFormProps {
  onSubmit: (bug: {
    title: string;
    currentSituation: string;
    expectedBehavior: string;
    url: string;
    screenshot?: File;
  }) => void;
}

export const BugReportForm = ({ onSubmit }: BugReportFormProps) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [currentSituation, setCurrentSituation] = useState("");
  const [expectedBehavior, setExpectedBehavior] = useState("");
  const [url, setUrl] = useState(window.location.href);
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !currentSituation || !expectedBehavior || !url) {
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
    });

    setTitle("");
    setCurrentSituation("");
    setExpectedBehavior("");
    setUrl(window.location.href);
    setScreenshot(null);
    setOpen(false);

    toast({
      title: "Bug report submitted",
      description: "Thank you for your report!",
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
      setScreenshot(file);
      toast({
        title: "Screenshot attached",
        description: file.name,
      });
    }
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
          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              Submit
            </Button>
            <Button 
              type="button" 
              variant="outline"
              onClick={() => {
                toast({
                  title: "Coming soon",
                  description: "This feature will be implemented soon.",
                });
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create story in shortcut
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};