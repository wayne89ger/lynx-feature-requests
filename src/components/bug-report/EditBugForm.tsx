import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Plus, Ticket } from "lucide-react";

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

    onSave(bug.id, {
      title,
      current_situation: currentSituation,
      expected_behavior: expectedBehavior,
      url,
      product,
    });
  };

  const handleCreateITopTicket = () => {
    toast({
      title: "Coming soon",
      description: "iTop integration will be implemented soon.",
    });
  };

  const handleShortcut = () => {
    toast({
      title: "Coming soon",
      description: "This feature will be implemented soon.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit bug report</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
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
          <div className="flex items-center gap-3">
            <Button type="submit" className="bg-primary text-white">
              Save changes
            </Button>
            <Button 
              type="button" 
              variant="outline"
              onClick={handleShortcut}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Shortcut
            </Button>
            <Button 
              type="button" 
              variant="outline"
              onClick={handleCreateITopTicket}
              className="gap-2"
            >
              <Ticket className="w-4 h-4" />
              iTop
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};