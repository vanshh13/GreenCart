import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { addProductToCart } from "../api";
import { ShoppingCart, Package, Loader2, Heart, Search, Filter, SlidersHorizontal, ArrowLeft, X, AlertCircle, CheckCircle, Info } from "lucide-react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useCart } from "../Context/CartContext";
import QuickViewModal from "../product/QuickViewModel"; // Adjust the path if needed
import ScrollToTop from "../components/ui/ScrollToTop";
import BackButton from "../components/ui/BackButton";

// Toast Notification Component
const Toast = ({ message, type, onClose }) => {
  // Different styling based on notification type
  const getTypeStyles = () => {
    switch (type) {
      case "success":
        return {
          bgColor: "bg-emerald-50",
          borderColor: "border-emerald-500",
          textColor: "text-emerald-700",
          icon: <CheckCircle className="h-5 w-5 text-emerald-500" />
        };
      case "error":
        return {
          bgColor: "bg-red-50",
          borderColor: "border-red-500",
          textColor: "text-red-700",
          icon: <AlertCircle className="h-5 w-5 text-red-500" />
        };
      case "info":
        return {
          bgColor: "bg-blue-50",
          borderColor: "border-blue-500",
          textColor: "text-blue-700",
          icon: <Info className="h-5 w-5 text-blue-500" />
        };
      default:
        return {
          bgColor: "bg-gray-50",
          borderColor: "border-gray-500",
          textColor: "text-gray-700",
          icon: <Info className="h-5 w-5 text-gray-500" />
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`fixed top-4 right-4 z-50 flex items-center ${styles.bgColor} border-l-4 ${styles.borderColor} p-4 shadow-md rounded-md max-w-md`}
    >
      <div className="flex items-center">
        {styles.icon}
        <div className={`ml-3 ${styles.textColor} font-medium`}>{message}</div>
      </div>
      <button onClick={onClose} className="ml-auto">
        <X className="h-5 w-5 text-gray-500 hover:text-gray-700" />
      </button>
    </motion.div>
  );
};

// Toast Notification Manager Component
const NotificationManager = ({ notifications, removeNotification }) => {
  return (
    <AnimatePresence>
      {notifications.map((notification) => (
        <Toast
          key={notification.id}
          message={notification.message}
          type={notification.type}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </AnimatePresence>
  );
};

const ProductCard = ({ product, addToCart, showNotification }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  useEffect(() => {
    const fetchWishlist = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      try {
        const response = await axios.get("http://localhost:5000/api/wishlist/add", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const wishlistItems = response.data || [];
        setIsWishlisted(wishlistItems.some((item) => item.product._id === product._id));
      } catch (error) {
        console.error("Error fetching wishlist:", error.response?.data || error.message);
      }
    };

    fetchWishlist();
  }, [product._id]);

  const handleWishlistToggle = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      showNotification("Please login to manage wishlist", "error");
      return;
    }

    setWishlistLoading(true);

    try {
      if (isWishlisted) {
        await axios.delete(`http://localhost:5000/api/wishlist/remove/${product._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        showNotification("Removed from wishlist", "success");
        setIsWishlisted(false);
      } else {
        await axios.post(
          "http://localhost:5000/api/wishlist/add",
          { productId: product._id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        showNotification("Added to wishlist", "success");
        setIsWishlisted(true);
      }
    } catch (error) {
      console.error("Error updating wishlist:", error.response?.data || error.message);
      showNotification("Failed to update wishlist", "error");
    }

    setWishlistLoading(false);
  };

  const handleAddToCart = async () => {
    // Check if product is out of stock
    if (product.Stock <= 0) {
      showNotification("Sorry, this item is out of stock", "error");
      return;
    }
    
    setIsLoading(true);
    try {
      await addToCart(product);
      showNotification(`${product.Name} added to cart!`, "success");
    } catch (error) {
      showNotification("Failed to add item to cart", "error");
    }
    setIsLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 relative p-4 border border-gray-100"
    >
      {/* Wishlist Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleWishlistToggle}
        disabled={wishlistLoading}
        className={`absolute top-4 right-4 p-2 rounded-full z-10 bg-white shadow-md transition ${
          isWishlisted ? "text-red-500" : "text-gray-400"
        }`}
      >
        {wishlistLoading ? (
          <Loader2 className="w-6 h-6 animate-spin" />
        ) : (
          <Heart className="w-6 h-6" fill={isWishlisted ? "red" : "none"} stroke={isWishlisted ? "red" : "gray"} />
        )}
      </motion.button>

      {/* Image Container */}
      <div className="relative overflow-hidden rounded-xl aspect-square mb-4">
        <motion.img
          src={product.Images?.length > 0 ? product.Images[0] : "/default-Image.jpg"}
          alt={product.Name}
          className="object-cover w-full h-full"
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.3 }}
          onError={(e) => (e.target.src = "/default-Image.jpg")}
        />
        
        {/* Quick view overlay on hover */}
        <motion.div 
          className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsQuickViewOpen(true)}
            className="bg-white text-gray-800 px-4 py-2 rounded-lg font-medium shadow-md"
          >
            Quick View
          </motion.button>
        </motion.div>
        {/* QuickView Modal */}
        {isQuickViewOpen && (
          <QuickViewModal 
            product={product}
            isOpen={isQuickViewOpen}
            onClose={() => setIsQuickViewOpen(false)}
            addToCart={addToCart}
            showNotification={showNotification}
          />
        )}
      </div>

      {/* Product Info */}
      <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 h-14">
        {product.Name}
      </h3>

      <div className="flex items-baseline">
        <span className="text-2xl font-bold text-emerald-600">
          ₹{product.Price?.toLocaleString()}
        </span>
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
        whileHover={{ scale: product.Stock > 0 ? 1.02 : 1 }}
        whileTap={{ scale: product.Stock > 0 ? 0.98 : 1 }}
        onClick={handleAddToCart}
        disabled={isLoading || product.Stock <= 0}
        className={`w-full py-3 px-4 rounded-lg flex items-center justify-center font-semibold shadow-md hover:shadow-lg ${
          product.Stock <= 0 
            ? "bg-gray-300 text-gray-600" 
            : "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white"
        }`}
      >
        {isLoading ? <Loader2 className="animate-spin mr-2" size={20} /> : <ShoppingCart className="mr-2" size={20} />}
        {isLoading ? "Adding..." : product.Stock <= 0 ? "Out of Stock" : "Add to Cart"}
      </motion.button>
    </motion.div>
  );
};

// Main component that handles both regular ProductGrid and CategoryPage functionality
const ProductGrid = () => {
  const { category } = useParams(); // Get category from URL if available
  const navigate = useNavigate();
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [showFilters, setShowFilters] = useState(false);
  const { fetchCart } = useCart();
  
  // Notification state
  const [notifications, setNotifications] = useState([]);

  // Show notification function
  const showNotification = (message, type = "info") => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    
    // Auto remove notification after 3 seconds
    setTimeout(() => {
      removeNotification(id);
    }, 3000);
  };

  // Remove notification function
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/categories");
        // Add "All" option to categories
        setCategories(["All", ...response.data.map(cat => cat.name)]);
      } catch (error) {
        console.error("Error fetching categories:", error);
        // Set some default categories if fetch fails
        setCategories(["All", "Fruits", "Vegetables", "Dairy", "Bakery","Oil & Ghee","Masala","Grain"]);
      }
    };
    
    fetchCategories();
  }, []);

  // Fetch products based on whether we're on a category page or main page
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        let response;
        if (category) {
          // If we're on a category page, fetch only that category's products
          response = await axios.get(
            `http://localhost:5000/api/products/category/${encodeURIComponent(category)}`
          );
          // Also set the selected category for the filter UI
          setSelectedCategory(category);
        } else {
          // Otherwise fetch all products
          response = await axios.get("http://localhost:5000/api/products");
        }
        
        setProducts(response.data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
        showNotification("Failed to load products. Please try again later.", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  // Handle category selection
  const handleCategorySelect = (categoryName) => {
    if (categoryName === "All") {
      // Navigate to the main products page
      navigate("/products");
    } else {
      // Navigate to the specific category page
      navigate(`/category/${categoryName}`);
    }
    setSelectedCategory(categoryName);
  };

  const addToCart = async (product) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        showNotification("Please login to add items to cart", "error");
        return;
      }
      
      // Check if product is out of stock before API call
      if (product.Stock <= 0) {
        showNotification("Sorry, this item is out of stock", "error");
        return;
      }
      
      const cart = {
        productId: product._id,
        quantity: 1,
      };

      const response = await addProductToCart(cart, token);
      const data = response.data;
      fetchCart();
      console.log("Item added successfully:", data);
      return data; // Return data for success case
    } catch (error) {
      console.error("Error adding to cart:", error.message);
      throw error; // Throw error to be caught by the calling function
    }
  };

  // Filter products based on search query
  const filteredProducts = products.filter((product) => {
    return product.Name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-low") return a.Price - b.Price;
    if (sortBy === "price-high") return b.Price - a.Price;
    if (sortBy === "name") return a.Name.localeCompare(b.Name);
    return 0; // default: no sorting
  });

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
    <div className="bg-white min-h-screen">
      <BackButton/>
      <ScrollToTop/>
      {/* Notification Manager Component */}
      <NotificationManager 
        notifications={notifications}
        removeNotification={removeNotification}
      />

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Animated Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          {category ? (
            <>
              <div className="inline-flex items-center justify-center mb-4">
                <Link to="/products" className="flex items-center text-gray-500 hover:text-emerald-600 mr-2">
                  <ArrowLeft size={16} className="mr-1" />
                  Back to All Products
                </Link>
              </div>
              <h2 className="text-4xl font-bold text-gray-800 mb-2">
                <span className="text-emerald-600">{category.charAt(0).toUpperCase() + category.slice(1)}</span> Products
              </h2>
              <div className="h-1 w-20 bg-emerald-500 mx-auto mb-6 rounded-full"></div>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                Explore our collection of {category} items crafted to meet your needs
              </p>
            </>
          ) : (
            <>
              <h2 className="text-4xl font-bold text-gray-800 mb-2">
                <span className="text-emerald-600">Shop</span> Our Collection
              </h2>
              <div className="h-1 w-20 bg-emerald-500 mx-auto mb-6 rounded-full"></div>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                Discover our handpicked selection of premium products at great prices
              </p>
            </>
          )}
        </motion.div>

        {/* Search and Filter Bar */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-gray-50 p-4 rounded-xl shadow-sm">
            <div className="relative flex-1 w-full">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium"
              >
                <SlidersHorizontal size={18} />
                Filters
              </motion.button>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium appearance-none cursor-pointer border-none focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="default">Sort By</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name</option>
              </select>
            </div>
          </div>
          
          {/* Filter Panel - Collapsible */}
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ 
              height: showFilters ? 'auto' : 0,
              opacity: showFilters ? 1 : 0
            }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden mt-2"
          >
            <div className="bg-gray-50 p-4 rounded-xl shadow-sm">
              <div className="flex flex-wrap gap-3">
                <p className="font-medium text-gray-700 mr-2">Categories:</p>
                {categories.map((categoryName) => (
                  <motion.button
                    key={categoryName}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCategorySelect(categoryName)}
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      selectedCategory === categoryName
                        ? "bg-emerald-500 text-white"
                        : "bg-white text-gray-700 border border-gray-200"
                    }`}
                  >
                    {categoryName}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Product Count */}
        <div className="mb-6 flex justify-between items-center">
          <p className="text-gray-600">
            Showing <span className="font-medium">{sortedProducts.length}</span> products
          </p>
          
          {searchQuery && (
            <p className="text-sm text-gray-500">
              Search results for: <span className="font-medium">"{searchQuery}"</span>
            </p>
          )}
        </div>

        {isLoading ? (
          <div className="flex flex-col justify-center items-center min-h-[400px]">
            <Loader2 className="animate-spin text-emerald-600 mb-4" size={40} />
            <p className="text-gray-600">Loading amazing products for you...</p>
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Package size={64} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
              <p className="text-gray-500 mb-6">
                {category 
                  ? `We couldn't find any products in the ${category} category.`
                  : "We couldn't find any products matching your search."
                }
              </p>
              <button 
                onClick={() => {
                  setSearchQuery("");
                  if (category) {
                    navigate("/products");
                  }
                }}
                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                {category ? "View All Products" : "Clear Filters"}
              </button>
            </motion.div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {sortedProducts.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ProductCard 
                  product={product} 
                  addToCart={addToCart} 
                  showNotification={showNotification}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
        
        {/* More Products Button - Only show if we have products and not in search mode */}
        {sortedProducts.length > 0 && !searchQuery && (
          <div className="text-center mt-12">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-3 bg-white border-2 border-emerald-500 text-emerald-600 rounded-lg font-semibold hover:bg-emerald-50 transition-colors"
            >
              Load More Products
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductGrid;