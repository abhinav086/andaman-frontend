import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logomain.png';
import { motion, AnimatePresence } from 'framer-motion';

const customFontStyle = {
  fontFamily: "'Neue Montreal Regular', sans-serif",
  fontWeight: 600,
  fontStyle: "normal",
};

// Hamburger Icon with animation
const HamburgerIcon = ({ isOpen, onClick }) => (
  <button
    className="md:hidden p-2 text-white focus:outline-none z-50 relative"
    onClick={onClick}
    aria-label={isOpen ? "Close menu" : "Open menu"}
  >
    <div className="relative w-6 h-6 flex flex-col justify-center items-center">
      <motion.span
        className={`block h-0.5 w-6 bg-white rounded-full transition-all duration-300 ${
          isOpen ? 'rotate-45 translate-y-0' : '-translate-y-1.5'
        }`}
        animate={{
          rotate: isOpen ? 45 : 0,
          translateY: isOpen ? 0 : -1.5,
        }}
        transition={{ duration: 0.3 }}
      />
      <motion.span
        className={`block h-0.5 w-6 bg-white rounded-full my-0.5 transition-all duration-300 ${
          isOpen ? 'opacity-0' : 'opacity-100'
        }`}
        animate={{
          opacity: isOpen ? 0 : 1,
        }}
        transition={{ duration: 0.3 }}
      />
      <motion.span
        className={`block h-0.5 w-6 bg-white rounded-full transition-all duration-300 ${
          isOpen ? '-rotate-45 translate-y-0' : 'translate-y-1.5'
        }`}
        animate={{
          rotate: isOpen ? -45 : 0,
          translateY: isOpen ? 0 : 1.5,
        }}
        transition={{ duration: 0.3 }}
      />
    </div>
  </button>
);

const HalvoraLogo = () => (
  <div className="flex items-center gap-2">
    <img 
      src={logo} 
      alt="Make Andaman Trip Logo" 
      className="w-8 h-8 sm:w-10 sm:h-10" 
    />
    <span style={customFontStyle} className=" text-sm md:text-xl font-bold text-white text-base sm:text-xl whitespace-nowrap">
      Make Andaman Trip
    </span>
  </div>
);

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

  const navLinks = [
    { name: "About Us", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Blog", path: "/blog" },
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
    <header className={`fixed top-0 left-0 right-0 z-50 px-4 transition-all duration-300 ${scrolled ? 'py-2' : 'py-4'}`}>
      <nav className={`container mx-auto px-4 py-3 mt-4 bg-black/20 backdrop-blur-sm rounded-full flex justify-between items-center transition-all duration-300 ${
        scrolled ? 'bg-black/70 py-2' : 'bg-black/20 py-3'
      }`}>
        <HalvoraLogo />

        <div className="flex items-center gap-2 md:hidden">
        
          <HamburgerIcon isOpen={isMobileMenuOpen} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1 text-white">
          <Button
            variant="ghost"
            className="text-white hover:bg-white/10 hover:text-white   hover:text-blue-700 rounded-full transition-all duration-200"
            onClick={() => handleNavLinkClick('/')}
          >
            Home
          </Button>
          {navLinks.map((link) => (
            <Button
              key={link.name}
              variant="ghost"
              className="text-white hover:bg-white/10 hover:text-blue-700  rounded-full transition-all duration-200"
              onClick={() => handleNavLinkClick(link.path)}
            >
              {link.name}
            </Button>
          ))}
          {isAdmin && (
            <Button
              variant="ghost"
              className="text-white hover:bg-white/10 hover:text-white  hover:text-blue-700 rounded-full transition-all duration-200"
              onClick={() => handleNavLinkClick('/admin')}
            >
              Admin Panel
            </Button>
          )}
        </div>
        
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-white whitespace-nowrap">Hello, {user.full_name || user.email}</span>
              <Button
                variant="ghost"
                className="text-white hover:bg-white/10 hover:text-red-500 hover:bg-black rounded-full transition-all duration-200"
                onClick={handleLogout}
              >
                Logout
              </Button>
              
            </div>
          ) : (
            <>
              <Button
                variant="ghost"
                className="text-white hover:bg-white/10 hover:text-white rounded-full transition-all duration-200"
                onClick={() => handleNavLinkClick('/login')}
              >
                Log In
              </Button>
              <Button
                className="bg-lime-400 text-black font-bold rounded-full hover:bg-lime-500 transition-all duration-200"
                onClick={() => handleNavLinkClick('/signup')}
              >
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
                backgroundColor: '#000000',
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
            <span className="text-white bg-orange-600  p-2 rounded-r-full text-sm whitespace-nowrap overflow-hidden text-ellipsis max-w-[100px]">
              Hello, {user.full_name || user.email}
            </span>
          )}
                <Button
                  variant="ghost"
                  className="text-white hover:bg-white/10 hover:text-white w-full rounded-none transition-all duration-200"
                  onClick={() => handleNavLinkClick('/')}
                >
                  Home
                </Button>
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.3, 
                      delay: index * 0.05,
                      ease: "easeOut"
                    }}
                  >
                    <Button
                      variant="ghost"
                      className="text-white hover:bg-white/10 hover:text-white w-full rounded-none transition-all duration-200"
                      onClick={() => handleNavLinkClick(link.path)}
                    >
                      {link.name}
                    </Button>
                  </motion.div>
                ))}
                {isAdmin && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.3, 
                      delay: navLinks.length * 0.05,
                      ease: "easeOut"
                    }}
                  >
                    <Button
                      variant="ghost"
                      className="text-white hover:bg-white/10 hover:text-white w-full rounded-none transition-all duration-200"
                      onClick={() => handleNavLinkClick('/admin')}
                    >
                      Admin Panel
                    </Button>
                  </motion.div>
                )}
                {!user ? (
                  <>
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        duration: 0.3, 
                        delay: (navLinks.length + (isAdmin ? 1 : 0)) * 0.05,
                        ease: "easeOut"
                      }}
                    >
                      <Button
                        variant="ghost"
                        className="text-white hover:bg-white/10 hover:text-white w-full rounded-none transition-all duration-200"
                        onClick={() => handleNavLinkClick('/login')}
                      >
                        Log In
                      </Button>
                    </motion.div>
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
                        className="bg-lime-400 text-black font-bold w-full rounded-none hover:bg-lime-500 transition-all duration-200"
                        onClick={() => handleNavLinkClick('/signup')}
                      >
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
                      delay: (navLinks.length + (isAdmin ? 1 : 0)) * 0.05,
                      ease: "easeOut"
                    }}
                  >
                    <Button
                      variant="ghost"
                      className="text-white hover:bg-white/10 hover:text-white w-full rounded-none transition-all duration-200"
                      onClick={handleLogout}
                    >
                        
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