import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, NavLink } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HomePage from "./Home/HomePage";
import Blog from "./Home/Blog";
import Notification from "./components/ui/notification/Notification";

import SearchResults from "./components/ui/SearchResults";
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
import OrderDetailPage from "./order/OrderDetailPage";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ element, allowedRoles }) => {
  const token = localStorage.getItem("authToken");
  const userRole = localStorage.getItem("userRole");
  const hadSession = sessionStorage.getItem("hadSession") === "true";
  
  if (!token) {
    if (hadSession) {
      alert("Session Expired. Please log in again.");
    }
    return <Navigate to="/authpage" />;
  }

  try {
    const decodedToken = jwtDecode(token);

    // Check if token has expired
    if (decodedToken.exp * 1000 < Date.now()) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userRole");
      sessionStorage.setItem("hadSession", "false");

      alert("Session Expired. Please log in again.");
      return <Navigate to="/authpage" />;
    }
  } catch (error) {
    console.error("Invalid token", error);
    return <Navigate to="/authpage" />;
  }

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/authpage" />;
  }

  return element;
};

const App = () => {
  const [notification, setNotification] = useState({ message: "", show: false });

  const showNotification = (message) => {
    setNotification({ message, show: true });
    setTimeout(() => setNotification({ message: "", show: false }), 5000);
  };

  return (
    <Router>
      <div className="relative min-h-screen flex flex-col bg-gradient-to-b from-green-50 to-green-100">
        <ToastContainer />
        {notification.show && (
          <Notification message={notification.message} onClose={() => setNotification({ message: "", show: false })} />
        )}

        <Routes>
          <Route path="/authpage" element={<AuthPage />} />
          <Route path="/blog" element={<Blog />} />

          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<ProtectedRoute element={<HomePage />} allowedRoles={["Customer"]} />} />
          <Route path="/user/profile" element={<ProtectedRoute element={<UserProfile />} allowedRoles={["Customer"]} />} />
          <Route path="/user/shopping-cart" element={<ProtectedRoute element={<ShoppingCart />} allowedRoles={["Customer"]} />} />
          <Route path="/admin-dashboard" element={<ProtectedRoute element={<AdminDashboard />} allowedRoles={["Admin"]} />} />
          <Route path="/add-product" element={<ProtectedRoute element={<AddProduct />} allowedRoles={["Admin"]} />} />
          <Route path="/manage-product" element={<ProtectedRoute element={<ManageProducts />} allowedRoles={["Admin"]} />} />
          <Route path="/admin/users/add" element={<ProtectedRoute element={<AddAdmin />} allowedRoles={["Admin"]} />} />
          <Route path="/admin/users" element={<ProtectedRoute element={<ManageAdmins />} allowedRoles={["Admin"]} />} />
          <Route path="/admin/orders" element={<ProtectedRoute element={<OrderManagementDashboard />} allowedRoles={["Admin"]} />} />
          <Route path="/orderdetails/:orderId" element={<OrderDetailPage />} />
          <Route path="*" element={<Navigate to="/" />} />


          <Route path="/search" element={<SearchResults />} />



        </Routes>
      </div>
    </Router>
  );
};

export default App;
