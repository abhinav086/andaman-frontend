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
import { useNavigate } from 'react-router-dom'; // Added for navigation
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
  const navigate = useNavigate(); // Added navigation hook

  // Navigation function
  const handleNavigate = (path) => {
    navigate(path);
    window.scrollTo(0, 0); // Scroll to top when navigating
  };

  return (
    <footer style={customFontStyle} className="relative bg-white pt-12 pb-32 px-4 md:px-8 lg:px-16">
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none mt-5">
        <div className="text-[8rem] font-bold leading-none text-center opacity-8 translate-y-0
                    bg-gradient-to-b from-gray-200 via-gray-100 to-transparent text-transparent bg-clip-text">
          Make Andaman Trip
        </div>
      </div>

      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-8 md:p-10 border border-gray-100 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img 
                src={logo} 
                alt="Andaman Trip Logo" 
                className="h-8 w-8 object-contain" 
              />
              <h2 style={customFontStyle2} className="text-3xl font-semibold text-gray-900">Make Andaman Trip</h2>
            </div>
            <p className="text-gray-600 mb-4 text-sm leading-relaxed">
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

          {/* Column 2: Quick Links - Updated with proper navigation */}
          <div>
            <h3 className="text-sm font-medium mb-4 text-gray-900">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => handleNavigate('/')} 
                  className="hover:text-blue-600 transition-colors text-sm text-gray-600 hover:underline cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigate('/about')} 
                  className="hover:text-blue-600 transition-colors text-sm text-gray-600 hover:underline cursor-pointer"
                >
                  About Us
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigate('/services')} 
                  className="hover:text-blue-600 transition-colors text-sm text-gray-600 hover:underline cursor-pointer"
                >
                  Services
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigate('/blog')} 
                  className="hover:text-blue-600 transition-colors text-sm text-gray-600 hover:underline cursor-pointer"
                >
                  Blog Books
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigate('/contact')} 
                  className="hover:text-blue-600 transition-colors text-sm text-gray-600 hover:underline cursor-pointer"
                >
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Resources / Contact */}
          <div>
            <h3 className="text-sm font-medium mb-4 text-gray-900">Resources</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-800 text-sm">24/7 Support</p>
                  <p className="text-gray-600 text-sm">+91 98765 43210</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-800 text-sm">Email Us</p>
                  <p className="text-gray-600 text-sm">support@andamantrip.com</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-800 text-sm">Visit Us</p>
                  <p className="text-gray-600 text-sm">Main Road, Port Blair<br />Andaman & Nicobar Islands</p>
                </div>
              </div>
            </div>
          </div>

          {/* Column 4: Company - Updated with proper navigation */}
          <div>
            <h3 className="text-sm font-medium mb-4 text-gray-900">Company</h3>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => handleNavigate('/about')} 
                  className="hover:text-blue-600 transition-colors text-sm text-gray-600 hover:underline cursor-pointer"
                >
                  About
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigate('/')} 
                  className="hover:text-blue-600 transition-colors text-sm text-gray-600 hover:underline cursor-pointer"
                >
                  Careers
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigate('/contact')} 
                  className="hover:text-blue-600 transition-colors text-sm text-gray-600 hover:underline cursor-pointer"
                >
                  Contact
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigate('/')} 
                  className="hover:text-blue-600 transition-colors text-sm text-gray-600 hover:underline cursor-pointer"
                >
                  Partners
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6 mt-8">
          <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4">
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} Andaman Trip. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-4">
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