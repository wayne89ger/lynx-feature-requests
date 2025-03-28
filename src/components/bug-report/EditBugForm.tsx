
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { EditBugFormFields } from "./form-sections/EditBugFormFields";
import { EditBugFormActions } from "./form-sections/EditBugFormActions";

interface EditBugFormProps {
  bug: {
    id: number;
    title: string;
    current_situation: string;
    expected_behavior: string;
    url: string;
    product: string;
    attachments?: string[]; // Add support for attachments
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
  
  // Extract image URLs from the bug's attachments
  const attachments = bug.attachments || [];
  
  // Process attachments to separate them by field
  const currentSituationImages = attachments.filter(url => 
    url.includes('current_situation') || 
    (url.includes('attachment') && url.includes(bug.id.toString()))
  );
  
  const expectedBehaviorImages = attachments.filter(url => 
    url.includes('expected_behavior') || 
    (url.includes('attachment') && !url.includes('current_situation'))
  );
  
  console.log('Bug attachments:', attachments);
  console.log('Current situation images:', currentSituationImages);
  console.log('Expected behavior images:', expectedBehaviorImages);
  
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

  const handleShortcut = () => {
    toast({
      title: "Coming soon",
      description: "This feature will be implemented soon.",
    });
  };

  const handleCreateITopTicket = () => {
    toast({
      title: "Coming soon",
      description: "iTop integration will be implemented soon.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit bug report</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <EditBugFormFields
            title={title}
            currentSituation={currentSituation}
            expectedBehavior={expectedBehavior}
            url={url}
            product={product}
            currentSituationImages={currentSituationImages}
            expectedBehaviorImages={expectedBehaviorImages}
            setTitle={setTitle}
            setCurrentSituation={setCurrentSituation}
            setExpectedBehavior={setExpectedBehavior}
            setUrl={setUrl}
            setProduct={setProduct}
          />
          <EditBugFormActions
            onSubmit={handleSubmit}
            onShortcut={handleShortcut}
            onITopTicket={handleCreateITopTicket}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
};
