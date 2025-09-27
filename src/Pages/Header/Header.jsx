import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logomain.png'; // Import the logo image

// Hamburger Icon Component
const HamburgerIcon = ({ isOpen, onClick }) => (
  <button
    className="md:hidden p-2 text-white focus:outline-none z-50 relative"
    onClick={onClick}
    aria-label={isOpen ? "Close menu" : "Open menu"}
  >
    {isOpen ? (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M6 18L18 6M6 6l12 12"
        ></path>
      </svg>
    ) : (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M4 6h16M4 12h16M4 18h16"
        ></path>
      </svg>
    )}
  </button>
);

const HalvoraLogo = () => (
  <div className="flex items-center gap-2">
    {/* Replaced SVG with image */}
    <img 
      src={logo} 
      alt="Make Andaman Trip Logo" 
      className="w-8 h-8 sm:w-10 sm:h-10" 
    />
    <span className="text-xl font-bold text-white text-base sm:text-xl whitespace-nowrap">
      Make Andaman Trip
    </span>
  </div>
);

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "About Us", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Pricing", path: "/pricing" },
    { name: "Contact Us", path: "/contact" }
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const handleNavLinkClick = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const isAdmin = user?.role === 'admin';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4">
      <nav className="container mx-auto px-4 py-3 mt-4 bg-black/20 backdrop-blur-sm rounded-full flex justify-between items-center relative">
        <HalvoraLogo />

        {/* Mobile menu controls and user greeting */}
        <div className="flex items-center gap-2 md:hidden">
          {user && (
            <span className="text-white text-sm whitespace-nowrap overflow-hidden text-ellipsis max-w-[100px]">
              Hello, {user.full_name || user.email}
            </span>
          )}
          <HamburgerIcon isOpen={isMobileMenuOpen} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-1 text-white">
          <Button
            variant="ghost"
            className="text-white hover:bg-white/10 hover:text-white rounded-full"
            onClick={() => handleNavLinkClick('/')}
          >
            Home
          </Button>
          {navLinks.map((link) => (
            <Button
              key={link.name}
              variant="ghost"
              className="text-white hover:bg-white/10 hover:text-white rounded-full"
              onClick={() => handleNavLinkClick(link.path)}
            >
              {link.name}
            </Button>
          ))}
          {isAdmin && (
            <Button
              variant="ghost"
              className="text-white hover:bg-white/10 hover:text-white rounded-full"
              onClick={() => handleNavLinkClick('/admin')}
            >
              Admin Panel
            </Button>
          )}
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-white whitespace-nowrap">Hello, {user.full_name || user.email}</span>
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
                onClick={() => handleNavLinkClick('/login')}
              >
                Log In
              </Button>
              <Button
                className="bg-lime-400 text-black font-bold rounded-full hover:bg-lime-500"
                onClick={() => handleNavLinkClick('/signup')}
              >
                Sign Up
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu - shown when isMobileMenuOpen is true */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 mt-2 bg-black/90 backdrop-blur-md rounded-b-lg shadow-lg py-2 flex flex-col items-center gap-2 z-40">
            <Button
              variant="ghost"
              className="text-white hover:bg-white/10 hover:text-white w-full rounded-none"
              onClick={() => handleNavLinkClick('/')}
            >
              Home
            </Button>
            {navLinks.map((link) => (
              <Button
                key={link.name}
                variant="ghost"
                className="text-white hover:bg-white/10 hover:text-white w-full rounded-none"
                onClick={() => handleNavLinkClick(link.path)}
              >
                {link.name}
              </Button>
            ))}
            {isAdmin && (
              <Button
                variant="ghost"
                className="text-white hover:bg-white/10 hover:text-white w-full rounded-none"
                onClick={() => handleNavLinkClick('/admin')}
              >
                Admin Panel
              </Button>
            )}
            {!user ? (
              <>
                <Button
                  variant="ghost"
                  className="text-white hover:bg-white/10 hover:text-white w-full rounded-none"
                  onClick={() => handleNavLinkClick('/login')}
                >
                  Log In
                </Button>
                <Button
                  className="bg-lime-400 text-black font-bold w-full rounded-none hover:bg-lime-500"
                  onClick={() => handleNavLinkClick('/signup')}
                >
                  Sign Up
                </Button>
              </>
            ) : (
              <Button
                variant="ghost"
                className="text-white hover:bg-white/10 hover:text-white w-full rounded-none"
                onClick={handleLogout}
              >
                Logout
              </Button>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;