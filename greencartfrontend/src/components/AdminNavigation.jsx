import React, { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Package, ShoppingCart, Users, BarChart2, PieChart, User, ChevronDown } from "lucide-react";

const AdminNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Left - Brand Name */}
          <NavLink to="/admin-dashboard" className="text-2xl font-bold text-green-600">
            GreenCart Admin
          </NavLink>

          {/* Center - Navigation Links */}
          <div className="hidden md:flex space-x-6">
            <NavLink to="/admin/manage-product" className="text-gray-700 hover:text-green-600">
              <Package className="inline-block w-5 h-5 mr-1" /> Products
            </NavLink>
            <NavLink to="/admin/orders" className="text-gray-700 hover:text-green-600">
              <ShoppingCart className="inline-block w-5 h-5 mr-1" /> Orders
            </NavLink>
            <NavLink to="/admin/users" className="text-gray-700 hover:text-green-600">
              <Users className="inline-block w-5 h-5 mr-1" /> Users
            </NavLink>
            <NavLink to="/admin/analytics" className="text-gray-700 hover:text-green-600">
              <BarChart2 className="inline-block w-5 h-5 mr-1" /> Analytics
            </NavLink>
            <NavLink to="/admin/statistics" className="text-gray-700 hover:text-green-600">
              <PieChart className="inline-block w-5 h-5 mr-1" /> Statistics
            </NavLink>
          </div>

          <div className="relative inline-block" ref={dropdownRef}>
      {/* Button Trigger */}
      <button
        className="text-gray-600 hover:text-gray-800 flex items-center space-x-2"
        onClick={(e) => {
          e.stopPropagation(); // Prevent event bubbling
          setIsOpen((prev) => !prev); // Toggle dropdown
        }}
      >
        <User className="h-6 w-6" />
        <ChevronDown className="h-4 w-4" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 shadow-lg rounded-lg"
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
        >
          <NavLink
            to="/admin/user/profile"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
            onClick={() => setIsOpen(false)} // Close on link click
          >
            Profile
          </NavLink>
          <NavLink
            to="/logout"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
            onClick={() => setIsOpen(false)} // Close on link click
          >
            Logout
          </NavLink>
        </div>
      )}
    </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;