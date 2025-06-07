import React, { useState, useRef } from "react";
import axios from "axios";
import { Upload, X, Eye, Check, Loader2 } from "lucide-react";
import AdminNavbar from "../components/AdminNavigation";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { createBlog } from "../api";
const AddBlog = () => {
  const [blog, setBlog] = useState({
    title: "",
    description: "",
    Images: [],
  });

  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newBlogId, setNewBlogId] = useState(null);
  const [submitStatus, setSubmitStatus] = useState(null);
  const navigate = useNavigate();

  // Validate Form
  const validateForm = () => {
    const newErrors = {};
    if (!blog.title) newErrors.title = "Title is required";
    if (!blog.description) newErrors.description = "Description is required";
    if (blog.Images.length === 0) newErrors.Images = "At least one image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Input Changes
  const handleChange = (e) => {
    setBlog({ ...blog, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
  
    // Convert existing image files into a Set to prevent duplicates
    const existingFiles = new Set(blog.Images.map((img) => img.file.name));
  
    const newImages = files
      .filter((file) => !existingFiles.has(file.name)) // Only add new images
      .map((file) => ({
        url: URL.createObjectURL(file),
        file,
      }));
  
    setBlog((prev) => ({
      ...prev,
      Images: [...prev.Images, ...newImages], // Only unique images are added
    }));
  };
  
  // Remove Image
  const removeImage = (index) => {
    setBlog((prev) => ({
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
    Object.entries(blog).forEach(([key, value]) => {
      if (key === "Images") {
        value.forEach((image) => formData.append("images", image.file));
      } else {
        formData.append(key, value);
      }
    });
  
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setSubmitStatus("error");
        setIsLoading(false);
        return;
      }
  
      const userId = JSON.parse(atob(token.split(".")[1])).id;
      formData.append("userId", userId);
  
      const response = await createBlog(formData);
  
      setNewBlogId(response.data._id);
      setSubmitStatus("success");
      setIsLoading(false);
      navigate(`/admin/manage-blog`);
    } catch (error) {
      console.error("Error creating blog:", error.response?.data || error.message);
      setSubmitStatus("error");
      setIsLoading(false);
    }
  };
  
  

  // Preview Functionality
  const handlePreviewClick = () => {
    // Create a preview object similar to how it would be displayed
    setIsPreviewModalOpen(true);
  };

  return (

    <div className="bg-gray-50 min-h-screen">
      <AdminNavbar />
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto mt-24 p-6 bg-white shadow-lg rounded-lg"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">📝 Add New Blog</h2>
          <button
            type="button"
            onClick={handlePreviewClick}
            disabled={blog.Images.length === 0}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition duration-300"
          >
            <Eye className="h-5 w-5" />
            <span>Preview Blog</span>
          </button>
        </div>
        <div className="max-w-4xl mx-auto p-8 bg-white">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
            {/* Title */}
            <div>
              <label className="block font-medium">Blog Title *</label>
              <input
                type="text"
                name="title"
                value={blog.title}
                onChange={handleChange}
                className="border rounded px-3 py-2 w-full"
                required
              />
              {errors.title && <p className="text-red-500">{errors.title}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block font-medium">Description *</label>
              <textarea
                name="description"
                value={blog.description}
                onChange={handleChange}
                className="border rounded px-3 py-2 w-full min-h-32"
                required
              />
              {errors.description && <p className="text-red-500">{errors.description}</p>}
            </div>

            {/* Image Upload */}
            <div className="col-span-1">
              <label className="block font-medium">Blog Images *</label>
              <div className="grid grid-cols-5 gap-2">
                {blog.Images.map((Image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={Image.url}
                      alt={`Blog ${index + 1}`}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="border rounded-lg p-3 flex items-center justify-center"
                >
                  <Upload className="h-6 w-6" />
                </button>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                multiple
                accept="image/*"
                className="hidden"
              />
              {errors.Images && <p className="text-red-500">{errors.Images}</p>}
            </div>

            <button
              type="submit"
              className="col-span-1 bg-green-500 text-white p-2 rounded mt-4 hover:bg-green-600 transition duration-300"
            >
              Add Blog
            </button>
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
                  <p className="text-xl font-semibold text-gray-700">Adding Blog...</p>
                </>
              ) : submitStatus === 'success' ? (
                <>
                  <Check className="h-16 w-16 mx-auto text-green-500 mb-4" />
                  <p className="text-xl font-semibold text-green-700">Blog Added Successfully!</p>
                </>
              ) : (
                <>
                  <X className="h-16 w-16 mx-auto text-red-500 mb-4" />
                  <p className="text-xl font-semibold text-red-700">Failed to Add Blog</p>
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
                    {blog.Images.map((img, index) => (
                      <img
                        key={index}
                        src={img.url}
                        alt={`Blog Preview ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg shadow-md"
                      />
                    ))}
                  </div>
                </div>

                {/* Blog Details Section */}
                <div className="p-6 bg-gray-50">
                  <h2 className="text-2xl font-bold mb-4">{blog.title}</h2>
                  <div className="prose max-w-none mb-6">
                    <p className="text-gray-600">{blog.description}</p>
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
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AddBlog;