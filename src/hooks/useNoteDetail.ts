
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { toast as sonnerToast } from "sonner";
import { removeFileFromStorage } from '@/lib/fileUtils';

export function useNoteDetail() {
  const { id } = useParams<{ id: string }>();
  const [note, setNote] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpvoting, setIsUpvoting] = useState(false);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNote = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('resources')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) {
          throw error;
        }
        
        setNote(data);

        // Check if user has already upvoted this note
        if (user) {
          try {
            // Use the REST API directly as a workaround for type issues
            const { data: upvoteData, error: upvoteError } = await fetch(
              `https://ajqoymqeguaavkujpdom.supabase.co/rest/v1/user_upvotes?user_id=eq.${user.id}&resource_id=eq.${id}`,
              {
                method: 'GET',
                headers: {
                  'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqcW95bXFlZ3VhYXZrdWpwZG9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2NDYwNDEsImV4cCI6MjA2MjIyMjA0MX0.q-81PTe_r25K7tcs8gWq2a7nE2e4HZCUY5qrKKCIvfg',
                  'Authorization': `Bearer ${supabase.auth.getSession().then(res => res.data.session?.access_token)}`,
                  'Content-Type': 'application/json'
                }
              }
            ).then(res => res.json());
            
            if (!upvoteError && upvoteData && upvoteData.length > 0) {
              setHasUpvoted(true);
            }
          } catch (checkError) {
            console.error('Error checking upvote status:', checkError);
          }
        }
      } catch (error) {
        console.error('Error fetching note:', error);
        toast({
          title: 'Error',
          description: 'Failed to load study note',
          variant: 'destructive',
        });
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchNote();
  }, [id, toast, navigate, user]);

  const handleUpvote = async () => {
    if (!user || !note || hasUpvoted) return;
    
    try {
      // Prevent double clicks
      if (isUpvoting) return;
      setIsUpvoting(true);
      
      // Get current upvotes count
      const currentUpvotes = note.upvotes || 0;

      // Optimistically update UI first
      setNote({
        ...note,
        upvotes: currentUpvotes + 1
      });
      
      // Call the increment_upvote function using RPC
      const { data, error } = await supabase.rpc('increment_upvote', {
        resource_id: note.id
      });
      
      if (error) {
        // Revert optimistic update if error occurs
        setNote({
          ...note,
          upvotes: currentUpvotes
        });
        throw error;
      }
      
      if (data === true) {
        // Update UI state to show this note has been upvoted by the user
        setHasUpvoted(true);
        toast({
          title: "Success",
          description: "You upvoted this note",
        });
      } else {
        // The user has already upvoted this note
        toast({
          title: "Already upvoted",
          description: "You have already upvoted this note",
        });
        // Revert optimistic update since the upvote didn't actually increment
        setNote({
          ...note,
          upvotes: currentUpvotes
        });
      }
      
    } catch (error: any) {
      console.error('Error upvoting:', error);
      toast({
        title: 'Error',
        description: `Failed to upvote: ${error.message || 'Unknown error'}`,
        variant: 'destructive',
      });
    } finally {
      setIsUpvoting(false);
    }
  };
  
  const handleDelete = async () => {
    if (!note) return;
    
    try {
      sonnerToast.loading('Deleting note...');
      
      // First, try to delete from storage if there's a file URL
      if (note.file_url) {
        const success = await removeFileFromStorage(note.file_url);
        if (!success) {
          sonnerToast.warning('Warning', {
            description: 'File could not be deleted from storage, but the database entry will be removed'
          });
        }
      }
      
      // Then delete the database record
      const { error } = await supabase
        .from('resources')
        .delete()
        .eq('id', note.id);
      
      if (error) {
        throw error;
      }
      
      sonnerToast.dismiss();
      sonnerToast.success('Note deleted successfully');
      
      navigate('/my-notes');
    } catch (error: any) {
      console.error('Error deleting note:', error);
      sonnerToast.error('Error deleting note', {
        description: error.message || 'Unknown error'
      });
    }
  };

  // Compute permissions
  const isOwner = user?.email === note?.user_email;
  const isAdmin = profile?.role === 'admin';
  const canDelete = isOwner || isAdmin;

  return {
    note,
    isLoading,
    isUpvoting,
    hasUpvoted,
    user,
    handleUpvote,
    handleDelete,
    canDelete,
    navigate
  };
}
