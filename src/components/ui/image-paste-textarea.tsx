
import React, { useState, useRef, useEffect } from "react";
import { Textarea, TextareaProps } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface ImagePasteTextareaProps extends TextareaProps {
  onImagePaste?: (file: File) => void;
}

export const ImagePasteTextarea = React.forwardRef<HTMLTextAreaElement, ImagePasteTextareaProps>(
  ({ onImagePaste, ...props }, ref) => {
    const { toast } = useToast();
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

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

    return (
      <Textarea
        ref={handleRef}
        onPaste={handlePaste}
        {...props}
      />
    );
  }
);

ImagePasteTextarea.displayName = "ImagePasteTextarea";
