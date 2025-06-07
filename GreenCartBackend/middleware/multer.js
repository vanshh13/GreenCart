const multer = require("multer");
const path = require("path");
const express = require('express');
const router = express.Router();// Configure storage
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

// ✅ Accept multiple images with the correct field name
router.post("/", upload.array("images", 5), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "No files uploaded" });
  }
  const imageUrls = req.files.map((file) => `/uploads/${file.filename}`);
  res.json({ imageUrls });
});

module.exports = router;
