import React, { useState } from "react";
import { ChevronDown, Search, User, ShoppingCart, Filter } from "lucide-react";
import { NavLink } from "react-router-dom";

const Navigation = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  return (
    <nav className="w-full bg-[var(--color-background)] border-b border-[var(--color-border)] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <span className="text-2xl font-bold text-[var(--color-primary)]">GreenCart</span>
            <div className="hidden md:flex space-x-6">
              <div className="relative group">
                <button className="flex items-center text-[var(--color-text)] hover:text-[var(--color-primary)]">
                  Shop <ChevronDown className="ml-1 h-4 w-4" />
                </button>
              </div>
              <a href="#offers" className="text-[var(--color-text)] hover:text-[var(--color-primary)]">Offers</a>
              <a href="#blog" className="text-[var(--color-text)] hover:text-[var(--color-primary)]">Blog</a>
              <a href="#about" className="text-[var(--color-text)] hover:text-[var(--color-primary)]">About</a>
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
