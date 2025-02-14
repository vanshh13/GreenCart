const express = require('express');
const AdminController = require('../controllers/AdminController');
const { authenticateToken, authorizeRole, authorizeAdmin} = require('../middleware/authMiddleware');

const router = express.Router();
router.get('/stats', authenticateToken,AdminController.stats); // Get Stats

router.post('/',authenticateToken, authorizeRole('Admin'), AdminController.createAdmin); // Create Admin
router.get('/',authenticateToken, authorizeRole('Admin'), AdminController.getAdmins); // Get Admins
router.get('/:id',authenticateToken, authorizeRole('Admin'), AdminController.getAdmin); // Get Admin by ID
router.put('/:id',authenticateToken, authorizeAdmin,authorizeRole('Admin'), AdminController.updateAdmin); // Update Admin
router.delete('/:id',authenticateToken,authorizeAdmin, authorizeRole('Admin'), AdminController.deleteAdmin); // Delete Admin
module.exports = router;
