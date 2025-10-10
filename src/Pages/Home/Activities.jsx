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
  AlertCircle,
  Filter,
  Paperclip, // Using a different icon for bookings
  Heart
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { API_BASE_URL } from '../../config/api';
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

// Zod schema for booking form validation (Logic remains the same)
const bookingSchema = z.object({
  date: z.string().min(1, "Date is required"),
  participants: z.number().min(1, "At least 1 participant required").max(20, "Maximum 20 participants"),
  specialRequests: z.string().max(500, "Special requests must be less than 500 characters").optional()
});

const Activities = () => {
  // All state and logic hooks remain unchanged
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

  // All helper functions and effects for data fetching and filtering remain unchanged
  const handleAuthError = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    alert('Your session has expired. Please log in again.');
    navigate('/login');
  };

  const isAuthenticated = () => {
    const token = localStorage.getItem('accessToken');
    return !!token;
  };

  useEffect(() => {
    if (view !== 'activities') return;
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/activities`);
        if (!response.ok) throw new Error(`Failed to fetch activities: ${response.status}`);
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
        if (!response.ok) throw new Error(`Failed to fetch bookings: ${response.status}`);
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

  const startIndex = (currentPage - 1) * 6;
  const currentActivities = filteredActivities.slice(startIndex, startIndex + 6);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(e.target.search.value);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const resetFilters = () => {
    setFilters({ category: '', destination: '', minPrice: 0, maxPrice: 100000 });
    setSearchQuery('');
  };

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(bookingSchema)
  });

  const onSubmitBooking = async (data) => {
    // Booking submission logic is unchanged
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

  const handleCancelBooking = async (bookingId) => {
    // Cancellation logic is unchanged
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

  const switchToActivities = () => setView('activities');
  
  const filteredBookings = bookings.filter(booking => {
    if (activeTab === 'upcoming') return ['confirmed', 'pending'].includes(booking.booking_status);
    if (activeTab === 'past') return booking.booking_status === 'completed';
    return booking.booking_status === 'cancelled';
  });

  // --- NEW Render Logic ---

  if (view === 'activities') {
    if (loading) return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );

    if (error) return (
      <div className="text-center py-20 bg-gray-50">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
        <p className="mt-4 text-lg text-red-600">Error: {error}</p>
        <p className="text-gray-500 mt-2">Could not load activities. Please try again later.</p>
      </div>
    );

    return (
      <div style={customFontStyle} className="min-h-screen bg-gray-50 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          {/* Section: Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10">
            <div className='text-left'>
              <p className="text-indigo-600 font-semibold text-sm uppercase">Explore & Discover</p>
              <h1 style={customFontStyle2} className="text-4xl md:text-5xl font-bold text-gray-800 mt-1">Find Your Next Adventure</h1>
            </div>
            <Button
              onClick={switchToMyBookings}
              className="mt-4 sm:mt-0 bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50 flex items-center gap-2"
            >
              <Paperclip className="h-4 w-4"/> My Bookings
            </Button>
          </div>

         
          
          {/* Section: Top Destinations */}
          <div  className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Top Destinations</h2>
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="p-2 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed">
                  <ChevronLeft className="h-6 w-6 text-gray-700" />
                </button>
                <span className="text-gray-600 font-medium text-sm">{currentPage} / {totalPages}</span>
                <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="p-2 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed">
                  <ChevronRight className="h-6 w-6 text-gray-700" />
                </button>
              </div>
            )}
          </div>

          {/* Section: Activities Grid */}
          {filteredActivities.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
              <p className="text-gray-600 text-lg">No activities found.</p>
              <p className="text-gray-500 mt-1">Try adjusting your search or filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentActivities.map((activity) => (
                <motion.div
                  key={activity.activity_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
                    <div className="relative">
                      <img 
                        className="w-full h-52 object-cover" 
                        src={activity.photos?.[0] || 'https://placehold.co/400x250?text=Explore'} 
                        alt={activity.name} 
                      />
                      <div className="absolute top-4 right-4 bg-white text-gray-800 font-bold py-1.5 px-4 rounded-full shadow-lg text-sm">
                        ₹{activity.price}
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-xl font-semibold text-gray-900 truncate group-hover:text-indigo-600 transition-colors">{activity.name}</h3>
                      <div className="flex items-center text-gray-500 mt-1">
                        <MapPin className="h-4 w-4 mr-1.5 text-green-600"  /> 
                        <span className="text-sm">  {activity.destination}</span>
                      </div>
                      <div className="flex items-center mt-3 text-orange-500">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <Star key={index} className={`h-5 w-5 ${index < Math.round(activity.average_rating || 4) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                        ))}
                      </div>
                      <div className="mt-5 pt-4 border-t border-gray-100 flex items-center gap-3">
                        <Button 
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/activities/${activity.activity_id}`)}
                          className="text-gray-700 border-gray-300 hover:bg-gray-100 flex-1"
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
                          className="bg-[#221B4D] text-white hover:bg-indigo-700 flex-1"
                        >
                          Book Now
                           <Heart 
    className="text-red-500 fill-red-500" 
    size={16} 
  />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Booking Modal (Styling updated for consistency) */}
        {showBookingModal && selectedActivity && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Book: {selectedActivity.name}</h3>
                <button onClick={() => setShowBookingModal(false)} className="text-gray-400 hover:text-gray-700">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <form onSubmit={handleSubmit(onSubmitBooking)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input type="date" {...register('date')} min={new Date().toISOString().split('T')[0]} className="w-full pl-10 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400" />
                  </div>
                  {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Participants</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input type="number" {...register('participants', { valueAsNumber: true })} min="1" max="20" defaultValue={1} className="w-full pl-10 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400" />
                  </div>
                  {errors.participants && <p className="text-red-500 text-sm mt-1">{errors.participants.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Special Requests (Optional)</label>
                  <textarea {...register('specialRequests')} rows="3" placeholder="e.g., dietary restrictions, accessibility needs" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"></textarea>
                  {errors.specialRequests && <p className="text-red-500 text-sm mt-1">{errors.specialRequests.message}</p>}
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <Button type="button" variant="ghost" onClick={() => setShowBookingModal(false)}>Cancel</Button>
                  <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">Confirm Booking</Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    );
  } else if (view === 'my-bookings') {
    if (myBookingsLoading) return (
        <div className="flex justify-center items-center h-screen bg-gray-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      );
  
      return (
        <div className="min-h-screen bg-gray-50 font-sans">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800">My Bookings</h1>
              <Button onClick={switchToActivities} variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100">Back to Activities</Button>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
              <TabsList className="grid w-full grid-cols-3 bg-gray-200/70 p-1 rounded-xl">
                <TabsTrigger value="upcoming" className="data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm rounded-lg">Upcoming</TabsTrigger>
                <TabsTrigger value="past" className="data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm rounded-lg">Past</TabsTrigger>
                <TabsTrigger value="cancelled" className="data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm rounded-lg">Cancelled</TabsTrigger>
              </TabsList>
            </Tabs>
            
            {filteredBookings.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-lg border border-gray-200">
                <p className="text-gray-600 text-lg">No bookings in this category.</p>
                <Button onClick={switchToActivities} className="mt-4 bg-indigo-600 hover:bg-indigo-700">Explore Activities</Button>
              </div>
            ) : (
              <div className="space-y-5">
                {filteredBookings.map(booking => {
                  const statusStyles = {
                    confirmed: 'border-green-500 bg-green-50',
                    pending: 'border-yellow-500 bg-yellow-50',
                    completed: 'border-blue-500 bg-blue-50',
                    cancelled: 'border-red-500 bg-red-50',
                  };
                  const statusText = {
                    confirmed: 'text-green-800',
                    pending: 'text-yellow-800',
                    completed: 'text-blue-800',
                    cancelled: 'text-red-800',
                  };
                  return(
                  <motion.div
                    key={booking.booking_id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`bg-white rounded-xl p-6 border-l-4 shadow-sm transition-all ${statusStyles[booking.booking_status] || 'border-gray-500'}`}
                  >
                    <div className="flex flex-col md:flex-row justify-between">
                      <div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[booking.booking_status]} ${statusText[booking.booking_status]}`}>
                          {booking.booking_status.charAt(0).toUpperCase() + booking.booking_status.slice(1)}
                        </span>
                        <h3 className="text-xl font-bold text-gray-800 mt-2">{booking.activity_name}</h3>
                        <p className="text-gray-500 mt-1">
                          {new Date(booking.activity_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                      </div>
                      <div className="mt-4 md:mt-0 flex flex-col items-start md:items-end">
                        <p className="text-xl font-bold text-gray-800">₹{booking.total_amount}</p>
                        <p className="text-gray-500">{booking.participants_count} {booking.participants_count === 1 ? 'person' : 'people'}</p>
                        {booking.booking_status === 'confirmed' && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="mt-3 text-red-600 hover:bg-red-50 hover:text-red-700 px-0"
                            onClick={() => handleCancelBooking(booking.booking_id)}
                          >
                            Cancel Booking
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )})}
              </div>
            )}
          </div>
        </div>
      );
  }

  return null;
};

export default Activities;