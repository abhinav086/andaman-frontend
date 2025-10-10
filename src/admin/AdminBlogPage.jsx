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

const AdminBlogPage = () => {
  const { user, loading: authLoading } = useAuth();
  const [token, setToken] = useState(null);
  const [viewMode, setViewMode] = useState('create');

  const [blogTitle, setBlogTitle] = useState('');
  const [blogSlug, setBlogSlug] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [blogSummary, setBlogSummary] = useState('');
  const [blogTags, setBlogTags] = useState('');
  const [blogIsPublished, setBlogIsPublished] = useState(false);
  const [blogCoverImage, setBlogCoverImage] = useState(null);
  const [creatingBlog, setCreatingBlog] = useState(false);

  const [blogs, setBlogs] = useState([]);
  const [loadingBlogs, setLoadingBlogs] = useState(false);
  
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    setToken(storedToken);
  }, []);

  const fetchBlogs = async () => {
    if (!token) return;
    setLoadingBlogs(true);
    try {
      const cleanBaseUrl = API_BASE_URL.trim();
      const response = await axios.get(`${cleanBaseUrl}/api/blogs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBlogs(response.data.blogs || response.data);
    } catch (error) {
      console.error('Failed to fetch blogs:', error);
      toast.error('Failed to load blogs.');
    } finally {
      setLoadingBlogs(false);
    }
  };

  useEffect(() => {
    if (viewMode === 'list') {
      fetchBlogs();
    }
  }, [viewMode, token]);

  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error('Authentication token missing.');
      return;
    }

    if (!blogTitle.trim() || !blogSlug.trim() || !blogContent.trim()) {
      toast.error('Title, Slug, and Content are required.');
      return;
    }

    setCreatingBlog(true);

    try {
      const formData = new FormData();
      formData.append('title', blogTitle.trim());
      formData.append('slug', blogSlug.trim());
      formData.append('content', blogContent.trim());
      if (blogSummary.trim()) formData.append('summary', blogSummary.trim());
      if (blogTags.trim()) {
        const tagArray = blogTags.trim().split(',').map(tag => tag.trim()).filter(tag => tag);
        formData.append('tags', tagArray.join(','));
      }
      formData.append('is_published', blogIsPublished.toString());
      if (blogCoverImage) formData.append('cover_image', blogCoverImage);

      const cleanBaseUrl = API_BASE_URL.trim();
      const fullEndpoint = `${cleanBaseUrl}/api/blogs`;

      const response = await axios.post(fullEndpoint, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success('Blog created successfully!');
      setBlogTitle('');
      setBlogSlug('');
      setBlogContent('');
      setBlogSummary('');
      setBlogTags('');
      setBlogIsPublished(false);
      setBlogCoverImage(null);
    } catch (error) {
      console.error('Error creating blog:', error);
      let errorMsg = 'Failed to create blog';
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
      setCreatingBlog(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-gray-500">Loading...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

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

  if (!token) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-red-500">Please login to access admin features.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isFormValid = blogTitle.trim() && blogSlug.trim() && blogContent.trim();

  const handleBlogClick = (blog) => {
    setSelectedBlog(blog);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBlog(null);
  };

  if (viewMode === 'list') {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">All Blogs</h1>
          <Button onClick={() => setViewMode('create')}>← Back to Create</Button>
        </div>

        {loadingBlogs ? (
          <p>Loading blogs...</p>
        ) : blogs.length === 0 ? (
          <p className="text-gray-500">No blogs found.</p>
        ) : (
          <div className="space-y-4">
            {blogs.map((blog) => (
              <Card 
                key={blog._id || blog.id} 
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleBlogClick(blog)}
              >
                <CardHeader>
                  <CardTitle className="flex justify-between">
                    <span>{blog.title}</span>
                    <span className={`text-xs px-2 py-1 rounded ${blog.is_published ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {blog.is_published ? 'Published' : 'Draft'}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-2">{blog.summary || blog.content?.substring(0, 100) + '...'}</p>
                  <div className="text-xs text-gray-500">
                    <p>Slug: {blog.slug}</p>
                    <p>Tags: {blog.tags?.join(', ') || '—'}</p>
                    <p>Created: {new Date(blog.created_at || blog.createdAt).toLocaleDateString()}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            {selectedBlog && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex justify-between items-start">
                    <span className="pr-4">{selectedBlog.title}</span>
                    <span className={`text-xs px-2 py-1 rounded whitespace-nowrap ${selectedBlog.is_published ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {selectedBlog.is_published ? 'Published' : 'Draft'}
                    </span>
                  </DialogTitle>
                  <DialogDescription>
                    View complete blog details
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 mt-4">
                  {selectedBlog.cover_image && (
                    <div>
                      <Label className="text-sm font-semibold">Cover Image</Label>
                      <img 
                        src={selectedBlog.cover_image} 
                        alt={selectedBlog.title}
                        className="w-full h-48 object-cover rounded-lg mt-2"
                      />
                    </div>
                  )}
                  
                  <div>
                    <Label className="text-sm font-semibold">Slug</Label>
                    <p className="text-sm text-gray-700 mt-1">{selectedBlog.slug}</p>
                  </div>
                  
                  {selectedBlog.summary && (
                    <div>
                      <Label className="text-sm font-semibold">Summary</Label>
                      <p className="text-sm text-gray-700 mt-1">{selectedBlog.summary}</p>
                    </div>
                  )}
                  
                  <div>
                    <Label className="text-sm font-semibold">Content</Label>
                    <div className="text-sm text-gray-700 mt-1 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
                      {selectedBlog.content}
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-semibold">Tags</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedBlog.tags && selectedBlog.tags.length > 0 ? (
                        selectedBlog.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            {tag}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-gray-500">No tags</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                    <div>
                      <Label className="text-sm font-semibold">Created At</Label>
                      <p className="text-sm text-gray-700 mt-1">
                        {new Date(selectedBlog.created_at || selectedBlog.createdAt).toLocaleString()}
                      </p>
                    </div>
                    {selectedBlog.updated_at && (
                      <div>
                        <Label className="text-sm font-semibold">Updated At</Label>
                        <p className="text-sm text-gray-700 mt-1">
                          {new Date(selectedBlog.updated_at || selectedBlog.updatedAt).toLocaleString()}
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
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard: Create Blog</h1>
        <Button variant="outline" onClick={() => setViewMode('list')}>
          View All Blogs
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create New Blog</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleBlogSubmit} className="space-y-4">
            <div>
              <Label htmlFor="blogTitle">Title *</Label>
              <Input
                id="blogTitle"
                value={blogTitle}
                onChange={(e) => setBlogTitle(e.target.value)}
                placeholder="Enter blog title"
              />
            </div>
            <div>
              <Label htmlFor="blogSlug">Slug *</Label>
              <Input
                id="blogSlug"
                value={blogSlug}
                onChange={(e) => setBlogSlug(e.target.value)}
                placeholder="e.g., my-new-blog-post"
              />
            </div>
            <div>
              <Label htmlFor="blogContent">Content *</Label>
              <Textarea
                id="blogContent"
                value={blogContent}
                onChange={(e) => setBlogContent(e.target.value)}
                rows={6}
                placeholder="Write your blog content here..."
              />
            </div>
            <div>
              <Label htmlFor="blogSummary">Summary</Label>
              <Textarea
                id="blogSummary"
                value={blogSummary}
                onChange={(e) => setBlogSummary(e.target.value)}
                rows={2}
                placeholder="Brief summary of the blog..."
              />
            </div>
            <div>
              <Label htmlFor="blogTags">Tags (comma-separated)</Label>
              <Input
                id="blogTags"
                value={blogTags}
                onChange={(e) => setBlogTags(e.target.value)}
                placeholder="e.g., travel, adventure, tips"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="blogIsPublished"
                checked={blogIsPublished}
                onCheckedChange={setBlogIsPublished}
              />
              <Label htmlFor="blogIsPublished">Publish</Label>
            </div>
            <div>
              <Label htmlFor="blogCoverImage">Cover Image</Label>
              <Input
                id="blogCoverImage"
                type="file"
                accept="image/*"
                onChange={(e) => setBlogCoverImage(e.target.files[0])}
              />
            </div>

            <div className="text-sm text-gray-600 mt-2">
              <p>Form Status: {isFormValid ? 'Valid' : 'Invalid'}</p>
            </div>
            <Button
              type="submit"
              disabled={creatingBlog || !isFormValid}
            >
              {creatingBlog ? 'Creating Blog...' : 'Create Blog'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminBlogPage;