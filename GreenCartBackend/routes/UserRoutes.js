const express = require('express');
const UserController = require('../controllers/UserController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

const router = express.Router();
router.post('/oauth/:provider', UserController.oauth);
router.post('/login', UserController.loginUser);
router.post('/register', UserController.registerUser);
router.post('/logout', UserController.logoutUser);
router.post('/', UserController.createUser); // Create User
router.get('/', UserController.getusers); // Get users
router.get('/:id', UserController.getUser); // Get User by ID
router.put('/:id', UserController.updateUser); // Update User
router.delete('/:id', UserController.deleteUser); // Delete User

module.exports = router;
