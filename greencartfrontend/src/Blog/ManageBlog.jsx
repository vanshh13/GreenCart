import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Trash, PlusCircle, Eye, Search, Filter, ArrowUp, ArrowDown, Loader2, X, Check, Save, Image, Upload } from "lucide-react";
import AdminNavbar from "../components/AdminNavigation";
import Notification from '../components/ui/notification/Notification';

const ManageBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState({ id: null, status: null });
  const [previewBlog, setPreviewBlog] = useState(null);
  const [editBlog, setEditBlog] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [notification, setNotification] = useState({ message: '', type: '', show: false });
  const [showPreviewAfterUpdate, setShowPreviewAfterUpdate] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, [sortField, sortDirection]);

  // Custom notification function
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type, show: true });
    setTimeout(() => setNotification({ message: "", type: "", show: false }), 3000);
  };

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/blogs");
      let sortedBlogs = [...response.data];
      
      // Sort blogs based on current sort field and direction
      sortedBlogs.sort((a, b) => {
        if (sortField === "date") {
          const dateA = new Date(a.createdAt || a.date);
          const dateB = new Date(b.createdAt || b.date);
          return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
        } else if (sortField === "title") {
          return sortDirection === "asc"
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title);
        }
        return 0;
      });
      
      setBlogs(sortedBlogs);
    } catch (err) {
      console.error("Error fetching blogs:", err);
      setError("Error fetching blogs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const deleteBlog = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    
    setIsDeleting(true);
    setDeleteStatus({ id, status: "pending" });
    
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("Authentication required. Please log in.");
        setIsDeleting(false);
        return;
      }
      
      await axios.delete(`http://localhost:5000/api/blogs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      setDeleteStatus({ id, status: "success" });
      
      // Delay to show success animation
      setTimeout(() => {
        setBlogs(blogs.filter((blog) => blog._id !== id));
        setIsDeleting(false);
        setDeleteStatus({ id: null, status: null });
      }, 1000);
    } catch (error) {
      console.error("Delete error:", error);
      setDeleteStatus({ id, status: "error" });
      
      // Delay to show error animation
      setTimeout(() => {
        setIsDeleting(false);
        setDeleteStatus({ id: null, status: null });
        alert("Failed to delete blog. Please try again.");
      }, 1000);
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const formatDate = (dateString) => {
    // Handle various date formats
    if (!dateString) return "No date";
    
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "Invalid date";
    }
    
    // Format as DD-MM-YYYY
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
    const year = date.getFullYear();
    
    return `${day}-${month}-${year}`;
  };

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (blog.description && blog.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handlePreview = (blog) => {
    setPreviewBlog(blog);
    setSelectedImage(blog?.images?.[0] || null);
  };
  const handleEdit = (blog) => {
    // Create a deep copy of the blog to edit
    const blogToEdit = JSON.parse(JSON.stringify(blog));
    setEditBlog(blogToEdit);
    setSelectedImage(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditBlog(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveEdit = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        showNotification("Session expired! Redirecting to login...", "error");
        setTimeout(() => (window.location.href = "/authpage"), 2000);
        return;
      }
  
      console.log("Updating blog:", editBlog);
  
      let uploadedImages = [];
      const formData = new FormData();
  
      // 🔹 Identify New Images (Only files should be uploaded)
      const newImages = editBlog.images.filter((image) => image.file);
      
      newImages.forEach((image) => {
        formData.append("images", image.file);
      });
  
      // 🔹 Upload only if there are new images
      if (newImages.length > 0) {
        const uploadResponse = await axios.post(
          "http://localhost:5000/api/upload",  
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
  
        console.log("Upload response:", uploadResponse.data);
  
        // ✅ Extract the correct array of URLs
        uploadedImages = uploadResponse.data.images.map(img => img.imageUrl);
      }
  
      // 🔹 Merge existing images with new uploaded images
      const updatedBlog = {
        ...editBlog,
        images: [
          ...uploadedImages, // ✅ Newly uploaded images
          ...editBlog.images.filter(img => typeof img === "string"), // ✅ Keep existing Cloudinary URLs
        ],
      };
  
      console.log("Updated Blog:", updatedBlog);
  
      // 🔹 Send updated blog data to backend
      const response = await axios.put(
        `http://localhost:5000/api/blogs/${editBlog._id}`,
        updatedBlog,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      setBlogs(blogs.map(blog => blog._id === editBlog._id ? response.data.blog : blog));
  
      setEditBlog(null);
      setSelectedImage(null);
      setShowPreviewAfterUpdate(true);
      console.log("Blog updated successfully:", response.data);
      showNotification("Blog updated successfully!", "success");
    } catch (error) {
      console.error("Error updating blog:", error);
      if (error.response && error.response.status === 403) {
        showNotification("Unauthorized! Please log in again.", "error");
        setTimeout(() => (window.location.href = "/authpage"), 2000);
      } else {
        showNotification("Error updating blog!", "error");
      }
    }
  };
  
  if (loading && blogs.length === 0) {
    return (
      <div>
        <AdminNavbar />
        <div className="flex justify-center items-center h-screen">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-500" />
            <p className="mt-4 text-lg text-gray-600">Loading blogs...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      { /* Notification */ }
      <AnimatePresence>
              {notification.show && (
                <motion.div
                  className="fixed top-0 left-0 w-full flex justify-center z-[1000]"
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                >
                  <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification({ message: "", type: "", show: false })}
                  />
                </motion.div>
              )}
      </AnimatePresence>

      {/* Admin Navigation */}
      <AdminNavbar />

      {/* Page Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full mt-8 mx-auto"
      >
        <div className="bg-white shadow rounded-xl overflow-hidden px-4 py-8 mt-4 sm:mt-8 lg:mt-12 w-full">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Manage Blogs</h1>
            <Link
              to="/admin/add-blog"
              className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-600 transition-colors"
            >
              <PlusCircle className="h-5 w-5" /> Add Blog
            </Link>
          </div>

          {/* Search and Filter Controls */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search blogs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg w-full focus:ring-2 focus:ring-blue-300 focus:outline-none"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          {filteredBlogs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? "No blogs match your search." : "No blogs found. Add your first blog!"}
            </div>
          ) : (
            <div className="overflow-x-auto bg-white rounded-lg shadow">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Image
                    </th>
                    <th 
                      className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("title")}
                    >
                      <div className="flex items-center gap-2">
                        Title
                        {sortField === "title" && (
                          sortDirection === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
                        )}
                      </div>
                    </th>
                    <th 
                      className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("date")}
                    >
                      <div className="flex items-center gap-2">
                        Published Date
                        {sortField === "date" && (
                          sortDirection === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
                        )}
                      </div>
                    </th>
                    <th className="p-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBlogs.map((blog) => (
                    <motion.tr 
                      key={blog._id} 
                      className="hover:bg-gray-50"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      layout
                    >
                    <td className="p-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        {blog.images && blog.images.length > 0 ? (
                          blog.images.map((image, index) => (
                            <img
                              key={index}
                              src={image}
                              alt={`${blog.title} - ${index + 1}`}
                              className="w-16 h-16 rounded-lg object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://via.placeholder.com/64"; // Default fallback image
                              }}
                            />
                          ))
                        ) : (
                          <span className="text-gray-500">No Images</span>
                        )}
                      </div>
                    </td>

                      <td className="p-4 whitespace-nowrap">
                        <div className="font-semibold text-gray-800">{blog.title}</div>
                        <div className="text-sm text-gray-500">
                          {blog.description ? 
                            (blog.description.length > 70 
                              ? `${blog.description.substring(0, 70)}...` 
                              : blog.description) 
                            : "No description"}
                        </div>
                      </td>
                      <td className="p-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDate(blog.createdAt || blog.datePublished)}
                      </td>
                      <td className="p-4 whitespace-nowrap text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handlePreview(blog)}
                            className="text-blue-500 hover:text-blue-700 transition-colors p-1"
                            title="Preview blog"
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleEdit(blog)}
                            className="text-amber-500 hover:text-amber-700 transition-colors p-1"
                            title="Edit blog"
                          >
                            <Pencil className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => deleteBlog(blog._id)}
                            className="text-red-500 hover:text-red-700 transition-colors p-1"
                            title="Delete blog"
                            disabled={isDeleting}
                          >
                            {deleteStatus.id === blog._id ? (
                              deleteStatus.status === "pending" ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                              ) : deleteStatus.status === "success" ? (
                                <Check className="h-5 w-5 text-green-500" />
                              ) : (
                                <X className="h-5 w-5 text-red-500" />
                              )
                            ) : (
                              <Trash className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </motion.div>

 {/* Blog Preview Modal */}
 <AnimatePresence>
        {previewBlog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white max-w-4xl w-full rounded-xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">{previewBlog.title}</h2>
                  <button 
                    onClick={() => setPreviewBlog(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Blog Meta Info */}
                <div className="text-sm text-gray-500 mb-4">
                  Published: {previewBlog.createdAt || "Unknown Date"}
                </div>

                {/* Featured Image Display */}
                <div className="mb-6">
                  <img 
                    src={selectedImage}
                    alt={previewBlog.title}
                    className="w-full max-h-96 object-contain rounded-lg shadow"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/800x400?text=No+Image+Available";
                    }}
                  />
                  
                  {/* Thumbnail Preview */}
                  {previewBlog.images && previewBlog.images.length > 1 && (
                    <div className="flex mt-3 space-x-2 overflow-x-auto">
                      {previewBlog.images.map((img, index) => (
                        <img
                          key={index}
                          src={img}
                          alt={`Thumbnail ${index + 1}`}
                          className={`w-16 h-16 object-cover rounded cursor-pointer border-2 ${
                            selectedImage === img ? "border-blue-500" : "border-gray-300"
                          }`}
                          onClick={() => setSelectedImage(img)}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Blog Content */}
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-line">
                    {previewBlog.description || "No description available"}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setPreviewBlog(null);
                      handleEdit(previewBlog);
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Edit Blog
                  </button>
                  <button
                    onClick={() => setPreviewBlog(null)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Blog Edit Modal */}
      <AnimatePresence>
        {editBlog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white max-w-4xl w-full rounded-xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Edit Blog</h2>
                  <button 
                    onClick={() => setEditBlog(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={editBlog.title}
                      onChange={handleEditChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      name="description"
                      value={editBlog.description || ""}
                      onChange={handleEditChange}
                      rows={6}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 focus:outline-none"
                    />
                  </div>
                  
                {/* Upload New Images */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Update Images</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => {
                      const files = Array.from(e.target.files).map((file) => ({
                        file, 
                        preview: URL.createObjectURL(file), // ✅ Create preview URL
                      }));

                      setEditBlog((prev) => ({
                        ...prev,
                        images: [...(prev.images || []), ...files], // ✅ Store files with previews
                      }));
                    }}
                    className="w-full p-2 border rounded-lg mb-2"
                  />
                </div>
                {/* Image Previews */}
                <div className="flex flex-wrap gap-3 mt-2">
                  {editBlog?.images?.map((image, index) => {
                    // ✅ Use preview URL if available, otherwise use existing image URL
                    const imageUrl = image.preview || (typeof image === "string" ? image : "");

                    return (
                      <div key={index} className="relative">
                        <img
                          src={imageUrl}
                          alt={`Preview ${index + 1}`}
                          className="h-24 w-24 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          onClick={() => {
                            setEditBlog((prev) => ({
                              ...prev,
                              images: prev.images.filter((_, i) => i !== index),
                            }));
                          }}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                          title="Remove image"
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })}
                </div>
                </div>
                
                <div className="mt-8 flex justify-end gap-3">
                  <button
                    onClick={handleSaveEdit}
                    disabled={isSaving}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-5 w-5" />
                        Save Changes
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setEditBlog(null);
                      setSelectedImage(null);
                    }}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    disabled={isSaving}
                  >
                    Cancel
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

export default ManageBlog;