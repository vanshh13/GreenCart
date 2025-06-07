const express = require('express');
const AdminController = require('../controllers/AdminController');
const { authenticateToken, authorizeRole, authorizeAdmin} = require('../middleware/authMiddleware');

const router = express.Router();
// Fetch admin role by user ID
router.get("/role/:userId", AdminController.getAdminRole);

router.get('/stats', authenticateToken,AdminController.stats); // Get Stats
router.get("/statistics/overview/:period",authenticateToken, AdminController.getOverviewStats);
router.get("/statistics/visitors/:period", authenticateToken, AdminController.getVisitorStatistics);
router.get("/statistics/products/top", authenticateToken, AdminController.getTopSellingProducts);
router.get("/statistics/sales/payment", authenticateToken, AdminController.getSalesByPaymentMethod);
router.get("/statistics/ratings", authenticateToken, AdminController.getProductRatings);
router.get("/analytics/sales/:timeframe",authenticateToken, AdminController.getSalesData);
router.get("/analytics/products", authenticateToken,AdminController.getProductAnalytics);
router.get("/analytics/users",authenticateToken, AdminController.getUserStats);

router.post('/',authenticateToken, authorizeRole('Admin'), AdminController.createAdmin); // Create Admin
router.get('/',authenticateToken, authorizeRole('Admin'), AdminController.getAdmins); // Get Admins

// Update admin role
router.put("/:adminId/role",authenticateToken, AdminController.updateAdminRole);
router.get('/:id',authenticateToken, authorizeRole('Admin'), AdminController.getAdmin); // Get Admin by ID
router.put('/:id',authenticateToken, authorizeAdmin,authorizeRole('Admin'), AdminController.updateAdmin); // Update Admin
router.delete('/:id',authenticateToken,authorizeAdmin, authorizeRole('Admin'), AdminController.deleteAdmin); // Delete Admin
module.exports = router;
