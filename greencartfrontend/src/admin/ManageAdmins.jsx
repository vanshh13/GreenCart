import React, { useState, useEffect } from "react";
import { User, Mail, Phone, Key, Shield, Edit2, Trash2, Search, UserPlus, RefreshCw, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/Dialog";
import { Input } from "../components/ui/Input";
import { Switch } from "../components/ui/Switch";
import { Select } from "../components/ui/Select";
import { Label } from "../components/ui/Label";
import AdminNavbar from "../components/AdminNavigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "../components/ui/Toast";
import { NavLink } from "react-router-dom";

const API_URL = "http://localhost:5000/api/admins"; // Update with your backend URL

const ManageAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [filteredAdmins, setFilteredAdmins] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [formData, setFormData] = useState({
    adminName: "",
    adminEmail: "",
    adminContact: "",
    role: "admin",
    active: true,
    password: "", // Only for new admins
  });

  const [notificationMessage, setNotificationMessage] = useState("");
  const [showNotification, setShowNotification] = useState(false);

  const roles = {
    manager: { label: "Manager", color: "bg-purple-100 text-purple-800" },
    admin: { label: "Admin", color: "bg-green-100 text-green-800" },
    // moderator: { label: "Moderator", color: "bg-blue-100 text-blue-800" },
    // viewer: { label: "Viewer", color: "bg-gray-100 text-gray-800" },
  };

  // Fetch all admins when component mounts
  useEffect(() => {
    fetchAdmins();
  }, []);

  // Filter admins based on search term and selected role
  useEffect(() => {
    let result = [...admins];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        admin => 
          admin.adminName.toLowerCase().includes(term) || 
          admin.adminEmail.toLowerCase().includes(term) ||
          admin.adminContact?.includes(term)
      );
    }
    
    if (selectedRole !== "all") {
      result = result.filter(admin => admin.role === selectedRole);
    }
    
    setFilteredAdmins(result);
  }, [admins, searchTerm, selectedRole]);

  const fetchAdmins = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });
      const data = await response.json();
      if (response.ok) {
        setAdmins(data);
      } else {
        setNotificationMessage(data.message || "Failed to fetch admins");
        setShowNotification(true);
      }
    } catch (error) {
      setNotificationMessage("Failed to connect to the server");
      setShowNotification(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Add New Admin
  const handleAddAdmin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setNotificationMessage("Admin added successfully");
        setShowNotification(true);
        setShowAddDialog(false);
        fetchAdmins();
        // Reset form
        setFormData({
          adminName: "",
          adminEmail: "",
          adminContact: "",
          role: "admin",
          active: true,
          password: "",
        });
      } else {
        setNotificationMessage(data.message || "Failed to add admin");
        setShowNotification(true);
      }
    } catch (error) {
      setNotificationMessage("Something went wrong");
      setShowNotification(true);
    }
  };

  // Update Admin
  const handleUpdateAdmin = async (e) => {
    e.preventDefault();
    try {
      const { password, ...updateData } = formData;
      const response = await fetch(`${API_URL}/${currentAdmin._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(updateData),
      });
      
      if (response.ok) {
        setNotificationMessage("Admin updated successfully");
        setShowNotification(true);
        setShowEditDialog(false);
        fetchAdmins();
      } else {
        const data = await response.json();
        setNotificationMessage(data.message || "Failed to update admin");
        setShowNotification(true);
      }
    } catch (error) {
      setNotificationMessage("Something went wrong");
      setShowNotification(true);
    }
  };

  // Update Admin Role
  const handleUpdateRole = async (adminId, newRole) => {
    try {
      const response = await fetch(`${API_URL}/${adminId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        setNotificationMessage("Role updated successfully");
        setShowNotification(true);
        fetchAdmins();
        setEditingAdmin(null);
      } else {
        setNotificationMessage("Failed to update role");
        setShowNotification(true);
      }
    } catch (error) {
      setNotificationMessage("Network error occurred");
      setShowNotification(true);
    }
  };

  // Delete Admin
  const handleDeleteAdmin = async (adminId) => {
    if (!window.confirm("Are you sure you want to delete this admin?")) return;

    try {
      const response = await fetch(`${API_URL}/${adminId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });

      if (response.ok) {
        setNotificationMessage("Admin deleted successfully");
        setShowNotification(true);
        fetchAdmins();
      } else {
        setNotificationMessage("Failed to delete admin");
        setShowNotification(true);
      }
    } catch (error) {
      setNotificationMessage("Network error occurred");
      setShowNotification(true);
    }
  };

  // Open edit dialog and populate form
  const openEditDialog = (admin) => {
    setCurrentAdmin(admin);
    setFormData({
      adminName: admin.adminName,
      adminEmail: admin.adminEmail,
      adminContact: admin.adminContact || "",
      role: admin.role,
      active: admin.active,
      password: "", // Empty password field for edit
    });
    setShowEditDialog(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
  <AdminNavbar />
  <motion.div 
    initial={{ opacity: 0, y: 20 }} 
    animate={{ opacity: 1, y: 0 }} 
    transition={{ duration: 0.5 }} 
    className="w-full py-8 mt-16" // Removed max-w-7xl and adjusted padding
  >
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 px-4 sm:px-6 lg:px-8" // Added padding here for inner content
    >
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Manage Administrators</h1>
        <p className="mt-1 text-sm text-gray-500">
          Add, edit or remove admin users and manage their permissions
        </p>
      </div>
      <NavLink to="/admin/users/add/">
        <Button 
          onClick={() => setShowAddDialog(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2"
        >
          <UserPlus className="h-4 w-4" />
          <span>Add New Admin</span>
        </Button>
      </NavLink>
    </motion.div>

    {/* Search and Filter */}
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mb-6 flex flex-col sm:flex-row gap-4 px-4 sm:px-6 lg:px-8" // Added padding here for inner content
    >
      <div className="flex-1 relative">
        <input
          type="text"
          placeholder="Search by name, email or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 pl-10 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        />
        <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
      </div>

      <select
        value={selectedRole}
        onChange={(e) => setSelectedRole(e.target.value)}
        className="p-3 border rounded-lg shadow-sm min-w-[200px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
      >
        <option value="all">All Roles</option>
        {Object.entries(roles).map(([key, { label }]) => (
          <option key={key} value={key}>{label}</option>
        ))}
      </select>
      
      <Button 
        onClick={fetchAdmins} 
        variant="outline" 
        className="flex items-center space-x-2 whitespace-nowrap"
      >
        <RefreshCw className="h-4 w-4" />
        <span>Refresh</span>
      </Button>
    </motion.div>

    {/* Admins Table */}
    <AnimatePresence>
      {isLoading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex justify-center items-center h-64"
        >
          <RefreshCw className="h-8 w-8 text-blue-600 animate-spin" />
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="w-full overflow-hidden px-4 sm:px-6 lg:px-8">
                <CardHeader className="bg-gray-50">
                  <CardTitle className="text-lg">Administrator List</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {filteredAdmins.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <AlertCircle className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-gray-500 text-center">No administrators found.</p>
                      <p className="text-gray-400 text-sm text-center mt-1">
                        {searchTerm || selectedRole !== "all" 
                          ? "Try adjusting your search or filter criteria." 
                          : "Start by adding new administrators."
                        }
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr className="border-b">
                            <th className="text-left p-4 text-gray-600 font-medium">Admin</th>
                            <th className="text-left p-4 text-gray-600 font-medium">Role</th>
                            <th className="text-left p-4 text-gray-600 font-medium">Contact</th>
                            <th className="text-left p-4 text-gray-600 font-medium">Status</th>
                            <th className="text-right p-4 text-gray-600 font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredAdmins.map((admin) => (
                            <motion.tr 
                              key={admin._id} 
                              className="border-b hover:bg-gray-50 transition-colors"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              layout
                              transition={{ duration: 0.2 }}
                            >
                              <td className="p-4">
                                <div className="flex items-center">
                                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white">
                                    {admin.adminName.charAt(0).toUpperCase()}
                                  </div>
                                  <div className="ml-3">
                                    <p className="font-medium">{admin.adminName}</p>
                                    <p className="text-sm text-gray-500">{admin.adminEmail}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4">
                                {editingAdmin === admin._id ? (
                                  <select
                                    value={admin.role}
                                    onChange={(e) => handleUpdateRole(admin._id, e.target.value)}
                                    className="p-1 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                  >
                                    {Object.entries(roles).map(([key, { label }]) => (
                                      <option key={key} value={key}>{label}</option>
                                    ))}
                                  </select>
                                ) : (
                                  <span className={`px-3 py-1 rounded-full text-sm ${roles[admin.role]?.color || "bg-gray-100 text-gray-800"}`}>
                                    {roles[admin.role]?.label || "Unknown"}
                                  </span>
                                )}
                              </td>
                              <td className="p-4">
                                {admin.adminContact || <span className="text-gray-400 text-sm">Not provided</span>}
                              </td>
                              <td className="p-4">
                                <span className={`px-3 py-1 rounded-full text-sm ${admin.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                                  {admin.active ? "Active" : "Inactive"}
                                </span>
                              </td>
                              <td className="p-4">
                                <div className="flex space-x-2 justify-end">
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => openEditDialog(admin)}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    title="Edit Admin"
                                  >
                                    <Edit2 className="h-5 w-5" />
                                  </motion.button>
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setEditingAdmin(admin._id === editingAdmin ? null : admin._id)}
                                    className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                    title="Edit Role"
                                  >
                                    <Shield className="h-5 w-5" />
                                  </motion.button>
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleDeleteAdmin(admin._id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Delete Admin"
                                  >
                                    <Trash2 className="h-5 w-5" />
                                  </motion.button>
                                </div>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      
        {/* Add Admin Dialog */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Administrator</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddAdmin}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="adminName">Full Name</Label>
                  <Input
                    id="adminName"
                    name="adminName"
                    placeholder="John Doe"
                    value={formData.adminName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="adminEmail">Email</Label>
                  <Input
                    id="adminEmail"
                    name="adminEmail"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.adminEmail}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="adminContact">Phone Number</Label>
                  <Input
                    id="adminContact"
                    name="adminContact"
                    placeholder="+1 (555) 123-4567"
                    value={formData.adminContact}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Initial Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Set a secure password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role">Role</Label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                  >
                    {Object.entries(roles).map(([key, { label }]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="active"
                    name="active"
                    checked={formData.active}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, active: checked }))
                    }
                  />
                  <Label htmlFor="active">Active Account</Label>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Admin</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Admin Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Administrator</DialogTitle>
            </DialogHeader>
            {currentAdmin && (
              <form onSubmit={handleUpdateAdmin}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-adminName">Full Name</Label>
                    <Input
                      id="edit-adminName"
                      name="adminName"
                      placeholder="John Doe"
                      value={formData.adminName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-adminEmail">Email</Label>
                    <Input
                      id="edit-adminEmail"
                      name="adminEmail"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.adminEmail}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-adminContact">Phone Number</Label>
                    <Input
                      id="edit-adminContact"
                      name="adminContact"
                      placeholder="+1 (555) 123-4567"
                      value={formData.adminContact}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-role">Role</Label>
                    <select
                      id="edit-role"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                    >
                      {Object.entries(roles).map(([key, { label }]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="edit-active"
                      name="active"
                      checked={formData.active}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({ ...prev, active: checked }))
                      }
                    />
                    <Label htmlFor="edit-active">Active Account</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setShowEditDialog(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Update Admin</Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
};

export default ManageAdmins;