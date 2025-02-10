import React, { useState, useRef } from 'react';
import { Upload, X, Edit2, Trash2, Search, Filter } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
const ManageProducts = () => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
      category: 'all',
      minPrice: '',
      maxPrice: ''
    });
  
    const [editingProduct, setEditingProduct] = useState(null);
  
    const filteredProducts = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filters.category === 'all' || product.category === filters.category;
      const matchesPrice = (!filters.minPrice || product.price >= filters.minPrice) &&
                          (!filters.maxPrice || product.price <= filters.maxPrice);
      
      return matchesSearch && matchesCategory && matchesPrice;
    });
  
    return (
      <div className="max-w-7xl mx-auto p-4">
        {/* Search and Filters */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2 relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 pl-10 border rounded-lg"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
  
          <select
            value={filters.category}
            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
            className="p-2 border rounded-lg"
          >
            <option value="all">All Categories</option>
            <option value="fruits">Fruits</option>
            <option value="vegetables">Vegetables</option>
          </select>
  
          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="Min Price"
              value={filters.minPrice}
              onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
              className="w-1/2 p-2 border rounded-lg"
            />
            <input
              type="number"
              placeholder="Max Price"
              value={filters.maxPrice}
              onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
              className="w-1/2 p-2 border rounded-lg"
            />
          </div>
        </div>
  
        {/* Products Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-4 text-left">Image</th>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Category</th>
                <th className="p-4 text-left">Price</th>
                <th className="p-4 text-left">Stock</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => (
                <tr key={product.id} className="border-t">
                  <td className="p-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  </td>
                  <td className="p-4">{product.name}</td>
                  <td className="p-4">{product.category}</td>
                  <td className="p-4">${product.price}</td>
                  <td className="p-4">{product.stock}</td>
                  <td className="p-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingProduct(product)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Edit2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => {/* Handle delete */}}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
export default ManageProducts;