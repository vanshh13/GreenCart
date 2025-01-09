const CartItem = require('../models/CartItem');
const ShoppingCart = require('../models/ShoppingCart');
// Create a Cart Item
exports.createCartItem = async (req, res) => {
  try {
    const cartItem = new CartItem(req.body);
    await cartItem.save();
    res.status(201).json({ message: 'Cart item added successfully', cartItem });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Read Cart Items by ID
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

    // Find the CartItem to delete
    const cartItem = await CartItem.findById(cartItemId);
    if (!cartItem) return res.status(404).json({ message: 'Cart item not found' });
    console.log(cartItem);
    // Find the ShoppingCart containing this CartItem
    const shoppingCart = await ShoppingCart.findOneAndUpdate(
      { cartItems: cartItem._id },
      { $pull: { cartItems: cartItem._id } },
      { new: true }
    );

    console.log(shoppingCart);
    if (!shoppingCart) {
      return res.status(404).json({ message: 'Associated shopping cart not found' });
    }

    // Delete the CartItem
    await cartItem.deleteOne();

    res.status(200).json({ message: 'Cart item deleted successfully', shoppingCart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



exports.getCartItems = async (req, res) => {
  try {
    const cartItems = await CartItem.find();
    if (!cartItems) return res.status(404).json({ message: 'Cart items not found' });
    res.status(200).json(cartItems);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};