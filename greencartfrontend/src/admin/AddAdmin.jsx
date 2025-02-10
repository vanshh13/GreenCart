import React, { useState } from 'react';
import { User, Mail, Phone, Key, Shield, Edit2, Trash2, Search } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';

const AddAdmin = () => {
    const [adminData, setAdminData] = useState({
      name: '',
      email: '',
      contact: '',
      password: '',
      confirmPassword: '',
      role: 'editor'
    });
  
    const [errors, setErrors] = useState({});
  
    const validateForm = () => {
      const newErrors = {};
      if (!adminData.name) newErrors.name = 'Name is required';
      if (!adminData.email) newErrors.email = 'Email is required';
      if (!adminData.password) newErrors.password = 'Password is required';
      if (adminData.password !== adminData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      if (validateForm()) {
        // Submit admin data
      }
    };
  
    return (
      <div className="max-w-2xl mx-auto p-4">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-6">Add New Admin</h2>
  
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    value={adminData.name}
                    onChange={(e) => setAdminData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full p-2 pl-10 border rounded-lg"
                  />
                  <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
              </div>
  
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <div className="relative">
                  <input
                    type="email"
                    value={adminData.email}
                    onChange={(e) => setAdminData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full p-2 pl-10 border rounded-lg"
                  />
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              </div>
  
              <div>
                <label className="block text-sm font-medium mb-2">Contact Number</label>
                <div className="relative">
                  <input
                    type="tel"
                    value={adminData.contact}
                    onChange={(e) => setAdminData(prev => ({ ...prev, contact: e.target.value }))}
                    className="w-full p-2 pl-10 border rounded-lg"
                  />
                  <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
  
              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <div className="relative">
                  <input
                    type="password"
                    value={adminData.password}
                    onChange={(e) => setAdminData(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full p-2 pl-10 border rounded-lg"
                  />
                  <Key className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
                {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
              </div>
  
              <div>
                <label className="block text-sm font-medium mb-2">Confirm Password</label>
                <div className="relative">
                  <input
                    type="password"
                    value={adminData.confirmPassword}
                    onChange={(e) => setAdminData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full p-2 pl-10 border rounded-lg"
                  />
                  <Key className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
              </div>
  
              <div>
                <label className="block text-sm font-medium mb-2">Role</label>
                <div className="relative">
                  <select
                    value={adminData.role}
                    onChange={(e) => setAdminData(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full p-2 pl-10 border rounded-lg"
                  >
                    <option value="editor">Editor</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                  <Shield className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
  
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
              >
                Add Admin User
              </button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  };

export default AddAdmin;