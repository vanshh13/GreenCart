const express = require('express');
const CartItemController = require('../controllers/CartItemController');

const router = express.Router();

router.post('/', CartItemController.createCartItem); // Create Cart Item
router.get('/', CartItemController.getCartItems); // Get Cart Items
router.get('/:id', CartItemController.getCartItem); // Get Cart Item by ID
router.put('/:id', CartItemController.updateCartItem); // Update Cart Item
router.delete('/:id', CartItemController.deleteCartItem); // Delete Cart Item

module.exports = router;
