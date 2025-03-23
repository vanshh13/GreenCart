import React, { useEffect, useState } from "react";
import axios from "axios";
import { Heart, Package, Loader2, Trash2, ShoppingCart, BadgeCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { addProductToCart } from "../api";
import { useNavigate } from "react-router-dom";
import QuickViewModal from "../product/QuickViewModel"; // Adjust the path if needed
import BackButton from "../components/ui/BackButton";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState({});
  const [hoveredProductId, setHoveredProductId] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: "" });
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  
  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      console.error("User not authenticated.");
      setLoading(false);
      return;
    }

    const fetchWishlist = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/wishlist/add", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWishlist(response.data);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
      setLoading(false);
    };

    fetchWishlist();
  }, [token]);

  const handleRemoveFromWishlist = async (productId) => {
    if (!token) {
      console.error("User not authenticated.");
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/wishlist/remove/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlist(
        wishlist
          .filter(item => item && item.product) // Remove null/undefined items
          .filter(item => item.product._id !== productId) // Now safely filter
      );
      showNotification("Item removed from wishlist");
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
  };

  const handleAddToCart = async (product) => {
    // Don't proceed if product is out of stock
    if (product.Stock <= 0) {
      showNotification("This item is out of stock", "error");
      return;
    }
    
    setIsLoading((prevState) => ({ ...prevState, [product._id]: true }));
    try {
      const cart = { productId: product._id, quantity: 1 };
      const response = await addProductToCart(cart, token);
      showNotification("Item added to cart successfully!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      showNotification("Failed to add item to cart", "error");
    }
    setIsLoading((prevState) => ({ ...prevState, [product._id]: false }));
  };

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "" });
    }, 3000);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <Loader2 className="w-16 h-16 animate-spin text-emerald-500" />
          <p className="mt-4 text-gray-600 font-medium">Loading your wishlist...</p>
        </motion.div>
      </div>
    );
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0, transition: { duration: 0.2 } }
  };

  return (
    <div className="min-h-screen bg-white py-12">
    <BackButton/>
    
      {/* Notification */}
      <AnimatePresence>
        {notification.show && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 rounded-lg shadow-lg px-6 py-3 flex items-center ${
              notification.type === "error" ? "bg-red-500 text-white" : "bg-emerald-500 text-white"
            }`}
          >
            {notification.type === "error" ? 
              <span className="mr-2">⚠️</span> : 
              <BadgeCheck className="w-5 h-5 mr-2" />
            }
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-4 mb-12"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
            className="inline-block bg-white p-4 rounded-full shadow-md mb-4"
          >
            <Heart className="w-8 h-8 text-red-500" fill="#ec4899" />
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Your Wishlist</h1>
          <p className="text-gray-600 max-w-md mx-auto">Manage your favorite items and add them to your cart.</p>
        </div>
      </motion.div>

      {/* Wishlist Content */}
      <div className="container mx-auto px-4">
        {wishlist.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center py-16 bg-white rounded-xl shadow-sm max-w-md mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="mb-6 inline-block"
            >
              <Heart className="w-20 h-20 text-gray-300 mx-auto" />
            </motion.div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">Your wishlist is empty</h3>
            <p className="text-gray-500 mb-6">Items you add to your wishlist will appear here.</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/ProductHome")} // Change to your actual route
              className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium shadow-md hover:bg-emerald-700 transition-colors"
            >
              Continue Shopping
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence>
              {Array.isArray(wishlist) && wishlist.length > 0 ? (
                wishlist
                  .filter(item => item?.product) // Ensures product is not null or undefined
                  .map(({ product }) => (
                    <motion.div
                      key={product._id}
                      variants={cardVariants}
                      exit="exit"
                      layout
                      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
                    >
                      <div className="relative">
                        {/* Image container */}
                        <div 
                          className="relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
                          onMouseEnter={() => setHoveredProductId(product._id)}
                          onMouseLeave={() => setHoveredProductId(null)}
                        >
                          {/* Product Image with gradient overlay */}
                         {/* Product Image with gradient overlay */}
<div className="relative h-60 overflow-hidden">
  <img
    src={Array.isArray(product?.Images) && product.Images.length > 0 
          ? product.Images[0] 
          : "/default-Image.jpg"}
    alt={product?.Name || "Product Image"}
    className="object-contain w-full h-full transform transition-transform duration-500 hover:scale-105"
  />

  {/* Quick view overlay on hover */}
  {hoveredProductId === product._id && (
    <motion.div
      className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          if (!product) return;
          setQuickViewProduct(product);
          setIsQuickViewOpen(true);
        }}
        className="bg-white text-gray-800 px-4 py-2 rounded-lg font-medium shadow-md"
      >
        Quick View
      </motion.button>
    </motion.div>
  )}
</div>

                        </div>

                        {/* Floating price tag */}
                        <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full shadow-md">
                          <span className="text-emerald-600 font-bold">₹{product.Price?.toLocaleString()}</span>
                        </div>

                        {/* Remove button */}
                        <motion.button
                          whileHover={{ scale: 1.1, backgroundColor: "#ef4444" }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleRemoveFromWishlist(product._id)}
                          className="absolute top-4 right-4 bg-white text-red-500 p-2 rounded-full shadow-md hover:text-white transition-colors duration-300"
                        >
                          <Trash2 className="w-5 h-5" />
                        </motion.button>
                      </div>

                      <div className="p-5">
                        {/* Product Details */}
                        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">{product.Name}</h3>

                        {/* Stock status with animated dot for in-stock items */}
                        <div className="flex items-center text-sm text-gray-600 mb-4">
                          <Package size={16} className="mr-1" />
                          <span
                            className={
                              product.Stock === 0
                                ? "text-red-500 font-medium"
                                : product.Stock < 5
                                ? "text-orange-500 font-medium"
                                : product.Stock < 50
                                ? "text-blue-500 font-medium"
                                : product.Stock < 100
                                ? "text-green-500 font-medium"
                                : "text-emerald-600 font-medium"
                            }
                          >
                            {product.Stock === 0
                              ? "Out of Stock"
                              : `In Stock (${product.Stock} available)`}
                          </span>
                        </div>

                        {/* Add to Cart Button */}
                        <motion.button
                          whileHover={{ scale: product.Stock > 0 ? 1.02 : 1 }}
                          whileTap={{ scale: product.Stock > 0 ? 0.98 : 1 }}
                          onClick={() => handleAddToCart(product)}
                          disabled={isLoading[product._id] || product.Stock <= 0}
                          className={`w-full py-3 px-4 rounded-lg flex items-center justify-center font-semibold ${
                            product.Stock > 0
                              ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md hover:shadow-lg"
                              : "bg-gray-300 text-gray-500 cursor-not-allowed"
                          }`}
                        >
                          {isLoading[product._id] ? (
                            <Loader2 className="animate-spin mr-2" size={20} />
                          ) : (
                            <ShoppingCart className="mr-2" size={20} />
                          )}
                          {isLoading[product._id] 
                            ? "Adding..." 
                            : product.Stock <= 0 
                              ? "Out of Stock" 
                              : "Add to Cart"}
                        </motion.button>
                      </div>
                    </motion.div>
                  ))
              ) : (
                <p></p>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* QuickView Modal - Moved outside the mapping to avoid multiple instances */}
      {isQuickViewOpen && quickViewProduct && (
        <QuickViewModal 
          product={quickViewProduct}
          isOpen={isQuickViewOpen}
          onClose={() => {
            setIsQuickViewOpen(false);
            setQuickViewProduct(null);
          }}
        />
      )}
    </div>
  );
};

export default Wishlist;