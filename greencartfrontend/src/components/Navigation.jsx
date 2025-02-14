import React, { useState, useEffect } from "react";
import { ChevronDown, Search, User, ShoppingCart, Heart, Bell, Menu, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Navigation = () => {
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const categories = [
    { name: "Vege", image: "/images/v.jpg", link: "/category/grain" },
    { name: "Fruits", image: "/images/f.jpg", link: "/category/fruits" },
    { name: "Dairy", image: "/images/d.jpg", link: "/category/dairy" },
    { name: "Bakery", image: "/images/b.jpg", link: "/category/bakery" },
    { name: "Oil & Ghee", image: "/images/oil.jpg", link: "/category/oil" },
    { name: "Masala", image: "/images/masala.jpg", link: "/category/masala" },
    { name: "Grain", image: "/images/grain.jpg", link: "/category/grain" },
    { name: "More", image: "", link: "/category/more" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`w-full fixed top-0 left-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-md shadow-lg" : "bg-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo & Links */}
          <div className="flex items-center space-x-8">
            <NavLink to="/" className="flex items-center space-x-2">
              <svg viewBox="0 0 24 24" className="w-8 h-8 text-green-600">
                <path
                  fill="currentColor"
                  d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M11,17V16H9V14H13V13H10A1,1 0 0,1 9,12V9A1,1 0 0,1 10,8H11V7H13V8H15V10H11V11H14A1,1 0 0,1 15,12V15A1,1 0 0,1 14,16H13V17H11Z"
                />
              </svg>
              <span className="text-3xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
                GreenCart
              </span>
            </NavLink>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-6">
              <div className="relative group">
              <button
  onClick={() => setIsShopOpen(!isShopOpen)}
  className="flex items-center text-gray-700 hover:text-green-600 transition-colors"
>
  Shop
  <motion.span
    animate={{ rotate: isShopOpen ? 180 : 0 }}
    transition={{ duration: 0.2 }}
  >
    <ChevronDown className="h-10" />
  </motion.span>
</button>


                <AnimatePresence>
                  {isShopOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden"
                    >
                      <div className="grid grid-cols-2 gap-2 p-4">
                        {categories.map((category, index) => (
                          <NavLink
                            to={category.link}
                            key={index}
                            className="flex items-center p-2 rounded-lg hover:bg-green-50 transition-colors"
                          >
                            {category.image ? (
                              <div className="w-10 h-10 rounded-lg overflow-hidden mr-3">
                                <img
                                  src={category.image}
                                  alt={category.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-green-100 mr-3 flex items-center justify-center">
                                <span className="text-green-600 text-lg">+</span>
                              </div>
                            )}
                            <span className="text-gray-700 font-medium">{category.name}</span>
                          </NavLink>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <NavLink
                to="/offers"
                className={({ isActive }) =>
                  `relative overflow-hidden transition-colors ${
                    isActive ? "text-green-600" : "text-gray-700 hover:text-green-600"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    Offers
                    {isActive && (
                      <motion.div
                        layoutId="underline"
                        className="absolute bottom-0 left-0 w-full h-0.5 bg-green-600"
                      />
                    )}
                  </>
                )}
              </NavLink>

              <NavLink
                to="/blog"
                className={({ isActive }) =>
                  `relative overflow-hidden transition-colors ${
                    isActive ? "text-green-600" : "text-gray-700 hover:text-green-600"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    Blog
                    {isActive && (
                      <motion.div
                        layoutId="underline"
                        className="absolute bottom-0 left-0 w-full h-0.5 bg-green-600"
                      />
                    )}
                  </>
                )}
              </NavLink>

              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `relative overflow-hidden transition-colors ${
                    isActive ? "text-green-600" : "text-gray-700 hover:text-green-600"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    About
                    {isActive && (
                      <motion.div
                        layoutId="underline"
                        className="absolute bottom-0 left-0 w-full h-0.5 bg-green-600"
                      />
                    )}
                  </>
                )}
              </NavLink>
            </div>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-6">
            {/* Search Bar */}
            <div className="relative">
              <AnimatePresence>
                {isSearchOpen && (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: "300px", opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    className="absolute right-0 top-1/2 -translate-y-1/2"
                  >
                    <input
                      type="text"
                      placeholder="Search products..."
                      className="w-full pl-4 pr-12 py-2 rounded-full border border-gray-200 focus:ring-2 focus:ring-green-400 focus:border-transparent focus:outline-none bg-gray-50"
                    />
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </motion.div>
                )}
              </AnimatePresence>
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 hover:bg-gray-100 rounded-full transition relative z-10"
              >
                <Search className="h-5 w-5 text-gray-700" />
              </button>
            </div>

           

            {/* User Profile */}
            <NavLink
              to="/user/profile"
              className="p-2 hover:bg-gray-100 rounded-full transition"
            >
              <User className="h-5 w-5 text-gray-700" />
            </NavLink>

            {/* Shopping Cart */}
            <NavLink
              to="/user/shopping-cart"
              className="relative p-2 hover:bg-gray-100 rounded-full transition"
            >
              <ShoppingCart className="h-5 w-5 text-gray-700" />
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold"
              >
                0
              </motion.span>
            </NavLink>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 hover:bg-gray-100 rounded-full transition"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-700" />
              ) : (
                <Menu className="h-6 w-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-200"
          >
            <div className="px-4 py-6 space-y-4">
              <NavLink
                to="/category"
                className="block px-4 py-2 text-gray-700 hover:bg-green-50 rounded-lg transition"
              >
                Shop
              </NavLink>
              <NavLink
                to="/offers"
                className="block px-4 py-2 text-gray-700 hover:bg-green-50 rounded-lg transition"
              >
                Offers
              </NavLink>
              <NavLink
                to="/blog"
                className="block px-4 py-2 text-gray-700 hover:bg-green-50 rounded-lg transition"
              >
                Blog
              </NavLink>
              <NavLink
                to="/about"
                className="block px-4 py-2 text-gray-700 hover:bg-green-50 rounded-lg transition"
              >
                About
              </NavLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navigation;