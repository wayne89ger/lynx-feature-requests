
import { Paperclip } from "lucide-react";

interface AttachmentDisplayProps {
  attachment?: string;
}

export const AttachmentDisplay = ({ attachment }: AttachmentDisplayProps) => {
  if (!attachment) return null;
  
  return (
    <a 
      href={attachment} 
      target="_blank" 
      rel="noopener noreferrer"
      className="inline-flex items-center text-[10px] sm:text-sm text-primary hover:underline"
    >
      <Paperclip className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
      <span className="whitespace-nowrap">View attachment</span>
    </a>
  );
};
