import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  UserPlus,
  Trash2,
  Search,
  Calendar,
  Mail,
  Phone,
  User,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config/api';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

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

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

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
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">User Management</CardTitle>
              <CardDescription className="mt-1">
                View, search, and manage all user accounts
              </CardDescription>
            </div>
            <Button 
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="gap-2"
            >
              <UserPlus className="h-4 w-4" /> 
              {showCreateForm ? 'Cancel' : 'Create User'}
            </Button>
          </div>
        </CardHeader>

        {showCreateForm && (
          <div className="px-6 pb-6">
            <Separator />
            <form onSubmit={handleCreateUser} className="space-y-4 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="full_name"
                      value={newUserData.full_name}
                      onChange={(e) => setNewUserData({...newUserData, full_name: e.target.value})}
                      placeholder="Enter full name"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={newUserData.email}
                      onChange={(e) => setNewUserData({...newUserData, email: e.target.value})}
                      placeholder="Enter email address"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type="password"
                      value={newUserData.password}
                      onChange={(e) => setNewUserData({...newUserData, password: e.target.value})}
                      placeholder="Enter password"
                      required
                      minLength={6}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone_number">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone_number"
                      value={newUserData.phone_number}
                      onChange={(e) => setNewUserData({...newUserData, phone_number: e.target.value})}
                      placeholder="Enter phone number"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button type="submit" className="w-full md:w-auto">
                  Create User
                </Button>
              </div>
            </form>
          </div>
        )}

        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-3 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by name..."
                value={searchFilters.full_name}
                onChange={(e) => setSearchFilters({...searchFilters, full_name: e.target.value})}
                className="pl-10"
              />
            </div>
            
           <Select
  value={searchFilters.role}
  onValueChange={(value) => setSearchFilters({
    ...searchFilters, 
    role: value === 'all' ? '' : value
  })}
>
  <SelectTrigger className="w-full md:w-[180px]">
    <SelectValue placeholder="Filter by role" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="all">All Roles</SelectItem>
    <SelectItem value="user">User</SelectItem>
    <SelectItem value="admin">Admin</SelectItem>
  </SelectContent>
</Select>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="flex items-center gap-2 text-destructive bg-destructive/10 p-4 rounded-lg">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}
      
      {success && (
        <div className="flex items-center gap-2 text-green-700 bg-green-100 p-4 rounded-lg">
          <CheckCircle className="h-5 w-5" />
          <span>{success}</span>
        </div>
      )}

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Loading users...
                </TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((userItem) => (
                <TableRow key={userItem.user_id} className="hover:bg-accent/50">
                  <TableCell>
                    <div className="font-medium">{userItem.full_name}</div>
                    <div className="text-sm text-muted-foreground">ID: {userItem.user_id}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      {userItem.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    {userItem.phone_number ? (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        {userItem.phone_number}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={userItem.role === 'admin' ? 'default' : 'secondary'}
                      className="capitalize"
                    >
                      {userItem.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {new Date(userItem.created_at).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          disabled={userItem.user_id === user?.user_id}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the user account and remove their data from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDeleteUser(userItem.user_id)}
                            className="bg-destructive hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default UserManagement;



