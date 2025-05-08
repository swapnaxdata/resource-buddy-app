
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(false);
  
  const { updatePassword } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Check if we have a valid reset token in the URL
  useEffect(() => {
    // The URL should contain a hash fragment with the access token
    // when coming from the reset password email
    const hash = window.location.hash;
    if (hash && hash.includes('access_token=')) {
      setIsTokenValid(true);
    } else {
      toast({
        title: 'Invalid Link',
        description: 'This password reset link is invalid or has expired.',
        variant: 'destructive',
      });
      navigate('/login');
    }
  }, [navigate, toast]);
  
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords match and meet requirements
    if (password !== confirmPassword) {
      toast({
        title: 'Passwords do not match',
        description: 'Please make sure your passwords match.',
        variant: 'destructive',
      });
      return;
    }
    
    if (password.length < 6) {
      toast({
        title: 'Password too short',
        description: 'Password must be at least 6 characters long.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      await updatePassword(password);
      
      toast({
        title: 'Success',
        description: 'Your password has been reset successfully.',
      });
      
      // Redirect to login page
      navigate('/login');
    } catch (error) {
      console.error('Error resetting password:', error);
      toast({
        title: 'Password Reset Failed',
        description: 'There was a problem resetting your password. Please try again or contact support.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!isTokenValid) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-[70vh]">
          <p>Verifying reset link...</p>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="flex justify-center items-center min-h-[70vh] py-8">
        <div className="w-full max-w-md">
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Reset Your Password</CardTitle>
              <CardDescription>
                Please enter a new password for your account
              </CardDescription>
            </CardHeader>
            
            <form onSubmit={handleResetPassword}>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input 
                    id="confirm-password" 
                    type="password" 
                    placeholder="••••••••" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <p className="text-xs text-gray-500">
                    Password must be at least 6 characters.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  type="submit" 
                  className="w-full bg-primary-purple hover:bg-primary-purple/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Resetting Password...' : 'Reset Password'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default ResetPassword;
