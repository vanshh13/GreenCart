import React from "react";
import ProductCard from "./ProductCard"; // Ensure this is correctly imported

const ProductsGrid = () => {
  const products = Array(12).fill({
    name: "Organic Product",
    price: 29.99,
    originalPrice: 39.99,
    discount: true,
    rating: 4.5,
  });

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-[var(--color-text)]">Featured Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductsGrid;
