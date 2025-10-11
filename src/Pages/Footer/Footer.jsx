import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Mail, 
  ArrowRight, 
  MapPin, 
  Phone, 
  Clock, 
  Globe, 
  Heart,
  Coffee,
  MessageCircle,
  Send
} from 'lucide-react';
import { FaXTwitter, FaGithub, FaInstagram, FaLinkedin } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logomain.png';

const customFontStyle = {
  fontFamily: "'Neue Montreal Regular', sans-serif",
  fontWeight: 600,
  fontStyle: "normal",
};

const customFontStyle2 = {
  fontFamily: "'Travel October', sans-serif",
  fontWeight: 600,
  fontStyle: "normal",
};

const Footer = () => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  return (
    // FIXED: Added overflow-x-hidden and overflow-hidden to prevent horizontal scroll
    <footer style={customFontStyle} className="relative bg-white pt-12 pb-32 px-4 md:px-8 lg:px-16 overflow-x-hidden overflow-hidden w-full">
      {/* FIXED: Added overflow-hidden, max-w-full, and proper centering to background text */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none mt-7 overflow-hidden max-w-full">
        <div className="text-[6rem ]  sm:text-[8rem] md:text-[10rem] font-bold leading-none text-center opacity-8 translate-y-0
                    bg-gradient-to-b from-gray-200 via-gray-100 to-transparent text-transparent bg-clip-text
                    hidden lg:block whitespace-nowrap px-4"> {/* Added whitespace-nowrap and px-4 */}
          Make Andaman Trip
        </div>
      </div>

      {/* FIXED: Added max-w-7xl and w-full to ensure content stays within bounds */}
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-10 border border-gray-100 relative z-10 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Column 1: Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img 
                src={logo} 
                alt="Andaman Trip Logo" 
                className="h-8 w-8 object-contain flex-shrink-0" 
              />
              <h2 style={customFontStyle2} className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900">
                Make Andaman Trip
              </h2>
            </div>
            <p className="text-gray-600 mb-4 text-xs sm:text-sm leading-relaxed">
              Your trusted partner for exploring the pristine beauty of the Andaman Islands. 
              We've been crafting unforgettable travel experiences for over a decade.
            </p>
            <div className="flex gap-3">
              <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">
                <FaXTwitter className="h-4 w-4" />
              </a>
              <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">
                <FaInstagram className="h-4 w-4" />
              </a>
              <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">
                <FaLinkedin className="h-4 w-4" />
              </a>
              <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">
                <FaGithub className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="lg:col-span-1">
            <h3 className="text-sm font-medium mb-4 text-gray-900">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => handleNavigate('/')} 
                  className="hover:text-blue-600 transition-colors text-xs sm:text-sm text-gray-600 hover:underline cursor-pointer text-left"
                >
                  Home
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigate('/about')} 
                  className="hover:text-blue-600 transition-colors text-xs sm:text-sm text-gray-600 hover:underline cursor-pointer text-left"
                >
                  About Us
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigate('/services')} 
                  className="hover:text-blue-600 transition-colors text-xs sm:text-sm text-gray-600 hover:underline cursor-pointer text-left"
                >
                  Services
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigate('/blog')} 
                  className="hover:text-blue-600 transition-colors text-xs sm:text-sm text-gray-600 hover:underline cursor-pointer text-left"
                >
                  Blog Books
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigate('/contact')} 
                  className="hover:text-blue-600 transition-colors text-xs sm:text-sm text-gray-600 hover:underline cursor-pointer text-left"
                >
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Resources / Contact */}
          <div className="lg:col-span-1">
            <h3 className="text-sm font-medium mb-4 text-gray-900">Resources</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Phone className="h-4 w-4 text-gray-500 flex-shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="font-medium text-gray-800 text-xs sm:text-sm">24/7 Support</p>
                  <p className="text-gray-600 text-xs sm:text-sm break-words">+91 98765 43210</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="h-4 w-4 text-gray-500 flex-shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="font-medium text-gray-800 text-xs sm:text-sm">Email Us</p>
                  <p className="text-gray-600 text-xs sm:text-sm break-all">support@andamantrip.com</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="font-medium text-gray-800 text-xs sm:text-sm">Visit Us</p>
                  <p className="text-gray-600 text-xs sm:text-sm break-words">
                    Main Road, Port Blair<br className="hidden sm:block" />Andaman & Nicobar Islands
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Column 4: Company */}
          <div className="lg:col-span-1">
            <h3 className="text-sm font-medium mb-4 text-gray-900">Company</h3>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => handleNavigate('/about')} 
                  className="hover:text-blue-600 transition-colors text-xs sm:text-sm text-gray-600 hover:underline cursor-pointer text-left"
                >
                  About
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigate('/')} 
                  className="hover:text-blue-600 transition-colors text-xs sm:text-sm text-gray-600 hover:underline cursor-pointer text-left"
                >
                  Careers
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigate('/contact')} 
                  className="hover:text-blue-600 transition-colors text-xs sm:text-sm text-gray-600 hover:underline cursor-pointer text-left"
                >
                  Contact
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigate('/')} 
                  className="hover:text-blue-600 transition-colors text-xs sm:text-sm text-gray-600 hover:underline cursor-pointer text-left"
                >
                  Partners
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6 mt-6 sm:mt-8">
          <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4">
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} Andaman Trip. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              <button 
                onClick={() => handleNavigate('/')} 
                className="text-xs text-gray-500 hover:text-blue-600 hover:underline cursor-pointer"
              >
                Privacy Policy
              </button>
              <button 
                onClick={() => handleNavigate('/')} 
                className="text-xs text-gray-500 hover:text-blue-600 hover:underline cursor-pointer"
              >
                Terms of Service
              </button>
              <button 
                onClick={() => handleNavigate('/')} 
                className="text-xs text-gray-500 hover:text-blue-600 hover:underline cursor-pointer"
              >
                Cookies Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;