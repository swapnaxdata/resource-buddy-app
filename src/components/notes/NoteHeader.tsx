
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUp, Trash } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';

interface NoteHeaderProps {
  note: {
    subject: string;
    title: string;
    upvotes: number;
  };
  hasUpvoted: boolean;
  isUpvoting: boolean;
  canDelete: boolean;
  onUpvote: () => void;
  onDelete: () => void;
  user: any | null;
}

const NoteHeader: React.FC<NoteHeaderProps> = ({
  note,
  hasUpvoted,
  isUpvoting,
  canDelete,
  onUpvote,
  onDelete,
  user
}) => {
  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-start">
        <Badge className="bg-primary-purple/10 text-primary-purple border-primary-purple/20 hover:bg-primary-purple/20">
          {note.subject}
        </Badge>
        
        <div className="flex items-center gap-2">
          <Button 
            variant={hasUpvoted ? "default" : "outline"}
            size="sm"
            onClick={onUpvote}
            disabled={!user || isUpvoting || hasUpvoted}
            className={`flex items-center gap-1 ${hasUpvoted ? "bg-green-600 hover:bg-green-700" : ""}`}
          >
            <ArrowUp size={16} />
            <span>{hasUpvoted ? "Upvoted" : "Upvote"} ({note.upvotes})</span>
          </Button>
          
          {canDelete && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="destructive" 
                  size="sm"
                >
                  <Trash size={16} className="mr-1" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete this study note and remove it from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={onDelete}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
      
      <h1 className="text-2xl font-bold">{note.title}</h1>
    </div>
  );
};

export default NoteHeader;
