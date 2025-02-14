import React from "react";

const ProductCard = ({ product, addToCart }) => {
  const imageUrl =
    product.Images && product.Images.length > 0
      ? `/images/${product.Images[0]}`
      : "/images/default.jpg"; // Use a default image if none exist

  return (
    <div className="bg-white border rounded-lg p-4 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
      {/* Product Image */}
      <div className="relative">
        <img
          src={imageUrl}
          alt={product.Name}
          className="w-full h-48 object-cover rounded-md transition-transform duration-300 hover:scale-105"
        />
        {product.Stock === 0 && (
          <span className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-xs rounded">
            Out of Stock
          </span>
        )}
      </div>

      {/* Product Details */}
      <h3 className="text-lg font-bold text-gray-800 mt-3">{product.Name}</h3>
      <p className="text-gray-600 text-sm line-clamp-2">{product.Description}</p>

      {/* Price & Stock */}
      <div className="flex justify-between items-center mt-2">
        <p className="text-green-600 font-semibold text-lg">₹{product.Price}</p>
        <p
          className={`text-sm font-medium ${
            product.Stock > 10 ? "text-green-500" : "text-red-500"
          }`}
        >
          {product.Stock} in stock
        </p>
      </div>

      {/* Rating */}
      <p className="text-yellow-500 text-sm mt-1">⭐ {product.Rating} / 5</p>

      {/* Add to Cart Button */}
      <button
        className={`w-full py-2 mt-3 rounded-lg text-white font-semibold transition ${
          product.Stock > 0
            ? "bg-green-600 hover:bg-green-700"
            : "bg-gray-400 cursor-not-allowed"
        }`}
        onClick={() => product.Stock > 0 && addToCart(product)}
        disabled={product.Stock === 0}
      >
        {product.Stock > 0 ? "Add to Cart" : "Out of Stock"}
      </button>
    </div>
  );
};

export default ProductCard;
