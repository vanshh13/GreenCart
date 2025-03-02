import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { addProductToCart } from "../api";
import { ShoppingCart, Package, Loader2, Heart, Search, Filter, SlidersHorizontal, ArrowLeft } from "lucide-react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useCart } from "../Context/CartContext";
const ProductCard = ({ product, addToCart }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    const fetchWishlist = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/wishlist/:userId", {
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
      console.error("User is not authenticated.");
      return;
    }

    setWishlistLoading(true);
    try {
      if (isWishlisted) {
        await axios.delete(`http://localhost:5000/api/wishlist/remove/:userId/:productId`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post("http://localhost:5000/api/wishlist/add", { productId: product._id }, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setIsWishlisted(!isWishlisted);
    } catch (error) {
      console.error("Error updating wishlist:", error);
    }
    setWishlistLoading(false);
  };

  const handleAddToCart = async () => {
    setIsLoading(true);
    await addToCart(product);
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
          <Heart className="w-6 h-6" fill={isWishlisted ? "red" : "none"} />
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
        {product.discount && (
          <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-md">
            {product.discount}% OFF
          </div>
        )}
        
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
            className="bg-white text-gray-800 px-4 py-2 rounded-lg font-medium shadow-md"
          >
            Quick View
          </motion.button>
        </motion.div>
      </div>

      {/* Product Info */}
      <div className="space-y-3">
        {/* Category tag */}
        <div className="flex">
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-emerald-50 text-emerald-700">
            {product.Category || "Fashion"}
          </span>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 h-14">
          {product.Name}
        </h3>

        <div className="flex items-center space-x-1 text-amber-400">
          {[...Array(5)].map((_, i) => (
            <svg key={i} className="w-4 h-4" fill={(i < Math.floor(product.rating || 4)) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          ))}
          <span className="text-xs text-gray-500 ml-1">({product.reviews || 24})</span>
        </div>

        <div className="flex items-baseline">
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
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAddToCart}
          disabled={isLoading || product.quantity <= 0}
          className={`w-full py-3 px-4 rounded-lg flex items-center justify-center font-semibold transition-all duration-300 ${
            product.quantity > 0
              ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md hover:shadow-lg"
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
        console.error("User is not authenticated.");
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
    } catch (error) {
      console.error("Error adding to cart:", error.message);
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
                <ProductCard product={product} addToCart={addToCart} />
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