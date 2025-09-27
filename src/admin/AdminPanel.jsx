import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  Package, 
  BarChart3, 
  Settings,
  Search,
  Eye,
  Edit,
  Trash2,
  UserPlus,
  Filter,
  Building,
  MapPin
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Hotels from './Hotels';
import Locations from './Locations';
import AdminManagement from './AdminManagement'; // Import the new component

const AdminPanel = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockUsers = [
      { id: 1, full_name: 'John Doe', email: 'john@example.com', role: 'admin', created_at: '2023-01-15', status: 'active' },
      { id: 2, full_name: 'Jane Smith', email: 'jane@example.com', role: 'user', created_at: '2023-02-20', status: 'active' },
      { id: 3, full_name: 'Bob Johnson', email: 'bob@example.com', role: 'user', created_at: '2023-03-10', status: 'suspended' },
      { id: 4, full_name: 'Alice Brown', email: 'alice@example.com', role: 'user', created_at: '2023-04-05', status: 'active' },
    ];
    setUsers(mockUsers);
  }, []);

  const handleUserAction = (action, userId) => {
    console.log(`${action} user ${userId}`);
    // Implement actual user management logic here
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.status === 'active').length,
    adminUsers: users.filter(u => u.role === 'admin').length,
    suspendedUsers: users.filter(u => u.status === 'suspended').length
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

  const renderUserManagement = () => (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Manage all registered users</CardDescription>
          </div>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" /> Add User
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-3 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select 
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="border rounded px-3 py-2"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">User</th>
                <th className="text-left py-3 px-4">Role</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Created</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="font-medium">{user.full_name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                      {user.role}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>
                      {user.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleUserAction('view', user.id)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleUserAction('edit', user.id)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleUserAction('delete', user.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
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
                    { id: 'admins', label: 'Admin Management', icon: Settings }, // Updated
                    { id: 'hotels', label: 'Hotels', icon: Building },
                    { id: 'locations', label: 'Locations', icon: MapPin },
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
            {activeTab === 'users' && renderUserManagement()}
            {activeTab === 'admins' && <AdminManagement />} {/* Added */}
            {activeTab === 'hotels' && <Hotels />}
            {activeTab === 'locations' && <Locations />}
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