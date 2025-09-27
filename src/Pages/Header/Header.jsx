import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const HalvoraLogo = () => (
  <div className="flex items-center gap-2">
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 0L32 16L16 32L0 16L16 0Z" fill="#A8FF35"/>
      <path d="M16 4L28 16L16 28L4 16L16 4Z" fill="#1A1A1A"/>
      <path d="M16 8L24 16L16 24L8 16L16 8Z" fill="#A8FF35"/>
    </svg>
    <span className="text-xl font-bold text-white">Make Andaman Trip</span>
  </div>
);

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navLinks = [
    { name: "About Us", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Pricing", path: "/pricing" },
    { name: "Contact Us", path: "/contact" }
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Check if user is admin
  const isAdmin = user?.role === 'admin';

  return (
    <header className="fixed top-0 left-4 right-4 z-50">
      <nav className="container mx-auto px-10 py-4 mt-4 bg-black/20 backdrop-blur-sm rounded-full flex justify-between items-center">
        <HalvoraLogo />

        <div className="hidden md:flex items-center gap-1 text-white">
          <Button
            variant="ghost"
            className="text-white hover:bg-white/10 hover:text-white rounded-full"
            onClick={() => navigate('/')}
          >
            Home
          </Button>
          {navLinks.map((link) => (
            <Button
              key={link.name}
              variant="ghost"
              className="text-white hover:bg-white/10 hover:text-white rounded-full"
              onClick={() => navigate(link.path)}
            >
              {link.name}
            </Button>
          ))}
          {/* Show Admin Panel only for admin users */}
          {isAdmin && (
            <Button
              variant="ghost"
              className="text-white hover:bg-white/10 hover:text-white rounded-full"
              onClick={() => navigate('/admin')}
            >
              Admin Panel
            </Button>
          )}
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-white">Hello, {user.full_name || user.email}</span>
              <Button
                variant="ghost"
                className="text-white hover:bg-white/10 hover:text-white rounded-full"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          ) : (
            <>
              <Button
                variant="ghost"
                className="text-white hover:bg-white/10 hover:text-white rounded-full"
                onClick={() => navigate('/login')}
              >
                Log In
              </Button>
              <Button
                className="bg-lime-400 text-black font-bold rounded-full hover:bg-lime-500"
                onClick={() => navigate('/signup')}
              >
                Sign Up
              </Button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;