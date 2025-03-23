const express = require('express');
const UserController = require('../controllers/UserController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

const router = express.Router();
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;

router.post('/oauth/:provider', UserController.oauth);
router.post('/login', UserController.loginUser);
router.post('/register', UserController.registerUser);
router.post('/logout', UserController.logoutUser);
router.get('/getuserdetails',authenticateToken, UserController.getUserDetails); // Get users
router.get('/current',authenticateToken, UserController.getcurrentuser); // Get users
router.post('/', UserController.createUser); // Create User
router.get('/', UserController.getusers); // Get users
router.get('/:id', UserController.getUser); // Get User by ID
router.put("/updateuser", authenticateToken, UserController.updateUser);
router.delete('/:id', UserController.deleteUser); // Delete User

module.exports = router;
