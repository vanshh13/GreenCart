const express = require('express');
const OrderController = require('../controllers/OrderController');

const router = express.Router();


router.post('/', OrderController.createOrder); // Create an Order
router.get('/', OrderController.getOrders); // Get orders
router.get('/:id', OrderController.getOrder); // Get a specific Order by ID
router.put('/:id', OrderController.updateOrderStatus); // Update Order Status (e.g., none, confirmed, delivered)
router.delete('/:id', OrderController.deleteOrder);// Delete an Order

module.exports = router;
