
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LogIn,
  User, 
  BookOpenText,
  Upload,
  FileText,
  Settings
} from 'lucide-react';

const Navbar = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  const isAdmin = profile?.role === 'admin';
  
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 py-4 px-4 md:px-8">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <BookOpenText size={24} className="text-primary-purple" />
          <span className="text-xl font-semibold">StudyBuddy</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className={`text-sm hover:text-primary-purple ${location.pathname === '/' ? 'text-primary-purple font-medium' : 'text-gray-600'}`}>
            Home
          </Link>
          {user && (
            <>
              <Link to="/upload" className={`text-sm hover:text-primary-purple ${location.pathname === '/upload' ? 'text-primary-purple font-medium' : 'text-gray-600'}`}>
                Upload
              </Link>
              <Link to="/my-notes" className={`text-sm hover:text-primary-purple ${location.pathname === '/my-notes' ? 'text-primary-purple font-medium' : 'text-gray-600'}`}>
                My Notes
              </Link>
              {isAdmin && (
                <Link to="/admin" className={`text-sm hover:text-primary-purple ${location.pathname === '/admin' ? 'text-primary-purple font-medium' : 'text-gray-600'}`}>
                  Admin
                </Link>
              )}
            </>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/profile')}
                className="flex items-center gap-2"
              >
                <User size={18} />
                <span className="hidden md:inline">{user.email?.split('@')[0]}</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => navigate('/login')}
              className="bg-primary-purple hover:bg-primary-purple/90 text-white"
              size="sm"
            >
              <LogIn size={16} className="mr-2" />
              Sign In
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
