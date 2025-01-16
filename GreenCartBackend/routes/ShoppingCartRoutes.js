const express = require('express');
const ShoppingCartController = require('../controllers/ShoppingCartController');

const router = express.Router();

router.post('/', ShoppingCartController.createShoppingCart); // Create Shopping Cart
router.get('/:userId', ShoppingCartController.getShoppingCart); // Get Shopping Cart by User ID
router.get('/:userId', ShoppingCartController.getShoppingCarts); // Get Shopping Carts by User ID
router.put('/:userId', ShoppingCartController.updateShoppingCart); // Update Shopping Cart
router.delete('/:userId', ShoppingCartController.deleteShoppingCart); // Delete Shopping Cart

module.exports = router;




// const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

// const router = express.Router();
// router.use(authenticateToken);
// router.post('/', authorizeRole('Customer'), ShoppingCartController.createShoppingCart); // Create Shopping Cart
// router.get('/:userId',authorizeRole('Customer'), ShoppingCartController.getShoppingCart); // Get Shopping Cart by User ID
// router.get('/:userId',authorizeRole('Customer'), ShoppingCartController.getShoppingCarts); // Get Shopping Carts by User ID
// router.put('/:userId',authorizeRole('Customer'), ShoppingCartController.updateShoppingCart); // Update Shopping Cart
// router.delete('/:userId',authorizeRole('Customer'), ShoppingCartController.deleteShoppingCart); // Delete Shopping Cart

