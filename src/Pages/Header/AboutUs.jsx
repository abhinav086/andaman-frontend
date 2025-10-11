
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { FaTrain, FaHotel, FaGlobe, FaQuoteLeft, FaQuoteRight, FaUser, FaChevronLeft, FaChevronRight, FaMapMarkerAlt, FaTicketAlt, FaGem } from "react-icons/fa";
import { useState, useEffect } from "react";

// Import images directly for use in JSX
import mainBgImage from '@/assets/island.png';
import imageOne from '@/assets/seven.jpeg';
import imageTwo from '@/assets/twentyone.jpeg';

// Import Recent Trips images
import oneTrip from '@/assets/one.jpg';
import fourTrip from '@/assets/four.JPG';
import fiveTrip from '@/assets/five.JPG';

// Define font styles (matching your Home page)
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

// Testimonial Data
const testimonials = [
  {
    quote: "Working in conjunction with humanitarian aid agencies, we have supported programmes to help alleviate human suffering.",
    author: "Jerry Mouse",
  },
  {
    quote: "Their team made our Andaman trip unforgettable — every detail was handled with care and local insight.",
    author: "Priya Sharma",
  },
  {
    quote: "From ferry bookings to hidden beach guides — they’re the only travel partner I trust for island adventures.",
    author: "Rohan Mehta",
  }
];

export default function AboutUs() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Auto-rotate testimonials every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goToTestimonial = (index) => {
    setCurrentTestimonial(index);
  };

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const current = testimonials[currentTestimonial];

  return (
    <div className="min-h-screen w-full bg-white font-sans text-gray-800 relative overflow-hidden">
      {/* Background World Map */}
      <div 
        className="absolute top-0 left-0 w-full h-full opacity-5 z-0"
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d1d5db' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>
      
      {/* Decorative Dots */}
      <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-orange-300 rounded-full opacity-50 z-0"></div>
      <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-purple-300 rounded-full opacity-50 z-0"></div>
      <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-orange-300 rounded-full opacity-50 z-0"></div>

      {/* Hero Section */}
      <div
        className="relative h-[400px] bg-cover bg-center flex items-center justify-center text-white"
        style={{ backgroundImage: `url(${mainBgImage})` }}
      >
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative z-10 text-center px-6">
          <h1 style={customFontStyle2} className="text-6xl font-bold mb-4">About Us</h1>
          <p style={customFontStyle} className="text-xl max-w-2xl mx-auto">
            Discover the Andaman Islands with the most trusted local travel partner — where every journey is crafted with care, expertise, and passion.
          </p>
        </div>
      </div>

      <div className="w-full max-w-6xl mx-auto px-4 py-12 relative z-10">
        {/* Feature Cards Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            { icon: FaMapMarkerAlt, title: "Lot of Travel Places", desc: "We will provide a lot of places in every single trip that you pick." },
            { icon: FaTicketAlt, title: "Cheap Travel Packet", desc: "Every packet travel that you chooses, will not till you." },
            { icon: FaGem, title: "And More Bonus", desc: "We will make sure that you happy in our trip, so you will get some bonus in your trip." }
          ].map((item, index) => (
            <Card key={index} className="border-0 shadow-lg bg-gradient-to-br from-slate-50 to-slate-100">
              <CardContent className="pt-6 text-center">
                <div className="mx-auto w-16 h-16 bg-[#F1F0FE] rounded-full flex items-center justify-center mb-4">
                  <item.icon className="text-[#6355B5] text-2xl" />
                </div>
                <h3 style={customFontStyle2} className="text-xl font-bold mb-2">{item.title}</h3>
                <p style={customFontStyle} className="text-muted-foreground">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Separator className="my-10" />

        {/* Testimonial Carousel Section */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50 relative overflow-hidden">
          <CardContent className="pt-10 pb-16 px-6 text-center relative">
            <div className="absolute top-6 left-6 text-4xl text-cyan-500">
              <FaQuoteLeft />
            </div>
            <div className="absolute bottom-6 right-6 text-4xl text-cyan-500">
              <FaQuoteRight />
            </div>
            
            {/* Navigation Buttons */}
            <div className="absolute top-1/2 left-4 transform -translate-y-1/2 cursor-pointer p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition">
              <FaChevronLeft onClick={prevTestimonial} className="text-gray-600 text-lg" />
            </div>
            <div className="absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition">
              <FaChevronRight onClick={nextTestimonial} className="text-gray-600 text-lg" />
            </div>

            {/* Testimonial Content */}
            <div className="flex flex-col items-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gray-200 border-2 border-white shadow-md flex items-center justify-center">
                <FaUser className="text-gray-500 text-3xl" />
              </div>
              <div className="mt-4">
                <blockquote style={customFontStyle2} className="text-xl font-medium max-w-3xl mx-auto mb-4 leading-relaxed">
                  "{current.quote}"
                </blockquote>
                <p style={customFontStyle} className="text-muted-foreground font-medium">- {current.author}</p>
              </div>
            </div>

            {/* Pagination Dots */}
            <div className="flex justify-center space-x-2 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentTestimonial ? 'bg-[#6355B5]' : 'bg-gray-300'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Separator className="my-10" />

        {/* Recent Trips Section */}
        <div className="mb-16">
          <h2 style={customFontStyle2} className="text-4xl font-bold text-center mb-12">Recent Trips</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { img: oneTrip, date: "Sept 8, 2025", title: "Journeys Are Best Measured In New Friends" },
              { img: fourTrip, date: "Oct 1, 2025", title: "Journeys Are Best Measured In New Friends" },
              { img: fiveTrip, date: "Oct 9, 2025", title: "Journeys Are Best Measured In New Friends" }
            ].map((trip, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="rounded-lg overflow-hidden shadow-md mb-4">
                  <img
                    src={trip.img}
                    alt={trip.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <p style={customFontStyle} className="text-sm text-muted-foreground mb-2">{trip.date}</p>
                <h3 style={customFontStyle2} className="text-xl font-semibold group-hover:text-[#6355B5] transition-colors">
                  {trip.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}