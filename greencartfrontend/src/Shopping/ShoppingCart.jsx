import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart as CartIcon, Trash2, Plus, Minus, Loader2, MapPin, CreditCard } from "lucide-react";
import { toast } from "react-toastify";
import { fetchCartItems, updateCartItemQuantity, removeCartItem, confirmOrder, fetchUserAddresses, createNewAddress  } from "../api";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/Card";
import AddressModal from "../components/AddressModal";
import {Label} from "../components/ui/Label";
import {RadioGroup , RadioGroupItem} from "../components/ui/RadioButton";
const ShoppingCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalCartPrice, setTotalCartPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isOrderConfirmed, setIsOrderConfirmed] = useState(false);
  const [address, setAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false); // Modal State

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [newAddressData, setNewAddressData] = useState({
    cityVillage: "",
    pincode: "",
    state: "",
    country: "",
    streetOrSociety: "",
  });

  useEffect(() => {
    fetchData();
    fetchSavedAddresses();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetchCartItems(token);
      setCartItems(response.data.cartItems || []);

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

  const fetchSavedAddresses = async () => {
    try {
      const token = localStorage.getItem("authToken");
      // const userId = sessionStorage.getItem("userId");
      console.log("Fetching saved addresses...");
      const response = await fetchUserAddresses(token);
      
      console.log("API Response:", response.data); // Debugging line
      setSavedAddresses(response.data.addresses || []);
    } catch (error) {
      console.error("Error fetching addresses:", error.response?.data || error.message);
      toast.error("Failed to load saved addresses");
    }
  };
  
  

// ✅ Function to handle address creation
const handleCreateNewAddress = async () => {
  try {
    if (!Object.values(newAddressData).every(field => field.trim() !== "")) {
      toast.error("Please fill in all address fields.");
      return;
    }
    console.log("Creating new address:", newAddressData);
    const token = localStorage.getItem("authToken");
    const response = await createNewAddress(token, newAddressData);

    if (response.status === 201) {
      toast.success("Address created successfully!");
      setSelectedAddressId(response.data.address._id);
      setIsAddressModalOpen(false); // Close modal after saving
      fetchSavedAddresses(); // Refresh saved addresses
    }
  } catch (error) {
    console.error("Error creating address:", error);
    toast.error("Failed to create address.");
  }
};
  
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

      setTotalCartPrice(response.data.shoppingCart.totalPrice);
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Could not update item quantity.");
    }
  };

  const removeFromCart = async (id) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await removeCartItem(id, token);

      setCartItems((prevItems) => prevItems.filter((item) => item._id !== id));
      setTotalCartPrice(response.data.shoppingCart.totalPrice);

      toast.success("Item removed from cart.");
    } catch (error) {
      console.error("Error removing cart item:", error);
      toast.error("Failed to remove item.");
    }
  };

  const handleConfirmOrder = async () => {
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("authToken");
  
      if (!token) {
        toast.error("User is not authenticated. Please log in.");
        return;
      }
  
      let deliveryAddressId = selectedAddressId;
      
      if (!deliveryAddressId && newAddressData) {
        const newAddress = await createNewAddress(token, newAddressData);
        if (!newAddress?.data?.address?._id) {
          throw new Error("Failed to create new address.");
        }
        deliveryAddressId = newAddress.data.address._id;
      }
  
      if (!deliveryAddressId) {
        toast.error("Please select or create a delivery address.");
        return;
      }
  
      const orderData = {
        orderItems: cartItems.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.product.Price,
        })),
        paymentMethod: paymentMethod,
        totalPrice: totalCartPrice,
        orderStatus: "pending",
        OrderDetail: {
          deliveryAddress: deliveryAddressId, // ✅ Ensure correct field name
          totalPrice: totalCartPrice,
          tax: 0,
          discount: 0,
          finalPrice: totalCartPrice,
        },
      };
  
      const response = await confirmOrder(token, orderData);
  
      if (response?.success) {
        toast.success("Order placed successfully!");
        setIsOrderConfirmed(true);
        setCartItems([]);
        setTotalCartPrice(0);
      } else {
        throw new Error(response?.message || "Failed to create order.");
      }
    } catch (error) {
      console.error("Error creating order:", error.message);
      toast.error(error.message || "Failed to confirm order.");
    } finally {
      setIsSubmitting(false);
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
                        <div className="mt-8 space-y-6">
                        {/* Address Selection Section */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <MapPin className="text-emerald-600" />
                              Delivery Address
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <RadioGroup 
                                value={selectedAddressId} 
                                onValueChange={setSelectedAddressId}
                                className="space-y-4"
                              >
                                {savedAddresses.map((address) => (
                                  <div key={address._id} className="flex items-center space-x-2">
                                    <RadioGroupItem value={address._id} id={address._id} />
                                    <Label htmlFor={address._id}>
                                      {address.streetOrSociety}, {address.cityVillage}, {address.state} {address.pincode}
                                    </Label>
                                  </div>
                                ))}
                              </RadioGroup>
                              <button 
                                onClick={() => setIsAddressModalOpen(true)}
                                className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg"
                              >
                                Add New Address
                              </button>
                            </div>
                          </CardContent>
                        </Card>
                {cartItems.map((item) => (
                  <Card key={item._id} className="border-b border-gray-200 flex items-center p-4">
                    <img src={item.product.Images?.[0] || "/placeholder-image.jpg"} alt={item.product.Name} className="w-24 h-24 object-cover rounded-lg mr-4" />
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
                          <button onClick={() => removeFromCart(item._id)} className="px-4 py-2 bg-red-500 text-white rounded-lg">
                            <Trash2 size={16} /> Remove
                          </button>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              {/* Payment Method Selection */}
              <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="text-emerald-600" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup 
                  value={paymentMethod} 
                  onValueChange={setPaymentMethod}
                  className="space-y-4" 
                >
                  {/* Cash on Delivery */}
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Cash on Delivery" id="cash" />
                    <Label htmlFor="cash">Cash on Delivery</Label>
                  </div>

                  {/* UPI Payment */}
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="UPI" id="upi" />
                    <Label htmlFor="upi">UPI (Google Pay, PhonePe, Paytm, etc.)</Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Order Summary and Confirm Button */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹{totalCartPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span>₹{totalCartPrice.toLocaleString()}</span>
                  </div>
                  <button
                    onClick={handleConfirmOrder}
                    disabled={isSubmitting || !selectedAddressId}
                    className="w-full mt-4 px-6 py-3 bg-emerald-600 text-white rounded-lg disabled:bg-gray-400"
                  >
                    {isSubmitting ? (
                      <Loader2 className="animate-spin mx-auto" />
                    ) : (
                      "Confirm Order"
                    )}
                  </button>
                </div>
              </CardContent>
            </Card>
                <div className="p-6">
                  <h2 className="text-2xl font-semibold text-gray-800">Total: ₹{(totalCartPrice || 0).toLocaleString()}</h2>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">Your cart is empty</div>
            )}
          </div>
        )}
      </motion.div>
{/* Address Modal */}
<AddressModal 
  isOpen={isAddressModalOpen} 
  onClose={() => setIsAddressModalOpen(false)} 
  newAddressData={newAddressData} 
  setNewAddressData={setNewAddressData} 
  handleCreateNewAddress={handleCreateNewAddress} 
  onChange={(e) => setNewAddressData({ ...newAddressData, streetOrSociety: e.target.value })}
/>    </div>
  );
};

export default ShoppingCart;
