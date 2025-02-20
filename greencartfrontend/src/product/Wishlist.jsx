import React, { useState, useEffect } from "react";
import { Heart, ShoppingBag, Trash2, Loader2, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";


const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(storedWishlist);
    setIsLoading(false);
  }, []);

  const removeFromWishlist = (productId) => {
    const updatedWishlist = wishlist.filter((item) => item._id !== productId);
    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
  };

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


  const handleAddToCart = async (product) => {
    setIsLoading(true);
    await addToCart(product);
    setIsLoading(false);
  };
  

 

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-8">
          <Heart className="w-8 h-8 text-rose-500" />
          <h2 className="text-4xl font-bold text-gray-800">Your Wishlist</h2>
        </div>

        {wishlist.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((product, index) => (
              <div
                key={product._id}
                className="group bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                style={{
                  animation: `fadeIn 0.5s ease-out ${index * 0.1}s`
                }}
              >
                <div className="relative">
                  <img
                    src={product.Images?.[0] || "/api/placeholder/400/300"}
                    alt={product.Name}
                    className="w-full h-48 object-cover"
                  />
                  <button
                    onClick={() => removeFromWishlist(product._id)}
                    className="absolute top-2 right-2 p-2 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-rose-50"
                  >
                    <Trash2 className="w-5 h-5 text-rose-500" />
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.Name}</h3>
                  <div className="flex items-center justify-between">
                    <p className="text-emerald-600 text-xl font-bold">₹{product.Price.toLocaleString()}</p>
                    <button className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors duration-200">
                      <ShoppingBag className="w-4 h-4" />
                      <button onClick={() => handleAddToCart(product)}>Add to Cart</button>

                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl shadow-lg">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-600">Your wishlist is empty</p>
            <p className="text-gray-400 mt-2">Start adding some items to your wishlist!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;