import React, { useState } from 'react';
import { Minus, Plus, X } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { NavLink } from 'react-router-dom';

const ShoppingCart = () => {
  const [cartItems, setCartItems] = useState([
   
  ]);

  const updateQuantity = (itemId, change) => {
    setCartItems(items =>
      items.map(item =>
        item.id === itemId ? { ...item, quantity: Math.max(1, item.quantity + change) } : item
      )
    );
  };

  const removeItem = (itemId) => {
    setCartItems(items => items.filter(item => item.id !== itemId));
  };

  const calculateSubtotal = () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <h2 className="text-2xl font-semibold mb-4">Shopping Cart</h2>
        <div className="space-y-4">
          {cartItems.map(item => (
            <Card key={item.id}>
              <CardContent className="p-4 flex items-center">
                <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-lg" />
                <div className="ml-4 flex-grow">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-gray-600">${item.price.toFixed(2)}</p>
                  <div className="flex items-center mt-2">
                    <button onClick={() => updateQuantity(item.id, -1)}><Minus /></button>
                    <span className="mx-4">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)}><Plus /></button>
                  </div>
                </div>
                <button onClick={() => removeItem(item.id)}><X /></button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
