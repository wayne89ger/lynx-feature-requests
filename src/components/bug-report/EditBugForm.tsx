import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
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
import { Button } from "@/components/ui/button";
import { Bookmark, FileText } from "lucide-react";

interface EditBugFormProps {
  bug: {
    id: number;
    title: string;
    current_situation: string;
    expected_behavior: string;
    url: string;
    product: string;
  };
  open: boolean;
  onClose: () => void;
  onSave: (id: number, updatedBug: any) => void;
}

export const EditBugForm = ({ bug, open, onClose, onSave }: EditBugFormProps) => {
  const [title, setTitle] = useState(bug.title);
  const [currentSituation, setCurrentSituation] = useState(bug.current_situation);
  const [expectedBehavior, setExpectedBehavior] = useState(bug.expected_behavior);
  const [url, setUrl] = useState(bug.url);
  const [product, setProduct] = useState(bug.product);
  const [hasShortcutStory, setHasShortcutStory] = useState(false);
  const [hasConfluenceDoc, setHasConfluenceDoc] = useState(false);
  
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!title || !currentSituation || !expectedBehavior || !url || !product) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const updatedData = {
      title,
      current_situation: currentSituation,
      expected_behavior: expectedBehavior,
      url,
      product,
    };

    onSave(bug.id, updatedData);
    onClose();
    
    toast({
      title: "Bug updated",
      description: "Your changes have been saved successfully.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit bug report</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 mt-4 max-h-[70vh] overflow-y-auto">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="currentSituation">Current Situation</Label>
            <Textarea
              id="currentSituation"
              value={currentSituation}
              onChange={(e) => setCurrentSituation(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="expectedBehavior">Expected Behavior</Label>
            <Textarea
              id="expectedBehavior"
              value={expectedBehavior}
              onChange={(e) => setExpectedBehavior(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="product">Product</Label>
            <Select value={product} onValueChange={setProduct}>
              <SelectTrigger>
                <SelectValue placeholder="Select a product" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="website-demand-capture">Website / Demand Capture</SelectItem>
                <SelectItem value="dof-onboarding">DOF / Onboarding</SelectItem>
                <SelectItem value="lynx-plus">LYNX+ / Client Experience</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSubmit} className="flex-1">
              Save Changes
            </Button>
            <Button 
              onClick={() => {
                setHasShortcutStory(true);
                toast({
                  title: hasShortcutStory ? "Synced with Shortcut" : "Added to Shortcut",
                  description: "This functionality will be implemented soon",
                });
              }} 
              variant="outline" 
              className="gap-2"
            >
              <Bookmark className="w-4 h-4" />
              {hasShortcutStory ? "Sync with Shortcut" : "Add to Shortcut"}
            </Button>
            <Button 
              onClick={() => {
                setHasConfluenceDoc(true);
                toast({
                  title: hasConfluenceDoc ? "Synced with Confluence" : "Added to Confluence",
                  description: "This functionality will be implemented soon",
                });
              }} 
              variant="outline" 
              className="gap-2"
            >
              <FileText className="w-4 h-4" />
              {hasConfluenceDoc ? "Sync with Confluence" : "Add to Confluence"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};