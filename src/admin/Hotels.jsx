// src/admin/Hotels.jsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Building, Plus, Upload, X, Calendar, User, Check, XCircle, Clock, Eye, RefreshCw, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { API_BASE_URL } from '../config/api';

// Booking Details Modal Component
const BookingDetailsModal = ({ booking, onClose, onUpdateStatus }) => {
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

      const response = await fetch(`${API_BASE_URL}/api/bookings/hotel/${booking.booking_id}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          booking_status: status,
          payment_status: paymentStatus
        })
      });

      if (response.ok) {
        const result = await response.json();
        onUpdateStatus(result.booking);
        onClose();
        alert('Booking status updated successfully');
      } else {
        const error = await response.json();
        alert(`Update failed: ${error.msg || error.message || 'Unknown error'}`);
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
          <DialogTitle>Booking Details</DialogTitle>
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
              <p className="text-sm bg-gray-100 p-2 rounded">{booking.user_name || 'N/A'}</p>
            </div>
            <div>
              <Label>Hotel</Label>
              <p className="text-sm bg-gray-100 p-2 rounded">{booking.hotel_name || 'N/A'}</p>
            </div>
            <div>
              <Label>Check-in</Label>
              <p className="text-sm bg-gray-100 p-2 rounded">
                {booking.check_in_date ? new Date(booking.check_in_date).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            <div>
              <Label>Check-out</Label>
              <p className="text-sm bg-gray-100 p-2 rounded">
                {booking.check_out_date ? new Date(booking.check_out_date).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            <div>
              <Label>Guests</Label>
              <p className="text-sm bg-gray-100 p-2 rounded">{booking.num_guests || 'N/A'}</p>
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
                  <SelectItem value="checked_in">Checked In</SelectItem>
                  <SelectItem value="checked_out">Checked Out</SelectItem>
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

// Bookings Management Component
const BookingsManagement = () => {
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
      
      const url = `${API_BASE_URL}/api/bookings/hotel/all${params.toString() ? '?' + params.toString() : ''}`;
      
      console.log('Fetching bookings from:', url); // Debug log
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
        console.log('Response data:', data); // Debug log
        
        setBookings(data.bookings || []);
        
        if (data.pagination) {
          setPagination(prev => ({
            ...prev,
            total: data.pagination.total || 0
          }));
        }
        
        setApiError('');
      } else {
        // Try to get error message from response
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        
        try {
          const errorData = await response.json();
          errorMessage = errorData.msg || errorData.message || errorMessage;
          console.log('Error response data:', errorData); // Debug log
        } catch (e) {
          // If response is not JSON, use the text
          try {
            const errorText = await response.text();
            errorMessage = errorText || errorMessage;
            console.log('Error response text:', errorText); // Debug log
          } catch (e2) {
            // Use default error message
            console.log('Could not parse error response'); // Debug log
          }
        }
        
        console.error('Failed to fetch bookings:', errorMessage);
        setApiError(`Failed to fetch bookings: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
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

      const response = await fetch(`${API_BASE_URL}/api/bookings/hotel/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          booking_status: 'cancelled',
          payment_status: 'refunded'
        })
      });

      if (response.ok) {
        const result = await response.json();
        setBookings(bookings.map(b => 
          b.booking_id === bookingId ? result.booking : b
        ));
        alert('Booking cancelled successfully');
      } else {
        const error = await response.json();
        alert(`Cancellation failed: ${error.msg || error.message || 'Unknown error'}`);
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
      case 'checked_in': return 'default';
      case 'checked_out': return 'outline';
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
        <p>Loading bookings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold">All Bookings</h3>
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
              <SelectItem value="checked_in">Checked In</SelectItem>
              <SelectItem value="checked_out">Checked Out</SelectItem>
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
                  <li>Verify the API endpoint is correct: {API_BASE_URL}/api/bookings/hotel/all</li>
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
          {bookings.map(booking => (
            <Card key={booking.booking_id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h4 className="font-bold text-base">{booking.hotel_name || 'Unknown Hotel'}</h4>
                    <p className="text-sm text-gray-600">{booking.user_name || 'Unknown User'}</p>
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
                  {booking.check_in_date && booking.check_out_date && (
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      {new Date(booking.check_in_date).toLocaleDateString()} - {new Date(booking.check_out_date).toLocaleDateString()}
                    </div>
                  )}
                  
                  {booking.num_guests && (
                    <div className="flex items-center text-sm">
                      <User className="h-4 w-4 mr-2 text-gray-500" />
                      {booking.num_guests} {booking.num_guests === 1 ? 'Guest' : 'Guests'}
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
        <BookingDetailsModal 
          booking={selectedBooking} 
          onClose={() => setSelectedBooking(null)}
          onUpdateStatus={handleStatusUpdate}
        />
      )}
    </div>
  );
};

const Hotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newHotel, setNewHotel] = useState({
    name: '',
    city: '',
    country: '',
    address: '',
    description: '',
    star_rating: 3,
    zip_code: '',
    latitude: '',
    longitude: '',
    check_in_time: '',
    check_out_time: '',
    contact_phone: '',
    contact_email: '',
    website_url: '',
    booking_link: '',
    amenities: [],
    room_types: []
  });
  const [errors, setErrors] = useState({});
  const [photos, setPhotos] = useState([]);
  const [previewPhotos, setPreviewPhotos] = useState([]);
  const [editingHotel, setEditingHotel] = useState(null);
  const [editPhotos, setEditPhotos] = useState([]);
  const [editPreviewPhotos, setEditPreviewPhotos] = useState([]);
  const [apiError, setApiError] = useState('');
  const [activeTab, setActiveTab] = useState('hotels'); // 'hotels' or 'bookings'

  useEffect(() => {
    if (activeTab === 'hotels') {
      fetchHotels();
    }
  }, [activeTab]);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewHotel(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingHotel(prev => ({
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
    setEditingHotel(prev => ({
      ...prev,
      photos: prev.photos?.filter((_, i) => i !== index) || []
    }));
  };

  const validateHotel = () => {
    const newErrors = {};
    if (!newHotel.name) newErrors.name = 'Name is required';
    if (!newHotel.city) newErrors.city = 'City is required';
    if (!newHotel.country) newErrors.country = 'Country is required';
    if (!newHotel.address) newErrors.address = 'Address is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Helper function to sanitize form data
  const sanitizeFormData = (data) => {
    const sanitized = {};
    Object.keys(data).forEach(key => {
      const value = data[key];
      // Handle different field types
      if (key === 'amenities' || key === 'room_types') {
        // Arrays should be preserved
        sanitized[key] = value || [];
      } else if (key === 'latitude' || key === 'longitude') {
        // Only include if it's a valid number
        if (value !== '' && value !== null && value !== undefined && !isNaN(parseFloat(value))) {
          sanitized[key] = parseFloat(value);
        }
      } else if (key === 'website_url' || key === 'booking_link') {
        // Only include if it's a valid URL or empty
        if (value && value.trim() !== '') {
          sanitized[key] = value.trim();
        }
      } else if (key === 'star_rating') {
        // Ensure it's a number
        sanitized[key] = parseInt(value) || 3;
      } else if (value !== null && value !== undefined && value !== '') {
        // Include non-empty values
        sanitized[key] = value;
      }
    });
    return sanitized;
  };

  const handleAddHotel = async () => {
    if (!validateHotel()) return;
    try {
      const token = localStorage.getItem('accessToken');
      const formData = new FormData();
      // Sanitize the hotel data before adding to form
      const sanitizedData = sanitizeFormData(newHotel);
      // Add text fields (excluding arrays for now)
      Object.keys(sanitizedData).forEach(key => {
        if (key !== 'amenities' && key !== 'room_types') {
          formData.append(key, sanitizedData[key]);
        }
      });
      // Add array fields as JSON strings
      formData.append('amenities', JSON.stringify(sanitizedData.amenities || []));
      formData.append('room_types', JSON.stringify(sanitizedData.room_types || []));
      // Add photos
      photos.forEach(photo => {
        formData.append('photos', photo);
      });
      const response = await fetch(`${API_BASE_URL}/api/hotels`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      const responseText = await response.text();
      if (!response.ok) {
        console.error('Server Error:', response.status, responseText);
        setApiError(`Failed to add hotel: ${response.status} - ${response.statusText}`);
        return;
      }
      try {
        const result = JSON.parse(responseText);
        setHotels([...hotels, result.hotel]);
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
    setNewHotel({
      name: '',
      city: '',
      country: '',
      address: '',
      description: '',
      star_rating: 3,
      zip_code: '',
      latitude: '',
      longitude: '',
      check_in_time: '',
      check_out_time: '',
      contact_phone: '',
      contact_email: '',
      website_url: '',
      booking_link: '',
      amenities: [],
      room_types: []
    });
    setPhotos([]);
    setPreviewPhotos([]);
  };

  const handleUpdateHotel = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const formData = new FormData();
      // Sanitize the editing hotel data
      const sanitizedData = sanitizeFormData(editingHotel);
      // Add text fields (excluding photos and arrays)
      Object.keys(sanitizedData).forEach(key => {
        if (key === 'amenities' || key === 'room_types') {
          // Add array fields as JSON strings
          formData.append(key, JSON.stringify(sanitizedData[key] || []));
        } else if (key !== 'photos') {
          // Skip photos - handle separately
          formData.append(key, sanitizedData[key]);
        }
      });
      // Handle existing photos - send the current photos array (after any removals)
      const remainingPhotos = editingHotel.photos || [];
      formData.append('existing_photos', JSON.stringify(remainingPhotos));
      // Add new photos
      editPhotos.forEach(photo => {
        formData.append('photos', photo);
      });
      const response = await fetch(`${API_BASE_URL}/api/hotels/${editingHotel.hotel_id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      const responseText = await response.text();
      if (!response.ok) {
        console.error('Update Error:', response.status, responseText);
        setApiError(`Failed to update hotel: ${response.status} - ${response.statusText}`);
        return;
      }
      try {
        const result = JSON.parse(responseText);
        setHotels(hotels.map(hotel => 
          hotel.hotel_id === editingHotel.hotel_id ? result.hotel : hotel
        ));
        setEditingHotel(null);
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

  const handleDeleteHotel = async (hotelId) => {
    if (!window.confirm('Are you sure you want to delete this hotel?')) return;
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_BASE_URL}/api/hotels/${hotelId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const responseText = await response.text();
      if (!response.ok) {
        console.error('Delete Error:', response.status, responseText);
        setApiError(`Failed to delete hotel: ${response.status} - ${response.statusText}`);
        return;
      }
      setHotels(hotels.filter(hotel => hotel.hotel_id !== hotelId));
      setApiError('');
    } catch (error) {
      console.error('Network error:', error);
      setApiError('Network error occurred');
    }
  };

  const startEdit = (hotel) => {
    setEditingHotel({ ...hotel });
    setEditPhotos([]);
    setEditPreviewPhotos([]);
  };

  if (loading && activeTab === 'hotels') {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading hotels...</p>
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <CardTitle className="text-2xl">Hotel Management</CardTitle>
          <CardDescription>Manage your hotels and bookings</CardDescription>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex space-x-2">
          <Button
            variant={activeTab === 'hotels' ? 'default' : 'outline'}
            onClick={() => setActiveTab('hotels')}
          >
            <Building className="mr-2 h-4 w-4" />
            Hotels
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
        {activeTab === 'hotels' ? (
          <>
            {/* Add Hotel Button */}
            <div className="mb-6">
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" /> Add Hotel
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Hotel</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    {apiError && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                        {apiError}
                      </div>
                    )}
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <Label htmlFor="name">Hotel Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={newHotel.name}
                          onChange={handleInputChange}
                          className={errors.name ? "border-red-500" : ""}
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                      </div>
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          name="city"
                          value={newHotel.city}
                          onChange={handleInputChange}
                          className={errors.city ? "border-red-500" : ""}
                        />
                        {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                      </div>
                      <div>
                        <Label htmlFor="country">Country *</Label>
                        <Input
                          id="country"
                          name="country"
                          value={newHotel.country}
                          onChange={handleInputChange}
                          className={errors.country ? "border-red-500" : ""}
                        />
                        {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
                      </div>
                      <div>
                        <Label htmlFor="address">Address *</Label>
                        <Input
                          id="address"
                          name="address"
                          value={newHotel.address}
                          onChange={handleInputChange}
                          className={errors.address ? "border-red-500" : ""}
                        />
                        {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                      </div>
                      <div>
                        <Label htmlFor="zip_code">ZIP Code</Label>
                        <Input
                          id="zip_code"
                          name="zip_code"
                          value={newHotel.zip_code}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="star_rating">Star Rating</Label>
                        <Select
                          name="star_rating"
                          value={newHotel.star_rating}
                          onValueChange={(value) => setNewHotel(prev => ({...prev, star_rating: parseInt(value)}))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5].map(rating => (
                              <SelectItem key={rating} value={rating.toString()}>{rating} Star{rating > 1 ? 's' : ''}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="latitude">Latitude</Label>
                        <Input
                          id="latitude"
                          name="latitude"
                          type="number"
                          step="any"
                          value={newHotel.latitude}
                          onChange={handleInputChange}
                          placeholder="e.g. 40.7128"
                        />
                      </div>
                      <div>
                        <Label htmlFor="longitude">Longitude</Label>
                        <Input
                          id="longitude"
                          name="longitude"
                          type="number"
                          step="any"
                          value={newHotel.longitude}
                          onChange={handleInputChange}
                          placeholder="e.g. -74.0060"
                        />
                      </div>
                      <div>
                        <Label htmlFor="contact_phone">Phone</Label>
                        <Input
                          id="contact_phone"
                          name="contact_phone"
                          value={newHotel.contact_phone}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="contact_email">Email</Label>
                        <Input
                          id="contact_email"
                          name="contact_email"
                          type="email"
                          value={newHotel.contact_email}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="website_url">Website</Label>
                        <Input
                          id="website_url"
                          name="website_url"
                          type="url"
                          value={newHotel.website_url}
                          onChange={handleInputChange}
                          placeholder="https://example.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="booking_link">Booking Link</Label>
                        <Input
                          id="booking_link"
                          name="booking_link"
                          type="url"
                          value={newHotel.booking_link}
                          onChange={handleInputChange}
                          placeholder="https://booking.example.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="check_in_time">Check-in Time</Label>
                        <Input
                          id="check_in_time"
                          name="check_in_time"
                          type="time"
                          value={newHotel.check_in_time}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="check_out_time">Check-out Time</Label>
                        <Input
                          id="check_out_time"
                          name="check_out_time"
                          type="time"
                          value={newHotel.check_out_time}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          name="description"
                          value={newHotel.description}
                          onChange={handleInputChange}
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor="amenities">Amenities (comma separated)</Label>
                        <Input
                          id="amenities"
                          name="amenities"
                          value={newHotel.amenities.join(', ')}
                          onChange={(e) => setNewHotel(prev => ({
                            ...prev,
                            amenities: e.target.value.split(',').map(item => item.trim()).filter(item => item)
                          }))}
                          placeholder="WiFi, Pool, Gym, etc."
                        />
                      </div>
                      <div>
                        <Label htmlFor="room_types">Room Types (comma separated)</Label>
                        <Input
                          id="room_types"
                          name="room_types"
                          value={newHotel.room_types.join(', ')}
                          onChange={(e) => setNewHotel(prev => ({
                            ...prev,
                            room_types: e.target.value.split(',').map(item => item.trim()).filter(item => item)
                          }))}
                          placeholder="Standard, Deluxe, Suite, etc."
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
                      <Button onClick={handleAddHotel} className="bg-green-600 hover:bg-green-700">
                        Add Hotel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Hotel Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotels.map((hotel) => (
                <Card key={hotel.hotel_id} className="overflow-hidden flex flex-col">
                  <div className="relative">
                    {hotel.photos && hotel.photos.length > 0 ? (
                      <img 
                        src={hotel.photos[0]} 
                        alt={hotel.name} 
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                        <Building className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2 flex gap-1">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-8 w-8 p-0"
                        onClick={() => startEdit(hotel)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="h-8 w-8 p-0"
                        onClick={() => handleDeleteHotel(hotel.hotel_id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-4 flex-grow">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-lg">{hotel.name}</h3>
                      <Badge variant="outline" className="text-sm">
                        {hotel.star_rating || 'N/A'}★
                      </Badge>
                    </div>
                    <div className="flex items-center mt-1 text-sm text-gray-600">
                      <span className="mr-1">📍</span>
                      {hotel.city}, {hotel.country}
                    </div>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {hotel.description || 'No description available'}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {hotel.amenities?.slice(0, 3).map((amenity, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {amenity}
                        </Badge>
                      ))}
                      {hotel.amenities && hotel.amenities.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{hotel.amenities.length - 3} more
                        </Badge>
                      )}
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        {hotel.photos?.length || 0} photos
                      </span>
                      <span className="text-sm text-gray-500">
                        {hotel.total_reviews || 0} reviews
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <BookingsManagement />
        )}
      </CardContent>
      
      {/* Edit Hotel Dialog - Responsive */}
      {editingHotel && (
        <Dialog open={!!editingHotel} onOpenChange={() => setEditingHotel(null)}>
          <DialogContent className="w-[95vw] max-w-2xl h-[95vh] max-h-[95vh] overflow-hidden flex flex-col p-0 gap-0">
            <DialogHeader className="p-4 sm:p-6 pb-2 sm:pb-4 border-b shrink-0">
              <DialogTitle>Edit Hotel</DialogTitle>
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
                    <Label htmlFor="edit-name">Hotel Name</Label>
                    <Input
                      id="edit-name"
                      name="name"
                      value={editingHotel.name || ''}
                      onChange={handleEditInputChange}
                      className="w-full"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-city">City</Label>
                      <Input
                        id="edit-city"
                        name="city"
                        value={editingHotel.city || ''}
                        onChange={handleEditInputChange}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-country">Country</Label>
                      <Input
                        id="edit-country"
                        name="country"
                        value={editingHotel.country || ''}
                        onChange={handleEditInputChange}
                        className="w-full"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="edit-address">Address</Label>
                    <Input
                      id="edit-address"
                      name="address"
                      value={editingHotel.address || ''}
                      onChange={handleEditInputChange}
                      className="w-full"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-zip_code">ZIP Code</Label>
                      <Input
                        id="edit-zip_code"
                        name="zip_code"
                        value={editingHotel.zip_code || ''}
                        onChange={handleEditInputChange}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-star_rating">Star Rating</Label>
                      <Select
                        name="star_rating"
                        value={editingHotel.star_rating?.toString() || '3'}
                        onValueChange={(value) => setEditingHotel(prev => ({...prev, star_rating: parseInt(value)}))}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5].map(rating => (
                            <SelectItem key={rating} value={rating.toString()}>{rating} Star{rating > 1 ? 's' : ''}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-latitude">Latitude</Label>
                      <Input
                        id="edit-latitude"
                        name="latitude"
                        type="number"
                        step="any"
                        value={editingHotel.latitude || ''}
                        onChange={handleEditInputChange}
                        placeholder="e.g. 40.7128"
                        className="w-full"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-longitude">Longitude</Label>
                      <Input
                        id="edit-longitude"
                        name="longitude"
                        type="number"
                        step="any"
                        value={editingHotel.longitude || ''}
                        onChange={handleEditInputChange}
                        placeholder="e.g. -74.0060"
                        className="w-full"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-contact_phone">Phone</Label>
                      <Input
                        id="edit-contact_phone"
                        name="contact_phone"
                        type="tel"
                        value={editingHotel.contact_phone || ''}
                        onChange={handleEditInputChange}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-contact_email">Email</Label>
                      <Input
                        id="edit-contact_email"
                        name="contact_email"
                        type="email"
                        value={editingHotel.contact_email || ''}
                        onChange={handleEditInputChange}
                        className="w-full"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="edit-website_url">Website</Label>
                    <Input
                      id="edit-website_url"
                      name="website_url"
                      type="url"
                      value={editingHotel.website_url || ''}
                      onChange={handleEditInputChange}
                      placeholder="https://example.com"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-booking_link">Booking Link</Label>
                    <Input
                      id="edit-booking_link"
                      name="booking_link"
                      type="url"
                      value={editingHotel.booking_link || ''}
                      onChange={handleEditInputChange}
                      placeholder="https://booking.example.com"
                      className="w-full"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-check_in_time">Check-in Time</Label>
                      <Input
                        id="edit-check_in_time"
                        name="check_in_time"
                        type="time"
                        value={editingHotel.check_in_time || ''}
                        onChange={handleEditInputChange}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-check_out_time">Check-out Time</Label>
                      <Input
                        id="edit-check_out_time"
                        name="check_out_time"
                        type="time"
                        value={editingHotel.check_out_time || ''}
                        onChange={handleEditInputChange}
                        className="w-full"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="edit-description">Description</Label>
                    <Textarea
                      id="edit-description"
                      name="description"
                      value={editingHotel.description || ''}
                      onChange={handleEditInputChange}
                      rows={3}
                      className="w-full resize-none"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-amenities">Amenities (comma separated)</Label>
                    <Input
                      id="edit-amenities"
                      name="amenities"
                      value={editingHotel.amenities?.join(', ') || ''}
                      onChange={(e) => setEditingHotel(prev => ({
                        ...prev,
                        amenities: e.target.value.split(',').map(item => item.trim()).filter(item => item)
                      }))}
                      placeholder="WiFi, Pool, Gym, etc."
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-room_types">Room Types (comma separated)</Label>
                    <Input
                      id="edit-room_types"
                      name="room_types"
                      value={editingHotel.room_types?.join(', ') || ''}
                      onChange={(e) => setEditingHotel(prev => ({
                        ...prev,
                        room_types: e.target.value.split(',').map(item => item.trim()).filter(item => item)
                      }))}
                      placeholder="Standard, Deluxe, Suite, etc."
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
                    {(editPreviewPhotos.length > 0 || (editingHotel.photos && editingHotel.photos.length > 0)) && (
                      <div className="mt-3 space-y-4">
                        {/* Current Photos */}
                        {editingHotel.photos && editingHotel.photos.length > 0 && (
                          <div>
                            <p className="text-sm text-gray-600 mb-2 font-medium">Current Photos:</p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              {editingHotel.photos.map((photo, index) => (
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
                  onClick={() => setEditingHotel(null)}
                  className="w-full sm:w-auto order-2 sm:order-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleUpdateHotel}
                  className="bg-green-600 hover:bg-green-700 w-full sm:w-auto order-1 sm:order-2"
                >
                  Update Hotel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
};

export default Hotels;