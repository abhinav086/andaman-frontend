// src/admin/AdminActivities.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Edit,
  Trash2,
  MapPin,
  Plus,
  Upload,
  X,
  Calendar,
  Eye,
  RefreshCw,
  AlertCircle,
  DollarSign,
  Star,
  Users as UsersIcon,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { API_BASE_URL } from '../config/api';

// Helper function to handle auth errors
const useAuthError = () => {
  const navigate = useNavigate();
  const handleAuthError = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    alert('Your session has expired or you do not have admin privileges. Please log in again.');
    navigate('/login');
  };
  const checkAuthAndRole = () => {
    const token = localStorage.getItem('accessToken');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!token) {
      handleAuthError();
      return false;
    }
    if (user.role !== 'admin') {
      alert('Access denied. Admin privileges required.');
      navigate('/');
      return false;
    }
    return true;
  };
  return { handleAuthError, checkAuthAndRole };
};

// Booking Details Modal Component (unchanged)
const ActivityBookingDetailsModal = ({ booking, onClose, onUpdateStatus }) => {
  const [status, setStatus] = useState(booking?.booking_status || '');
  const [paymentStatus, setPaymentStatus] = useState(booking?.payment_status || '');
  const [loading, setLoading] = useState(false);
  const { handleAuthError } = useAuthError();

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        handleAuthError();
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/activities/bookings/${booking.booking_id}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          payment_status: paymentStatus,
        }),
      });

      if (response.status === 401 || response.status === 403) {
        handleAuthError();
        return;
      }

      if (response.ok) {
        const result = await response.json();
        onUpdateStatus(result.data);
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
              <p className="text-sm bg-gray-100 p-2 rounded">{booking.full_name || 'N/A'}</p>
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

// Bookings Management Component (unchanged)
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
    total: 0,
  });
  const { handleAuthError, checkAuthAndRole } = useAuthError();

  useEffect(() => {
    if (checkAuthAndRole()) {
      fetchBookings();
    }
  }, [filter, paymentFilter, pagination.page]);

  const fetchBookings = async () => {
    setLoading(true);
    setApiError('');
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        handleAuthError();
        return;
      }

      const params = new URLSearchParams();
      if (filter !== 'all') params.append('status', filter);
      if (paymentFilter !== 'all') params.append('payment_status', paymentFilter);
      params.append('limit', pagination.limit.toString());
      params.append('page', pagination.page.toString());

      const url = `${API_BASE_URL}/api/activities/bookings/admin/all${params.toString() ? '?' + params.toString() : ''}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401 || response.status === 403) {
        handleAuthError();
        return;
      }

      if (response.ok) {
        const data = await response.json();
        setBookings(data.data.bookings || []);
        if (data.data.pagination) {
          setPagination((prev) => ({
            ...prev,
            total: data.data.pagination.total || 0,
          }));
        }
        setApiError('');
      } else {
        const errorData = await response.json().catch(() => ({}));
        setApiError(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setApiError(`Network error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = (updatedBooking) => {
    setBookings((bookings) =>
      bookings.map((b) => (b.booking_id === updatedBooking.booking_id ? updatedBooking : b))
    );
  };

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
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401 || response.status === 403) {
        handleAuthError();
        return;
      }

      if (response.ok) {
        const result = await response.json();
        setBookings((bookings) =>
          bookings.map((b) => (b.booking_id === bookingId ? result.data : b))
        );
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

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'confirmed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      case 'completed':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getPaymentStatusBadgeVariant = (status) => {
    switch (status) {
      case 'paid':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'refunded':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin mr-2" />
        <p>Loading bookings...</p>
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
          <Button variant="outline" onClick={fetchBookings}>
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
              <p className="text-sm text-red-600">{apiError}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchBookings}
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
          <p className="text-gray-500">
            {filter !== 'all' || paymentFilter !== 'all'
              ? 'No bookings match your current filters.'
              : 'No bookings have been made yet.'}
          </p>
        </div>
      )}

      {bookings.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bookings.map((booking) => (
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
                      <Badge
                        variant={getPaymentStatusBadgeVariant(booking.payment_status)}
                        className="text-xs"
                      >
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
                      {booking.participants_count} Participant
                      {booking.participants_count !== 1 ? 's' : ''}
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

// Main Admin Activities Component
const AdminActivities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newActivity, setNewActivity] = useState({
    name: '',
    description: '',
    destination: '',
    duration_hours: 1,
    duration_minutes: 0,
    price: 0,
    currency: 'INR',
    max_participants: 10,
    min_age: 5,
    difficulty_level: 'easy',
    category: 'adventure',
    meeting_point: '',
    safety_requirements: '',
    cancellation_policy: 'Free cancellation up to 24 hours before.',
    inclusions: [],
    exclusions: [],
    available_days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    start_time: '09:00',
    end_time: '17:00',
    booking_deadline_hours: 24,
    availability_status: 'available',
  });
  const [errors, setErrors] = useState({});
  const [photos, setPhotos] = useState([]);
  const [previewPhotos, setPreviewPhotos] = useState([]);
  const [apiError, setApiError] = useState('');
  const [activeTab, setActiveTab] = useState('activities');

  // NEW STATES FOR UPDATE
  const [editingActivity, setEditingActivity] = useState(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);

  const { handleAuthError, checkAuthAndRole } = useAuthError();
  const fileInputRef = useRef(null); // Ref for clearing file input

  useEffect(() => {
    if (activeTab === 'activities' && checkAuthAndRole()) {
      fetchActivities();
    }
  }, [activeTab]);

  const fetchActivities = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        handleAuthError();
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/activities`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401 || response.status === 403) {
        handleAuthError();
        return;
      }

      if (response.ok) {
        const result = await response.json();
        setActivities(result.data.activities || []);
        setApiError('');
      } else {
        const errorData = await response.json().catch(() => ({}));
        setApiError(errorData.message || 'Failed to fetch activities');
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
      setApiError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  // NEW: Fetch activity by ID for editing
  const fetchActivityById = async (activityId) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        handleAuthError();
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/activities/${activityId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401 || response.status === 403) {
        handleAuthError();
        return;
      }

      if (response.ok) {
        const result = await response.json();
        return result.data; // Return the activity object
      } else {
        const errorData = await response.json().catch(() => ({}));
        setApiError(errorData.message || 'Failed to fetch activity details');
        return null;
      }
    } catch (error) {
      console.error('Error fetching activity details:', error);
      setApiError('Network error occurred while fetching activity details');
      return null;
    }
  };

  // NEW: Handle opening the update dialog
  const handleOpenUpdateDialog = async (activityId) => {
    setLoading(true); // Show loading state while fetching
    const activityDetails = await fetchActivityById(activityId);
    setLoading(false); // Hide loading state

    if (activityDetails) {
      // Pre-populate form state with fetched data
      setNewActivity({
        name: activityDetails.name || '',
        description: activityDetails.description || '',
        destination: activityDetails.destination || '',
        duration_hours: activityDetails.duration_hours || 1,
        duration_minutes: activityDetails.duration_minutes || 0,
        price: activityDetails.price || 0,
        currency: activityDetails.currency || 'INR',
        max_participants: activityDetails.max_participants || 10,
        min_age: activityDetails.min_age || 5,
        difficulty_level: activityDetails.difficulty_level || 'easy',
        category: activityDetails.category || 'adventure',
        meeting_point: activityDetails.meeting_point || '',
        safety_requirements: activityDetails.safety_requirements || '',
        cancellation_policy: activityDetails.cancellation_policy || 'Free cancellation up to 24 hours before.',
        inclusions: activityDetails.inclusions || [],
        exclusions: activityDetails.exclusions || [],
        available_days: activityDetails.available_days || ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
        start_time: activityDetails.start_time || '09:00',
        end_time: activityDetails.end_time || '17:00',
        booking_deadline_hours: activityDetails.booking_deadline_hours || 24,
        availability_status: activityDetails.availability_status || 'available',
      });
      setEditingActivity(activityDetails); // Store the original activity object
      setPreviewPhotos(activityDetails.photos || []); // Show existing photos
      setPhotos([]); // Clear any new photos selected for update
      setErrors({}); // Clear any previous errors
      setIsUpdateDialogOpen(true);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewActivity((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setPhotos(files);
    const previews = files.map((file) => {
      // If it's a File object, create a URL, otherwise it's an existing URL string
      return file instanceof File ? URL.createObjectURL(file) : file;
    });
    setPreviewPhotos(previews);
  };

  const removePreview = (index) => {
    setPreviewPhotos((prev) => prev.filter((_, i) => i !== index));
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const validateActivity = () => {
    const newErrors = {};
    const name = newActivity.name?.trim();
    const destination = newActivity.destination?.trim();
    const price = parseFloat(newActivity.price);
    const category = newActivity.category;
    const meetingPoint = newActivity.meeting_point?.trim();

    if (!name || name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters long';
    }
    if (!destination || destination.length < 2) {
      newErrors.destination = 'Destination must be at least 2 characters long';
    }
    if (isNaN(price) || price <= 0) {
      newErrors.price = 'Price must be a positive number';
    }
    if (!category) {
      newErrors.category = 'Category is required';
    }
    if (!meetingPoint) {
      newErrors.meeting_point = 'Meeting point is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddActivity = async () => {
    if (!validateActivity()) return;
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        handleAuthError();
        return;
      }

      const formData = new FormData();
      // Append all required fields
      formData.append('name', newActivity.name);
      formData.append('description', newActivity.description || '');
      formData.append('destination', newActivity.destination);
      formData.append('duration_hours', newActivity.duration_hours.toString());
      formData.append('duration_minutes', newActivity.duration_minutes.toString());
      formData.append('price', newActivity.price.toString());
      formData.append('currency', newActivity.currency);
      formData.append('max_participants', newActivity.max_participants?.toString() || '10');
      formData.append('min_age', newActivity.min_age?.toString() || '5');
      formData.append('difficulty_level', newActivity.difficulty_level);
      formData.append('category', newActivity.category);
      formData.append('meeting_point', newActivity.meeting_point);
      formData.append('safety_requirements', newActivity.safety_requirements || '');
      formData.append('cancellation_policy', newActivity.cancellation_policy || '');
      formData.append('booking_deadline_hours', newActivity.booking_deadline_hours.toString());
      formData.append('availability_status', newActivity.availability_status);

      // ✅ FIXED: Append array items individually (not as JSON strings)
      newActivity.inclusions.forEach(item => formData.append('inclusions', item));
      newActivity.exclusions.forEach(item => formData.append('exclusions', item));
      newActivity.available_days.forEach(day => formData.append('available_days', day));

      // Photos
      photos.forEach((photo) => {
        formData.append('photos', photo);
      });

      // 🔥 Critical: Do NOT set Content-Type — let browser handle it
      const url = `${API_BASE_URL}/api/activities`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          // No Content-Type — let browser handle it
        },
        body: formData,
      });

      if (response.status === 401 || response.status === 403) {
        handleAuthError();
        return;
      }

      const result = await response.json();
      if (response.ok) {
        setActivities([...activities, result.data]);
        resetForm();
        setApiError('');
        alert('Activity added successfully!');
      } else {
        const errorMsg = result.message || result.error || `Failed to add activity (${response.status})`;
        setApiError(errorMsg);
        console.error('Activity creation error:', result);
      }
    } catch (error) {
      console.error('Network error:', error);
      setApiError(`Network error: ${error.message}`);
    }
  };

  // NEW: Handle updating an existing activity
  const handleUpdateActivity = async () => {
    if (!editingActivity || !validateActivity()) return;

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        handleAuthError();
        return;
      }

      const formData = new FormData();
      // Append all required fields
      formData.append('name', newActivity.name);
      formData.append('description', newActivity.description || '');
      formData.append('destination', newActivity.destination);
      formData.append('duration_hours', newActivity.duration_hours.toString());
      formData.append('duration_minutes', newActivity.duration_minutes.toString());
      formData.append('price', newActivity.price.toString());
      formData.append('currency', newActivity.currency);
      formData.append('max_participants', newActivity.max_participants?.toString() || '10');
      formData.append('min_age', newActivity.min_age?.toString() || '5');
      formData.append('difficulty_level', newActivity.difficulty_level);
      formData.append('category', newActivity.category);
      formData.append('meeting_point', newActivity.meeting_point);
      formData.append('safety_requirements', newActivity.safety_requirements || '');
      formData.append('cancellation_policy', newActivity.cancellation_policy || '');
      formData.append('booking_deadline_hours', newActivity.booking_deadline_hours.toString());
      formData.append('availability_status', newActivity.availability_status);

      // ✅ FIXED: Append array items individually (not as JSON strings)
      newActivity.inclusions.forEach(item => formData.append('inclusions', item));
      newActivity.exclusions.forEach(item => formData.append('exclusions', item));
      newActivity.available_days.forEach(day => formData.append('available_days', day));

      // Only append new photos if they exist
      if (photos.length > 0) {
        photos.forEach((photo) => {
          formData.append('photos', photo);
        });
      }

      // 🔥 Critical: Do NOT set Content-Type — let browser handle it
      const url = `${API_BASE_URL}/api/activities/${editingActivity.activity_id}`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          // No Content-Type — let browser handle it
        },
        body: formData,
      });

      if (response.status === 401 || response.status === 403) {
        handleAuthError();
        return;
      }

      const result = await response.json();
      if (response.ok) {
        // Update the activity in the local state
        setActivities(activities.map(activity => 
          activity.activity_id === editingActivity.activity_id ? result.data : activity
        ));
        resetForm(); // This also closes the update dialog
        setApiError('');
        alert('Activity updated successfully!');
      } else {
        const errorMsg = result.message || result.error || `Failed to update activity (${response.status})`;
        setApiError(errorMsg);
        console.error('Activity update error:', result);
      }
    } catch (error) {
      console.error('Network error:', error);
      setApiError(`Network error: ${error.message}`);
    }
  };

  const resetForm = () => {
    setNewActivity({
      name: '',
      description: '',
      destination: '',
      duration_hours: 1,
      duration_minutes: 0,
      price: 0,
      currency: 'INR',
      max_participants: 10,
      min_age: 5,
      difficulty_level: 'easy',
      category: 'adventure',
      meeting_point: '',
      safety_requirements: '',
      cancellation_policy: 'Free cancellation up to 24 hours before.',
      inclusions: [],
      exclusions: [],
      available_days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      start_time: '09:00',
      end_time: '17:00',
      booking_deadline_hours: 24,
      availability_status: 'available',
    });
    setPhotos([]);
    setPreviewPhotos([]);
    setErrors({});
    setEditingActivity(null); // Clear editing state
    setIsUpdateDialogOpen(false); // Close update dialog
    if (fileInputRef.current) fileInputRef.current.value = ''; // Clear file input ref
  };

  const handleDeleteActivity = async (activityId) => {
    if (!window.confirm('Are you sure you want to delete this activity?')) return;
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        handleAuthError();
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/activities/${activityId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401 || response.status === 403) {
        handleAuthError();
        return;
      }

      if (response.ok) {
        setActivities(activities.filter((activity) => activity.activity_id !== activityId));
        setApiError('');
        alert('Activity deleted successfully!');
      } else {
        const errorData = await response.json().catch(() => ({}));
        setApiError(errorData.message || 'Failed to delete activity');
      }
    } catch (error) {
      console.error('Network error:', error);
      setApiError('Network error occurred');
    }
  };

  if (loading && activeTab === 'activities') {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin mr-2" />
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
        <div className="mx-6 mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
          {apiError}
        </div>
      )}

      <CardContent>
        {activeTab === 'activities' ? (
          <>
            <div className="mb-6">
              {/* Dialog for Adding Activity */}
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
                    <div>
                      <Label htmlFor="name">Activity Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={newActivity.name}
                        onChange={handleInputChange}
                        className={errors.name ? 'border-red-500' : ''}
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
                        className={errors.destination ? 'border-red-500' : ''}
                      />
                      {errors.destination && <p className="text-red-500 text-sm mt-1">{errors.destination}</p>}
                    </div>
                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <Select
                        value={newActivity.category}
                        onValueChange={(value) => setNewActivity((prev) => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="adventure">Adventure</SelectItem>
                          <SelectItem value="cultural">Cultural</SelectItem>
                          <SelectItem value="nature">Nature</SelectItem>
                          <SelectItem value="food">Food</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                    </div>
                    <div>
                      <Label htmlFor="price">Price *</Label>
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        value={newActivity.price}
                        onChange={handleInputChange}
                        className={errors.price ? 'border-red-500' : ''}
                      />
                      {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                    </div>
                    <div>
                      <Label htmlFor="meeting_point">Meeting Point *</Label>
                      <Input
                        id="meeting_point"
                        name="meeting_point"
                        value={newActivity.meeting_point}
                        onChange={handleInputChange}
                        className={errors.meeting_point ? 'border-red-500' : ''}
                      />
                      {errors.meeting_point && (
                        <p className="text-red-500 text-sm mt-1">{errors.meeting_point}</p>
                      )}
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
                    <div>
                      <Label htmlFor="photos">Photos</Label>
                      <Input id="photos" type="file" multiple accept="image/*" onChange={handleFileChange} ref={fileInputRef} />
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
                                className="absolute top-1 right-1 h-6 w-6 p-1 opacity-0 group-hover:opacity-100"
                                onClick={() => removePreview(index)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
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

            {/* Dialog for Updating Activity */}
            <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Update Activity</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Activity Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={newActivity.name}
                        onChange={handleInputChange}
                        className={errors.name ? 'border-red-500' : ''}
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
                        className={errors.destination ? 'border-red-500' : ''}
                      />
                      {errors.destination && <p className="text-red-500 text-sm mt-1">{errors.destination}</p>}
                    </div>
                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <Select
                        value={newActivity.category}
                        onValueChange={(value) => setNewActivity((prev) => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="adventure">Adventure</SelectItem>
                          <SelectItem value="cultural">Cultural</SelectItem>
                          <SelectItem value="nature">Nature</SelectItem>
                          <SelectItem value="food">Food</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                    </div>
                    <div>
                      <Label htmlFor="price">Price *</Label>
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        value={newActivity.price}
                        onChange={handleInputChange}
                        className={errors.price ? 'border-red-500' : ''}
                      />
                      {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                    </div>
                    <div>
                      <Label htmlFor="meeting_point">Meeting Point *</Label>
                      <Input
                        id="meeting_point"
                        name="meeting_point"
                        value={newActivity.meeting_point}
                        onChange={handleInputChange}
                        className={errors.meeting_point ? 'border-red-500' : ''}
                      />
                      {errors.meeting_point && (
                        <p className="text-red-500 text-sm mt-1">{errors.meeting_point}</p>
                      )}
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
                    <div>
                      <Label htmlFor="photos">Photos (Select new to replace existing)</Label>
                      <Input id="photos" type="file" multiple accept="image/*" onChange={handleFileChange} ref={fileInputRef} />
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
                                className="absolute top-1 right-1 h-6 w-6 p-1 opacity-0 group-hover:opacity-100"
                                onClick={() => removePreview(index)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                      <Button variant="outline" onClick={resetForm}>
                        Cancel
                      </Button>
                      <Button onClick={handleUpdateActivity} className="bg-blue-600 hover:bg-blue-700">
                        Update Activity
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {activities.map((activity) => (
                <Card key={activity.activity_id} className="overflow-hidden">
                  <div className="relative">
                    {activity.photos && activity.photos.length > 0 ? (
                      <img src={activity.photos[0]} alt={activity.name} className="w-full h-48 object-cover" />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                        <MapPin className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2 flex gap-1">
                      {/* NEW: Edit Button */}
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => handleOpenUpdateDialog(activity.activity_id)}
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
                  <CardContent className="p-4">
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
                      <DollarSign className="h-4 w-4 mr-1" />
                      ₹{activity.price}
                    </div>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {activity.description || 'No description available'}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <ActivityBookingsManagement />
        )}
      </CardContent>
    </Card>
  );
};

export default AdminActivities;