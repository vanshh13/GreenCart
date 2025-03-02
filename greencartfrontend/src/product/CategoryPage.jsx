import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { ShoppingCart, Package, Loader2, Heart, ArrowUpDown, Star } from "lucide-react";
import { addProductToCart } from "../api"; // Make sure this path is correct

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

  // Calculate random rating for demo purposes
  const rating = (Math.random() * 2 + 3).toFixed(1); // Random rating between 3.0 and 5.0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-white rounded-xl overflow-hidden shadow hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 relative group"
    >
      {/* Wishlist Button */}
      <button
        onClick={handleWishlistToggle}
        disabled={wishlistLoading}
        className={`absolute top-3 right-3 p-2 rounded-full z-10 bg-white shadow-md hover:scale-110 transition-all duration-300 opacity-${isHovered || isWishlisted ? '100' : '0'} group-hover:opacity-100 ${
          isWishlisted ? "text-red-500" : "text-gray-400"
        }`}
      >
        {wishlistLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Heart className="w-5 h-5" fill={isWishlisted ? "red" : "none"} />
        )}
      </button>

      {/* Image Container */}
      <div className="relative overflow-hidden aspect-square bg-gray-50">
        <img
          src={product.Images?.length > 0 ? product.Images[0] : "/default-Image.jpg"}
          alt={product.Name}
          className="object-contain w-full h-full transform transition-transform duration-500 hover:scale-105"
          onError={(e) => (e.target.src = "/default-Image.jpg")}
        />
        
        {/* Discount Tag */}
        {product.discount && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            {product.discount}% OFF
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Rating */}
        <div className="flex items-center mb-2">
          <div className="flex text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className="w-4 h-4 mr-1" 
                fill={i < Math.floor(rating) ? "currentColor" : "none"}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500 ml-1">{rating}</span>
        </div>
        
        {/* Title */}
        <h3 className="text-base font-medium text-gray-800 mb-1 line-clamp-2 h-12">
          {product.Name}
        </h3>

        {/* Price */}
        <div className="flex items-baseline mb-3">
          <span className="text-xl font-bold text-emerald-600">
            ₹{product.Price?.toLocaleString()}
          </span>
          {product.originalPrice && (
            <span className="ml-2 text-xs text-gray-500 line-through">
              ₹{product.originalPrice?.toLocaleString()}
            </span>
          )}
        </div>

        {/* Status */}
        <div className="flex items-center mb-4 text-xs">
          {product.quantity > 0 ? (
            <span className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full flex items-center">
              <Package size={12} className="mr-1" />
              In Stock
            </span>
          ) : (
            <span className="text-red-600 bg-red-50 px-2 py-1 rounded-full flex items-center">
              <Package size={12} className="mr-1" />
              Out of Stock
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <motion.button
          whileHover={{ scale: 1.03, backgroundColor: product.quantity > 0 ? "rgb(5, 150, 105)" : "" }}
          whileTap={{ scale: 0.97 }}
          onClick={handleAddToCart}
          disabled={isLoading || product.quantity <= 0}
          className={`w-full py-2.5 px-4 rounded-lg flex items-center justify-center font-medium text-sm transition-all duration-300 ${
            product.quantity > 0
              ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
        >
          {isLoading ? <Loader2 className="animate-spin mr-2" size={16} /> : <ShoppingCart className="mr-2" size={16} />}
          {isLoading ? "Adding..." : "Add to Cart"}
        </motion.button>
      </div>
    </motion.div>
  );
};

const CategoryPage = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState("featured");
  
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/products/category/${encodeURIComponent(category)}`
        );
        console.log("Fetched Products:", response.data);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

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
      console.log("Item added successfully:", data);
    } catch (error) {
      console.error("Error adding to cart:", error.message);
    }
  };

  const handleSort = (option) => {
    setSortOption(option);
    let sortedProducts = [...products];
    
    switch(option) {
      case "priceAsc":
        sortedProducts.sort((a, b) => a.Price - b.Price);
        break;
      case "priceDesc":
        sortedProducts.sort((a, b) => b.Price - a.Price);
        break;
      case "newest":
        // Assuming there's a createdAt field, otherwise this won't work properly
        sortedProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        // Featured - no sorting needed
        break;
    }
    
    setProducts(sortedProducts);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-white p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-red-50 p-6 rounded-lg text-center max-w-4xl mx-auto"
        >
          <p className="text-red-600">{error}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Category Header */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 py-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center container mx-auto px-4"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            {category.charAt(0).toUpperCase() + category.slice(1)} Collection
          </h2>
          <div className="h-1 w-20 bg-emerald-500 mx-auto mb-4 rounded-full"></div>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
            Explore our curated selection of premium {category} items designed for quality and performance
          </p>
        </motion.div>
      </div>

      {/* Sort Section */}
      <div className="container mx-auto px-4 py-6 border-b">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          {!loading && (
            <p className="text-sm text-gray-500 mb-4 md:mb-0">{products.length} products found</p>
          )}
          
          <div className="relative">
            <select 
              value={sortOption}
              onChange={(e) => handleSort(e.target.value)}
              className="appearance-none bg-white border border-gray-200 rounded-lg py-2 pl-4 pr-10 text-sm text-gray-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="featured">Featured</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
              <option value="newest">Newest First</option>
            </select>
            <ArrowUpDown size={14} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Products Display */}
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <Loader2 className="animate-spin text-emerald-600 mx-auto mb-4" size={40} />
              <p className="text-gray-500">Loading products...</p>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center text-gray-600 py-16 bg-gray-50 rounded-xl">
            <Package size={40} className="mx-auto mb-4 text-gray-400" />
            <p className="text-xl font-medium">No products found for {category}.</p>
            <p className="mt-2 max-w-md mx-auto">We're constantly updating our inventory. Please check back later or explore other categories.</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6"
          >
            {products.map((product, index) => (
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
      </div>
      
      {/* Recommendation Section
      {!loading && products.length > 0 && (
        <div className="bg-gray-50 py-10">
          <div className="container mx-auto px-4">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">You May Also Like</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
              {products.slice(0, 5).map((product, index) => (
                <motion.div
                  key={`recommended-${product._id}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ProductCard product={product} addToCart={addToCart} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default CategoryPage;