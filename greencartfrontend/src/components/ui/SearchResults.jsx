import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Heart, ShoppingCart } from "lucide-react"; // Ensure correct imports
import { useCart } from "../../Context/CartContext";

const SearchResults = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // Get search query from URL
  const query = new URLSearchParams(location.search).get("query");

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) return;

      setLoading(true);
      try {
        const { searchProducts } = await import("../api"); // Import from API
        const results = await searchProducts(query);
        setProducts(results);
        setError(null);
      } catch (err) {
        console.error("Search error:", err);
        setError("Failed to fetch search results");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleAddToCart = (e, productId) => {
    e.stopPropagation();
    addToCart(productId, 1);
  };

  return (
    <div className="container mx-auto px-4 pt-24 pb-12">
      <h1 className="text-2xl font-bold mb-6">
        {query ? `Search Results for "${query}"` : "All Products"}
      </h1>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-lg text-red-600">
          {error}. Please try again later.
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No products found matching "{query}"</p>
          <button
            onClick={() => navigate("/productsgrid")}
            className="px-4 py-2 bg-green-600 text-white rounded-lg"
          >
            Browse All Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              onClick={() => handleProductClick(product._id)}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition duration-200 cursor-pointer overflow-hidden border border-gray-100"
            >
              <div className="h-48 overflow-hidden relative">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                {product.discount > 0 && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                    {product.discount}% OFF
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-800">{product.name}</h3>
                <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                <div className="flex justify-between items-center">
                  <div className="flex items-baseline space-x-2">
                    <span className="font-bold text-green-600">₹{product.price.toFixed(2)}</span>
                    {product.originalPrice > 0 && (
                      <span className="text-gray-400 text-sm line-through">
                        ₹{product.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      className="p-1 text-gray-400 hover:text-red-500 rounded-full transition"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Heart size={18} />
                    </button>
                    <button
                      className="p-1 text-gray-400 hover:text-green-600 rounded-full transition"
                      onClick={(e) => handleAddToCart(e, product._id)}
                    >
                      <ShoppingCart size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
