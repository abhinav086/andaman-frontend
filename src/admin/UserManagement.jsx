import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  UserPlus,
  Trash2,
  Search
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config/api';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newUserData, setNewUserData] = useState({
    full_name: '',
    email: '',
    password: '',
    phone_number: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchFilters, setSearchFilters] = useState({
    full_name: '',
    role: ''
  });

  const { user } = useAuth();

  const getAuthToken = () => {
    return localStorage.getItem('accessToken');
  };

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.msg || `Failed to fetch users: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setUsers(data);
      setFilteredUsers(data);
    } catch (err) {
      console.error('Fetch users error:', err);
      setError('Failed to load users: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = [...users];

    if (searchFilters.full_name) {
      const name = searchFilters.full_name.toLowerCase();
      result = result.filter(u => u.full_name.toLowerCase().includes(name));
    }

    if (searchFilters.role) {
      result = result.filter(u => u.role === searchFilters.role);
    }

    setFilteredUsers(result);
  }, [searchFilters, users]);

  // ✅ Changed: Now creates a regular USER
  const handleCreateUser = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      // ✅ Use regular user registration endpoint
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newUserData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.msg || 'Failed to create user');
      }

      setSuccess('User created successfully!');
      setNewUserData({ full_name: '', email: '', password: '', phone_number: '' });
      setShowCreateForm(false);
      fetchUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (userId === user?.user_id) {
      setError("You cannot delete your own account.");
      return;
    }

    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;

    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.msg || 'Failed to delete user');
      }

      setSuccess('User deleted successfully');
      fetchUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>User Management</CardTitle>
              <CardDescription>View, search, and manage all user accounts</CardDescription>
            </div>
            <Button onClick={() => setShowCreateForm(!showCreateForm)}>
              <UserPlus className="mr-2 h-4 w-4" /> 
              {showCreateForm ? 'Cancel' : 'Create User'} {/* ✅ Updated text */}
            </Button>
          </div>
        </CardHeader>

        {showCreateForm && (
          <CardContent>
            <form onSubmit={handleCreateUser} className="space-y-4"> {/* ✅ Updated handler */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <Input
                    value={newUserData.full_name}
                    onChange={(e) => setNewUserData({...newUserData, full_name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <Input
                    type="email"
                    value={newUserData.email}
                    onChange={(e) => setNewUserData({...newUserData, email: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Password</label>
                  <Input
                    type="password"
                    value={newUserData.password}
                    onChange={(e) => setNewUserData({...newUserData, password: e.target.value})}
                    required
                    minLength={6}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone Number</label>
                  <Input
                    value={newUserData.phone_number}
                    onChange={(e) => setNewUserData({...newUserData, phone_number: e.target.value})}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full md:w-auto">Create User</Button> {/* ✅ Updated text */}
            </form>
          </CardContent>
        )}

        <CardContent>
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by name..."
                value={searchFilters.full_name}
                onChange={(e) => setSearchFilters({...searchFilters, full_name: e.target.value})}
                className="pl-10"
              />
            </div>
            <select
              value={searchFilters.role}
              onChange={(e) => setSearchFilters({...searchFilters, role: e.target.value})}
              className="border rounded-md px-3 py-2 w-full md:w-auto"
            >
              <option value="">All Roles</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left py-3 px-4 font-medium">User</th>
                  <th className="text-left py-3 px-4 font-medium">Email</th>
                  <th className="text-left py-3 px-4 font-medium">Phone</th>
                  <th className="text-left py-3 px-4 font-medium">Role</th>
                  <th className="text-left py-3 px-4 font-medium">Created</th>
                  <th className="text-left py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center">
                      Loading users...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-gray-500">
                      No users found
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((userItem) => (
                    <tr key={userItem.user_id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="font-medium">{userItem.full_name}</div>
                        <div className="text-sm text-gray-500">ID: {userItem.user_id}</div>
                      </td>
                      <td className="py-3 px-4">{userItem.email}</td>
                      <td className="py-3 px-4">{userItem.phone_number || '—'}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          userItem.role === 'admin' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {userItem.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500">
                        {new Date(userItem.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDeleteUser(userItem.user_id)}
                          disabled={userItem.user_id === user?.user_id}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;