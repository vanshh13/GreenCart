const express = require('express');
const AdminController = require('../controllers/AdminController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/',authenticateToken, authorizeRole('Admin'), AdminController.createAdmin); // Create Admin
router.get('/',authenticateToken, authorizeRole('Admin'), AdminController.getAdmins); // Get Admins
router.get('/:id',authenticateToken, authorizeRole('Admin'), AdminController.getAdmin); // Get Admin by ID
router.put('/:id',authenticateToken, authorizeRole('Admin'), AdminController.updateAdmin); // Update Admin
router.delete('/:id',authenticateToken, authorizeRole('Admin'), AdminController.deleteAdmin); // Delete Admin

module.exports = router;
