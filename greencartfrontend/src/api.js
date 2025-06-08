import axios from 'axios';
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

const API = axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL,
});

API.interceptors.response.use(
  (response) => response,
  (error,config) => {
    if (error.response) {
      const { status, data } = error.response;
      const hadSession = sessionStorage.getItem("hadSession") === "true";

      if (status === 401 || status === 403) {
          const token = localStorage.getItem("authToken");
      
          if (token) {
            // Decode token to check expiration
            try {
              const decoded = jwtDecode(token);
              if (decoded.exp * 1000 < Date.now()) {
                localStorage.removeItem("authToken");
                localStorage.removeItem("userRole");
                sessionStorage.setItem("hadSession", "false");
      
                toast.warn("Session Expired. Please log in again.", {
                  position: "top-center",
                  autoClose: 4000,
                  onClose: () => (window.location.href = "/authpage"),
                });
      
                return ("Token expired");
              }
            } catch (error) {
              console.error("Error decoding token:", error);
            }
      
            config.headers.Authorization = `Bearer ${token}`;
          }

        if (hadSession) {
          toast.warn("Your session has expired. Please log in again.", {
            position: "top-center",
            autoClose: 4000,
            onClose: () => (window.location.href = "/authpage"),
          });
        } else {
          window.location.href = "/authpage";
        }
      } else if (status === 400 && data?.message === "Invalid Credentials") {
        toast.error("Invalid login credentials. Please try again.");
      }
    }
    return Promise.reject(error);
  }
);


// User APIs
export const registerUser = (data) => API.post('/users/register', data);
export const loginUser = (data) => API.post('/users/login', data);
export const socialLogin = (data) => API.post('/users/oauth/', data);

