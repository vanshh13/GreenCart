import React, { useState, useRef } from "react";
import axios from "axios";
import { Upload, X, Eye, Check, Loader2} from "lucide-react";
import AdminNavbar from "../components/AdminNavigation";
import { motion, AnimatePresence  } from "framer-motion";
import ProductCatalog from "./ProductCatalog";
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
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newProductId, setNewProductId] = useState(null);
  const [submitStatus, setSubmitStatus] = useState(null);
  const categories = ['Fruits', 'Vegetables', 'Grains', 'Dairy', 'Bakery', 'Oil & Ghee', 'Masala', 'Other'];

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

    setIsLoading(true);
    setSubmitStatus(null);

    const formData = new FormData();
    Object.entries(product).forEach(([key, value]) => {
      if (key === "Images") {
        value.forEach((image) => formData.append("images", image.file));
      } else {
        formData.append(key, value);
      }
    });

    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post("http://localhost:5000/api/products", formData, {
        headers: { 
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}` // ✅ Adding the token in the headers
        },
      });

      setNewProductId(response.data._id);
      setSubmitStatus('success');
      setTimeout(() => {
        setIsLoading(false);
        setIsPreviewModalOpen(true);
      }, 1500);
    } catch (error) {
      console.error("Error:", error.response?.data);
      setSubmitStatus('error');
      setIsLoading(false);
    }
  };

  // Preview Functionality
  const handlePreviewClick = () => {
    // Create a preview object similar to how it would be displayed
    const previewProduct = {
      ...product,
      _id: 'preview',
      Images: product.Images.map(img => img.url),
    };
    setIsPreviewModalOpen(true);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
    <AdminNavbar />
    <motion.div 
        initial={{ opacity: 0, y: 50 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }} 
        className="max-w-4xl mx-auto mt-24 p-6 bg-white shadow-lg rounded-lg">
           <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Add New Product</h2>
          <button 
            type="button"
            onClick={handlePreviewClick}
            disabled={product.Images.length === 0}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition duration-300"
          >
            <Eye className="h-5 w-5" />
            <span>Preview Product</span>
          </button>
        </div>
    <div className="max-w-4xl mx-auto p-8 bg-white">
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
        <select
          name="Category"
          value={product.Category}
          onChange={handleChange}
          className="border rounded px-3 py-2 w-full"
          required
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        
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
    {/* Loading Overlay */}
    <AnimatePresence>
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-white p-8 rounded-xl shadow-2xl text-center"
            >
              {submitStatus === null ? (
                <>
                  <Loader2 className="h-16 w-16 mx-auto text-blue-500 animate-spin mb-4" />
                  <p className="text-xl font-semibold text-gray-700">Adding Product...</p>
                </>
              ) : submitStatus === 'success' ? (
                <>
                  <Check className="h-16 w-16 mx-auto text-green-500 mb-4" />
                  <p className="text-xl font-semibold text-green-700">Product Added Successfully!</p>
                </>
              ) : (
                <>
                  <X className="h-16 w-16 mx-auto text-red-500 mb-4" />
                  <p className="text-xl font-semibold text-red-700">Failed to Add Product</p>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview Modal */}
      <AnimatePresence>
        {isPreviewModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            {newProductId ? (
              <ProductCatalog 
                productId={newProductId} 
                onClose={() => setIsPreviewModalOpen(false)} 
              />
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white max-w-4xl w-full rounded-xl overflow-hidden shadow-2xl"
              >
                <div className="grid grid-cols-2">
                  {/* Images Section */}
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-4">
                      {product.Images.map((img, index) => (
                        <img 
                          key={index} 
                          src={img.url} 
                          alt={`Product Preview ${index + 1}`} 
                          className="w-full h-48 object-cover rounded-lg shadow-md"
                        />
                      ))}
                    </div>
                  </div>
                  
                  {/* Product Details Section */}
                  <div className="p-6 bg-gray-50">
                    <h2 className="text-2xl font-bold mb-4">{product.Name}</h2>
                    <p className="text-gray-600 mb-4">{product.Description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Price</p>
                        <p className="font-semibold">₹{product.Price}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Stock</p>
                        <p className="font-semibold">{product.Stock}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Category</p>
                        <p className="font-semibold">{product.Category}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">SubCategory</p>
                        <p className="font-semibold">{product.SubCategory}</p>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => setIsPreviewModalOpen(false)}
                      className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
                    >
                      Close Preview
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AddProduct;
