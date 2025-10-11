// src/Pages/Home/Home2.jsx
import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config/api';
import bgv from '../../assets/bgv.mp4'; // Background video for header
import {
  Heart,
  MapPin,
  Clock,
  Star,
  Home,
  Users,
  Filter,
  BookOpen,
  X,
  BedDouble,
  Calendar,
  User,
  ChevronLeft,
  ChevronRight,
  Plane,
  Mountain,
  Waves,
  Coffee,
  Wine,
  Camera,
  Globe,
  Coffee as CoffeeIcon,
  Utensils,
  Waves as WavesIcon,
  ExternalLink,
  MapPin as MapPinIcon,
  Star as StarIcon,
  Home as HomeIcon
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from 'react-router-dom';

const customFontStyle = {
  fontFamily: "'Neue Montreal Regular', sans-serif",
  fontWeight: 600,
  fontStyle: "normal",
};

// --- START: NEW DECORATIVE SVG COMPONENTS ---
const AirplaneIcon = () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-400">
        <path d="M21 16V14L13 9V3.5C13 2 12.33 1.33 11.5 1.33C10.67 1.33 10 2 10 2.67V9L2 14V16L10 13.5V19L8 20.5V22L11.5 21L15 22V20.5L13 19V13.5L21 16Z" fill="currentColor"/>
    </svg>
);

const DottedPath = ({ className }) => (
    <svg width="250" height="100" viewBox="0 0 250 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M2 98C30.6667 86.8333 93.2 43.6 153.5 29C213.8 14.4 248.167 2.33333 248.5 2" stroke="#A7C7E7" strokeWidth="3" strokeLinecap="round" strokeDasharray="1 10"/>
    </svg>
);

const TravelIcons = () => (
  <div className="absolute top-1/4 left-1/4 w-16 h-16 bg-white/80 rounded-full flex items-center justify-center shadow-lg z-10">
    <Plane className="text-blue-500" size={24} />
  </div>
);
// --- END: NEW DECORATIVE SVG COMPONENTS ---

