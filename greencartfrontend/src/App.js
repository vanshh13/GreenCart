import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./Home/HomePage"; 
// import Cart from "./components/Cart"; 
import Notification from "./components/ui/notification/Notification";
import DecorativePanel from "./components/ui/DecorativePanel";
import "./App.css";
import AuthPage from "./components/authentication/AuthPage";
import AdminDashboard from "./admin/AdminDashboard";
import AddProduct from "./product/AddProduct";
import ManageProducts from "./product/ManageProduct";
import OrderManagementDashboard from "./order/OrderManagement";
import AddAdmin from "./admin/AddAdmin";
import ManageAdmins from "./admin/ManageAdmins";
import ShoppingCart from "./Shopping/ShoppingCart";
import UserProfile from "./user/UserProfile";

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

  const ProtectedRoute = ({ element, role, allowedRoles }) => {
    const isAuthenticated = localStorage.getItem("authToken");
    const userRole = localStorage.getItem("userRole");
  
    if (!isAuthenticated) {
      return <Navigate to="/authpage" />;
    }
  
    if (!allowedRoles.includes(userRole)) {
      return <Navigate to="/" />;
    }
  
    return element;
  };
  return (
    <Router>
      <div className="relative min-h-screen flex flex-col bg-gradient-to-b from-green-50 to-green-100">
        {/* Notification */}
        {notification.show && (
          <Notification message={notification.message} onClose={() => setNotification({ message: "", show: false })} />
        )}

        <Routes>
          <Route path= "/authpage" element={<AuthPage/>} />
          {/* <Route path="/login" element={<Login showNotification={showNotification} />} />
          <Route path="/register" element={<Register />} /> */}
          
          {/* Customer Protected Routes */}
          <Route path="/home" element={<ProtectedRoute element={<HomePage />} allowedRoles={["Customer"]} />} />
          <Route path="/user/profile" element={<ProtectedRoute element={<UserProfile/>} allowedRoles={["Customer"]} />} />
          {/* Protected Routes - Redirect to Login if not authenticated */}
          <Route path="/user/shopping-cart" element={isAuthenticated ? <ShoppingCart /> : <Navigate to="/login" />} />

          {/* Admin Protected Routes */}
          {/* <Route path="/admin-dashboard" element={<AdminDashboard />} /> */}
          <Route path="/admin-dashboard" element={isAuthenticated ? <AdminDashboard/> : <Navigate to="/login" />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/manage-product" element={< ManageProducts/>} />
          <Route path="/admin/users/add" element={<AddAdmin />} />
          <Route path="/admin/users" element={<ManageAdmins />} />
          <Route path="/admin/orders" element={< OrderManagementDashboard/>} />
          {/* <Route path="/admin/analytics" element={<AddProduct />} />
          <Route path="/admin/statistics" element={<AddProduct />} /> */}

          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />

          {/* Catch-All Route (404) */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
