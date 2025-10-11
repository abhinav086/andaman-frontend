// src/Pages/Home/ChatBot.jsx
import { GoogleGenerativeAI } from '@google/generative-ai';
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, MapPin, Star, Waves, MessageSquareText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_KEY = 'AIzaSyBOtFaE1R2g1tJGlc5dTwUKapwe0eARdwQ';
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

// Andaman Travel Dataset
const travelData = {
  overview: "Make Andaman Trip is a travel service platform offering hotel booking, water sports, ready-made packages, ferry transfers, and local guidance for Andaman & Nicobar Islands.",
  islands: [
    { name: "Port Blair", highlights: ["Cellular Jail", "Corbyn’s Cove", "Ross Island"] },
    { name: "Havelock (Swaraj Dweep)", highlights: ["Radhanagar Beach", "Scuba Diving", "Elephant Beach"] },
    { name: "Neil (Shaheed Dweep)", highlights: ["Natural Bridge", "Bharatpur Beach"] },
    { name: "Ross Island", highlights: ["British-era ruins", "deer", "scenic trails"] },
    { name: "North Bay Island", highlights: ["Water sports hub"] },
    { name: "Baratang Island", highlights: ["Limestone caves", "mangrove creeks"] },
    { name: "Diglipur Island", highlights: ["Ross & Smith twin islands", "Kalipur Beach"] }
  ],
  hotels: [
    // Port Blair
    { name: "Hotel SeaShell Port Blair", category: "4-star", price: "₹7,000–₹9,000", location: "Port Blair", highlights: ["Sea view", "restaurant", "near Aberdeen Bazaar"] },
    { name: "Symphony Samudra Beachside Jungle Resort", category: "5-star", price: "₹10,000–₹15,000", location: "Port Blair", highlights: ["Infinity pool", "spa", "private beach"] },
    { name: "TSG Emerald View", category: "3-star", price: "₹3,500–₹5,000", location: "Port Blair", highlights: ["Budget stay", "city center"] },
    { name: "Peerless Resort Port Blair", category: "4-star", price: "₹6,000–₹8,000", location: "Port Blair", highlights: ["Beachfront resort", "conference hall"] },
    // Havelock Island
    { name: "Taj Exotica Resort & Spa", category: "5-star", price: "₹25,000–₹35,000", location: "Havelock", highlights: ["Luxury beachfront villas"] },
    { name: "SeaShell Havelock", category: "4-star", price: "₹9,000–₹12,000", location: "Havelock", highlights: ["Sea-facing cottages", "restaurant"] },
    { name: "Barefoot at Havelock", category: "4-star Eco", price: "₹10,000–₹14,000", location: "Havelock", highlights: ["Forest stay", "wellness retreat"] },
    { name: "Havelock Holiday Beach Resort", category: "3-star", price: "₹5,000–₹7,000", location: "Havelock", highlights: ["Near Govind Nagar Beach"] },
    // Neil Island
    { name: "SeaShell Neil", category: "4-star", price: "₹7,000–₹9,000", location: "Neil", highlights: ["Beachfront", "restaurant"] },
    { name: "Summer Sands Beach Resort", category: "4-star", price: "₹9,000–₹11,000", location: "Neil", highlights: ["Villas", "pool", "family-friendly"] },
    { name: "Pearl Park Beach Resort", category: "3-star", price: "₹4,000–₹6,000", location: "Neil", highlights: ["Sunset view", "near Laxmanpur Beach"] }
  ],
  activities: [
    { name: "Scuba Diving (Beginner)", location: ["Havelock"], duration: "45 mins", price: "₹4,000–₹5,500", description: "Includes instructor & gear" },
    { name: "Snorkeling", location: ["Elephant Beach", "Neil"], duration: "30 mins", price: "₹1,000–₹1,500", description: "Coral & fish viewing" },
    { name: "Sea Walk", location: ["North Bay", "Havelock"], duration: "25 mins", price: "₹3,500–₹4,000", description: "Helmet diving undersea" },
    { name: "Jet Ski Ride", location: ["Port Blair", "Havelock"], duration: "10 mins", price: "₹800–₹1,200", description: "Thrilling water ride" },
    { name: "Banana Boat Ride", location: ["North Bay", "Corbyn’s Cove"], duration: "15 mins", price: "₹700–₹900", description: "Fun group ride" },
    { name: "Parasailing", location: ["Havelock"], duration: "15 mins", price: "₹2,500–₹3,000", description: "Aerial ocean view" },
    { name: "Kayaking (Mangroves)", location: ["Havelock"], duration: "1 hour", price: "₹2,000", description: "Eco-friendly exploration" },
    { name: "Glass Bottom Boat Ride", location: ["North Bay", "Neil"], duration: "30 mins", price: "₹600–₹800", description: "Coral view without diving" },
    { name: "Light & Sound Show", location: ["Cellular Jail"], duration: "1 hour", price: "₹300", description: "History show with lights and music" }
  ]
};

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "Hello! I'm your Andaman travel assistant. How can I help you plan your trip? You can ask about hotels, activities, islands, or packages!", 
      sender: 'bot',
      links: [] 
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  // Function to determine navigation link based on user query
  const getNavigationLink = (userMessage) => {
    const lowerMsg = userMessage.toLowerCase();
    
    if (lowerMsg.includes('hotel') || lowerMsg.includes('resort') || lowerMsg.includes('stay')) {
      return '/home2';
    } else if (lowerMsg.includes('activity') || lowerMsg.includes('water sport') || 
               lowerMsg.includes('snorkel') || lowerMsg.includes('scuba') ||
               lowerMsg.includes('parasail') || lowerMsg.includes('kayak')) {
      return '/activities';
    } else if (lowerMsg.includes('island') || lowerMsg.includes('visit') || 
               lowerMsg.includes('go to') || lowerMsg.includes('explore')) {
      return '/';
    } else if (lowerMsg.includes('blog') || lowerMsg.includes('news')) {
      return '/blog';
    } else if (lowerMsg.includes('contact') || lowerMsg.includes('help')) {
      return '/contact';
    } else if (lowerMsg.includes('about') || lowerMsg.includes('company')) {
      return '/about';
    } else if (lowerMsg.includes('service') || lowerMsg.includes('offer')) {
      return '/services';
    } else {
      return '/';
    }
  };

  const generateResponse = async (userMessage) => {
    try {
      const lowerMsg = userMessage.toLowerCase();
      const navigationLink = getNavigationLink(userMessage);
      
      // Hotel queries
      if (lowerMsg.includes('hotel') || lowerMsg.includes('resort') || lowerMsg.includes('stay')) {
        const hotels = travelData.hotels;
        const locationMatch = travelData.islands.find(island => 
          lowerMsg.includes(island.name.toLowerCase())
        );
        
        if (locationMatch) {
          const filteredHotels = hotels.filter(h => h.location.toLowerCase() === locationMatch.name.toLowerCase());
          const hotelText = `Here are hotels in ${locationMatch.name}:\n\n${filteredHotels.map(h => 
            `• ${h.name} (${h.category}): ₹${h.price}/night - ${h.highlights.join(', ')}`
          ).join('\n')}`;
          
          return {
            text: hotelText,
            links: [{ text: `View Hotels in ${locationMatch.name}`, path: '/home2' }]
          };
        }
        
        return {
          text: `Here are some popular hotels in Andaman:\n\n${hotels.slice(0, 5).map(h => 
            `• ${h.name} in ${h.location} (${h.category}): ₹${h.price}/night`
          ).join('\n')}\n\nAsk about a specific island for targeted recommendations!`,
          links: [{ text: 'View All Hotels', path: '/home2' }]
        };
      }
      
      // Activity queries
      if (lowerMsg.includes('activity') || lowerMsg.includes('water sport') || 
          lowerMsg.includes('snorkel') || lowerMsg.includes('scuba') || 
          lowerMsg.includes('parasail') || lowerMsg.includes('kayak')) {
        const activities = travelData.activities;
        const locationMatch = travelData.islands.find(island => 
          lowerMsg.includes(island.name.toLowerCase())
        );
        
        if (locationMatch) {
          const filteredActivities = activities.filter(a => 
            a.location.some(loc => loc.toLowerCase().includes(locationMatch.name.toLowerCase()))
          );
          
          return {
            text: `Here are activities available in ${locationMatch.name}:\n\n${filteredActivities.map(a => 
              `• ${a.name}: ${a.duration}, ₹${a.price} - ${a.description}`
            ).join('\n')}`,
            links: [{ text: `View Activities in ${locationMatch.name}`, path: '/activities' }]
          };
        }
        
        return {
          text: `Popular Andaman activities:\n\n${activities.map(a => 
            `• ${a.name}: ${a.duration}, ₹${a.price} - ${a.description}`
          ).join('\n')}\n\nAsk about a specific island for targeted activities!`,
          links: [{ text: 'View All Activities', path: '/activities' }]
        };
      }
      
      // Island queries
      if (lowerMsg.includes('island') || lowerMsg.includes('visit') || lowerMsg.includes('go to')) {
        return {
          text: `Andaman has many beautiful islands:\n\n${travelData.islands.map(i => 
            `• ${i.name}: ${i.highlights.join(', ')}`
          ).join('\n')}\n\nWhich island interests you most?`,
          links: [{ text: 'Explore Islands', path: '/' }]
        };
      }
      
      // General overview
      if (lowerMsg.includes('what') || lowerMsg.includes('service') || lowerMsg.includes('offer')) {
        return {
          text: travelData.overview,
          links: [{ text: 'View Our Services', path: '/services' }]
        };
      }
      
      // Default response
      const prompt = `You are a helpful Andaman travel assistant using this data: ${JSON.stringify(travelData)}. The user asked: "${userMessage}". Provide helpful travel-related information about Andaman Islands, hotels, activities, or travel tips. Keep responses concise and friendly. , gives short answer try to give in bullet points`;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return {
        text: response.text(),
        links: [{ text: 'Explore Services', path: navigationLink }]
      };
    } catch (error) {
      console.error("Error generating response:", error);
      return {
        text: "Sorry, I'm having trouble responding right now. Please try again.",
        links: []
      };
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage = { 
      id: Date.now(), 
      text: inputValue, 
      sender: 'user',
      links: []
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const botResponse = await generateResponse(inputValue);
      const botMessage = { 
        id: Date.now() + 1, 
        text: botResponse.text, 
        sender: 'bot',
        links: botResponse.links
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = { 
        id: Date.now() + 1, 
        text: "Sorry, I couldn't process your request. Please try again.", 
        sender: 'bot',
        links: []
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md h-[500px] flex flex-col border border-gray-200">
          {/* Chat Header */}
          <div className="bg-[#6355B5] text-white p-4 rounded-t-2xl flex items-center">
            <MessageSquareText className="h-6 w-6 mr-2" />
            <h3 className="font-bold">Andaman Travel Assistant</h3>
            <button 
              onClick={() => setIsOpen(false)} 
              className="ml-auto text-white hover:text-gray-200"
            >
              ×
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex mb-4 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                  {message.sender === 'bot' ? (
                    <div className="bg-[#F1F0FE] p-2 rounded-full mr-2">
                      <MessageSquareText className="h-4 w-4 text-[#6355B5]" />
                    </div>
                  ) : (
                    <div className="bg-gray-200 p-2 rounded-full ml-2">
                      <User className="h-4 w-4 text-gray-600" />
                    </div>
                  )}
                  <div 
                    className={`px-4 py-2 rounded-2xl ${
                      message.sender === 'user' 
                        ? 'bg-[#6355B5] text-white rounded-tr-none' 
                        : 'bg-white text-gray-800 rounded-tl-none border border-gray-200'
                    }`}
                  >
                    {message.text}
                    {message.links && message.links.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {message.links.map((link, index) => (
                          <button
                            key={index}
                            onClick={() => handleNavigation(link.path)}
                            className="flex items-center text-sm bg-[#F1F0FE] hover:bg-[#e0dffa] text-[#6355B5] px-3 py-1.5 rounded-lg transition-colors"
                          >
                            {link.path === '/' ? <Star className="h-4 w-4 mr-1" /> : <Waves className="h-4 w-4 mr-1" />}
                            {link.text}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="flex items-start max-w-[80%]">
                  <div className="bg-[#F1F0FE] p-2 rounded-full mr-2">
                    <MessageSquareText className="h-4 w-4 text-[#6355B5]" />
                  </div>
                  <div className="px-4 py-2 rounded-2xl bg-white text-gray-800 rounded-tl-none border border-gray-200">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex items-center">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask about Andaman hotels, activities, islands, or packages..."
                className="flex-1 border border-gray-300 rounded-l-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6355B5] resize-none h-12"
                rows="1"
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !inputValue.trim()}
                className={`bg-[#6355B5] text-white p-3 rounded-r-2xl h-12 flex items-center justify-center ${
                  isLoading || !inputValue.trim() ? 'opacity-50' : 'hover:bg-[#5246a0]'
                }`}
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Powered by Gemini AI • Andaman Travel Assistant
            </p>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-[#6355B5] text-white p-4 rounded-full shadow-lg hover:bg-[#5246a0] transition-all"
        >
          <MessageSquareText className="h-6 w-6" />
        </button>
      )}
    </div>
  );
};

export default ChatBot;