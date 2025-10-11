// src/components/Activities/Activities.js
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
  Paperclip, // Using a different icon for bookings
  Heart,
  ExternalLink,
  MapPin as MapPinIcon,
  Star as StarIcon,
  Calendar as CalendarIcon,
  User as UserIcon,
  Clock,
  DollarSign,
  Users as GroupIcon,
  Baby,
  Shield,
  Info,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
  DollarSign as DollarSignIcon,
  Users as UsersIcon,
  Baby as BabyIcon,
  Shield as ShieldIcon,
  CheckCircle as CheckCircleIcon,
  XCircle as XCircleIcon,
  Info as InfoIcon
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

// Zod schema for booking form validation
const bookingSchema = z.object({
  date: z.string().min(1, "Date is required"),
  participants: z.number().min(1, "At least 1 participant required").max(20, "Maximum 20 participants"),
  specialRequests: z.string().max(500, "Special requests must be less than 500 characters").optional()
});

// Booking Modal Component for Activities
const ActivityBookingModal = ({ activity, isOpen, setIsOpen, onBook }) => {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      participants: 1
    }
  });

  const navigate = useNavigate();
  const participants = watch('participants', 1); // Watch participants count for price calculation

  const calculateTotalAmount = () => {
    if (!activity) return 0;
    const pricePerPerson = activity.price || 0;
    return pricePerPerson * participants;
  };

  const totalAmount = calculateTotalAmount();

  const onSubmit = async (data) => {
    if (!activity) {
      alert('No activity selected for booking.');
      return;
    }
    setLoading(true);
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
          activity_id: activity.activity_id,
          activity_date: data.date,
          participants_count: data.participants,
          total_amount: totalAmount,
          special_requests: data.specialRequests || null
        })
      });

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        alert('Your session has expired. Please log in again.');
        navigate('/login');
        return;
      }

      const result = await response.json();
      if (response.ok) {
        alert('Booking created successfully!');
        onBook(result.data.booking); // Pass the created booking to parent
        setIsOpen(false);
        reset();
      } else {
        alert(`Booking failed: ${result.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Booking error:', err);
      alert('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!activity) return null; // Don't render if no activity is selected

  return (
    <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 ${isOpen ? '' : 'hidden'}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">Book: {activity.name}</h3>
          <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-sm font-medium text-blue-800">Activity Details</p>
          <p className="text-xs text-gray-600">{activity.destination}</p>
          <p className="text-xs text-gray-600">Price per person: ₹{activity.price}</p>
          {/* Show Meeting Point in Modal */}
          <p className="text-xs text-gray-600 mt-1"><strong>Meeting Point:</strong> {activity.meeting_point || 'Not specified'}</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="date"
                {...register('date')}
                min={new Date().toISOString().split('T')[0]} // Minimum date is today
                className="w-full pl-10 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Participants</label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="number"
                {...register('participants', { valueAsNumber: true })}
                min="1"
                max="20"
                className="w-full pl-10 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            {errors.participants && <p className="text-red-500 text-sm mt-1">{errors.participants.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Special Requests (Optional)</label>
            <textarea
              {...register('specialRequests')}
              rows="3"
              placeholder="e.g., dietary restrictions, accessibility needs"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
            ></textarea>
            {errors.specialRequests && <p className="text-red-500 text-sm mt-1">{errors.specialRequests.message}</p>}
          </div>
          {/* Price Summary Section */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h4 className="font-semibold text-blue-800 mb-2">Price Summary</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <div className="flex justify-between">
                <span>Price per person</span>
                <span>₹{activity.price}</span>
              </div>
              <div className="flex justify-between">
                <span>Participants: {participants}</span>
                <span>₹{(activity.price * participants).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-blue-900">
                <span>Total:</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700" disabled={loading}>
              {loading ? 'Booking...' : 'Confirm Booking'}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const Activities = () => {
  // State for activities and filtering
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

  // State for bookings
  const [activeTab, setActiveTab] = useState('upcoming');
  const [bookings, setBookings] = useState([]);
  const [myBookingsLoading, setMyBookingsLoading] = useState(false);

  // State for UI
  const [view, setView] = useState('activities'); // 'activities' or 'my-bookings'

  const navigate = useNavigate();

  // Helper function for authentication errors
  const handleAuthError = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    alert('Your session has expired. Please log in again.');
    navigate('/login');
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    const token = localStorage.getItem('accessToken');
    return !!token;
  };

  // Fetch activities when 'activities' view is active
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

  // Apply filters and search to activities
  useEffect(() => {
    if (view !== 'activities') return;
    let result = activities;

    if (searchQuery) {
      result = result.filter(activity =>
        activity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.description.toLowerCase().includes(searchQuery.toLowerCase()) // Added description search
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

  // Handler for search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(e.target.search.value);
  };

  // Handler for changing filters
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  // Handler to reset filters
  const resetFilters = () => {
    setFilters({ category: '', destination: '', minPrice: 0, maxPrice: 100000 });
    setSearchQuery('');
  };

  // Handler when a booking is successfully created
  const handleBookingSuccess = (newBooking) => {
    setBookings(prev => [...prev, newBooking]); // Add the new booking to the list
    // Optionally, you could refetch bookings here if needed for real-time data
    // if (view === 'my-bookings') { ... }
  };

  // Cancel an existing booking
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

  // Switch to 'My Bookings' view
  const switchToMyBookings = () => {
    if (!isAuthenticated()) {
      alert('Please log in to view your bookings');
      navigate('/login');
      return;
    }
    setView('my-bookings');
  };

  // Switch to 'Activities' view
  const switchToActivities = () => setView('activities');

  // Filter bookings based on active tab ('upcoming', 'past', 'cancelled')
  const filteredBookings = bookings.filter(booking => {
    if (!booking || !booking.booking_status) return false; // Add null check
    if (activeTab === 'upcoming') return ['confirmed', 'pending'].includes(booking.booking_status);
    if (activeTab === 'past') return booking.booking_status === 'completed';
    return booking.booking_status === 'cancelled';
  });

  // --- Render Logic ---

  // Loading state for activities
  if (view === 'activities' && loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Error state for activities
  if (view === 'activities' && error) {
    return (
      <div className="text-center py-20 bg-gray-50">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
        <p className="mt-4 text-lg text-red-600">Error: {error}</p>
        <p className="text-gray-500 mt-2">Could not load activities. Please try again later.</p>
      </div>
    );
  }

  // Activities View
  if (view === 'activities') {
    return (
      <div style={customFontStyle} className="min-h-screen bg-gray-50 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10">
            <div className='text-left'>
              <p className="text-indigo-600 font-semibold text-sm uppercase">Explore & Discover</p>
              <h1 style={customFontStyle2} className="text-4xl md:text-5xl font-bold text-gray-800 mt-1">Find Your Next Adventure</h1>
            </div>
            <Button onClick={switchToMyBookings} variant="outline" className="mt-4 sm:mt-0 border-gray-300 text-gray-700 hover:bg-gray-100">
              My Bookings
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="bg-white p-6 rounded-xl shadow-md mb-8">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow">
                <Input
                  name="search"
                  placeholder="Search by name, destination, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
                <Search className="h-4 w-4 mr-2" /> Search
              </Button>
            </form>
            <div className="flex flex-wrap gap-4 mt-4">
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="border border-gray-300 rounded-lg p-2 text-sm"
              >
                <option value="">All Categories</option>
                <option value="adventure">Adventure</option>
                <option value="cultural">Cultural</option>
                <option value="nature">Nature</option>
                <option value="food">Food</option>
              </select>
              <select
                value={filters.destination}
                onChange={(e) => handleFilterChange('destination', e.target.value)}
                className="border border-gray-300 rounded-lg p-2 text-sm"
              >
                <option value="">All Destinations</option>
                {/* Dynamically populate destinations if needed, or keep as a free text input */}
                {[...new Set(activities.map(a => a.destination))].map(dest => (
                  <option key={dest} value={dest}>{dest}</option>
                ))}
              </select>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Min Price"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', parseFloat(e.target.value) || 0)}
                  className="w-24"
                />
                <Input
                  type="number"
                  placeholder="Max Price"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', parseFloat(e.target.value) || 100000)}
                  className="w-24"
                />
              </div>
              <Button onClick={resetFilters} variant="outline" size="sm">Reset</Button>
            </div>
          </div>

          {/* Top Destinations (Activities Grid) */}
          <div className="flex justify-between items-center mb-6">
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

          {/* Activities Grid */}
          {filteredActivities.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
              <p className="text-gray-600 text-lg">No activities found.</p>
              <p className="text-gray-500 mt-1">Try adjusting your search or filters.</p>
              <Button onClick={resetFilters} className="mt-4 bg-indigo-600 hover:bg-indigo-700">Reset Filters</Button>
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
                        <MapPinIcon className="h-4 w-4 mr-1.5 text-green-600" />
                        <span className="text-sm"> {activity.destination}</span>
                      </div>
                      <div className="flex items-center mt-3 text-orange-500">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <StarIcon key={index} className={`h-5 w-5 ${index < Math.round(activity.average_rating || 4) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                        ))}
                        <span className="ml-2 text-gray-600 text-sm">({activity.total_reviews || 0} reviews)</span>
                      </div>
                      {/* Display Meeting Point and Duration */}
                      <div className="mt-3 text-sm text-gray-600">
                        <p><strong>Meeting Point:</strong> {activity.meeting_point || 'Not specified'}</p>
                        <p><strong>Duration:</strong> {activity.duration_hours}h {activity.duration_minutes}m</p>
                      </div>
                      <div className="mt-5 pt-4 border-t border-gray-100 flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/activities/${activity.activity_id}`)} // Navigate to detailed view
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
                            className="ml-2 text-red-500 fill-red-500"
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

        {/* Activity Booking Modal */}
        <ActivityBookingModal
          activity={selectedActivity}
          isOpen={showBookingModal}
          setIsOpen={setShowBookingModal}
          onBook={handleBookingSuccess}
        />
      </div>
    );
  }

  // My Bookings View (Activity Bookings)
  if (view === 'my-bookings') {
    // ... (Keep the existing My Bookings view code as is)
    // Fetch user bookings when 'my-bookings' view is active
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

    if (myBookingsLoading) {
      return (
        <div className="flex justify-center items-center h-screen bg-gray-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      );
    }
    return (
      <div className="min-h-screen bg-gray-50 font-sans">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">My Activity Bookings</h1>
            <Button onClick={switchToActivities} variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100">Back to Activities</Button>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="grid w-full grid-cols-3 bg-gray-200/70 p-1 rounded-xl">
              <TabsTrigger value="upcoming" className="data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm rounded-lg">Upcoming</TabsTrigger>
              <TabsTrigger value="past" className="data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm rounded-lg">Past</TabsTrigger>
              <TabsTrigger value="cancelled" className="data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm rounded-lg">Cancelled</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Bookings List */}
          {filteredBookings.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-lg border border-gray-200">
              <p className="text-gray-600 text-lg">No bookings in this category.</p>
              <Button onClick={switchToActivities} className="mt-4 bg-indigo-600 hover:bg-indigo-700">Explore Activities</Button>
            </div>
          ) : (
            <div className="space-y-5">
              {filteredBookings.map(booking => {
                if (!booking) return null; // Add safety check
                const statusStyles = {
                  confirmed: 'border-green-500 bg-green-50',
                  pending: 'border-yellow-500 bg-yellow-50',
                  completed: 'border-blue-500 bg-blue-50',
                  cancelled: 'border-red-500 bg-red-500/10',
                };
                const statusText = {
                  confirmed: 'text-green-800',
                  pending: 'text-yellow-800',
                  completed: 'text-blue-800',
                  cancelled: 'text-red-800',
                };
                return (
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
                          <CalendarIcon className="inline mr-1 h-4 w-4" />
                          {new Date(booking.activity_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                        <p className="text-gray-500 mt-1">
                          <MapPinIcon className="inline mr-1 h-4 w-4" />
                          {booking.destination}
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
                )
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Fallback return
  return null;
};

export default Activities;