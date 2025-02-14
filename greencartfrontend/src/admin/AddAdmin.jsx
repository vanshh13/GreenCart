import React, { useState } from 'react';
import { User, Mail, Phone, Key, Shield, MapPin } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import axios from 'axios';
import Notification from '../components/ui/notification/Notification';
import { createAdmin } from '../api';
import AdminNavbar from '../components/AdminNavigation';
import { motion } from "framer-motion";

const AddAdmin = () => {
  const [adminData, setAdminData] = useState({
    adminName: "",
    adminEmail: "",
    adminContact: "",
    Password: "",
    ConfirmPassword: "",
    adminAddress: {
      cityVillage: "",
      pincode: "",
      state: "",
      country: "",
      streetOrSociety: "",
    },
  });
  

  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState(null); // Manage notification message
  const token = localStorage.getItem('authToken'); 

  const validateForm = () => {
    const newErrors = {};
  
    if (!adminData.adminName) newErrors.adminName = "Name is required";
    if (!adminData.adminEmail) newErrors.adminEmail = "Email is required";
    if (!adminData.Password) newErrors.Password = "Password is required";
    if (adminData.Password !== adminData.ConfirmPassword) {
      newErrors.ConfirmPassword = "Passwords do not match";
    }
  
    if (!adminData.adminAddress) {
      newErrors.address = "Address is required";
    } else {
      if (!adminData.adminAddress.cityVillage) newErrors.cityVillage = "City/Village is required";
      if (!adminData.adminAddress.pincode) newErrors.pincode = "Pincode is required";
      if (!adminData.adminAddress.state) newErrors.state = "State is required";
      if (!adminData.adminAddress.country) newErrors.country = "Country is required";
      if (!adminData.adminAddress.streetOrSociety) newErrors.streetOrSociety = "Street/Society is required";
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
  
    try {
      const response = await createAdmin(adminData, token);
      setNotification("Admin created successfully!");
  
      // Reset form after success
      setAdminData({
        adminName: "",
        adminEmail: "",
        adminContact: "",
        Password: "",
        ConfirmPassword: "",
        adminAddress: {
          cityVillage: "",
          pincode: "",
          state: "",
          country: "",
          streetOrSociety: "",
        },
      });
    } catch (error) {
      setNotification("Failed to create admin. Try again!");
    }
  };
  
  return (
    <div>
    <Notification message={notification} onClose={() => setNotification(null)} />
    <AdminNavbar/>
    <motion.div 
        initial={{ opacity: 0, y: 50 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }} 
        className="max-w-4xl mx-auto mt-8 p-6 rounded-lg">
    <div className="max-w-3xl mx-auto p-4">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-6">Add New Admin</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Admin Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    value={adminData.adminName}
                    onChange={(e) => setAdminData((prev) => ({ ...prev, adminName: e.target.value }))}
                    className="w-full p-2 pl-10 border rounded-lg"
                  />
                  <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
                {errors.adminName && <p className="text-red-500 text-sm">{errors.adminName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <div className="relative">
                  <input
                    type="email"
                    value={adminData.adminEmail}
                    onChange={(e) => setAdminData((prev) => ({ ...prev, adminEmail: e.target.value }))}
                    className="w-full p-2 pl-10 border rounded-lg"
                  />
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
                {errors.adminEmail && <p className="text-red-500 text-sm">{errors.adminEmail}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Contact Number</label>
                <div className="relative">
                  <input
                    type="tel"
                    value={adminData.adminContact}
                    onChange={(e) => setAdminData((prev) => ({ ...prev, adminContact: e.target.value }))}
                    className="w-full p-2 pl-10 border rounded-lg"
                  />
                  <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

                <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <input
                  type="password"
                  value={adminData.Password}
                  onChange={(e) => setAdminData((prev) => ({ ...prev, Password: e.target.value }))}
                  className="w-full p-2 border rounded-lg"
                />
                {errors.Password && <p className="text-red-500 text-sm">{errors.Password}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Confirm Password</label>
                <input
                  type="password"
                  value={adminData.ConfirmPassword}
                  onChange={(e) => setAdminData((prev) => ({ ...prev, ConfirmPassword: e.target.value }))}
                  className="w-full p-2 border rounded-lg"
                />
                {errors.ConfirmPassword && <p className="text-red-500 text-sm">{errors.ConfirmPassword}</p>}
              </div>
              </div>

            {/* Address Section */}
            <h3 className="text-xl font-bold">Address Details</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">City/Village</label>
                <input
                    type="text"
                    value={adminData.adminAddress.cityVillage}
                    onChange={(e) => setAdminData((prev) => ({
                      ...prev,
                      adminAddress: { ...prev.adminAddress, cityVillage: e.target.value }
                    }))}
                    className="w-full p-2 border rounded-lg"
                  />
                  {errors.cityVillage && <p className="text-red-500 text-sm">{errors.cityVillage}</p>}

              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Pincode</label>
                <input
                  type="number"
                  value={adminData.adminAddress.pincode}
                  onChange={(e) => setAdminData((prev) => ({ ...prev, adminAddress: { ...prev.adminAddress, pincode: e.target.value } }))}
                  className="w-full p-2 border rounded-lg"
                />
                {errors.pincode && <p className="text-red-500 text-sm">{errors.pincode}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">State</label>
                <input
                  type="text"
                  value={adminData.adminAddress.state}
                  onChange={(e) => setAdminData((prev) => ({ ...prev, adminAddress: { ...prev.adminAddress, state: e.target.value } }))}
                  className="w-full p-2 border rounded-lg"
                />
                {errors.state && <p className="text-red-500 text-sm">{errors.state}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Country</label>
                <input
                  type="text"
                  value={adminData.adminAddress.country}
                  onChange={(e) => setAdminData((prev) => ({ ...prev, adminAddress: { ...prev.adminAddress, country: e.target.value } }))}
                  className="w-full p-2 border rounded-lg"
                />
                {errors.country && <p className="text-red-500 text-sm">{errors.country}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Street/Society</label>
              <input
                type="text"
                value={adminData.adminAddress.streetOrSociety}
                onChange={(e) => setAdminData((prev) => ({ ...prev, adminAddress: { ...prev.adminAddress, streetOrSociety: e.target.value } }))}
                className="w-full p-2 border rounded-lg"
              />
              {errors.streetOrSociety && <p className="text-red-500 text-sm">{errors.streetOrSociety}</p>}
            </div>

            <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
              Add Admin User
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
    </motion.div>
    </div>
  );
};

export default AddAdmin;
