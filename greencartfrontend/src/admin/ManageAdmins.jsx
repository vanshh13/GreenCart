import React, { useState, useEffect } from "react";
import { User, Mail, Phone, Key, Shield, Edit2, Trash2, Search } from "lucide-react";
import { Card, CardContent } from "../components/ui/Card";
import AdminNavbar from "../components/AdminNavigation";
import { motion } from "framer-motion";

const API_URL = "http://localhost:5000/api/admins"; // Update with your backend URL

const ManageAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [editingAdmin, setEditingAdmin] = useState(null);

  const roles = {
    manager: { label: "Manager", color: "bg-purple-100 text-purple-800" },
    admin: { label: "Admin", color: "bg-green-100 text-green-800" },
  };

  // Fetch all admins when component mounts
  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await fetch(`${API_URL}/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });
      const data = await response.json();
      if (response.ok) {
        setAdmins(data);
      } else {
        console.error("Error fetching admins:", data.message);
      }
    } catch (error) {
      console.error("Failed to fetch admins:", error);
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
        fetchAdmins(); // Refresh the list after updating
      } else {
        console.error("Failed to update role");
      }
    } catch (error) {
      console.error("Error updating role:", error);
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
        fetchAdmins(); // Refresh after delete
      } else {
        console.error("Failed to delete admin");
      }
    } catch (error) {
      console.error("Error deleting admin:", error);
    }
  };

  return (
    <div>
    <AdminNavbar/>
    <motion.div 
        initial={{ opacity: 0, y: 50 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }} 
        className=" max-w-10xl mx-auto mt-24 p-6 rounded-lg">
      {/* Search and Filter */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search admins..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 pl-10 border rounded-lg"
          />
          <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
        </div>

        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="p-3 border rounded-lg min-w-[200px]"
        >
          <option value="all">All Roles</option>
          {Object.entries(roles).map(([key, { label }]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      {/* Admins Table */}
      <Card>
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">Admin</th>
                  <th className="text-left p-4">Role</th>
                  <th className="text-left p-4">Contact</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin) => (
                  <tr key={admin._id} className="border-b">
                    <td className="p-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="h-6 w-6 text-gray-500" />
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
                          className="p-1 border rounded"
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
                    <td className="p-4">{admin.adminContact}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${admin.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                        {admin.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditingAdmin(admin._id === editingAdmin ? null : admin._id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <Edit2 className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteAdmin(admin._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
    </div>
  );
};

export default ManageAdmins;
