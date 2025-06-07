const express = require('express');
const OrderController = require('../controllers/OrderController');
const { authenticateToken, authorizeRole , authorizeAdmin} = require('../middleware/authMiddleware');

const router = express.Router();
router.get('/user', authenticateToken,authorizeRole('Customer'), OrderController.getOrderByUser);
router.get("/with-details", OrderController.getAllOrdersWithDetails);
router.post('/', authenticateToken, authorizeRole('Customer'), OrderController.createOrder); // Create an Order
router.get('/', OrderController.getOrders); // Get orders
router.get('/tracking/:orderId/', authenticateToken,authorizeRole('Customer'), OrderController.OrderTracking);
router.get('/:id', OrderController.getOrder); // Get a specific Order by ID
router.put('/:orderId',authenticateToken, OrderController.updateOrderStatus); // Update Order Status (e.g., none, confirmed, delivered)
router.delete('/:id', authenticateToken, OrderController.deleteOrder);// Delete an Order

module.exports = router;
