import { useEffect, useState } from "react";
import axios from "axios";

const ProductCatalog = ({ productId, onClose }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${productId}`);
        setProduct(response.data);
      } catch (err) {
        setError("Product not found or error fetching product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-10 z-50">
      <div className="bg-white max-w-3xl w-full p-6 rounded-lg shadow-lg relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 text-lg"
        >
          ✖
        </button>

        {/* Loading & Error Messages */}
        {loading && <div className="text-center mt-5">Loading...</div>}
        {error && <div className="text-red-500 text-center mt-5">{error}</div>}

        {/* Product Details */}
        {product && (
          <div>
            <h1 className="text-2xl font-bold mb-4 text-gray-800">{product.Name}</h1>
            <div className="flex flex-col md:flex-row">
              {/* Product Image */}
              <div className="md:w-1/2">
                <img
                  src={product.Images?.[0] || "https://via.placeholder.com/300"}
                  alt={product.Name}
                  className="w-full h-64 object-cover rounded-lg shadow"
                />
              </div>

              {/* Product Info */}
              <div className="md:w-1/2 md:pl-6">
                <p className="text-gray-600 text-lg mb-2">{product.Description}</p>
                <p className="text-gray-700 font-bold text-xl">Price: ${product.Price}</p>
                <p className={`text-sm mt-2 ${product.Stock > 0 ? "text-green-500" : "text-red-500"}`}>
                  {product.Stock > 0 ? `In Stock: ${product.Stock}` : "Out of Stock"}
                </p>
                <p className="mt-2 text-sm text-gray-500">Category: {product.Category}</p>
                <p className="mt-2 text-sm text-gray-500">SubCategory: {product.SubCategory}</p>

                {/* Rating */}
                <div className="mt-4 flex items-center">
                  <span className="text-yellow-400 text-lg font-bold">{product.Rating} ⭐</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

    export default ProductCatalog;
