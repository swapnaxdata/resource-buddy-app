
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface NoteDetailStateProps {
  isLoading: boolean;
  error?: boolean;
}

const NoteDetailState: React.FC<NoteDetailStateProps> = ({ isLoading, error = false }) => {
  const navigate = useNavigate();
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p className="text-lg">Loading note...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">Note not found</h2>
        <p className="mt-2 text-gray-600">
          The study note you're looking for doesn't exist or has been removed.
        </p>
        <Button 
          variant="link" 
          onClick={() => navigate('/')}
          className="mt-4"
        >
          Go back to homepage
        </Button>
      </div>
    );
  }
  
  return null;
};

export default NoteDetailState;
