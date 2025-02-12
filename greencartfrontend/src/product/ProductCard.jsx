import React from "react";

const ProductCard = ({ product, addToCart }) => {
  return (
    <div className="border rounded-lg p-4 shadow-md">
      <img src={product.Image} alt={product.Name} className="w-full h-40 object-cover mb-2 rounded-md" />
      <h3 className="text-lg font-bold">{product.Name}</h3>
      <p className="text-gray-600">{product.Description}</p>
      <p className="text-green-600 font-semibold">Price: ${product.Price}</p>
      <p className="text-sm text-gray-500">Stock: {product.Stock} available</p>
      <p className="text-yellow-500">⭐ {product.Rating} / 5</p>
      
      {/* Button directly included */}
      <button 
        className="bg-green-600 text-white py-2 px-4 rounded mt-2"
        onClick={() => addToCart(product)}
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
