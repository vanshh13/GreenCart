import { createContext, useContext, useState, useEffect } from "react";
import { fetchCartItems } from "../api"; // Adjust this import based on your API file

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(0);
  const userRole = localStorage.getItem("userRole") || "None"; // Default to None

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token || userRole !== "Customer") return; // Fetch cart only for customers

      const response = await fetchCartItems(token);
      setCartItems(response.data.cartItems.length);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  useEffect(() => {
    if (userRole === "Customer") {
      fetchCart();
    }
  }, [userRole]);

  return (
    <CartContext.Provider value={{ cartItems, setCartItems, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
