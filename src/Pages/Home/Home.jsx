// src/components/Home.jsx

import React, { useState } from 'react';
import { format } from "date-fns";
import { cn } from "@/lib/utils";

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
    <div className="relative h-screen w-full flex items-center justify-center overflow-hidden">
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
        <div  className="text-center text-white mt-20">
          <div style={customFontStyle2} className="inline-block bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-medium mb-4">
            Travel More. Worry Less.
          </div>
          <h1 style={customFontStyle} className="text-5xl md:text-7xl font-bold leading-tight">
            Explore the World, One <br /> Journey at a Time.
          </h1>
          <p  style={customFontStyle2} className="mt-4 max-w-2xl mx-auto text-lg text-white/80">
            Our travel agency offers personalized, hassle-free travel experiences, tailored to meet your unique preferences and needs.
          </p>
        </div>

        {/* Search Card - Replicated from the image */}
        <Card className="w-full max-w-4xl mt-20 bg-white/95 backdrop-blur-lg p-2.5 rounded-2xl shadow-xl border-none">
          <div className="flex items-center justify-between bg-white p-4 rounded-xl">
            
            {/* Location Input Group */}
            <div className="flex-1 flex items-center space-x-3 px-2">
              <MapPin className="h-6 w-6 text-gray-400" />
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-gray-500">Location</label>
                <Input 
                  placeholder="Where are you going?" 
                  className="border-0 focus-visible:ring-0 p-0 h-auto text-md placeholder:text-gray-400" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>

            <div className="h-12 self-center border-l border-gray-200" />

            {/* Check-in Date Picker Group */}
            <div className="flex-1 flex items-center space-x-3 px-4">
              <CalendarIcon className="h-6 w-6 text-gray-400" />
              <div className="flex flex-col w-full">
                <label className="text-xs font-semibold text-gray-500">Check In</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"ghost"}
                      className={cn(
                        "w-full justify-start text-left font-normal p-0 h-auto text-md hover:bg-transparent placeholder:text-gray-400",
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

            <div className="h-12 self-center border-l border-gray-200" />

            {/* Check-out Date Picker Group */}
            <div className="flex-1 flex items-center space-x-3 px-4">
              <CalendarIcon className="h-6 w-6 text-gray-400" />
              <div className="flex flex-col w-full">
                <label className="text-xs font-semibold text-gray-500">Check Out</label>
                 <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"ghost"}
                      className={cn(
                        "w-full justify-start text-left font-normal p-0 h-auto text-md hover:bg-transparent",
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

            <div className="h-12 self-center border-l border-gray-200" />

            {/* Participants Input Group */}
            <div className="flex-1 flex items-center space-x-3 px-4">
              <Users className="h-6 w-6 text-gray-400" />
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-gray-500">Participants</label>
                <Input 
                  type="text" // Using text to allow placeholder
                  placeholder="Add guests" 
                  onFocus={(e) => e.target.type='number'}
                  onBlur={(e) => e.target.type='text'}
                  className="border-0 focus-visible:ring-0 p-0 h-auto text-md placeholder:text-gray-400"
                  min="1"
                  value={participants}
                  onChange={(e) => setParticipants(e.target.value)}
                />
              </div>
            </div>

            {/* Search Button */}
            <Button 
              size="icon" 
              className="h-12 w-12 rounded-xl" // This will use the "bg-primary" from your CSS by default
              onClick={handleSearch}
            >
              <Search className="h-6 w-6" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Home;