// Product APIs
export const fetchProductsbyid = (id, data, token) => 
  API.get(`/products/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

  export const fetchAllProductsAPI = () => {
  return API.get("/products");
};


  export const updateProduct = (productId, updatedProduct) => {
  return API.put(`/products/${productId}`, updatedProduct, {
    headers: {
      ...authHeaders().headers,
      "Content-Type": "application/json",
    },
  });
};

export const deleteProduct = (id, token) => 
  API.delete(`/products/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
export const createProduct = (data) => API.post(`/products/`, data);

// Admin API
export const createAdmin = (data, token) => {
  return API.post('/admins/', data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Cart API
export const addProductToCart = (data, token) => {
  return API.post('/cart-items/addtocart/',data,{
    headers: { Authorization: `Bearer ${token}` },
  });
}

export const fetchCartItems = (token) => {
  if (!token) {
    throw new Error("Authentication token is missing.");
  }             
  return API.get('/cart-items', {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateCartItemQuantity = (id, newQuantity, token) => {
  return API.put(`/cart-items/${id}`, { quantity: newQuantity }, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const removeCartItem = (id, token) => {
  return API.delete(`/cart-items/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Order API - Confirm Order
export const confirmOrder = async (token, orderData) => {
  console.log("Sending order data:", orderData); // Debugging line

  return API.post("/orders", orderData, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => res.data)
    .catch((error) => {
      console.error("Error confirming order:", error.response?.data || error.message);
      throw error;
    });
};


export const updateOrderStatus = async (token, orderId, status) => {
  return API.put(`/orders/${orderId}`, { status }, {  
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const createNewAddress = async (token, addressData) => {
  return API.post("/addresses", addressData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const fetchUserAddresses = (token) => {
  return API.get('/addresses/user', {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const fetchOrderByUser = (token) => {
  return API.get('/orders/user/' , {
    headers : { Authorization: `Bearer ${token}`},
  });
};

export const orderTracking = (token, orderId) => {
  return API.get(`/orders/tracking/${orderId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const fetchNotifications = (token) => {
  return API.get("/notifications", authHeaders());
};

export const fetchAdminStats = (token) => {
  return API.get("/admins/stats", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const fetchVisitorStats = (token, period) => {
  return API.get(`/admins/statistics/visitors/${period}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

export const fetchOverviewStats = (token, period = "monthly") => {
  return API.get(`/admins/statistics/overview/${period}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const fetchTopProductStats = (token) => {
  return API.get("/admins/statistics/products/top", {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

export const fetchSalesByPayment = (token) => {
  return API.get("/admins/statistics/sales/payment", {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

// api/adminAnalytics
export const fetchSalesData = (token, timeframe) => {
  return API.get(`/admins/analytics/sales/${timeframe}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

export const fetchProductAnalytics = (token) => {
  return API.get(`/admins/analytics/products`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

export const fetchUserAnalytics = (token) => {
  return API.get(`/admins/analytics/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    "Content-Type": "application/json",
  },
});

// Get current logged-in user
export const fetchCurrentUser = () => {
  return API.get("/users/current", authHeaders());
};

// Get all users
export const fetchAllUsers = () => {
  return API.get("/users", authHeaders());
};

// Get role for a specific admin user
export const fetchAdminRoleById = (userId) => {
  return API.get(`/admins/role/${userId}`);
};

// Add new user (Customer/Admin)
export const addNewUser = (data) => {
  return API.post("/users", data, authHeaders());
};

// Delete a user
export const deleteUserById = (userId) => {
  return API.delete(`/users/${userId}`, authHeaders());
};

// Update admin role
export const updateAdminRoleById = (adminId, role) => {
  return API.put(`/admins/${adminId}/role`, { role }, authHeaders());
};

export const markNotificationAsRead = (id) => {
  return API.put(`/notifications/${id}/read`);
};

export const markAllNotificationsAsRead = () => {
  return API.put(`/notifications/mark-all-read`);
};

export const clearAllNotificationsAPI = () => {
  return API.delete(`/notifications/clear-all`);
};

export const fetchNotificationsAPI = () => {
  return API.get("/notifications", authHeaders());
};

export const createBlog = (formData) => {
  return API.post("/blogs", formData, {
    ...authHeaders(),
    headers: {
      ...authHeaders().headers,
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getAllBlogs = () => {
return API.get("/blogs");
};

export const deleteBlogById = (id) => {
return API.delete(`/blogs/${id}`, authHeaders());
};

// Upload new images
export const uploadImages = (formData) => {
  return API.post(`/upload`, formData, {
    headers: {
      ...authHeaders(),
      "Content-Type": "multipart/form-data"
    }
  });
};



// Update blog
export const updateBlog = (id, blogData) => {
  return API.put(`/blogs/${id}`, blogData, authHeaders());
};

export const getAllBlogsFrontend = () => {
  return API.get("/blogs/all");
};

export const getOrderDetailsByOrderId = (orderId) => {
  return API.get(`/order-details/order/${orderId}`);
};

export const getAllOrders = () => API.get("/orders");
export const getUserById = (id) => API.get(`/users/${id}`);
// export const getOrderDetailsByOrderId = (orderId) => API.get(`/order-details/order/${orderId}`);
export const getAddressById = (id) => API.get(`/addresses/${id}`);
export const getProductById = (id) => API.get(`/products/${id}`);

export const createRazorpayOrder = (orderData) =>
  API.post("/create-order", orderData);

export const verifyRazorpayPayment = (verifyData) =>
  API.post("/verify-payment", verifyData);

export const getPaymentDetails = (paymentId) =>
  API.get(`/payment/${paymentId}`);

// Modify these API endpoints to support batched requests
export const getAllOrdersWithDetails = () => API.get("/orders/with-details");
// Alternatively, create a new endpoint that returns all orders with their details in a single request

export const logoutAPI = () => {
  return API.post("/users/logout", {}, authHeaders());
};

export const addProductAPI = (formData) => {
  return API.post("/products", formData, authHeaders());
};

export const fetchWishlistAPI = (userId) => {
  return API.get(`/wishlist/${userId}`, authHeaders());
};

export const fetchProductsByCategoryAPI = (category) => {
  return API.get(`/products/category/${encodeURIComponent(category)}`);
};

export const fetchWishlistAddAPI = () => {
  return API.get("/wishlist/add", authHeaders());
};


export const addToWishlistAPI = (productId) => {
  return API.post("/wishlist/add", { productId }, authHeaders());
};

export const removeFromWishlistAPI = (productId) => {
  return API.delete(`/wishlist/remove/${productId}`, authHeaders());
};

export const getCategories = () => {
  return API.get(`/categories`)
};

export const getUserdetails = () => {
  return API.get(`/users/getuserdetails`, authHeaders());
};

export const updateUser = (updateData) => {
  return API.put(`/users/updateuser`, {updateData} , authHeaders());
};