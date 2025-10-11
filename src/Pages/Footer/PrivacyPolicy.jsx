import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  Eye, 
  Lock, 
  Users, 
  FileText, 
  Clock, 
  Globe, 
  Heart,
  Coffee,
  MessageCircle,
  Send,
  Mail,
  MapPin,
  Phone
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

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  const sections = [
    {
      id: 'information-we-collect',
      title: 'Information We Collect',
      icon: <FileText className="h-6 w-6" />,
      content: [
        'Personal identification information (name, email address, phone number, etc.)',
        'Travel preferences and booking details',
        'Technical data (IP address, browser type, device information)',
        'Usage data (pages visited, time spent on site, etc.)'
      ]
    },
    {
      id: 'how-we-use',
      title: 'How We Use Your Information',
      icon: <Eye className="h-6 w-6" />,
      content: [
        'To provide and operate our services',
        'To process your bookings and reservations',
        'To send you updates and promotional materials',
        'To improve our website and customer service',
        'To comply with legal obligations'
      ]
    },
    {
      id: 'data-sharing',
      title: 'Data Sharing and Disclosure',
      icon: <Users className="h-6 w-6" />,
      content: [
        'With service providers who assist in our operations',
        'With travel partners for booking fulfillment',
        'When required by law or to protect our rights',
        'With your consent or at your direction'
      ]
    },
    {
      id: 'your-rights',
      title: 'Your Privacy Rights',
      icon: <Shield className="h-6 w-6" />,
      content: [
        'Access to your personal information',
        'Correction of inaccurate data',
        'Deletion of your information',
        'Restriction of processing',
        'Data portability',
        'Withdrawal of consent'
      ]
    },
    {
      id: 'data-security',
      title: 'Data Security',
      icon: <Lock className="h-6 w-6" />,
      content: [
        'We implement appropriate security measures to protect your data',
        'All data is stored on secure servers',
        'Payment information is encrypted',
        'Regular security audits are conducted'
      ]
    },
    {
      id: 'cookies',
      title: 'Cookies Policy',
      icon: <Globe className="h-6 w-6" />,
      content: [
        'We use cookies to enhance user experience',
        'Cookies help us analyze website traffic',
        'You can control cookie settings through your browser',
        'We use both session and persistent cookies'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <header className="bg-gradient-to-br from-blue-50 to-cyan-50 py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-100 p-4 rounded-full">
              <Shield className="h-12 w-12 text-blue-600" />
            </div>
          </div>
          <h1 style={customFontStyle2} className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="sticky top-6 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">Table of Contents</h3>
                <ul className="space-y-2">
                  {sections.map((section, index) => (
                    <li key={index}>
                      <a 
                        href={`#${section.id}`}
                        className="text-sm text-gray-600 hover:text-blue-600 hover:underline block py-1 transition-colors"
                      >
                        {section.title}
                      </a>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <Button 
                    onClick={() => handleNavigate('/contact')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Contact Us
                  </Button>
                </div>
              </div>
            </div>

            {/* Policy Content */}
            <div className="lg:col-span-3 space-y-12">
              {sections.map((section, index) => (
                <section key={index} id={section.id} className="scroll-mt-20">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                      {section.icon}
                    </div>
                    <h2 style={customFontStyle} className="text-2xl font-bold text-gray-900">
                      {section.title}
                    </h2>
                  </div>
                  <ul className="space-y-3">
                    {section.content.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-gray-700">{item}</p>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}

              {/* Additional Information */}
              <section className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Heart className="h-5 w-5 text-blue-600" />
                  Your Trust Matters
                </h2>
                <p className="text-gray-700 mb-4">
                  We are committed to protecting your privacy and maintaining the security of your personal information. 
                  Our privacy practices are designed to provide you with choices and control over your personal information.
                </p>
                <p className="text-gray-700">
                  If you have any questions about this privacy policy or our practices, please contact us using the information below.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>

      {/* Contact Section */}
      <section className="bg-gray-50 py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 style={customFontStyle2} className="text-3xl font-bold text-gray-900 mb-4">
              Have Questions?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our team is here to help you understand how we protect your privacy and handle your data.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
              <Mail className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Email Us</h3>
              <p className="text-gray-600">privacy@andamantrip.com</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
              <Phone className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Call Us</h3>
              <p className="text-gray-600">+91 98765 43210</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
              <MapPin className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Visit Us</h3>
              <p className="text-gray-600 text-sm">Main Road, Port Blair<br />Andaman & Nicobar Islands</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={customFontStyle} className="bg-white pt-8 pb-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <img 
                src={logo} 
                alt="Andaman Trip Logo" 
                className="h-8 w-8 object-contain" 
              />
              <h2 style={customFontStyle2} className="text-xl sm:text-2xl font-semibold text-gray-900">
                Make Andaman Trip
              </h2>
            </div>
            <p className="text-gray-600 max-w-md mx-auto">
              Your trusted partner for exploring the pristine beauty of the Andaman Islands.
            </p>
          </div>
          
          <div className="border-t border-gray-100 pt-6">
            <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-4">
              <p className="text-sm text-gray-500">
                © {new Date().getFullYear()} Andaman Trip. All rights reserved.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">
                  <FaXTwitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">
                  <FaInstagram className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">
                  <FaLinkedin className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">
                  <FaGithub className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;