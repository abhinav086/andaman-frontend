import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Search, 
  MapPin, 
  Star, 
  Calendar, 
  Users, 
  X, 
  ChevronLeft, 
  ChevronRight,
  Clock,
  CheckCircle,
  AlertCircle,
  Filter,
  Heart,
  Coffee,
  Waves,
  Mountain,
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

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { API_BASE_URL } from '../../config/api';

// Zod schema for booking form validation
const bookingSchema = z.object({
  date: z.string().min(1, "Date is required"),
  participants: z.number().min(1, "At least 1 participant required").max(20, "Maximum 20 participants"),
  specialRequests: z.string().max(500, "Special requests must be less than 500 characters").optional()
});

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    destination: '',
    minPrice: 0,
    maxPrice: 100000
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [bookings, setBookings] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [view, setView] = useState('activities');
  const [myBookingsLoading, setMyBookingsLoading] = useState(false);

  const navigate = useNavigate();

  // Helper function to handle authentication errors
  const handleAuthError = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    alert('Your session has expired. Please log in again.');
    navigate('/login');
  };

  // Helper function to check if user is authenticated
  const isAuthenticated = () => {
    const token = localStorage.getItem('accessToken');
    return !!token;
  };

  // Fetch activities (public - no auth required)
  useEffect(() => {
    if (view !== 'activities') return;
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/activities`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch activities: ${response.status}`);
        }
        
        const data = await response.json();
        setActivities(data.data?.activities || []);
        setFilteredActivities(data.data?.activities || []);
        const total = data.data?.pagination?.total || data.data?.activities?.length || 0;
        setTotalPages(Math.ceil(total / 6));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, [view]);

  // Fetch user bookings (requires authentication)
  useEffect(() => {
    if (view !== 'my-bookings') return;
    const fetchBookings = async () => {
      try {
        setMyBookingsLoading(true);
        const token = localStorage.getItem('accessToken');
        
        if (!token) {
          handleAuthError();
          return;
        }
        
        const response = await fetch(`${API_BASE_URL}/api/activities/bookings`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.status === 401 || response.status === 403) {
          handleAuthError();
          return;
        }
        
        if (!response.ok) {
          throw new Error(`Failed to fetch bookings: ${response.status}`);
        }
        
        const data = await response.json();
        setBookings(data.data?.bookings || []);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError(err.message);
      } finally {
        setMyBookingsLoading(false);
      }
    };
    fetchBookings();
  }, [view]);

  // Apply filters and search for activities
  useEffect(() => {
    if (view !== 'activities') return;
    let result = activities;

    if (searchQuery) {
      result = result.filter(activity => 
        activity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.destination.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filters.category) {
      result = result.filter(activity => 
        activity.category.toLowerCase() === filters.category.toLowerCase()
      );
    }
    
    if (filters.destination) {
      result = result.filter(activity => 
        activity.destination.toLowerCase().includes(filters.destination.toLowerCase())
      );
    }
    
    result = result.filter(activity => 
      activity.price >= filters.minPrice && activity.price <= filters.maxPrice
    );

    setFilteredActivities(result);
    setTotalPages(Math.ceil(result.length / 6));
    setCurrentPage(1);
  }, [searchQuery, filters, activities, view]);

  // Pagination for activities
  const startIndex = (currentPage - 1) * 6;
  const currentActivities = filteredActivities.slice(startIndex, startIndex + 6);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(e.target.search.value);
  };

  // Handle filter change
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      category: '',
      destination: '',
      minPrice: 0,
      maxPrice: 100000
    });
    setSearchQuery('');
  };

  // Handle booking form submission
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(bookingSchema)
  });

  const onSubmitBooking = async (data) => {
    try {
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        alert('Please log in to make a booking');
        navigate('/login');
        return;
      }
      
      const response = await fetch(`${API_BASE_URL}/api/activities/bookings`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          activity_id: selectedActivity.activity_id,
          activity_date: data.date,
          participants_count: data.participants,
          total_amount: selectedActivity.price * data.participants,
          special_requests: data.specialRequests
        })
      });

      if (response.status === 401 || response.status === 403) {
        handleAuthError();
        return;
      }

      if (response.ok) {
        alert('Booking created successfully!');
        setShowBookingModal(false);
        reset();
        
        // Refresh bookings if on my-bookings view
        if (view === 'my-bookings') {
          const updatedResponse = await fetch(`${API_BASE_URL}/api/activities/bookings`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (updatedResponse.ok) {
            const updatedData = await updatedResponse.json();
            setBookings(updatedData.data?.bookings || []);
          }
        }
      } else {
        const error = await response.json();
        alert(`Booking failed: ${error.message || 'Unknown error'}`);
      }
    } catch (err) {
      alert('Network error occurred');
    }
  };

  // Handle booking cancellation
  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    try {
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        handleAuthError();
        return;
      }
      
      const response = await fetch(`${API_BASE_URL}/api/activities/bookings/${bookingId}/cancel`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.status === 401 || response.status === 403) {
        handleAuthError();
        return;
      }

      if (response.ok) {
        const result = await response.json();
        setBookings(prev => prev.map(booking => 
          booking.booking_id === bookingId 
            ? { ...booking, booking_status: result.data.booking_status } 
            : booking
        ));
        alert('Booking cancelled successfully');
      } else {
        const error = await response.json();
        alert(`Cancellation failed: ${error.message || 'Unknown error'}`);
      }
    } catch (err) {
      alert('Network error occurred');
    }
  };

  const switchToMyBookings = () => {
    if (!isAuthenticated()) {
      alert('Please log in to view your bookings');
      navigate('/login');
      return;
    }
    setView('my-bookings');
  };

  const switchToActivities = () => {
    setView('activities');
  };

  const filteredBookings = bookings.filter(booking => {
    if (activeTab === 'upcoming') return booking.booking_status === 'confirmed' || booking.booking_status === 'pending';
    if (activeTab === 'past') return booking.booking_status === 'completed';
    return booking.booking_status === 'cancelled';
  });

  // --- Render Logic ---
  if (view === 'activities') {
    if (loading) return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-400"></div>
      </div>
    );

    if (error) return (
      <div className="text-center py-10">
        <AlertCircle className="mx-auto h-12 w-12 text-rose-500" />
        <p className="mt-2 text-rose-500">Error: {error}</p>
      </div>
    );

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-cyan-50 py-8 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse-slow"></div>
          <div className="absolute top-40 -right-40 w-80 h-80 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse-slow animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse-slow animation-delay-4000"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header with My Bookings Button */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h2 style={customFontStyle} className="text-4xl md:text-8xl font-bold text-blue-800">
              Activities to <span className='text-teal-500'>Enjoy</span>
            </h2>
            <Button
              onClick={switchToMyBookings}
              variant="outline"
              className="bg-blue-500 hover:bg-blue-600 text-white border-blue-500 hover:border-blue-600"
            >
              My Bookings
            </Button>
          </div>
          
          {/* Search and Filters Section */}
          <div className="mb-8">
            <form onSubmit={handleSearch} className="mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 h-4 w-4" />
                  <Input
                    name="search"
                    placeholder="Search activities..."
                    className="pl-10 border-blue-200 focus:ring-blue-300 focus:border-blue-300"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
                  Search
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="md:hidden flex items-center border-blue-200 text-blue-700 hover:bg-blue-50"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>
            </form>

            {/* Filters Panel */}
            <motion.div 
              className={`bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-sm mb-6 border border-blue-100 ${
                showFilters ? 'block' : 'hidden md:block'
              }`}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-blue-800 mb-1">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full p-2 border border-blue-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
                  >
                    <option value="">All Categories</option>
                    <option value="adventure">Adventure</option>
                    <option value="nature">Nature</option>
                    <option value="cultural">Cultural</option>
                    <option value="food">Food</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-blue-800 mb-1">Destination</label>
                  <Input
                    value={filters.destination}
                    onChange={(e) => handleFilterChange('destination', e.target.value)}
                    placeholder="Enter destination"
                    className="w-full border-blue-200 focus:ring-blue-300 focus:border-blue-300"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-blue-800 mb-1">Price Range</label>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-black">₹{filters.minPrice}</span>
                    <input
                      type="range"
                      min="0"
                      max="100000"
                      step="100"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', Number(e.target.value))}
                      className="w-full accent-blue-500"
                    />
                    <span className="text-xs text-blue-600">₹{filters.maxPrice}</span>
                  </div>
                </div>
                
                <div className="flex items-end">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={resetFilters}
                    className="w-full border-blue-200 text-blue-700 hover:bg-blue-50"
                  >
                    Reset Filters
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Activities List */}
          {filteredActivities.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-blue-600">No activities found. Try adjusting your filters.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {currentActivities.map((activity) => (
                  <motion.div
                    key={activity.activity_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ y: -5 }}
                  >
                    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border border-blue-100 bg-white/70 backdrop-blur-sm">
                      <div className="relative">
                        <img 
                          src={activity.photos?.[0] || 'https://placehold.co/400x200?text=Activity+Image'} 
                          alt={activity.name} 
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center shadow-sm">
                          <Star className="h-4 w-4 text-amber-500 fill-current" />
                          <span className="ml-1 text-sm font-medium text-amber-700">{activity.average_rating || '4.8'}</span>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-lg text-blue-800">{activity.name}</h3>
                            <div className="flex items-center text-blue-600 mt-1">
                              <MapPin className="h-4 w-4 mr-1 text-blue-500" />
                              <span className="text-sm">{activity.destination}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg text-teal-700">₹{activity.price}</p>
                            <p className="text-xs text-teal-600">per person</p>
                          </div>
                        </div>
                        
                        <p className="text-blue-700 text-sm mt-2 line-clamp-2">
                          {activity.description}
                        </p>
                        
                        <div className="mt-4 flex justify-between items-center">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate(`/activities/${activity.activity_id}`)}
                            className="border-blue-200 text-blue-700 hover:bg-blue-50"
                          >
                            View Details
                          </Button>
                          <Button 
                            size="sm"
                            onClick={() => {
                              if (!isAuthenticated()) {
                                alert('Please log in to book an activity');
                                navigate('/login');
                                return;
                              }
                              setSelectedActivity(activity);
                              setShowBookingModal(true);
                            }}
                            className="bg-teal-500  hover:bg-teal-600"
                          >
                            Book Now
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-8">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-full ${
                      currentPage === 1 
                        ? 'text-blue-200 cursor-not-allowed' 
                        : 'text-blue-600 hover:bg-blue-100'
                    }`}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        currentPage === page 
                          ? 'bg-blue-500 text-white' 
                          : 'text-blue-700 hover:bg-blue-100'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-full ${
                      currentPage === totalPages 
                        ? 'text-blue-200 cursor-not-allowed' 
                        : 'text-blue-600 hover:bg-blue-100'
                    }`}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Booking Modal */}
        {showBookingModal && selectedActivity && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl border border-blue-100"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-blue-800">Book {selectedActivity.name}</h3>
                <button 
                  onClick={() => setShowBookingModal(false)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit(onSubmitBooking)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-blue-800 mb-1">Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 h-4 w-4" />
                    <input
                      type="date"
                      {...register('date')}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full pl-10 p-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
                    />
                  </div>
                  {errors.date && <p className="text-blue-500 text-sm mt-1">{errors.date.message}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-blue-800 mb-1">Number of Participants</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 h-4 w-4" />
                    <input
                      type="number"
                      {...register('participants', { valueAsNumber: true })}
                      min="1"
                      max="20"
                      defaultValue={1}
                      className="w-full pl-10 p-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
                    />
                  </div>
                  {errors.participants && <p className="text-blue-500 text-sm mt-1">{errors.participants.message}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-blue-800 mb-1">Special Requests</label>
                  <textarea
                    {...register('specialRequests')}
                    rows="3"
                    placeholder="Any special requests..."
                    className="w-full p-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
                  ></textarea>
                  {errors.specialRequests && <p className="text-blue-500 text-sm mt-1">{errors.specialRequests.message}</p>}
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowBookingModal(false)}
                    className="border-blue-200 text-blue-700 hover:bg-blue-50"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-teal-500 hover:bg-teal-600">
                    Book Activity
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    );
  } else if (view === 'my-bookings') {
    if (myBookingsLoading) return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-400"></div>
      </div>
    );

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-cyan-50 py-8 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse-slow"></div>
          <div className="absolute top-40 -right-40 w-80 h-80 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse-slow animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse-slow animation-delay-4000"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header with Back Button */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-blue-800">My Bookings</h1>
            <Button
              onClick={switchToActivities}
              variant="outline"
              className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600 hover:border-blue-700"
            >
              Back to Activities
            </Button>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="grid w-full grid-cols-3 bg-white/70 backdrop-blur-sm border border-blue-100 p-1 rounded-xl">
              <TabsTrigger 
                value="upcoming" 
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-lg"
              >
                Upcoming
              </TabsTrigger>
              <TabsTrigger 
                value="past" 
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-lg"
              >
                Past
              </TabsTrigger>
              <TabsTrigger 
                value="cancelled" 
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-lg"
              >
                Cancelled
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          {filteredBookings.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-blue-600">No bookings found in this category</p>
              <Button 
                onClick={switchToActivities} 
                className="mt-4 bg-teal-500 hover:bg-teal-600"
              >
                Browse Activities
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map(booking => (
                <motion.div
                  key={booking.booking_id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-blue-100 shadow-sm"
                >
                  <div className="flex flex-col md:flex-row justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-blue-800">{booking.activity_name}</h3>
                      <p className="text-blue-600 mt-1">
                        {new Date(booking.activity_date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                      <p className="mt-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          booking.booking_status === 'confirmed' ? 'bg-teal-100 text-teal-800' :
                          booking.booking_status === 'pending' ? 'bg-amber-100 text-amber-800' :
                          booking.booking_status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          'bg-rose-100 text-rose-800'
                        }`}>
                          {booking.booking_status.charAt(0).toUpperCase() + booking.booking_status.slice(1)}
                        </span>
                      </p>
                    </div>
                    <div className="mt-4 md:mt-0 flex flex-col items-end">
                      <p className="text-lg font-bold text-teal-700">₹{booking.total_amount}</p>
                      <p className="text-blue-600">{booking.participants_count} {booking.participants_count === 1 ? 'person' : 'people'}</p>
                      {booking.booking_status === 'confirmed' && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-3 text-blue-600 border-blue-200 hover:bg-blue-50"
                          onClick={() => handleCancelBooking(booking.booking_id)}
                        >
                          Cancel Booking
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default Activities;