const CartItem = require('../models/CartItem');
const ShoppingCart = require('../models/ShoppingCart');

// Create a Cart Item
exports.createCartItem = async (req, res) => {
  try {
    console.log("Received Data:", req.body); // Log incoming request data

    const { product, quantity, totalPrice } = req.body;
    if (!product || !quantity || !totalPrice) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const cartItem = new CartItem(req.body);
    await cartItem.save();
    
    res.status(201).json({ message: "Cart item added successfully", cartItem });
  } catch (error) {
    console.error("Error creating cart item:", error); // Log errors
    res.status(400).json({ error: error.message });
  }
};
;



// Read a Cart Item
exports.getCartItem = async (req, res) => {
  try {
    const cartItem = await CartItem.findById(req.params.id).populate('product');
    if (!cartItem) return res.status(404).json({ message: 'Cart item not found' });
    res.status(200).json(cartItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a Cart Item
exports.updateCartItem = async (req, res) => {
  try {
    const cartItem = await CartItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!cartItem) return res.status(404).json({ message: 'Cart item not found' });
    res.status(200).json({ message: 'Cart item updated successfully', cartItem });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a Cart Item
exports.deleteCartItem = async (req, res) => {
  try {
    const cartItemId = req.params.id;
    console.log("Deleting Cart Item with ID:", cartItemId); // Debugging

    // Check if cartItemId is valid ObjectId
    if (!cartItemId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid cart item ID" });
    }

    // Find the cart item
    const cartItem = await CartItem.findById(cartItemId);
    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    // Remove cart item reference from ShoppingCart
    const shoppingCart = await ShoppingCart.findOneAndUpdate(
      { cartItems: cartItem._id },
      { $pull: { cartItems: cartItem._id } },
      { new: true }
    );

    // If shopping cart is not found, still allow deletion
    if (!shoppingCart) {
      console.warn("Shopping cart not found for cart item:", cartItemId);
    }

    // Delete the cart item
    await cartItem.deleteOne();

    res.status(200).json({ message: "Cart item deleted successfully", shoppingCart });
  } catch (error) {
    console.error("Error deleting cart item:", error);
    res.status(500).json({ error: error.message });
  }
};


// Get all Cart Items
exports.getCartItems = async (req, res) => {
  try {
    const cartItems = await CartItem.find();
    if (!cartItems.length) return res.status(404).json({ message: 'No cart items found' });
    res.status(200).json(cartItems);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};