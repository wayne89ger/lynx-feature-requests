
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Paperclip, Edit, X, Save } from "lucide-react";

interface EditableCommentProps {
  id: number;
  text: string;
  reporter: string;
  timestamp: string;
  attachment?: string;
  onEdit: (commentId: number, newText: string) => void;
}

export const EditableComment = ({ 
  id, 
  text, 
  reporter, 
  timestamp, 
  attachment, 
  onEdit 
}: EditableCommentProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(text);

  const startEditing = () => {
    setIsEditing(true);
    setEditText(text);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditText(text);
  };

  const saveEdit = () => {
    if (editText.trim()) {
      onEdit(id, editText);
      setIsEditing(false);
    }
  };

  return (
    <div className="mb-4 last:mb-0 border-b last:border-0 pb-3">
      {isEditing ? (
        <div className="space-y-2">
          <Textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="w-full min-h-[80px] text-sm"
          />
          <div className="flex gap-2 justify-end">
            <Button 
              onClick={cancelEditing} 
              variant="outline" 
              size="sm"
              className="h-8 px-2 gap-1"
            >
              <X className="h-3 w-3" />
              Cancel
            </Button>
            <Button 
              onClick={saveEdit} 
              size="sm"
              className="h-8 px-2 gap-1"
            >
              <Save className="h-3 w-3" />
              Save
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between">
            <p className="text-sm text-gray-600">{text}</p>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={startEditing}
              className="p-1 h-6 w-6"
            >
              <Edit className="h-3 w-3" />
            </Button>
          </div>
          {attachment && (
            <a 
              href={attachment} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center mt-1 text-xs text-primary hover:underline"
            >
              <Paperclip className="h-3 w-3 mr-1" />
              View attachment
            </a>
          )}
          <div className="mt-1 flex items-center gap-2 text-xs text-gray-400">
            <span className="font-medium text-gray-500">{reporter}</span>
            <span>•</span>
            <span>{timestamp}</span>
          </div>
        </>
      )}
    </div>
  );
};
