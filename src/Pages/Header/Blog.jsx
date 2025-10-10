import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  User,
  Clock,
  BookOpen,
  Search,
  Star,
  Eye,
  Heart,
  ChevronRight,
  Globe,
  MapPin,
  Camera,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const API_BASE_URL = 'https://makeandman.onrender.com';

export default function Blog() {
  const navigate = useNavigate();
  const [blogBooks, setBlogBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchBlogBooks();
  }, []);

  const fetchBlogBooks = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const response = await axios.get(`${API_BASE_URL}/api/blog-books`, { headers });
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

      const formattedBooks = books.map(book => ({
        id: book._id || book.book_id || book.id || book.uid,
        title: book.title || book.name || 'Untitled Blog Book',
        description: book.description || 'No description available',
        author: book.author_name || 'Admin',
        date: book.created_at || book.published_at || new Date().toISOString(),
        cover_image: book.cover_image || 'https://placehold.co/800x400',
        slug: book.slug,
        is_published: book.is_published,
        blog_count: book.table_of_contents?.length || book.blog_ids?.length || 0,
        views_count: book.views_count || 0,
        likes_count: book.likes_count || 0
      }));

      setBlogBooks(formattedBooks);
    } catch (err) {
      console.error('Error fetching blog books:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredBooks = blogBooks.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center items-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-xl text-muted-foreground">Loading blog books...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center items-center">
        <div className="text-center">
          <p className="text-xl text-red-500 mb-4">Error loading blog books</p>
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={fetchBlogBooks} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-teal-500 text-transparent bg-clip-text">
          Blog Books Collection
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Explore curated collections of travel stories, experiences, and insights from travelers around the world.
          Each book is a journey in itself.
        </p>
      </div>

      {/* Search Section */}
      <div className="max-w-2xl mx-auto mb-12">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <input
            type="text"
            placeholder="Search blog books, authors, or topics..."
            className="w-full pl-10 pr-4 py-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 text-center">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <div className="text-2xl font-bold text-blue-600">{filteredBooks.length}</div>
          <div className="text-sm text-muted-foreground">Collections</div>
        </div>
        <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
          <div className="text-2xl font-bold text-emerald-600">
            {filteredBooks.reduce((sum, book) => sum + book.blog_count, 0)}
          </div>
          <div className="text-sm text-muted-foreground">Total Stories</div>
        </div>
        <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
          <div className="text-2xl font-bold text-amber-600">
            {filteredBooks.reduce((sum, book) => sum + book.views_count, 0)}
          </div>
          <div className="text-sm text-muted-foreground">Total Views</div>
        </div>
      </div>

      {/* Blog Books Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredBooks.map(book => (
          <Card key={book.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-t-4 border-blue-500">
            {/* Cover Image */}
            <div className="relative">
              <img 
                src={book.cover_image} 
                alt={book.title} 
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-4 right-4">
                <Badge variant="secondary" className="bg-blue-600 text-white">
                  <BookOpen className="w-3 h-3 mr-1" />
                  {book.blog_count} stories
                </Badge>
              </div>
            </div>

            <CardHeader className="pb-3">
              <CardTitle className="text-xl flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-500" />
                {book.title}
              </CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-muted-foreground mb-4 line-clamp-3">{book.description}</p>
              
              {/* Author & Date */}
              <div className="flex items-center text-sm text-muted-foreground mb-3">
                <User className="w-4 h-4 mr-2 text-blue-500" />
                <span className="mr-4">{book.author}</span>
                <Calendar className="w-4 h-4 mr-2 text-amber-500" />
                <span>
                  {new Date(book.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </span>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between text-sm mb-4">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Eye className="h-4 w-4 text-emerald-500" />
                  <span>{book.views_count.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Heart className="h-4 w-4 text-rose-500" />
                  <span>{book.likes_count.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-4 w-4 text-amber-500" />
                  <span>{book.blog_count} stories</span>
                </div>
              </div>

              {/* Action Button */}
              <Button 
                variant="outline" 
                className="w-full group"
                onClick={() => navigate(`/blog/${book.slug || book.id}`)}
              >
                Explore Collection
                <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredBooks.length === 0 && searchQuery && (
        <div className="text-center py-16">
          <div className="inline-block p-4 bg-muted rounded-full mb-4">
            <Search className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-medium mb-2">No blog books found</h3>
          <p className="text-muted-foreground mb-4">
            We couldn't find any blog books matching "{searchQuery}"
          </p>
          <Button onClick={() => setSearchQuery('')}>
            Clear Search
          </Button>
        </div>
      )}

      {/* No Books State */}
      {blogBooks.length === 0 && !searchQuery && (
        <div className="text-center py-16">
          <div className="inline-block p-4 bg-muted rounded-full mb-4">
            <BookOpen className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-medium mb-2">No blog books available</h3>
          <p className="text-muted-foreground">Check back later for new collections</p>
        </div>
      )}

      {/* CTA Section */}
      <div className="mt-20 text-center">
        <div className="inline-block p-8 bg-gradient-to-r from-blue-50 to-teal-50 rounded-2xl border border-blue-100 max-w-2xl">
          <h3 className="text-2xl font-bold mb-3">Share Your Travel Stories</h3>
          <p className="text-muted-foreground mb-6">
            Have an amazing travel experience to share? Contribute to our community of storytellers.
          </p>
          <Button size="lg">
            <Camera className="mr-2 h-5 w-5" />
            Submit Your Story
          </Button>
        </div>
      </div>
    </div>
  );
}