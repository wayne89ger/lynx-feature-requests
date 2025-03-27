
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Paperclip, X, Clipboard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AttachmentUploadProps {
  attachment: File | null;
  setAttachment: (file: File | null) => void;
}

export const AttachmentUpload = ({ attachment, setAttachment }: AttachmentUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file: File) => {
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 5MB",
        variant: "destructive",
      });
      return;
    }
    setAttachment(file);
    toast({
      title: "File attached",
      description: file.name,
    });
  };

  const handleRemoveFile = () => {
    setAttachment(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="text-xs"
          onClick={() => fileInputRef.current?.click()}
        >
          <Paperclip className="h-3 w-3 mr-1" />
          Attach File
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="text-xs"
          onClick={() => toast({
            title: "Clipboard paste enabled",
            description: "You can paste an image directly from your clipboard"
          })}
        >
          <Clipboard className="h-3 w-3 mr-1" />
          Paste from clipboard
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
      
      {attachment && (
        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
          <span className="text-xs truncate max-w-[200px]">{attachment.name}</span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-5 w-5 p-0"
            onClick={handleRemoveFile}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}
    </div>
  );
};
