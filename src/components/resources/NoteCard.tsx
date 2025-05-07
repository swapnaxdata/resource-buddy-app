
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, ArrowUp, User, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';

interface NoteCardProps {
  note: {
    id: string;
    title: string;
    subject: string;
    user_email: string;
    created_at: string;
    upvotes: number;
  };
  onUpvote?: (id: string) => void;
}

const NoteCard = ({ note, onUpvote }: NoteCardProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const handleUpvote = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onUpvote) {
      onUpvote(note.id);
    }
  };
  
  const timeAgo = formatDistanceToNow(new Date(note.created_at), { addSuffix: true });
  
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
    </Card>
  );
};

export default NoteCard;
