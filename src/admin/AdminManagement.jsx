import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  UserPlus,
  Trash2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config/api';

const AdminManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newAdminData, setNewAdminData] = useState({
    full_name: '',
    email: '',
    password: '',
    phone_number: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { user } = useAuth();

  // Fetch all admins
  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/users`, { // Correct endpoint
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Failed to fetch admins');
      }
      
      const allUsers = await response.json();
      const adminList = allUsers.filter(u => u.role === 'admin');
      setAdmins(adminList);
    } catch (err) {
      setError('Failed to load admins: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/admin-register`, { // Fixed endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(newAdminData)
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.msg || 'Failed to create admin');
      }
      
      setSuccess('Admin created successfully!');
      setNewAdminData({ full_name: '', email: '', password: '', phone_number: '' });
      setShowCreateForm(false);
      fetchAdmins(); // Refresh the list
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteAdmin = async (adminId) => {
    if (!window.confirm('Are you sure you want to delete this admin?')) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/users/${adminId}`, { // Fixed endpoint
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Failed to delete admin');
      }
      
      setSuccess('Admin deleted successfully');
      fetchAdmins(); // Refresh the list
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Admin Management</CardTitle>
              <CardDescription>Manage administrator accounts</CardDescription>
            </div>
            <Button onClick={() => setShowCreateForm(!showCreateForm)}>
              <UserPlus className="mr-2 h-4 w-4" /> 
              {showCreateForm ? 'Cancel' : 'Create Admin'}
            </Button>
          </div>
        </CardHeader>
        
        {showCreateForm && (
          <CardContent>
            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <Input
                    value={newAdminData.full_name}
                    onChange={(e) => setNewAdminData({...newAdminData, full_name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <Input
                    type="email"
                    value={newAdminData.email}
                    onChange={(e) => setNewAdminData({...newAdminData, email: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Password</label>
                  <Input
                    type="password"
                    value={newAdminData.password}
                    onChange={(e) => setNewAdminData({...newAdminData, password: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone Number</label>
                  <Input
                    value={newAdminData.phone_number}
                    onChange={(e) => setNewAdminData({...newAdminData, phone_number: e.target.value})}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full md:w-auto">Create Admin</Button>
            </form>
          </CardContent>
        )}
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
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Admin</th>
                  <th className="text-left py-3 px-4">Email</th>
                  <th className="text-left py-3 px-4">Phone</th>
                  <th className="text-left py-3 px-4">Created</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="py-8 text-center">
                      Loading admins...
                    </td>
                  </tr>
                ) : admins.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-gray-500">
                      No admins found
                    </td>
                  </tr>
                ) : (
                  admins.map((admin) => (
                    <tr key={admin.user_id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="font-medium">{admin.full_name}</div>
                        <div className="text-sm text-gray-500">ID: {admin.user_id}</div>
                      </td>
                      <td className="py-3 px-4">{admin.email}</td>
                      <td className="py-3 px-4">{admin.phone_number || 'N/A'}</td>
                      <td className="py-3 px-4 text-sm text-gray-500">
                        {new Date(admin.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleDeleteAdmin(admin.user_id)}
                            disabled={admin.user_id === user?.user_id}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
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

export default AdminManagement;