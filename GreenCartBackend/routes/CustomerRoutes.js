const express = require('express');
const CustomerController = require('../controllers/CustomerController');

const router = express.Router();

router.post('/', CustomerController.createCustomer); // Create Customer
router.get('/', CustomerController.getCustomers); // Get Customers
router.get('/:id', CustomerController.getCustomer); // Get Customer by ID
router.put('/:id', CustomerController.updateCustomer); // Update Customer
router.delete('/:id', CustomerController.deleteCustomer); // Delete Customer

module.exports = router;
