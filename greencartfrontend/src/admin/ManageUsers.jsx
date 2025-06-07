import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  User, Mail, Phone, Key, Shield, Edit2, Trash2, Search, 
  UserPlus, RefreshCw, AlertCircle 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/Dialog";
import { Input } from "../components/ui/Input";
import { Switch } from "../components/ui/Switch"; 
import { Label } from "../components/ui/Label";
import AdminNavbar from "../components/AdminNavigation";
import { motion, AnimatePresence } from "framer-motion";
import { Toast } from "../components/ui/Toast";
import { NavLink } from "react-router-dom";
import Notification from '../components/ui/notification/Notification';
import { fetchAllUsers, addNewUser, deleteUserById, fetchAdminRoleById, fetchCurrentUser,updateAdminRoleById } from "../api";

const ManageUsers = () => {
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notification, setNotification] = useState({ message: '', type: '', show: false });

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserType, setSelectedUserType] = useState("all");
  const [editingUser, setEditingUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [showDeleteConfirmDialog, setShowDeleteConfirmDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [currentLoggedInUser, setCurrentLoggedInUser] = useState(null);
  const [showEditRoleDialog, setShowEditRoleDialog] = useState(false);
  const [adminToEditRole, setAdminToEditRole] = useState(null);
 
  const [formData, setFormData] = useState({
    UserName: "",
    UserEmail: "",
    UserType: "Admin",
    Password: "",
    role: "Admin", // Default role for admin users
    active: true,
    adminContact: "",
  });

  // Define roles and user types
  const roles = {
    Manager: { label: "Manager", color: "bg-purple-100 text-purple-800" },
    Admin: { label: "Admin", color: "bg-green-100 text-green-800" },
  };
  
  const userTypes = {
    Customer: { label: "Customer", color: "bg-green-100 text-green-800" },
    Admin: { label: "Admin", color: "bg-blue-100 text-blue-800" },
  };

    // Custom notification function
    const showNotification = (message, type = 'success') => {
      setNotification({ message, type, show: true });
      setTimeout(() => setNotification({ message: "", type: "", show: false }), 3000);
    };

    useEffect(() => {
      const loadUsers = async () => {
        try {
          const res = await fetchCurrentUser();
          setCurrentLoggedInUser(res.data);
          console.log(res.data);
        } catch (err) {
          showNotification("Failed to fetch current user information", "error");
        }
    
        fetchUsers();
      };
    
      loadUsers();
    }, []);

    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await fetchAllUsers();
        let fetchedUsers = response.data.users;
    
        const updatedUsers = await Promise.all(
          fetchedUsers.map(async (user) => {
            if (user.UserType !== "Admin") return user;
    
            try {
              const roleRes = await fetchAdminRoleById(user._id);
              return { ...user, role: roleRes.data.role };
            } catch {
              return { ...user, role: "N/A" };
            }
          })
        );
    
        setUsers(updatedUsers);
      } catch {
        showNotification("Failed to fetch users", "error");
      } finally {
        setIsLoading(false);
      }
    };

    const handleAddUser = async (e) => {
      e.preventDefault();
      try {
        const dataToSend = formData.UserType === "Admin"
          ? {
              ...formData,
              adminName: formData.UserName,
              adminEmail: formData.UserEmail,
              password: formData.Password,
            }
          : formData;
    
        await addNewUser(dataToSend);
    
        showNotification(`${formData.UserType} added successfully`, "success");
        setShowAddDialog(false);
        fetchUsers();
        setFormData({
          UserName: "",
          UserEmail: "",
          UserType: "Admin",
          Password: "",
          role: "admin",
          active: true,
          adminContact: "",
        });
      } catch (error) {
        showNotification(error.response?.data?.message || "Failed to add user", "error");
      }
    };

    const handleDeleteUser = async () => {
      if (!userToDelete) return;
    
      try {
        const response = await deleteUserById(userToDelete._id);
        console.log("API Response:", response);
        showNotification("User deleted successfully", "success");
        setShowDeleteConfirmDialog(false);
        setUserToDelete(null);
        fetchUsers();
      } catch (error) {
        showNotification(error.response?.data?.message || "Failed to delete user", "error");
      }
    };
    

