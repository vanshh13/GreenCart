const express = require('express');
const ShoppingCartController = require('../controllers/ShoppingCartController');

const router = express.Router();

router.post('/', ShoppingCartController.createShoppingCart); // Create Shopping Cart
router.get('/:userId', ShoppingCartController.getShoppingCart); // Get Shopping Cart by User ID
router.get('/:userId', ShoppingCartController.getShoppingCarts); // Get Shopping Carts by User ID
router.put('/:userId', ShoppingCartController.updateShoppingCart); // Update Shopping Cart
router.delete('/:userId', ShoppingCartController.deleteShoppingCart); // Delete Shopping Cart

module.exports = router;
