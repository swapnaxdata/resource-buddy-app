
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { generateFileName, STORAGE_BUCKET } from '@/lib/supabase';
import { Upload } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface FileUploadProps {
  onUploadComplete: () => void;
}

const FileUpload = ({ onUploadComplete }: FileUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [fileError, setFileError] = useState('');
  
  const { toast } = useToast();
  const { user } = useAuth();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      setFile(null);
      return;
    }
    
    const selectedFile = e.target.files[0];
    
    // Validate file type (only PDFs allowed)
    if (selectedFile.type !== 'application/pdf') {
      setFileError('Only PDF files are allowed');
      setFile(null);
      return;
    }
    
    // Validate file size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setFileError('File size must be less than 5MB');
      setFile(null);
      return;
    }
    
    setFileError('');
    setFile(selectedFile);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to upload files',
        variant: 'destructive',
      });
      return;
    }
    
    if (!file) {
      setFileError('Please select a file to upload');
      return;
    }
    
    if (!title.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a title for your notes',
        variant: 'destructive',
      });
      return;
    }
    
    if (!subject.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a subject for your notes',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setIsUploading(true);
      
      // Generate a unique file name
      const fileName = generateFileName(file.name);
      const folderPath = `${user.id}/${fileName}`;
      
      // Upload file to storage
      const { data: fileData, error: fileError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(folderPath, file);
      
      if (fileError) {
        throw fileError;
      }
      
      // Get the public URL for the file
      const { data: urlData } = await supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(folderPath);
      
      if (!urlData?.publicUrl) {
        throw new Error('Failed to generate public URL for the file');
      }
      
      // Save record to database
      const { error: dbError } = await supabase.from('resources').insert({
        title,
        subject,
        file_url: urlData.publicUrl,
        user_email: user.email ?? '',
      });
      
      if (dbError) {
        throw dbError;
      }
      
      // Reset form
      setFile(null);
      setTitle('');
      setSubject('');
      
      toast({
        title: 'Success',
        description: 'Your notes have been uploaded successfully',
      });
      
      // Trigger callback to refresh the notes list
      onUploadComplete();
      
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: 'Upload failed',
        description: 'There was an error uploading your file. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Study notes on..."
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Mathematics, Biology, Computer Science, etc."
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="file">PDF File</Label>
          <Input
            id="file"
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary-purple/10 file:text-primary-purple hover:file:bg-primary-purple/20"
            required
          />
          {fileError && (
            <p className="text-sm text-destructive">{fileError}</p>
          )}
          <p className="text-xs text-gray-500">
            Upload a PDF file. Maximum file size: 5MB.
          </p>
        </div>
        
        <Button
          type="submit"
          className="bg-primary-purple hover:bg-primary-purple/90 w-full"
          disabled={isUploading || !file || !title || !subject}
        >
          {isUploading ? (
            'Uploading...'
          ) : (
            <>
              <Upload size={18} className="mr-2" />
              Upload Notes
            </>
          )}
        </Button>
      </form>
    </div>
  );
};

export default FileUpload;
