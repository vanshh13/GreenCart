const ShoppingCart = require('../models/ShoppingCart');
const CartItem = require('../models/CartItem'); // Assuming you have a CartItem model

// Create a new Shopping Cart
exports.createShoppingCart = async (req, res) => {
  try {
    const { user, cartItems } = req.body;

    if (!user || !cartItems || cartItems.length === 0) {
      return res.status(400).json({ error: "User and cart items are required." });
    }

    // Calculate the total price from cartItems
    const items = await CartItem.find({ '_id': { $in: cartItems } });

    if (items.length !== cartItems.length) {
      return res.status(404).json({ error: "One or more cart items not found." });
    }

    const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);

    // Create a new shopping cart for the user
    const newCart = new ShoppingCart({
      user,
      cartItems,
      totalPrice
    });

    await newCart.save();
    res.status(201).json({ message: "Shopping Cart created successfully!", cart: newCart });
  } catch (error) {
    console.error("Error creating cart:", error);
    res.status(500).json({ error: "Failed to create shopping cart." });
  }
};

// Get a Shopping Cart by User ID
exports.getShoppingCart = async (req, res) => {
  try {
    const cart = await ShoppingCart.findOne({ user: req.params.userId }).populate('cartItems');

    if (!cart) {
      return res.status(404).json({ message: "Shopping Cart not found" });
    }

    res.status(200).json(cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ error: "Failed to fetch shopping cart." });
  }
};

exports.getShoppingCarts = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find all shopping carts associated with the user
    const shoppingCarts = await ShoppingCart.find({ user: userId });

    if (!shoppingCarts || shoppingCarts.length === 0) {
      return res.status(404).json({ message: "No shopping carts found for this user" });
    }

    res.status(200).json(shoppingCarts);
  } catch (error) {
    console.error("Error retrieving shopping carts:", error);
    res.status(500).json({ error: "Failed to retrieve shopping carts" });
  }
};

// Update Shopping Cart (Add/Remove Items)
exports.updateShoppingCart = async (req, res) => {
  try {
    const cart = await ShoppingCart.findOne({ user: req.params.userId });

    if (!cart) {
      return res.status(404).json({ message: "Shopping Cart not found" });
    }

    const { cartItems } = req.body;
    if (cartItems) {
      // Find the items and calculate the new total price
      const items = await CartItem.find({ '_id': { $in: cartItems } });

      if (items.length !== cartItems.length) {
        return res.status(404).json({ error: "One or more cart items not found." });
      }

      cart.cartItems = cartItems;
      cart.totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);
    }

    cart.lastUpdated = Date.now();
    await cart.save();
    res.status(200).json({ message: "Shopping Cart updated successfully!", cart });
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ error: "Failed to update shopping cart." });
  }
};

// Delete Shopping Cart
exports.deleteShoppingCart = async (req, res) => {
  try {
    const cart = await ShoppingCart.findOne({ user: req.params.userId });

    if (!cart) {
      return res.status(404).json({ message: "Shopping Cart not found" });
    }

    await cart.remove();
    res.status(200).json({ message: "Shopping Cart deleted successfully" });
  } catch (error) {
    console.error("Error deleting cart:", error);
    res.status(500).json({ error: "Failed to delete shopping cart." });
  }
};
