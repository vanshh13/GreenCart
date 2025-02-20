import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Edit2, Trash2, Search, Plus, Eye, ChevronDown, Filter, IndianRupee } from 'lucide-react';
import Notification from '../components/ui/notification/Notification';
import { fetchProducts, updateProduct, deleteProduct } from '../api';
import { motion, AnimatePresence } from "framer-motion";
import AdminNavbar from '../components/AdminNavigation';
import { NavLink } from 'react-router-dom';
import ProductCatalog from './ProductCatalog ';
const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    minPrice: '',
    maxPrice: ''
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [notification, setNotification] = useState({ message: '', show: false });
  const [confirmDelete, setConfirmDelete] = useState(null);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.Name?.toLowerCase().includes(searchTerm.trim().toLowerCase()) ?? false;
    const matchesCategory = filters.category === 'all' || product.Category === filters.category;
    const matchesPrice =
      (!filters.minPrice || Number(product.Price) >= Number(filters.minPrice)) &&
      (!filters.maxPrice || Number(product.Price) <= Number(filters.maxPrice));

    return matchesSearch && matchesCategory && matchesPrice;
  });

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        setProducts(response.data);
      } catch (err) {
        setError('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };
    fetchProductData();
  }, []);

  // handle update product
  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setNotification({ message: "Session expired! Redirecting to login...", show: true });
        setTimeout(() => window.location.href = "/authpage", 2000);  
        return;
      }
      console.log("Updating product:", editingProduct);

      const response = await updateProduct(editingProduct._id, editingProduct,token);
      setProducts(products.map(product => (product._id === editingProduct._id ? response.data.product : product)));
      console.log(response.data.product);
      setEditingProduct(null);
      setNotification({ message: "Product updated successfully!", show: true });
  
    } catch (error) {
      if (error.response && error.response.status === 403) {
        setNotification({ message: "Unauthorized! Please log in again.", show: true });
        setTimeout(() => window.location.href = "/authpage", 2000);
      } else {
        setNotification({ message: "Error updating product!", show: true });
      }
    }
  };
  
  // handle Delete product
  const handleDelete = async (productId) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setNotification({ message: "Authentication required!", show: true });
        return;
      }
  
      const response = await deleteProduct(productId, token);
      if (response.status === 200) {
        setProducts(products.filter((product) => product._id !== productId));
        setNotification({ message: "Product and images deleted successfully!", show: true });
      } else {
        setNotification({ message: response.data?.message || "Error deleting product!", show: true });
      }
      setConfirmDelete(null);
    } catch (error) {
      console.error("Delete Error:", error.response?.data || error.message);
      setNotification({ message: error.response?.data?.message || "Error deleting product!", show: true });
    }
  };

  const categories = ['all', 'Fruits', 'Vegetables', 'Grains' , 'Dairy', 'Bakery', 'Meat', 'Seafood']; // Extended categories

  return (
    <div className="min-h-screen bg-gray-50">
      <AnimatePresence>
        {notification.show && (
          <motion.div 
            className="fixed top-0 left-0 w-full flex justify-center z-[1000]"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
          >
            <Notification message={notification.message} onClose={() => setNotification({ message: '', show: false })} />
          </motion.div>
        )}
      </AnimatePresence>
      
      <AdminNavbar />

      <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
  className="w-full mt-8 mx-auto" // Removed mx-auto and px-* to allow full width
>
  <div className="bg-white shadow rounded-xl overflow-hidden px-4 py-8 mt-4 sm:mt-8 lg:mt-12 w-full">
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold text-gray-800">Manage Products</h1>
            <p className="text-gray-600 mt-1">View, edit, and manage your product inventory</p>
          </div>

          <div className="p-6 space-y-4">
            {/* Search and Add Product Row */}
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 items-start sm:items-center justify-between">
              <div className="relative w-full sm:w-1/2">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-200"
                />
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              </div>
              
              <div className="flex space-x-4 w-full sm:w-auto">
                <button 
                  onClick={() => setShowFilters(!showFilters)} 
                  className="px-4 py-3 border rounded-lg flex items-center space-x-2 hover:bg-gray-50 transition duration-200"
                >
                  <Filter size={18} />
                  <span>Filters</span>
                  <ChevronDown size={18} className={`transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
                </button>
                
                <NavLink 
                  to="/admin/add-product" 
                  className="px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200 flex items-center space-x-2"
                >
                  <Plus size={18} />
                  <span>Add Product</span>
                </NavLink>
              </div>
            </div>
            
            {/* Filters Section */}
            <AnimatePresence>
              {showFilters && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                    {/* Category Dropdown */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select
                        value={filters.category}
                        onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      >
                        {categories.map(category => (
                          <option key={category} value={category}>
                            {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Price Range Inputs */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Price</label>
                      <input
                        type="number"
                        placeholder="Min Price"
                        value={filters.minPrice}
                        onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Price</label>
                      <input
                        type="number"
                        placeholder="Max Price"
                        value={filters.maxPrice}
                        onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Loading and Error States */}
            {loading && (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            )}
            
            {error && (
              <div className="bg-red-50 text-red-500 p-4 rounded-lg">
                <p>{error}</p>
              </div>
            )}

            {/* Products Table */}
            {!loading && !error && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Images</th>
                      <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                      <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {filteredProducts.map((product, index) => (
                        <motion.tr 
                          key={product._id} 
                          className="border-t hover:bg-gray-50 transition-colors duration-150"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                          <td className="p-4">
                            {product.Images?.length > 0 ? (
                              <div className="flex space-x-1">
                                {product.Images.slice(0, 2).map((img, index) => (
                                  <img 
                                    key={index} 
                                    src={img} 
                                    alt={product.Name} 
                                    className="w-16 h-16 object-cover rounded-lg shadow-sm transition-transform duration-200 hover:scale-110"
                                  />
                                ))}
                                {product.Images.length > 2 && (
                                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                                    +{product.Images.length - 2}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                                No Image
                              </div>
                            )}
                          </td>
                          <td className="p-4 font-medium text-gray-800">{product.Name}</td>
                          <td className="p-4">
                            <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                              {product.Category}
                            </span>
                          </td>
                          <td className="p-4 font-medium flex items-center">
                            <IndianRupee className="h-4 w-4 mr-1" /> {/* Adjust size and spacing */}
                            {parseFloat(product.Price).toFixed(2)}
                          </td>                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              product.Stock > 10 ? 'bg-green-50 text-green-700' : 
                              product.Stock > 0 ? 'bg-yellow-50 text-yellow-700' : 
                              'bg-red-50 text-red-700'
                            }`}>
                              {product.Stock} in stock
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => setEditingProduct(product)} 
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition duration-150"
                                title="Edit Product"
                              >
                                <Edit2 className="h-5 w-5" />
                              </button>
                              <button 
                                onClick={() => setConfirmDelete(product._id)} 
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition duration-150"
                                title="Delete Product"
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                              {/* Button to Open Modal */}
                              <button
                                      onClick={() => setIsModalOpen(true)}
                                      className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition duration-150"
                                      title="View Product"
                                    >
                                      <Eye className="h-5 w-5" />
                                    </button>

                                    {/* Render the Modal when isModalOpen is true */}
                                    {isModalOpen && (
                                      <ProductCatalog productId={product._id} onClose={() => setIsModalOpen(false)} />
                                    )}
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                    
                    {filteredProducts.length === 0 && !loading && (
                      <tr>
                        <td colSpan="6" className="text-center py-8 text-gray-500">
                          No products found matching your criteria
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Edit Product Modal */}
      <AnimatePresence>
        {editingProduct && (
          <motion.div 
            className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", bounce: 0.3 }}
            >
              <div className="p-6 bg-blue-50 border-b border-blue-100">
                <h2 className="text-xl font-semibold text-blue-800">Update Product</h2>
                <p className="text-blue-600 text-sm mt-1">Make changes to product information</p>
              </div>

              <div className="p-6 max-h-[70vh] overflow-y-auto">
                <div className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                    <input 
                      type="text" 
                      value={editingProduct.Name} 
                      onChange={(e) => setEditingProduct({...editingProduct, Name: e.target.value})} 
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea 
                      value={editingProduct.Description} 
                      onChange={(e) => setEditingProduct({...editingProduct, Description: e.target.value})} 
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px]" 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Price */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                      <input 
                        type="number" 
                        value={editingProduct.Price} 
                        onChange={(e) => setEditingProduct({...editingProduct, Price: e.target.value})} 
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                      />
                    </div>

                    {/* Stock */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                      <input 
                        type="number" 
                        value={editingProduct.Stock} 
                        onChange={(e) => setEditingProduct({...editingProduct, Stock: e.target.value})} 
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Category */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select 
                        value={editingProduct.Category} 
                        onChange={(e) => setEditingProduct({...editingProduct, Category: e.target.value})} 
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      >
                        {categories.filter(c => c !== 'all').map(category => (
                          <option key={category} value={category}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* SubCategory */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">SubCategory</label>
                      <input 
                        type="text" 
                        value={editingProduct.SubCategory || ''} 
                        onChange={(e) => setEditingProduct({...editingProduct, SubCategory: e.target.value})} 
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                      />
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Update Images</label>
                    <input 
                      type="file" 
                      multiple 
                      accept="image/*" 
                      onChange={(e) => {
                        const files = Array.from(e.target.files);
                        const newImageURLs = files.map(file => URL.createObjectURL(file));
                        setEditingProduct({...editingProduct, Images: [...(editingProduct.Images || []), ...newImageURLs]});
                      }} 
                      className="w-full p-2 border rounded-lg mb-2"
                    />
                  </div>

                  {/* Preview Images */}
                  <div className="grid grid-cols-3 gap-3">
                    {editingProduct.Images && editingProduct.Images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={image} 
                          alt="Preview" 
                          className="w-full h-24 object-cover rounded-md border transition duration-200 group-hover:opacity-75" 
                        />
                        <button 
                          onClick={() => {
                            const updatedImages = editingProduct.Images.filter((_, i) => i !== index);
                            setEditingProduct({ ...editingProduct, Images: updatedImages });
                          }} 
                          className="absolute top-1 right-1 bg-red-500 text-white text-xs p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          title="Remove image"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 border-t flex justify-end space-x-3">
                <button 
                  onClick={() => setEditingProduct(null)} 
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition duration-200"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleUpdate} 
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                >
                  Update Product
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm Delete Modal */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div 
            className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", bounce: 0.3 }}
            >
              <div className="p-6 bg-red-50 border-b border-red-100">
                <h2 className="text-xl font-semibold text-red-800">Confirm Deletion</h2>
                <p className="text-red-600 text-sm mt-1">This action cannot be undone</p>
              </div>

              <div className="p-6">
                <p className="text-gray-700">
                  Are you sure you want to delete this product? This will remove all associated images and data.
                </p>
              </div>

              <div className="p-4 bg-gray-50 border-t flex justify-end space-x-3">
                <button 
                  onClick={() => setConfirmDelete(null)} 
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition duration-200"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleDelete(confirmDelete)} 
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
                >
                  Delete Product
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageProducts;