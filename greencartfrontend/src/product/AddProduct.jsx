import React, { useState, useRef } from "react";
import axios from "axios";
import { Upload, X } from "lucide-react";
import AdminNavbar from "../components/AdminNavigation";
import { motion } from "framer-motion";

const AddProduct = () => {
  const [product, setProduct] = useState({
    Name: "",
    Description: "",
    Price: "",
    Category: "",
    SubCategory: "",
    Stock: "",
    Available: "true", // Default: Available
    Rating: "0",
    Images: [],
  });

  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  // Validate Form
  const validateForm = () => {
    const newErrors = {};
    if (!product.Name) newErrors.Name = "Name is required";
    if (!product.Description) newErrors.Description = "Description is required";
    if (!product.Price) newErrors.Price = "Price is required";
    if (!product.Category) newErrors.Category = "Category is required";
    if (!product.SubCategory) newErrors.SubCategory = "SubCategory is required";
    if (!product.Stock) newErrors.Stock = "Stock is required";
    if (product.Images.length === 0) newErrors.Images = "At least one image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Input Changes
  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  // Handle Image Upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      url: URL.createObjectURL(file),
      file,
    }));

    setProduct((prev) => ({
      ...prev,
      Images: [...prev.Images, ...newImages],
    }));
  };

  // Remove Image
  const removeImage = (index) => {
    setProduct((prev) => ({
      ...prev,
      Images: prev.Images.filter((_, i) => i !== index),
    }));
  };

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const formData = new FormData();
    Object.entries(product).forEach(([key, value]) => {
      if (key === "Images") {
        value.forEach((image) => formData.append("images", image.file));
      } else {
        formData.append(key, value);
      }
    });

    try {
      const response = await axios.post("http://localhost:5000/api/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Product added successfully!");
      console.log("Product Created:", response.data);
    } catch (error) {
      console.error("Error:", error.response?.data);
      alert("Error adding product: " + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div>
    <AdminNavbar />
    <motion.div 
        initial={{ opacity: 0, y: 50 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }} 
        className="max-w-4xl mx-auto mt-24 p-6 bg-white shadow-lg rounded-lg">
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Add New Product</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        {/* Name */}
        <div>
          <label className="block font-medium">Product Name *</label>
          <input type="text" name="Name" value={product.Name} onChange={handleChange}
            className="border rounded px-3 py-2 w-full" required />
          {errors.Name && <p className="text-red-500">{errors.Name}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium">Description *</label>
          <textarea name="Description" value={product.Description} onChange={handleChange}
            className="border rounded px-3 py-2 w-full" required />
          {errors.Description && <p className="text-red-500">{errors.Description}</p>}
        </div>

        {/* Price */}
        <div>
          <label className="block font-medium">Price (₹) *</label>
          <input type="number" name="Price" value={product.Price} onChange={handleChange}
            className="border rounded px-3 py-2 w-full" required />
          {errors.Price && <p className="text-red-500">{errors.Price}</p>}
        </div>

        {/* Stock */}
        <div>
          <label className="block font-medium">Stock Quantity *</label>
          <input type="number" name="Stock" value={product.Stock} onChange={handleChange}
            className="border rounded px-3 py-2 w-full" required />
          {errors.Stock && <p className="text-red-500">{errors.Stock}</p>}
        </div>

        {/* Category */}
        <div>
          <label className="block font-medium">Category *</label>
          <input type="text" name="Category" value={product.Category} onChange={handleChange}
            className="border rounded px-3 py-2 w-full" required />
          {errors.Category && <p className="text-red-500">{errors.Category}</p>}
        </div>

        {/* SubCategory */}
        <div>
          <label className="block font-medium">SubCategory *</label>
          <input type="text" name="SubCategory" value={product.SubCategory} onChange={handleChange}
            className="border rounded px-3 py-2 w-full" required />
          {errors.SubCategory && <p className="text-red-500">{errors.SubCategory}</p>}
        </div>

        {/* Available */}
        <div>
          <label className="block font-medium">Available *</label>
          <select name="Available" value={product.Available} onChange={handleChange}
            className="border rounded px-3 py-2 w-full" required>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>

        {/* Rating */}
        <div>
          <label className="block font-medium">Rating</label>
          <input type="number" name="Rating" value={product.Rating} onChange={handleChange}
            className="border rounded px-3 py-2 w-full" min="0" max="5" />
        </div>

        {/* Image Upload */}
        <div className="col-span-2">
          <label className="block font-medium">Product Images *</label>
          <div className="grid grid-cols-5 gap-2">
            {product.Images.map((Image, index) => (
              <div key={index} className="relative">
                <img src={Image.url} alt={`Product ${index + 1}`} className="w-24 h-24 object-cover rounded-lg" />
                <button type="button" onClick={() => removeImage(index)} className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            <button type="button" onClick={() => fileInputRef.current?.click()} className="border rounded-lg p-3 flex items-center justify-center">
              <Upload className="h-6 w-6" />
            </button>
          </div>
          <input type="file" ref={fileInputRef} onChange={handleImageUpload} multiple accept="image/*" className="hidden" />
          {errors.Images && <p className="text-red-500">{errors.Images}</p>}
        </div>

        <button type="submit" className="col-span-2 bg-green-500 text-white p-2 rounded mt-4">Add Product</button>
      </form>
    </div>
    </motion.div>
    </div>
  );
};

export default AddProduct;