// Booking Sheet Component
const BookingSheet = ({ hotel, onBook, isOpen, setIsOpen }) => {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [roomType, setRoomType] = useState('Deluxe Suite'); // Default to first available type if possible
  const [specialRequests, setSpecialRequests] = useState('');
  const [loading, setLoading] = useState(false);

  // Calculate price based on selected room type and dates
  const calculateTotalAmount = () => {
    if (!checkIn || !checkOut) return 0;
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
    const numNights = Math.ceil(timeDiff / (1000 * 3600 * 24));
    let roomPrice = hotel.base_price; // Default to base price
    if (hotel.room_types && Array.isArray(hotel.room_types)) {
      const selectedRoom = hotel.room_types.find(rt => rt.type === roomType);
      if (selectedRoom) {
        roomPrice = selectedRoom.price; // Use price from selected room type
      }
    }
    return roomPrice * numNights;
  };

  const totalAmount = calculateTotalAmount();

  const handleBooking = async () => {
    if (!checkIn || !checkOut) {
      alert('Please select check-in and check-out dates');
      return;
    }
    if (!roomType) {
      alert('Please select a room type');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_BASE_URL}/api/bookings/hotel/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          hotel_id: hotel.hotel_id,
          room_type: roomType,
          check_in_date: checkIn,
          check_out_date: checkOut,
          num_guests: guests,
          total_amount: totalAmount, // Send calculated amount
          special_requests: specialRequests,
          // The backend will calculate room_price, num_nights, etc.
        })
      });

      if (response.ok) {
        const data = await response.json();
        onBook(data.booking);
        setIsOpen(false); // Close the sheet on success
      } else {
        const error = await response.json();
        alert(`Booking failed: ${error.msg || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Set default room type if hotel data changes
  useEffect(() => {
    if (hotel && hotel.room_types && hotel.room_types.length > 0) {
      setRoomType(hotel.room_types[0].type);
    } else if (hotel) {
      setRoomType('Standard'); // Fallback if no room types
    }
  }, [hotel]);

  // Calculate number of nights for display
  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  const nights = calculateNights();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Book Your Stay</SheetTitle>
          <SheetDescription>
            Complete your booking details for {hotel.name}.
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-4 mt-4">
          <div>
            <Label htmlFor="checkIn">Check-in Date</Label>
            <Input
              id="checkIn"
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div>
            <Label htmlFor="checkOut">Check-out Date</Label>
            <Input
              id="checkOut"
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              min={checkIn || new Date().toISOString().split('T')[0]}
            />
          </div>
          <div>
            <Label htmlFor="guests">Number of Guests</Label>
            <Select value={guests.toString()} onValueChange={(value) => setGuests(Number(value))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <SelectItem key={num} value={num.toString()}>{num} {num === 1 ? 'Guest' : 'Guests'}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="roomType">Room Type</Label>
            <Select value={roomType} onValueChange={setRoomType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {hotel.room_types && hotel.room_types.length > 0 ? (
                  hotel.room_types.map((rt, index) => (
                    <SelectItem key={index} value={rt.type}>{rt.type} - ₹{rt.price}</SelectItem>
                  ))
                ) : (
                  <SelectItem value="Standard">Standard</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="specialRequests">Special Requests</Label>
            <Textarea
              id="specialRequests"
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              rows="3"
              placeholder="Any special requests..."
            />
          </div>
        </div>

        {/* Price Summary Section */}
        <Separator className="my-6" />
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
          <h4 className="font-semibold text-blue-800 mb-2">Price Summary</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <div className="flex justify-between">
              <span>Room Type: {roomType}</span>
              <span>₹{(totalAmount / nights || 0).toFixed(2)}/night</span>
            </div>
            <div className="flex justify-between">
              <span>Nights: {nights}</span>
              <span>₹{totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-blue-900">
              <span>Total:</span>
              <span>₹{totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleBooking} disabled={loading}>
            {loading ? 'Booking...' : 'Confirm Booking'}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

// Hotel Card Component - FIXED to use real data
const HotelCard = ({ hotel, onBook, bookedHotels }) => {
  const [showBookingSheet, setShowBookingSheet] = useState(false);
  const navigate = useNavigate();

  const isBooked = bookedHotels.some(b => b.hotel_id === hotel.hotel_id);

  // Determine the price to display (use base price or first room type price)
  const displayPrice = (hotel.room_types && hotel.room_types.length > 0)
    ? hotel.room_types[0].price
    : hotel.base_price || 0;

  return (
    <Card className="group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="relative">
        <img
          src={hotel.photos && hotel.photos.length > 0 ? hotel.photos[0] : 'https://placehold.co/400x200?text=No+Image'}
          alt={hotel.name}
          className="w-full h-40 object-cover rounded-t-xl transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center text-xs font-semibold text-gray-800">
          <StarIcon className="text-yellow-500 mr-1" size={12} fill="currentColor" />
          <span>{hotel.average_rating || hotel.rating || 4.8}</span>
        </div>
        <div className="absolute top-2 right-2 bg-black/50 text-white rounded-lg px-2.5 py-1 text-xs font-bold">
          ₹{displayPrice}
        </div>
        <button className="absolute top-8 right-2 bg-white/90 backdrop-blur-sm rounded-full p-2 transition-all opacity-0 group-hover:opacity-100 group-hover:top-2">
          <Heart className="text-gray-600 hover:text-red-500 hover:fill-red-500 transition-colors" size={16} />
        </button>
      </div>
      <CardContent className="p-3">
        <h3 className="font-bold text-base text-gray-800 truncate">{hotel.name}</h3>
        <p> ₹{displayPrice}</p>
        <p className="text-gray-500 text-xs flex items-center mt-1">
          <MapPinIcon className="mr-1 h-3 w-3" />
          
          {hotel.city}, {hotel.country}
        </p>
        <div className="flex items-center mt-2 text-gray-600 text-xs">
          <span className="flex items-center mr-3">
            <HomeIcon className="mr-1 h-3 w-3 text-blue-500" />
            {hotel.type || 'Hotel'}
          </span>
          <span className="flex items-center">
            <StarIcon className="mr-1 h-3 w-3 text-blue-500" />
            {hotel.star_rating || 'N/A'} Stars
          </span>
        </div>
        <div className="mt-3 flex flex-col gap-2">
          <Button
            className={`w-full py-2 rounded-lg flex items-center justify-center gap-2 font-semibold text-sm transition-all ${
              isBooked
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-[#221b4d] text-white shadow-lg shadow-zinc-500/30 hover:opacity-90'
            }`}
            onClick={() => isBooked ? navigate('/my-bookings') : setShowBookingSheet(true)}
            disabled={isBooked}
          >
            {isBooked ? 'View Booking' : 'Book Now'}
            <Heart
              className="text-red-500 fill-red-500"
              size={16}
            />
          </Button>
          {isBooked && (
            <Button variant="outline" size="sm" className="w-full" onClick={() => navigate('/my-bookings')}>
              My Bookings <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
      <BookingSheet
        hotel={hotel}
        onBook={onBook}
        isOpen={showBookingSheet}
        setIsOpen={setShowBookingSheet}
      />
    </Card>
  );
};

// Category Tabs Component
const CategoryTabs = ({ activeCategory, setActiveCategory }) => {
  const categories = [
    'Cabin', 'Country Side', 'Amazing Views', 'Trending', 'Beachfront',
    'New', 'Tiny', 'Amazing Pools', 'Design', 'Lake', 'Luxe', 'Mansion'
  ];

  return (
    <div className="flex overflow-x-auto pb-4 mb-6 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 hide-scrollbar">
      {categories.map((category) => (
        <button
          key={category}
          className={`px-4 py-2 mr-3 rounded-full whitespace-nowrap font-semibold text-sm transition-all duration-300 ${
            activeCategory === category
              ? 'bg-gradient-to-r from-blue-500 to-teal-500 text-white shadow-lg shadow-blue-500/20'
              : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-gray-200'
          }`}
          onClick={() => setActiveCategory(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

const Carousel = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [showMyBookings, setShowMyBookings] = useState(false);
  const [bookedHotels, setBookedHotels] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Cabin');
  const [filters, setFilters] = useState({
    priceRange: ['0', '999999'],
    placeType: [],
    rooms: [],
    propertyType: []
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const hotelsPerPage = 8;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('accessToken');
        const headers = { 'Authorization': `Bearer ${token}` };

        const [hotelsRes, bookingsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/hotels`, { headers }),
          fetch(`${API_BASE_URL}/api/bookings/hotel/`, { headers })
        ]);

        if (hotelsRes.ok) {
          const result = await hotelsRes.json();
          setHotels(result.hotels || []);
        } else {
          console.error('Failed to fetch hotels');
          setApiError('Failed to load amazing places for you.');
        }

        if (bookingsRes.ok) {
          const data = await bookingsRes.json();
          setBookedHotels(data.bookings || []);
        } else {
          console.error('Failed to fetch bookings');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setApiError('Network error occurred. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleBooking = (booking) => {
    setBookingSuccess(booking);
    setBookedHotels(prev => [...prev, booking]);
    setTimeout(() => setBookingSuccess(null), 5000);
  };

  const filteredHotels = hotels.filter(hotel => {
    const [minPrice, maxPrice] = filters.priceRange;
    // Use the display price logic from HotelCard
    const price = (hotel.room_types && hotel.room_types.length > 0)
        ? hotel.room_types[0].price
        : hotel.base_price || 0;
    return price >= parseInt(minPrice) && price <= parseInt(maxPrice) &&
          (filters.propertyType.length === 0 || filters.propertyType.includes(hotel.type || 'Hotel'));
  });

  const indexOfLastHotel = currentPage * hotelsPerPage;
  const indexOfFirstHotel = indexOfLastHotel - hotelsPerPage;
  const currentHotels = filteredHotels.slice(indexOfFirstHotel, indexOfLastHotel);
  const totalPages = Math.ceil(filteredHotels.length / hotelsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-blue-700 font-semibold text-lg">Finding your perfect getaway...</p>
        </div>
      </div>
    );
  }

  if (apiError) {
    return (
      <div style={customFontStyle} className="flex justify-center items-center p-4 h-screen">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md border border-red-100">
          <MapPinIcon className="mx-auto h-16 w-16 text-red-400" />
          <h3 className="text-2xl font-bold text-gray-800 mt-4">Oops! Something went wrong</h3>
          <p className="text-gray-600 mt-2 mb-6">{apiError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-lg font-semibold shadow-md"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 -translate-x-1/3 -translate-y-1/3 opacity-50 z-0">
            <AirplaneIcon />
            <DottedPath className="-mt-8 -ml-12" />
        </div>
        <div className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 opacity-50 z-0 hidden lg:block">
            <AirplaneIcon />
            <DottedPath className="transform scale-x-[-1] -mt-8 -mr-12" />
        </div>
      <div className="relative z-10">
        {/* Header with Video Background */}
        <div className="relative w-full h-[40vh] min-h-[500px] max-h-[450px] mb-8">
          <video autoPlay muted loop playsInline className="absolute brightness-80 top-0 left-0 w-full h-full object-cover z-0">
            <source src={bgv} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10"></div>
          <div className="relative z-20 flex flex-col items-center justify-center h-full p-4 text-center">
            <h1 style={customFontStyle} className="text-4xl md:text-6xl font-bold text-white drop-shadow-2xl">
              Stays in {activeCategory}
            </h1>
            <p style={customFontStyle} className="text-lg md:text-xl text-white/90 mt-3 drop-shadow-lg">
              Discover your perfect getaway
            </p>
            <div className="flex mt-6 space-x-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                <Mountain className="text-white" size={24} />
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                <WavesIcon className="text-white" size={24} />
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                <CoffeeIcon className="text-white" size={24} />
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                <Utensils className="text-white" size={24} />
              </div>
            </div>
          </div>
        </div>

        <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          {bookingSuccess && (
            <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-xl border border-green-200 flex items-center justify-center animate-fade-in-down">
              <StarIcon className="mr-3 h-5 w-5 text-green-600" fill="currentColor" />
              <span>Booking successful! Your adventure awaits.</span>
            </div>
          )}

       
          <CategoryTabs activeCategory={activeCategory} setActiveCategory={setActiveCategory} />

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <div className="flex justify-between items-center mb-4">
                <p className="text-gray-600 font-medium">
                  {filteredHotels.length} stays found
                </p>
              </div>

              {currentHotels.length === 0 ? (
                <div className="text-center py-16">
                  <MapPinIcon className="mx-auto h-20 w-20 text-blue-200" />
                  <h3 className="text-2xl font-bold text-gray-800 mt-4">No Properties Found</h3>
                  <p className="text-gray-500 mt-2">Try adjusting your filters or selecting another category.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {currentHotels.map((hotel) => (
                    <HotelCard
                      key={hotel.hotel_id}
                      hotel={hotel}
                      onBook={handleBooking}
                      bookedHotels={bookedHotels}
                    />
                  ))}
                </div>
              )}

              {totalPages > 1 && (
                <div className="flex justify-center mt-12">
                  <nav className="flex items-center gap-2">
                    <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="p-2 disabled:opacity-50">
                        <ChevronLeft className="h-6 w-6"/>
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button key={page} onClick={() => paginate(page)} className={`px-3 py-1.5 rounded-lg font-semibold text-sm ${currentPage === page ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}>
                            {page}
                        </button>
                    ))}
                    <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 disabled:opacity-50">
                        <ChevronRight className="h-6 w-6"/>
                    </button>
                  </nav>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <style jsx global>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-10px); max-height: 0; }
          to { opacity: 1; transform: translateY(0); max-height: 1000px; }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        .animate-fade-in-down { animation: fade-in-down 0.5s ease-out forwards; }
        .animate-slide-down { animation: slide-down 0.5s ease-out forwards; overflow: hidden; }
      `}</style>
    </div>
  );
};

export default Carousel;