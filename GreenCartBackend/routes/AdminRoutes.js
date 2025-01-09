const express = require('express');
const AdminController = require('../controllers/AdminController');

const router = express.Router();

router.post('/', AdminController.createAdmin); // Create Admin
router.get('/', AdminController.getAdmins); // Get Admins
router.get('/:id', AdminController.getAdmin); // Get Admin by ID
router.put('/:id', AdminController.updateAdmin); // Update Admin
router.delete('/:id', AdminController.deleteAdmin); // Delete Admin

module.exports = router;
