// src/components/ContactFormExact.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BsTelephoneFill,
  BsInstagram,
  BsTwitter,
  BsFacebook,
  BsLinkedin,
} from 'react-icons/bs';
import { MdEmail, MdLocationOn } from 'react-icons/md';

const ContactFormExact = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mail: '',
    phone: '',
    serviceType: 'fogger',
    message: '',
  });

  const [focusedField, setFocusedField] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    alert('Message Sent (check console for data)');
  };

  // Helper to determine if a field should show accent colors
  const isFieldActive = (fieldName) => focusedField === fieldName || !!formData[fieldName];

  const inputWrapperClasses = "relative"; // For positioning label

  const labelClasses = (fieldName) =>
    `absolute left-1 -top-2.5 text-xs px-1 transition-all duration-200 ease-out pointer-events-none ${
      isFieldActive(fieldName)
        ? 'text-brand-accent-purple' // -translate-y-2.5 text-xs bg-white (if label needs to "float" from inside)
        : 'text-form-label-idle' // top-2.5 text-sm (if label starts inside and floats up)
    } group-focus-within:text-brand-accent-purple group-focus-within:-top-2.5 group-focus-within:text-xs group-focus-within:bg-white`; // This is for floating label effect, image has label always on top

  // Simpler label, always on top as per image
  const staticLabelClasses = (fieldName) =>
    `block text-xs font-medium mb-1 transition-colors duration-200 ${
      isFieldActive(fieldName) ? 'text-brand-accent-purple' : 'text-form-label-idle'
    }`;

  const inputBaseClasses = "w-full pt-2 pb-1 px-1 bg-transparent focus:outline-none transition-colors duration-200 border-b-2";
  const inputStateClasses = (fieldName) =>
    isFieldActive(fieldName)
      ? 'border-brand-accent-purple'
      : 'border-form-input-border-idle hover:border-gray-400';


  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white shadow-form-card rounded-xl overflow-hidden w-full max-w-4xl lg:flex" // max-w-4xl, rounded-xl
      >
        {/* Left Panel */}
        <div className="lg:w-[38%] bg-brand-deep-purple text-white p-8 md:p-10 relative overflow-hidden"> {/* Adjusted width & padding */}
          <div className="relative z-10 flex flex-col h-full">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Contact Information</h2> {/* text-2xl, font-semibold */}
              <p className="text-xs text-brand-light-purple-text mb-10"> {/* text-xs */}
                Fill up the form and our Team will get back to
                <br />
                you within 24 hours.
              </p>

              <div className="space-y-5 mb-12"> {/* space-y-5 */}
                {[
                  { icon: <BsTelephoneFill size={16} className="text-brand-light-purple-text" />, text: '+0123 4567 8910' },
                  { icon: <MdEmail size={18} className="text-brand-light-purple-text" />, text: 'hello@flowbase.com' },
                  { icon: <MdLocationOn size={18} className="text-brand-light-purple-text" />, text: '102 Street 2714 Don' },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ x: 3 }}
                    className="flex items-center space-x-3 text-sm text-brand-light-purple-text" // text-sm
                  >
                    {item.icon}
                    <span>{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="mt-auto"> {/* Pushes social icons to bottom */}
              <div className="flex space-x-3"> {/* space-x-3 */}
                {[
                  { icon: <BsFacebook size={16} />, label: 'Facebook', href: '#' },
                  { icon: <BsTwitter size={16} />, label: 'Twitter', href: '#' },
                  { icon: <BsInstagram size={16} />, label: 'Instagram', href: '#' },
                  { icon: <BsLinkedin size={16} />, label: 'LinkedIn', href: '#' },
                ].map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    whileHover={{ y: -2, backgroundColor: 'rgba(255, 255, 255, 0.15)' }} // Subtle hover
                    whileTap={{ scale: 0.9 }}
                    className="p-2.5 rounded-full text-brand-light-purple-text transition-colors duration-200" // p-2.5
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </div>
          </div>

          {/* Decorative Circles - Adjusted sizes and positions */}
          <div className="absolute w-52 h-52 bg-brand-circle-pink rounded-full -bottom-16 -right-16 opacity-50"></div>
          <div className="absolute w-36 h-36 bg-brand-circle-lavender rounded-full -bottom-8 right-0 opacity-60"></div>
        </div>

        {/* Right Panel (Form) */}
        <div className="lg:w-[62%] p-8 md:p-10 bg-white"> {/* Adjusted width & padding */}
          <form onSubmit={handleSubmit} className="space-y-5"> {/* space-y-5 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
              <div>
                <label htmlFor="firstName" className={staticLabelClasses('firstName')}>
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('firstName')}
                  onBlur={() => setFocusedField('')}
                  className={`${inputBaseClasses} ${inputStateClasses('firstName')}`}
                />
              </div>
              <div>
                <label htmlFor="lastName" className={staticLabelClasses('lastName')}>
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('lastName')}
                  onBlur={() => setFocusedField('')}
                  className={`${inputBaseClasses} ${inputStateClasses('lastName')}`}
                />
              </div>
            </div>

            <div>
              <label htmlFor="mail" className={staticLabelClasses('mail')}>
                Mail
              </label>
              <input
                type="email"
                name="mail"
                id="mail"
                value={formData.mail}
                onChange={handleChange}
                onFocus={() => setFocusedField('mail')}
                onBlur={() => setFocusedField('')}
                className={`${inputBaseClasses} ${inputStateClasses('mail')}`}
              />
            </div>

            <div>
              <label htmlFor="phone" className={staticLabelClasses('phone')}>
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                id="phone"
                value={formData.phone}
                onChange={handleChange}
                onFocus={() => setFocusedField('phone')}
                onBlur={() => setFocusedField('')}
                className={`${inputBaseClasses} ${inputStateClasses('phone')}`}
              />
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-800 mb-2.5"> {/* Adjusted margin */}
                What type of website do you need?
              </h3>
              <div className="flex flex-wrap gap-x-6 gap-y-2"> {/* Adjusted gap */}
                {[
                  { id: 'web-design', label: 'Sprinkler' },
                  { id: 'fogger', label: 'Fogger' },
                  { id: 'logo-design', label: 'Interior Design' },
                  { id: 'other', label: 'Other' },
                ].map((service) => (
                  <label key={service.id} className="flex items-center space-x-2 cursor-pointer group">
                    <input
                      type="radio"
                      name="serviceType"
                      value={service.id}
                      checked={formData.serviceType === service.id}
                      onChange={handleChange}
                      className="form-radio h-3.5 w-3.5 text-brand-accent-purple border-gray-400 focus:ring-brand-accent-purple focus:ring-1 focus:ring-offset-1" // h-3.5 w-3.5
                    />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">{service.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="message" className={staticLabelClasses('message')}>
                Message
              </label>
              <textarea
                name="message"
                id="message"
                rows="3" // Adjusted rows
                placeholder="Write your message.."
                value={formData.message}
                onChange={handleChange}
                onFocus={() => setFocusedField('message')}
                onBlur={() => setFocusedField('')}
                className={`${inputBaseClasses} ${inputStateClasses('message')} resize-none placeholder-gray-400 text-sm`}
              ></textarea>
            </div>

            <div className="pt-2 text-right"> {/* Added pt-2 */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.03, backgroundColor: '#312E54' /* brand-button-hover */}}
                whileTap={{ scale: 0.98 }}
                className="bg-brand-deep-purple text-white font-medium py-2.5 px-7 rounded-md shadow-md hover:bg-brand-button-hover focus:outline-none focus:ring-2 focus:ring-brand-accent-purple focus:ring-opacity-50 transition-all duration-200 text-sm" // Adjusted padding, rounding, font-size
              >
                Send Message
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ContactFormExact;