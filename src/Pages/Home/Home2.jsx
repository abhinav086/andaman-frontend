import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config/api';

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
          total_amount: hotel.price || 10000, // fallback price
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
      <div className="bg-white rounded-2xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Book {hotel.name}</h3>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Check-in Date</label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full p-2 border rounded-lg"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Check-out Date</label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full p-2 border rounded-lg"
              min={checkIn || new Date().toISOString().split('T')[0]}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Number of Guests</label>
            <select
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="w-full p-2 border rounded-lg"
            >
              {[1, 2, 3, 4, 5, 6].map(num => (
                <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Room Type</label>
            <select
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
              className="w-full p-2 border rounded-lg"
            >
              <option value="Standard">Standard</option>
              <option value="Deluxe">Deluxe</option>
              <option value="Suite">Suite</option>
              <option value="Deluxe Suite">Deluxe Suite</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Special Requests</label>
            <textarea
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              className="w-full p-2 border rounded-lg"
              rows="3"
              placeholder="Any special requests..."
            />
          </div>
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleBooking}
            disabled={loading}
            className="px-4 py-2 bg-yellow-400 rounded-lg disabled:opacity-50"
          >
            {loading ? 'Booking...' : 'Book Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

// My Bookings Modal Component - Updated for mobile responsiveness
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
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-auto">
        <div className="p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h3 className="text-xl sm:text-2xl font-bold">My Bookings</h3>
            <button 
              onClick={onClose} 
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ✕
            </button>
          </div>
          
          {loading ? (
            <div className="text-center py-8">Loading bookings...</div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No bookings found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map(booking => (
                <div 
                  key={booking.booking_id} 
                  className="border rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center"
                >
                  <div className="mb-3 md:mb-0">
                    <h4 className="font-bold text-lg">{booking.hotel_name}</h4>
                    <p className="text-sm text-gray-600">
                      {new Date(booking.check_in_date).toLocaleDateString()} - 
                      {new Date(booking.check_out_date).toLocaleDateString()}
                    </p>
                    <p className="text-sm mt-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        booking.booking_status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        booking.booking_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {booking.booking_status}
                      </span>
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full md:w-auto">
                    {booking.booking_status === 'pending' && (
                      <button 
                        onClick={() => cancelBooking(booking.booking_id)}
                        className="px-3 py-2 bg-red-500 text-white rounded-lg text-sm w-full sm:w-auto"
                      >
                        Cancel
                      </button>
                    )}
                    <button className="px-3 py-2 bg-blue-500 text-white rounded-lg text-sm w-full sm:w-auto">
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

// Hotel Card Component - Updated to match reference UI
const HotelCard = ({ hotel, onBook, bookedHotels }) => {
  const [showBookingModal, setShowBookingModal] = useState(false);
  const isBooked = bookedHotels.some(b => b.hotel_id === hotel.hotel_id);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-4">
      <div className="relative">
        <img 
          src={hotel.photos && hotel.photos.length > 0 ? hotel.photos[0] : 'https://placehold.co/360x240?text=No+Image'} 
          alt={hotel.name} 
          className="w-full h-48 object-cover" 
        />
        <div className="absolute top-2 left-2 bg-white bg-opacity-90 rounded-full px-2 py-1 text-xs font-semibold">
          {hotel.rating || 4.8} ★
        </div>
        <button className="absolute top-2 right-2 bg-white bg-opacity-90 rounded-full p-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 006.364 6.364L12 14.318l1.318 1.318a4.5 4.5 0 006.364-6.364L12 12l-1.318-1.318a4.5 4.5 0 00-6.364 6.364L12 18l1.318 1.318a4.5 4.5 0 006.364-6.364L12 18l1.318 1.318a4.5 4.5 0 006.364-6.364L12 18l1.318 1.318a4.5 4.5 0 006.364-6.364L12 18l1.318 1.318a4.5 4.5 0 006.364-6.364L12 18l1.318 1.318a4.5 4.5 0 006.364-6.364L12 18l1.318 1.318a4.5 4.5 0 006.364-6.364L12 18l1.318 1.318a4.5 4.5 0 006.364-6.364L12 18l1.318 1.318a4.5 4.5 0 006.364-6.364L12 18l1.318 1.318a4.5 4.5 0 006.364-6.364L12 18l1.318 1.318a4.5 4.5 0 006.364-6.364L12 18l1.318 1.318a4.5 4.5 0 006.364-6.364L12 18l1.318 1.318a4.5 4.5 0 006.364-6.364L12 18l1.318 1.31......" />
          </svg>
        </button>
        {isBooked && (
          <div className="absolute bottom-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs">
            BOOKED
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start">
          <div className="mb-2 md:mb-0">
            <h3 className="font-bold text-lg">{hotel.name}</h3>
            <p className="text-gray-600 text-sm">{hotel.city}, {hotel.country}</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-lg">₹{hotel.price || 5000}<span className="font-normal text-sm"> night</span></p>
          </div>
        </div>
        
        <div className="flex items-center mt-2 text-gray-600 text-sm">
          <span className="mr-2">★ {hotel.rating || 4.8}</span>
          <span>({hotel.total_reviews || 100} reviews)</span>
        </div>
        
        <div className="flex flex-wrap gap-3 mt-3 text-gray-600 text-sm">
          <span className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            {hotel.type || 'Hotel'}
          </span>
          <span className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {hotel.distance || '1.2 km to center'}
          </span>
        </div>
        
        <div className="mt-4 flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
          <button 
            className={`py-2 rounded-lg font-medium ${
              isBooked 
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                : 'bg-yellow-400 hover:bg-yellow-500 text-gray-900'
            }`}
            onClick={() => !isBooked && setShowBookingModal(true)}
            disabled={isBooked}
          >
            {isBooked ? 'BOOKED' : 'Book Now'}
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
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

// Filter Sidebar Component - Updated with toggle functionality
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <h3 className="font-bold text-lg mb-4">Filters</h3>
        
        {/* Price Range */}
        <div className="mb-6">
          <h4 className="font-semibold mb-2">Price Range</h4>
          <div className="space-y-2">
            <label className="flex items-center">
              <input 
                type="radio" 
                name="price" 
                value="0-5000" 
                checked={filters.priceRange[0] === '0' && filters.priceRange[1] === '5000'}
                onChange={handlePriceChange}
                className="mr-2"
              />
              Under ₹5,000
            </label>
            <label className="flex items-center">
              <input 
                type="radio" 
                name="price" 
                value="5000-10000" 
                checked={filters.priceRange[0] === '5000' && filters.priceRange[1] === '10000'}
                onChange={handlePriceChange}
                className="mr-2"
              />
              ₹5,000 - ₹10,000
            </label>
            <label className="flex items-center">
              <input 
                type="radio" 
                name="price" 
                value="10000-20000" 
                checked={filters.priceRange[0] === '10000' && filters.priceRange[1] === '20000'}
                onChange={handlePriceChange}
                className="mr-2"
              />
              ₹10,000 - ₹20,000
            </label>
            <label className="flex items-center">
              <input 
                type="radio" 
                name="price" 
                value="20000-999999" 
                checked={filters.priceRange[0] === '20000' && filters.priceRange[1] === '999999'}
                onChange={handlePriceChange}
                className="mr-2"
              />
              ₹20,000+
            </label>
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
                  className="mr-2"
                />
                {type}
              </label>
            ))}
          </div>
        </div>
        
        {/* Rooms and Beds */}
        <div className="mb-6">
          <h4 className="font-semibold mb-2">Rooms and Beds</h4>
          <div className="space-y-2">
            <label className="flex items-center">
              <input 
                type="checkbox" 
                checked={filters.rooms.includes('1')}
                onChange={() => handleFilterChange('rooms', filters.rooms.includes('1') ? filters.rooms.filter(r => r !== '1') : [...filters.rooms, '1'])}
                className="mr-2"
              />
              1 Room
            </label>
            <label className="flex items-center">
              <input 
                type="checkbox" 
                checked={filters.rooms.includes('2')}
                onChange={() => handleFilterChange('rooms', filters.rooms.includes('2') ? filters.rooms.filter(r => r !== '2') : [...filters.rooms, '2'])}
                className="mr-2"
              />
              2 Rooms
            </label>
            <label className="flex items-center">
              <input 
                type="checkbox" 
                checked={filters.rooms.includes('3')}
                onChange={() => handleFilterChange('rooms', filters.rooms.includes('3') ? filters.rooms.filter(r => r !== '3') : [...filters.rooms, '3'])}
                className="mr-2"
              />
              3+ Rooms
            </label>
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
                  className="mr-2"
                />
                {type}
              </label>
            ))}
          </div>
        </div>
        
        {/* Reset Filters */}
        <button 
          className="w-full py-2 bg-gray-100 rounded-lg font-medium"
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
          className={`px-4 py-2 mr-2 rounded-full whitespace-nowrap ${
            activeCategory === category
              ? 'bg-black text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
    // Update booked hotels
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
    return <div className="flex justify-center items-center h-screen bg-gray-50">Loading hotels...</div>;
  }

  if (apiError) {
    return <div className="flex justify-center items-center h-screen bg-gray-50 text-red-500">Error: {apiError}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Message */}
        {bookingSuccess && (
          <div className="mb-4 p-4 bg-green-100 text-green-800 rounded-lg">
            Booking successful! Reference: {bookingSuccess.booking_reference}
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-2xl font-bold mb-4 sm:mb-0">Stays in {activeCategory}</h1>
          <div className="flex space-x-2 w-full sm:w-auto">
            <button 
              onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg w-full sm:w-auto"
            >
              {isMobileFiltersOpen ? 'Hide Filters' : 'Show Filters'}
            </button>
            <button 
              onClick={() => setShowMyBookings(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg w-full sm:w-auto"
            >
              My Bookings
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <CategoryTabs activeCategory={activeCategory} setActiveCategory={setActiveCategory} />

        <div className="flex flex-col lg:flex-row">
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
              <p className="text-gray-600">
                {filteredHotels.length} stays · {activeCategory}
              </p>
            </div>

            {/* Hotel Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentHotels.map((hotel) => (
                <HotelCard 
                  key={hotel.hotel_id} 
                  hotel={hotel} 
                  onBook={handleBooking}
                  bookedHotels={bookedHotels}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex flex-wrap gap-2 justify-center">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-lg ${
                      currentPage === 1 ? 'bg-gray-200 text-gray-400' : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, index) => {
                    const page = index + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => paginate(page)}
                        className={`px-4 py-2 rounded-lg ${
                          currentPage === page
                            ? 'bg-black text-white'
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-lg ${
                      currentPage === totalPages ? 'bg-gray-200 text-gray-400' : 'bg-gray-100 hover:bg-gray-200'
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