import React, { useState } from 'react';

const tours = [
  {
    id: 1,
    title: 'ANDAMAN ADVENTURE',
    description: 'Explore pristine beaches, coral reefs, and tropical forests in the Andaman Islands.',
    location: 'Andaman Islands, India',
    difficulty: 'Intermediate',
    duration: '7 Days / 6 Nights',
    price: '$500 - $800',
    image: 'https://images.pexels.com/photos/1020016/pexels-photo-1020016.jpeg  ',
  },
  {
    id: 2,
    title: 'HIMALAYAN RETREAT',
    description: 'Experience the tranquility of the Himalayas with scenic treks and monasteries.',
    location: 'Himalayas, India',
    difficulty: 'Novice',
    duration: '10 Days / 9 Nights',
    price: '$700 - $1000',
    image: 'https://images.pexels.com/photos/1666012/pexels-photo-1666012.jpeg  ',
  },
  {
    id: 3,
    title: 'KERALA BACKWATERS',
    description: 'Cruise through serene backwaters and experience houseboat culture in Kerala.',
    location: 'Kerala, India',
    difficulty: 'Intermediate',
    duration: '6 Days / 5 Nights',
    price: '$400 - $600',
    image: 'https://images.pexels.com/photos/32805562/pexels-photo-32805562.jpeg  ',
  },
  {
    id: 4,
    title: 'RAJASTHAN ROYAL',
    description: 'Discover palaces, forts, and desert culture in the royal state of Rajasthan.',
    location: 'Rajasthan, India',
    difficulty: 'Advanced',
    duration: '8 Days / 7 Nights',
    price: '$600 - $900',
    image: 'https://images.pexels.com/photos/1011093/pexels-photo-1011093.jpeg  ',
  },
];

const categories = ['ALL', 'KIDS', 'NOVICE', 'INTERMEDIATE', 'INTERMEDIATE +', 'ADVANCED'];

const TourCard = ({ tour }) => (
  <div className="relative w-[360px] h-[550px] rounded-3xl overflow-hidden flex-shrink-0 mx-4">
    {/* Shadow element behind the card */}
    <div className="absolute inset-0 bg-gray-800 rounded-3xl transform translate-x-3 translate-y-3 -z-10"></div>
    
    {/* Card content */}
    <div className="relative w-full h-full shadow-lg">
      <img src={tour.image} alt={tour.title} className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
      <div className="relative p-8 text-white flex flex-col h-full justify-between">
        <div>
          <h3 className="text-4xl font-bold leading-tight">{tour.title}</h3>
          <p className="mt-2 text-sm max-w-[250px]">{tour.description}</p>
        </div>
        <div className="flex flex-col space-y-3">
          <button className="bg-yellow-400 text-gray-900 font-semibold py-3 px-6 rounded-full flex items-center justify-center space-x-2 transition-transform duration-200 hover:scale-105">
            <span>BOOK NOW</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
              <path fillRule="evenodd" d="M4.293 15.707a1 1 0 010-1.414L8.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          <button className="bg-gray-700 bg-opacity-70 text-white font-semibold py-3 px-6 rounded-full transition-transform duration-200 hover:scale-105">
            MORE INFORMATION
          </button>
        </div>
      </div>
    </div>
  </div>
);

const Carousel = () => {
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const filteredTours = tours.filter(tour =>
    selectedCategory === 'ALL' || tour.difficulty.toUpperCase() === selectedCategory.toUpperCase()
  );

  return (
    <div className="min-h-screen bg-gray-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-[40px] shadow-2xl p-6 max-w-7xl w-full">
        {/* Static Cards */}
        <div className="flex overflow-x-auto pb-8 -mx-4 hide-scrollbar">
          {filteredTours.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>

        {/* Bottom Details for first card */}
        {filteredTours.length > 0 && (
          <div className="mt-8 pt-8 border-t border-gray-200 flex justify-between items-end">
            <div>
              <h4 className="text-xl font-bold">{filteredTours[0].location.toUpperCase()}</h4>
              <p className="text-gray-600 text-sm mt-1">
                {filteredTours[0].difficulty} • {filteredTours[0].duration} • {filteredTours[0].price}
              </p>
            </div>
          </div>
        )}
      </div>
      
      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default Carousel;