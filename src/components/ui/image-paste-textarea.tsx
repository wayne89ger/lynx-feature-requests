
import React, { useState, useRef, useEffect } from "react";
import { Textarea, TextareaProps } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Paperclip, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImagePasteTextareaProps extends TextareaProps {
  onImagePaste?: (file: File) => void;
  existingImageUrls?: string[]; // Add support for existing image URLs
}

export const ImagePasteTextarea = React.forwardRef<HTMLTextAreaElement, ImagePasteTextareaProps>(
  ({ onImagePaste, existingImageUrls = [], ...props }, ref) => {
    const { toast } = useToast();
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const [pastedImages, setPastedImages] = useState<{file: File, previewUrl: string}[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>(existingImageUrls);
    const [previewContainerHeight, setPreviewContainerHeight] = useState<number>(0);

    // Update existing images when the prop changes
    useEffect(() => {
      setExistingImages(existingImageUrls);
    }, [existingImageUrls]);

    // Combine the refs
    const handleRef = (element: HTMLTextAreaElement) => {
      textareaRef.current = element;
      
      if (typeof ref === 'function') {
        ref(element);
      } else if (ref) {
        ref.current = element;
      }
    };

    // Adjust textarea height based on content
    useEffect(() => {
      if (textareaRef.current) {
        // Reset height to get the new scroll height
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight + previewContainerHeight}px`;
      }
    }, [props.value, pastedImages, existingImages, previewContainerHeight]);

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

    const removeExistingImage = (index: number) => {
      setExistingImages(prev => {
        const newImages = [...prev];
        newImages.splice(index, 1);
        return newImages;
      });
    };

    // Update container height when preview container ref is available
    const previewContainerRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
      if (previewContainerRef.current) {
        setPreviewContainerHeight(previewContainerRef.current.offsetHeight);
      } else {
        setPreviewContainerHeight(0);
      }
    }, [pastedImages, existingImages]);

    // Clean up object URLs when component unmounts
    useEffect(() => {
      return () => {
        pastedImages.forEach(img => URL.revokeObjectURL(img.previewUrl));
      };
    }, []);

    const hasImages = pastedImages.length > 0 || existingImages.length > 0;

    return (
      <div className="relative">
        <Textarea
          ref={handleRef}
          onPaste={handlePaste}
          {...props}
          className={`${props.className || ''} ${hasImages ? 'pb-24' : ''}`}
        />
        
        {hasImages && (
          <div 
            className="absolute bottom-2 left-2 right-2 flex flex-wrap gap-2" 
            ref={previewContainerRef}
          >
            {existingImages.map((imageUrl, index) => (
              <div key={`existing-${index}`} className="relative group">
                <div className="rounded-md overflow-hidden border border-gray-200 shadow-sm">
                  <img 
                    src={imageUrl} 
                    alt={`Existing attachment ${index + 1}`} 
                    className="h-16 w-auto object-cover"
                  />
                </div>
                <button
                  type="button"
                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-gray-700 text-white flex items-center justify-center opacity-70 hover:opacity-100"
                  onClick={() => removeExistingImage(index)}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            
            {pastedImages.map((img, index) => (
              <div key={`new-${index}`} className="relative group">
                <div className="rounded-md overflow-hidden border border-gray-200 shadow-sm">
                  <img 
                    src={img.previewUrl} 
                    alt={img.file.name} 
                    className="h-16 w-auto object-cover"
                  />
                </div>
                <button
                  type="button"
                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-gray-700 text-white flex items-center justify-center opacity-70 hover:opacity-100"
                  onClick={() => removeImage(index)}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);

ImagePasteTextarea.displayName = "ImagePasteTextarea";
