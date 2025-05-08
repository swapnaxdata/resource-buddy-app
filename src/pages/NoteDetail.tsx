import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { 
  FileText, 
  User, 
  Calendar, 
  ArrowUp, 
  ChevronLeft, 
  Download,
  Trash,
  ExternalLink
} from 'lucide-react';
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

const NoteDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [note, setNote] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpvoting, setIsUpvoting] = useState(false);
  
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
  }, [id, toast, navigate]);
  
  const handleUpvote = async () => {
    if (!user || !note) return;
    
    try {
      // Prevent double clicks
      if (isUpvoting) return;
      setIsUpvoting(true);
      
      // Get current upvotes count
      const currentUpvotes = note.upvotes || 0;
      
      // Update the upvote count
      const { error } = await supabase
        .from('resources')
        .update({ upvotes: currentUpvotes + 1 })
        .eq('id', note.id);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setNote({
        ...note,
        upvotes: currentUpvotes + 1
      });
      
      toast({
        title: 'Success',
        description: 'You upvoted this note',
      });
      
    } catch (error) {
      console.error('Error upvoting:', error);
      toast({
        title: 'Error',
        description: 'Failed to upvote',
        variant: 'destructive',
      });
    } finally {
      setIsUpvoting(false);
    }
  };
  
  const handleDelete = async () => {
    if (!note) return;
    
    try {
      // First, try to delete from storage if there's a file URL
      if (note.file_url) {
        const fileUrl = note.file_url;
        const filePath = fileUrl.split('/').pop();
        
        if (filePath) {
          // Extract bucket and path
          const parts = fileUrl.split('/');
          const bucketIndex = parts.findIndex(part => part === 'object') + 1;
          
          if (bucketIndex > 0 && bucketIndex < parts.length) {
            const bucket = parts[bucketIndex];
            const path = parts.slice(bucketIndex + 1).join('/');
            
            const { error } = await supabase
              .storage
              .from(bucket)
              .remove([path]);
              
            if (error) {
              console.error('Error deleting file from storage:', error);
              // Continue even if storage deletion fails
            }
          }
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
      
      toast({
        title: 'Success',
        description: 'Note deleted successfully',
      });
      
      navigate('/');
    } catch (error) {
      console.error('Error deleting note:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete note',
        variant: 'destructive',
      });
    }
  };
  
  const isOwner = user?.email === note?.user_email;
  const isAdmin = profile?.role === 'admin';
  const canDelete = isOwner || isAdmin;
  
  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-[50vh]">
          <p className="text-lg">Loading note...</p>
        </div>
      </MainLayout>
    );
  }
  
  if (!note) {
    return (
      <MainLayout>
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
      </MainLayout>
    );
  }
  
  const timeAgo = formatDistanceToNow(new Date(note.created_at), { addSuffix: true });
  
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
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-start">
              <Badge className="bg-primary-purple/10 text-primary-purple border-primary-purple/20 hover:bg-primary-purple/20">
                {note.subject}
              </Badge>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleUpvote}
                  disabled={!user}
                  className="flex items-center gap-1"
                >
                  <ArrowUp size={16} />
                  <span>Upvote ({note.upvotes})</span>
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
            </div>
            
            <h1 className="text-2xl font-bold">{note.title}</h1>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <User size={16} />
                  <span>{note.user_email.split('@')[0]}</span>
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
          </div>
          
          <div className="border-t p-6 bg-gray-50">
            <div className="max-w-3xl mx-auto">
              <div className="aspect-w-16 aspect-h-9 mb-8">
                <iframe 
                  src={`${note.file_url}#toolbar=0`}
                  className="w-full h-[500px] border"
                  title={note.title}
                  allow="fullscreen"
                />
              </div>
              
              <div className="flex justify-center">
                <Button
                  onClick={() => window.open(note.file_url, '_blank')}
                  className="bg-primary-purple hover:bg-primary-purple/90"
                >
                  <ExternalLink size={18} className="mr-2" />
                  Open PDF in Full Screen
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default NoteDetail;
