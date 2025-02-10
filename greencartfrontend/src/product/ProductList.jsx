import React, { useState, useEffect } from 'react';
import { Search, Filter, Star } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';

const ProductList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [products, setProducts] = useState([]);
  
  const filterProducts = () => {
    return products.filter(product => 
      (selectedCategory === 'all' || product.category === selectedCategory) &&
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Search and Filter Bar */}
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
          {/* Add more categories */}
        </select>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filterProducts().map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

// const ProductCard = ({ product }) => {
//   return (
//     <Card className="hover:shadow-lg transition-shadow">
//       <CardContent className="p-4">
//         <img
//           src={product.image}
//           alt={product.name}
//           className="w-full h-48 object-cover rounded-lg mb-4"
//         />
//         <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
//         <div className="flex items-center mb-2">
//           <Star className="h-4 w-4 text-yellow-400 fill-current" />
//           <span className="ml-1 text-sm">{product.rating}</span>
//         </div>
//         <p className="text-gray-600 text-sm mb-2">{product.category}</p>
//         <div className="flex justify-between items-center">
//           <span className="font-bold">${product.price}</span>
//           <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
//             Add to Cart
//           </button>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

const ProductCatalog = ({ productId }) => {
  const [product, setProduct] = useState(null);

  return (
    <div className="max-w-7xl mx-auto p-4">
      {product && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div>
            <img
              src={product.image}
              alt={product.name}
              className="w-full rounded-lg"
            />
          </div>

          {/* Product Details */}
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <span className="ml-1">{product.rating}</span>
              </div>
              <span className="mx-2">•</span>
              <span className="text-gray-600">{product.category}</span>
            </div>

            <p className="text-2xl font-bold mb-4">${product.price}</p>
            
            <div className="mb-6">
              <h2 className="font-semibold mb-2">Description</h2>
              <p className="text-gray-600">{product.description}</p>
            </div>

            <div className="mb-6">
              <h2 className="font-semibold mb-2">Availability</h2>
              <span className={`px-3 py-1 rounded-full text-sm ${
                product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            <div className="space-y-4">
              <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700">
                Add to Cart
              </button>
              <button className="w-full border border-green-600 text-green-600 py-3 rounded-lg hover:bg-green-50">
                Add to Wishlist
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { ProductList, ProductCatalog };