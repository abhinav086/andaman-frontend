import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';

const Locations = () => {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockLocations = [
      { id: 1, name: 'Cellular Jail', category: 'Historical', description: 'Historical site of colonial prison' },
      { id: 2, name: 'Radhanagar Beach', category: 'Beach', description: 'One of the most beautiful beaches in Asia' },
      { id: 3, name: 'Elephant Beach', category: 'Beach', description: 'Popular for water sports and marine activities' },
      { id: 4, name: 'Chidiya Tapu', category: 'Scenic Spot', description: 'Bird Island with beautiful sunset views' },
      { id: 5, name: 'Ross Island', category: 'Historical', description: 'Abandoned colonial settlement' },
      { id: 6, name: 'Baratang Island', category: 'Adventure', description: 'Mud volcanoes and limestone caves' },
    ];
    setLocations(mockLocations);
  }, []);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Locations Management</CardTitle>
            <CardDescription>Manage tourist locations in Andaman & Nicobar</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Select Location:</label>
          <select 
            className="w-full md:w-1/2 border rounded px-3 py-2"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            <option value="">Select a tourist location</option>
            {locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.name} - {location.category}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {locations.map((location) => (
            <Card key={location.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  {location.name}
                </CardTitle>
                <CardDescription>{location.category}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{location.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Locations;