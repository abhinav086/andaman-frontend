// src/pages/BookingManagement.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  CreditCard,
  Users,
  Calendar,
  MapPin,
  Clock,
  User,
  IndianRupee,
  Loader2,
  CheckCircle,
  XCircle,
  Ban,
  UserCheck,
  UserX,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { API_BASE_URL } from '@/config/api';

const BookingManagement = () => {
  const { user, logout } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Function to get auth headers with current token
  const getAuthHeaders = useCallback(() => {
    const token = localStorage.getItem('accessToken');
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    };
  }, []);

  // Fetch bookings when component mounts
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/admin/bookings`, {
        headers: getAuthHeaders()
      });
      
      if (response.status === 401) {
        // Token expired or invalid
        logout();
        toast.error('Session expired. Please log in again.');
        return;
      }
      
      const data = await response.json();
      if (data.success) {
        setBookings(data.data || []);
      } else {
        toast.error(data.msg || 'Failed to fetch bookings');
        setBookings([]);
      }
    } catch (error) {
      console.error('Fetch bookings error:', error);
      toast.error('Network error occurred while fetching bookings');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  // --- NEW FUNCTIONS FOR SPECIFIC BOOKING ACTIONS ---
  const handleApproveBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to approve this booking?')) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/admin/bookings/${bookingId}/approve`, {
        method: 'PUT',
        headers: getAuthHeaders()
      });
      
      if (response.status === 401) {
        logout();
        toast.error('Session expired. Please log in again.');
        return;
      }
      
      const result = await response.json();
      if (result.success) {
        toast.success(result.msg || 'Booking approved successfully');
        // Refresh the booking list
        fetchBookings();
      } else {
        toast.error(result.msg || 'Failed to approve booking');
      }
    } catch (error) {
      console.error('Approve booking error:', error);
      toast.error('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleRejectBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to reject this booking?')) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/admin/bookings/${bookingId}/reject`, {
        method: 'PUT',
        headers: getAuthHeaders()
      });
      
      if (response.status === 401) {
        logout();
        toast.error('Session expired. Please log in again.');
        return;
      }
      
      const result = await response.json();
      if (result.success) {
        toast.success(result.msg || 'Booking rejected successfully');
        fetchBookings();
      } else {
        toast.error(result.msg || 'Failed to reject booking');
      }
    } catch (error) {
      console.error('Reject booking error:', error);
      toast.error('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/admin/bookings/${bookingId}/cancel`, {
        method: 'PUT',
        headers: getAuthHeaders()
      });
      
      if (response.status === 401) {
        logout();
        toast.error('Session expired. Please log in again.');
        return;
      }
      
      const result = await response.json();
      if (result.success) {
        toast.success(result.msg || 'Booking cancelled successfully');
        fetchBookings();
      } else {
        toast.error(result.msg || 'Failed to cancel booking');
      }
    } catch (error) {
      console.error('Cancel booking error:', error);
      toast.error('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to delete this booking record? This action cannot be undone.')) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/admin/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      
      if (response.status === 401) {
        logout();
        toast.error('Session expired. Please log in again.');
        return;
      }
      
      const result = await response.json();
      if (result.success) {
        toast.success(result.msg || 'Booking record deleted successfully');
        fetchBookings();
      } else {
        toast.error(result.msg || 'Deletion failed');
      }
    } catch (error) {
      console.error('Delete booking error:', error);
      toast.error('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const openDetailModal = (booking) => {
    setSelectedBooking(booking);
    setDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setDetailModalOpen(false);
    setSelectedBooking(null);
  };

  const getStatusBadge = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
      confirmed: 'bg-green-100 text-green-800 hover:bg-green-100',
      cancelled: 'bg-red-100 text-red-800 hover:bg-red-100',
      completed: 'bg-blue-100 text-blue-800 hover:bg-blue-100'
    };
    return (
      <Badge className={colors[status] || 'bg-gray-100 text-gray-800 hover:bg-gray-100'}>
        {status}
      </Badge>
    );
  };

  const getPaymentStatusBadge = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
      completed: 'bg-green-100 text-green-800 hover:bg-green-100',
      failed: 'bg-red-100 text-red-800 hover:bg-red-100',
      refunded: 'bg-purple-100 text-purple-800 hover:bg-purple-100'
    };
    return (
      <Badge className={colors[status] || 'bg-gray-100 text-gray-800 hover:bg-gray-100'}>
        {status}
      </Badge>
    );
  };

  // Check if user is admin based on role
  const isAdmin = user?.role === 'admin';

  if (!user || !isAdmin) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h2 className="text-xl font-semibold mb-4">Access Denied</h2>
        <p className="text-muted-foreground">You do not have permission to access this page.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Booking Management</h1>
          <p className="text-muted-foreground">View and manage all ferry bookings</p>
        </div>
        {/* Optional: Refresh Button */}
        <Button onClick={fetchBookings} variant="outline" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Refresh'}
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle>Bookings List</CardTitle>
            <CardDescription>Total bookings: {bookings.length}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No bookings found yet.</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Reference</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">User</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Schedule</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Passengers</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Amount</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((item) => (
                      <tr key={item.booking_id} className="border-b transition-colors hover:bg-muted/50">
                        <td className="p-4 align-middle">
                          <span className="text-sm font-mono">
                            {item.booking_reference}
                          </span>
                        </td>
                        <td className="p-4 align-middle">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">User #{item.user_id}</span>
                          </div>
                        </td>
                        <td className="p-4 align-middle">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              Schedule #{item.schedule_id}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 align-middle">
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3 text-muted-foreground" />
                            <span>{item.number_of_passengers}</span>
                          </div>
                        </td>
                        <td className="p-4 align-middle">
                          <div className="flex items-center gap-1">
                            <IndianRupee className="h-3 w-3 text-muted-foreground" />
                            <span className="font-semibold">{item.total_amount}</span>
                          </div>
                        </td>
                        <td className="p-4 align-middle">
                          <div className="space-y-1">
                            {getStatusBadge(item.booking_status)}
                            {item.payment_status && (
                              <div className="text-xs text-muted-foreground">
                                Payment: {getPaymentStatusBadge(item.payment_status)}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-4 align-middle">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openDetailModal(item)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            {/* Action Buttons based on status */}
                            {item.booking_status === 'pending' && (
                              <>
                                <Button
                                  variant="default"
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700 flex items-center gap-1"
                                  onClick={() => handleApproveBooking(item.booking_id)}
                                  disabled={loading}
                                >
                                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserCheck className="h-4 w-4" />}
                                  <span>Approve</span>
                                </Button>
                                <Button
                                  variant="default"
                                  size="sm"
                                  className="bg-red-600 hover:bg-red-700 flex items-center gap-1"
                                  onClick={() => handleRejectBooking(item.booking_id)}
                                  disabled={loading}
                                >
                                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserX className="h-4 w-4" />}
                                  <span>Reject</span>
                                </Button>
                              </>
                            )}
                            {item.booking_status === 'confirmed' && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-yellow-600 border-yellow-600 hover:bg-yellow-100 flex items-center gap-1"
                                onClick={() => handleCancelBooking(item.booking_id)}
                                disabled={loading}
                              >
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Ban className="h-4 w-4" />}
                                <span>Cancel</span>
                              </Button>
                            )}
                            {/* Delete Button */}
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-destructive hover:bg-destructive/10"
                              onClick={() => handleDeleteBooking(item.booking_id)}
                              disabled={loading}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Modal */}
      {detailModalOpen && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Booking Details</h3>
              <Button variant="ghost" size="icon" onClick={closeDetailModal}>
                {/* Assuming you have an 'X' icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </Button>
            </div>
            <div className="space-y-2">
              <p><span className="font-semibold">Reference:</span> {selectedBooking.booking_reference}</p>
              <p><span className="font-semibold">User ID:</span> {selectedBooking.user_id}</p>
              <p><span className="font-semibold">Schedule ID:</span> {selectedBooking.schedule_id}</p>
              <p><span className="font-semibold">Passengers:</span> {selectedBooking.number_of_passengers}</p>
              <p><span className="font-semibold">Total Amount:</span> ₹{selectedBooking.total_amount}</p>
              <p><span className="font-semibold">Booking Status:</span> {getStatusBadge(selectedBooking.booking_status)}</p>
              <p><span className="font-semibold">Payment Status:</span> {getPaymentStatusBadge(selectedBooking.payment_status)}</p>
              <p><span className="font-semibold">Created At:</span> {new Date(selectedBooking.created_at).toLocaleString()}</p>
              {selectedBooking.updated_at && (
                <p><span className="font-semibold">Updated At:</span> {new Date(selectedBooking.updated_at).toLocaleString()}</p>
              )}
              {/* Add other relevant details if needed */}
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={closeDetailModal}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingManagement;