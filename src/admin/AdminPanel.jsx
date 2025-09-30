// src/admin/AdminPanel.jsx (Updated)
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Package,
  BarChart3,
  Settings,
  Building,
  MapPin // Add MapPin for Activities
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Hotels from './Hotels';
import AdminActivities from './AdminActivities'; // Import the new AdminActivities component
import AdminManagement from './AdminManagement';
import UserManagement from './UserManagement';

const AdminPanel = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Mock stats for dashboard (you can enhance later with real API)
  const stats = {
    totalUsers: 128,
    activeUsers: 112,
    adminUsers: 5,
    suspendedUsers: 16
  };

  const renderDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">Total Users</p>
              <p className="text-3xl font-bold">{stats.totalUsers}</p>
            </div>
            <Users className="h-12 w-12 opacity-80" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">Active Users</p>
              <p className="text-3xl font-bold">{stats.activeUsers}</p>
            </div>
            <BarChart3 className="h-12 w-12 opacity-80" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">Admin Users</p>
              <p className="text-3xl font-bold">{stats.adminUsers}</p>
            </div>
            <Settings className="h-12 w-12 opacity-80" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">Suspended</p>
              <p className="text-3xl font-bold">{stats.suspendedUsers}</p>
            </div>
            <Package className="h-12 w-12 opacity-80" />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.full_name || user?.email}</p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-64">
            <Card>
              <CardContent className="p-4">
                <nav className="space-y-2">
                  {[
                    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
                    { id: 'users', label: 'User Management', icon: Users },
                    { id: 'admins', label: 'Admin Management', icon: Settings },
                    { id: 'hotels', label: 'Hotels', icon: Building },
                    { id: 'activities', label: 'Activities', icon: MapPin }, // Add Activities tab
                    { id: 'settings', label: 'Settings', icon: Settings },
                  ].map((item) => (
                    <Button
                      key={item.id}
                      variant={activeTab === item.id ? 'default' : 'ghost'}
                      className="w-full justify-start"
                      onClick={() => setActiveTab(item.id)}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.label}
                    </Button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'users' && <UserManagement />}
            {activeTab === 'admins' && <AdminManagement />}
            {activeTab === 'hotels' && <Hotels />}
            {activeTab === 'activities' && <AdminActivities />} 
            {activeTab === 'settings' && (
              <Card>
                <CardHeader>
                  <CardTitle>System Settings</CardTitle>
                  <CardDescription>Manage system configurations</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Settings panel content will go here</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;