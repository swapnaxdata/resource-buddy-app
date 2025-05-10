
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { User, Calendar, FileText } from 'lucide-react';

interface NoteMetadataProps {
  userEmail: string;
  createdAt: string;
}

const NoteMetadata: React.FC<NoteMetadataProps> = ({ userEmail, createdAt }) => {
  const timeAgo = formatDistanceToNow(new Date(createdAt), { addSuffix: true });
  
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm text-gray-600 px-6 pb-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <User size={16} />
          <span>{userEmail.split('@')[0]}</span>
        </div>
        
        <div className="flex items-center gap-1">
          <Calendar size={16} />
          <span>{timeAgo}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-1">
        <FileText size={16} />
        <span>Study Notes</span>
      </div>
    </div>
  );
};

export default NoteMetadata;
