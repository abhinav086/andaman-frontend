import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import axios from 'axios';

const API_BASE_URL = 'https://makeandman.onrender.com';

const AdminBlog = () => {
  const { token: authToken, user } = useAuth();
  const [token, setToken] = useState(null);

  const [bookTitle, setBookTitle] = useState('');
  const [bookSlug, setBookSlug] = useState('');
  const [bookDescription, setBookDescription] = useState('');
  const [bookIsPublished, setBookIsPublished] = useState(false);
  const [bookCoverImage, setBookCoverImage] = useState(null);
  const [selectedBlogIds, setSelectedBlogIds] = useState([]);
  const [availableBlogs, setAvailableBlogs] = useState([]);
  const [blogsLoading, setBlogsLoading] = useState(false);

  const [blogBooks, setBlogBooks] = useState([]);
  const [blogBooksLoading, setBlogBooksLoading] = useState(false);
  const [blogTitles, setBlogTitles] = useState({});

  const [loading, setLoading] = useState(false);

  // Modal state
  const [selectedBookDetails, setSelectedBookDetails] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (authToken) {
      setToken(authToken);
    } else {
      const storedToken = localStorage.getItem('accessToken');
      if (storedToken) {
        setToken(storedToken);
      }
    }
  }, [authToken]);

  useEffect(() => {
    if (token) {
      fetchAvailableBlogs();
    }
  }, [token]);

  const fetchAvailableBlogs = async () => {
    setBlogsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/blogs`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      let blogs = [];
      if (Array.isArray(response.data)) {
        blogs = response.data;
      } else if (response.data.blogs) {
        blogs = response.data.blogs;
      } else if (response.data.data) {
        blogs = response.data.data;
      } else {
        blogs = response.data;
      }

      if (!Array.isArray(blogs)) blogs = [];

      const normalizedBlogs = blogs.map(blog => ({
        blog_id: blog._id || blog.id || blog.blog_id || blog.uid,
        title: blog.title || blog.name || 'Untitled Blog',
        slug: blog.slug || '',
        summary: blog.summary || blog.content?.substring(0, 100) + '...' || '',
      }));

      const titleMap = {};
      normalizedBlogs.forEach(blog => {
        titleMap[blog.blog_id] = blog.title;
      });
      setBlogTitles(prev => ({ ...prev, ...titleMap }));
      setAvailableBlogs(normalizedBlogs);
    } catch (error) {
      console.error('❌ Error fetching blogs:', error);
      let errorMsg = 'Failed to load blogs';
      if (error.response) {
        errorMsg = error.response.data?.msg || error.response.data?.message || 
                  `Server Error: ${error.response.status}`;
      } else if (error.request) {
        errorMsg = 'Network error: Unable to connect to the server.';
      } else {
        errorMsg = error.message || 'An unexpected error occurred';
      }
      toast.error(errorMsg);
    } finally {
      setBlogsLoading(false);
    }
  };

  const fetchBlogBooks = async () => {
    if (!token) {
      toast.error('Authentication token missing.');
      return;
    }

    setBlogBooksLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/blog-books`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      let books = [];
      if (Array.isArray(response.data)) {
        books = response.data;
      } else if (response.data.blog_books) {
        books = response.data.blog_books;
      } else if (response.data.data) {
        books = response.data.data;
      } else {
        books = response.data;
      }

      if (!Array.isArray(books)) books = [];
      setBlogBooks(books);
      toast.success('Blog books loaded successfully!');
    } catch (error) {
      console.error('❌ Error fetching blog books:', error);
      let errorMsg = 'Failed to load blog books';
      if (error.response) {
        errorMsg = error.response.data?.msg || error.response.data?.message || 
                  `Server Error: ${error.response.status}`;
      } else if (error.request) {
        errorMsg = 'Network error: Unable to connect to the server.';
      } else {
        errorMsg = error.message || 'An unexpected error occurred';
      }
      toast.error(errorMsg);
    } finally {
      setBlogBooksLoading(false);
    }
  };

  useEffect(() => {
    if (blogBooks.length > 0 && Object.keys(blogTitles).length === 0) {
      fetchAllBlogTitles();
    }
  }, [blogBooks]);

  const fetchAllBlogTitles = async () => {
    const allBlogIds = [];
    blogBooks.forEach(book => {
      if (book.table_of_contents) {
        book.table_of_contents.forEach(item => {
          if (!allBlogIds.includes(item.blog_id)) {
            allBlogIds.push(item.blog_id);
          }
        });
      }
    });

    if (allBlogIds.length === 0) return;

    try {
      const promises = allBlogIds.map(id => 
        axios.get(`${API_BASE_URL}/api/blogs/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      );
      
      const responses = await Promise.all(promises);
      const titles = {};
      responses.forEach(response => {
        const blog = response.data;
        titles[blog._id || blog.id || blog.blog_id || blog.uid] = blog.title;
      });
      
      setBlogTitles(prev => ({ ...prev, ...titles }));
    } catch (error) {
      console.error('Error fetching blog titles:', error);
    }
  };

  const handleBookSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error('Authentication token missing.');
      return;
    }

    if (!bookTitle.trim() || !bookSlug.trim()) {
      toast.error('Title and Slug are required for Blog Book.');
      return;
    }

    if (selectedBlogIds.length === 0) {
      toast.error('Please select at least one blog for the blog book.');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('title', bookTitle);
    formData.append('slug', bookSlug);
    if (bookDescription) formData.append('description', bookDescription);
    formData.append('is_published', bookIsPublished.toString());
    if (bookCoverImage) formData.append('cover_image', bookCoverImage);

    const blogOrderData = selectedBlogIds.map(item => ({
      blog_id: item.blog_id,
      position_order: item.position_order
    }));
    formData.append('blog_ids_with_order', JSON.stringify(blogOrderData));

    try {
      const response = await axios.post(`${API_BASE_URL}/api/blog-books`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
      });

      if (response.status === 201 || response.status === 200) {
        toast.success('Blog Book created successfully!');
        setBookTitle('');
        setBookSlug('');
        setBookDescription('');
        setBookIsPublished(false);
        setBookCoverImage(null);
        setSelectedBlogIds([]);
        fetchAvailableBlogs();
        fetchBlogBooks();
      } else {
        toast.error(response.data.msg || `Failed to create blog book: ${response.status}`);
      }
    } catch (error) {
      console.error('Error creating blog book:', error);
      let errorMsg = 'Failed to create blog book';
      if (error.response?.data?.msg) {
        errorMsg = error.response.data.msg;
      } else if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (error.response) {
        errorMsg = `Server Error: ${error.response.status}`;
      } else if (error.request) {
        errorMsg = 'Network error. Check your connection.';
      } else {
        errorMsg = error.message || 'Unexpected error';
      }
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleBlogSelect = (e) => {
    const blogId = e.target.value;
    if (!blogId) return;

    const existingIndex = selectedBlogIds.findIndex(item => item.blog_id === blogId);
    if (existingIndex > -1) {
      const newOrder = prompt(`Blog ID ${blogId} is already selected. Enter new order position (positive number):`, 
                             selectedBlogIds[existingIndex].position_order);
      const newOrderNum = parseInt(newOrder);
      if (!isNaN(newOrderNum) && newOrderNum > 0) {
        const updated = [...selectedBlogIds];
        updated[existingIndex] = { blog_id: blogId, position_order: newOrderNum };
        setSelectedBlogIds(updated.sort((a, b) => a.position_order - b.position_order));
      } else {
        toast.error('Order position must be a positive number');
      }
    } else {
      const order = prompt(`Enter order position for Blog ID ${blogId} (positive number):`);
      const orderNum = parseInt(order);
      if (!isNaN(orderNum) && orderNum > 0) {
        setSelectedBlogIds([...selectedBlogIds, { blog_id: blogId, position_order: orderNum }]
          .sort((a, b) => a.position_order - b.position_order));
      } else {
        toast.error('Order position must be a positive number');
      }
    }
  };

  const removeSelectedBlog = (blogId) => {
    setSelectedBlogIds(selectedBlogIds.filter(item => item.blog_id !== blogId));
  };

  const handleBookClick = (book) => {
    setSelectedBookDetails(book);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBookDetails(null);
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-red-500">Access Denied: Admins only.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard: Blog Books</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Create New Blog Book</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleBookSubmit} className="space-y-4">
            <div>
              <Label htmlFor="bookTitle">Title *</Label>
              <Input
                id="bookTitle"
                value={bookTitle}
                onChange={(e) => setBookTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="bookSlug">Slug *</Label>
              <Input
                id="bookSlug"
                value={bookSlug}
                onChange={(e) => setBookSlug(e.target.value)}
                required
                placeholder="e.g., andaman-travel-guide"
              />
            </div>
            <div>
              <Label htmlFor="bookDescription">Description</Label>
              <Textarea
                id="bookDescription"
                value={bookDescription}
                onChange={(e) => setBookDescription(e.target.value)}
                rows={3}
                placeholder="Describe your blog book..."
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="bookIsPublished"
                checked={bookIsPublished}
                onCheckedChange={setBookIsPublished}
              />
              <Label htmlFor="bookIsPublished">Publish</Label>
            </div>
            <div>
              <Label htmlFor="bookCoverImage">Cover Image</Label>
              <Input
                id="bookCoverImage"
                type="file"
                accept="image/*"
                onChange={(e) => setBookCoverImage(e.target.files[0])}
              />
            </div>
            <div>
              <Label htmlFor="selectBlog">Add Blogs to Book</Label>
              <div className="flex space-x-2">
                <select
                  id="selectBlog"
                  onChange={handleBlogSelect}
                  value=""
                  className="flex-1 border rounded p-2"
                  disabled={blogsLoading}
                >
                  <option value="">Select Blog</option>
                  {blogsLoading ? (
                    <option>Loading blogs...</option>
                  ) : availableBlogs.length === 0 ? (
                    <option>No blogs available</option>
                  ) : (
                    availableBlogs
                      .filter(ab => !selectedBlogIds.some(sb => sb.blog_id === ab.blog_id))
                      .map((blog) => (
                        <option key={blog.blog_id} value={blog.blog_id}>
                          {blog.title} (ID: {blog.blog_id})
                        </option>
                      ))
                  )}
                </select>
              </div>
              {blogsLoading && <p className="text-sm text-gray-500 mt-1">Loading available blogs...</p>}
              {!blogsLoading && availableBlogs.length === 0 && (
                <p className="text-red-500 text-sm mt-1">
                  No blogs found. Please create some blogs first.
                </p>
              )}
            </div>
            <div className="mt-2">
              <h4 className="text-sm font-medium mb-1">Selected Blogs:</h4>
              {selectedBlogIds.length === 0 ? (
                <p className="text-sm text-gray-500">No blogs added yet.</p>
              ) : (
                <ul className="space-y-1">
                  {selectedBlogIds
                    .sort((a, b) => a.position_order - b.position_order)
                    .map((item) => {
                      const blog = availableBlogs.find(ab => ab.blog_id === item.blog_id);
                      return (
                        <li key={item.blog_id} className="text-sm flex justify-between items-center bg-gray-100 p-1 rounded">
                          <span>{item.position_order}. {blog?.title || `Blog ID: ${item.blog_id}`}</span>
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeSelectedBlog(item.blog_id)}>
                            Remove
                          </Button>
                        </li>
                      );
                    })}
                </ul>
              )}
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating Book...' : 'Create Blog Book'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Manage Blog Books</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={fetchBlogBooks} disabled={blogBooksLoading} className="mb-4">
            {blogBooksLoading ? 'Loading Blog Books...' : 'Fetch All Blog Books'}
          </Button>

          {blogBooks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {blogBooks.map(book => (
                <Card 
                  key={book.book_id} 
                  className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleBookClick(book)}
                >
                  {book.cover_image && (
                    <img 
                      src={book.cover_image} 
                      alt={book.title} 
                      className="w-full h-32 object-cover"
                    />
                  )}
                  <CardHeader>
                    <CardTitle className="text-lg">{book.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-2">Slug: {book.slug}</p>
                    <p className="text-sm text-gray-600 mb-2">Published: {book.is_published ? 'Yes' : 'No'}</p>
                    <p className="text-sm text-gray-600 mb-2">
                      Blogs: {book.table_of_contents?.length || 0}
                    </p>
                    {book.table_of_contents && book.table_of_contents.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs font-medium mb-1">Included Blogs:</p>
                        <ul className="text-xs text-gray-700 space-y-1">
                          {book.table_of_contents.slice(0, 3).map((item, index) => (
                            <li key={item.blog_id} className="flex items-center">
                              <span className="mr-2">{index + 1}.</span>
                              <span>
                                {blogTitles[item.blog_id] || `Blog ID: ${item.blog_id}`}
                              </span>
                            </li>
                          ))}
                          {book.table_of_contents.length > 3 && (
                            <li className="text-gray-500">+ {book.table_of_contents.length - 3} more...</li>
                          )}
                        </ul>
                      </div>
                    )}
                    {book.description && (
                      <p className="text-sm text-gray-700 line-clamp-2 mt-2">{book.description}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : blogBooksLoading ? (
            <p className="text-gray-500">Loading blog books...</p>
          ) : (
            <p className="text-gray-500">No blog books found. Create one above!</p>
          )}
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          {selectedBookDetails && (
            <>
              <DialogHeader>
                <DialogTitle className="flex justify-between items-start">
                  <span className="pr-4">{selectedBookDetails.title}</span>
                  <span className={`text-xs px-2 py-1 rounded whitespace-nowrap ${selectedBookDetails.is_published ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {selectedBookDetails.is_published ? 'Published' : 'Draft'}
                  </span>
                </DialogTitle>
                <DialogDescription>
                  Complete blog book details and contents
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 mt-4">
                {selectedBookDetails.cover_image && (
                  <div>
                    <Label className="text-sm font-semibold">Cover Image</Label>
                    <img 
                      src={selectedBookDetails.cover_image} 
                      alt={selectedBookDetails.title}
                      className="w-full h-64 object-cover rounded-lg mt-2"
                    />
                  </div>
                )}
                
                <div>
                  <Label className="text-sm font-semibold">Slug</Label>
                  <p className="text-sm text-gray-700 mt-1">{selectedBookDetails.slug}</p>
                </div>
                
                {selectedBookDetails.description && (
                  <div>
                    <Label className="text-sm font-semibold">Description</Label>
                    <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">{selectedBookDetails.description}</p>
                  </div>
                )}
                
                <div>
                  <Label className="text-sm font-semibold">Book ID</Label>
                  <p className="text-sm text-gray-700 mt-1">{selectedBookDetails.book_id}</p>
                </div>
                
                <div className="border-t pt-4">
                  <Label className="text-sm font-semibold">Table of Contents ({selectedBookDetails.table_of_contents?.length || 0} blogs)</Label>
                  {selectedBookDetails.table_of_contents && selectedBookDetails.table_of_contents.length > 0 ? (
                    <div className="mt-3 space-y-2">
                      {selectedBookDetails.table_of_contents.map((item, index) => (
                        <div key={item.blog_id} className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-900">{index + 1}.</span>
                                <span className="text-sm font-medium text-gray-900">
                                  {blogTitles[item.blog_id] || 'Loading...'}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">Blog ID: {item.blog_id}</p>
                              {item.position_order && (
                                <p className="text-xs text-gray-500">Position: {item.position_order}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 mt-2">No blogs in this book</p>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                  {selectedBookDetails.created_at && (
                    <div>
                      <Label className="text-sm font-semibold">Created At</Label>
                      <p className="text-sm text-gray-700 mt-1">
                        {new Date(selectedBookDetails.created_at).toLocaleString()}
                      </p>
                    </div>
                  )}
                  {selectedBookDetails.updated_at && (
                    <div>
                      <Label className="text-sm font-semibold">Updated At</Label>
                      <p className="text-sm text-gray-700 mt-1">
                        {new Date(selectedBookDetails.updated_at).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button variant="outline" onClick={handleCloseModal}>
                    Close
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminBlog;