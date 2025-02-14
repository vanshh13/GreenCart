import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Edit2, Trash2, Search } from 'lucide-react';
import Notification from '../components/ui/notification/Notification';
import { fetchProducts, updateProduct, deleteProduct } from '../api';
import { motion } from "framer-motion";
import AdminNavbar from '../components/AdminNavigation';
import { NavLink } from 'react-router-dom';
const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    minPrice: '',
    maxPrice: ''
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updatedProduct, setUpdatedProduct] = useState(null);
  const [notification, setNotification] = useState({ message: '', show: false });

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.Name?.toLowerCase().includes(searchTerm.trim().toLowerCase()) ?? false;
    const matchesCategory = filters.category === 'all' || product.Category === filters.category;
    const matchesPrice =
      (!filters.minPrice || Number(product.Price) >= Number(filters.minPrice)) &&
      (!filters.maxPrice || Number(product.Price) <= Number(filters.maxPrice));

    return matchesSearch && matchesCategory && matchesPrice;
  });

  useEffect(() => {
    const fetchProducts = async () => {
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
    fetchProducts();
  }, []);

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setNotification({ message: "Session expired! Redirecting to login...", show: true });
        setTimeout(() => window.location.href = "/authpage", 2000);  
        return;
      }
  
      const response = await updateProduct(editingProduct._id, editingProduct);
      setProducts(products.map(product => (product._id === editingProduct._id ? response.data.product : product)));
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
  

  const handleDelete = async (productId) => {
    console.log(productId);
    try {
      const token = localStorage.getItem("authToken"); // Get the token from localStorage
      if (!token) {
        setNotification({ message: "Authentication required!", show: true });
        return;
      }
  
      const response = await deleteProduct(productId, token);
      console.log(response);
      if (response.status === 200) {
        setProducts(products.filter((product) => product._id !== productId));
        setNotification({ message: "Product and images deleted successfully!", show: true });
      } else {
        setNotification({ message: response.data?.message || "Error deleting product!", show: true });
      }
    } catch (error) {
      console.error("Delete Error:", error.response?.data || error.message);
      setNotification({ message: error.response?.data?.message || "Error deleting product!", show: true });
    }
  };
  
  

  return (
    <div className="max-w-7xl mx-auto p-4">
      {notification.show && (
        <Notification message={notification.message} onClose={() => setNotification({ message: '', show: false })} />
      )}
      <AdminNavbar/>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto mt-16 px-6"
      >
 <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6 items-center">
  {/* Search Input */}
  <div className="md:col-span-2 relative">
    <input
      type="text"
      placeholder="Search products..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
    />
    <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
  </div>

  {/* Category Dropdown */}
  <select
    value={filters.category}
    onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
    className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
  >
    <option value="all">All Categories</option>
    <option value="fruits">Fruits</option>
    <option value="vegetables">Vegetables</option>
  </select>

  {/* Price Range Inputs */}
  <div className="flex space-x-2">
    <input
      type="number"
      placeholder="Min Price"
      value={filters.minPrice}
      onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
      className="w-1/2 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
    />
    <input
      type="number"
      placeholder="Max Price"
      value={filters.maxPrice}
      onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
      className="w-1/2 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
    />
  </div>

  {/* Add User Button */}
  <div className="flex justify-end">
    <NavLink 
      to="/add-product" 
      className="px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
    >
      + Add Product
    </NavLink>
  </div>
</div>


      {loading && <p>Loading products...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-4 text-left">Images</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Category</th>
              <th className="p-4 text-left">Price</th>
              <th className="p-4 text-left">Stock</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product => (
              <tr key={product._id} className="border-t">
                <td className="p-4">
                  {product.Images?.length > 0 ? (
                    product.Images.map((img, index) => (
                      <img key={index} src={img} alt={product.Name} className="w-16 h-16 object-cover rounded-lg" />
                    ))
                  ) : (
                    <span>No Image</span>
                  )}
                </td>
                <td className="p-4">{product.Name}</td>
                <td className="p-4">{product.Category}</td>
                <td className="p-4">${product.Price}</td>
                <td className="p-4">{product.Stock}</td>
                <td className="p-4">
                  <div className="flex space-x-2">
                    <button onClick={() => setEditingProduct(product)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                      <Edit2 className="h-5 w-5" />
                    </button>
                    <button onClick={() => handleDelete(product._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingProduct && (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
    <div className="bg-white p-6 rounded-lg w-96">
      <h2 className="text-lg font-semibold mb-4">Update Product</h2>

      {/* Name */}
      <label className="block text-sm font-medium mb-1">Name</label>
      <input 
        type="text" 
        value={editingProduct.Name} 
        onChange={(e) => setEditingProduct({...editingProduct, Name: e.target.value})} 
        className="w-full p-2 border rounded-lg mb-2" 
      />

      {/* Description */}
      <label className="block text-sm font-medium mb-1">Description</label>
      <input 
        type="text" 
        value={editingProduct.Description} 
        onChange={(e) => setEditingProduct({...editingProduct, Description: e.target.value})} 
        className="w-full p-2 border rounded-lg mb-2" 
      />

      {/* Price */}
      <label className="block text-sm font-medium mb-1">Price</label>
      <input 
        type="number" 
        value={editingProduct.Price} 
        onChange={(e) => setEditingProduct({...editingProduct, Price: e.target.value})} 
        className="w-full p-2 border rounded-lg mb-2" 
      />

      {/* Stock */}
      <label className="block text-sm font-medium mb-1">Stock</label>
      <input 
        type="number" 
        value={editingProduct.Stock} 
        onChange={(e) => setEditingProduct({...editingProduct, Stock: e.target.value})} 
        className="w-full p-2 border rounded-lg mb-2" 
      />

      {/* Category */}
      <label className="block text-sm font-medium mb-1">Category</label>
      <input 
        type="text" 
        value={editingProduct.Category} 
        onChange={(e) => setEditingProduct({...editingProduct, Category: e.target.value})} 
        className="w-full p-2 border rounded-lg mb-2" 
      />

      {/* SubCategory */}
      <label className="block text-sm font-medium mb-1">SubCategory</label>
      <input 
        type="text" 
        value={editingProduct.SubCategory} 
        onChange={(e) => setEditingProduct({...editingProduct, SubCategory: e.target.value})} 
        className="w-full p-2 border rounded-lg mb-2" 
      />

{/* Image Upload */}
<label className="block text-sm font-medium mb-1">Update Images</label>
<input 
  type="file" 
  multiple 
  accept="image/*" 
  onChange={(e) => {
    const files = Array.from(e.target.files);
    const newImageURLs = files.map(file => URL.createObjectURL(file));
    setEditingProduct({...editingProduct, Images: [...editingProduct.Images, ...newImageURLs]});
  }} 
  className="w-full p-2 border rounded-lg mb-2"
/>

{/* Preview Images with Hover Effect for Remove Button */}
<div className="flex flex-wrap gap-2">
  {editingProduct.Images.map((image, index) => (
    <div key={index} className="relative w-24 h-24 group">
      <button 
        onClick={() => {
          const updatedImages = editingProduct.Images.filter((_, i) => i !== index);
          setEditingProduct({ ...editingProduct, Images: updatedImages });
        }} 
        className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
      >
        &times;
      </button>
      <img src={image} alt="Preview" className="w-full h-full object-cover rounded-md border" />
    </div>
  ))}
</div>


      <div className="flex space-x-2">
        <button onClick={handleUpdate} className="w-full bg-blue-500 text-white p-2 rounded-lg">Update</button>
        <button onClick={() => setEditingProduct(null)} className="w-full bg-gray-500 text-white p-2 rounded-lg">Cancel</button>
      </div>
    </div>
  </div>
)}
</motion.div>
    </div>
  );
};

export default ManageProducts;
