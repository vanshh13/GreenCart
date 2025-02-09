import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./Home/HomePage"; 
// import Cart from "./components/Cart"; 
import Notification from "./components/ui/notification/Notification";
import DecorativePanel from "./components/ui/DecorativePanel";
import "./App.css";
import AuthPage from "./components/authentication/AuthPage";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [notification, setNotification] = useState({ message: "", show: false });

  // Check if the user is logged in from localStorage
  useEffect(() => {
    const userToken = localStorage.getItem("authToken"); 
    setIsAuthenticated(!!userToken); 
  }, []);

  const showNotification = (message) => {
    setNotification({ message, show: true });
    setTimeout(() => setNotification({ message: "", show: false }), 5000);
  };

  return (
    <Router>
      <div className="relative min-h-screen flex flex-col bg-gradient-to-b from-green-50 to-green-100">
        {/* Notification */}
        {notification.show && (
          <Notification message={notification.message} onClose={() => setNotification({ message: "", show: false })} />
        )}

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path= "/authpage" element={<AuthPage/>} />
          {/* <Route path="/login" element={<Login showNotification={showNotification} />} />
          <Route path="/register" element={<Register />} /> */}

          {/* Protected Routes - Redirect to Login if not authenticated */}
          {/* <Route path="/cart" element={isAuthenticated ? <Cart /> : <Navigate to="/login" />} /> */}

          {/* Catch-All Route (404) */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
