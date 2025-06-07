import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";

import { CartProvider } from "./Context/CartContext"; // ✅ Import CartProvider

import HomePage from "./Home/HomePage";
import Blog from "./Home/Blog";
import Notification from "./components/ui/notification/Notification";
import SearchResults from "./components/ui/SearchResults";
import AuthPage from "./components/authentication/AuthPage";
import AdminDashboard from "./admin/AdminDashboard";
import AddProduct from "./product/AddProduct";
import ManageProducts from "./product/ManageProduct";
import OrderManagementDashboard from "./order/OrderManagement";
import AddAdmin from "./admin/AddAdmin";
import ManageAdmins from "./admin/ManageUsers";
import ShoppingCart from "./Shopping/ShoppingCart";
import UserProfile from "./user/UserProfile";
import OrderDetailPage from "./order/OrderDetailPage";
import AnalysisDashboard from "./admin/AnalysisDashboard";
import AdminStatistics from "./admin/AdminStatistics";
import ProductCatalog from "./product/ProductCatalog";
import AddBlog from "./Blog/AddBlog";
import ManageBlog from "./Blog/ManageBlog";
import Logout from "./components/authentication/Logout";
import Wishlist from "./product/Wishlist";
import OrderTracking from "./order/OrderTracking";

import ProductsGrid from "./product/ProductsGrid";
import ProductHome from "./product/Product-Home";
import CategoryPage from "./product/CategoryPage";
import ScrollToTop from "./components/ui/ScrollToTop";
import BackButton from "./components/ui/BackButton";

import About from "./Home/About"
// import SearchResults from "./components/ui/SearchResults";

import "./App.css";
import NotificationsPage from "./admin/NotificationPage";
import QuickViewModal from "./product/QuickViewModel";


import RazorpayPayment from "./order/RazorpayPayment"; // Import the new component



const ProtectedRoute = ({ element, allowedRoles }) => {
  const token = localStorage.getItem("authToken");
  const userRole = localStorage.getItem("userRole");

  if (!token || !userRole) {
    console.error("Authentication token or user role is missing.");
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
    console.error(`Access denied: User role '${userRole}' not allowed.`);
    if (userRole === "Customer") {
      return <Navigate to="/authpage" />;
    }
    if (userRole === "Manager") {
      return <Navigate to="/admin-dashboard" />;
    }
    if (userRole === "Admin") {
      return <Navigate to="/admin-dashboard" />;
    }
  }

  return element;
};

export const searchProducts = async (query) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/products/search?query=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
};

const App = () => {
  const [notification, setNotification] = useState({ message: "", show: false });

  const showNotification = (message) => {
    setNotification({ message, show: true });
    setTimeout(() => setNotification({ message: "", show: false }), 5000);
  };

  // Example customer data - replace with actual user data from your auth context/state
  const customerInfo = {
    name: "Customer Name",
    email: "customer@example.com",
    phone: "9173781550"
  };

  // Payment success handler
  const handlePaymentSuccess = (response) => {
    console.log("Payment successful", response);
    showNotification("Payment successful!");
    // Add your logic to update order status, redirect to confirmation page, etc.
  };

  // Payment failure handler
  const handlePaymentFailure = (error) => {
    console.error("Payment failed", error);
    showNotification("Payment failed: " + error);
  };


  return (
    <Router>
      <CartProvider> {/* ✅ Wrap everything inside CartProvider */}
        <div className="relative min-h-screen flex flex-col bg-gradient-to-b from-green-50 to-green-100">
          <ToastContainer />
          {notification.show && (
            <Notification
              message={notification.message}
              onClose={() => setNotification({ message: "", show: false })}
            />
          )}


          {/* Example payment component usage - you would typically place this in your checkout page */}
          {/* <div className="container mx-auto p-4">
            <RazorpayPayment 
              amount={100} // Replace with actual cart total
              customerInfo={customerInfo}
              onSuccess={handlePaymentSuccess}
              onFailure={handlePaymentFailure}
            />
          </div> */}

          <Routes>
            <Route path="/authpage" element={<AuthPage />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/products" element={<ProductsGrid />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<ProtectedRoute element={<HomePage />} allowedRoles={["Customer"]} />} />
            <Route path="/user/profile" element={<ProtectedRoute element={<UserProfile />} allowedRoles={["Customer"]} />} />
            <Route path="/user/shopping-cart" element={<ProtectedRoute element={<ShoppingCart />} allowedRoles={["Customer"]} />} />
            <Route path="/user/wishlist" element={<ProtectedRoute element={<Wishlist />} allowedRoles={["Customer"]} />} />
            <Route path="/ordertracking/:orderId" element={<ProtectedRoute element={<OrderTracking />} allowedRoles={["Customer"]} />} />

            <Route path="/admin-dashboard" element={<ProtectedRoute element={<AdminDashboard />} allowedRoles={["Admin", "Manager"]} />} />
            <Route path="/admin/add-product" element={<ProtectedRoute element={<AddProduct />} allowedRoles={["Admin"]} />} />
            <Route path="/admin/product/:productId" element={<ProtectedRoute element={<ProductCatalog />} allowedRoles={["Admin","Manager"]} />} />
            <Route path="admin/manage-product" element={<ProtectedRoute element={<ManageProducts />} allowedRoles={["Admin"]} />} />
            <Route path="/admin/notification-page" element={<ProtectedRoute element={<NotificationsPage />} allowedRoles={["Admin"]} />} />
            <Route path="/admin/users/add" element={<ProtectedRoute element={<AddAdmin />} allowedRoles={["Admin"]} />} />
            <Route path="/admin/users" element={<ProtectedRoute element={<ManageAdmins />} allowedRoles={["Admin"]} />} />
            <Route path="/admin/orders" element={<ProtectedRoute element={<OrderManagementDashboard />} allowedRoles={["Admin"]} />} />
            <Route path="/orderdetails/:orderId" element={<OrderDetailPage />} />
            <Route path="/admin/add-blog" element={<ProtectedRoute element={<AddBlog />} allowedRoles={["Admin","Manager"]} />} />
            <Route path="/admin/manage-blog" element={<ProtectedRoute element={<ManageBlog />} allowedRoles={["Admin","Manager"]} />} />
            <Route path="/admin/analytics" element={<ProtectedRoute element={<AnalysisDashboard />} allowedRoles={["Admin"]} />} />
            <Route path="/admin/statistics" element={<ProtectedRoute element={<AdminStatistics />} allowedRoles={["Admin"]} />} />
            <Route path="/admin/user/profile" element={<ProtectedRoute element={<UserProfile />} allowedRoles={["Admin","Manager"]} />} />
            <Route path="/logout" element={<ProtectedRoute element={<Logout />} allowedRoles={["Admin","Customer"]} />} />
            <Route path="*" element={<Navigate to="/" />} />
            <Route path="/productsgrid" element={<ProtectedRoute element={<ProductsGrid />} allowedRoles={["Customer"]} />} />
            <Route path="/producthome" element={<ProtectedRoute element={<ProductHome />} allowedRoles={["Customer"]} />} />

          <Route path="/category/:category" element={<CategoryPage />} />

          <Route path="/quickviewmodel" element={<QuickViewModal />} />
          <Route path="/scrolltotop" element={<ScrollToTop />} />
          <Route path="/backbutton" element={<BackButton />} />

          <Route path="/about" element={<About />} />


          




            <Route path="/search" element={<SearchResults />} />
          </Routes>
        </div>
      </CartProvider> {/* ✅ Closing CartProvider */}


    </Router>
  );
};

export default App;
