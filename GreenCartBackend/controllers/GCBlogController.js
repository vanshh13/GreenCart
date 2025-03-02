const Blog = require('../models/Blog');
const { v2: cloudinary } = require("cloudinary");

// Create a Blog
exports.createBlog = async (req, res) => {
    try {
      const { title, description, userId, datePublished } = req.body;
      console.log("Blog Data Received:", req.body);
  
      if (!title || !description || !userId || !datePublished) {
        return res.status(400).json({ error: "All fields are required." });
      }
  
      let imageUrls = [];
      if (req.files) {
        console.log("Uploading Images to Cloudinary...");
        for (let file of req.files) {
          const result = await cloudinary.uploader.upload(file.path, { folder: "GreenCart/Blogs" });
          console.log("Image uploaded:", result.secure_url);
          imageUrls.push(result.secure_url);
        }
      }
  
      const blog = new Blog({
        title,
        description,
        userId,
        datePublished,
        images: imageUrls,  // Assuming you want to store multiple images
      });
  
      await blog.save();
      res.status(201).json({ message: "✅ Blog created successfully!", blog });
    } catch (error) {
      console.error("🚨 Blog Creation Error:", error);
      res.status(500).json({ error: "Failed to create blog due to server issue." });
    }
  };
  
// Read All Blogs
exports.getAllBlogs = async (req, res) => {
  console.log("hello");
  try {
    console.log("hii");
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
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    let updateFields = { ...req.body };
    
    if (req.file) {
      console.log("Uploading New Image to Cloudinary...");
      if (blog.image) {
        console.log("Deleting old image from Cloudinary...");
        const publicId = blog.image.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`GreenCart/Blogs/${publicId}`);
      }
      const result = await cloudinary.uploader.upload(req.file.path, { folder: "GreenCart/Blogs" });
      console.log("New Image uploaded:", result.secure_url);
      updateFields.image = result.secure_url;
    }

    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, updateFields, { new: true });
    res.status(200).json({ message: "Blog updated successfully", blog: updatedBlog });
  } catch (error) {
    res.status(500).json({ error: "Failed to update blog" });
  }
};

// Delete a Blog
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    if (blog.image) {
      console.log("Deleting image from Cloudinary...");
      const publicId = blog.image.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`GreenCart/Blogs/${publicId}`);
    }

    await Blog.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
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


