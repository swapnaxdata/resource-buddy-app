
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, ArrowUp, User, Calendar, ExternalLink, Trash, Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
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

interface NoteCardProps {
  note: {
    id: string;
    title: string;
    subject: string;
    user_email: string;
    created_at: string;
    upvotes: number;
    file_url?: string;
  };
  onUpvote?: (id: string) => void;
  onDelete?: (id: string) => void;
  showActions?: boolean;
}

const NoteCard = ({ note, onUpvote, onDelete, showActions = false }: NoteCardProps) => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  
  const handleUpvote = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onUpvote) {
      onUpvote(note.id);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(note.id);
    }
  };
  
  const handleViewFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (note.file_url) {
      window.open(note.file_url, '_blank');
    }
  };
  
  const timeAgo = formatDistanceToNow(new Date(note.created_at), { addSuffix: true });
  
  const isOwner = user?.email === note.user_email;
  const isAdmin = profile?.role === 'admin';
  const canDelete = showActions && (isOwner || isAdmin);
  
  return (
    <Card 
      onClick={() => navigate(`/note/${note.id}`)}
      className="hover:shadow-md transition-all cursor-pointer border border-gray-200 hover:border-primary-purple/30 overflow-hidden animate-fade-in"
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Badge variant="outline" className="bg-primary-purple/10 text-primary-purple border-primary-purple/20">
            {note.subject}
          </Badge>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleUpvote}
            disabled={!user}
            className="h-8 w-8"
          >
            <ArrowUp size={16} />
          </Button>
        </div>
        <CardTitle className="text-lg mt-2">{note.title}</CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center text-sm text-gray-500 gap-1">
          <FileText size={14} />
          <span>Study Notes</span>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between text-sm text-gray-500 pt-0">
        <div className="flex items-center gap-1">
          <User size={14} />
          <span>{note.user_email.split('@')[0]}</span>
        </div>
        
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-1">
            <ArrowUp size={14} />
            <span>{note.upvotes}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span>{timeAgo}</span>
          </div>
        </div>
      </CardFooter>
      
      {(note.file_url || canDelete) && (
        <div className="p-3 pt-0 flex gap-2 justify-end">
          {note.file_url && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleViewFile}
              className="text-xs"
            >
              <ExternalLink size={14} className="mr-1" />
              View PDF
            </Button>
          )}
          
          {canDelete && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={(e) => e.stopPropagation()}
                  className="text-xs"
                >
                  <Trash size={14} className="mr-1" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete this study note and remove it from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDelete}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      )}
    </Card>
  );
};

export default NoteCard;
