import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

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
  const { toast } = useToast();

  const handleSubmit = () => {
    // For now, we'll just close the form without making any changes
    onClose();
    toast({
      title: "Form cleared",
      description: "The bug edit form will be rebuilt with proper fields soon.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit bug report</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 mt-4">
          <p className="text-muted-foreground">
            This form is being rebuilt. Please check back later.
          </p>
          <Button onClick={handleSubmit} className="w-full">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};