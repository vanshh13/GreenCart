import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { ShoppingCart, Package, Loader2, Heart, CheckCircle, AlertCircle } from "lucide-react";
import { addProductToCart } from "../api";
import { useCart } from "../Context/CartContext";
// Notification component
const Notification = ({ message, type, isVisible, onClose }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className={`fixed top-6 right-6 z-50 p-4 rounded-lg shadow-lg flex items-center ${
            type === "success" ? "bg-emerald-500" : "bg-red-500"
          } text-white max-w-md`}
        >
          {type === "success" ? (
            <CheckCircle className="w-5 h-5 mr-2" />
          ) : (
            <AlertCircle className="w-5 h-5 mr-2" />
          )}
          <p>{message}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ProductCard = ({ product, addToCart, onNotification }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    const fetchWishlist = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/wishlist/add", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const wishlistItems = response.data;
        setIsWishlisted(wishlistItems.some((item) => item.product._id === product._id));
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    };

    fetchWishlist();
  }, [product._id]);

  const handleWishlistToggle = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      onNotification("Please login to add items to wishlist", "error");
      return;
    }

    setWishlistLoading(true);
    try {
      if (isWishlisted) {
        // Fixed API endpoint to remove from wishlist
        await axios.delete(`http://localhost:5000/api/wishlist/remove/${product._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        onNotification("Removed from wishlist", "success");
      } else {
        await axios.post("http://localhost:5000/api/wishlist/add", { productId: product._id }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        onNotification("Added to wishlist", "success");
      }

      setIsWishlisted(!isWishlisted);
    } catch (error) {
      console.error("Error updating wishlist:", error);
      onNotification("Failed to update wishlist", "error");
    }
    setWishlistLoading(false);
  };

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      await addToCart(product);
      onNotification(`${product.Name} added to cart!`, "success");
    } catch (error) {
      onNotification("Failed to add item to cart", "error");
    }
    setIsLoading(false);
  };

  // Stock status display enhancement
  const getStockDisplay = () => {
    if (product.quantity === undefined || product.quantity === null) {
      return { text: "Stock status unknown", color: "text-gray-500" };
    }
    
    if (product.quantity <= 0) {
      return { text: "Out of Stock", color: "text-red-500" };
    }
    
    if (product.quantity < 10) {
      return { text: `Only ${product.quantity} left!`, color: "text-amber-500" };
    }
    
    return { text: "In Stock", color: "text-emerald-600" };
  };

  const stockInfo = getStockDisplay();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 relative p-4"
    >
      {/* Wishlist Button */}
      <button
        onClick={handleWishlistToggle}
        disabled={wishlistLoading}
        className={`absolute top-4 right-4 p-2 rounded-full z-10 bg-white shadow-md hover:scale-110 transition ${
          isWishlisted ? "text-red-500" : "text-gray-400"
        }`}
      >
        {wishlistLoading ? (
          <Loader2 className="w-6 h-6 animate-spin" />
        ) : (
          <Heart className="w-6 h-6" fill={isWishlisted ? "red" : "none"} />
        )}
      </button>

      {/* Image */}
      <div className="relative overflow-hidden aspect-square">
        <img
          src={product.Images?.length > 0 ? product.Images[0] : "/default-Image.jpg"}
          alt={product.Name}
          className="object-cover w-full h-full transform transition-transform duration-300 hover:scale-110"
          onError={(e) => (e.target.src = "/default-Image.jpg")}
        />
        {product.discount && (
          <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {product.discount}% OFF
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
          {product.Name}
        </h3>

        <div className="flex items-baseline mb-4">
          <span className="text-2xl font-bold text-emerald-600">
            ₹{product.Price?.toLocaleString()}
          </span>
          {product.originalPrice && (
            <span className="ml-2 text-sm text-gray-500 line-through">
              ₹{product.originalPrice?.toLocaleString()}
            </span>
          )}
        </div>

        {/* Improved stock display */}
          <div className="flex items-center text-sm text-gray-600">
          <Package size={16} className="mr-1" />
          <span
            className={
              product.Stock === 0
                ? "text-red-500 font-medium"
                : product.Stock < 5
                ? "text-red-500 font-medium"
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
          whileHover={{ scale: 1.05, backgroundColor: "rgb(16, 185, 129)" }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddToCart}
          disabled={isLoading || product.quantity <= 0}
          className={`w-full py-3 px-4 rounded-lg flex items-center justify-center font-semibold transition-colors duration-300 ${
            product.quantity > 0
              ? "bg-emerald-600 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {isLoading ? <Loader2 className="animate-spin mr-2" size={20} /> : <ShoppingCart className="mr-2" size={20} />}
          {isLoading ? "Adding..." : "Add to Cart"}
        </motion.button>
      </div>
    </motion.div>
  );
};

const ProductHome = () => {
  const [products, setProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState(8);  // Show 8 products initially (2 rows of 4)
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({
    message: "",
    type: "success",
    isVisible: false
  });
  const { fetchCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("http://localhost:5000/api/products");
        setProducts(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to load products. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = async (product) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        showNotification("Please login to add items to cart", "error");
        return;
      }
      const cart = {
        productId: product._id,
        quantity: 1,
      };

      const response = await addProductToCart(cart, token);
      fetchCart();
      return response.data;
    } catch (error) {
      console.error("Error adding to cart:", error.message);
      throw error;
    }
  };

  const showNotification = (message, type = "success") => {
    setNotification({
      message,
      type,
      isVisible: true
    });

    // Auto-hide notification after 3 seconds
    setTimeout(() => {
      setNotification(prev => ({
        ...prev,
        isVisible: false
      }));
    }, 3000);
  };

  const handleShowMore = () => {
    setVisibleProducts(products.length);
  };

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-red-50 p-6 rounded-lg"
        >
          <p className="text-red-600">{error}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Notification component */}
      <Notification 
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={() => setNotification(prev => ({ ...prev, isVisible: false }))}
      />

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Animated Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
          🛒 Explore Our Best Products
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our handpicked selection of premium products at great prices
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <Loader2 className="animate-spin text-emerald-600" size={40} />
          </div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {products.slice(0, visibleProducts).map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ProductCard 
                    product={product} 
                    addToCart={addToCart} 
                    onNotification={showNotification}
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* Show More Button */}
            {visibleProducts < products.length && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex justify-center mt-12"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleShowMore}
                  className="px-8 py-4 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition shadow-lg flex items-center"
                >
                  Show All Products
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L10 14.586l5.293-5.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </motion.button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductHome;