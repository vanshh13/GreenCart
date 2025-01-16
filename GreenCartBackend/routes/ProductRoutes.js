const express = require('express');
const ProductController = require('../controllers/ProductController');

// const router = express.Router();

// router.post('/', ProductController.createProduct); // Create Product
// router.get('/', ProductController.getAllProducts); // Get All Products
// router.get('/:id', ProductController.getProduct); // Get Product by ID
// router.put('/:id', ProductController.updateProduct); // Update Product
// router.delete('/:id', ProductController.deleteProduct); // Delete Product



const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', ProductController.getAllProducts); // Get All Products
router.get('/:id', ProductController.getProduct); // Get Product by ID

router.use(authenticateToken);

router.post('/', authorizeRole('Admin'), ProductController.createProduct); // Create Product
router.put('/:id', authorizeRole('Admin'), ProductController.updateProduct); // Update Product
router.delete('/:id', authorizeRole('Admin'), ProductController.deleteProduct); // Delete Product


module.exports = router;