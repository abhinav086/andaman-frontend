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
  Send,
  Shield,
  FileText,
  Users,
  CreditCard,
  Calendar
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

const TermsOfService = () => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  return (
    <div className="pt-[90px] bg-gray-50">
     

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100">
          {/* Title Section */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Shield className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Terms of Service
              </h1>
            </div>
            <p className="text-gray-600 text-sm sm:text-base">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Content Sections */}
          <div className="prose prose-gray max-w-none">
            {/* Introduction */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                1. Introduction
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Welcome to Make Andaman Trip. These terms and conditions outline the rules and regulations 
                for the use of our services. By accessing this website and booking our travel services, 
                you accept these terms and conditions in full.
              </p>
            </section>

            {/* Service Description */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                2. Services Provided
              </h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  Make Andaman Trip provides comprehensive travel and tourism services including:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Package tours and itineraries for the Andaman Islands</li>
                  <li>Accommodation bookings at partner hotels and resorts</li>
                  <li>Transportation services (flights, ferries, local transport)</li>
                  <li>Guided tours and activities</li>
                  <li>Travel insurance arrangements</li>
                  <li>Customer support throughout your journey</li>
                </ul>
              </div>
            </section>

            {/* Booking and Payment */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-blue-600" />
                3. Booking and Payment Terms
              </h2>
              <div className="space-y-3 text-gray-700">
                <p>All bookings are subject to the following conditions:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Full payment is required at the time of booking unless otherwise specified</li>
                  <li>Cancellation policies vary by service provider and package type</li>
                  <li>Changes to bookings may incur additional fees</li>
                  <li>All prices are in Indian Rupees (INR) and inclusive of applicable taxes</li>
                  <li>We reserve the right to modify prices with prior notice</li>
                </ul>
              </div>
            </section>

            {/* Cancellation Policy */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                4. Cancellation and Refund Policy
              </h2>
              <div className="space-y-3 text-gray-700">
                <p>Cancellations are subject to the following schedule:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>More than 30 days before travel: 90% refund</li>
                  <li>15-30 days before travel: 50% refund</li>
                  <li>7-14 days before travel: 25% refund</li>
                  <li>Less than 7 days before travel: No refund</li>
                  <li>No-shows: No refund</li>
                </ul>
                <p className="text-sm text-gray-600 mt-2">
                  * Special packages and peak season bookings may have different cancellation terms.
                </p>
              </div>
            </section>

            {/* User Responsibilities */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Heart className="h-5 w-5 text-blue-600" />
                5. User Responsibilities
              </h2>
              <div className="space-y-3 text-gray-700">
                <p>By using our services, you agree to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Provide accurate and complete information during booking</li>
                  <li>Comply with all local laws and regulations during your stay</li>
                  <li>Respect the environment and local communities</li>
                  <li>Follow safety guidelines provided by our staff and partners</li>
                  <li>Be responsible for your personal belongings</li>
                  <li>Not engage in any illegal activities</li>
                </ul>
              </div>
            </section>

            {/* Limitation of Liability */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                6. Limitation of Liability
              </h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  Make Andaman Trip shall not be liable for any indirect, incidental, special, or 
                  consequential damages arising from your use of our services. Our liability is 
                  limited to the amount paid for the specific service in question.
                </p>
                <p className="mt-2">
                  We are not responsible for delays or cancellations caused by natural disasters, 
                  government actions, or other events beyond our control.
                </p>
              </div>
            </section>

            {/* Contact Information */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Mail className="h-5 w-5 text-blue-600" />
                7. Contact Us
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">Customer Support</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Phone:</span> +91 98765 43210</p>
                    <p><span className="font-medium">Email:</span> support@andamantrip.com</p>
                    <p><span className="font-medium">Address:</span> Main Road, Port Blair, Andaman & Nicobar Islands</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">Business Hours</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Monday - Sunday:</span> 24/7 Support</p>
                    <p><span className="font-medium">Office Hours:</span> 9:00 AM - 6:00 PM IST</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Acceptance */}
            <section className="bg-blue-50 p-6 rounded-lg border border-blue-100">
              <h2 className="text-xl font-semibold text-blue-900 mb-3">Acceptance of Terms</h2>
              <p className="text-blue-800">
                By booking any service with Make Andaman Trip, you acknowledge that you have read, 
                understood, and agree to be bound by these Terms of Service. If you do not agree 
                with these terms, please do not use our services.
              </p>
            </section>
          </div>
        </div>
      </main>

      
    </div>
  );
};

export default TermsOfService;