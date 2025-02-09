import React from "react";
import { ChevronDown, Search, User, ShoppingCart } from "lucide-react";

const Navigation = () => {
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
            <button className="p-2 hover:bg-[var(--color-surface)] rounded-full">
              <Search className="h-5 w-5 text-[var(--color-text)]" />
            </button>
            <button className="p-2 hover:bg-[var(--color-surface)] rounded-full">
              <User className="h-5 w-5 text-[var(--color-text)]" />
            </button>
            <button className="p-2 hover:bg-[var(--color-surface)] rounded-full relative">
              <ShoppingCart className="h-5 w-5 text-[var(--color-text)]" />
              <span className="absolute -top-1 -right-1 bg-[var(--color-primary)] text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                0
              </span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
