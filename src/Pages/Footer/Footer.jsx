import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Mail, 
  ArrowRight, 
  MapPin, 
  Phone, 
  Clock, 
  Globe, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  Heart,
  Coffee,
  Waves,
  MessageCircle,
  Send
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-blue-50 via-teal-50 to-cyan-50 text-gray-800 pt-12 pb-8 px-4 md:px-8 lg:px-16 border-t border-blue-200">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        
        {/* Company Info */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Waves className="h-8 w-8 text-blue-600" />
            <h2 className="text-2xl font-bold text-blue-800">Andaman Travel</h2>
          </div>
          <p className="text-gray-600 mb-4 leading-relaxed">
            Your trusted partner for exploring the pristine beauty of the Andaman Islands. 
            We've been crafting unforgettable travel experiences for over a decade.
          </p>
          <div className="flex gap-3">
            <Button variant="outline" size="icon" className="border-blue-300 text-blue-600 hover:bg-blue-100 hover:text-blue-700">
              <Facebook size={18} />
            </Button>
            <Button variant="outline" size="icon" className="border-blue-300 text-blue-600 hover:bg-blue-100 hover:text-blue-700">
              <Instagram size={18} />
            </Button>
            <Button variant="outline" size="icon" className="border-blue-300 text-blue-600 hover:bg-blue-100 hover:text-blue-700">
              <Twitter size={18} />
            </Button>
            <Button variant="outline" size="icon" className="border-blue-300 text-blue-600 hover:bg-blue-100 hover:text-blue-700">
              <Linkedin size={18} />
            </Button>
          </div>
        </div>

        {/* Contact Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-800">
            <Phone className="h-5 w-5 text-blue-600" />
            Contact Info
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Phone className="h-4 w-4 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-800">24/7 Support</p>
                <p className="text-gray-600">+91 98765 43210</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="h-4 w-4 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-800">Email Us</p>
                <p className="text-gray-600">support@andamantravel.com</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-800">Visit Us</p>
                <p className="text-gray-600">Main Road, Port Blair<br />Andaman & Nicobar Islands</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-800">
            <Globe className="h-5 w-5 text-blue-600" />
            Quick Links
          </h3>
          <ul className="space-y-2">
            <li><a href="/" className="hover:text-blue-600 transition-colors flex items-center gap-2 text-gray-600 hover:text-blue-700"><ArrowRight size={14} /> Home</a></li>
            <li><a href="/about" className="hover:text-blue-600 transition-colors flex items-center gap-2 text-gray-600 hover:text-blue-700"><ArrowRight size={14} /> About Us</a></li>
            <li><a href="/services" className="hover:text-blue-600 transition-colors flex items-center gap-2 text-gray-600 hover:text-blue-700"><ArrowRight size={14} /> Services</a></li>
            <li><a href="/blog" className="hover:text-blue-600 transition-colors flex items-center gap-2 text-gray-600 hover:text-blue-700"><ArrowRight size={14} /> Blog Books</a></li>
            <li><a href="/contact" className="hover:text-blue-600 transition-colors flex items-center gap-2 text-gray-600 hover:text-blue-700"><ArrowRight size={14} /> Contact Us</a></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-800">
            <Send className="h-5 w-5 text-blue-600" />
            Stay Updated
          </h3>
          <p className="text-gray-600 mb-3">
            Subscribe to receive travel tips, special offers, and destination updates.
          </p>
          <div className="space-y-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 rounded-lg bg-white border border-blue-200 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-300 focus:border-blue-400"
            />
            <Button className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white">
              Subscribe <Send className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

      </div>

      {/* Bottom Line */}
      <div className="border-t border-blue-200 pt-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2 text-blue-800">
              <Clock className="h-4 w-4 text-blue-600" />
              Office Hours
            </h4>
            <p className="text-gray-600 text-sm">
              Mon-Sat: 9AM - 6PM<br />
              Emergency Support: 24/7
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2 text-blue-800">
              <Heart className="h-4 w-4 text-blue-600" />
              Our Promise
            </h4>
            <p className="text-gray-600 text-sm">
              Safe, sustainable, and memorable travel experiences
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2 text-blue-800">
              <MessageCircle className="h-4 w-4 text-blue-600" />
              Need Help?
            </h4>
            <p className="text-gray-600 text-sm">
              Contact our support team anytime
            </p>
          </div>
        </div>
        
        <div className="border-t border-blue-200 pt-4 text-center text-sm text-gray-600">
          <p>© {new Date().getFullYear()} Andaman Travel. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-4 mt-2">
            <a href="#" className="hover:text-blue-600 transition-colors text-gray-600 hover:text-blue-700">Terms of Service</a>
            <a href="#" className="hover:text-blue-600 transition-colors text-gray-600 hover:text-blue-700">Privacy Policy</a>
            <a href="#" className="hover:text-blue-600 transition-colors text-gray-600 hover:text-blue-700">Cookies Settings</a>
            <a href="#" className="hover:text-blue-600 transition-colors text-gray-600 hover:text-blue-700">Cancellation Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;