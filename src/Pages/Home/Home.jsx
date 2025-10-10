// src/Pages/Home/Home.jsx
import React, { useState } from 'react';
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Home2 from './Home2';
import Activities from './Activities';

// Shadcn UI & Lucide Icons
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Search, MapPin, Calendar as CalendarIcon, Users } from 'lucide-react';

// Local Assets
import vid1 from '../../assets/vid1.mp4';

const customFontStyle = {
  fontFamily: "'Neue Montreal Regular', sans-serif",
  fontWeight: 600,
  fontStyle: "normal",
};
const customFontStyle2 = {
  fontFamily: "'Neue Montreal Regular', sans-serif",
  fontWeight: 200,
  fontStyle: "normal",
};

const Home = () => {
  // State management for the form inputs
  const [location, setLocation] = useState('');
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [participants, setParticipants] = useState('');

  // Handler for the search button click
  const handleSearch = () => {
    // "Hot Dummy API" - Simulate an API call by logging the data
    const searchData = {
      location,
      checkIn: checkInDate ? format(checkInDate, "yyyy-MM-dd") : null,
      checkOut: checkOutDate ? format(checkOutDate, "yyyy-MM-dd") : null,
      participants,
    };
    console.log('Searching with the following data:', searchData);
  };

  return (
    <>
      <div className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden">
        {/* Video Background */}
        <video
          src={vid1}
          autoPlay
          loop
          muted
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50 z-10" />

        <div className="relative z-20 w-full max-w-6xl px-4 flex flex-col items-center">
          {/* Hero Text */}
          <div className="text-center text-white mt-10 md:mt-20 w-full">
            <div
              style={customFontStyle2}
              className="inline-block bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 text-xs sm:text-sm font-medium mb-4" // Adjusted text size for smaller screens
            >
              Travel More. Worry Less.
            </div>
            <h1
              style={customFontStyle}
              className="text-3xl md:text-4xl lg:text-5xl xl:text-7xl font-bold leading-tight px-4"
            >
              Explore the World, One <br className="hidden md:block" /> Journey at a Time. {/* Hide <br> on mobile */}
            </h1>
            <p
              style={customFontStyle2}
              className="mt-4 max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-white/80 px-4" // Adjusted text size for smaller screens
            >
              Our travel agency offers personalized, hassle-free travel experiences, tailored to meet your unique preferences and needs.
            </p>
          </div>

          {/* Search Card */}
          <Card className=" hidden md:flex w-full max-w-4xl mt-8 md:mt-12 bg-white/95 backdrop-blur-lg p-2.5 rounded-2xl shadow-xl border-none mx-4"> {/* Added mx-4 for horizontal padding on small screens */}
            <div className="flex flex-col md:flex-row items-center justify-between bg-white p-2 md:p-4 rounded-xl gap-2 md:gap-4"> {/* Adjusted padding and gap for mobile */}

              {/* Location Input Group */}
              <div className="flex-1 flex items-center space-x-3 px-2 py-2 w-full border-b md:border-b-0 border-gray-200 last:border-b-0"> {/* Added bottom border for mobile stacking */}
                <MapPin className="h-5 w-5 text-gray-400 flex-shrink-0" />
                <div className="flex flex-col w-full">
                  <label className="text-xs font-semibold text-gray-500">Location</label>
                  <Input
                    placeholder="Where are you going?"
                    className="border-0 focus-visible:ring-0 p-0 h-auto text-sm md:text-md placeholder:text-gray-400"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>

              <div className="hidden md:block h-12 self-center border-l border-gray-200 w-0.5" /> {/* Hidden on mobile */}

              {/* Check-in Date Picker Group */}
              <div className="flex-1 flex items-center space-x-3 px-2 py-2 w-full border-b md:border-b-0 border-gray-200 last:border-b-0">
                <CalendarIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
                <div className="flex flex-col w-full">
                  <label className="text-xs font-semibold text-gray-500">Check In</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"ghost"}
                        className={cn(
                          "w-full justify-start text-left font-normal p-0 h-auto text-sm md:text-md hover:bg-transparent placeholder:text-gray-400",
                          !checkInDate && "text-muted-foreground"
                        )}
                      >
                        {checkInDate ? format(checkInDate, "PPP") : <span className="text-gray-400">Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={checkInDate}
                        onSelect={setCheckInDate}
                        disabled={(date) => date < new Date().setHours(0,0,0,0)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="hidden md:block h-12 self-center border-l border-gray-200 w-0.5" /> {/* Hidden on mobile */}

              {/* Check-out Date Picker Group */}
              <div className="flex-1 flex items-center space-x-3 px-2 py-2 w-full border-b md:border-b-0 border-gray-200 last:border-b-0">
                <CalendarIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
                <div className="flex flex-col w-full">
                  <label className="text-xs font-semibold text-gray-500">Check Out</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"ghost"}
                        className={cn(
                          "w-full justify-start text-left font-normal p-0 h-auto text-sm md:text-md hover:bg-transparent",
                          !checkOutDate && "text-muted-foreground"
                        )}
                      >
                        {checkOutDate ? format(checkOutDate, "PPP") : <span className="text-gray-400">Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={checkOutDate}
                        onSelect={setCheckOutDate}
                        disabled={(date) => date <= checkInDate || !checkInDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="hidden md:block h-12 self-center border-l border-gray-200 w-0.5" /> {/* Hidden on mobile */}

              {/* Participants Input Group */}
              <div className="flex-1 flex items-center space-x-3 px-2 py-2 w-full"> {/* Removed border-b as it's the last item */}
                <Users className="h-5 w-5 text-gray-400 flex-shrink-0" />
                <div className="flex flex-col w-full">
                  <label className="text-xs font-semibold text-gray-500">Participants</label>
                  <Input
                    type="text"
                    placeholder="Add guests"
                    onFocus={(e) => e.target.type = 'number'}
                    onBlur={(e) => e.target.type = 'text'}
                    className="border-0 focus-visible:ring-0 p-0 h-auto text-sm md:text-md placeholder:text-gray-400"
                    min="1"
                    value={participants}
                    onChange={(e) => setParticipants(e.target.value)}
                  />
                </div>
              </div>

              {/* Search Button */}
              <Button
                size="icon"
                className="h-10 w-full md:w-12 md:h-12 rounded-xl flex-shrink-0 mt-2 md:mt-0" // Full width on mobile, adjusted height/width, added top margin
                onClick={handleSearch}
              >
                <Search className="h-5 w-5" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
      <Home2 />
      <Activities />
    </>
  );
};

export default Home;