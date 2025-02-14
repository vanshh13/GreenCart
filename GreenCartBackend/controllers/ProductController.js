const Product = require('../models/Product');
const { v2: cloudinary   } = require("cloudinary");

// Create a Product
exports.createProduct = async (req, res) => {
  try {
    const { Name, Description, Price, Available, Stock, Rating, Category, SubCategory } = req.body;
    console.log("Product Data Received:", req.body);

    // 🔹 Validate required fields
    if (!Name || !Description || !Price || !Available || !Stock || !Category || !SubCategory) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // 🔹 Upload Images to Cloudinary with Debugging
    const imageUrls = [];
    if (req.files && req.files.length > 0) {
      console.log("Uploading Images to Cloudinary...");
      for (const file of req.files) {
        try {
          const result = await cloudinary.uploader.upload(file.path, { folder: "GreenCart" });
          console.log("Image uploaded:", result.secure_url);
          imageUrls.push(result.secure_url);
        } catch (uploadError) {
          console.error("Cloudinary Upload Error:", uploadError);
          return res.status(500).json({ error: "Failed to upload image to Cloudinary." });
        }
      }
    } else {
      console.warn("No images provided for upload.");
    }

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

// // Update a Product
// exports.updateProduct = async (req, res) => {
//   try {
//     let updateFields = { ...req.body };

//     // Ensure numbers are correctly formatted
//     if (updateFields.Price) updateFields.Price = Number(updateFields.Price);
//     if (updateFields.Stock) updateFields.Stock = Number(updateFields.Stock);
//     if (updateFields.Rating) updateFields.Rating = Number(updateFields.Rating);
    
//     // Convert Available to Boolean
//     if (updateFields.Available !== undefined) {
//       updateFields.Available = updateFields.Available === "true";
//     }

//     // Handle new images if uploaded
//     if (req.files && req.files.length > 0) {
//       updateFields.Images = req.files.map(file => file.path); // Store file paths
//     }

//     const product = await Product.findByIdAndUpdate(req.params.id, updateFields, { new: true });

//     if (!product) return res.status(404).json({ message: 'Product not found' });

//     res.status(200).json({ message: 'Product updated successfully', product });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// // Delete a Product
// exports.deleteProduct = async (req, res) => {
//   try {
//     console.log("Deleting product with ID:", req.params.id);
//     const product = await Product.findById(req.params.id);
    
//     if (!product) {
//       console.error("Product not found:", req.params.id);
//       return res.status(404).json({ message: 'Product not found' });
//     }

//     // Delete images from the server
//     if (product.Images && product.Images.length > 0) {
//       product.Images.forEach(imagePath => {
//         try {
//           const filePath = path.join(__dirname, '..', imagePath);
//           if (fs.existsSync(filePath)) {
//             fs.unlinkSync(filePath); // Remove file
//             console.log("Deleted image:", filePath);
//           } else {
//             console.warn("Image not found:", filePath);
//           }
//         } catch (err) {
//           console.error("Error deleting image:", imagePath, err);
//         }
//       });
//     }

//     await Product.findByIdAndDelete(req.params.id);
//     console.log("Product deleted successfully:", req.params.id);
    
//     res.status(200).json({ message: 'Product and images deleted successfully' });
//   } catch (error) {
//     console.error("Server Error:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let updateFields = { ...req.body };

    // 🔹 Ensure numbers are correctly formatted
    if (updateFields.Price) updateFields.Price = Number(updateFields.Price);
    if (updateFields.Stock) updateFields.Stock = Number(updateFields.Stock);
    if (updateFields.Rating) updateFields.Rating = Number(updateFields.Rating);
    
    // 🔹 Convert Available to Boolean
    if (updateFields.Available !== undefined) {
      updateFields.Available = updateFields.Available === "true";
    }

    // 🔹 Handle Image Uploads (Only if new images are provided)
    if (req.files && req.files.length > 0) {
      console.log("Uploading New Images to Cloudinary...");

      // Delete Old Images from Cloudinary
      if (product.Images && product.Images.length > 0) {
        console.log("Deleting old images from Cloudinary...");
        for (const imageUrl of product.Images) {
          try {
            const publicId = imageUrl.split('/').pop().split('.')[0]; // Extract public ID
            await cloudinary.uploader.destroy(`GreenCart/${publicId}`);
            console.log("Deleted Image:", publicId);
          } catch (err) {
            console.error("Error deleting image:", imageUrl, err);
          }
        }
      }

      // 🔹 Upload New Images to Cloudinary
      const imageUrls = [];
      for (const file of req.files) {
        try {
          const result = await cloudinary.uploader.upload(file.path, { folder: "GreenCart" });
          console.log("Image uploaded:", result.secure_url);
          imageUrls.push(result.secure_url);
        } catch (uploadError) {
          console.error("Cloudinary Upload Error:", uploadError);
          return res.status(500).json({ error: "Failed to upload image to Cloudinary." });
        }
      }
      updateFields.Images = imageUrls;
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateFields, { new: true });

    res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
  } catch (error) {
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
    
    res.status(200).json({ message: "Product and images deleted successfully" });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
};