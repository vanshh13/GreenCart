const express = require('express');
const ProductController = require('../controllers/ProductController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');
const { v2 : cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

const router = express.Router();

// 🔹 Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 🔹 Configure Multer with Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "GreenCart", // Change folder name as needed
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

const upload = multer({ storage });

// 🔹 Create Product with Image Upload (Max 5 Images)
router.post("/", upload.array("images", 5), ProductController.createProduct);

router.get("/", ProductController.getAllProducts); // Get All Products
router.get("/:id", ProductController.getProduct); // Get Product by ID

router.put("/:id", authenticateToken, authorizeRole("Admin"), ProductController.updateProduct); // Update Product
router.delete("/:id", authenticateToken, authorizeRole("Admin"), ProductController.deleteProduct); // Delete Product

module.exports = router;
