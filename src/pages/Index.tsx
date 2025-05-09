
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import NotesList from '@/components/resources/NotesList';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Upload, BookOpenText } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const [notes, setNotes] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setIsLoading(true);
      
      // Get all notes
      const { data: notesData, error: notesError } = await supabase
        .from('resources')
        .select('*')
        .order('created_at', { ascending: false });

      if (notesError) {
        throw notesError;
      }

      setNotes(notesData || []);

      // Extract unique subjects
      const uniqueSubjects = Array.from(
        new Set((notesData || []).map((note) => note.subject))
      );
      setSubjects(uniqueSubjects as string[]);

    } catch (error) {
      console.error('Error fetching notes:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch notes. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpvote = async (noteId: string) => {
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'You need to sign in to upvote notes',
        variant: 'default',
      });
      return;
    }

    try {
      // First, get the current note to get its current upvote count
      const { data: note, error: getError } = await supabase
        .from('resources')
        .select('upvotes')
        .eq('id', noteId)
        .single();

      if (getError) {
        console.error('Error fetching note details:', getError);
        throw getError;
      }

      // Calculate the new upvote count
      const newUpvoteCount = (note?.upvotes || 0) + 1;
      
      // Create a specialized function to update just the upvote count
      const { error: updateError } = await supabase.rpc('increment_upvote', { 
        resource_id: noteId 
      });

      if (updateError) {
        console.error('Error updating upvote:', updateError);
        throw updateError;
      }

      // Update the local state to reflect the change
      setNotes(
        notes.map((note) =>
          note.id === noteId ? { ...note, upvotes: newUpvoteCount } : note
        )
      );

      toast({
        title: 'Success',
        description: 'Note upvoted successfully!',
        variant: 'default',
      });

    } catch (error: any) {
      console.error('Error upvoting note:', error);
      toast({
        title: 'Error',
        description: `Failed to upvote note: ${error.message || 'Unknown error'}`,
        variant: 'destructive',
      });
    }
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold">StudyBuddy</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover and share study resources to help you ace your exams!
          </p>
          
          <div className="flex justify-center gap-4 pt-2">
            <Button
              onClick={() => navigate('/upload')}
              className="bg-primary-purple hover:bg-primary-purple/90"
              disabled={!user}
            >
              <Upload size={18} className="mr-2" />
              Upload Notes
            </Button>
            
            <Button
              variant="outline"
              onClick={() => navigate(user ? '/my-notes' : '/login')}
            >
              <BookOpenText size={18} className="mr-2" />
              {user ? 'My Notes' : 'Sign In'}
            </Button>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-6">Recent Study Notes</h2>
          <NotesList 
            notes={notes} 
            subjects={subjects} 
            onUpvote={handleUpvote}
            isLoading={isLoading} 
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
