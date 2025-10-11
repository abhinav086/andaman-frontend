// src/Pages/Activities/ActivityDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../../config/api';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MapPin,
  Star,
  Clock,
  Users,
  Camera,
  Heart,
  ExternalLink,
  AlertCircle,
  X,
  ChevronLeft,
  MapPin as MapPinIcon,
  Star as StarIcon,
  Calendar as CalendarIcon,
  User as UserIcon,
  Clock as ClockIcon,
  DollarSign as DollarSignIcon,
  Users as UsersIcon,
  Baby as BabyIcon,
  Shield as ShieldIcon,
  CheckCircle as CheckCircleIcon,
  XCircle as XCircleIcon,
  Info as InfoIcon
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

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

// Zod schema for booking form validation (same as in Activities.js)
const bookingSchema = z.object({
  date: z.string().min(1, "Date is required"),
  participants: z.number().min(1, "At least 1 participant required").max(20, "Maximum 20 participants"),
  specialRequests: z.string().max(500, "Special requests must be less than 500 characters").optional()
});

// Booking Modal Component for Activities (same as in Activities.js)
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
          {/* Show Meeting Point and Duration in Modal */}
          <p className="text-xs text-gray-600 mt-1"><strong>Meeting Point:</strong> {activity.meeting_point || 'Not specified'}</p>
          <p className="text-xs text-gray-600"><strong>Duration:</strong> {activity.duration_hours}h {activity.duration_minutes}m</p>
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

