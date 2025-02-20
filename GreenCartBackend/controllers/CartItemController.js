const CartItem = require('../models/CartItem');
const ShoppingCart = require('../models/ShoppingCart');
const Product = require('../models/Product'); // Ensure Product model is imported
const jwt = require('jsonwebtoken');

// Create a Cart Item and Add to Shopping Cart
// exports.createCartItem = async (req, res) => {
//   try {

//     const { product, quantity, totalPrice } = req.body;
//     const userId = req.user._id;  // Ensure user info is set in req.user

//     console.log('User ID:', userId);  // Log to ensure the user ID is populated

//     if (!product || !quantity || !totalPrice) {
//       return res.status(400).json({ error: "Missing required fields" });
//     }

//     // Check if user already has a shopping cart
//     let shoppingCart = await ShoppingCart.findOne({ user: userId });

//     if (!shoppingCart) {
//       // If no cart exists, create a new shopping cart
//       shoppingCart = new ShoppingCart({
//         user: userId,
//         cartItems: [],
//         totalPrice: 0,
//       });
//       await shoppingCart.save();
//     }

//     // Create the CartItem from request body
//     const productDetails = await Product.findById(product);  // Assuming product contains the product ID

//     if (!productDetails) return res.status(404).json({ message: "Product not found" });

//     // Calculate the total price for this cart item
//     totalPrice = productDetails.Price * quantity;
    
//     const cartItem = new CartItem({
//       product: product,
//       quantity: quantity,
//       totalPrice: totalPrice,
//     });

//     await cartItem.save();

//     // Add the new cartItem to the shoppingCart
//     shoppingCart.cartItems.push(cartItem._id);
//     shoppingCart.totalPrice += totalPrice;

//     // Save the updated shoppingCart
//     await shoppingCart.save();

//     // Return the updated shopping cart
//     res.status(201).json({ message: "Item added to cart successfully", shoppingCart });
//   } catch (error) {
//     console.error("Error creating cart item:", error);
//     res.status(500).json({ error: "Failed to add item to cart" });
//   }
// };
exports.createCartItem = async (req, res) => {
  try {
    const { product, quantity, totalPrice } = req.body;
    const userId = req.user._id; // Ensure user info is set in req.user

    console.log('User ID:', userId); // Log to ensure the user ID is populated

    // Validate required fields
    if (!product || !quantity || !totalPrice) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Create the cart item with user info
    const newCartItem = new CartItem({
      product,
      quantity,
      totalPrice,
      user: userId,  // Attach the user's ID here
    });

    // Save the cart item to the database
    const savedCartItem = await newCartItem.save();

    // Check if a shopping cart already exists for the user
    let shoppingCart = await ShoppingCart.findOne({ user: userId });

    if (shoppingCart) {
      // If a shopping cart exists, add the cart item ID to the shopping cart
      shoppingCart.cartItems.push(savedCartItem._id);
      await shoppingCart.save();
    } else {
      // If no shopping cart exists, create a new shopping cart and store the cart item ID
      shoppingCart = new ShoppingCart({
        user: userId,
        cartItems: [savedCartItem._id], // Initialize with the first cart item
      });
      await shoppingCart.save();
    }

    // Respond with the saved cart item
    res.status(201).json(savedCartItem);

  } catch (error) {
    console.error("Error creating cart item:", error);
    res.status(500).json({ error: error.message });
  }
};

// Read a Cart Item
exports.getCartItem = async (req, res) => {
  try {
    // Step 1: Get the authenticated user's ID
    const userId = req.user.id;
    
    // Step 2: Find the shopping cart associated with this user and populate cartItems and product
    const shoppingCart = await ShoppingCart.findOne({ user: userId })
      .populate({
        path: 'cartItems',
        populate: {
          path: 'product',
          model: 'Product',
        },
      });

    // Step 3: If no shopping cart exists for the user, return an empty array
    if (!shoppingCart) {
      return res.status(404).json({ message: 'No shopping cart found for this user', cartItems: [] });
    }

    // Step 4: Return all cart items with populated product details
    res.status(200).json({ cartItems: shoppingCart.cartItems });

  } catch (error) {
    console.error("Error fetching cart items:", error);
    res.status(500).json({ error: error.message });
  }
};

