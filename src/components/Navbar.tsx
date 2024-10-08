import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold">Portfolio Optimizer</Link>
        <div>
          {user ? (
            <button
              onClick={handleSignOut}
              className="text-white flex items-center hover:text-red-300 transition-colors duration-300"
            >
              <LogOut className="mr-2" size={18} />
              Sign Out
            </button>
          ) : (
            <Link to="/auth" className="text-white hover:text-blue-300 transition-colors duration-300">
              Login / Sign Up
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;