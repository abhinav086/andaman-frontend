// src/components/Header.jsx

import React from 'react';
import { Button } from '@/components/ui/button'; // Adjust path if needed

const HalvoraLogo = () => (
  <div className="flex items-center gap-2">
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 0L32 16L16 32L0 16L16 0Z" fill="#A8FF35"/>
      <path d="M16 4L28 16L16 28L4 16L16 4Z" fill="#1A1A1A"/>
      <path d="M16 8L24 16L16 24L8 16L16 8Z" fill="#A8FF35"/>
    </svg>
    <span className="text-xl font-bold text-white">Andaman Travel</span>
  </div>
);

const Header = () => {
  const navLinks = ["About Us", "Services", "Pricing", "Contact Us"];

  return (
    <header className="fixed top-0 left-4 right-4 z-50">
      <nav className="container mx-auto px-10 py-4 mt-4 bg-black/20 backdrop-blur-sm rounded-full flex justify-between items-center">
        <HalvoraLogo />
        
        <div className="hidden md:flex items-center gap-1 text-white">
          <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white rounded-full bg-white/10">Home</Button>
          {navLinks.map((link) => (
            <Button key={link} variant="ghost" className="text-white hover:bg-white/10 hover:text-white rounded-full">{link}</Button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white rounded-full">Logg In</Button>
          <Button className="bg-lime-400 text-black font-bold rounded-full hover:bg-lime-500">Sign Up</Button>
        </div>
      </nav>
    </header>
  );
};

export default Header;