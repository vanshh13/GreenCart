import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart as CartIcon, Trash2, Plus, Minus, Loader2 } from "lucide-react";

const ShoppingCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/cart-items");
      if (!res.ok) throw new Error("Failed to fetch cart items");

      const cartData = await res.json();
      const products = await Promise.all(
        cartData.map(async (item) => {
          if (!item.product) {
            console.warn("Cart item missing product ID:", item);
            return item;
          }

          const productRes = await fetch(
            `http://localhost:5000/api/products/${item.product}`
          );
          if (!productRes.ok) {
            console.error(`Failed to fetch product ${item.product}`);
            return { ...item, product: null };
          }

          const productData = await productRes.json();
          return { ...item, product: productData };
        })
      );

      setCartItems(products);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      setError("Failed to load cart items. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = (id, change) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item._id === id
          ? { ...item, quantity: Math.max(1, (item.quantity || 1) + change) }
          : item
      )
    );
  };

  const removeFromCart = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/cart-items/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to remove item");
      }

      setCartItems((prevItems) => prevItems.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Error removing cart item:", error);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.product?.Price || 0;
      const quantity = item.quantity || 1;
      return total + price * quantity;
    }, 0);
  };

  return (
    <div className="min-h-screen bg-white py-12">
      <motion.div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <CartIcon size={32} className="text-emerald-600 mr-2" />
            <h1 className="text-4xl font-bold text-gray-800">Your Shopping Cart</h1>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <Loader2 className="animate-spin text-emerald-600" size={40} />
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-4 px-6 text-left">Product</th>
                  <th className="py-4 px-6 text-center">Quantity</th>
                  <th className="py-4 px-6 text-center">Price</th>
                  <th className="py-4 px-6 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {cartItems.map((item) => {
                    const product = item.product || {};
                    const imageUrl = product.Images && product.Images.length > 0
                      ? product.Images[0].startsWith("http")
                        ? product.Images[0]
                        : `/images/${product.Images[0].split("\\").pop()}`
                      : "/images/default.jpg";

                    return (
                      <motion.tr key={item._id} className="border-b border-gray-100">
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-4">
                            <motion.img
                              whileHover={{ scale: 1.1 }}
                              src={imageUrl}
                              alt={product.Name || "Product"}
                              className="w-20 h-20 object-cover rounded-lg shadow-md"
                            />
                            <div>
                              <h3 className="font-semibold text-gray-800">
                                {product.Name || "Unknown Product"}
                              </h3>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center flex justify-center items-center space-x-2">
                          <button onClick={() => updateQuantity(item._id, -1)} className="p-2 bg-gray-200 rounded-full">
                            <Minus size={16} />
                          </button>
                          <span className="font-semibold text-gray-700">{item.quantity || 1}</span>
                          <button onClick={() => updateQuantity(item._id, 1)} className="p-2 bg-gray-200 rounded-full">
                            <Plus size={16} />
                          </button>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className="font-bold text-emerald-600">₹{(product.Price * (item.quantity || 1)).toLocaleString()}</span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <button onClick={() => removeFromCart(item._id)} className="px-4 py-2 bg-red-500 text-white rounded-lg">
                            <Trash2 size={16} /> Remove
                          </button>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
            <div className="bg-gray-50 p-6 mt-4 text-right">
              <span className="text-lg font-semibold text-gray-700">Total:</span>
              <span className="text-2xl font-bold text-emerald-600"> ₹{calculateTotal().toLocaleString()}</span>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ShoppingCart;
