import React from 'react';

// You can use a library like 'lucide-react' or just embed the SVG directly
const AirplaneIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="transform -rotate-45 text-indigo-500"
  >
    <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
  </svg>
);

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
const TravelPromo = () => {
  // Image URL - replace with your own asset
  const travelerImageUrl = 'https://images.wallpapersden.com/image/download/guy-mountains-travel_amhrZ2WUmZqaraWkpJRmbmdlrWZnZWU.jpg'; // Replace with your image path

  return (
    <div className="bg-[#F8F7FC] min-h-screen font-sans flex flex-col items-center justify-center p-4 sm:p-8">
      <main className="max-w-6xl w-full">
        {/* Top Section */}
        <section className="flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-8">
          
          {/* Left Column - Image and decorative elements */}
          <div className="relative w-[350px] h-[450px] sm:w-[400px] sm:h-[500px] flex-shrink-0">
            {/* Decorative Dashed Line 1 (top left) */}
            <svg width="100" height="100" className="absolute -top-8 -left-12 -z-0" style={{'--color': '#FBBF24'}}>
              <path d="M10 90 Q50 10 90 50" stroke="currentColor" fill="transparent" strokeWidth="2" strokeDasharray="5,5" />
              <path d="M85 45 L90 50 L85 55" stroke="currentColor" fill="transparent" strokeWidth="2" />
            </svg>

            {/* Decorative Dashed Line 2 (bottom right) */}
            <svg width="120" height="100" className="absolute -bottom-10 -right-12" style={{'--color': '#3B82F6'}}>
              <path d="M10 20 Q 80 10 110 80" stroke="currentColor" fill="transparent" strokeWidth="2" strokeDasharray="5,5" />
              <path d="M105 75 L110 80 L105 85" stroke="currentColor" fill="transparent" strokeWidth="2" />
            </svg>
            
            {/* Dots */}
            <span className="absolute top-1/4 left-0 w-3 h-3 bg-yellow-400 rounded-full"></span>
            <span className="absolute bottom-1/4 right-0 w-3 h-3 bg-blue-500 rounded-full"></span>
            <span className="absolute bottom-8 left-12 w-2 h-2 bg-blue-500 rounded-full"></span>
            <span className="absolute top-12 right-12 w-2 h-2 bg-yellow-400 rounded-full"></span>

            {/* Main Image Container */}
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Purple background oval */}
              <div className="absolute w-[90%] h-full bg-gradient-to-br from-[#A992E8] to-[#9177D9] rounded-full transform -rotate-82"></div>
              
              {/* Red base */}
              <div className="absolute bottom-12 w-[60%] h-[30%] bg-[#F04D54] rounded-t-full z-10"></div>
              
              {/* Traveler Image */}
              <img
                src={travelerImageUrl}
                alt="Happy traveler with a camera pointing"
                className="absolute h-full bottom-0 w-[95%] rounded-2xl object-cover z-20"
                style={{ filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.2))' }}
              />
            </div>
          </div>

          {/* Right Column - Text content */}
          <div className="relative w-full lg:w-1/2 text-center lg:text-left mt-8 lg:mt-0">
            <div className="absolute -top-16 right-0 hidden lg:block">
              <div className="relative flex items-center justify-center">
                <svg width="150" height="50">
                  <path d="M10 40 C 50 10, 100 10, 140 20" stroke="#8B5CF6" strokeWidth="2" fill="none" strokeDasharray="4 4" />
                </svg>
                <div className="absolute top-[2px] right-[-10px]">
                  <AirplaneIcon />
                </div>
              </div>
            </div>

            <p className="text-gray-500 font-semibold tracking-widest text-sm mb-2">OUR EXPERIENCE</p>
            <h1 style={customFontStyle2} className="text-4xl sm:text-5xl font-extrabold text-[#1E1D4C] my-4 leading-tight">
              We Will Make You Happy With Our Trip.
            </h1>
            <p className="text-gray-500 mb-10 text-base leading-relaxed">
              As long as we stick to customer satisfaction we will not take more profit, this is all only for your satisfaction.
            </p>

            {/* Stats Section */}
            <div className="flex justify-center lg:justify-start gap-8 sm:gap-12">
              <div className="text-left">
                <p className="text-4xl font-bold text-[#5D3EAF]">10+</p>
                <p className="text-gray-500 text-sm">Years <br />Experience</p>
              </div>
              <div className="text-left">
                <p className="text-4xl font-bold text-[#5D3EAF]">42+</p>
                <p className="text-gray-500 text-sm">Destination <br />Collaboration</p>
              </div>
              <div className="text-left">
                <p className="text-4xl font-bold text-[#5D3EAF]">10K+</p>
                <p className="text-gray-500 text-sm">Happy <br />Costumer</p>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom Section */}
        <section className="mt-24  sm:mt-32">
          <div className="bg-[#E9E6F8] rounded-3xl shadow-xl p-8 sm:p-12 md:p-16 text-center">
            <h2 style={customFontStyle} className="text-3xl sm:text-4xl font-bold text-[#1E1D4C] leading-snug">
              Prepare Yourself & Let's Explore <br className="hidden sm:block" /> The <span style={customFontStyle2} className='text-orange-500'>Beauty</span> Of The World
            </h2>
            <p className="text-gray-600 my-5 text-base">
              We have many offers especially for you.
            </p>
            <button className="bg-[#5D3EAF] text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105">
              Get Started a Trip
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default TravelPromo;
