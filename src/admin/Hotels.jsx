import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Building, Plus, Upload, X, Star, MapPin, DollarSign, Image, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { API_BASE_URL } from '../config/api';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// --- Hotel Card Component with Carousel ---
const HotelCard = ({ hotel, onEdit, onDelete }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: 'start' });
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

  const scrollPrev = React.useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = React.useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = React.useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, [emblaApi]);

  React.useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('reInit', onSelect);
    emblaApi.on('select', onSelect);
  }, [emblaApi, onSelect]);

  return (
    <Card key={hotel.hotel_id} className="overflow-hidden flex flex-col border border-gray-200 hover:shadow-md transition-shadow h-full">
      <div className="relative overflow-hidden">
        {hotel.photos && hotel.photos.length > 0 ? (
          <div className="embla" ref={emblaRef} style={{ height: '200px' }}>
            <div className="embla__container flex">
              {hotel.photos.map((photo, index) => (
                <div key={index} className="embla__slide flex-shrink-0 w-full">
                  <img
                    src={photo}
                    alt={`${hotel.name} - Photo ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = 'https://placehold.co/400x300?text=Image+Error'; }}
                  />
                </div>
              ))}
            </div>
            <Button
              className="embla__button embla__button--prev absolute top-1/2 left-2 transform -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-1"
              onClick={scrollPrev}
              disabled={prevBtnDisabled}
              size="icon"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              className="embla__button embla__button--next absolute top-1/2 right-2 transform -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-1"
              onClick={scrollNext}
              disabled={nextBtnDisabled}
              size="icon"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
            <Image className="h-12 w-12 text-gray-400" />
          </div>
        )}

        <div className="absolute top-2 right-2 flex gap-1">
          <Button
            size="sm"
            variant="secondary"
            className="h-8 w-8 p-0 bg-black/50 hover:bg-black/70 text-white"
            onClick={() => onEdit(hotel)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="destructive"
            className="h-8 w-8 p-0 bg-black/50 hover:bg-black/70"
            onClick={() => onDelete(hotel.hotel_id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <CardContent className="p-4 flex-grow">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-lg truncate">{hotel.name}</h3>
          <div className="flex flex-col items-end">
            <Badge variant="outline" className="text-sm">
              <Star className="h-3 w-3 mr-1 text-yellow-500" /> 
              {hotel.star_rating || 'N/A'}★
            </Badge>
            {hotel.base_price && (
              <span className="text-sm font-semibold text-green-600 mt-1 flex items-center gap-1">
                <DollarSign className="h-3 w-3" /> ₹{hotel.base_price}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center mt-1 text-sm text-gray-600">
          <MapPin className="h-4 w-4 mr-1" />
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
      </CardContent>
    </Card>
  );
};

const Hotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);

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
    room_types: [],
    base_price: '',
    currency: 'INR'
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
    setLoading(true);
    setApiError('');
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setApiError('No access token found. Please login again.');
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/hotels`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Failed to fetch hotels');
      }

      const result = await response.json();
      setHotels(result.hotels || []);
    } catch (error) {
      console.error('Error fetching hotels:', error);
      setApiError(error.message);
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
    const previews = files.map(file => URL.createObjectURL(file));
    setPreviewPhotos(previews);
  };

  const handleEditFileChange = (e) => {
    const files = Array.from(e.target.files);
    setEditPhotos(files);
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
    if (editingHotel) {
      setEditingHotel(prev => ({
        ...prev,
        photos: prev.photos?.filter((_, i) => i !== index) || []
      }));
    }
  };

  const validateHotel = (hotelData) => {
    const newErrors = {};
    if (!hotelData.name?.trim()) newErrors.name = 'Name is required';
    if (!hotelData.city?.trim()) newErrors.city = 'City is required';
    if (!hotelData.country?.trim()) newErrors.country = 'Country is required';
    if (!hotelData.address?.trim()) newErrors.address = 'Address is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sanitizeFormData = (data) => {
    const sanitized = {};
    Object.keys(data).forEach(key => {
      const value = data[key];
      if (key === 'amenities' || key === 'room_types') {
        sanitized[key] = Array.isArray(value) ? value : [];
      } else if (key === 'latitude' || key === 'longitude') {
        if (value !== '' && value !== null && value !== undefined && !isNaN(parseFloat(value))) {
          sanitized[key] = parseFloat(value);
        } else {
          sanitized[key] = null;
        }
      } else if (key === 'base_price') {
        if (value !== '' && value !== null && value !== undefined && !isNaN(parseFloat(value))) {
          sanitized[key] = parseFloat(value);
        } else {
          sanitized[key] = null;
        }
      } else if (key === 'website_url' || key === 'booking_link') {
        if (value && value.trim() !== '') {
          sanitized[key] = value.trim();
        } else {
          sanitized[key] = null;
        }
      } else if (key === 'star_rating') {
        sanitized[key] = parseInt(value) || 3;
      } else if (value !== null && value !== undefined && value !== '') {
        sanitized[key] = value;
      } else {
        sanitized[key] = null;
      }
    });
    return sanitized;
  };

  // Helper function to format room_types for the API call
  // Converts an array of strings ["Standard", "Deluxe"] to an array of objects [{ type: "Standard" }, { type: "Deluxe" }]
  const formatRoomTypesForAPI = (roomTypesArray) => {
    if (!Array.isArray(roomTypesArray)) {
      return [];
    }
    return roomTypesArray.map(name => ({ type: name.trim() }));
  };

  const handleAddHotel = async (e) => {
    e.preventDefault();
    if (!validateHotel(newHotel)) return;

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setApiError('No access token found. Please login again.');
        return;
      }

      const formData = new FormData();
      const sanitizedData = sanitizeFormData(newHotel);

      Object.keys(sanitizedData).forEach(key => {
        if (key !== 'amenities' && key !== 'room_types') {
          if (sanitizedData[key] !== null) {
            formData.append(key, sanitizedData[key]);
          }
        }
      });

      // --- FIX: Format room_types correctly before sending ---
      // The backend validation expects room_types to be an array of objects like [{ type: "Standard" }]
      // The frontend stores it as an array of strings like ["Standard", "Deluxe"]
      // Convert the array of strings to the expected object format
      const formattedRoomTypes = formatRoomTypesForAPI(sanitizedData.room_types);
      formData.append('room_types', JSON.stringify(formattedRoomTypes));

      // Amenities can likely remain as an array of strings, but send as JSON string too
      formData.append('amenities', JSON.stringify(sanitizedData.amenities));

      photos.forEach(photo => {
        formData.append('photos', photo);
      });

      const response = await fetch(`${API_BASE_URL}/api/hotels`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // Do NOT set 'Content-Type' header when using FormData, the browser sets it with the correct boundary
        },
        body: formData
      });

      const responseText = await response.text();
      console.log('Add Hotel Response:', responseText);

      if (!response.ok) {
        const errorData = JSON.parse(responseText);
        throw new Error(errorData.msg || errorData.errors?.[0]?.msg || 'Failed to add hotel');
      }

      const result = JSON.parse(responseText);
      setHotels([...hotels, result.hotel]);
      resetForm();
      setApiError('');
      setIsAddSheetOpen(false);
      alert('Hotel added successfully!');
    } catch (error) {
      console.error('Error adding hotel:', error);
      setApiError(error.message);
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
      room_types: [],
      base_price: '',
      currency: 'INR'
    });
    setPhotos([]);
    setPreviewPhotos([]);
    setErrors({});
    setApiError('');
  };

  const handleUpdateHotel = async (e) => {
    e.preventDefault();
    if (!editingHotel) return;

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setApiError('No access token found. Please login again.');
        return;
      }

      const formData = new FormData();
      const sanitizedData = sanitizeFormData(editingHotel);

      Object.keys(sanitizedData).forEach(key => {
        if (key === 'amenities' || key === 'room_types') {
          if (sanitizedData[key] !== null) {
            // --- FIX: Format room_types correctly for updates too ---
            if (key === 'room_types') {
              const formattedRoomTypes = formatRoomTypesForAPI(sanitizedData[key]);
              formData.append(key, JSON.stringify(formattedRoomTypes));
            } else {
              // For amenities, just stringify the array of strings
              formData.append(key, JSON.stringify(sanitizedData[key]));
            }
          }
        } else if (key !== 'photos' && sanitizedData[key] !== null) {
          formData.append(key, sanitizedData[key]);
        }
      });

      const remainingPhotos = editingHotel.photos || [];
      formData.append('photos', JSON.stringify(remainingPhotos));

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
      console.log('Update Hotel Response:', responseText);

      if (!response.ok) {
        const errorData = JSON.parse(responseText);
        throw new Error(errorData.msg || errorData.errors?.[0]?.msg || 'Failed to update hotel');
      }

      const result = JSON.parse(responseText);
      setHotels(hotels.map(hotel => hotel.hotel_id === editingHotel.hotel_id ? result.hotel : hotel));
      setEditingHotel(null);
      setEditPhotos([]);
      setEditPreviewPhotos([]);
      setApiError('');
      alert('Hotel updated successfully!');
    } catch (error) {
      console.error('Error updating hotel:', error);
      setApiError(error.message);
    }
  };

  const handleDeleteHotel = async (hotelId) => {
    if (!window.confirm('Are you sure you want to delete this hotel? This action cannot be undone.')) return;

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        alert('No access token found. Please login again.');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/hotels/${hotelId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const responseText = await response.text();
      if (!response.ok) {
        const errorData = JSON.parse(responseText);
        throw new Error(errorData.msg || 'Failed to delete hotel');
      }

      setHotels(hotels.filter(hotel => hotel.hotel_id !== hotelId));
      alert('Hotel deleted successfully!');
    } catch (error) {
      console.error('Error deleting hotel:', error);
      alert(error.message);
    }
  };

  const startEdit = (hotel) => {
    const hotelForEdit = { ...hotel };
    if (typeof hotelForEdit.amenities === 'string') {
      try {
        hotelForEdit.amenities = JSON.parse(hotelForEdit.amenities);
      } catch {
        hotelForEdit.amenities = hotelForEdit.amenities.split(',').map(item => item.trim()).filter(item => item);
      }
    }
    if (typeof hotelForEdit.room_types === 'string') {
      try {
        hotelForEdit.room_types = JSON.parse(hotelForEdit.room_types);
      } catch {
        hotelForEdit.room_types = hotelForEdit.room_types.split(',').map(item => item.trim()).filter(item => item);
      }
    }
    setEditingHotel(hotelForEdit);
    setEditPhotos([]);
    setEditPreviewPhotos([]);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin mr-2 text-blue-600" />
        <p>Loading hotels...</p>
      </div>
    );
  }

  return (
    <Card className="w-full border-0 shadow-none">
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gray-50 p-4 sm:p-6 rounded-lg">
        <div>
          <CardTitle className="text-2xl">Hotel Management</CardTitle>
          <CardDescription>Manage your hotels and bookings</CardDescription>
        </div>
      </CardHeader>

      {apiError && (
        <div className="mx-6 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
          {apiError}
        </div>
      )}

      <CardContent>
        {/* Add Hotel Sheet */}
        <div className="mb-6">
          <Sheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen}>
            <SheetTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700 flex items-center gap-2">
                <Plus className="mr-2 h-4 w-4" /> Add Hotel
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Add New Hotel</SheetTitle>
                <SheetDescription>
                  Fill in the details to add a new hotel to your system
                </SheetDescription>
              </SheetHeader>
              <form onSubmit={handleAddHotel} className="mt-6">
                <div className="space-y-4">
                  {apiError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                      {apiError}
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
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
                    <div className="md:col-span-2">
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
                        value={newHotel.star_rating.toString()}
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
                      <Label htmlFor="base_price">Base Price (₹)</Label>
                      <Input
                        id="base_price"
                        name="base_price"
                        type="number"
                        step="0.01"
                        value={newHotel.base_price}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="currency">Currency</Label>
                      <Select
                        name="currency"
                        value={newHotel.currency}
                        onValueChange={(value) => setNewHotel(prev => ({...prev, currency: value}))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="INR">INR</SelectItem>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
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
                      <Input
                        id="photos"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                      {previewPhotos.length > 0 && (
                        <div className="mt-3 grid grid-cols-3 gap-2">
                          {previewPhotos.map((preview, index) => (
                            <div key={index} className="relative">
                              <img
                                src={preview}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-24 object-cover rounded"
                              />
                              <Button
                                type="button"
                                size="sm"
                                variant="destructive"
                                className="absolute top-1 right-1 h-6 w-6 p-0"
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
                  <div className="flex justify-end gap-2 mt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        resetForm();
                        setIsAddSheetOpen(false);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-green-600 hover:bg-green-700">
                      Add Hotel
                    </Button>
                  </div>
                </div>
              </form>
            </SheetContent>
          </Sheet>
        </div>

        {/* Hotels Grid */}
        {hotels.length === 0 ? (
          <div className="text-center py-12">
            <Building className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4 text-gray-500">No hotels found. Add your first hotel to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotels.map((hotel) => (
              <HotelCard
                key={hotel.hotel_id}
                hotel={hotel}
                onEdit={startEdit}
                onDelete={handleDeleteHotel}
              />
            ))}
          </div>
        )}

        {/* Edit Hotel Dialog */}
        {editingHotel && (
          <Dialog open={!!editingHotel} onOpenChange={() => setEditingHotel(null)}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Hotel</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleUpdateHotel}>
                <div className="space-y-4">
                  {apiError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                      {apiError}
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="edit-name">Hotel Name *</Label>
                      <Input
                        id="edit-name"
                        name="name"
                        value={editingHotel.name}
                        onChange={handleEditInputChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-city">City *</Label>
                      <Input
                        id="edit-city"
                        name="city"
                        value={editingHotel.city}
                        onChange={handleEditInputChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-country">Country *</Label>
                      <Input
                        id="edit-country"
                        name="country"
                        value={editingHotel.country}
                        onChange={handleEditInputChange}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="edit-address">Address *</Label>
                      <Input
                        id="edit-address"
                        name="address"
                        value={editingHotel.address}
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
                      <Label htmlFor="edit-base_price">Base Price (₹)</Label>
                      <Input
                        id="edit-base_price"
                        name="base_price"
                        type="number"
                        step="0.01"
                        value={editingHotel.base_price || ''}
                        onChange={handleEditInputChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-currency">Currency</Label>
                      <Select
                        name="currency"
                        value={editingHotel.currency || 'INR'}
                        onValueChange={(value) => setEditingHotel(prev => ({...prev, currency: value}))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="INR">INR</SelectItem>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
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
                        value={Array.isArray(editingHotel.amenities) ? editingHotel.amenities.join(', ') : ''}
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
                        value={Array.isArray(editingHotel.room_types) ? editingHotel.room_types.join(', ') : ''}
                        onChange={(e) => setEditingHotel(prev => ({
                          ...prev,
                          room_types: e.target.value.split(',').map(item => item.trim()).filter(item => item)
                        }))}
                        placeholder="Standard, Deluxe, Suite, etc."
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label>Current Photos</Label>
                      {editingHotel.photos && editingHotel.photos.length > 0 ? (
                        <div className="mt-2 grid grid-cols-4 gap-2">
                          {editingHotel.photos.map((photo, index) => (
                            <div key={index} className="relative">
                              <img
                                src={photo}
                                alt={`Current ${index + 1}`}
                                className="w-full h-24 object-cover rounded"
                              />
                              <Button
                                type="button"
                                size="sm"
                                variant="destructive"
                                className="absolute top-1 right-1 h-6 w-6 p-0"
                                onClick={() => removeExistingPhoto(index)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 mt-2">No photos available</p>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="edit-photos">Add New Photos</Label>
                      <Input
                        id="edit-photos"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleEditFileChange}
                      />
                      {editPreviewPhotos.length > 0 && (
                        <div className="mt-3 grid grid-cols-4 gap-2">
                          {editPreviewPhotos.map((preview, index) => (
                            <div key={index} className="relative">
                              <img
                                src={preview}
                                alt={`New Preview ${index + 1}`}
                                className="w-full h-24 object-cover rounded"
                              />
                              <Button
                                type="button"
                                size="sm"
                                variant="destructive"
                                className="absolute top-1 right-1 h-6 w-6 p-0"
                                onClick={() => removePreview(index, true)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setEditingHotel(null);
                        setEditPhotos([]);
                        setEditPreviewPhotos([]);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                      Update Hotel
                    </Button>
                  </div>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
};

export default Hotels;