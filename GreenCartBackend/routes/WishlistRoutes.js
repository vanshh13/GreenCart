const express = require("express");
const router = express.Router();
const wishlistController = require("../controllers/WishlistController");
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');


// Routes for Wishlist
router.get("/:userId", authenticateToken,wishlistController.getWishlist); // Get Wishlist by User ID
router.post("/add", authenticateToken ,wishlistController.addToWishlist); // Add to Wishlist
router.delete("/remove/:productId",authenticateToken, wishlistController.removeFromWishlist); // Remove from Wishlist

module.exports = router;
