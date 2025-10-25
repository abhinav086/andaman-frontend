// src/Pages/Header/ImageGallery.jsx
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

// Sample image URLs (replace these with your actual image paths)
const PLACE_IMAGES = {
  portBlair: [
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600',
    'https://images.unsplash.com/photo-1618826411648-6e4db4c4a7be?auto=format&fit=crop&w=600',
    'https://images.unsplash.com/photo-1618826411648-6e4db4c4a7b1?auto=format&fit=crop&w=600'
  ],
  havelock: [
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600',
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a41?auto=format&fit=crop&w=600',
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a42?auto=format&fit=crop&w=600'
  ],
  neil: [
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3f?auto=format&fit=crop&w=600',
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a43?auto=format&fit=crop&w=600',
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a44?auto=format&fit=crop&w=600'
  ]
};

const PLACES = [
  {
    id: 1,
    name: 'Port Blair',
    description: 'Known for the historic Cellular Jail and beautiful beaches',
    images: PLACE_IMAGES.portBlair
  },
  {
    id: 2,
    name: 'Havelock Island (Swaraj Dweep)',
    description: 'Famous for Radhanagar Beach and water sports activities',
    images: PLACE_IMAGES.havelock
  },
  {
    id: 3,
    name: 'Neil Island (Shaheed Dweep)',
    description: 'Renowned for its pristine beaches and coral reefs',
    images: PLACE_IMAGES.neil
  }
];

const ImageGallery = () => {
  const [currentPlaceIndex, setCurrentPlaceIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);

  const currentPlace = PLACES[currentPlaceIndex];

  const nextPlace = () => {
    setCurrentPlaceIndex((prev) => (prev + 1) % PLACES.length);
    setCurrentImageIndex(0); // Reset image index when changing places
  };

  const prevPlace = () => {
    setCurrentPlaceIndex((prev) => (prev - 1 + PLACES.length) % PLACES.length);
    setCurrentImageIndex(0); // Reset image index when changing places
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % currentPlace.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + currentPlace.images.length) % currentPlace.images.length);
  };

  const openLightbox = (img) => {
    setSelectedImage(img);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedImage) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
      } else {
        if (e.key === 'ArrowRight') nextPlace();
        if (e.key === 'ArrowLeft') prevPlace();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-lime-400 to-blue-500">
          Andaman Islands Gallery
        </h1>
        <p className="text-center text-slate-300 mb-12 max-w-2xl mx-auto">
          Explore the breathtaking beauty of Andaman's most stunning destinations
        </p>

        <div className="relative bg-slate-800/50 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl">
          {/* Navigation buttons */}
          <button
            onClick={prevPlace}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 p-2 rounded-full transition-all"
            aria-label="Previous place"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={nextPlace}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 p-2 rounded-full transition-all"
            aria-label="Next place"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Place header */}
          <div className="p-6 md:p-8 border-b border-slate-700">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold">{currentPlace.name}</h2>
                <p className="text-slate-300 mt-2">{currentPlace.description}</p>
              </div>
              <div className="text-sm text-slate-400">
                {currentPlaceIndex + 1} of {PLACES.length}
              </div>
            </div>
          </div>

          {/* Main image display */}
          <div className="relative h-[400px] md:h-[500px] overflow-hidden">
            <img
              src={currentPlace.images[currentImageIndex]}
              alt={`${currentPlace.name} - Image ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
              onClick={() => openLightbox(currentPlace.images[currentImageIndex])}
            />
            
            {/* Image counter */}
            <div className="absolute bottom-4 left-4 bg-black/50 px-3 py-1 rounded-full text-sm">
              {currentImageIndex + 1} of {currentPlace.images.length}
            </div>
            
            {/* Navigation for images */}
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 p-2 rounded-full transition-all z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 p-2 rounded-full transition-all z-10"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Thumbnail gallery */}
          <div className="p-4 md:p-6 grid grid-cols-3 md:grid-cols-6 gap-2">
            {currentPlace.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={`relative h-24 md:h-32 overflow-hidden rounded-lg transition-all ${
                  idx === currentImageIndex ? 'ring-2 ring-lime-400 scale-105' : 'hover:scale-105'
                }`}
                aria-label={`View image ${idx + 1}`}
              >
                <img
                  src={img}
                  alt={`${currentPlace.name} thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
                {idx === currentImageIndex && (
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="w-3 h-3 bg-lime-400 rounded-full"></div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Place navigation dots */}
        <div className="flex justify-center mt-8 space-x-2">
          {PLACES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrentPlaceIndex(idx);
                setCurrentImageIndex(0);
              }}
              className={`w-3 h-3 rounded-full transition-all ${
                idx === currentPlaceIndex ? 'bg-lime-400' : 'bg-slate-600 hover:bg-slate-500'
              }`}
              aria-label={`Go to ${PLACES[idx].name}`}
            />
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button
            className="absolute top-4 right-4 z-10 bg-black/50 p-2 rounded-full"
            onClick={closeLightbox}
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6" />
          </button>
          <button
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 p-2 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 p-2 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          <img
            src={selectedImage}
            alt="Enlarged view"
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default ImageGallery;