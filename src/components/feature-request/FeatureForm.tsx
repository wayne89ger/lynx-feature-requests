
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { AttachmentUpload } from "./components/AttachmentUpload";
import { BasicInformation } from "./form-sections/BasicInformation";
import { UrgencySelection } from "./form-sections/UrgencySelection";
import { PrivacyOptions } from "./form-sections/PrivacyOptions";

interface FeatureFormProps {
  onSubmit: (feature: {
    title: string;
    description: string;
    product: string;
    location?: string;
    canContact: boolean;
    isAnonymous: boolean;
    urgency?: string;
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
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [urgency, setUrgency] = useState("medium");
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

    onSubmit({ 
      title, 
      description, 
      product,
      location,
      canContact,
      isAnonymous,
      urgency,
      attachment: attachment || undefined
    });
    
    setTitle("");
    setDescription("");
    setProduct("");
    setLocation("");
    setCanContact(false);
    setIsAnonymous(false);
    setUrgency("medium");
    setAttachment(null);
    setOpen(false);
    
    toast({
      title: "Feature request submitted",
      description: "Thank you for your feedback!",
    });
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
          <BasicInformation
            title={title}
            description={description}
            product={product}
            location={location}
            isBug={false}
            setTitle={setTitle}
            setDescription={setDescription}
            setProduct={setProduct}
            setLocation={setLocation}
          />
          
          <UrgencySelection 
            urgency={urgency} 
            setUrgency={setUrgency} 
          />
          
          <AttachmentUpload 
            attachment={attachment} 
            setAttachment={setAttachment} 
          />
          
          <PrivacyOptions
            canContact={canContact}
            isAnonymous={isAnonymous}
            setCanContact={setCanContact}
            setIsAnonymous={setIsAnonymous}
          />
          
          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
