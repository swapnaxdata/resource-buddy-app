
import React from 'react';
import { ChevronLeft } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import NoteHeader from '@/components/notes/NoteHeader';
import NoteMetadata from '@/components/notes/NoteMetadata';
import NotePdfViewer from '@/components/notes/NotePdfViewer';
import NoteDetailState from '@/components/notes/NoteDetailState';
import { useNoteDetail } from '@/hooks/useNoteDetail';

const NoteDetail = () => {
  const {
    note,
    isLoading,
    isUpvoting,
    hasUpvoted,
    user,
    handleUpvote,
    handleDelete,
    canDelete,
    navigate
  } = useNoteDetail();
  
  // Show loading state
  if (isLoading) {
    return (
      <MainLayout>
        <NoteDetailState isLoading={true} />
      </MainLayout>
    );
  }
  
  // Show error state if note not found
  if (!note) {
    return (
      <MainLayout>
        <NoteDetailState error={true} />
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-black"
        >
          <ChevronLeft size={18} className="mr-1" />
          Back to notes
        </Button>
        
        <div className="bg-white rounded-lg border overflow-hidden shadow-sm">
          {/* Note Header with title, subject, and actions */}
          <NoteHeader
            note={note}
            hasUpvoted={hasUpvoted}
            isUpvoting={isUpvoting}
            canDelete={canDelete}
            onUpvote={handleUpvote}
            onDelete={handleDelete}
            user={user}
          />
          
          {/* Note Metadata with author and date */}
          <NoteMetadata
            userEmail={note.user_email}
            createdAt={note.created_at}
          />
          
          {/* PDF Viewer Component */}
          <NotePdfViewer
            fileUrl={note.file_url}
            title={note.title}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default NoteDetail;