// Filter users based on search term and selected user type
useEffect(() => {
  let result = [...users];

  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    result = result.filter(
      user => 
        user.UserName.toLowerCase().includes(term) || 
        user.UserEmail.toLowerCase().includes(term)
    );
  }

  if (selectedUserType !== "all") {
    result = result.filter(user => user.UserType === selectedUserType);
  }

  setFilteredUsers(result);
}, [users, searchTerm, selectedUserType]);
 
const handleInputChange = (event) => {
  const { name, value, type, checked } = event.target;
  setFormData((prev) => ({
    ...prev,
    [name]: type === "checkbox" ? checked : value,
  }));
};

// Open edit role dialog for admin
const openEditRoleDialog = (admin) => {
  if (!canEditAdminRole(admin)) {
    showNotification("You don't have permission to edit this admin's role", "error");
    return;
  }
  
  setAdminToEditRole(admin);
  setFormData(prev => ({
    ...prev,
    role: admin.role || "Admin"
  }));
  setShowEditRoleDialog(true);
};

useEffect(() => {
  console.log("Delete Confirm Dialog State:", showDeleteConfirmDialog);
}, [showDeleteConfirmDialog]);

  // Check if current user can delete another user
  const canDeleteUser = (userToDelete) => {
    if (!currentLoggedInUser || !userToDelete) {
      return false;
    }
    if (currentLoggedInUser._id === userToDelete._id) {
      return false; 
    }
    if (userToDelete.UserType === "Customer") {
      return true;
    }
    if (currentLoggedInUser.admin.role === "Admin" && 
        userToDelete.role === "Manager") {
      return true;
    }
  
    return false;
  };
 
// Confirm delete user dialog
const confirmDeleteUser = (user) => {
  console.log("Delete button clicked for user:", user);
  
  if (!canDeleteUser(user)) {
    showNotification("You don't have permission to delete this user", "error");
    return;
  }

  setUserToDelete(user);
  console.log("User set for deletion:", user);
  setShowDeleteConfirmDialog(true);
};

const handleUpdateAdminRole = async (e) => {
  e.preventDefault();

  if (!adminToEditRole || !formData.role) {
    showNotification("Invalid data provided", "error");
    return;
  }

  try {
    const res = await updateAdminRoleById(adminToEditRole._id, formData.role);
    showNotification(res.data.message, "success");
    fetchUsers();
    setShowEditRoleDialog(false);
    setAdminToEditRole(null);
  } catch (error) {
    console.error("Update role error:", error.response?.data || error.message);
    showNotification(error.response?.data?.message || "Failed to update admin role", "error");
  }
};

useEffect(() => {
  const fetchAdminRoles = async () => {
    try {
      const updatedUsers = await Promise.all(users.map(async (user) => {
        if (user.UserType !== "Admin") return user;

        try {
          const res = await fetchAdminRoleById(user._id);
          return { ...user, role: res.data.role };
        } catch {
          return { ...user, role: "N/A" };
        }
      }));

      setFilteredUsers(updatedUsers);
    } catch (error) {
      console.error("Error fetching admin roles:", error);
    }
  };

  if (users.length > 0) fetchAdminRoles();
}, [users]);

