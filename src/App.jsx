// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import Header from './Pages/Header/Header';   // ✅ fix import path (your file is in components, not Pages)
import Home from './Pages/Home/Home';
import './fonts.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 font-sans">
        {/* Header always visible */}
        <Header />

        {/* Page Routing */}
        <main className=""> {/* add padding so header doesn’t overlap */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<div>About Us Page</div>} />
            <Route path="/services" element={<div>Services Page</div>} />
            <Route path="/pricing" element={<div>Pricing Page</div>} />
            <Route path="/contact" element={<div>Contact Us Page</div>} />
            <Route path="/login" element={<div>Login Page</div>} />
            <Route path="/signup" element={<div>Sign Up Page</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
