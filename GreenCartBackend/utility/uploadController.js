import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer to use Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "GreenCart", // Set your folder name
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

const upload = multer({ storage });

const router = express.Router();

// Upload Route (for images)
router.post("/upload", upload.single("image"), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
  
    console.log("Uploaded File:", req.file); // Debugging
  
    res.json({ 
      imageUrl: req.file.path, // Cloudinary URL
      public_id: req.file.filename // Optional: Use for deleting images later
    });
  });
  

export default router;
