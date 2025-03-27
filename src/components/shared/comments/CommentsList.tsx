
import { ScrollArea } from "@/components/ui/scroll-area";
import { EditableComment } from "./EditableComment";

interface Comment {
  id: number;
  text: string;
  reporter: string;
  timestamp: string;
  attachment?: string;
}

interface CommentsListProps {
  comments: Comment[];
  onEditComment: (commentId: number, newText: string) => void;
}

export const CommentsList = ({ comments, onEditComment }: CommentsListProps) => {
  return (
    <ScrollArea className="h-[300px] w-full rounded-md border p-4">
      {comments.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No comments yet. Be the first to comment!</p>
      ) : (
        comments.map((comment) => (
          <EditableComment
            key={comment.id}
            id={comment.id}
            text={comment.text}
            reporter={comment.reporter}
            timestamp={comment.timestamp}
            attachment={comment.attachment}
            onEdit={onEditComment}
          />
        ))
      )}
    </ScrollArea>
  );
};
