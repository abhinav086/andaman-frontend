
// src/Pages/Header/Header.jsx
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Plane, Menu, X, Home, Users, Briefcase, Rss, Mail, Shield, LogIn, UserPlus, LogOut,
  Ticket,
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
    className="md:hidden p-2 text-black focus:outline-none z-50 relative"
    onClick={onClick}
    aria-label={isOpen ? "Close menu" : "Open menu"}
  >
    {isOpen ? (
      <X className="w-6 h-6 text-black" />
    ) : (
      <Menu className="w-6 h-6 text-black" />
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
      className="text-sm md:text-xl font-bold text-black whitespace-nowrap"
    >
      Make Andaman Trip
    </span>
  </div>
);

// --- Navigation Link Component (Reusable for Desktop and Mobile) ---
const NavLink = ({ name, path, icon: Icon, onClick, className = '', isMobile = false, color = 'text-lime-400' }) => {
  const baseClasses = "flex items-center gap-2 rounded-full transition-all duration-200";
  const textClasses = isMobile 
    ? "text-black hover:text-black" // Changed for mobile - same color on hover
    : "text-black hover:text-black hover:bg-green-100"; // Same color on hover for desktop
  
  return (
    <Button
      variant="ghost"
      className={`${baseClasses} ${textClasses} ${className}`}
      onClick={() => onClick(path)}
    >
      {Icon && <Icon className={`w-4 h-4 ${color}`} />}
      <span className="whitespace-nowrap">{name}</span>
    </Button>
  );
};

// --- Header Component ---
const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
 
  // user will be null/undefined if not logged in
  const isLogin = !!user; // Convert to boolean

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Updated navigation links with icons and colors
  const navLinks = [
    { name: "About Us", path: "/about", icon: Users, color: 'text-purple-600' },
    // { name: "Services", path: "/services", icon: Briefcase, color: 'text-purple-500' },
    { name: "Blog", path: "/blog", icon: Rss, color: 'text-purple-600' },
    { name: "Contact Us", path: "/contact", icon: Mail, color: 'text-purple-600' }
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
    // REMOVED overflow-x-hidden from here to prevent clipping the mobile menu
    <header className={`fixed top-0 left-0 right-0 z-50 px-4 transition-all duration-300 ${scrolled ? 'py-2' : 'py-2'}`}>
      <nav className={`container mx-auto px-4 py-3 mt-2 bg-zinc-50 shadow-sm  border-black backdrop-blur-sm rounded-full flex justify-between items-center transition-all duration-300 ${
        scrolled ? 'bg-white border-black py-2' : 'bg-white border-black py-3'
      }`}>
        <ColoredLogo />

        <div className="flex items-center gap-2 md:hidden">
          <HamburgerIcon 
            isOpen={isMobileMenuOpen} 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1 text-black">
          <NavLink
            name="Home"
            path="/"
            icon={Home}
            onClick={handleNavLinkClick}
            color="text-purple-600"
          />
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              {...link}
              onClick={handleNavLinkClick}
            />
          ))}

          {isLogin && (
            <NavLink
              name="My Bookings"
              path="/my-bookings"
              icon={Ticket}
              onClick={handleNavLinkClick}
              color="text-purple-600"
            />
          )}
          {isAdmin && (
            <NavLink
              name="Admin Panel"
              path="/admin"
              icon={Shield}
              onClick={handleNavLinkClick}
              color="text-purple-600"
            />
          )}
        </div>
        
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-black whitespace-nowrap">Hello, {user.full_name || user.email}</span>
              <Button
                variant="ghost"
                className="flex items-center gap-2 text-black hover:bg-gray-100 hover:text-red-500 rounded-full transition-all duration-200"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 text-red-500" />
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
                className="hover:text-black"
                color="text-indigo-500"
              />
              <Button
                className="flex items-center gap-2 bg-gradient-to-r from-lime-400 to-blue-500 text-black font-bold rounded-full hover:from-lime-500 hover:to-blue-600 transition-all duration-200"
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
                backgroundColor: 'white', // Changed to white background
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
              className="md:hidden absolute top-full left-0 right-0 mt-2 rounded-b-lg shadow-lg flex flex-col items-start z-40 overflow-hidden border border-black" // Changed to items-start for left alignment
            >
              <div className="w-full py-4 flex flex-col gap-2 px-4"> {/* Added px-4 for padding */}
                {user && (
                  <span className="text-black bg-gradient-to-r from-lime-400 to-blue-500 p-2 rounded-r-full text-sm whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]">
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
                        className="w-full justify-start rounded-none" // Changed to justify-start
                        isMobile={true}
                        color="text-purple-600"
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
                      className="w-full justify-start rounded-none" // Changed to justify-start
                      isMobile={true}
                    />
                  </motion.div>
                ))}

                {/* My Bookings Link */}
                {isLogin && (
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
                      name="My Bookings"
                      path="/my-bookings"
                      icon={Ticket}
                      onClick={handleNavLinkClick}
                      className="w-full justify-start rounded-none" // Changed to justify-start
                      isMobile={true}
                      color="text-purple-600"
                    />
                  </motion.div>
                )}

                {/* Admin Link */}
                {isAdmin && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.3, 
                      delay: (navLinks.length + (isLogin ? 1 : 0) + 1) * 0.05,
                      ease: "easeOut"
                    }}
                  >
                    <NavLink
                      name="Admin Panel"
                      path="/admin"
                      icon={Shield}
                      onClick={handleNavLinkClick}
                      className="w-full justify-start rounded-none" // Changed to justify-start
                      isMobile={true}
                      color="text-purple-500"
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
                        delay: (navLinks.length + (isLogin ? 1 : 0) + (isAdmin ? 1 : 0) + 1) * 0.05,
                        ease: "easeOut"
                      }}
                    >
                      <NavLink
                        name="Log In"
                        path="/login"
                        icon={LogIn}
                        onClick={handleNavLinkClick}
                        className="w-full justify-start rounded-none hover:text-black" // Changed to justify-start
                        isMobile={true}
                        color="text-indigo-500"
                      />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        duration: 0.3, 
                        delay: (navLinks.length + (isLogin ? 1 : 0) + (isAdmin ? 1 : 0) + 2) * 0.05,
                        ease: "easeOut"
                      }}
                    >
                      <Button
                        className="flex items-center gap-2 bg-gradient-to-r from-lime-400 to-blue-500 text-black font-bold w-full rounded-none hover:from-lime-500 hover:to-blue-600 transition-all duration-200 justify-start pl-6" // Added justify-start and pl-6 for alignment
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
                      delay: (navLinks.length + (isLogin ? 1 : 0) + (isAdmin ? 1 : 0) + 1) * 0.05,
                      ease: "easeOut"
                    }}
                  >
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2 text-black hover:bg-gray-100 hover:text-red-500 w-full justify-start rounded-none transition-all duration-200 pl-6" // Changed text to black, added justify-start and pl-6
                      onClick={handleLogout}
                    >
                      <LogOut className="w-4 h-4 text-red-500" />
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
