const ShoppingCart = require('../models/ShoppingCart');
const CartItem = require('../models/CartItem');


// Create a Shopping Cart
exports.createShoppingCart = async (req, res) => {
  try {
    const shoppingCart = new ShoppingCart(req.body);
    await shoppingCart.save();
    res.status(201).json({ message: 'Shopping cart created successfully', shoppingCart });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Read a Shopping Cart by User ID
exports.getShoppingCart = async (req, res) => {
  try {
    const shoppingCart = await ShoppingCart.findOne({ user: req.params.userId }).populate('cartItems.product');
    if (!shoppingCart) return res.status(404).json({ message: 'Shopping cart not found' });
    res.status(200).json(shoppingCart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a Shopping Cart
exports.updateShoppingCart = async (req, res) => {
  try {
    const shoppingCart = await ShoppingCart.findOneAndUpdate(
      { user: req.params.userId },
      req.body,
      { new: true }
    );
    if (!shoppingCart) return res.status(404).json({ message: 'Shopping cart not found' });
    res.status(200).json({ message: 'Shopping cart updated successfully', shoppingCart });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a Shopping Cart
exports.deleteShoppingCart = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find the ShoppingCart
    const shoppingCart = await ShoppingCart.findOne({ user: userId });
    if (!shoppingCart) {
      return res.status(404).json({ message: 'Shopping cart not found for the user' });
    }
    console.log('ShoppingCart:', shoppingCart);

    // Debug: Log cartItems array
    console.log('CartItems to delete:', shoppingCart.cartItems);

    // Delete associated CartItems
    const deleteResult = await CartItem.deleteMany({ _id: { $in: shoppingCart.cartItems } });
    console.log('Delete Result:', deleteResult);

    // Delete the ShoppingCart
    await shoppingCart.deleteOne();

    res.status(200).json({ message: 'Shopping cart and associated items deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



exports.getShoppingCarts = async (req, res) => {
  try {
    const shoppingCarts = await ShoppingCart.find({ user: req.params.userId }).populate('cartItems.product');
    if (!shoppingCarts) return res.status(404).json({ message: 'Shopping carts not found' });
    res.status(200).json(shoppingCart);
  }
  catch(error)
  {
    res.status(400).jason({error: error.message});
  }
};