// Check if current user can edit another admin's role
const canEditAdminRole = (adminToEdit) => {
  if (!currentLoggedInUser || !adminToEdit) return false;
  if (currentLoggedInUser.user._id === adminToEdit._id) return false; // Can't edit own role
  // Only users with admin role can edit manager role
  if (currentLoggedInUser.admin.role === "Admin" && adminToEdit.role === "Manager") {
    return true;
  }
  
  return false;
};

  return (
    <div className="min-h-screen bg-gray-50">
      <AnimatePresence>
        {notification.show && (
          <motion.div
            className="fixed top-0 left-0 w-full flex justify-center z-[1000]"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
          >
            <Notification
              message={notification.message}
              type={notification.type}
              onClose={() => setNotification({ message: "", type: "", show: false })}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <AdminNavbar />
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }} 
        className="w-full py-8 mt-16"
      >
        {/* Page Header */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 px-4 sm:px-6 lg:px-8"
        >
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manage Users</h1>
            <p className="mt-1 text-sm text-gray-500">
              Add, edit, or manage user accounts and their roles
            </p>
          </div>
          <Button 
            onClick={() => {
              setFormData({
                UserName: "",
                UserEmail: "",
                UserType: "Admin",
                Password: "",
                role: "admin",
                active: true,
                adminContact: "",
              });

              setShowAddDialog(true);
              console.log("showAddDialog state after click:", showAddDialog);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2"
          >
            <UserPlus className="h-4 w-4" />
            <span>Add New User</span>
          </Button>

        </motion.div>

        {/* Search and Filter */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6 flex flex-col sm:flex-row gap-4 px-4 sm:px-6 lg:px-8"
        >
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 pl-10 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
            <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
          </div>

          <select
            value={selectedUserType}
            onChange={(e) => setSelectedUserType(e.target.value)}
            className="p-3 border rounded-lg shadow-sm min-w-[200px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          >
            <option value="all">All User Types</option>
            {Object.entries(userTypes).map(([key, { label }]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
          
          <Button 
            onClick={fetchUsers} 
            variant="outline" 
            className="flex items-center space-x-2 whitespace-nowrap"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </Button>
        </motion.div>

        {/* Users Table */}
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
                  <CardTitle className="text-lg">Users List</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {filteredUsers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <AlertCircle className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-gray-500 text-center">No users found.</p>
                      <p className="text-gray-400 text-sm text-center mt-1">
                        {searchTerm || selectedUserType !== "all" 
                          ? "Try adjusting your search or filter criteria." 
                          : "Start by adding new users."
                        }
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr className="border-b">
                            <th className="text-left p-4 text-gray-600 font-medium">User</th>
                            <th className="text-left p-4 text-gray-600 font-medium">User Type</th>
                            {selectedUserType === "Admin" && (
                              <th className="text-left p-4 text-gray-600 font-medium">Admin Role</th>
                            )}
                            <th className="text-right p-4 text-gray-600 font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredUsers.map((user) => (
                            <motion.tr 
                              key={user._id} 
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
                                    {user.UserName.charAt(0).toUpperCase()}
                                  </div>
                                  <div className="ml-3">
                                    <p className="font-medium">{user.UserName}</p>
                                    <p className="text-sm text-gray-500">{user.UserEmail}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4">
                                <span className={`px-3 py-1 rounded-full text-sm ${userTypes[user.UserType]?.color || "bg-gray-100 text-gray-800"}`}>
                                  {userTypes[user.UserType]?.label || "Unknown"}
                                </span>
                              </td>
                              {selectedUserType === "Admin" && (
                                <td className="p-4">
                                  <span className={`px-3 py-1 rounded-full text-sm ${roles[user.role]?.color || "bg-gray-100 text-gray-800"}`}>
                                  {roles[user.role]?.label || "Unknown"}
                                  </span>
                                </td>
                              )}
                              <td className="p-4">
                                <div className="flex space-x-2 justify-end"> 
                                  {user.UserType === "Admin" && (
                                    <motion.button
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.95 }}
                                      onClick={() => openEditRoleDialog(user)}
                                      className={`p-2 ${canEditAdminRole(user) ? "text-purple-600 hover:bg-purple-50" : "text-gray-400 cursor-not-allowed"} rounded-lg transition-colors`}
                                      title="Change Role"
                                      disabled={!canEditAdminRole(user)}
                                    >
                                      <Shield className="h-5 w-5" />
                                    </motion.button>
                                  )}
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => confirmDeleteUser(user)}
                                    className={`p-2 ${canDeleteUser(user) ? "text-red-600 hover:bg-red-50" : "text-gray-400 cursor-not-allowed"} rounded-lg transition-colors`}
                                    title="Delete User"
                                    disabled={!canDeleteUser(user)}
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
        
        {/* Add User Dialog */}
        <Dialog
          isOpen={showAddDialog}
          onClose={() => setShowAddDialog(false)}
          title={formData.UserType === "Admin" ? "Add New Administrator" : "Add New Customer"}
          maxWidth="md"
        >
          <form onSubmit={handleAddUser}>
            <DialogContent>
              <div className="grid gap-4">
                {/* User Type Selection */}
                <div className="grid gap-2">
                  <Label htmlFor="UserType">User Type</Label>
                  <select
                    id="UserType"
                    name="UserType"
                    value={formData.UserType}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                  >
                    {Object.entries(userTypes).map(([key, { label }]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>

                {/* Full Name */}
                <div className="grid gap-2">
                  <Label htmlFor="UserName">Full Name</Label>
                  <Input
                    id="UserName"
                    name="UserName"
                    placeholder="John Doe"
                    value={formData.UserName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Email */}
                <div className="grid gap-2">
                  <Label htmlFor="UserEmail">Email</Label>
                  <Input
                    id="UserEmail"
                    name="UserEmail"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.UserEmail}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Admin-Specific Fields */}
                {formData.UserType === "Admin" && (
                  <>
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
                  </>
                )}

                {/* Password */}
                <div className="grid gap-2">
                  <Label htmlFor="Password">Password</Label>
                  <Input
                    id="Password"
                    name="Password"
                    type="password"
                    placeholder="Set a secure password"
                    value={formData.Password}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Confirm Password */}
                <div className="grid gap-2">
                  <Label htmlFor="ConfirmPassword">Confirm Password</Label>
                  <Input
                    id="ConfirmPassword"
                    name="ConfirmPassword"
                    type="password"
                    placeholder="Re-enter your password"
                    value={formData.ConfirmPassword}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </DialogContent>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {formData.UserType === "Admin" ? "Create Admin" : "Create Customer"}
              </Button>
            </DialogFooter>
          </form>
        </Dialog>

        {/* Edit Admin Role Dialog */}
        <Dialog isOpen={showEditRoleDialog} onClose={() => setShowEditRoleDialog(false)} title="Change Admin Role" maxWidth="md">
          {adminToEditRole && (
            <form onSubmit={handleUpdateAdminRole}>
              <DialogContent>
                <p className="text-sm text-gray-500 mb-4">
                  Changing role for: <span className="font-medium text-gray-700">{adminToEditRole.UserName}</span>
                </p>

                <div className="grid gap-2">
                  <Label htmlFor="edit-role">Admin Role</Label>
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
              </DialogContent>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowEditRoleDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit">Update Role</Button>
              </DialogFooter>
            </form>
          )}
        </Dialog>

        {/* Delete Confirmation Dialog */}
        {showDeleteConfirmDialog && <p>Dialog is Open</p>}
        <Dialog 
          isOpen={showDeleteConfirmDialog} 
          onClose={() => setShowDeleteConfirmDialog(false)} 
          title="Confirm Deletion"
        >
          <p className="text-gray-900">Are you sure you want to delete this user?</p>

          <div className="flex justify-end gap-4 mt-4">
            <button 
              onClick={() => setShowDeleteConfirmDialog(false)} 
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            
            <button 
              onClick={handleDeleteUser} 
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Delete
            </button>
          </div>
        </Dialog>

      </motion.div>
    </div>
  );
};

export default ManageUsers;