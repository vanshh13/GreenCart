import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBasket } from 'lucide-react';

const categories = [
  { name: "Fruits", image: "/images/f.jpg", icon: "🍎" },
  { name: "Vegetables", image: "/images/v.jpg", icon: "🥬" },
  { name: "Dairy", image: "/images/d.jpg", icon: "🥛" },
  { name: "Bakery", image: "/images/b.jpg", icon: "🥖" },
  { name: "Oil & Ghee", image: "/images/Oil.jpg", icon: "🫗" },
  { name: "Masala", image: "/images/masala.jpg", icon: "🌶" },
  { name: "Grain", image: "/images/grain.jpg", icon: "🌾" },
];

const Categories = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-8">
        <div className="text-center mb-12">
  <ShoppingBasket className="mx-auto w-12 h-12 text-gray-800 mb-4" /> {/* Icon added */}
  <h2 className="text-4xl font-bold text-gray-800 mb-4">
    Shop by Category
  </h2>
  <p className="text-gray-600 max-w-2xl mx-auto">
    Explore our wide selection of fresh, high-quality products across various categories
  </p>
</div>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {categories.map((category, index) => (
            <motion.button
              key={index}
              variants={itemVariants}
              className="group relative w-64 h-64 rounded-full overflow-hidden shadow-xl transition-all duration-300 hover:shadow-2xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110 brightness-110"
                style={{
                  backgroundImage: `url(${category.image})`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent group-hover:from-black/60" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <div className="text-4xl mb-2 transform transition-transform duration-300 group-hover:scale-110">
                  {category.icon}
                </div>
                <h3 className="text-xl font-bold mb-1 text-center px-4">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-200 opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 text-center px-4">
                  Explore {category.name.toLowerCase()}
                </p>
              </div>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Categories;