const ActivityDetail = () => {
  const { id } = useParams(); // activity_id from the route
  const navigate = useNavigate();
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showBookingModal, setShowBookingModal] = useState(false); // State for booking modal

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/activities/${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch activity: ${response.status}`);
        }
        const data = await response.json();
        setActivity(data.data); // Assuming API returns data in 'data' field
      } catch (err) {
        setError(err.message);
        console.error('Error fetching activity:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-blue-700 font-semibold">Loading activity details...</p>
        </div>
      </div>
    );
  }

  if (error || !activity) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="text-red-500 text-6xl mb-4">❌</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Activity Not Found</h1>
        <p className="text-gray-600 mb-6">{error || 'The activity you are looking for does not exist.'}</p>
        <Button onClick={() => navigate('/activities')} className="bg-blue-600">
          Browse All Activities
        </Button>
      </div>
    );
  }

  const formatDuration = (hours, minutes) => {
    let duration = '';
    if (hours) duration += `${hours} hour${hours > 1 ? 's' : ''}`;
    if (minutes) {
      if (duration) duration += ' ';
      duration += `${minutes} minute${minutes > 1 ? 's' : ''}`;
    }
    return duration || 'N/A';
  };

  const renderList = (items) => {
    if (!items || !Array.isArray(items) || items.length === 0) {
      return <p className="text-gray-500 italic">Not specified.</p>;
    }
    return (
      <ul className="list-disc pl-5 space-y-1">
        {items.map((item, index) => (
          <li key={index} className="text-gray-700">{item}</li>
        ))}
      </ul>
    );
  };

  const isAuthenticated = () => {
    const token = localStorage.getItem('accessToken');
    return !!token;
  };

  const handleBookingSuccess = (newBooking) => {
    // Optional: Handle success, maybe show a confirmation message
    alert('Booking created successfully!');
    setShowBookingModal(false);
  };

  return (
    <div style={customFontStyle} className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          variant="outline"
          onClick={() => navigate('/activities')}
          className="mb-6 border-gray-300 text-gray-700 hover:bg-gray-100"
        >
          <ChevronLeft className="h-4 w-4 mr-2" /> Back to Activities
        </Button>

        {/* Activity Header */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          {/* Activity Image */}
          <div className="relative h-96 bg-gray-200">
            {activity.photos && activity.photos.length > 0 ? (
              <img
                src={activity.photos[0]}
                alt={activity.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                <Camera className="h-24 w-24 text-white opacity-50" />
              </div>
            )}
            <div className="absolute top-4 right-4">
              <Button variant="outline" size="icon" className="bg-white">
                <Heart className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Activity Info */}
          <div className="p-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-800 mb-2">{activity.name}</h1>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="mr-2 h-5 w-5" />
                  <span>{activity.destination}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-600">₹{activity.price}</div>
                <div className="text-sm text-gray-500">per person</div>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              <Badge className="bg-green-100 text-green-800">
                <Star className="mr-1 h-3 w-3" />
                {Number(activity.average_rating)?.toFixed(1) || '0.0'} ({activity.total_reviews || 0} reviews)
              </Badge>
              <Badge className="bg-blue-100 text-blue-800">
                <Clock className="mr-1 h-3 w-3" />
                {formatDuration(activity.duration_hours, activity.duration_minutes)}
              </Badge>
              <Badge className="bg-purple-100 text-purple-800">
                {activity.difficulty_level?.charAt(0).toUpperCase() + activity.difficulty_level?.slice(1) || 'Easy'} Level
              </Badge>
              <Badge className="bg-yellow-100 text-yellow-800">
                Min Age: {activity.min_age || 'N/A'}+
              </Badge>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  if (!isAuthenticated()) {
                    alert('Please log in to book an activity');
                    navigate('/login');
                    return;
                  }
                  setShowBookingModal(true);
                }}
              >
                Book Now
              </Button>
           
            </div>
          </div>
        </div>

        {/* Activity Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>About This Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {activity.description || 'Experience the best of this amazing activity with our expert guides. Perfect for adventure seekers and nature lovers.'}
                </p>
              </CardContent>
            </Card>

        

            {/* Safety Requirements */}
            {activity.safety_requirements && (
              <Card>
                <CardHeader>
                  <CardTitle>Safety Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{activity.safety_requirements}</p>
                </CardContent>
              </Card>
            )}

            {/* Cancellation Policy */}
            <Card>
              <CardHeader>
                <CardTitle>Cancellation Policy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{activity.cancellation_policy}</p>
              </CardContent>
            </Card>

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Activity Info Card */}
            <Card>
              <CardHeader>
                <CardTitle>Activity Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start justify-between">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-medium">{formatDuration(activity.duration_hours, activity.duration_minutes)}</span>
                </div>
                <div className="flex items-start justify-between">
                  <span className="text-gray-600">Group Size</span>
                  <span className="font-medium">{activity.max_participants || 'N/A'} people max</span>
                </div>
                <div className="flex items-start justify-between">
                  <span className="text-gray-600">Difficulty</span>
                  <span className="font-medium">{activity.difficulty_level?.charAt(0).toUpperCase() + activity.difficulty_level?.slice(1) || 'Easy'}</span>
                </div>
                <div className="flex items-start justify-between">
                  <span className="text-gray-600">Min Age</span>
                  <span className="font-medium">{activity.min_age || 'N/A'}+</span>
                </div>
                <div className="flex items-start justify-between">
                  <span className="text-gray-600">Meeting Point</span>
                  <span className="font-medium text-right">{activity.meeting_point || 'To be confirmed'}</span>
                </div>
                <div className="flex items-start justify-between">
                  <span className="text-gray-600">Booking Deadline</span>
                  <span className="font-medium">{activity.booking_deadline_hours || 24} hours before</span>
                </div>
                <div className="flex items-start justify-between">
                  <span className="text-gray-600">Availability</span>
                  <span className="font-medium capitalize">{activity.availability_status || 'N/A'}</span>
                </div>
              </CardContent>
            </Card>

            {/* Booking Card */}
            <Card>
              <CardHeader>
                <CardTitle>Book This Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Price per person</span>
                    <span className="font-bold text-xl">₹{activity.price}</span>
                  </div>
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={() => {
                      if (!isAuthenticated()) {
                        alert('Please log in to book an activity');
                        navigate('/login');
                        return;
                      }
                      setShowBookingModal(true);
                    }}
                  >
                    Book Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Activity Booking Modal */}
      <ActivityBookingModal
        activity={activity}
        isOpen={showBookingModal}
        setIsOpen={setShowBookingModal}
        onBook={handleBookingSuccess}
      />
    </div>
  );
};

export default ActivityDetail;