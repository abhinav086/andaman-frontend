import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar, User, ArrowLeft, BookOpen, Loader2 } from "lucide-react";
import axios from 'axios';

const API_BASE_URL = 'https://makeandman.onrender.com'; // Fixed: removed extra spaces

export default function BlogPost() {
  const { id } = useParams(); // This is actually the slug from URL
  const navigate = useNavigate();
  
  const [blogBook, setBlogBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBlogBookBySlug();
  }, [id]);

  const fetchBlogBookBySlug = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('accessToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      // Use the correct endpoint: GET /api/blog-books/:slug
      const response = await axios.get(`${API_BASE_URL}/api/blog-books/${id}`, { headers });
      const book = response.data;

      if (!book) {
        setError('Blog book not found');
        setLoading(false);
        return;
      }

      // The backend already returns the blogs in the "blogs" array
      // No need to fetch individual blogs separately
      setBlogBook(book);

    } catch (err) {
      console.error('Error fetching blog book:', err);
      if (err.response?.status === 404) {
        setError('Blog book not found');
      } else {
        setError(err.message || 'Failed to load blog book');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col justify-center items-center min-h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
        <p className="text-xl">Loading blog book...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Alert variant="destructive">
          <AlertDescription>
            <strong>Error:</strong> {error}
          </AlertDescription>
        </Alert>
        <Button onClick={() => navigate('/blog')} className="mt-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blog Books
        </Button>
      </div>
    );
  }

  if (!blogBook) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Alert>
          <AlertDescription>Blog book not found</AlertDescription>
        </Alert>
        <Button onClick={() => navigate('/blog')} className="mt-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blog Books
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-[104px] py-8">
      <Button 
        variant="ghost" 
        onClick={() => navigate('/blog')}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Blog Books
      </Button>

      {/* Blog Book Header */}
      <div className="mb-12">
        {blogBook.cover_image && (
          <img 
            src={blogBook.cover_image}
            alt={blogBook.title}
            className="w-full h-64 md:h-96 object-cover rounded-lg mb-6"
          />
        )}
        
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant={blogBook.is_published ? "default" : "secondary"}>
            {blogBook.is_published ? "Published" : "Draft"}
          </Badge>
          <Badge variant="outline">
            <BookOpen className="w-3 h-3 mr-1" />
            {blogBook.blogs?.length || 0} blogs
          </Badge>
        </div>

        <h1 className="text-4xl font-bold mb-4">{blogBook.title}</h1>
        
        {blogBook.description && (
          <p className="text-xl text-muted-foreground mb-6">{blogBook.description}</p>
        )}

        <div className="flex items-center text-sm text-muted-foreground">
          <User className="w-4 h-4 mr-1" />
          <span className="mr-4">{blogBook.author_name || 'Admin'}</span>
          <Calendar className="w-4 h-4 mr-1" />
          <span>
            {new Date(blogBook.created_at || Date.now()).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </span>
        </div>
      </div>

      {/* Blogs List */}
      <div className="space-y-8">
        <h2 className="text-3xl font-bold mb-6">Articles in this Collection</h2>

        {blogBook.blogs && blogBook.blogs.length > 0 ? (
          blogBook.blogs.map((blog, index) => (
            <Card key={blog.blog_id || blog.id || index} className="overflow-hidden">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="secondary">Article {index + 1}</Badge>
                  {blog.tags && blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {blog.tags.slice(0, 3).map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <CardTitle className="text-2xl">{blog.title}</CardTitle>
              </CardHeader>
              
              <CardContent>
                {/* Full-size blog image */}
                {blog.cover_image && (
                  <img 
                    src={blog.cover_image}
                    alt={blog.title}
                    className="w-full h-64 md:h-96 object-cover rounded-lg mb-6"
                  />
                )}

                {blog.summary && (
                  <p className="text-muted-foreground mb-4 text-lg">{blog.summary}</p>
                )}

                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                    {blog.content}
                  </div>
                </div>

                <div className="flex items-center text-sm text-muted-foreground mt-6 pt-6 border-t">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>
                    Published on {new Date(blog.created_at || Date.now()).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Alert>
            <AlertDescription>
              No blogs found in this collection.
            </AlertDescription>
          </Alert>
        )}
      </div>

      <div className="mt-12 text-center">
        <Button onClick={() => navigate('/blog')} variant="outline" size="lg">
          <ArrowLeft className="w-4 h-4 mr-2" />
          View More Collections
        </Button>
      </div>
    </div>
  );
}