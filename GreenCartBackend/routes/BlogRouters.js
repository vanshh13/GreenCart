const express = require('express');
const BlogController = require("../controllers/GCBlogController");
const { authenticateToken, authorizeRole, authorizeAdmin} = require('../middleware/authMiddleware');
const { v2 : cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

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
const router = express.Router();

router.post("/", BlogController.createBlog);
router.get("/", BlogController.getAllBlogs);
router.get("/:id", BlogController.getBlogById);
router.put("/:id", authenticateToken, BlogController.updateBlog);
router.delete("/:id", authenticateToken, BlogController.deleteBlog);

// ✅ Like a blog post
router.put("/like/:id", authenticateToken, BlogController.likeBlog);

// ✅ Add a comment
router.post("/comment/:id", authenticateToken, BlogController.commentBlog);

// ✅ Get comments for a blog post
router.get("/comments/:id", BlogController.getComments);
module.exports = router;
