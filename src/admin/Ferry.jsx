
// src/components/FerryManagement.jsx
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { 
  Loader2, 
  Plus, 
  Edit, 
  Trash2, 
  Ship, 
  MapPin, 
  Calendar, 
  Users, 
  CreditCard,
  Phone,
  Mail,
  Building,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle as XCircleIcon,
  Ban,
  UserCheck,
  UserX
} from 'lucide-react'; // Import specific icons
import { useAuth } from '@/context/AuthContext';
import { API_BASE_URL } from '@/config/api';

const FerryManagement = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('operators');
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState('create');
  const [currentForm, setCurrentForm] = useState('');
  const [formData, setFormData] = useState({});
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [operators, setOperators] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const token = localStorage.getItem('accessToken');

  // Fetch data when tab changes
  useEffect(() => {
    if (activeTab) {
      setCurrentForm(activeTab);
      fetchItems(activeTab);
    }
  }, [activeTab]);

  // Fetch reference data for dropdowns
  useEffect(() => {
    fetchReferenceData();
  }, []);

  const fetchReferenceData = async () => {
    try {
      const [operatorsRes, routesRes, schedulesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/admin/ferry-operators`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${API_BASE_URL}/admin/ferry-routes`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${API_BASE_URL}/admin/ferry-schedules`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      const operatorsData = await operatorsRes.json();
      const routesData = await routesRes.json();
      const schedulesData = await schedulesRes.json();

      if (operatorsData.success) setOperators(operatorsData.data || []);
      if (routesData.success) setRoutes(routesData.data || []);
      if (schedulesData.success) setSchedules(schedulesData.data || []);
    } catch (error) {
      console.error('Failed to fetch reference data:', error);
    }
  };

  const fetchItems = async (tabName) => {
    setLoading(true);
    try {
      const endpoint = getEndpoint(tabName);
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setItems(data.data || []);
      } else {
        toast.error(data.msg || 'Failed to fetch data');
        setItems([]);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Network error occurred');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  // --- NEW FUNCTIONS FOR SPECIFIC BOOKING ACTIONS ---

  // --- END NEW FUNCTIONS ---

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let response;
      const endpoint = getEndpoint(currentForm);
      if (sheetMode === 'create') {
        response = await fetch(`${API_BASE_URL}${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        });
      } else {
        // Use specific booking endpoints for approve/reject/cancel if needed via generic update
        // This is less ideal than the dedicated functions above for bookings
        const itemId = getItemId(selectedItem);
        response = await fetch(`${API_BASE_URL}${endpoint}/${itemId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        });
      }

      const result = await response.json();
      if (result.success) {
        toast.success(result.msg || 'Operation completed successfully');
        setSheetOpen(false);
        fetchItems(currentForm);
        setFormData({});
        setSelectedItem(null);
      } else {
        toast.error(result.msg || 'Operation failed');
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    setLoading(true);
    try {
      const endpoint = getEndpoint(currentForm);
      const response = await fetch(`${API_BASE_URL}${endpoint}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.success) {
        toast.success(result.msg || 'Deleted successfully');
        fetchItems(currentForm);
      } else {
        toast.error(result.msg || 'Deletion failed');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getEndpoint = (formType) => {
    const endpoints = {
      'operators': '/admin/ferry-operators',
      'routes': '/admin/ferry-routes',
      'schedules': '/admin/ferry-schedules',
      'seatClasses': '/admin/seat-classes',
      
    };
    return endpoints[formType] || '';
  };

  const getItemId = (item) => {
    if (!item) return null;
    return item.operator_id || item.route_id || item.schedule_id || 
           item.class_id || item.booking_id || item.id;
  };

  const openCreateForm = (formType) => {
    setCurrentForm(formType);
    setSheetMode('create');
    setFormData({});
    setSelectedItem(null);
    setSheetOpen(true);
  };

  const openEditForm = (item, formType) => {
    setCurrentForm(formType);
    setSheetMode('edit');
    // Parse contact_info if it's a string
    if (item.contact_info && typeof item.contact_info === 'string') {
      try {
        item.contact_info = JSON.parse(item.contact_info);
      } catch (e) {
        console.error('Failed to parse contact_info:', e);
      }
    }
    setFormData(item);
    setSelectedItem(item);
    setSheetOpen(true);
  };

  const parseContactInfo = (contactInfo) => {
    if (!contactInfo) return null;
    if (typeof contactInfo === 'string') {
      try {
        return JSON.parse(contactInfo);
      } catch (e) {
        return null;
      }
    }
    return contactInfo;
  };

  const renderContactInfo = (contactInfo) => {
    const parsed = parseContactInfo(contactInfo);
    if (!parsed) {
      return <span className="text-gray-400 text-sm">No contact info</span>;
    }
    return (
      <div className="flex flex-col gap-1">
        {parsed.email && (
          <div className="flex items-center gap-1 text-sm">
            <Mail className="h-3 w-3 text-gray-500" />
            <span>{parsed.email}</span>
          </div>
        )}
        {parsed.phone && (
          <div className="flex items-center gap-1 text-sm">
            <Phone className="h-3 w-3 text-gray-500" />
            <span>{parsed.phone}</span>
          </div>
        )}
        {parsed.address && (
          <div className="flex items-center gap-1 text-sm">
            <Building className="h-3 w-3 text-gray-500" />
            <span className="line-clamp-1">{parsed.address}</span>
          </div>
        )}
      </div>
    );
  };

  const renderForm = () => {
    switch(currentForm) {
      case 'operators':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="operator_name">Operator Name *</Label>
              <Input
                id="operator_name"
                value={formData.operator_name || ''}
                onChange={(e) => setFormData({...formData, operator_name: e.target.value})}
                placeholder="Enter operator name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Contact Information</Label>
              <div className="grid gap-2">
                <Input
                  placeholder="Email"
                  type="email"
                  value={parseContactInfo(formData.contact_info)?.email || ''}
                  onChange={(e) => {
                    const currentContact = parseContactInfo(formData.contact_info) || {};
                    setFormData({
                      ...formData, 
                      contact_info: JSON.stringify({
                        ...currentContact,
                        email: e.target.value
                      })
                    });
                  }}
                />
                <Input
                  placeholder="Phone"
                  value={parseContactInfo(formData.contact_info)?.phone || ''}
                  onChange={(e) => {
                    const currentContact = parseContactInfo(formData.contact_info) || {};
                    setFormData({
                      ...formData, 
                      contact_info: JSON.stringify({
                        ...currentContact,
                        phone: e.target.value
                      })
                    });
                  }}
                />
                <Input
                  placeholder="Address"
                  value={parseContactInfo(formData.contact_info)?.address || ''}
                  onChange={(e) => {
                    const currentContact = parseContactInfo(formData.contact_info) || {};
                    setFormData({
                      ...formData, 
                      contact_info: JSON.stringify({
                        ...currentContact,
                        address: e.target.value
                      })
                    });
                  }}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="logo_url">Logo URL</Label>
              <Input
                id="logo_url"
                value={formData.logo_url || ''}
                onChange={(e) => setFormData({...formData, logo_url: e.target.value})}
                placeholder="https://example.com/logo.png"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Enter operator description"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status || 'active'}
                onValueChange={(value) => setFormData({...formData, status: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      case 'routes':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="departure_port">Departure Port *</Label>
              <Input
                id="departure_port"
                value={formData.departure_port || ''}
                onChange={(e) => setFormData({...formData, departure_port: e.target.value})}
                placeholder="Enter departure port"
                required
              />
            </div>
            <div>
              <Label htmlFor="arrival_port">Arrival Port *</Label>
              <Input
                id="arrival_port"
                value={formData.arrival_port || ''}
                onChange={(e) => setFormData({...formData, arrival_port: e.target.value})}
                placeholder="Enter arrival port"
                required
              />
            </div>
            <div>
              <Label htmlFor="distance_km">Distance (km)</Label>
              <Input
                id="distance_km"
                type="number"
                value={formData.distance_km || ''}
                onChange={(e) => setFormData({...formData, distance_km: parseFloat(e.target.value)})}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="estimated_duration_minutes">Duration (minutes)</Label>
              <Input
                id="estimated_duration_minutes"
                type="number"
                value={formData.estimated_duration_minutes || ''}
                onChange={(e) => setFormData({...formData, estimated_duration_minutes: parseInt(e.target.value)})}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status || 'active'}
                onValueChange={(value) => setFormData({...formData, status: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      case 'schedules':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="operator_id">Operator *</Label>
              <Select
                value={formData.operator_id?.toString() || ''}
                onValueChange={(value) => setFormData({...formData, operator_id: parseInt(value)})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select operator" />
                </SelectTrigger>
                <SelectContent>
                  {operators.map((op) => (
                    <SelectItem key={op.operator_id} value={op.operator_id.toString()}>
                      {op.operator_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="route_id">Route *</Label>
              <Select
                value={formData.route_id?.toString() || ''}
                onValueChange={(value) => setFormData({...formData, route_id: parseInt(value)})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select route" />
                </SelectTrigger>
                <SelectContent>
                  {routes.map((route) => (
                    <SelectItem key={route.route_id} value={route.route_id.toString()}>
                      {route.departure_port} → {route.arrival_port}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="ferry_name">Ferry Name *</Label>
              <Input
                id="ferry_name"
                value={formData.ferry_name || ''}
                onChange={(e) => setFormData({...formData, ferry_name: e.target.value})}
                placeholder="Enter ferry name"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="departure_time">Departure Time *</Label>
                <Input
                  id="departure_time"
                  type="time"
                  value={formData.departure_time || ''}
                  onChange={(e) => setFormData({...formData, departure_time: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="arrival_time">Arrival Time *</Label>
                <Input
                  id="arrival_time"
                  type="time"
                  value={formData.arrival_time || ''}
                  onChange={(e) => setFormData({...formData, arrival_time: e.target.value})}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="operating_days">Operating Days *</Label>
              <Input
                id="operating_days"
                value={formData.operating_days || ''}
                onChange={(e) => setFormData({...formData, operating_days: e.target.value})}
                placeholder="e.g., Mon,Tue,Wed,Thu,Fri"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="total_seats">Total Seats *</Label>
                <Input
                  id="total_seats"
                  type="number"
                  value={formData.total_seats || ''}
                  onChange={(e) => setFormData({...formData, total_seats: parseInt(e.target.value)})}
                  placeholder="0"
                  required
                />
              </div>
              <div>
                <Label htmlFor="available_seats">Available Seats</Label>
                <Input
                  id="available_seats"
                  type="number"
                  value={formData.available_seats || formData.total_seats || ''}
                  onChange={(e) => setFormData({...formData, available_seats: parseInt(e.target.value)})}
                  placeholder="0"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status || 'active'}
                onValueChange={(value) => setFormData({...formData, status: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      case 'seatClasses':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="schedule_id">Schedule *</Label>
              <Select
                value={formData.schedule_id?.toString() || ''}
                onValueChange={(value) => setFormData({...formData, schedule_id: parseInt(value)})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select schedule" />
                </SelectTrigger>
                <SelectContent>
                  {schedules.map((schedule) => (
                    <SelectItem key={schedule.schedule_id} value={schedule.schedule_id.toString()}>
                      {schedule.ferry_name} - {schedule.departure_time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="class_name">Class Name *</Label>
              <Input
                id="class_name"
                value={formData.class_name || ''}
                onChange={(e) => setFormData({...formData, class_name: e.target.value})}
                placeholder="e.g., Economy, Business, VIP"
                required
              />
            </div>
            <div>
              <Label htmlFor="price_per_seat">Price Per Seat (₹) *</Label>
              <Input
                id="price_per_seat"
                type="number"
                step="0.01"
                value={formData.price_per_seat || ''}
                onChange={(e) => setFormData({...formData, price_per_seat: parseFloat(e.target.value)})}
                placeholder="0.00"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="total_seats">Total Seats *</Label>
                <Input
                  id="total_seats"
                  type="number"
                  value={formData.total_seats || ''}
                  onChange={(e) => setFormData({...formData, total_seats: parseInt(e.target.value)})}
                  placeholder="0"
                  required
                />
              </div>
              <div>
                <Label htmlFor="available_seats">Available Seats</Label>
                <Input
                  id="available_seats"
                  type="number"
                  value={formData.available_seats || formData.total_seats || ''}
                  onChange={(e) => setFormData({...formData, available_seats: parseInt(e.target.value)})}
                  placeholder="0"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Enter class description"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="amenities">Amenities (JSON)</Label>
              <Textarea
                id="amenities"
                value={typeof formData.amenities === 'object' ? JSON.stringify(formData.amenities) : formData.amenities || '[]'}
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    setFormData({...formData, amenities: parsed});
                  } catch {
                    setFormData({...formData, amenities: e.target.value});
                  }
                }}
                placeholder='["WiFi", "AC", "Reclining Seats"]'
                rows={2}
              />
            </div>
          </div>
        );
  
        // Check if we are in edit mode for a booking
        const isEditingBooking = sheetMode === 'edit' && selectedItem;
        return (
          <div className="space-y-4">
            {/* Display Booking Details */}
            {isEditingBooking && (
              <div className="border rounded-lg p-4 bg-gray-50">
                <h4 className="font-medium mb-2">Booking Details:</h4>
                <p><span className="font-semibold">Reference:</span> {selectedItem.booking_reference}</p>
                <p><span className="font-semibold">User ID:</span> {selectedItem.user_id}</p>
                <p><span className="font-semibold">Schedule ID:</span> {selectedItem.schedule_id}</p>
                <p><span className="font-semibold">Passengers:</span> {selectedItem.number_of_passengers}</p>
                <p><span className="font-semibold">Total Amount:</span> ₹{selectedItem.total_amount}</p>
                <p><span className="font-semibold">Booking Status:</span> {selectedItem.booking_status}</p>
                <p><span className="font-semibold">Payment Status:</span> {selectedItem.payment_status}</p>
                {/* Add other relevant details if needed */}
              </div>
            )}
            {/* Action Buttons for Approve/Reject/Cancel */}
            {isEditingBooking && (
              <div className="space-y-3">
                {selectedItem.booking_status === 'pending' && (
                  <Button
                    onClick={() => handleApproveBooking(selectedItem.booking_id)}
                    className="w-full bg-green-600 hover:bg-green-700 flex items-center justify-center gap-2"
                    disabled={loading}
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserCheck className="h-4 w-4" />}
                    Approve Booking
                  </Button>
                )}
                {selectedItem.booking_status === 'pending' && (
                  <Button
                    onClick={() => handleRejectBooking(selectedItem.booking_id)}
                    className="w-full bg-red-600 hover:bg-red-700 flex items-center justify-center gap-2"
                    disabled={loading}
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserX className="h-4 w-4" />}
                    Reject Booking
                  </Button>
                )}
                {/* Example: Allow Admin to Cancel a Confirmed Booking */}
                {selectedItem.booking_status === 'confirmed' && (
                  <Button
                    onClick={() => handleCancelBooking(selectedItem.booking_id)}
                    className="w-full bg-yellow-600 hover:bg-yellow-700 flex items-center justify-center gap-2"
                    disabled={loading}
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Ban className="h-4 w-4" />}
                    Cancel Booking (Admin)
                  </Button>
                )}
              </div>
            )}
            {/* Generic Update Status Form (Optional - might not be needed if actions are separate) */}
            {/* If you still want the generic form, you can keep it, but it might conflict with specific actions */}
            {/* <div className="pt-4"> */}
            {/*   <Label htmlFor="booking_status">Booking Status</Label> */}
            {/*   <Select */}
            {/*     value={formData.booking_status || 'pending'} */}
            {/*     onValueChange={(value) => setFormData({...formData, booking_status: value})} */}
            {/*   > */}
            {/*     <SelectTrigger> */}
            {/*       <SelectValue /> */}
            {/*     </SelectTrigger> */}
            {/*     <SelectContent> */}
            {/*       <SelectItem value="pending">Pending</SelectItem> */}
            {/*       <SelectItem value="confirmed">Confirmed</SelectItem> */}
            {/*       <SelectItem value="cancelled">Cancelled</SelectItem> */}
            {/*       <SelectItem value="completed">Completed</SelectItem> */}
            {/*     </SelectContent> */}
            {/*   </Select> */}
            {/*   <Label htmlFor="payment_status">Payment Status</Label> */}
            {/*   <Select */}
            {/*     value={formData.payment_status || 'pending'} */}
            {/*     onValueChange={(value) => setFormData({...formData, payment_status: value})} */}
            {/*   > */}
            {/*     <SelectTrigger> */}
            {/*       <SelectValue /> */}
            {/*     </SelectTrigger> */}
            {/*     <SelectContent> */}
            {/*       <SelectItem value="pending">Pending</SelectItem> */}
            {/*       <SelectItem value="completed">Completed</SelectItem> */}
            {/*       <SelectItem value="failed">Failed</SelectItem> */}
            {/*       <SelectItem value="refunded">Refunded</SelectItem> */}
            {/*     </SelectContent> */}
            {/*   </Select> */}
            {/* </div> */}
            {/* END Generic Update Status Form */}
          </div>
        );
      default:
        return <div className="text-center text-gray-500">Select a form type</div>;
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      active: 'default',
      inactive: 'secondary',
      pending: 'outline',
      confirmed: 'default',
      cancelled: 'destructive',
      completed: 'default'
    };
    const colors = {
      active: 'bg-green-100 text-green-800 hover:bg-green-100',
      inactive: 'bg-gray-100 text-gray-800 hover:bg-gray-100',
      pending: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
      confirmed: 'bg-green-100 text-green-800 hover:bg-green-100',
      cancelled: 'bg-red-100 text-red-800 hover:bg-red-100',
      completed: 'bg-blue-100 text-blue-800 hover:bg-blue-100'
    };
    return (
      <Badge className={colors[status] || ''}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ferry Management</h1>
          <p className="text-muted-foreground">Manage ferry operators, routes, schedules, and bookings</p>
        </div>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="operators" className="flex items-center gap-2">
            <Ship className="h-4 w-4" />
            <span className="hidden sm:inline">Operators</span>
          </TabsTrigger>
          <TabsTrigger value="routes" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span className="hidden sm:inline">Routes</span>
          </TabsTrigger>
          <TabsTrigger value="schedules" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Schedules</span>
          </TabsTrigger>
          <TabsTrigger value="seatClasses" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Classes</span>
          </TabsTrigger>
          
        </TabsList>

        {/* Operators Tab */}
        <TabsContent value="operators" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle>Ferry Operators</CardTitle>
                <CardDescription>Manage ferry service operators</CardDescription>
              </div>
              <Button onClick={() => openCreateForm('operators')} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Operator
              </Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : items.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Ship className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No operators found. Create your first operator to get started.</p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">ID</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Contact Info</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item) => (
                          <tr key={item.operator_id} className="border-b transition-colors hover:bg-muted/50">
                            <td className="p-4 align-middle">{item.operator_id}</td>
                            <td className="p-4 align-middle">
                              <div className="flex items-center gap-3">
                                {item.logo_url && (
                                  <img 
                                    src={item.logo_url} 
                                    alt={item.operator_name}
                                    className="h-10 w-10 rounded-full object-cover"
                                  />
                                )}
                                <div>
                                  <div className="font-medium">{item.operator_name}</div>
                                  {item.description && (
                                    <div className="text-sm text-muted-foreground line-clamp-1">
                                      {item.description}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="p-4 align-middle">
                              {renderContactInfo(item.contact_info)}
                            </td>
                            <td className="p-4 align-middle">
                              {getStatusBadge(item.status)}
                            </td>
                            <td className="p-4 align-middle">
                              <div className="flex items-center gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => openEditForm(item, 'operators')}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => handleDelete(item.operator_id)}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
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
        </TabsContent>

        {/* Routes Tab */}
        <TabsContent value="routes" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle>Ferry Routes</CardTitle>
                <CardDescription>Manage ferry travel routes</CardDescription>
              </div>
              <Button onClick={() => openCreateForm('routes')} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Route
              </Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : items.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No routes found. Create your first route to get started.</p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">ID</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Route</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Distance</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Duration</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item) => (
                          <tr key={item.route_id} className="border-b transition-colors hover:bg-muted/50">
                            <td className="p-4 align-middle">{item.route_id}</td>
                            <td className="p-4 align-middle">
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">{item.departure_port}</span>
                                <span className="text-muted-foreground">→</span>
                                <span className="font-medium">{item.arrival_port}</span>
                              </div>
                            </td>
                            <td className="p-4 align-middle">
                              {item.distance_km ? `${item.distance_km} km` : '-'}
                            </td>
                            <td className="p-4 align-middle">
                              {item.estimated_duration_minutes ? `${item.estimated_duration_minutes} min` : '-'}
                            </td>
                            <td className="p-4 align-middle">
                              {getStatusBadge(item.status)}
                            </td>
                            <td className="p-4 align-middle">
                              <div className="flex items-center gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => openEditForm(item, 'routes')}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => handleDelete(item.route_id)}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
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
        </TabsContent>

        {/* Schedules Tab */}
        <TabsContent value="schedules" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle>Ferry Schedules</CardTitle>
                <CardDescription>Manage ferry departure and arrival times</CardDescription>
              </div>
              <Button onClick={() => openCreateForm('schedules')} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Schedule
              </Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : items.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No schedules found. Create your first schedule to get started.</p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">ID</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Ferry</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Departure</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Arrival</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Days</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Seats</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item) => (
                          <tr key={item.schedule_id} className="border-b transition-colors hover:bg-muted/50">
                            <td className="p-4 align-middle">{item.schedule_id}</td>
                            <td className="p-4 align-middle">
                              <div className="flex items-center gap-2">
                                <Ship className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">{item.ferry_name}</span>
                              </div>
                            </td>
                            <td className="p-4 align-middle">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3 text-muted-foreground" />
                                <span>{item.departure_time}</span>
                              </div>
                            </td>
                            <td className="p-4 align-middle">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3 text-muted-foreground" />
                                <span>{item.arrival_time}</span>
                              </div>
                            </td>
                            <td className="p-4 align-middle">
                              <span className="text-sm">{item.operating_days}</span>
                            </td>
                            <td className="p-4 align-middle">
                              <div className="flex items-center gap-1">
                                <Users className="h-3 w-3 text-muted-foreground" />
                                <span>{item.available_seats}/{item.total_seats}</span>
                              </div>
                            </td>
                            <td className="p-4 align-middle">
                              {getStatusBadge(item.status)}
                            </td>
                            <td className="p-4 align-middle">
                              <div className="flex items-center gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => openEditForm(item, 'schedules')}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => handleDelete(item.schedule_id)}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
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
        </TabsContent>

        {/* Seat Classes Tab */}
        <TabsContent value="seatClasses" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle>Seat Classes</CardTitle>
                <CardDescription>Manage seat class types and pricing</CardDescription>
              </div>
              <Button onClick={() => openCreateForm('seatClasses')} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Class
              </Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : items.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No seat classes found. Create your first seat class to get started.</p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">ID</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Schedule</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Class</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Price</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Available</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item) => (
                          <tr key={item.class_id} className="border-b transition-colors hover:bg-muted/50">
                            <td className="p-4 align-middle">{item.class_id}</td>
                            <td className="p-4 align-middle">
                              <span className="text-sm text-muted-foreground">
                                Schedule #{item.schedule_id}
                              </span>
                            </td>
                            <td className="p-4 align-middle">
                              <div>
                                <div className="font-medium">{item.class_name}</div>
                                {item.description && (
                                  <div className="text-sm text-muted-foreground line-clamp-1">
                                    {item.description}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="p-4 align-middle">
                              <span className="font-semibold">₹{item.price_per_seat}</span>
                            </td>
                            <td className="p-4 align-middle">
                              <div className="flex items-center gap-1">
                                <Users className="h-3 w-3 text-muted-foreground" />
                                <span>{item.available_seats}/{item.total_seats}</span>
                              </div>
                            </td>
                            <td className="p-4 align-middle">
                              <div className="flex items-center gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => openEditForm(item, 'seatClasses')}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => handleDelete(item.class_id)}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
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
        </TabsContent>

       
      </Tabs>

      {/* Edit/Create Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="overflow-y-auto sm:max-w-[540px]">
          <SheetHeader>
            <SheetTitle>
              {sheetMode === 'create' ? 'Create' : 'Edit'} {currentForm.charAt(0).toUpperCase() + currentForm.slice(1)}
            </SheetTitle>
            <SheetDescription>
              {sheetMode === 'create' 
                ? `Fill in the details to create a new ${currentForm}` 
                : `Update the details for this ${currentForm}`}
            </SheetDescription>
          </SheetHeader>
          <Separator className="my-4" />
          <form onSubmit={handleSubmit} className="space-y-4">
            {renderForm()}
            <Separator className="my-6" />
            {/* Conditional rendering of submit/cancel buttons */}
            {!(currentForm === 'bookings' && sheetMode === 'edit') ? (
              // Show generic submit/cancel for create or other edit forms
              <div className="flex gap-3">
                <Button 
                  type="submit" 
                  className="flex-1" 
                  disabled={loading}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {sheetMode === 'create' ? 'Create' : 'Update'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setSheetOpen(false)} 
                  className="flex-1"
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              // Don't show submit/cancel for booking edit if actions are handled separately in renderForm
              <div className="flex gap-3">
                 <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSheetOpen(false)}
                  className="flex-1"
                  disabled={loading}
                >
                  Close
                </Button>
              </div>
            )}
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default FerryManagement;
