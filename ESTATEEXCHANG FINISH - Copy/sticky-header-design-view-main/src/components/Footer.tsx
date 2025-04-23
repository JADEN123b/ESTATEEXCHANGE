
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[hsl(0,0%,20%)] text-white">
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="text-xl font-bold mb-4 md:mb-0">
            Estate Exchange
          </div>
          <div className="flex space-x-6">
            <Link to="/properties" className="hover:text-[hsl(142,64%,38%)]">Properties</Link>
            <Link to="/about" className="hover:text-[hsl(142,64%,38%)]">About Us</Link>
            <Link to="/contact" className="hover:text-[hsl(142,64%,38%)]">Contact Us</Link>
            <Link to="/login" className="hover:text-[hsl(142,64%,38%)]">Login</Link>
            <Link to="/signup" className="btn-green text-sm">Sign Up</Link>
          </div>
        </div>
        <div className="text-center text-sm text-gray-400 border-t border-gray-800 pt-6">
          © {new Date().getFullYear()} Estate Exchange. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
