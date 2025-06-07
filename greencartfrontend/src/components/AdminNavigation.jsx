import React, { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Package, ShoppingCart, Users, BarChart2, PieChart, User, ChevronDown, Newspaper, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Logout from "./authentication/Logout";

const AdminNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const isAuthenticated = token && token !== "null" && token !== "undefined" && token.length > 0;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Toggle profile dropdown
  const handleProfileClick = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate("/authpage");
    } else {
      setIsProfileOpen((prev) => !prev);
    }
  };

  // Close mobile menu when a link is clicked
  const handleNavLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Left - Brand Name */}
          <NavLink to="/admin-dashboard" className="text-xl md:text-2xl font-bold text-green-600 flex-shrink-0">
            GreenCart Admin
          </NavLink>

          {/* Center - Navigation Links (Desktop) */}
          <div className="hidden md:flex space-x-3 lg:space-x-6">
            <NavLink to="/admin/manage-product" className="text-gray-700 hover:text-green-600 text-sm lg:text-base whitespace-nowrap">
              <Package className="inline-block w-4 h-4 lg:w-5 lg:h-5 mr-1" /> Products
            </NavLink>
            <NavLink to="/admin/manage-blog" className="text-gray-700 hover:text-green-600 text-sm lg:text-base whitespace-nowrap">
              <Newspaper className="inline-block w-4 h-4 lg:w-5 lg:h-5 mr-1" /> Blogs
            </NavLink>
            <NavLink to="/admin/orders" className="text-gray-700 hover:text-green-600 text-sm lg:text-base whitespace-nowrap">
              <ShoppingCart className="inline-block w-4 h-4 lg:w-5 lg:h-5 mr-1" /> Orders
            </NavLink>
            <NavLink to="/admin/users" className="text-gray-700 hover:text-green-600 text-sm lg:text-base whitespace-nowrap">
              <Users className="inline-block w-4 h-4 lg:w-5 lg:h-5 mr-1" /> Users
            </NavLink>
            <NavLink to="/admin/analytics" className="text-gray-700 hover:text-green-600 text-sm lg:text-base whitespace-nowrap">
              <BarChart2 className="inline-block w-4 h-4 lg:w-5 lg:h-5 mr-1" /> Analytics
            </NavLink>
            <NavLink to="/admin/statistics" className="text-gray-700 hover:text-green-600 text-sm lg:text-base whitespace-nowrap">
              <PieChart className="inline-block w-4 h-4 lg:w-5 lg:h-5 mr-1" /> Statistics
            </NavLink>
          </div>

          {/* Right Side - Profile & Mobile Menu Toggle */}
          <div className="flex items-center space-x-4">
            {/* Profile Dropdown */}
            <div className="relative inline-block" ref={dropdownRef}>
              <button
                className="text-gray-600 hover:text-gray-800 flex items-center space-x-1"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen((prev) => !prev);
                }}
              >
                <User className="h-5 w-5" />
                <ChevronDown className="h-4 w-4" />
              </button>

              {/* Dropdown Menu */}
              {isOpen && (
                <div
                  className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 shadow-lg rounded-lg"
                  onClick={(e) => e.stopPropagation()}
                >
                  <NavLink
                    to="/admin/user/profile"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsOpen(false)}
                  >
                    Profile
                  </NavLink>
                  <div className="border-t border-gray-200"></div>
                  <Logout
                    className="block px-4 py-2 text-gray-700 hover:text-green-600 transition-colors"
                    onClick={() => setIsProfileOpen(false)}
                  />
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden text-gray-600 hover:text-gray-800"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div 
          ref={mobileMenuRef}
          className="md:hidden bg-white shadow-lg border-t border-gray-200 overflow-hidden transition-all duration-300 ease-in-out"
        >
          <div className="px-4 py-3 space-y-2">
            <NavLink 
              to="/admin/manage-product" 
              className="block py-2 px-3 rounded-md text-gray-700 hover:bg-green-50 hover:text-green-600"
              onClick={handleNavLinkClick}
            >
              <Package className="inline-block w-5 h-5 mr-2" /> Products
            </NavLink>
            <NavLink 
              to="/admin/manage-blog" 
              className="block py-2 px-3 rounded-md text-gray-700 hover:bg-green-50 hover:text-green-600"
              onClick={handleNavLinkClick}
            >
              <Newspaper className="inline-block w-5 h-5 mr-2" /> Blogs
            </NavLink>
            <NavLink 
              to="/admin/orders" 
              className="block py-2 px-3 rounded-md text-gray-700 hover:bg-green-50 hover:text-green-600"
              onClick={handleNavLinkClick}
            >
              <ShoppingCart className="inline-block w-5 h-5 mr-2" /> Orders
            </NavLink>
            <NavLink 
              to="/admin/users" 
              className="block py-2 px-3 rounded-md text-gray-700 hover:bg-green-50 hover:text-green-600"
              onClick={handleNavLinkClick}
            >
              <Users className="inline-block w-5 h-5 mr-2" /> Users
            </NavLink>
            <NavLink 
              to="/admin/analytics" 
              className="block py-2 px-3 rounded-md text-gray-700 hover:bg-green-50 hover:text-green-600"
              onClick={handleNavLinkClick}
            >
              <BarChart2 className="inline-block w-5 h-5 mr-2" /> Analytics
            </NavLink>
            <NavLink 
              to="/admin/statistics" 
              className="block py-2 px-3 rounded-md text-gray-700 hover:bg-green-50 hover:text-green-600"
              onClick={handleNavLinkClick}
            >
              <PieChart className="inline-block w-5 h-5 mr-2" /> Statistics
            </NavLink>
          </div>
        </div>
      )}
    </nav>
  );
};

export default AdminNavbar;