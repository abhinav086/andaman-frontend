import React from "react";
import {
  MapPin,
  Calendar,
  Search,
  Star,
  Plane,
  Ticket,
  Gem,
} from "lucide-react";
import Home2 from "./Home2";
import Home3 from "./Home3";
import Activities from "./Activities";

// Import your assets
import worldMap from "../../assets/world-map.png";
import tourist from "../../assets/island.png";
import landscape from "../../assets/tourist.jpg";
import ChatBot from "./Chatbot";

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

const FeatureCard = ({ icon, title, description }) => (
  <div className="flex flex-col items-center md:items-start text-center md:text-left">
    <div className="bg-[#F1F0FE] p-3 rounded-xl mb-4">{icon}</div>
    <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-500 leading-relaxed">{description}</p>
  </div>
);

const Home = () => {
  return (
    <>
      {/* FIXED: Added overflow-x-hidden without asterisks */}
      <div className="bg-white min-h-screen font-sans text-gray-800 relative overflow-x-hidden w-full">
        {/* Background World Map - constrained with overflow-hidden wrapper */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img
            src={worldMap}
            alt="World Map"
            className="w-full h-full object-cover opacity-5"
          />
        </div>

        {/* Decorative Dots - Constrained within viewport */}
        <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-orange-300 rounded-full opacity-50 pointer-events-none"></div>
        <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-purple-300 rounded-full opacity-50 pointer-events-none"></div>
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-orange-300 rounded-full opacity-50 pointer-events-none"></div>

        {/* FIXED: Added max-w to constrain container and prevent overflow */}
        <div className="container mx-auto px-4 sm:px-6 py-8 relative z-10 max-w-7xl">
          {/* Header */}
          <header
            style={customFontStyle}
            className="flex mt-20 items-center gap-2 sm:gap-4 flex-wrap"
          >
            <div className="bg-[#F1F0FE] text-[#6355B5] text-xs sm:text-sm font-bold px-3 sm:px-4 py-2 rounded-full whitespace-nowrap">
              42 Packet Travel
            </div>
            <div className="bg-[#FFF4E7] text-[#FFA800] text-xs sm:text-sm font-bold px-3 sm:px-4 py-2 rounded-full whitespace-nowrap">
              For Explorer Friendly
            </div>
          </header>

          {/* Hero Section */}
          <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center mt-8 md:mt-20">
            {/* Left Side: Text and Search */}
            <div className="flex flex-col gap-6 sm:gap-8 w-full">
              <h1
                style={customFontStyle}
                className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight"
              >
                Feeling <span className="text-[#6355B5]">Bored</span> and Wanna
                Take Some <span className="text-[#FF7900]">Vacation</span>
                <Plane className="inline-block text-[#6355B5] ml-2 transform -rotate-45 h-8 w-8 sm:h-10 sm:w-10" />
              </h1>

              <h1
                style={customFontStyle2}
                className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-gray-800 leading-tight"
              >
                Make Andaman Trip
              </h1>

              <p style={customFontStyle} className="text-gray-500 text-base sm:text-lg">
                We always make our costumer happy by providing a lot of travel
                packet and costumer can custom their own packet travel.
              </p>

              {/* Search Form - FIXED: Added w-full to prevent overflow */}
              <div className="bg-white p-4 rounded-2xl shadow-lg flex flex-col md:flex-row items-center gap-4 w-full">
                <div className="flex items-center w-full">
                  <MapPin className="text-[#6355B5] h-5 w-5 sm:h-6 sm:w-6 mr-3 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-gray-400">Location</p>
                    <p className="font-semibold text-sm sm:text-base truncate">Belitung, Indonesia</p>
                  </div>
                </div>
                <div className="w-full md:w-px h-px md:h-12 bg-gray-200"></div>
                <div className="flex items-center w-full">
                  <Calendar className="text-[#6355B5] h-5 w-5 sm:h-6 sm:w-6 mr-3 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-gray-400">Date</p>
                    <p className="font-semibold text-sm sm:text-base truncate">22 October 2020</p>
                  </div>
                </div>
                <button className="bg-[#6355B5] text-white p-3 sm:p-4 rounded-xl w-full md:w-auto hover:bg-[#4a3d8f] transition-colors">
                  <Search className="h-5 w-5 sm:h-6 sm:w-6 mx-auto" />
                </button>
              </div>

              {/* Dotted line with plane icon - FIXED: Added overflow-hidden and max-w */}
              <div className="relative mt-8 h-12 w-full max-w-xs overflow-hidden">
                <svg
                  className="absolute left-0 top-0 w-full h-auto"
                  viewBox="0 0 200 50"
                  preserveAspectRatio="xMinYMin meet"
                >
                  <path
                    d="M 5,45 C 50,5 150,5 195,45"
                    stroke="#D1D5DB"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="5,5"
                  />
                </svg>
                <Plane
                  className="absolute text-[#6355B5] h-5 w-5 sm:h-6 sm:w-6 transform -rotate-12"
                  style={{ left: "35%", top: "0%" }}
                />
              </div>
            </div>

            {/* Right Side: Image and Card - FIXED: Added overflow-hidden and better constraints */}
            <div className="relative hidden lg:block h-[450px] xl:h-[500px] w-full max-w-lg mx-auto overflow-hidden">
              {/* Purple background shape */}
              <div className="absolute top-0 right-0 w-[85%] h-[95%] bg-[#F1F0FE] rounded-3xl transform -rotate-6"></div>
              
              {/* Tourist Image - FIXED: Wrapped in container with overflow-hidden */}
              <div className="absolute bottom-0 right-0 h-full w-[80%] overflow-hidden">
                <img
                  src={tourist}
                  alt="A tourist with a backpack and hat"
                  className="h-full w-full object-contain z-10"
                />
              </div>
              
              {/* Floating Info Card */}
              <div
                style={customFontStyle}
                className="absolute bottom-8 left-0 bg-white p-4 rounded-2xl shadow-xl w-56 sm:w-64 z-20"
              >
                <img
                  src={landscape}
                  alt="Indonesia landscape"
                  className="rounded-lg mb-3 h-28 sm:h-32 w-full object-cover"
                />
                <h4 className="font-bold text-gray-800 text-sm sm:text-base">
                  Get Ready to Explore Andaman Islands
                </h4>

                <div className="flex items-center mt-3">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 sm:h-4 sm:w-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 ml-2">800+ Review</p>
                </div>
              </div>
            </div>
          </main>

          {/* Services Section */}
          <section
            style={customFontStyle}
            className="text-center mt-16 sm:mt-24 md:mt-32"
          >
            <p
              style={customFontStyle}
              className="text-gray-500 font-semibold tracking-widest text-xs sm:text-sm"
            >
              WHAT WE SERVE
            </p>
            <h2
              style={customFontStyle2}
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-800 mt-2"
            >
              What Will You Get?
            </h2>
            <p className="text-gray-500 mt-4 max-w-lg mx-auto text-sm sm:text-base px-4">
              In every single trip that you go, you will get serve like a king.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 mt-8 sm:mt-12 px-4">
              <FeatureCard
                icon={<MapPin className="h-6 w-6 text-[#6355B5]" />}
                title="Lot of Travel Places"
                description="We will provide a lot of places in every single trip that you pick."
              />
              <FeatureCard
                icon={<Ticket className="h-6 w-6 text-[#6355B5]" />}
                title="Cheap Travel Packet"
                description="Every packet travel that you chooses, will not till you."
              />
              <FeatureCard
                icon={<Gem className="h-6 w-6 text-[#6355B5]" />}
                title="And More Bonus"
                description="We will make sure that you happy in our trip, so you will get some bonus in your trip."
              />
            </div>
          </section>
        </div>
      </div>
      <Home2 />
      <Activities />
      <Home3 />
      <ChatBot />
    </>
  );
};

export default Home;