// Update Cart Item (Quantity & Total Price)
exports.updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;

    // Fetch cart item and populate product details
    const cartItem = await CartItem.findById(req.params.id).populate("product");

    if (!cartItem) {
      console.error("Cart item not found:", req.params.id);
      return res.status(404).json({ message: "Cart item not found" });
    }

    // Update quantity and total price
    cartItem.quantity = quantity;
    cartItem.totalPrice = cartItem.product.Price * quantity;
    await cartItem.save();

    // Update total price in shopping cart
    const shoppingCart = await ShoppingCart.findOne({ cartItems: cartItem._id });
    if (shoppingCart) {
      shoppingCart.totalPrice = await calculateCartTotal(shoppingCart._id);
      await shoppingCart.save();
    }

    res.status(200).json({ message: "Cart item updated", cartItem, shoppingCart });
  } catch (error) {
    console.error("Update cart item error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Delete a Cart Item and Update Shopping Cart
exports.deleteCartItem = async (req, res) => {
  try {
    const cartItemId = req.params.id;

    // Find the cart item by ID
    const cartItem = await CartItem.findById(cartItemId);
    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    // Find the shopping cart
    const shoppingCart = await ShoppingCart.findOne({ cartItems: cartItem._id });
    if (shoppingCart) {
      // Remove the cart item from shopping cart
      shoppingCart.cartItems = shoppingCart.cartItems.filter(id => id.toString() !== cartItemId);
      shoppingCart.totalPrice = await calculateCartTotal(shoppingCart._id); // Recalculate total
      await shoppingCart.save();
    }

    // Delete the cart item
    await cartItem.deleteOne();
    res.status(200).json({ message: "Cart item deleted successfully", shoppingCart });
  } catch (error) {
    console.error("Error deleting cart item:", error);
    res.status(500).json({ error: error.message });
  }
};

// Helper function to recalculate total price
const calculateCartTotal = async (cartId) => {
  const cart = await ShoppingCart.findById(cartId).populate({
    path: "cartItems",
    populate: { path: "product" },
  });

  if (!cart) return 0;

  return cart.cartItems.reduce((sum, item) => sum + item.product.Price * item.quantity, 0);
};


exports.addToCart = async (req, res) => {
  const userId = req.user.id;
  const { productId, quantity } = req.body;

  try {
    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Ensure product.Price is a valid number
    if (!product.Price || isNaN(product.Price)) {
      return res.status(400).json({ message: "Invalid product price" });
    }

    const productPrice = parseFloat(product.Price); // Convert to number
    const totalPrice = productPrice * quantity; 

    // Check if the user already has a shopping cart
    let shoppingCart = await ShoppingCart.findOne({ user: userId }).populate("cartItems");

    if (!shoppingCart) {
      // Create a new shopping cart for the user
      shoppingCart = new ShoppingCart({
        user: userId,
        cartItems: [],
        totalPrice: 0,
      });
      await shoppingCart.save();
    }

    // Check if the product is already in the cart
    let cartItem = shoppingCart.cartItems.find(
      (item) => item.product.toString() === productId
    );

    if (cartItem) {
      // Ensure totalPrice and quantity are valid numbers before updating
      cartItem.quantity = (cartItem.quantity || 0) + quantity;
      cartItem.totalPrice = (cartItem.totalPrice || 0) + totalPrice;
      await cartItem.save();
    } else {
      // Create new CartItem
      cartItem = new CartItem({
        product: productId,
        quantity,
        totalPrice,
        shoppingCart: shoppingCart._id,
      });

      await cartItem.save();
      shoppingCart.cartItems.push(cartItem._id);
    }

    // Recalculate total price correctly
    const updatedCartItems = await CartItem.find({ shoppingCart: shoppingCart._id });
    shoppingCart.totalPrice = updatedCartItems.reduce((sum, item) => sum + (item.totalPrice || 0), 0);

    await shoppingCart.save();

    return res.status(200).json({ message: "Item added to cart", shoppingCart });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return res.status(500).json({ message: error.message });
  }
};
