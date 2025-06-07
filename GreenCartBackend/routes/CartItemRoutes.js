const express = require('express');
const CartItemController = require('../controllers/CartItemController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/addtocart',authenticateToken, authorizeRole("Customer"),CartItemController.addToCart);
router.post('/',authenticateToken, authorizeRole("Customer"),  CartItemController.createCartItem); // Create Cart Item
router.get('/', authenticateToken, authorizeRole("Customer","Admin"),CartItemController.getCartItem); // Get Cart Item by ID
router.put('/:id', authenticateToken, authorizeRole("Customer"), CartItemController.updateCartItem); // Update Cart Item
router.delete('/:id', authenticateToken,authorizeRole("Customer"),CartItemController.deleteCartItem); // Delete Cart Item

module.exports = router;
