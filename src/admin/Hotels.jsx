import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Building, Plus, Upload, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { API_BASE_URL } from '../config/api';

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

  useEffect(() => {
    fetchHotels();
  }, []);

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

  const handleAddHotel = async (e) => {
    e.preventDefault();
    
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

  const handleUpdateHotel = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('accessToken');
      const formData = new FormData();
      
      // Sanitize the editing hotel data
      const sanitizedData = sanitizeFormData(editingHotel);
      
      // Add text fields
      Object.keys(sanitizedData).forEach(key => {
        if (key === 'amenities' || key === 'room_types') {
          // Add array fields as JSON strings
          formData.append(key, JSON.stringify(sanitizedData[key] || []));
        } else if (key === 'photos') {
          // Handle existing photos separately
          formData.append('existing_photos', JSON.stringify(sanitizedData[key] || []));
        } else {
          formData.append(key, sanitizedData[key]);
        }
      });
      
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

  if (loading) {
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
          <CardDescription>Manage your hotels and properties</CardDescription>
        </div>
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
            <form onSubmit={handleAddHotel} className="space-y-4">
              {apiError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                  {apiError}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                
                <div className="md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={newHotel.description}
                    onChange={handleInputChange}
                    rows={3}
                  />
                </div>
                
                <div className="md:col-span-2">
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
                
                <div className="md:col-span-2">
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
                
                <div className="md:col-span-2">
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
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  Add Hotel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      
      {apiError && (
        <div className="mx-6 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
          {apiError}
        </div>
      )}
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      </CardContent>
      
      {/* Edit Hotel Dialog */}
      {editingHotel && (
        <Dialog open={!!editingHotel} onOpenChange={() => setEditingHotel(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Hotel</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdateHotel} className="space-y-4">
              {apiError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                  {apiError}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-name">Hotel Name</Label>
                  <Input
                    id="edit-name"
                    name="name"
                    value={editingHotel.name || ''}
                    onChange={handleEditInputChange}
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-city">City</Label>
                  <Input
                    id="edit-city"
                    name="city"
                    value={editingHotel.city || ''}
                    onChange={handleEditInputChange}
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-country">Country</Label>
                  <Input
                    id="edit-country"
                    name="country"
                    value={editingHotel.country || ''}
                    onChange={handleEditInputChange}
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-address">Address</Label>
                  <Input
                    id="edit-address"
                    name="address"
                    value={editingHotel.address || ''}
                    onChange={handleEditInputChange}
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-zip_code">ZIP Code</Label>
                  <Input
                    id="edit-zip_code"
                    name="zip_code"
                    value={editingHotel.zip_code || ''}
                    onChange={handleEditInputChange}
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-star_rating">Star Rating</Label>
                  <Select
                    name="star_rating"
                    value={editingHotel.star_rating?.toString() || '3'}
                    onValueChange={(value) => setEditingHotel(prev => ({...prev, star_rating: parseInt(value)}))}
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
                  <Label htmlFor="edit-latitude">Latitude</Label>
                  <Input
                    id="edit-latitude"
                    name="latitude"
                    type="number"
                    step="any"
                    value={editingHotel.latitude || ''}
                    onChange={handleEditInputChange}
                    placeholder="e.g. 40.7128"
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
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-contact_phone">Phone</Label>
                  <Input
                    id="edit-contact_phone"
                    name="contact_phone"
                    value={editingHotel.contact_phone || ''}
                    onChange={handleEditInputChange}
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
                  />
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
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-check_in_time">Check-in Time</Label>
                  <Input
                    id="edit-check_in_time"
                    name="check_in_time"
                    type="time"
                    value={editingHotel.check_in_time || ''}
                    onChange={handleEditInputChange}
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
                  />
                </div>
                
                <div className="md:col-span-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    name="description"
                    value={editingHotel.description || ''}
                    onChange={handleEditInputChange}
                    rows={3}
                  />
                </div>
                
                <div className="md:col-span-2">
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
                  />
                </div>
                
                <div className="md:col-span-2">
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
                  />
                </div>
                
                <div className="md:col-span-2">
                  <Label htmlFor="edit-photos">Add Photos</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="edit-photos"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleEditFileChange}
                    />
                    <Button type="button" variant="outline" size="sm">
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {(editPreviewPhotos.length > 0 || (editingHotel.photos && editingHotel.photos.length > 0)) && (
                    <div className="mt-2">
                      {/* Current Photos */}
                      {editingHotel.photos && editingHotel.photos.length > 0 && (
                        <div className="mb-3">
                          <p className="text-sm text-gray-600 mb-2">Current Photos:</p>
                          <div className="grid grid-cols-3 gap-2">
                            {editingHotel.photos.map((photo, index) => (
                              <div key={`existing-${index}`} className="relative group">
                                <img 
                                  src={photo} 
                                  alt={`Existing ${index}`} 
                                  className="w-full h-24 object-cover rounded"
                                />
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="destructive"
                                  className="absolute top-1 right-1 h-6 w-6 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
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
                          <p className="text-sm text-gray-600 mb-2">New Photos to Add:</p>
                          <div className="grid grid-cols-3 gap-2">
                            {editPreviewPhotos.map((photo, index) => (
                              <div key={`new-${index}`} className="relative group">
                                <img 
                                  src={photo} 
                                  alt={`New Preview ${index}`} 
                                  className="w-full h-24 object-cover rounded border-2 border-green-200"
                                />
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="destructive"
                                  className="absolute top-1 right-1 h-6 w-6 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
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
              
              <div className="flex justify-end gap-2 pt-4">
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  Update Hotel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
};

export default Hotels;