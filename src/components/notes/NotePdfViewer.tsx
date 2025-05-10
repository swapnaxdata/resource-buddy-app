
import React from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

interface NotePdfViewerProps {
  fileUrl: string;
  title: string;
}

const NotePdfViewer: React.FC<NotePdfViewerProps> = ({ fileUrl, title }) => {
  return (
    <div className="border-t p-6 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <div className="aspect-w-16 aspect-h-9 mb-8">
          <iframe 
            src={`${fileUrl}#toolbar=0`}
            className="w-full h-[500px] border"
            title={title}
            allow="fullscreen"
          />
        </div>
        
        <div className="flex justify-center">
          <Button
            onClick={() => window.open(fileUrl, '_blank')}
            className="bg-primary-purple hover:bg-primary-purple/90"
          >
            <ExternalLink size={18} className="mr-2" />
            Open PDF in Full Screen
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotePdfViewer;
