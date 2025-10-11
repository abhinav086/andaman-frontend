// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';

// Pages
import Header from './Pages/Header/Header';
import Footer from './Pages/Footer/Footer';
import Home from './Pages/Home/Home';
import Home2 from './Pages/Home/Home2'; // Import Home2
import Home3 from './Pages/Home/Home3'; // Import Home3
import ChatBot from './Pages/Home/Chatbot'; // Import ChatBot
import Activities from './Pages/Home/Activities'; // Import Activities
import './fonts.css';
import Login from "./Pages/Login/Login";
import SignUp from "./Pages/SignUp/Signup";
import AboutUs from "./Pages/Header/AboutUs";
import Services from "./Pages/Header/Services";
import Blog from "./Pages/Header/Blog";
import BlogPost from "./Pages/Header/BlogPost";
import ContactUs from "./Pages/Header/ContactUs";
import MyBookings from './Pages/Home/Bookings/MyBookings';
import ActivityDetail from './Pages/Home/Bookings/ActivityDetails'; 
import HotelDetails from './Pages/Home/Bookings/HotelDetails';

// Admin Pages/Components
import AdminPanel from "./admin/AdminPanel";
import Hotels from "./admin/Hotels";
import AdminManagement from "./admin/AdminManagement";
import UserManagement from "./admin/UserManagement";
import AdminActivities from "./admin/AdminActivities";
import AdminBlogPage from "./admin/AdminBlogPage";
import AdminBlog from "./admin/AdminBlog";
import AdminSettings from "./admin/AdminSettings";
import PrivacyPolicy from './Pages/Footer/PrivacyPolicy';
import TermsOfService from './Pages/Footer/TermsOfService';


function AppContent() {
  const location = useLocation();
  
  // Hide header only for admin routes (not for auth pages like login/signup)
  const hideHeader = location.pathname.startsWith('/admin');

  return (
    <>
      {!hideHeader && <Header />}
      <main className={!hideHeader ? "" : ""}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/home2" element={<Home2 />} />    
          <Route path="/home3" element={<Home3 />} />      
          <Route path="/chatbot" element={<ChatBot />} /> 
          <Route path="/activities" element={<Activities />} /> 
          <Route path="/about" element={<AboutUs />} />
          <Route path="/services" element={<Services />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path='/termsofservice' element={<TermsOfService/>} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminPanel />}>
            <Route index element={<AdminPanel.DashboardContent />} />
          </Route>
          <Route path="/admin-management" element={<AdminPanel />}>
            <Route index element={<AdminManagement />} />
          </Route>
          <Route path="/admin-users" element={<AdminPanel />}>
            <Route index element={<UserManagement />} />
          </Route>
          <Route path="/admin-hotels" element={<AdminPanel />}>
            <Route index element={<Hotels />} />
          </Route>
          <Route path="/admin-activities" element={<AdminPanel />}>
            <Route index element={<AdminActivities />} />
          </Route>
          <Route path="/admin-blogs" element={<AdminPanel />}>
            <Route index element={<AdminBlogPage />} />
          </Route>
          <Route path="/admin-blogbooks" element={<AdminPanel />}>
            <Route index element={<AdminBlog />} />
          </Route>
          <Route path="/admin-settings" element={<AdminPanel />}>
            <Route index element={<AdminSettings />} />
          </Route>
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/activities/:id" element={<ActivityDetail />} />
          <Route path="/hotels/:id" element={<HotelDetails />} />
          
        </Routes>
      </main>
      {!hideHeader && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
     
          <AppContent />
        
      </AuthProvider>
    </Router>
  );
}

export default App;