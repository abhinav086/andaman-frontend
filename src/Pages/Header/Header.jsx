import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Plane, Menu, X, Home, Users, Briefcase, Rss, Mail, Shield, LogIn, UserPlus, LogOut,
} from 'lucide-react'; // Import all necessary icons
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../../assets/logomain.png'; // Ensure you have a logo image in the specified path

// --- Custom Font Style ---
const customFontStyle = {
  fontFamily: "'Neue Montreal Regular', sans-serif",
  fontWeight: 600,
  fontStyle: "normal",
};

// --- Hamburger Icon Component ---
const HamburgerIcon = ({ isOpen, onClick }) => (
  <button
    className="md:hidden p-2 text-white focus:outline-none z-50 relative"
    onClick={onClick}
    aria-label={isOpen ? "Close menu" : "Open menu"}
  >
    {isOpen ? (
      <X className="w-6 h-6 text-white" />
    ) : (
      <Menu className="w-6 h-6 text-white" />
    )}
  </button>
);

// --- Colored Logo Component ---
const ColoredLogo = () => (
  <div className="flex items-center gap-2">
    <div className="">
     <img className='h-12' src={logo} alt="" />
    </div>
    <span 
      style={customFontStyle} 
      className="text-sm md:text-xl font-bold bg-clip-text text-transparent bg-white whitespace-nowrap"
    >
      Make Andaman Trip
    </span>
  </div>
);

// --- Navigation Link Component (Reusable for Desktop and Mobile) ---
const NavLink = ({ name, path, icon: Icon, onClick, className = '' }) => (
  <Button
    variant="ghost"
    className={`flex items-center gap-2 text-white hover:bg-white/10 hover:text-lime-400 rounded-full transition-all duration-200 ${className}`}
    onClick={() => onClick(path)}
  >
    {Icon && <Icon className="w-4 h-4" />}
    <span className="whitespace-nowrap">{name}</span>
  </Button>
);

// --- Header Component ---
const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Updated navigation links with icons
  const navLinks = [
    { name: "About Us", path: "/about", icon: Users },
    { name: "Services", path: "/services", icon: Briefcase },
    { name: "Blog", path: "/blog", icon: Rss },
    { name: "Contact Us", path: "/contact", icon: Mail }
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
    <header className={`fixed top-0 left-0 right-0 z-50 px-4 transition-all duration-300 ${scrolled ? 'py-2' : 'py-4'}`}>
      <nav className={`container mx-auto px-4 py-3 mt-4 bg-black/20 backdrop-blur-sm rounded-full flex justify-between items-center transition-all duration-300 ${
        scrolled ? 'bg-black/70 py-2' : 'bg-black/50 py-3'
      }`}>
        <ColoredLogo />

        <div className="flex items-center gap-2 md:hidden">
          <HamburgerIcon 
            isOpen={isMobileMenuOpen} 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1 text-white">
          <NavLink
            name="Home"
            path="/"
            icon={Home}
            onClick={handleNavLinkClick}
          />
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              {...link}
              onClick={handleNavLinkClick}
            />
          ))}
          {isAdmin && (
            <NavLink
              name="Admin Panel"
              path="/admin"
              icon={Shield}
              onClick={handleNavLinkClick}
            />
          )}
        </div>
        
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-white whitespace-nowrap">Hello, {user.full_name || user.email}</span>
              <Button
                variant="ghost"
                className="flex items-center gap-2 text-white hover:bg-white/10 hover:text-red-500 hover:bg-black rounded-full transition-all duration-200"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          ) : (
            <>
              <NavLink
                name="Log In"
                path="/login"
                icon={LogIn}
                onClick={handleNavLinkClick}
                className="hover:text-white"
              />
              <Button
                className="flex items-center gap-2 bg-lime-400 text-black font-bold rounded-full hover:from-lime-500 hover:to-blue-600 transition-all duration-200"
                onClick={() => handleNavLinkClick('/signup')}
              >
                <UserPlus className="w-4 h-4" />
                Sign Up
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu with Animation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ 
                opacity: 1, 
                height: 'auto',
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                backdropFilter: 'blur(10px)',
              }}
              exit={{ 
                opacity: 0, 
                height: 0,
                backgroundColor: 'transparent',
                backdropFilter: 'blur(0px)',
              }}
              transition={{ 
                duration: 0.3,
                ease: "easeInOut"
              }}
              className="md:hidden absolute top-full left-0 right-0 mt-2 rounded-b-lg shadow-lg flex flex-col items-center z-40 overflow-hidden"
            >
              <div className="w-full py-4 flex flex-col gap-2">
                {user && (
                  <span className="text-white bg-gradient-to-r from-lime-400 to-blue-500 p-2 rounded-r-full text-sm whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px] mx-auto">
                    Hello, {user.full_name || user.email}
                  </span>
                )}
                
                {/* Home Link (separate for animation delay context) */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0 * 0.05, ease: "easeOut" }}
                >
                    <NavLink
                        name="Home"
                        path="/"
                        icon={Home}
                        onClick={handleNavLinkClick}
                        className="w-full justify-center rounded-none"
                    />
                </motion.div>

                {/* Nav Links */}
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.3, 
                      delay: (index + 1) * 0.05, // Offset by 1 for 'Home' link
                      ease: "easeOut"
                    }}
                  >
                    <NavLink
                      {...link}
                      onClick={handleNavLinkClick}
                      className="w-full justify-center rounded-none"
                    />
                  </motion.div>
                ))}

                {/* Admin Link */}
                {isAdmin && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.3, 
                      delay: (navLinks.length + 1) * 0.05,
                      ease: "easeOut"
                    }}
                  >
                    <NavLink
                      name="Admin Panel"
                      path="/admin"
                      icon={Shield}
                      onClick={handleNavLinkClick}
                      className="w-full justify-center rounded-none"
                    />
                  </motion.div>
                )}
                
                {/* Auth Buttons */}
                {!user ? (
                  <>
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        duration: 0.3, 
                        delay: (navLinks.length + (isAdmin ? 1 : 0) + 1) * 0.05,
                        ease: "easeOut"
                      }}
                    >
                      <NavLink
                        name="Log In"
                        path="/login"
                        icon={LogIn}
                        onClick={handleNavLinkClick}
                        className="w-full justify-center rounded-none hover:text-white"
                      />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        duration: 0.3, 
                        delay: (navLinks.length + (isAdmin ? 1 : 0) + 2) * 0.05,
                        ease: "easeOut"
                      }}
                    >
                      <Button
                        className="flex items-center gap-2 bg-gradient-to-r from-lime-400 to-blue-500 text-black font-bold w-full rounded-none hover:from-lime-500 hover:to-blue-600 transition-all duration-200"
                        onClick={() => handleNavLinkClick('/signup')}
                      >
                        <UserPlus className="w-4 h-4" />
                        Sign Up
                      </Button>
                    </motion.div>
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.3, 
                      delay: (navLinks.length + (isAdmin ? 1 : 0) + 1) * 0.05,
                      ease: "easeOut"
                    }}
                  >
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2 text-white hover:bg-white/10 hover:text-red-500 w-full justify-center rounded-none transition-all duration-200"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </Button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default Header;