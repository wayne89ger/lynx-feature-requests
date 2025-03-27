
import React, { useState, useRef } from "react";
import { Textarea, TextareaProps } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Paperclip, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImagePasteTextareaProps extends TextareaProps {
  onImagePaste?: (file: File) => void;
}

export const ImagePasteTextarea = React.forwardRef<HTMLTextAreaElement, ImagePasteTextareaProps>(
  ({ onImagePaste, ...props }, ref) => {
    const { toast } = useToast();
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const [pastedImages, setPastedImages] = useState<{file: File, previewUrl: string}[]>([]);

    // Combine the refs
    const handleRef = (element: HTMLTextAreaElement) => {
      textareaRef.current = element;
      
      if (typeof ref === 'function') {
        ref(element);
      } else if (ref) {
        ref.current = element;
      }
    };

    // Handle paste event
    const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
      if (e.clipboardData.files.length > 0) {
        const file = e.clipboardData.files[0];
        
        // Validate that it's an image
        if (!file.type.startsWith('image/')) {
          toast({
            title: "Invalid file type",
            description: "Only images can be pasted into this field",
            variant: "destructive",
          });
          return;
        }
        
        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
          toast({
            title: "File too large",
            description: "Please paste an image smaller than 5MB",
            variant: "destructive",
          });
          return;
        }
        
        // Create a URL for preview
        const previewUrl = URL.createObjectURL(file);
        setPastedImages(prev => [...prev, {file, previewUrl}]);
        
        // Call the callback with the file
        if (onImagePaste) {
          onImagePaste(file);
          
          toast({
            title: "Image attached",
            description: "Image has been attached to your description",
          });
        }
      }
    };

    const removeImage = (index: number) => {
      setPastedImages(prev => {
        const newImages = [...prev];
        // Revoke the object URL to avoid memory leaks
        URL.revokeObjectURL(newImages[index].previewUrl);
        newImages.splice(index, 1);
        return newImages;
      });
    };

    // Clean up object URLs when component unmounts
    React.useEffect(() => {
      return () => {
        pastedImages.forEach(img => URL.revokeObjectURL(img.previewUrl));
      };
    }, []);

    return (
      <div className="space-y-2">
        <Textarea
          ref={handleRef}
          onPaste={handlePaste}
          {...props}
        />
        {pastedImages.length > 0 && (
          <div className="mt-2 space-y-2">
            {pastedImages.map((img, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-md group">
                <div className="flex items-center gap-2 flex-1">
                  <Paperclip className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm truncate">{img.file.name}</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => removeImage(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);

ImagePasteTextarea.displayName = "ImagePasteTextarea";
