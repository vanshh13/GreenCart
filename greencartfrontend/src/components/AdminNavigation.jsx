import React from "react";
import { NavLink } from "react-router-dom";
import { Package, ShoppingCart, Users, BarChart2, PieChart, User } from "lucide-react";

const AdminNavbar = () => {
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
            <NavLink to="/manage-product" className="text-gray-700 hover:text-green-600">
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

          {/* Right - User Profile */}
          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-gray-800">
              <User className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
