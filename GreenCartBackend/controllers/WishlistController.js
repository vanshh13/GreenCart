const Wishlist = require("../models/Wishlist");
const jwt = require("jsonwebtoken");
const Product = require("../models/Product");
const mongoose = require("mongoose");

// Get Wishlist Items for a User
exports.getWishlist = async (req, res) => {
  
    try {
      const userId = req.user.id; // Get authenticated user ID from req.user
  
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized. Please log in." });
      }
  
      const wishlist = await Wishlist.findOne({ userId }).populate("items.product");
  
      if (!wishlist) {
        return res.status(200).json({ items: [] }); // Return empty array if no wishlist exists
      }
  
      res.status(200).json(wishlist.items);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      res.status(500).json({ error: "Server error while fetching wishlist" });
    }
  };
  
// Add Item to Wishlist
exports.addToWishlist = async (req, res) => {
    try {
      const { productId } = req.body; // Extract product ID from request
      const userId = req.user.id; // ✅ Get authenticated user ID from JWT middleware
  
      // Check if the product exists
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      // Check if wishlist exists for the user
      let wishlist = await Wishlist.findOne({ userId });
  
      if (!wishlist) {
        wishlist = new Wishlist({ userId, items: [] });
      }
  
      // Check if product is already in wishlist
      const isAlreadyInWishlist = wishlist.items.some(
        (item) => item.product.toString() === productId
      );
  
      if (isAlreadyInWishlist) {
        return res.status(400).json({ message: "Product already in wishlist" });
      }
  
      // Add product to wishlist
      wishlist.items.push({ product: productId });
      await wishlist.save();
  
      res.status(201).json({
        message: "Product added to wishlist successfully",
        wishlist: wishlist.items,
      });
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  

// Remove Item from Wishlist

exports.removeFromWishlist = async (req, res) => {

  console.log("remove");
    try {
        const { productId } = req.params;
        const userId = req.user.id;
        console.log("remove1");

        // Ensure productId is a valid Obj
        // ectId
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ error: "Invalid product ID" });
        }

        const updatedWishlist = await Wishlist.findOneAndUpdate(
            { userId },
            { $pull: { items: { product: new mongoose.Types.ObjectId(productId) } } }, // Convert to ObjectId
            { new: true }
        );

        if (!updatedWishlist) {
            return res.status(404).json({ error: "Wishlist not found" });
        }

        return res.status(200).json({
            message: "Item removed from wishlist",
            wishlist: updatedWishlist.items, // Updated wishlist
        });
    } catch (error) {
        console.error("Error removing item from wishlist:", error);
        return res.status(500).json({ error: "Error removing item from wishlist" });
    }
};

