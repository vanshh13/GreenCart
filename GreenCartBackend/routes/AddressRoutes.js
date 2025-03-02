const express = require('express');
const router = express.Router();
const addressController = require('../controllers/AddressController');
const {authenticateToken , authorizeRole} = require('../middleware/authMiddleware');
// Create a New Address
router.post('/', addressController.createAddress);

// Get All Addresses
router.get('/', addressController.getAddresses);
router.get('/user', authenticateToken, authorizeRole("Customer"), addressController.getUserAddresses);

// Get Address by ID
router.get('/:id', addressController.getAddressById);

// Update an Address
router.put('/:id', addressController.updateAddress);

// Delete an Address
router.delete('/:id', addressController.deleteAddress);
module.exports = router;
