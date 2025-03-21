const Blog = require('../models/Blog');
const { v2: cloudinary } = require("cloudinary");
const User = require('../models/User');
const mongoose = require("mongoose");
const multer = require("multer");
const Notification = require("../models/NotificationModel");

// Create a Blog
exports.createBlog = async (req, res) => { 
  try {
    const { userId, title, description, datePublished } = req.body;
    if (!title || !description) {
      return res.status(400).json({ error: "Title and description are required." });
    }

    const publishedDate = datePublished ? new Date(datePublished) : new Date();
    const imageUrls = req.files?.map(file => file.path) || []; // ✅ Get direct Cloudinary URLs

    const blog = new Blog({ title, description, userId, datePublished: publishedDate, images: imageUrls });

    await blog.save();

    // Create a new notification for the admin
    await Notification.create({
      message: `New blog added: "${blog.title}" has been published.`,
      type: "new_blog",
      actionBy: req.user.id,
    });
    
    res.status(201).json({ message: "✅ Blog created successfully!", blog });

  } catch (error) {
    console.error("🚨 Blog Creation Error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};
  
// Read All Blogs
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.status(200).json(blogs);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Read a Blog by ID
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.status(200).json(blog);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a Blog
exports.updateBlog = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Unauthorized access." });

    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    let updateFields = { ...req.body };

    console.log("Incoming update request:", req.body);

    // 🔹 Check which images are being removed
    const existingImages = blog.images || []; // Old images
    const newImages = req.body.images || []; // New images from frontend

    // Identify images to delete (Old images that are NOT in newImages)
    const imagesToDelete = existingImages.filter(img => !newImages.includes(img));

    // 🔹 Delete Old Images from Cloudinary
    if (imagesToDelete.length > 0) {
      console.log("Deleting old images:", imagesToDelete);
      for (const imageUrl of imagesToDelete) {
        try {
          const publicId = imageUrl.split('/').pop().split('.')[0]; // Extract public ID
          await cloudinary.uploader.destroy(`GreenCart/${publicId}`);
          console.log("Deleted Image:", publicId);
        } catch (err) {
          console.error("Error deleting image:", imageUrl, err);
        }
      }
    }

    // 🔹 Handle New Image Uploads (Only if new files are provided)
    if (req.files && req.files.length > 0) {
      console.log("Uploading New Images to Cloudinary...");
      const uploadedImages = [];

      for (const file of req.files) {
        try {
          const result = await cloudinary.uploader.upload(file.path, { folder: "GreenCart" });
          console.log("Image uploaded:", result.secure_url);
          uploadedImages.push(result.secure_url);
        } catch (uploadError) {
          console.error("Cloudinary Upload Error:", uploadError);
          return res.status(500).json({ error: "Failed to upload image to Cloudinary." });
        }
      }

      // 🔹 Merge existing images with newly uploaded images
      updateFields.images = [...newImages, ...uploadedImages];
    }

    console.log("Final images:", updateFields.images);

    // 🔹 Update Blog in Database
    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, updateFields, { new: true });

    // Create a notification for admin
    await Notification.create({
      message: `Blog updated: "${updatedBlog.title}" has been modified.`,
      type: "update_blog",
      actionBy: req.user.id,
    });
    res.status(200).json({ message: "Blog updated successfully", blog: updatedBlog });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ error: "Failed to update blog" });
  }
};

// Delete a Blog
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    console.log("Deleting blog:", blog);
    console.log("Blog images:", blog.images);

    if (blog.images && blog.images.length > 0) {
      console.log("Deleting images from Cloudinary...");

      for (const imageUrl of blog.images) {
        try {
          const publicId = imageUrl.split('/').pop().split('.')[0]; // Extract public ID
          await cloudinary.uploader.destroy(`GreenCart/${publicId}`);
          console.log("Deleted Image:", publicId);
        } catch (err) {
          console.error("Error deleting image:", imageUrl, err);
        }
      }
    }

    await Blog.findByIdAndDelete(req.params.id);
    // Create a new notification for the admin
    await Notification.create({
      message: `Blog deleted: "${blog.title}" has been removed from the platform.`,
      type: "blog_deleted",
      actionBy: req.user.id,
    });

    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: "Failed to delete blog" });
  }
};

//Like / Unlike a Blog
exports.likeBlog = async (req, res) => {
  try {
    const { userId } = req.body;
    const blog = await Blog.findById(req.params.id);

    if (!blog) return res.status(404).json({ message: "Blog not found" });

    if (blog.likes.includes(userId)) {
      // Unlike the blog
      blog.likes = blog.likes.filter((id) => id.toString() !== userId);
    } else {
      // Like the blog
      blog.likes.push(userId);
    }

    await blog.save();
    res.status(200).json({ message: "Like updated", likes: blog.likes.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add a Comment to a Blog
exports.commentBlog = async (req, res) => {
  try {
    const { userId, text } = req.body;
    const blog = await Blog.findById(req.params.id);

    if (!blog) return res.status(404).json({ message: "Blog not found" });

    blog.comments.push({ userId, text });
    await blog.save();

    res.status(201).json({ message: "Comment added", comments: blog.comments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Comments of a Specific Blog
exports.getComments = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('comments.userId', 'name');
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    res.status(200).json(blog.comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


