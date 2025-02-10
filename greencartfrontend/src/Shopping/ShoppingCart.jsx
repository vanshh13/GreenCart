import React, { useState } from 'react';
import { Minus, Plus, X, CreditCard, Truck } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { NavLink } from 'react-router-dom';

const ShoppingCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('');

  const updateQuantity = (itemId, change) => {
    setCartItems(items => 
      items.map(item => 
        item.id === itemId 
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const removeItem = (itemId) => {
    setCartItems(items => items.filter(item => item.id !== itemId));
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const shipping = subtotal > 50 ? 0 : 5.99;
    return subtotal + shipping;
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 min-h-[400px]">
        <img
          src="/api/placeholder/200/200"
          alt="Empty Cart"
          className="w-32 h-32 mb-4"
        />
        <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
        <p className="text-gray-600 mb-4">Add some products to your cart and they will show up here</p>
        <NavLink to="/home">
        <button 
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
          Continue Shopping
        </button>
        </NavLink>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Cart Items */}
      <div className="lg:col-span-2">
        <h2 className="text-2xl font-semibold mb-4">Shopping Cart</h2>
        <div className="space-y-4">
          {cartItems.map(item => (
            <Card key={item.id}>
              <CardContent className="p-4 flex items-center">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="ml-4 flex-grow">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-gray-600">${item.price.toFixed(2)}</p>
                  <div className="flex items-center mt-2">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="mx-4">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-600 hover:text-red-700 mt-2"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Cart Summary and Payment */}
      <div>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{calculateSubtotal() > 50 ? 'Free' : '$5.99'}</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Payment Options */}
            <div className="mt-6">
              <h4 className="font-semibold mb-3">Payment Method</h4>
              <div className="space-y-3">
                <button
                  onClick={() => setPaymentMethod('cod')}
                  className={`w-full p-3 border rounded-lg flex items-center ${
                    paymentMethod === 'cod' ? 'border-green-600' : ''
                  }`}
                >
                  <Truck className="h-5 w-5 mr-2" />
                  Cash on Delivery
                </button>
                <button
                  onClick={() => setPaymentMethod('online')}
                  className={`w-full p-3 border rounded-lg flex items-center ${
                    paymentMethod === 'online' ? 'border-green-600' : ''
                  }`}
                >
                  <CreditCard className="h-5 w-5 mr-2" />
                  Online Payment
                </button>
              </div>
            </div>

            <button
              className="w-full bg-green-600 text-white py-3 rounded-lg mt-6 hover:bg-green-700"
              onClick={() => {/* Handle checkout */}}
            >
              Proceed to Checkout
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ShoppingCart;