// src/Pages/MyBookings.jsx
import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../../config/api';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, User, Star, Coffee, Utensils, Waves as WavesIcon, Mountain, Plane, X, BookOpen, ExternalLink, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MyBookings = () => {
  const [bookings, setBookings] = useState({
    hotel: [],
    activity: []
  });
  const [loading, setLoading] = useState({
    hotel: true,
    activity: true
  });
  const [error, setError] = useState({
    hotel: '',
    activity: ''
  });
  const [activeTab, setActiveTab] = useState('hotel'); // 'hotel' or 'activity'
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHotelBookings = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`${API_BASE_URL}/api/bookings/hotel/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setBookings(prev => ({ ...prev, hotel: data.bookings || [] }));
        } else {
          const errorData = await response.json();
          setError(prev => ({ ...prev, hotel: errorData.msg || 'Failed to fetch hotel bookings' }));
        }
      } catch (err) {
        setError(prev => ({ ...prev, hotel: 'Network error occurred' }));
        console.error('Error fetching hotel bookings:', err);
      } finally {
        setLoading(prev => ({ ...prev, hotel: false }));
      }
    };

    const fetchActivityBookings = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`${API_BASE_URL}/api/activities/bookings`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setBookings(prev => ({ ...prev, activity: data.data?.bookings || [] }));
        } else {
          const errorData = await response.json();
          setError(prev => ({ ...prev, activity: errorData.message || 'Failed to fetch activity bookings' }));
        }
      } catch (err) {
        setError(prev => ({ ...prev, activity: 'Network error occurred' }));
        console.error('Error fetching activity bookings:', err);
      } finally {
        setLoading(prev => ({ ...prev, activity: false }));
      }
    };

    if (activeTab === 'hotel') {
      fetchHotelBookings();
    }
    if (activeTab === 'activity') {
      fetchActivityBookings();
    }
  }, [activeTab]); // Fetch when tab changes

  const cancelHotelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this hotel booking?')) return;
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_BASE_URL}/api/bookings/hotel/${bookingId}/cancel`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const updatedBooking = await response.json();
        setBookings(prev => ({
          ...prev,
          hotel: prev.hotel.map(b => b.booking_id === bookingId ? updatedBooking.booking : b)
        }));
        alert('Hotel booking cancelled successfully');
      } else {
        const errorData = await response.json();
        alert(`Cancellation failed: ${errorData.msg || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Cancellation error:', error);
      alert('Network error occurred');
    }
  };

  const cancelActivityBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this activity booking?')) return;
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_BASE_URL}/api/activities/bookings/${bookingId}/cancel`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        setBookings(prev => ({
          ...prev,
          activity: prev.activity.map(b => b.booking_id === bookingId ? { ...b, booking_status: result.data.booking_status } : b)
        }));
        alert('Activity booking cancelled successfully');
      } else {
        const errorData = await response.json();
        alert(`Cancellation failed: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Cancellation error:', error);
      alert('Network error occurred');
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Determine current bookings and loading/error states based on active tab
  const currentBookings = bookings[activeTab];
  const currentLoading = loading[activeTab];
  const currentError = error[activeTab];

  if (currentLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-blue-700 font-semibold text-lg">Loading your {activeTab} bookings...</p>
        </div>
      </div>
    );
  }

  if (currentError) {
    return (
      <div className="flex justify-center items-center p-4 h-screen">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md border border-red-100">
          <X className="mx-auto h-16 w-16 text-red-400" />
          <h3 className="text-2xl font-bold text-gray-800 mt-4">Error Loading {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Bookings</h3>
          <p className="text-gray-600 mt-2 mb-6">{currentError}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  if (currentBookings.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <BookOpen className="mx-auto h-24 w-24 text-blue-200" />
        <h1 className="text-3xl font-bold text-gray-800 mt-4">No {activeTab} Bookings Yet</h1>
        <p className="text-gray-600 mt-2 mb-8">Time to plan your next {activeTab === 'hotel' ? 'stay' : 'adventure'}!</p>
        <div className="space-x-4">
          <Button onClick={() => navigate('/')} className="bg-blue-600 hover:bg-blue-700">
            Browse {activeTab === 'hotel' ? 'Hotels' : 'Activities'}
          </Button>
          <Button onClick={() => navigate('/activities')} className="bg-indigo-600 hover:bg-indigo-700">
            Browse Activities
          </Button>
        </div>
      </div>
    );
  }

  // Function to render booking cards based on type
  const renderBookingCard = (booking) => {
    if (activeTab === 'hotel') {
      return (
        <Card key={booking.booking_id} className="shadow-md border border-gray-200">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">{booking.hotel_name || `Booking #${booking.booking_reference}`}</CardTitle>
                <p className="text-sm text-gray-500 mt-1">{booking.hotel_address}</p>
              </div>
              <Badge className={`${
                booking.booking_status === 'confirmed' ? 'bg-green-100 text-green-800' :
                booking.booking_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                booking.booking_status === 'cancelled' ? 'bg-red-100 text-red-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {booking.booking_status.charAt(0).toUpperCase() + booking.booking_status.slice(1)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="mr-2 h-4 w-4 text-blue-500" />
                <span>{new Date(booking.check_in_date).toLocaleDateString()} - {new Date(booking.check_out_date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <User className="mr-2 h-4 w-4 text-blue-500" />
                <span>{booking.num_guests} {booking.num_guests === 1 ? 'Guest' : 'Guests'}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="mr-2 h-4 w-4 text-blue-500" />
                <span>Room: {booking.room_type}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Star className="mr-2 h-4 w-4 text-blue-500" />
                <span>Final Amount: ₹{booking.final_amount}</span>
              </div>
            </div>
            {booking.special_requests && (
              <div className="mb-4">
                <p className="text-sm text-gray-600"><strong>Requests:</strong> {booking.special_requests}</p>
              </div>
            )}
            <Separator className="my-4" />
            <div className="flex flex-col sm:flex-row justify-end gap-2">
              {booking.booking_status === 'pending' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => cancelHotelBooking(booking.booking_id)}
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  Cancel Booking
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/hotel/${booking.hotel_id}`)} // Navigate to hotel details if possible
              >
                View Hotel Details
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    } else if (activeTab === 'activity') {
      // Assuming activity booking object structure has booking_status
      if (!booking.booking_status) {
         console.error("Activity booking missing 'booking_status':", booking);
         return null; // Skip rendering if status is missing
      }
      const statusStyles = {
        confirmed: 'bg-green-100 text-green-800',
        pending: 'bg-yellow-100 text-yellow-800',
        completed: 'bg-blue-100 text-blue-800',
        cancelled: 'bg-red-100 text-red-800',
      };
      return (
        <Card key={booking.booking_id} className="shadow-md border border-gray-200">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">{booking.activity_name || `Booking #${booking.booking_reference}`}</CardTitle>
                <p className="text-sm text-gray-500 mt-1">{booking.destination}</p>
              </div>
              <Badge className={statusStyles[booking.booking_status] || 'bg-gray-100 text-gray-800'}>
                {booking.booking_status.charAt(0).toUpperCase() + booking.booking_status.slice(1)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="mr-2 h-4 w-4 text-blue-500" />
                <span>{new Date(booking.activity_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <User className="mr-2 h-4 w-4 text-blue-500" />
                <span>{booking.participants_count} {booking.participants_count === 1 ? 'Person' : 'People'}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="mr-2 h-4 w-4 text-blue-500" />
                <span>Total Amount: ₹{booking.total_amount}</span>
              </div>
               {/* Show Meeting Point from booking object */}
               <div className="flex items-center text-sm text-gray-600">
                <Info className="mr-2 h-4 w-4 text-blue-500" />
                <span>Meeting Point: {booking.meeting_point_confirmed || 'Not specified'}</span>
              </div>
            </div>
            {booking.special_requests && (
              <div className="mb-4">
                <p className="text-sm text-gray-600"><strong>Requests:</strong> {booking.special_requests}</p>
              </div>
            )}
            <Separator className="my-4" />
            <div className="flex flex-col sm:flex-row justify-end gap-2">
              {booking.booking_status === 'confirmed' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => cancelActivityBooking(booking.booking_id)}
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  Cancel Booking
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/activities/${booking.activity_id}`)} // Navigate to activity details if possible
              >
                View Activity Details
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }
    return null; // Should not happen if activeTab is correctly 'hotel' or 'activity'
  };


  return (
    <div className="max-w-4xl mt-20 mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Bookings</h1>

      {/* Tabs for Hotel/Activity */}
      <div className="flex space-x-4 mb-8">
        <Button
          variant={activeTab === 'hotel' ? 'default' : 'outline'}
          onClick={() => handleTabChange('hotel')}
          className="flex-1"
        >
          <Plane className="mr-2 h-4 w-4" /> Hotel Bookings
        </Button>
        <Button
          variant={activeTab === 'activity' ? 'default' : 'outline'}
          onClick={() => handleTabChange('activity')}
          className="flex-1"
        >
          <Mountain className="mr-2 h-4 w-4" /> Activity Bookings
        </Button>
      </div>

      <div className="space-y-6">
        {currentBookings.map(renderBookingCard)}
      </div>
    </div>
  );
};

export default MyBookings;