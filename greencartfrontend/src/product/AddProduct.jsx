import React, { useState, useRef } from 'react';
import { Upload, X, Edit2, Trash2, Search, Filter } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    subcategory: '',
    stock: '',
    discount: '',
    rating: '0',
    images: []
  });
  
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  const validateForm = () => {
    const newErrors = {};
    if (!product.name) newErrors.name = 'Name is required';
    if (!product.price) newErrors.price = 'Price is required';
    if (!product.category) newErrors.category = 'Category is required';
    if (product.images.length === 0) newErrors.images = 'At least one image is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      url: URL.createObjectURL(file),
      file
    }));
    
    setProduct(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }));
  };

  const removeImage = (index) => {
    setProduct(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-6">Add New Product</h2>
          
          <form onSubmit={(e) => {
            e.preventDefault();
            if (validateForm()) {
              // Handle form submission
            }
          }}>
            {/* Image Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Product Images</label>
              <div className="grid grid-cols-4 gap-4 mb-2">
                {product.images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image.url}
                      alt={`Product ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-24 border-2 border-dashed rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600"
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
              {errors.images && <p className="text-red-500 text-sm">{errors.images}</p>}
            </div>

            {/* Basic Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Product Name</label>
                <input
                  type="text"
                  value={product.name}
                  onChange={(e) => setProduct(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-2 border rounded-lg"
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Price</label>
                <input
                  type="number"
                  value={product.price}
                  onChange={(e) => setProduct(prev => ({ ...prev, price: e.target.value }))}
                  className="w-full p-2 border rounded-lg"
                />
                {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={product.category}
                  onChange={(e) => setProduct(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="">Select Category</option>
                  <option value="fruits">Fruits</option>
                  <option value="vegetables">Vegetables</option>
                </select>
                {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Subcategory</label>
                <input
                  type="text"
                  value={product.subcategory}
                  onChange={(e) => setProduct(prev => ({ ...prev, subcategory: e.target.value }))}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Stock</label>
                <input
                  type="number"
                  value={product.stock}
                  onChange={(e) => setProduct(prev => ({ ...prev, stock: e.target.value }))}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Discount (%)</label>
                <input
                  type="number"
                  value={product.discount}
                  onChange={(e) => setProduct(prev => ({ ...prev, discount: e.target.value }))}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
            </div>

            {/* Description */}
            <div className="mt-6">
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={product.description}
                onChange={(e) => setProduct(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="w-full p-2 border rounded-lg"
              />
            </div>

            {/* Submit Button */}
            <div className="mt-6">
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
              >
                Add Product
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddProduct;