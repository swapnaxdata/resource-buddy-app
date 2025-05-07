
import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import FileUpload from '@/components/resources/FileUpload';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Upload as UploadIcon, FileText } from 'lucide-react';

const Upload = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to upload study notes',
        variant: 'destructive',
      });
    }
  }, [user, isLoading, navigate, toast]);
  
  const handleUploadComplete = () => {
    navigate('/my-notes');
  };
  
  if (isLoading) {
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
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex justify-center items-center p-3 bg-primary-purple/10 rounded-full">
            <UploadIcon size={24} className="text-primary-purple" />
          </div>
          
          <h1 className="text-2xl font-bold">Upload Study Notes</h1>
          <p className="text-gray-600">
            Share your study materials with other students. 
            Accepted file format: PDF (max 5MB).
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <FileUpload onUploadComplete={handleUploadComplete} />
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <FileText className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-blue-800">Guidelines for Uploaders</h3>
              <div className="mt-2 text-sm text-blue-700 space-y-1">
                <p>• Only upload content you have the right to share</p>
                <p>• Make sure your PDF is readable and properly formatted</p>
                <p>• Give your notes a clear, descriptive title</p>
                <p>• Select the most relevant subject category</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Upload;
