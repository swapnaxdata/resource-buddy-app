
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import NotesList from '@/components/resources/NotesList';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

const MyNotes = () => {
  const [notes, setNotes] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to view your notes',
        variant: 'destructive',
      });
    }
  }, [user, authLoading, navigate, toast]);
  
  // Fetch user's notes
  useEffect(() => {
    const fetchNotes = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('resources')
          .select('*')
          .eq('user_email', user.email)
          .order('created_at', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        setNotes(data || []);
        
        // Extract unique subjects
        const uniqueSubjects = Array.from(
          new Set((data || []).map((note) => note.subject))
        );
        setSubjects(uniqueSubjects as string[]);
        
      } catch (error) {
        console.error('Error fetching notes:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch your notes',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user) {
      fetchNotes();
    }
  }, [user, toast]);
  
  const handleDeleteNote = async (noteId: string) => {
    try {
      // Find the note to delete
      const noteToDelete = notes.find(note => note.id === noteId);
      
      if (!noteToDelete) {
        throw new Error('Note not found');
      }
      
      // Optimistically update UI first
      setNotes(notes.filter(note => note.id !== noteId));
      
      if (noteToDelete?.file_url) {
        const fileUrl = noteToDelete.file_url;
        const parts = fileUrl.split('/');
        const bucketIndex = parts.findIndex(part => part === 'object') + 1;
        
        if (bucketIndex > 0 && bucketIndex < parts.length) {
          const bucket = parts[bucketIndex];
          const path = parts.slice(bucketIndex + 1).join('/');
          
          // Delete the file from storage
          const { error: storageError } = await supabase
            .storage
            .from(bucket)
            .remove([path]);
            
          if (storageError) {
            console.error('Error deleting file from storage:', storageError);
            // Continue even if storage deletion fails
          }
        }
      }
      
      // Then delete the database record
      const { error } = await supabase
        .from('resources')
        .delete()
        .eq('id', noteId);
      
      if (error) {
        // If deletion fails, restore the note in the UI
        setNotes(prev => [...prev, noteToDelete]);
        throw error;
      }
      
      toast({
        title: "Success",
        description: "Note deleted successfully",
      });
      
    } catch (error: any) {
      console.error('Error deleting note:', error);
      toast({
        title: 'Error',
        description: `Failed to delete note: ${error.message || 'Unknown error'}`,
        variant: 'destructive',
      });
    }
  };
  
  if (authLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-[50vh]">
          <p className="text-lg">Loading...</p>
        </div>
      </MainLayout>
    );
  }
  
  if (!user) {
    return null; // Will redirect in the effect
  }
  
  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">My Study Notes</h1>
            <p className="text-gray-600 mt-1">
              Manage your uploaded study materials
            </p>
          </div>
          
          <Button
            onClick={() => navigate('/upload')}
            className="bg-primary-purple hover:bg-primary-purple/90"
          >
            <Upload size={18} className="mr-2" />
            Upload New
          </Button>
        </div>
        
        {notes.length === 0 && !isLoading ? (
          <div className="border border-dashed rounded-lg p-8 text-center bg-gray-50">
            <h3 className="text-lg font-medium mb-2">No notes uploaded yet</h3>
            <p className="text-gray-600 mb-6">
              Start sharing your study materials with other students
            </p>
            <Button
              onClick={() => navigate('/upload')}
              className="bg-primary-purple hover:bg-primary-purple/90"
            >
              <Upload size={18} className="mr-2" />
              Upload Your First Note
            </Button>
          </div>
        ) : (
          <NotesList 
            notes={notes} 
            subjects={subjects}
            onDelete={handleDeleteNote}
            isLoading={isLoading}
            showActions={true}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default MyNotes;
