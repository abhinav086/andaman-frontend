// src/admin/AdminPanel.jsx (Updated)
import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Package,
  BarChart3,
  Settings,
  Building,
  MapPin,
  BookOpen,
  FileText,
  LogOut,
  Menu,
  X,
  Home
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminPanel = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Determine active tab based on the current route path
  const getActiveTabFromPath = () => {
    const path = location.pathname;
    if (path.includes('/admin-management')) return 'management';
    if (path.includes('/admin-users')) return 'users';
    if (path.includes('/admin-hotels')) return 'hotels';
    if (path.includes('/admin-activities')) return 'activities';
    if (path.includes('/admin-blogs')) return 'blogs';
    if (path.includes('/admin-blogbooks')) return 'blogbooks';
    if (path.includes('/')) return 'Main Website';
    if (path === '/admin') return 'dashboard';
    return 'dashboard';
  };

  const [activeTab, setActiveTab] = useState(getActiveTabFromPath());
  const [sidebarOpen, setSidebarOpen] = useState(false);

  React.useEffect(() => {
     setActiveTab(getActiveTabFromPath());
  }, [location.pathname]);

  const handleTabChange = (tabId) => {
    let route = '/admin';
    switch (tabId) {
      case 'management':
        route = '/admin-management';
        break;
      case 'users':
        route = '/admin-users';
        break;
      case 'hotels':
        route = '/admin-hotels';
        break;
      case 'activities':
        route = '/admin-activities';
        break;
      case 'blogs':
        route = '/admin-blogs';
        break;
      case 'blogbooks':
        route = '/admin-blogbooks';
        break;
      case 'Main Website':
        route = '/';
        break;
      default:
        route = '/admin';
    }
    setActiveTab(tabId);
    navigate(route);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-0`}>
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Admin Panel</h2>
          <p className="text-sm text-gray-500">Hello, {user?.full_name || user?.email}</p>
        </div>
        <div className="p-4">
          <nav className="space-y-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3, route: '/admin' },
              { id: 'Main Website', label: 'Main Website', icon: Home, route: '/' },
              { id: 'users', label: 'User Management', icon: Users, route: '/admin-users' },
              { id: 'management', label: 'Admin Management', icon: Settings, route: '/admin-management' },
              { id: 'hotels', label: 'Hotels', icon: Building, route: '/admin-hotels' },
              { id: 'activities', label: 'Activities', icon: MapPin, route: '/admin-activities' },
              { id: 'blogs', label: 'Blogs (Posts)', icon: FileText, route: '/admin-blogs' },
              { id: 'blogbooks', label: 'Blog Books', icon: BookOpen, route: '/admin-blogbooks' },
              
              { id: 'settings', label: 'Settings', icon: Settings, route: '/admin-settings' }
            ].map((item) => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "secondary" : "ghost"}
                className={`w-full justify-start ${
                  activeTab === item.id ? "bg-gray-200" : ""
                }`}
                onClick={() => handleTabChange(item.id)}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            ))}
            <Button
              className="w-full justify-start mt-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700"
              onClick={() => {
                navigate('/');
              }}
            >
              <Home className="mr-2 h-4 w-4" />
              Home
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => {
                logout();
                navigate('/login');
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1">
        <div className="p-4 md:p-8">
          <div className="md:hidden mb-4">
            <Button variant="outline" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              {sidebarOpen ? 'Close Menu' : 'Open Menu'}
            </Button>
          </div>
          <div className="max-w-7xl mx-auto">
            <div>
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Dashboard Content Component
AdminPanel.DashboardContent = () => {
  const { user } = useAuth();

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">Total Users</p>
                <p className="text-3xl font-bold">0</p>
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
                <p className="text-3xl font-bold">0</p>
              </div>
              <Users className="h-12 w-12 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">Admins</p>
                <p className="text-3xl font-bold">0</p>
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
                <p className="text-3xl font-bold">0</p>
              </div>
              <Package className="h-12 w-12 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Overview</CardTitle>
          <CardDescription>Welcome to the admin dashboard. Select a section from the sidebar to manage.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Select an item from the left sidebar to get started.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPanel;