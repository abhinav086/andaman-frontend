import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config/api';
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
  Waves,
  Mountain,
  Coffee,
  Camera,
  Globe,
  MessageCircle,
  Send
} from 'lucide-react';

const customFontStyle = {
  fontFamily: "'Neue Montreal Regular', sans-serif",
  fontWeight: 600,
  fontStyle: "normal",
};

// Booking Modal Component
const BookingModal = ({ hotel, onClose, onBook }) => {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [roomType, setRoomType] = useState('Deluxe Suite');
  const [specialRequests, setSpecialRequests] = useState('');
  const [loading, setLoading] = useState(false);

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-blue-800">Book {hotel.name}</h3>
          <button 
            onClick={onClose} 
            className="text-blue-500 hover:text-blue-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-blue-800">Check-in Date</label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full p-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-transparent"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1 text-blue-800">Check-out Date</label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full p-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-transparent"
              min={checkIn || new Date().toISOString().split('T')[0]}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1 text-blue-800">Number of Guests</label>
            <select
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="w-full p-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-transparent"
            >
              {[1, 2, 3, 4, 5, 6].map(num => (
                <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1 text-blue-800">Room Type</label>
            <select
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
              className="w-full p-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-transparent"
            >
              <option value="Standard">Standard</option>
              <option value="Deluxe">Deluxe</option>
              <option value="Suite">Suite</option>
              <option value="Deluxe Suite">Deluxe Suite</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1 text-blue-800">Special Requests</label>
            <textarea
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              className="w-full p-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-transparent"
              rows="3"
              placeholder="Any special requests..."
            />
          </div>
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 border border-blue-200 rounded-xl text-blue-700 hover:bg-blue-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleBooking}
            disabled={loading}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-xl disabled:opacity-50 hover:opacity-90 transition-opacity shadow-md"
          >
            {loading ? 'Booking...' : 'Book Now'}
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
        const updatedBookings = bookings.filter(b => b.booking_id !== bookingId);
        setBookings(updatedBookings);
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-auto shadow-xl">
        <div className="p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h3 className="text-xl sm:text-2xl font-bold text-blue-800">My Bookings</h3>
            <button 
              onClick={onClose} 
              className="text-blue-500 hover:text-blue-700 transition-colors"
            >
              <X size={28} />
            </button>
          </div>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="mx-auto h-12 w-12 text-blue-400" />
              <p className="text-blue-600 mt-2">No bookings found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map(booking => (
                <div 
                  key={booking.booking_id} 
                  className="border border-blue-200 rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center hover:shadow-md transition-shadow"
                >
                  <div className="mb-3 md:mb-0">
                    <h4 className="font-bold text-lg text-blue-800">{booking.hotel_name}</h4>
                    <p className="text-sm text-blue-600 flex items-center mt-1">
                      <Clock className="mr-1 h-4 w-4 text-blue-500" />
                      {new Date(booking.check_in_date).toLocaleDateString()} - 
                      {new Date(booking.check_out_date).toLocaleDateString()}
                    </p>
                    <p className="text-sm mt-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        booking.booking_status === 'confirmed' ? 'bg-teal-100 text-teal-800' :
                        booking.booking_status === 'pending' ? 'bg-amber-100 text-amber-800' :
                        'bg-rose-100 text-rose-800'
                      }`}>
                        {booking.booking_status}
                      </span>
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full md:w-auto">
                    {booking.booking_status === 'pending' && (
                      <button 
                        onClick={() => cancelBooking(booking.booking_id)}
                        className="px-4 py-2 bg-gradient-to-r from-rose-500 to-rose-400 text-white rounded-xl text-sm w-full sm:w-auto hover:opacity-90 transition-opacity"
                      >
                        Cancel
                      </button>
                    )}
                    <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-xl text-sm w-full sm:w-auto hover:opacity-90 transition-opacity">
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

// Hotel Card Component
const HotelCard = ({ hotel, onBook, bookedHotels }) => {
  const [showBookingModal, setShowBookingModal] = useState(false);
  const isBooked = bookedHotels.some(b => b.hotel_id === hotel.hotel_id);

  return (
    <div className="bg-white rounded-xl shadow-2xl shadow-blue-200 border border-blue-200 overflow-hidden mb-4 transition-transform hover:scale-[1.02]">
      <div className="relative">
        <img 
          src={hotel.photos && hotel.photos.length > 0 ? hotel.photos[0] : 'https://placehold.co/360x240?text=No+Image'} 
          alt={hotel.name} 
          className="w-full h-48 object-cover" 
        />
        <div className="absolute top-3 left-3 bg-white bg-opacity-90 rounded-full px-2.5 py-1.5 flex items-center">
          <Star className="text-yellow-500 mr-1" size={14} fill="currentColor" />
          <span className="text-xs font-semibold text-blue-800">{hotel.rating || 4.8}</span>
        </div>
        <button className="absolute top-3 right-3 bg-white bg-opacity-90 rounded-full p-2.5 hover:bg-opacity-100 transition-all">
          <Heart className="text-blue-600 hover:text-red-500" size={18} />
        </button>
        {isBooked && (
          <div className="absolute bottom-3 left-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-3 py-1.5 rounded-full text-xs font-medium">
            BOOKED
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start ">
          <div className="mb-2 md:mb-0">
            <h3 className="font-bold text-lg text-blue-800">{hotel.name}</h3>
            <p className="text-blue-600 text-sm flex items-center">
              <MapPin className="mr-1 h-4 w-4 text-blue-500" />
              {hotel.city}, {hotel.country}
            </p>
          </div>
          <div className="text-right">
            <p className="font-bold text-lg text-blue-800">₹{hotel.price || 5000}<span className="font-normal text-sm">/night</span></p>
          </div>
        </div>
        
        <div className="flex items-center mt-2 text-blue-600 text-sm">
          <Star className="text-yellow-500 mr-1" size={14} fill="currentColor" />
          <span>{hotel.rating || 4.8} ({hotel.total_reviews || 100} reviews)</span>
        </div>
        
        <div className="flex flex-wrap gap-3 mt-3 text-blue-600 text-sm">
          <span className="flex items-center">
            <Home className="mr-1.5 h-4 w-4 text-blue-500" />
            {hotel.type || 'Hotel'}
          </span>
          <span className="flex items-center">
            <Users className="mr-1.5 h-4 w-4 text-blue-500" />
            {hotel.distance || '1.2 km to center'}
          </span>
        </div>
        
        <div className="mt-4 flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
          <button 
            className={`py-2.5 rounded-xl font-medium flex-1 transition-all ${
              isBooked 
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-500 to-teal-500 drop-shadow-2xl text-white hover:opacity-90'
            }`}
            onClick={() => !isBooked && setShowBookingModal(true)}
            disabled={isBooked}
          >
            {isBooked ? 'BOOKED' : 'Book Now'}
          </button>
          <button className="px-4 py-2.5 border border-blue-200 rounded-xl text-blue-700 hover:bg-blue-50 hover:text-red-500 transition-colors">
            <Heart className="h-5 w-5 text-blue-600" />
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

// Filter Sidebar Component
const FilterSidebar = ({ filters, setFilters, isMobileFiltersOpen, setIsMobileFiltersOpen }) => {
  const handlePriceChange = (e) => {
    const [min, max] = e.target.value.split('-');
    setFilters(prev => ({ ...prev, priceRange: [min, max] }));
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  return (
    <div className={`w-full md:w-64 pr-0 md:pr-6 mb-6 md:mb-0 ${isMobileFiltersOpen ? 'block' : 'hidden'} md:block`}>
      <div className="bg-gradient-to-r from-blue-500 to-teal-500 rounded-xl shadow-sm border border-blue-300 p-4 sticky top-4 text-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">Filters</h3>
          <button 
            onClick={() => setIsMobileFiltersOpen(false)}
            className="md:hidden text-white hover:text-blue-100"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Price Range */}
        <div className="mb-6">
          <h4 className="font-semibold mb-2">Price Range</h4>
          <div className="space-y-2">
            {[
              { value: "0-5000", label: "Under ₹5,000" },
              { value: "5000-10000", label: "₹5,000 - ₹10,000" },
              { value: "10000-20000", label: "₹10,000 - ₹20,000" },
              { value: "20000-999999", label: "₹20,000+" }
            ].map((range) => (
              <label key={range.value} className="flex items-center">
                <input 
                  type="radio" 
                  name="price" 
                  value={range.value} 
                  checked={filters.priceRange[0] === range.value.split('-')[0] && filters.priceRange[1] === range.value.split('-')[1]}
                  onChange={handlePriceChange}
                  className="mr-3 h-4 w-4 text-blue-300 focus:ring-blue-300 focus:ring-offset-0"
                />
                <span>{range.label}</span>
              </label>
            ))}
          </div>
        </div>
        
        {/* Type of Place */}
        <div className="mb-6">
          <h4 className="font-semibold mb-2">Type of Place</h4>
          <div className="space-y-2">
            {['Entire Place', 'Private Room', 'Shared Room'].map((type) => (
              <label key={type} className="flex items-center">
                <input 
                  type="checkbox" 
                  checked={filters.placeType.includes(type)}
                  onChange={() => {
                    if (filters.placeType.includes(type)) {
                      setFilters(prev => ({
                        ...prev,
                        placeType: prev.placeType.filter(t => t !== type)
                      }));
                    } else {
                      setFilters(prev => ({
                        ...prev,
                        placeType: [...prev.placeType, type]
                      }));
                    }
                  }}
                  className="mr-3 h-4 w-4 text-blue-300 rounded focus:ring-blue-300 focus:ring-offset-0"
                />
                <span>{type}</span>
              </label>
            ))}
          </div>
        </div>
        
        {/* Rooms and Beds */}
        <div className="mb-6">
          <h4 className="font-semibold mb-2">Rooms and Beds</h4>
          <div className="space-y-2">
            {['1', '2', '3+'].map((rooms) => (
              <label key={rooms} className="flex items-center">
                <input 
                  type="checkbox" 
                  checked={filters.rooms.includes(rooms === '3+' ? '3' : rooms)}
                  onChange={() => {
                    const roomValue = rooms === '3+' ? '3' : rooms;
                    if (filters.rooms.includes(roomValue)) {
                      setFilters(prev => ({
                        ...prev,
                        rooms: prev.rooms.filter(r => r !== roomValue)
                      }));
                    } else {
                      setFilters(prev => ({
                        ...prev,
                        rooms: [...prev.rooms, roomValue]
                      }));
                    }
                  }}
                  className="mr-3 h-4 w-4 text-blue-300 rounded focus:ring-blue-300 focus:ring-offset-0"
                />
                <span>{rooms} Room{rooms !== '1' ? 's' : ''}</span>
              </label>
            ))}
          </div>
        </div>
        
        {/* Property Type */}
        <div className="mb-6">
          <h4 className="font-semibold mb-2">Property Type</h4>
          <div className="space-y-2">
            {['Apartment', 'House', 'Villa', 'Hotel'].map((type) => (
              <label key={type} className="flex items-center">
                <input 
                  type="checkbox" 
                  checked={filters.propertyType.includes(type)}
                  onChange={() => {
                    if (filters.propertyType.includes(type)) {
                      setFilters(prev => ({
                        ...prev,
                        propertyType: prev.propertyType.filter(t => t !== type)
                      }));
                    } else {
                      setFilters(prev => ({
                        ...prev,
                        propertyType: [...prev.propertyType, type]
                      }));
                    }
                  }}
                  className="mr-3 h-4 w-4 text-blue-300 rounded focus:ring-blue-300 focus:ring-offset-0"
                />
                <span>{type}</span>
              </label>
            ))}
          </div>
        </div>
        
        {/* Reset Filters */}
        <button 
          className="w-full py-2.5 bg-white/20 backdrop-blur-sm rounded-xl font-medium text-white hover:bg-white/30 transition-colors"
          onClick={() => setFilters({
            priceRange: ['0', '999999'],
            placeType: [],
            rooms: [],
            propertyType: []
          })}
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};

// Category Tabs Component
const CategoryTabs = ({ activeCategory, setActiveCategory }) => {
  const categories = [
    'Cabin', 'Country Side', 'Amazing Views', 'Trending', 'Beachfront', 
    'New', 'Tiny', 'Amazing Pools', 'Design', 'Lake', 'Luxe', 'Mansions'
  ];

  return (
    <div className="flex overflow-x-auto pb-2 mb-6 hide-scrollbar">
      {categories.map((category) => (
        <button
          key={category}
          className={`px-4 py-2.5 mr-2 rounded-full whitespace-nowrap font-medium transition-all ${
            activeCategory === category
              ? 'bg-gradient-to-r from-blue-500 to-teal-500 text-white shadow-md'
              : 'bg-white text-blue-700 hover:bg-blue-50 border border-blue-200'
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
  const hotelsPerPage = 6;

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`${API_BASE_URL}/api/hotels`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const result = await response.json();
          setHotels(result.hotels || []);
        } else {
          console.error('Failed to fetch hotels');
          setApiError('Failed to fetch hotels');
        }
      } catch (error) {
        console.error('Error fetching hotels:', error);
        setApiError('Network error occurred');
      } finally {
        setLoading(false);
      }
    };

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
          setBookedHotels(data.bookings || []);
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchHotels();
    fetchBookings();
  }, []);

  const handleBooking = (booking) => {
    setBookingSuccess(booking);
    setBookedHotels(prev => [...prev, booking]);
    setTimeout(() => setBookingSuccess(null), 5000);
  };

  // Filter hotels based on filters
  const filteredHotels = hotels.filter(hotel => {
    const [minPrice, maxPrice] = filters.priceRange;
    const price = hotel.price || 0;
    
    const matchesPrice = price >= parseInt(minPrice) && price <= parseInt(maxPrice);
    const matchesPlaceType = filters.placeType.length === 0 || filters.placeType.includes(hotel.type || '');
    const matchesRooms = filters.rooms.length === 0 || filters.rooms.includes(hotel.rooms?.toString() || '');
    const matchesPropertyType = filters.propertyType.length === 0 || filters.propertyType.includes(hotel.property_type || '');
    
    return matchesPrice && matchesPlaceType && matchesRooms && matchesPropertyType;
  });

  // Pagination
  const indexOfLastHotel = currentPage * hotelsPerPage;
  const indexOfFirstHotel = indexOfLastHotel - hotelsPerPage;
  const currentHotels = filteredHotels.slice(indexOfFirstHotel, indexOfLastHotel);
  const totalPages = Math.ceil(filteredHotels.length / hotelsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

 if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-cyan-50 flex justify-center items-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-blue-700">Loading your travel options...</p>
        </div>
      </div>
    );
  }

  if (apiError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-cyan-50 flex justify-center items-center">
        <div className="text-center p-6 bg-white rounded-xl shadow-lg max-w-md">
          <div className="text-blue-500 mb-4">
            <MapPin className="mx-auto h-12 w-12" />
          </div>
          <h3 className="text-xl font-bold text-blue-800 mb-2">Oops! Something went wrong</h3>
          <p className="text-blue-600 mb-4">{apiError}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-cyan-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Message */}
        {bookingSuccess && (
          <div className="mb-6 p-4 bg-gradient-to-r from-teal-100 to-emerald-100 text-teal-800 rounded-xl shadow-sm border border-teal-200 flex items-center">
            <Star className="mr-2 h-5 w-5 text-teal-600" fill="currentColor" />
            <span>Booking successful! Reference: {bookingSuccess.booking_reference}</span>
          </div>
        )}

        {/* Header with Video Background */}
        <div className="relative w-full h-[50vh] min-h-[300px] max-h-[600px] mb-8 rounded-2xl overflow-hidden">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute top-0 left-0 w-full h-full object-cover z-0"
          >
            <source src="https://www.pexels.com/video/a-boat-with-blue-sails-and-a-blue-sky-28211626/" type="video/mp4" />
            {/* Fallback image if video fails */}
            <img src="https://images.pexels.com/videos/9112855/pexels-photo-9112855.jpeg?auto=compress&cs=tinysrgb&w=1600&loading=lazy" alt="Cabin" />
          </video>

          {/* Dark overlay for better text contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10"></div>

          {/* Text on top */}
          <div className="relative z-20 flex flex-col items-center justify-end h-full pb-12 px-4 text-center">
            <h1
              style={customFontStyle}
              className="text-5xl md:text-7xl lg:text-8xl font-bold text-white drop-shadow-lg"
            >
              Stays in {activeCategory}
            </h1>
            <p
              style={customFontStyle}
              className="text-xl md:text-3xl lg:text-4xl text-white mt-4 drop-shadow-md"
            >
              Discover your perfect getaway
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <button 
              onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
              className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-xl w-full sm:w-auto shadow-md flex items-center justify-center"
            >
              <Filter className="mr-2 h-4 w-4" />
              {isMobileFiltersOpen ? 'Hide Filters' : 'Show Filters'}
            </button>
            <button 
              onClick={() => setShowMyBookings(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl w-full sm:w-auto flex items-center justify-center"
            >
              <BookOpen className="mr-2 h-4 w-4" />
              My Bookings
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <CategoryTabs activeCategory={activeCategory} setActiveCategory={setActiveCategory} />

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filter Sidebar */}
          <FilterSidebar 
            filters={filters} 
            setFilters={setFilters} 
            isMobileFiltersOpen={isMobileFiltersOpen}
            setIsMobileFiltersOpen={setIsMobileFiltersOpen}
          />

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-4">
              <p className="text-blue-600 font-medium">
                {filteredHotels.length} stays · {activeCategory}
              </p>
            </div>

            {/* Hotel Grid */}
            {currentHotels.length === 0 ? (
              <div className="text-center py-12">
                <MapPin className="mx-auto h-16 w-16 text-blue-400" />
                <h3 className="text-xl font-bold text-blue-800 mt-4">No properties found</h3>
                <p className="text-blue-600 mt-2">Try adjusting your filters</p>
                <button 
                  onClick={() => setFilters({
                    priceRange: ['0', '999999'],
                    placeType: [],
                    rooms: [],
                    propertyType: []
                  })}
                  className="mt-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-lg"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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

            {/* Pagination */}
            {totalPages > 1 && currentHotels.length > 0 && (
              <div className="flex justify-center mt-8">
                <div className="flex flex-wrap gap-2 justify-center">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2.5 rounded-xl flex items-center ${
                      currentPage === 1 
                        ? 'bg-blue-200 text-blue-400 cursor-not-allowed' 
                        : 'bg-white text-blue-700 hover:bg-blue-50 border border-blue-200'
                    }`}
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, index) => {
                    let page;
                    if (totalPages <= 5) {
                      page = index + 1;
                    } else {
                      if (currentPage <= 3) {
                        page = index + 1;
                      } else if (currentPage >= totalPages - 2) {
                        page = totalPages - 4 + index;
                      } else {
                        page = currentPage - 2 + index;
                      }
                    }
                    return (
                      <button
                        key={page}
                        onClick={() => paginate(page)}
                        className={`px-4 py-2.5 rounded-xl ${
                          currentPage === page
                            ? 'bg-gradient-to-r from-blue-500 to-teal-500 text-white'
                            : 'bg-white text-blue-700 hover:bg-blue-50 border border-blue-200'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2.5 rounded-xl flex items-center ${
                      currentPage === totalPages 
                        ? 'bg-blue-200 text-blue-400 cursor-not-allowed' 
                        : 'bg-white text-blue-700 hover:bg-blue-50 border border-blue-200'
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* My Bookings Modal */}
      {showMyBookings && (
        <MyBookingsModal onClose={() => setShowMyBookings(false)} />
      )}
      
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