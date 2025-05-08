
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle } from 'lucide-react';

const Confirm = () => {
  const [searchParams] = useSearchParams();
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const confirmUser = async () => {
      const confirmationUrl = searchParams.get('confirmation_url');
      
      if (!confirmationUrl) {
        setIsSuccess(false);
        toast({
          title: 'Error',
          description: 'Invalid confirmation link. Please try again or contact support.',
          variant: 'destructive',
        });
        return;
      }

      try {
        setIsConfirming(true);
        
        // Extract the token and type from the URL
        const url = new URL(confirmationUrl);
        const token = url.searchParams.get('token');
        const type = url.searchParams.get('type');
        
        if (!token || !type) {
          throw new Error('Invalid confirmation link parameters');
        }
        
        // Redirect to the actual Supabase URL for confirmation
        window.location.href = confirmationUrl;
        
        // Note: After redirection, this code won't continue
        // The state updates below are just fallbacks
        setIsSuccess(true);
        
      } catch (error) {
        console.error('Confirmation error:', error);
        setIsSuccess(false);
        toast({
          title: 'Confirmation Failed',
          description: 'There was an error confirming your email. Please try again or contact support.',
          variant: 'destructive',
        });
      } finally {
        setIsConfirming(false);
      }
    };

    confirmUser();
  }, [searchParams, toast]);

  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-4">
        <div className="w-full max-w-md text-center space-y-6 bg-white p-8 rounded-lg shadow-sm border">
          {isConfirming ? (
            <>
              <div className="animate-pulse flex flex-col items-center justify-center space-y-4">
                <div className="h-12 w-12 bg-primary-purple/20 rounded-full"></div>
                <div className="h-4 w-32 bg-primary-purple/20 rounded"></div>
              </div>
              <p className="text-gray-600">Confirming your account...</p>
            </>
          ) : isSuccess === true ? (
            <>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold">Thank you for registering!</h2>
              <p className="text-gray-600">
                Your email has been confirmed successfully. You can now access all features of StudyBuddy.
              </p>
              <Button 
                onClick={() => navigate('/')} 
                className="bg-primary-purple hover:bg-primary-purple/90 w-full"
              >
                Go to Home Page
              </Button>
            </>
          ) : isSuccess === false ? (
            <>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold">Confirmation Failed</h2>
              <p className="text-gray-600">
                There was an issue confirming your email. Please try again or contact support.
              </p>
              <div className="flex flex-col space-y-2">
                <Button 
                  onClick={() => window.location.reload()} 
                  className="bg-primary-purple hover:bg-primary-purple/90 w-full"
                >
                  Try Again
                </Button>
                <Button 
                  onClick={() => navigate('/login')} 
                  variant="outline" 
                  className="w-full"
                >
                  Back to Login
                </Button>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </MainLayout>
  );
};

export default Confirm;
