// src/admin/AdminActivities.jsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, MapPin, Plus, Upload, X, Calendar, User, Check, XCircle, Clock, Eye, RefreshCw, AlertCircle, DollarSign, Star, Users as UsersIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { API_BASE_URL } from '../config/api';

// Booking Details Modal Component for Activities
const ActivityBookingDetailsModal = ({ booking, onClose, onUpdateStatus }) => {
  const [status, setStatus] = useState(booking?.booking_status || '');
  const [paymentStatus, setPaymentStatus] = useState(booking?.payment_status || '');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        alert('No access token found. Please login again.');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/activities/bookings/${booking.booking_id}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status, // Using 'status' for booking status as per API
          payment_status: paymentStatus
        })
      });

      if (response.ok) {
        const result = await response.json();
        onUpdateStatus(result.data.booking); // Assuming API returns updated booking under `data.booking`
        onClose();
        alert('Booking status updated successfully');
      } else {
        const error = await response.json();
        alert(`Update failed: ${error.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('Network error occurred while updating booking');
    } finally {
      setLoading(false);
    }
  };

  if (!booking) return null;

  return (
    <Dialog open={!!booking} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Activity Booking Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Booking ID</Label>
              <p className="text-sm bg-gray-100 p-2 rounded">{booking.booking_id}</p>
            </div>
            <div>
              <Label>Reference</Label>
              <p className="text-sm bg-gray-100 p-2 rounded">{booking.booking_reference || 'N/A'}</p>
            </div>
            <div>
              <Label>User</Label>
              <p className="text-sm bg-gray-100 p-2 rounded">{booking.full_name || booking.user_id || 'N/A'}</p>
            </div>
            <div>
              <Label>Email</Label>
              <p className="text-sm bg-gray-100 p-2 rounded">{booking.email || 'N/A'}</p>
            </div>
            <div>
              <Label>Activity</Label>
              <p className="text-sm bg-gray-100 p-2 rounded">{booking.activity_name || 'N/A'}</p>
            </div>
            <div>
              <Label>Destination</Label>
              <p className="text-sm bg-gray-100 p-2 rounded">{booking.destination || 'N/A'}</p>
            </div>
            <div>
              <Label>Activity Date</Label>
              <p className="text-sm bg-gray-100 p-2 rounded">
                {booking.activity_date ? new Date(booking.activity_date).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            <div>
              <Label>Participants</Label>
              <p className="text-sm bg-gray-100 p-2 rounded">{booking.participants_count || 'N/A'}</p>
            </div>
            <div>
              <Label>Amount</Label>
              <p className="text-sm bg-gray-100 p-2 rounded">₹{booking.total_amount || 'N/A'}</p>
            </div>
            <div>
              <Label>Booking Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Payment Status</Label>
              <Select value={paymentStatus} onValueChange={setPaymentStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Special Requests</Label>
            <p className="text-sm bg-gray-100 p-2 rounded min-h-[40px]">
              {booking.special_requests || 'None'}
            </p>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Close
            </Button>
            <Button onClick={handleUpdate} disabled={loading}>
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Status'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Bookings Management Component for Activities
const ActivityBookingsManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [filter, setFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [apiError, setApiError] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  });

  useEffect(() => {
    fetchBookings();
  }, [filter, paymentFilter, pagination.page]);

  const fetchBookings = async () => {
    setLoading(true);
    setApiError('');
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setApiError('No access token found. Please login again.');
        setLoading(false);
        return;
      }

      // Build query parameters
      const params = new URLSearchParams();
      if (filter !== 'all') {
        params.append('status', filter);
      }
      if (paymentFilter !== 'all') {
        params.append('payment_status', paymentFilter);
      }
      params.append('limit', pagination.limit.toString());
      params.append('page', pagination.page.toString());

      const url = `${API_BASE_URL}/api/activities/bookings/admin/all${params.toString() ? '?' + params.toString() : ''}`;
      console.log('Fetching activity bookings from:', url); // Debug log
      console.log('Using token:', token ? 'Token present' : 'No token'); // Debug log

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Response status:', response.status); // Debug log
      console.log('Response headers:', Object.fromEntries(response.headers.entries())); // Debug log

      if (response.ok) {
        const data = await response.json();
        console.log('Activity bookings response ', data); // Debug log
        setBookings(data.data.bookings || []);
        if (data.data.pagination) {
          setPagination(prev => ({
            ...prev,
            total: data.data.pagination.total || 0
          }));
        }
        setApiError('');
      } else {
        // Try to get error message from response
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
          console.log('Activity bookings error response data:', errorData); // Debug log
        } catch (e) {
          // If response is not JSON, use the text
          try {
            const errorText = await response.text();
            errorMessage = errorText || errorMessage;
            console.log('Activity bookings error response text:', errorText); // Debug log
          } catch (e2) {
            // Use default error message
            console.log('Could not parse activity bookings error response'); // Debug log
          }
        }
        console.error('Failed to fetch activity bookings:', errorMessage);
        setApiError(`Failed to fetch activity bookings: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Error fetching activity bookings:', error);
      setApiError(`Network error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = (updatedBooking) => {
    setBookings(bookings.map(b =>
      b.booking_id === updatedBooking.booking_id ? updatedBooking : b
    ));
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        alert('No access token found. Please login again.');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/activities/bookings/${bookingId}/cancel`, {
        method: 'PUT', // API uses PUT for cancel
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        setBookings(bookings.map(b =>
          b.booking_id === bookingId ? result.data.booking : b // Assuming API returns updated booking under `data.booking`
        ));
        alert('Booking cancelled successfully');
      } else {
        const error = await response.json();
        alert(`Cancellation failed: ${error.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Cancellation error:', error);
      alert('Network error occurred');
    }
  };

  const handleRetry = () => {
    fetchBookings();
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'confirmed': return 'default';
      case 'pending': return 'secondary';
      case 'cancelled': return 'destructive';
      case 'completed': return 'outline'; // Or default, depending on preference
      default: return 'outline';
    }
  };

  const getPaymentStatusBadgeVariant = (status) => {
    switch (status) {
      case 'paid': return 'default';
      case 'pending': return 'secondary';
      case 'refunded': return 'destructive';
      default: return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin mr-2" />
        <p>Loading activity bookings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold">All Activity Bookings</h3>
          {bookings.length > 0 && (
            <p className="text-sm text-gray-600">
              Showing {bookings.length} bookings
              {pagination.total > 0 && ` of ${pagination.total} total`}
            </p>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={paymentFilter} onValueChange={setPaymentFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Payments</SelectItem>
              <SelectItem value="pending">Payment Pending</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleRetry}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {apiError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-red-800 mb-1">Error Loading Bookings</h4>
              <p className="text-sm text-red-600 mb-3">{apiError}</p>
              <div className="space-y-2">
                <p className="text-xs text-red-500">Troubleshooting tips:</p>
                <ul className="text-xs text-red-500 list-disc list-inside space-y-1">
                  <li>Check if you're logged in with admin privileges</li>
                  <li>Verify the API endpoint is correct: {API_BASE_URL}/api/activities/bookings/admin/all</li>
                  <li>Check browser console for detailed error logs</li>
                  <li>Ensure the backend server is running</li>
                  <li>Verify your access token is valid and not expired</li>
                </ul>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRetry}
                className="mt-3 text-red-600 border-red-300 hover:bg-red-50"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          </div>
        </div>
      )}

      {!apiError && bookings.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No activity bookings found</h3>
          <p className="text-gray-500">
            {filter !== 'all' || paymentFilter !== 'all'
              ? 'No activity bookings match your current filters.'
              : 'No activity bookings have been made yet.'}
          </p>
        </div>
      )}

      {bookings.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bookings.map(booking => (
            <Card key={booking.booking_id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h4 className="font-bold text-base">{booking.activity_name || 'Unknown Activity'}</h4>
                    <p className="text-sm text-gray-600">{booking.full_name || 'Unknown User'}</p>
                  </div>
                  <div className="flex flex-col gap-1 items-end">
                    <Badge variant={getStatusBadgeVariant(booking.booking_status)}>
                      {booking.booking_status || 'unknown'}
                    </Badge>
                    {booking.payment_status && (
                      <Badge variant={getPaymentStatusBadgeVariant(booking.payment_status)} className="text-xs">
                        {booking.payment_status}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                    {booking.destination || 'N/A'}
                  </div>
                  {booking.activity_date && (
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      {new Date(booking.activity_date).toLocaleDateString()}
                    </div>
                  )}
                  {booking.participants_count && (
                    <div className="flex items-center text-sm">
                      <UsersIcon className="h-4 w-4 mr-2 text-gray-500" />
                      {booking.participants_count} {booking.participants_count === 1 ? 'Participant' : 'Participants'}
                    </div>
                  )}
                  {booking.total_amount && (
                    <div className="text-sm font-semibold">₹{booking.total_amount}</div>
                  )}
                  <div className="text-xs text-gray-500">
                    ID: {booking.booking_id}
                    {booking.booking_reference && ` | Ref: ${booking.booking_reference}`}
                  </div>
                </div>
                <div className="mt-4 flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedBooking(booking)}
                    className="flex-1"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  {booking.booking_status === 'pending' && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleCancelBooking(booking.booking_id)}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {selectedBooking && (
        <ActivityBookingDetailsModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onUpdateStatus={handleStatusUpdate}
        />
      )}
    </div>
  );
};

const AdminActivities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newActivity, setNewActivity] = useState({
    name: '',
    description: '',
    destination: '',
    duration_hours: 0,
    duration_minutes: 0,
    price: 0,
    currency: 'INR',
    max_participants: null,
    min_age: null,
    difficulty_level: 'easy',
    category: '',
    meeting_point: '',
    safety_requirements: '',
    cancellation_policy: '',
    inclusions: [],
    exclusions: [],
    available_days: [],
    start_time: '',
    end_time: '',
    booking_deadline_hours: 24,
    availability_status: 'available'
  });
  const [errors, setErrors] = useState({});
  const [photos, setPhotos] = useState([]);
  const [previewPhotos, setPreviewPhotos] = useState([]);
  const [editingActivity, setEditingActivity] = useState(null);
  const [editPhotos, setEditPhotos] = useState([]);
  const [editPreviewPhotos, setEditPreviewPhotos] = useState([]);
  const [apiError, setApiError] = useState('');
  const [activeTab, setActiveTab] = useState('activities'); // 'activities' or 'bookings'

  useEffect(() => {
    if (activeTab === 'activities') {
      fetchActivities();
    }
  }, [activeTab]);

  const fetchActivities = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_BASE_URL}/api/activities`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const result = await response.json();
        setActivities(result.data.activities || []);
      } else {
        console.error('Failed to fetch activities');
        const errorData = await response.json();
        setApiError(errorData.message || 'Failed to fetch activities');
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
      setApiError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewActivity(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingActivity(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setPhotos(files);
    // Create previews
    const previews = files.map(file => URL.createObjectURL(file));
    setPreviewPhotos(previews);
  };

  const handleEditFileChange = (e) => {
    const files = Array.from(e.target.files);
    setEditPhotos(files);
    // Create previews
    const previews = files.map(file => URL.createObjectURL(file));
    setEditPreviewPhotos(previews);
  };

  const removePreview = (index, isEdit = false) => {
    if (isEdit) {
      setEditPreviewPhotos(prev => prev.filter((_, i) => i !== index));
      setEditPhotos(prev => prev.filter((_, i) => i !== index));
    } else {
      setPreviewPhotos(prev => prev.filter((_, i) => i !== index));
      setPhotos(prev => prev.filter((_, i) => i !== index));
    }
  };

  const removeExistingPhoto = (index) => {
    setEditingActivity(prev => ({
      ...prev,
      photos: prev.photos?.filter((_, i) => i !== index) || []
    }));
  };

  const validateActivity = () => {
    const newErrors = {};
    const name = newActivity.name?.trim(); // Use optional chaining and trim
    const destination = newActivity.destination?.trim();
    const price = parseFloat(newActivity.price); // Parse price to number

    if (!name || name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters long';
    }
    if (!destination || destination.length < 2) {
      newErrors.destination = 'Destination must be at least 2 characters long';
    }
    if (isNaN(price) || price <= 0) {
      newErrors.price = 'Price must be a positive number';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Helper function to sanitize form data
  const sanitizeFormData = (data) => {
    const sanitized = {};
    Object.keys(data).forEach(key => {
      const value = data[key];
      // Handle different field types
      if (['inclusions', 'exclusions', 'available_days']) {
        // Arrays should be preserved
        sanitized[key] = Array.isArray(value) ? value : [];
      } else if (['duration_hours', 'duration_minutes', 'price', 'max_participants', 'min_age', 'booking_deadline_hours']) {
        // Numbers: only include if valid
        if (value !== '' && value !== null && value !== undefined) {
          const numValue = parseFloat(value);
          if (!isNaN(numValue)) {
            sanitized[key] = numValue;
          }
        }
      } else if (key === 'video_url') {
        // Only include if it's a valid URL or empty
        if (value && value.trim() !== '') {
          sanitized[key] = value.trim();
        }
      } else if (typeof value === 'string') {
        // For string fields, trim whitespace
        sanitized[key] = value.trim();
      } else if (value !== null && value !== undefined) {
        // Include non-empty values of other types
        sanitized[key] = value;
      }
    });
    return sanitized;
  };

  const handleAddActivity = async () => {
    if (!validateActivity()) {
        console.error("Validation failed, errors:", errors); // Log frontend errors
        return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      const formData = new FormData();
      // Sanitize the activity data before adding to form
      const sanitizedData = sanitizeFormData(newActivity);

      console.log("Sanitized Data being sent:", sanitizedData); // Log sanitized data

      // Add text fields (excluding arrays for now)
      Object.keys(sanitizedData).forEach(key => {
        if (!['inclusions', 'exclusions', 'available_days'].includes(key)) {
          formData.append(key, sanitizedData[key]);
        }
      });

      // Add array fields as JSON strings
      formData.append('inclusions', JSON.stringify(sanitizedData.inclusions || []));
      formData.append('exclusions', JSON.stringify(sanitizedData.exclusions || []));
      formData.append('available_days', JSON.stringify(sanitizedData.available_days || []));

      // Add photos
      photos.forEach(photo => {
        formData.append('photos', photo);
      });

      const response = await fetch(`${API_BASE_URL}/api/activities`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // Note: Don't set Content-Type to application/json for FormData
          // The browser will set the correct multipart/form-data content type
        },
        body: formData
      });

      const responseText = await response.text();
      console.log("Server Response Status:", response.status); // Log status
      console.log("Server Response Text:", responseText); // Log response body

      if (!response.ok) {
        console.error('Server Error:', response.status, responseText);
        setApiError(`Failed to add activity: ${response.status} - ${response.statusText}`);
        return;
      }

      try {
        const result = JSON.parse(responseText);
        setActivities([...activities, result.data.activity]);
        resetForm();
        setApiError('');
      } catch (e) {
        console.error('Invalid JSON response:', responseText);
        setApiError('Server returned invalid response format');
      }
    } catch (error) {
      console.error('Network error:', error);
      setApiError('Network error occurred');
    }
  };

  const resetForm = () => {
    setNewActivity({
      name: '',
      description: '',
      destination: '',
      duration_hours: 0,
      duration_minutes: 0,
      price: 0,
      currency: 'INR',
      max_participants: null,
      min_age: null,
      difficulty_level: 'easy',
      category: '',
      meeting_point: '',
      safety_requirements: '',
      cancellation_policy: '',
      inclusions: [],
      exclusions: [],
      available_days: [],
      start_time: '',
      end_time: '',
      booking_deadline_hours: 24,
      availability_status: 'available'
    });
    setPhotos([]);
    setPreviewPhotos([]);
  };

  const handleUpdateActivity = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const formData = new FormData();
      // Sanitize the editing activity data
      const sanitizedData = sanitizeFormData(editingActivity);

      // Add text fields (excluding photos and arrays)
      Object.keys(sanitizedData).forEach(key => {
        if (['inclusions', 'exclusions', 'available_days'].includes(key)) {
          // Add array fields as JSON strings
          formData.append(key, JSON.stringify(sanitizedData[key] || []));
        } else if (key !== 'photos') {
          // Skip photos - handle separately
          formData.append(key, sanitizedData[key]);
        }
      });

      // Handle existing photos - send the current photos array (after any removals)
      const remainingPhotos = editingActivity.photos || [];
      formData.append('existing_photos', JSON.stringify(remainingPhotos));

      // Add new photos
      editPhotos.forEach(photo => {
        formData.append('photos', photo);
      });

      const response = await fetch(`${API_BASE_URL}/api/activities/${editingActivity.activity_id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const responseText = await response.text();
      if (!response.ok) {
        console.error('Update Error:', response.status, responseText);
        setApiError(`Failed to update activity: ${response.status} - ${response.statusText}`);
        return;
      }

      try {
        const result = JSON.parse(responseText);
        setActivities(activities.map(activity =>
          activity.activity_id === editingActivity.activity_id ? result.data.activity : activity
        ));
        setEditingActivity(null);
        setEditPhotos([]);
        setEditPreviewPhotos([]);
        setApiError('');
      } catch (e) {
        console.error('Invalid JSON response:', responseText);
        setApiError('Server returned invalid response format');
      }
    } catch (error) {
      console.error('Network error:', error);
      setApiError('Network error occurred');
    }
  };

  const handleDeleteActivity = async (activityId) => {
    if (!window.confirm('Are you sure you want to delete this activity?')) return;
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_BASE_URL}/api/activities/${activityId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const responseText = await response.text();
      if (!response.ok) {
        console.error('Delete Error:', response.status, responseText);
        setApiError(`Failed to delete activity: ${response.status} - ${response.statusText}`);
        return;
      }

      setActivities(activities.filter(activity => activity.activity_id !== activityId));
      setApiError('');
    } catch (error) {
      console.error('Network error:', error);
      setApiError('Network error occurred');
    }
  };

  const startEdit = (activity) => {
    // Create a new object with the activity data, ensuring it matches the state structure
    // Use the initial state structure as a base to avoid undefined values
    const activityToEdit = {
      name: activity.name || '',
      description: activity.description || '',
      destination: activity.destination || '',
      duration_hours: activity.duration_hours || 0,
      duration_minutes: activity.duration_minutes || 0,
      price: activity.price || 0,
      currency: activity.currency || 'INR',
      max_participants: activity.max_participants || null,
      min_age: activity.min_age || null,
      difficulty_level: activity.difficulty_level || 'easy',
      category: activity.category || '',
      meeting_point: activity.meeting_point || '',
      safety_requirements: activity.safety_requirements || '',
      cancellation_policy: activity.cancellation_policy || '',
      inclusions: Array.isArray(activity.inclusions) ? activity.inclusions : [],
      exclusions: Array.isArray(activity.exclusions) ? activity.exclusions : [],
      available_days: Array.isArray(activity.available_days) ? activity.available_days : [],
      start_time: activity.start_time || '',
      end_time: activity.end_time || '',
      booking_deadline_hours: activity.booking_deadline_hours || 24,
      availability_status: activity.availability_status || 'available',
      activity_id: activity.activity_id, // Include the ID for the update request
      photos: Array.isArray(activity.photos) ? activity.photos : [] // Include photos array
    };

    setEditingActivity(activityToEdit);
    setEditPhotos([]);
    setEditPreviewPhotos([]);
  };

  if (loading && activeTab === 'activities') {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading activities...</p>
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <CardTitle className="text-2xl">Activity Management</CardTitle>
          <CardDescription>Manage your activities and bookings</CardDescription>
        </div>
        {/* Tab Navigation */}
        <div className="flex space-x-2">
          <Button
            variant={activeTab === 'activities' ? 'default' : 'outline'}
            onClick={() => setActiveTab('activities')}
          >
            <MapPin className="mr-2 h-4 w-4" />
            Activities
          </Button>
          <Button
            variant={activeTab === 'bookings' ? 'default' : 'outline'}
            onClick={() => setActiveTab('bookings')}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Bookings
          </Button>
        </div>
      </CardHeader>

      {apiError && (
        <div className="mx-6 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
          {apiError}
        </div>
      )}

      <CardContent>
        {activeTab === 'activities' ? (
          <>
            {/* Add Activity Button */}
            <div className="mb-6">
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" /> Add Activity
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Activity</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    {apiError && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                        {apiError}
                      </div>
                    )}
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <Label htmlFor="name">Activity Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={newActivity.name}
                          onChange={handleInputChange}
                          className={errors.name ? "border-red-500" : ""}
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                      </div>
                      <div>
                        <Label htmlFor="destination">Destination *</Label>
                        <Input
                          id="destination"
                          name="destination"
                          value={newActivity.destination}
                          onChange={handleInputChange}
                          className={errors.destination ? "border-red-500" : ""}
                        />
                        {errors.destination && <p className="text-red-500 text-sm mt-1">{errors.destination}</p>}
                      </div>
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Input
                          id="category"
                          name="category"
                          value={newActivity.category}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          name="description"
                          value={newActivity.description}
                          onChange={handleInputChange}
                          rows={3}
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="duration_hours">Duration (Hours)</Label>
                          <Input
                            id="duration_hours"
                            name="duration_hours"
                            type="number"
                            min="0"
                            step="any"
                            value={newActivity.duration_hours}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div>
                          <Label htmlFor="duration_minutes">Duration (Minutes)</Label>
                          <Input
                            id="duration_minutes"
                            name="duration_minutes"
                            type="number"
                            min="0"
                            max="59"
                            value={newActivity.duration_minutes}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="price">Price *</Label>
                          <Input
                            id="price"
                            name="price"
                            type="number"
                            min="0"
                            step="any"
                            value={newActivity.price}
                            onChange={handleInputChange}
                            className={errors.price ? "border-red-500" : ""}
                          />
                          {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                        </div>
                        <div>
                          <Label htmlFor="currency">Currency</Label>
                          <Input
                            id="currency"
                            name="currency"
                            value={newActivity.currency}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="max_participants">Max Participants</Label>
                          <Input
                            id="max_participants"
                            name="max_participants"
                            type="number"
                            min="1"
                            value={newActivity.max_participants || ''}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div>
                          <Label htmlFor="min_age">Minimum Age</Label>
                          <Input
                            id="min_age"
                            name="min_age"
                            type="number"
                            min="0"
                            value={newActivity.min_age || ''}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="difficulty_level">Difficulty Level</Label>
                          <Select
                            name="difficulty_level"
                            value={newActivity.difficulty_level}
                            onValueChange={(value) => setNewActivity(prev => ({...prev, difficulty_level: value}))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="easy">Easy</SelectItem>
                              <SelectItem value="moderate">Moderate</SelectItem>
                              <SelectItem value="challenging">Challenging</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="availability_status">Availability Status</Label>
                          <Select
                            name="availability_status"
                            value={newActivity.availability_status}
                            onValueChange={(value) => setNewActivity(prev => ({...prev, availability_status: value}))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="available">Available</SelectItem>
                              <SelectItem value="unavailable">Unavailable</SelectItem>
                              <SelectItem value="seasonal">Seasonal</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="start_time">Start Time</Label>
                          <Input
                            id="start_time"
                            name="start_time"
                            type="time"
                            value={newActivity.start_time}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div>
                          <Label htmlFor="end_time">End Time</Label>
                          <Input
                            id="end_time"
                            name="end_time"
                            type="time"
                            value={newActivity.end_time}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="meeting_point">Meeting Point</Label>
                        <Input
                          id="meeting_point"
                          name="meeting_point"
                          value={newActivity.meeting_point}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="safety_requirements">Safety Requirements</Label>
                        <Textarea
                          id="safety_requirements"
                          name="safety_requirements"
                          value={newActivity.safety_requirements}
                          onChange={handleInputChange}
                          rows={2}
                        />
                      </div>
                      <div>
                        <Label htmlFor="cancellation_policy">Cancellation Policy</Label>
                        <Textarea
                          id="cancellation_policy"
                          name="cancellation_policy"
                          value={newActivity.cancellation_policy}
                          onChange={handleInputChange}
                          rows={2}
                        />
                      </div>
                      <div>
                        <Label htmlFor="booking_deadline_hours">Booking Deadline (Hours)</Label>
                        <Input
                          id="booking_deadline_hours"
                          name="booking_deadline_hours"
                          type="number"
                          min="0"
                          max="168"
                          value={newActivity.booking_deadline_hours}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="inclusions">Inclusions (comma separated)</Label>
                        <Input
                          id="inclusions"
                          name="inclusions"
                          value={newActivity.inclusions.join(', ')}
                          onChange={(e) => setNewActivity(prev => ({
                            ...prev,
                            inclusions: e.target.value.split(',').map(item => item.trim()).filter(item => item)
                          }))}
                          placeholder="Equipment, Instructor, Lunch, etc."
                        />
                      </div>
                      <div>
                        <Label htmlFor="exclusions">Exclusions (comma separated)</Label>
                        <Input
                          id="exclusions"
                          name="exclusions"
                          value={newActivity.exclusions.join(', ')}
                          onChange={(e) => setNewActivity(prev => ({
                            ...prev,
                            exclusions: e.target.value.split(',').map(item => item.trim()).filter(item => item)
                          }))}
                          placeholder="Transport, Photos, etc."
                        />
                      </div>
                      <div>
                        <Label htmlFor="available_days">Available Days (comma separated)</Label>
                        <Input
                          id="available_days"
                          name="available_days"
                          value={newActivity.available_days.join(', ')}
                          onChange={(e) => setNewActivity(prev => ({
                            ...prev,
                            available_days: e.target.value.split(',').map(item => item.trim().toLowerCase()).filter(item => item)
                          }))}
                          placeholder="Monday, Wednesday, Friday, etc."
                        />
                      </div>
                      <div>
                        <Label htmlFor="photos">Photos</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            id="photos"
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFileChange}
                          />
                          <Button type="button" variant="outline" size="sm">
                            <Upload className="h-4 w-4" />
                          </Button>
                        </div>
                        {previewPhotos.length > 0 && (
                          <div className="mt-2 grid grid-cols-3 gap-2">
                            {previewPhotos.map((preview, index) => (
                              <div key={index} className="relative group">
                                <img
                                  src={preview}
                                  alt={`Preview ${index}`}
                                  className="w-full h-24 object-cover rounded"
                                />
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="destructive"
                                  className="absolute top-1 right-1 h-6 w-6 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => removePreview(index)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                      <Button onClick={handleAddActivity} className="bg-green-600 hover:bg-green-700">
                        Add Activity
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Activity Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {activities.map((activity) => (
                <Card key={activity.activity_id} className="overflow-hidden flex flex-col">
                  <div className="relative">
                    {activity.photos && activity.photos.length > 0 ? (
                      <img
                        src={activity.photos[0]}
                        alt={activity.name}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                        <MapPin className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2 flex gap-1">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-8 w-8 p-0"
                        onClick={() => startEdit(activity)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="h-8 w-8 p-0"
                        onClick={() => handleDeleteActivity(activity.activity_id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-4 flex-grow">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-lg">{activity.name}</h3>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="text-sm">{activity.average_rating || 'N/A'}</span>
                      </div>
                    </div>
                    <div className="flex items-center mt-1 text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-1" />
                      {activity.destination}
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      {activity.duration_hours > 0 ? `${activity.duration_hours}h` : ''}
                      {activity.duration_minutes > 0 ? ` ${activity.duration_minutes}m` : ''}
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <DollarSign className="h-4 w-4 mr-1" />
                      ₹{activity.price}
                    </div>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {activity.description || 'No description available'}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {activity.category && (
                        <Badge variant="secondary" className="text-xs">
                          {activity.category}
                        </Badge>
                      )}
                      {activity.difficulty_level && (
                        <Badge variant="outline" className="text-xs">
                          {activity.difficulty_level}
                        </Badge>
                      )}
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        {activity.photos?.length || 0} photos
                      </span>
                      <span className="text-sm text-gray-500">
                        {activity.total_reviews || 0} reviews
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <ActivityBookingsManagement />
        )}
      </CardContent>

      {/* Edit Activity Dialog - Responsive */}
      {editingActivity && (
        <Dialog open={!!editingActivity} onOpenChange={() => setEditingActivity(null)}>
          <DialogContent className="w-[95vw] max-w-2xl h-[95vh] max-h-[95vh] overflow-hidden flex flex-col p-0 gap-0">
            <DialogHeader className="p-4 sm:p-6 pb-2 sm:pb-4 border-b shrink-0">
              <DialogTitle>Edit Activity</DialogTitle>
            </DialogHeader>
            {/* Scrollable form content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 pt-2 sm:pt-4">
              <div className="space-y-4">
                {apiError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                    {apiError}
                  </div>
                )}
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="edit-name">Activity Name</Label>
                    <Input
                      id="edit-name"
                      name="name"
                      value={editingActivity.name || ''}
                      onChange={handleEditInputChange}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-destination">Destination</Label>
                    <Input
                      id="edit-destination"
                      name="destination"
                      value={editingActivity.destination || ''}
                      onChange={handleEditInputChange}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-category">Category</Label>
                    <Input
                      id="edit-category"
                      name="category"
                      value={editingActivity.category || ''}
                      onChange={handleEditInputChange}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-description">Description</Label>
                    <Textarea
                      id="edit-description"
                      name="description"
                      value={editingActivity.description || ''}
                      onChange={handleEditInputChange}
                      rows={3}
                      className="w-full resize-none"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-duration_hours">Duration (Hours)</Label>
                      <Input
                        id="edit-duration_hours"
                        name="duration_hours"
                        type="number"
                        min="0"
                        step="any"
                        value={editingActivity.duration_hours || ''}
                        onChange={handleEditInputChange}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-duration_minutes">Duration (Minutes)</Label>
                      <Input
                        id="edit-duration_minutes"
                        name="duration_minutes"
                        type="number"
                        min="0"
                        max="59"
                        value={editingActivity.duration_minutes || ''}
                        onChange={handleEditInputChange}
                        className="w-full"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-price">Price</Label>
                      <Input
                        id="edit-price"
                        name="price"
                        type="number"
                        min="0"
                        step="any"
                        value={editingActivity.price || ''}
                        onChange={handleEditInputChange}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-currency">Currency</Label>
                      <Input
                        id="edit-currency"
                        name="currency"
                        value={editingActivity.currency || ''}
                        onChange={handleEditInputChange}
                        className="w-full"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-max_participants">Max Participants</Label>
                      <Input
                        id="edit-max_participants"
                        name="max_participants"
                        type="number"
                        min="1"
                        value={editingActivity.max_participants || ''}
                        onChange={handleEditInputChange}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-min_age">Minimum Age</Label>
                      <Input
                        id="edit-min_age"
                        name="min_age"
                        type="number"
                        min="0"
                        value={editingActivity.min_age || ''}
                        onChange={handleEditInputChange}
                        className="w-full"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-difficulty_level">Difficulty Level</Label>
                      <Select
                        name="difficulty_level"
                        value={editingActivity.difficulty_level || 'easy'}
                        onValueChange={(value) => setEditingActivity(prev => ({...prev, difficulty_level: value}))}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="easy">Easy</SelectItem>
                          <SelectItem value="moderate">Moderate</SelectItem>
                          <SelectItem value="challenging">Challenging</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="edit-availability_status">Availability Status</Label>
                      <Select
                        name="availability_status"
                        value={editingActivity.availability_status || 'available'}
                        onValueChange={(value) => setEditingActivity(prev => ({...prev, availability_status: value}))}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="available">Available</SelectItem>
                          <SelectItem value="unavailable">Unavailable</SelectItem>
                          <SelectItem value="seasonal">Seasonal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-start_time">Start Time</Label>
                      <Input
                        id="edit-start_time"
                        name="start_time"
                        type="time"
                        value={editingActivity.start_time || ''}
                        onChange={handleEditInputChange}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-end_time">End Time</Label>
                      <Input
                        id="edit-end_time"
                        name="end_time"
                        type="time"
                        value={editingActivity.end_time || ''}
                        onChange={handleEditInputChange}
                        className="w-full"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="edit-meeting_point">Meeting Point</Label>
                    <Input
                      id="edit-meeting_point"
                      name="meeting_point"
                      value={editingActivity.meeting_point || ''}
                      onChange={handleEditInputChange}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-safety_requirements">Safety Requirements</Label>
                    <Textarea
                      id="edit-safety_requirements"
                      name="safety_requirements"
                      value={editingActivity.safety_requirements || ''}
                      onChange={handleEditInputChange}
                      rows={2}
                      className="w-full resize-none"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-cancellation_policy">Cancellation Policy</Label>
                    <Textarea
                      id="edit-cancellation_policy"
                      name="cancellation_policy"
                      value={editingActivity.cancellation_policy || ''}
                      onChange={handleEditInputChange}
                      rows={2}
                      className="w-full resize-none"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-booking_deadline_hours">Booking Deadline (Hours)</Label>
                    <Input
                      id="edit-booking_deadline_hours"
                      name="booking_deadline_hours"
                      type="number"
                      min="0"
                      max="168"
                      value={editingActivity.booking_deadline_hours || ''}
                      onChange={handleEditInputChange}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-inclusions">Inclusions (comma separated)</Label>
                    <Input
                      id="edit-inclusions"
                      name="inclusions"
                      value={editingActivity.inclusions?.join(', ') || ''}
                      onChange={(e) => setEditingActivity(prev => ({
                        ...prev,
                        inclusions: e.target.value.split(',').map(item => item.trim()).filter(item => item)
                      }))}
                      placeholder="Equipment, Instructor, Lunch, etc."
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-exclusions">Exclusions (comma separated)</Label>
                    <Input
                      id="edit-exclusions"
                      name="exclusions"
                      value={editingActivity.exclusions?.join(', ') || ''}
                      onChange={(e) => setEditingActivity(prev => ({
                        ...prev,
                        exclusions: e.target.value.split(',').map(item => item.trim()).filter(item => item)
                      }))}
                      placeholder="Transport, Photos, etc."
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-available_days">Available Days (comma separated)</Label>
                    <Input
                      id="edit-available_days"
                      name="available_days"
                      value={editingActivity.available_days?.join(', ') || ''}
                      onChange={(e) => setEditingActivity(prev => ({
                        ...prev,
                        available_days: e.target.value.split(',').map(item => item.trim().toLowerCase()).filter(item => item)
                      }))}
                      placeholder="Monday, Wednesday, Friday, etc."
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-photos">Add Photos</Label>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                      <Input
                        id="edit-photos"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleEditFileChange}
                        className="flex-1"
                      />
                      <Button type="button" variant="outline" size="sm" className="w-full sm:w-auto">
                        <Upload className="h-4 w-4 mr-2 sm:mr-0" />
                        <span className="sm:hidden">Upload Photos</span>
                      </Button>
                    </div>
                    {(editPreviewPhotos.length > 0 || (editingActivity.photos && editingActivity.photos.length > 0)) && (
                      <div className="mt-3 space-y-4">
                        {/* Current Photos */}
                        {editingActivity.photos && editingActivity.photos.length > 0 && (
                          <div>
                            <p className="text-sm text-gray-600 mb-2 font-medium">Current Photos:</p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              {editingActivity.photos.map((photo, index) => (
                                <div key={`existing-${index}`} className="relative group">
                                  <img
                                    src={photo}
                                    alt={`Existing ${index}`}
                                    className="w-full h-20 sm:h-24 object-cover rounded border"
                                  />
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="destructive"
                                    className="absolute top-1 right-1 h-6 w-6 p-1 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                                    onClick={() => removeExistingPhoto(index)}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {/* New Photos Preview */}
                        {editPreviewPhotos.length > 0 && (
                          <div>
                            <p className="text-sm text-gray-600 mb-2 font-medium">New Photos to Add:</p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              {editPreviewPhotos.map((photo, index) => (
                                <div key={`new-${index}`} className="relative group">
                                  <img
                                    src={photo}
                                    alt={`New Preview ${index}`}
                                    className="w-full h-20 sm:h-24 object-cover rounded border-2 border-green-200"
                                  />
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="destructive"
                                    className="absolute top-1 right-1 h-6 w-6 p-1 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                                    onClick={() => removePreview(index, true)}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* Fixed footer with action buttons */}
            <div className="p-4 sm:p-6 pt-2 sm:pt-4 border-t bg-white shrink-0">
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingActivity(null)}
                  className="w-full sm:w-auto order-2 sm:order-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdateActivity}
                  className="bg-green-600 hover:bg-green-700 w-full sm:w-auto order-1 sm:order-2"
                >
                  Update Activity
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
};

export default AdminActivities;