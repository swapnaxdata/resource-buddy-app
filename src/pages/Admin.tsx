
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Shield, Trash, UserCog } from 'lucide-react';
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

type UserWithProfile = {
  id: string;
  email: string;
  role: string;
  created_at?: string; // Make this optional to match the data from Supabase
};

const Admin = () => {
  const [users, setUsers] = useState<UserWithProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [resourceCount, setResourceCount] = useState<Record<string, number>>({});
  
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Protect this route - only accessible to admins
  useEffect(() => {
    if (!isLoading && (!user || profile?.role !== 'admin')) {
      navigate('/');
      toast({
        title: 'Access Denied',
        description: 'You must be an admin to access this page',
        variant: 'destructive',
      });
    }
  }, [user, profile, isLoading, navigate, toast]);
  
  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*');
        
        if (error) {
          throw error;
        }
        
        setUsers(data || []);
        
        // Count resources for each user
        const counts: Record<string, number> = {};
        
        for (const user of data || []) {
          const { count, error: countError } = await supabase
            .from('resources')
            .select('*', { count: 'exact', head: true })
            .eq('user_email', user.email);
          
          if (!countError) {
            counts[user.email] = count || 0;
          }
        }
        
        setResourceCount(counts);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast({
          title: 'Error',
          description: 'Failed to load users',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUsers();
  }, [toast]);
  
  const handlePromoteUser = async (userId: string, currentRole: string) => {
    try {
      const newRole = currentRole === 'admin' ? 'user' : 'admin';
      
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setUsers(users.map(u => 
        u.id === userId ? { ...u, role: newRole } : u
      ));
      
      toast({
        title: 'Success',
        description: `User has been ${newRole === 'admin' ? 'promoted to admin' : 'demoted to user'}`,
      });
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user role',
        variant: 'destructive',
      });
    }
  };
  
  const handleDeleteUserResources = async (email: string) => {
    try {
      const { error } = await supabase
        .from('resources')
        .delete()
        .eq('user_email', email);
      
      if (error) {
        throw error;
      }
      
      // Update resource count
      setResourceCount(prev => ({
        ...prev,
        [email]: 0
      }));
      
      toast({
        title: 'Success',
        description: 'All resources by this user have been deleted',
      });
    } catch (error) {
      console.error('Error deleting resources:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete user resources',
        variant: 'destructive',
      });
    }
  };
  
  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-[50vh]">
          <p className="text-lg">Loading admin panel...</p>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center gap-2 bg-primary-purple/10 px-3 py-1 rounded-md">
            <Shield size={18} className="text-primary-purple" />
            <span className="text-primary-purple font-medium">Admin Mode</span>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">User Management</h2>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Resources</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role}
                      </span>
                    </TableCell>
                    <TableCell>{resourceCount[user.email] || 0}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePromoteUser(user.id, user.role)}
                          disabled={user.id === profile?.id} // Can't change own role
                          title={user.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                        >
                          <UserCog size={16} />
                        </Button>
                        
                        {resourceCount[user.email] > 0 && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="destructive"
                                size="sm"
                                title="Delete all resources"
                              >
                                <Trash size={16} />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete User Resources</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will delete all resources uploaded by {user.email}. 
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDeleteUserResources(user.email)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete All Resources
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                
                {users.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      No users found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Admin;
