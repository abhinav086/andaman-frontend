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
  Waves as WavesIcon
} from 'lucide-react';

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

// Booking Modal Component - FIXED
const BookingModal = ({ hotel, onClose, onBook }) => {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [roomType, setRoomType] = useState('Deluxe Suite');
  const [specialRequests, setSpecialRequests] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleBooking = async () => {
    if (!checkIn || !checkOut) {
      alert('Please select check-in and check-out dates');
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
          total_amount: hotel.price || 10000,
          special_requests: specialRequests
        })
      });

      if (response.ok) {
        const data = await response.json();
        onBook(data.booking);
        onClose();
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

  return (
    <div 
      style={customFontStyle} 
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-blue-900">Book Your Stay</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"/>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 transition"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"/>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 transition"
              min={checkIn || new Date().toISOString().split('T')[0]}
            />
          </div>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"/>
            <select
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="w-full pl-10 p-3 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-blue-400 transition bg-white"
            >
              {[1, 2, 3, 4, 5, 6].map(num => (
                <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
              ))}
            </select>
          </div>
          <div className="relative">
            <BedDouble className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"/>
            <select
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
              className="w-full pl-10 p-3 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-blue-400 transition bg-white"
            >
              <option value="Standard">Standard</option>
              <option value="Deluxe">Deluxe</option>
              <option value="Suite">Suite</option>
              <option value="Deluxe Suite">Deluxe Suite</option>
            </select>
          </div>
          <div>
            <textarea
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 transition"
              rows="3"
              placeholder="Any special requests..."
            />
          </div>
        </div>
        
        <div className="mt-8 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleBooking}
            disabled={loading}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-lg disabled:opacity-50 hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/30 font-semibold"
          >
            {loading ? 'Booking...' : 'Confirm Booking'}
          </button>
        </div>
      </div>
    </div>
  );
};

// My Bookings Modal Component
const MyBookingsModal = ({ onClose }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`${API_BASE_URL}/api/bookings/hotel/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setBookings(data.bookings || []);
        } else {
          console.error('Failed to fetch bookings');
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const cancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_BASE_URL}/api/bookings/hotel/${bookingId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        setBookings(bookings.filter(b => b.booking_id !== bookingId));
        alert('Booking cancelled successfully');
      } else {
        const error = await response.json();
        alert(`Cancellation failed: ${error.msg || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Cancellation error:', error);
      alert('Network error occurred');
    }
  };

  return (
    <div style={customFontStyle} className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold text-blue-900">My Bookings</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X size={28} />
            </button>
          </div>
        </div>
        
        <div className="overflow-auto p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="mx-auto h-16 w-16 text-blue-300" />
              <p className="text-blue-700 mt-4 text-lg">You have no bookings yet.</p>
              <p className="text-gray-500 mt-1">Time to plan your next adventure!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map(booking => (
                <div 
                  key={booking.booking_id} 
                  className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center hover:shadow-md hover:border-blue-300 transition-all duration-300"
                >
                  <div className="mb-3 md:mb-0 flex-grow">
                    <h4 className="font-bold text-lg text-blue-800">{booking.hotel_name}</h4>
                    <p className="text-sm text-gray-600 flex items-center mt-1">
                      <Calendar className="mr-2 h-4 w-4 text-blue-500" />
                      {new Date(booking.check_in_date).toLocaleDateString()} - 
                      {new Date(booking.check_out_date).toLocaleDateString()}
                    </p>
                    <p className="text-sm mt-2">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        booking.booking_status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        booking.booking_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {booking.booking_status.charAt(0).toUpperCase() + booking.booking_status.slice(1)}
                      </span>
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-stretch gap-2 w-full md:w-auto">
                    {booking.booking_status === 'pending' && (
                      <button 
                        onClick={() => cancelBooking(booking.booking_id)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm w-full sm:w-auto hover:bg-red-600 transition-colors font-semibold"
                      >
                        Cancel
                      </button>
                    )}
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm w-full sm:w-auto hover:bg-gray-100 transition-colors font-semibold">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Hotel Card Component - FIXED
const HotelCard = ({ hotel, onBook, bookedHotels }) => {
  const [showBookingModal, setShowBookingModal] = useState(false);
  const isBooked = bookedHotels.some(b => b.hotel_id === hotel.hotel_id);

  const handleBookingClick = (e) => {
    e.stopPropagation();
    if (!isBooked) setShowBookingModal(true);
  };

  return (
    <div style={customFontStyle} className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="relative">
        <img 
          src={hotel.photos && hotel.photos.length > 0 ? hotel.photos[0] : 'https://placehold.co/400x200?text=No+Image'} 
          alt={hotel.name} 
          className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105" 
        />
        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center text-xs font-semibold text-gray-800">
          <Star className="text-yellow-500 mr-1" size={12} fill="currentColor" />
          <span>{hotel.rating || 4.8}</span>
        </div>
        <div className="absolute top-2 right-2 bg-black/50 text-white rounded-lg px-2.5 py-1 text-xs font-bold">
          ₹{hotel.price || 5000}
        </div>
        <button className="absolute top-8 right-2 bg-white/90 backdrop-blur-sm rounded-full p-2 transition-all opacity-0 group-hover:opacity-100 group-hover:top-2">
          <Heart className="text-gray-600 hover:text-red-500 hover:fill-red-500 transition-colors" size={16} />
        </button>
      </div>
      
      <div className="p-3">
        <h3 className="font-bold text-base text-gray-800 truncate">{hotel.name}</h3>
        <p className="text-gray-500 text-xs flex items-center mt-1">
          <MapPin className="mr-1 h-3 w-3" />
          {hotel.city}, {hotel.country}
        </p>
        
        <div className="flex items-center mt-2 text-gray-600 text-xs">
          <span className="flex items-center mr-3">
            <Home className="mr-1 h-3 w-3 text-blue-500" />
            {hotel.type || 'Hotel'}
          </span>
          <span className="flex items-center">
            <Users className="mr-1 h-3 w-3 text-blue-500" />
            4 Guests
          </span>
        </div>
        
        <div className="mt-3">
          <button 
            className={`w-full py-2 rounded-lg flex items-center justify-center gap-2 font-semibold text-sm transition-all ${
              isBooked 
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                : 'bg-[#221b4d] text-white shadow-lg shadow-zinc-500/30 hover:opacity-90'
            }`}
            onClick={handleBookingClick}
            disabled={isBooked}
          >
            {isBooked ? 'Booked' : 'Book Now'}
            <Heart 
              className="text-red-500 fill-red-500" 
              size={16} 
            />
          </button>
        </div>
      </div>

      {showBookingModal && (
        <BookingModal 
          hotel={hotel}
          onClose={() => setShowBookingModal(false)}
          onBook={onBook}
        />
      )}
    </div>
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
    const price = hotel.price || 0;
    
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
          <MapPin className="mx-auto h-16 w-16 text-red-400" />
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
              <Star className="mr-3 h-5 w-5 text-green-600" fill="currentColor" />
              <span>Booking successful! Your adventure awaits.</span>
            </div>
          )}

          <div className="flex justify-between items-center mb-6 gap-4">
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg shadow-sm flex items-center justify-center lg:hidden"
              >
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </button>
            
            </div>
          </div>
          
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
                  <MapPin className="mx-auto h-20 w-20 text-blue-200" />
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
      
      {showMyBookings && <MyBookingsModal onClose={() => setShowMyBookings(false)} />}
      
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