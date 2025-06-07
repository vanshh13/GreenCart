const express = require('express');
const OrderDetailController = require('../controllers/OrderDetailController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authenticateToken,authorizeRole('Customer'), OrderDetailController.createOrderDetail); // Create Order Detail
router.get('/',OrderDetailController.getOrderDetails); // Get Order Details
router.get('/:id', OrderDetailController.getOrderDetail); // Get Order Detail by ID
router.put('/:id', OrderDetailController.updateOrderDetail); // Update Order Detail
router.delete('/:id', OrderDetailController.deleteOrderDetail); // Delete Order Detail
router.get("/order/:orderId", OrderDetailController.getOrderDetailByOrderId);

module.exports = router;
