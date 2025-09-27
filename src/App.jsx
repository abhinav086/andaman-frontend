import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from './context/AuthContext'; // Add this import

// Pages
import Header from './Pages/Header/Header';
import Home from './Pages/Home/Home';
import './fonts.css';
import Login from "./Pages/Login/Login";
import SignUp from "./Pages/SignUp/Signup";
import AboutUs from "./Pages/Header/AboutUs";
import Services from "./Pages/Header/Services";
import Pricing from "./Pages/Header/Pricing";
import ContactUs from "./Pages/Header/ContactUs";
import AdminPanel from "./admin/AdminPanel";
import { Hotels } from "./admin";
import AdminManagement from "./admin/AdminManagement";

// Create a wrapper component to access location
function AppContent() {
  const location = useLocation();
  
  // Define routes where header should be hidden
  const noHeaderRoutes = ['/login', '/signup', '/admin'];
  const showHeader = !noHeaderRoutes.includes(location.pathname);

  return (
    <>
      {showHeader && <Header />}
      <main className={showHeader ? "" : ""}> {/* Add top padding when header is shown */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs/>} />
          <Route path="/services" element={<Services/>} />
          <Route path="/pricing" element={<Pricing/>} />
          <Route path="/contact" element={<ContactUs/>} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminPanel/>} />
          <Route path="/admin-hotels" element={<Hotels/>}/>
          <Route path="/admin-management" element={<AdminManagement/>}/>
          
    
        </Routes>
      </main>
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider> {/* Wrap the entire app with AuthProvider */}
        <div className="min-h-screen bg-gray-100 font-sans">
          <AppContent />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;