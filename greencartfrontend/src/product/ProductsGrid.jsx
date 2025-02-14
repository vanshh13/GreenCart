import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Package, Loader2 } from "lucide-react";

const ProductCard = ({ product, addToCart }) => {
  const [isLoading, setIsLoading] = useState(false);

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
      className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
    >
      {/* Image Container */}
      <div className="relative overflow-hidden aspect-square">
  <img
    src={product.Images && product.Images.length > 0 ? product.Images[0] : "/default-Image.jpg"}
    alt={product.Name}
    className="object-cover w-full h-full transform transition-transform duration-300 hover:scale-110"
    onError={(e) => (e.target.src = "/default-Image.jpg")} // Fallback if the image doesn't load
  />


        {product.discount && (
          <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {product.discount}% OFF
          </div>
        )}
      </div>

      {/* Content Container */}
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

        <div className="flex items-center mb-4 text-sm text-gray-600">
          <Package size={16} className="mr-1" />
          <span>{product.quantity > 0 ? 'In Stock' : 'Out of Stock'}</span>
        </div>
        <motion.button
  whileHover={{ scale: 1.05, backgroundColor: "rgb(16, 185, 129)" }} // Light green on hover
  whileTap={{ scale: 0.95 }}
  onClick={handleAddToCart}
  disabled={isLoading || product.quantity <= 0}
  className={`w-full py-3 px-4 rounded-lg flex items-center justify-center font-semibold transition-colors duration-300 ${
    product.quantity > 0
      ? "bg-emerald-600 text-white"
      : "bg-gray-300 text-gray-500 cursor-not-allowed"
  }`}
  style={{ backgroundColor: product.quantity > 0 ? "rgb(5, 150, 105)" : "rgb(209, 213, 219)" }} // Ensuring base color
>
  {isLoading ? (
    <Loader2 className="animate-spin mr-2" size={20} />
  ) : (
    <ShoppingCart className="mr-2" size={20} />
  )}
  {isLoading ? "Adding..." : "Add to Cart"}
</motion.button>

      </div>
    </motion.div>
  );
};

const ProductGrid = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
        setIsLoading(false);
      });
  }, []);

  const addToCart = async (product) => {
    try {
      if (!product || !product._id || !product.Price) {
        console.error("Invalid product data:", product);
        return;
      }

      const cartItemData = {
        product: product._id,
        quantity: 1,
        totalPrice: product.Price * 1,
      };

      console.log("Sending data to backend:", cartItemData);

      const response = await fetch("http://localhost:5000/api/cart-items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cartItemData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to add item to cart");
      }

      console.log("Item added successfully:", data);
    } catch (error) {
      console.error("Error adding to cart:", error.message);
    }
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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {products.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ProductCard product={product} addToCart={addToCart} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default ProductGrid;