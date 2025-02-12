import React, { useState } from 'react';
import { Search } from 'lucide-react';
import ProductCard from './ProductCard';

const ProductList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [products] = useState([
    { id: 1, name: "Apple", category: "fruits", price: 1.5, rating: 4.8 },
    { id: 2, name: "Banana", category: "fruits", price: 1.2, rating: 4.5 },
    { id: 3, name: "Carrot", category: "vegetables", price: 0.8, rating: 4.2 },
    { id: 4, name: "Tomato", category: "vegetables", price: 1.0, rating: 4.7 }
  ]);

  const filteredProducts = products.filter(product =>
    (selectedCategory === 'all' || product.category === selectedCategory) &&
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 pl-10 border rounded-lg"
          />
          <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
        </div>
        
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="p-3 border rounded-lg min-w-[200px]"
        >
          <option value="all">All Categories</option>
          <option value="fruits">Fruits</option>
          <option value="vegetables">Vegetables</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
