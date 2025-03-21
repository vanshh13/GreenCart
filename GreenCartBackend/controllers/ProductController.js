const Product = require('../models/Product');
const { v2: cloudinary   } = require("cloudinary");
const Notification = require("../models/NotificationModel");

// Create a Product
exports.createProduct = async (req, res) => {
  try {
    const { Name, Description, Price, Available, Stock, Rating, Category, SubCategory } = req.body;
    console.log("Product Data Received:", req.body);

    // 🔹 Validate required fields
    if (!Name || !Description || !Price || !Available || !Stock || !Category || !SubCategory) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // ✅ Use Multer's direct Cloudinary URLs (No manual upload needed!)
    const imageUrls = req.files?.map(file => file.path) || [];

    // 🔹 Create new product
    const product = new Product({
      Name,
      Description,
      Price,
      Available: Available === "true",
      Stock,
      Images: imageUrls,
      Rating: Rating || 0,
      Category,
      SubCategory
    });

    await product.save();
    
    // Create a new notification for the admin
    await Notification.create({
      message: `New product added: ${product.Name}`,
      type: "new_product",
      actionBy: req.user.id,
    });
    res.status(201).json({ message: "✅ Product created successfully!", product });

  } catch (error) {
    console.error("🚨 Product Creation Error:", error);
    res.status(500).json({ error: "Failed to create product due to server issue." });
  }
};

// Read All Products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Read a Product by ID
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Unauthorized access." });

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let updateFields = { ...req.body };

    console.log("Incoming update request:", req.body);

    // 🔹 Check which images are being removed
    const existingImages = product.Images || []; // Old images
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
      updateFields.Images = [...newImages, ...uploadedImages];
    }

    console.log("Final images:", updateFields.Images);

    // 🔹 Update Product in Database
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateFields, { new: true });
    // Create a new notification for the admin
    await Notification.create({
      message: `Product updated: ${product.Name} details have been modified.`,
      type: "update_product",
      actionBy: req.user.id,
    });
    
    res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ error: "Failed to update product" });
  }
};



// Delete a Product (Also deletes images from Cloudinary)
exports.deleteProduct = async (req, res) => {
  try {
    console.log("🗑️ Deleting product with ID:", req.params.id);
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      console.error("Product not found:", req.params.id);
      return res.status(404).json({ message: "Product not found" });
    }

    // 🔹 Delete images from Cloudinary
    if (product.Images && product.Images.length > 0) {
      console.log("🗑️ Deleting images from Cloudinary...");
      for (const imageUrl of product.Images) {
        try {
          const publicId = imageUrl.split('/').pop().split('.')[0]; // Extract public ID
          await cloudinary.uploader.destroy(`GreenCart/${publicId}`);
          console.log("Image deleted:", publicId);
        } catch (err) {
          console.error("Error deleting image:", imageUrl, err);
        }
      }
    }

    await Product.findByIdAndDelete(req.params.id);
    console.log("Product deleted successfully:", req.params.id);
    // Create a new notification for the admin
    await Notification.create({
      message: `Product deleted: "${product.Name}" has been removed from the catalog.`,
      type: "product_deleted",
      actionBy: req.user.id,
    });

    res.status(200).json({ message: "Product and images deleted successfully" });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
};

// 🔹 Get Products by Category
exports.getProductsByCategory = async (req, res) => {
  try {
    const category = req.params.category;

    if (!category) {
      return res.status(400).json({ error: "Category is required" });
    }

    // 🔹 Fetch products including images
    const products = await Product.find(
      { Category: { $regex: new RegExp(category, "i") } },
      "Name Description Price Images Stock Rating Category SubCategory"
    );

    if (products.length === 0) {
      return res.status(404).json({ message: "No products found for this category." });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(500).json({ error: "Server error while fetching products by category" });
  }
};


