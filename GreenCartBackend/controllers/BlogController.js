const Blog = require("../models/Blog");

// ✅ Create a new blog post with image upload
exports.createBlog = async (req, res) => {
  console.log("hii");
  try {
    console.log("hii");

    const { title, description } = req.body;
    const userId = req.user.id; // Extracted from token via authMiddleware

    // Ensure images are uploaded
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map((file) => `/uploads/${file.filename}`);
    }

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    const newBlog = new Blog({ title, description, userId, images });
    await newBlog.save();

    res.status(201).json({ message: "Blog created successfully", blog: newBlog });
  } catch (error) {
    res.status(500).json({ message: "Error creating blog", error: error.message });
  }
};

// ✅ Get all blog posts
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate("userId", "name email");
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching blogs", error: error.message });
  }
};

// ✅ Delete a blog (Only Admin)
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting blog", error: error.message });
  }
};
