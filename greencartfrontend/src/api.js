import axios from 'axios';
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
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
export const fetchProducts = () => API.get('/products');
export const fetchProductsbyid = (id, data, token) => 
  API.get(`/products/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
export const updateProduct = (id, data, token) => 
  API.put(`/products/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
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
