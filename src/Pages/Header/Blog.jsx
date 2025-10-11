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
  Filter,
  TrendingUp,
  Users,
  BookMarked
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const API_BASE_URL = 'https://makeandman.onrender.com';

// Custom font styles
const customFontStyle = {
  fontFamily: "'Neue Montreal Regular', sans-serif",
  fontWeight: 600,
  fontStyle: "normal",
};

const customFontStyle2 = {
  fontFamily: "'Travel October', sans-serif",
  fontWeight: 600,
  fontStyle: "normal",
};

export default function Blog() {
  const navigate = useNavigate();
  const [blogBooks, setBlogBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Mock categories - replace with real categories from your API
  const categories = [
    { id: 'all', name: 'All', icon: BookOpen },
    { id: 'destination', name: 'Destination', icon: Globe },
    { id: 'culinary', name: 'Culinary', icon: Camera },
    { id: 'lifestyle', name: 'Lifestyle', icon: Users },
    { id: 'tips-hacks', name: 'Tips & Hacks', icon: TrendingUp }
  ];

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
        likes_count: book.likes_count || 0,
        category: book.category || 'destination',
        rating: book.rating || Math.floor(Math.random() * 5) + 1
      }));

      setBlogBooks(formattedBooks);
    } catch (err) {
      console.error('Error fetching blog books:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredBooks = blogBooks
    .filter(book => {
      const matchesSearch = 
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.date) - new Date(a.date);
        case 'popular':
          return b.views_count - a.views_count;
        case 'trending':
          return b.likes_count - a.likes_count;
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center bg-white pt-[90px]"
        style={customFontStyle}
      >
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p 
            className="text-lg text-muted-foreground"
            style={customFontStyle}
          >
            Loading blog books...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center bg-white pt-[90px]"
        style={customFontStyle}
      >
        <div className="text-center p-6 max-w-md">
          <div className="inline-block p-3 bg-red-100 rounded-full mb-4">
            <BookOpen className="h-8 w-8 text-red-500" />
          </div>
          <h3 
            className="text-lg font-medium mb-2 text-red-500"
            style={customFontStyle2}
          >
            Error Loading Content
          </h3>
          <p 
            className="text-sm text-muted-foreground mb-4"
            style={customFontStyle}
          >
            {error}
          </p>
          <Button 
            onClick={fetchBlogBooks}
            style={customFontStyle2}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="bg-white min-h-screen pt-[104px] pb-16"
      style={customFontStyle}
    >
      {/* Page Title & Description */}
      <div className="container mx-auto px-4 mb-6">
        <h1 
          className="text-3xl font-bold mb-2"
          style={customFontStyle2}
        >
          Blog
        </h1>
        <p 
          className="text-muted-foreground max-w-3xl"
          style={customFontStyle}
        >
          Here, we share travel tips, destination guides, and stories that inspire your next adventure.
        </p>
      </div>

      {/* Category Filters & Sort */}
      <div className="container mx-auto px-4 mb-8">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-100 text-blue-700 border border-blue-300'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  style={customFontStyle2}
                >
                  {category.name}
                </button>
              );
            })}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span 
              className="text-sm font-medium text-muted-foreground"
              style={customFontStyle2}
            >
              Sort by:
            </span>
            <select 
              className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={customFontStyle}
            >
              <option value="newest">Newest</option>
              <option value="popular">Most Popular</option>
              <option value="trending">Trending</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Blog Books Grid */}
      {filteredBooks.length > 0 ? (
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map(book => (
              <Card 
                key={book.id} 
                className="overflow-hidden hover:shadow-lg transition-all duration-300 border-0 shadow-sm group"
              >
                {/* Cover Image */}
                <div className="relative">
                  <img 
                    src={book.cover_image} 
                    alt={book.title} 
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge 
                      variant="secondary" 
                      className="bg-blue-600 text-white"
                      style={customFontStyle2}
                    >
                      {book.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 right-4">
                    <Badge 
                      variant="outline" 
                      className="bg-white/80 backdrop-blur"
                      style={customFontStyle}
                    >
                      <BookOpen className="w-3 h-3 mr-1" />
                      {book.blog_count}
                    </Badge>
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <CardTitle 
                    className="text-xl line-clamp-2"
                    style={customFontStyle2}
                  >
                    {book.title}
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <p 
                    className="text-muted-foreground mb-4 line-clamp-2"
                    style={customFontStyle}
                  >
                    {book.description}
                  </p>
                  
                  {/* Author & Date */}
                  <div 
                    className="flex items-center text-sm text-muted-foreground mb-3"
                    style={customFontStyle}
                  >
                    <User className="w-4 h-4 mr-2 text-blue-500" />
                    <span className="mr-4 truncate">{book.author}</span>
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
                  <div 
                    className="flex items-center justify-between text-sm mb-4"
                    style={customFontStyle}
                  >
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Eye className="h-4 w-4 text-emerald-500" />
                      <span>{book.views_count.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Heart className="h-4 w-4 text-rose-500" />
                      <span>{book.likes_count.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span>{book.rating}.0</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button 
                    className="w-full group flex items-center justify-center"
                    onClick={() => navigate(`/blog/${book.slug || book.id}`)}
                    style={customFontStyle2}
                  >
                    Read Story
                    <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div 
          className="container mx-auto px-4 text-center py-16"
          style={customFontStyle}
        >
          <div className="inline-block p-6 bg-gray-50 rounded-full mb-6">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto" />
          </div>
          <h3 
            className="text-xl font-medium mb-2"
            style={customFontStyle2}
          >
            No blog books found
          </h3>
          <p 
            className="text-muted-foreground max-w-md mx-auto mb-6"
            style={customFontStyle}
          >
            We couldn't find any blog books matching your criteria. Try adjusting your search or filters.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSortBy('newest');
              }}
              style={customFontStyle2}
            >
              Reset Filters
            </Button>
            <Button 
              variant="outline" 
              onClick={fetchBlogBooks}
              style={customFontStyle2}
            >
              Refresh Content
            </Button>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <div 
        className="container mx-auto px-4 mt-16 text-center"
        style={customFontStyle}
      >
        <div className="inline-block p-6 bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl border border-blue-100 max-w-2xl">
          <h3 
            className="text-xl font-bold mb-3"
            style={customFontStyle2}
          >
            Share Your Travel Stories
          </h3>
          <p 
            className="text-muted-foreground mb-6"
            style={customFontStyle}
          >
            Have an amazing travel experience to share? Contribute to our community of storytellers.
          </p>
          <Button 
            size="lg"
            style={customFontStyle2}
          >
            <Camera className="mr-2 h-5 w-5" />
            Submit Your Story
          </Button>
        </div>
      </div>
    </div>
  );
}