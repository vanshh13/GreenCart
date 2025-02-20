import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart as CartIcon, Trash2, Plus, Minus, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { fetchCartItems, updateCartItemQuantity, removeCartItem } from "../api";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/Card"; 

const ShoppingCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalCartPrice, setTotalCartPrice] = useState(0);  // Track total price from backend
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  // Fetch cart items and total price
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetchCartItems(token);
      setCartItems(response.data.cartItems || []);
  
      // Calculate total price from fetched items
      const total = (response.data.cartItems || []).reduce((sum, item) => {
        return sum + (item?.product?.Price || 0) * (item?.quantity || 0);
      }, 0);
      setTotalCartPrice(total);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    } finally {
      setLoading(false);
    }
  };
  
  // Update Item Quantity
  const updateQuantity = async (id, change) => {
    try {
      const token = localStorage.getItem("authToken");
      const updatedItem = cartItems.find((item) => item._id === id);
      const newQuantity = Math.max(1, updatedItem.quantity + change);
      
      const response = await updateCartItemQuantity(id, newQuantity, token);

      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item._id === id ? { ...item, quantity: newQuantity } : item
        )
      );

      setTotalCartPrice(response.data.shoppingCart.totalPrice); // Update total price from backend
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Could not update item quantity.");
    }
  };

  // Remove Item from Cart
  const removeFromCart = async (id) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await removeCartItem(id, token);
      
      setCartItems((prevItems) => prevItems.filter((item) => item._id !== id));
      setTotalCartPrice(response.data.shoppingCart.totalPrice); // Update total price from backend

      toast.success("Item removed from cart.");
    } catch (error) {
      console.error("Error removing cart item:", error);
      toast.error("Failed to remove item.");
    }
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
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden space-y-6">
            {cartItems.length > 0 ? (
              <>
                {cartItems.map((item) => {
                  const productImage = item.product.Images?.length > 0 
                    ? item.product.Images[0] 
                    : "/placeholder-image.jpg"; 

                  return (
                    <Card key={item._id} className="border-b border-gray-200 flex items-center p-4">
                      <img src={productImage} alt={item.product.Name} className="w-24 h-24 object-cover rounded-lg mr-4" />
                      <div className="flex-1">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle>{item.product.Name}</CardTitle>
                            <div className="flex space-x-4">
                              <button onClick={() => updateQuantity(item._id, -1)} className="p-2 bg-gray-200 rounded-full">
                                <Minus size={16} />
                              </button>
                              <span className="font-semibold text-gray-700">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item._id, 1)} className="p-2 bg-gray-200 rounded-full">
                                <Plus size={16} />
                              </button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex justify-between">
                            <CardDescription>
                              <div>Price per item: ₹{item.product.Price.toLocaleString()}</div>
                              <div>Total: ₹{(item.product.Price * item.quantity).toLocaleString()}</div>
                            </CardDescription>
                            <div>
                              <button onClick={() => removeFromCart(item._id)} className="px-4 py-2 bg-red-500 text-white rounded-lg">
                                <Trash2 size={16} /> Remove
                              </button>
                            </div>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  );
                })}

                {/* Updated Total Price Section */}
                <div className="text-right p-6">
                <h2 className="text-2xl font-semibold text-gray-800">
  Total: ₹{(totalCartPrice || 0).toLocaleString()}
</h2>


                </div>
              </>
            ) : (
              <div className="text-center py-4">Your cart is empty</div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ShoppingCart;
