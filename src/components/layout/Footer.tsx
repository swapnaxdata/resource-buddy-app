
import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpenText } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-8 px-4 mt-auto">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <BookOpenText size={20} className="text-primary-purple" />
            <span className="text-lg font-semibold">StudyBuddy</span>
          </div>
          
          <div className="flex items-center space-x-6 text-sm text-gray-600">
            <Link to="/" className="hover:text-primary-purple transition-colors">
              Home
            </Link>
            <Link to="/about" className="hover:text-primary-purple transition-colors">
              About
            </Link>
            <Link to="/privacy" className="hover:text-primary-purple transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-primary-purple transition-colors">
              Terms
            </Link>
          </div>
        </div>
        
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>© {currentYear} StudyBuddy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
