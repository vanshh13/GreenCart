import React, { useState } from "react";
import { ChevronDown, Search, User, ShoppingCart, Filter } from "lucide-react";
import { NavLink } from "react-router-dom";

const Navigation = () => {
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const categories = [
    { name: "Fruits", image: "/images/f.jpg", link: "/category/fruits" },
    { name: "Vegetables", image: "/images/v.jpg", link: "/category/vegetables" },
    { name: "Dairy", image: "/images/d.jpg", link: "/category/dairy" },
    { name: "Bakery", image: "/images/b.jpg", link: "/category/vegetables" },
    { name: "Oil & Ghee", image: "/images/Oil.jpg", link: "/category/oil" },
    { name: "Masala", image: "/images/masala.jpg", link: "/category/vegetables" },
    { name: "Grain", image: "/images/grain.jpg", link: "/category/dairy" },
    { name: "More", image: "", link: "/category/dairy" },

  ];

  return (
    <nav className="w-full bg-[var(--color-background)] border-b border-[var(--color-border)] shadow-sm relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <span className="text-2xl font-bold text-[var(--color-primary)]">
              GreenCart
            </span>
            <div className="hidden md:flex space-x-6">
              <div className="relative">
                <button
                  className="flex items-center text-[var(--color-text)] hover:text-[var(--color-primary)]"
                  onClick={() => setIsShopOpen(!isShopOpen)}
                >
                  Shop <ChevronDown className="ml-1 h-4 w-4" />
                </button>

                {isShopOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2 border border-gray-200 z-50">
                    {categories.map((category, index) => (
                      <NavLink
                        to={category.link}
                        key={index}
                        className="flex items-center px-4 py-2 text-[var(--color-text)] hover:bg-gray-100"
                      >
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-6 h-6 mr-2 rounded-full"
                        />
                        {category.name}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
              <NavLink
                to="/offers"
                className="text-[var(--color-text)] hover:text-[var(--color-primary)]"
              >
                Offers
              </NavLink>
              <NavLink
                to="/blog"
                className="text-[var(--color-text)] hover:text-[var(--color-primary)]"
              >
                Blog
              </NavLink>
              <NavLink
                to="/about"
                className="text-[var(--color-text)] hover:text-[var(--color-primary)]"
              >
                About
              </NavLink>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className={`relative flex items-center transition-all duration-300 ${isSearchOpen ? "w-72" : "w-10"}`}>
              {isSearchOpen && (
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 w-full rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              )}
              <Filter className={`absolute left-3 text-gray-500 ${isSearchOpen ? "block" : "hidden"}`} />
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 hover:bg-[var(--color-surface)] rounded-full flex items-center justify-center"
              >
                <Search className="h-5 w-5 text-[var(--color-text)]" />
              </button>
            </div>

            <NavLink to="/user/profile">
              <button className="p-2 hover:bg-[var(--color-surface)] rounded-full">
                <User className="h-5 w-5 text-[var(--color-text)]" />
              </button>
            </NavLink>

            <NavLink to="/user/shopping-cart">
              <button className="p-2 hover:bg-[var(--color-surface)] rounded-full relative">
                <ShoppingCart className="h-5 w-5 text-[var(--color-text)]" />
                <span className="absolute -top-1 -right-1 bg-[var(--color-primary)] text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  0
                </span>
              </button>
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
