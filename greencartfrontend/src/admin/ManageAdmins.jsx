import React, { useState } from 'react';
import { User, Mail, Phone, Key, Shield, Edit2, Trash2, Search } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';

const ManageAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [editingAdmin, setEditingAdmin] = useState(null);

  const roles = {
    editor: { label: 'Editor', color: 'bg-blue-100 text-blue-800' },
    manager: { label: 'Manager', color: 'bg-purple-100 text-purple-800' },
    admin: { label: 'Admin', color: 'bg-green-100 text-green-800' },
    super_admin: { label: 'Super Admin', color: 'bg-red-100 text-red-800' }
  };

  const handleUpdateRole = (adminId, newRole) => {
    // Update admin role logic
  };

  const handleDeleteAdmin = (adminId) => {
    // Delete admin logic
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
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
                {admins.map(admin => (
                  <tr key={admin.id} className="border-b">
                    <td className="p-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="h-6 w-6 text-gray-500" />
                        </div>
                        <div className="ml-3">
                          <p className="font-medium">{admin.name}</p>
                          <p className="text-sm text-gray-500">{admin.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      {editingAdmin === admin.id ? (
                        <select
                          value={admin.role}
                          onChange={(e) => handleUpdateRole(admin.id, e.target.value)}
                          className="p-1 border rounded"
                        >
                          {Object.entries(roles).map(([key, { label }]) => (
                            <option key={key} value={key}>{label}</option>
                          ))}
                        </select>
                      ) : (
                        <span className={`px-3 py-1 rounded-full text-sm ${roles[admin.role].color}`}>
                          {roles[admin.role].label}
                        </span>
                      )}
                    </td>
                    <td className="p-4">{admin.contact}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        admin.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {admin.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditingAdmin(admin.id === editingAdmin ? null : admin.id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <Edit2 className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteAdmin(admin.id)}
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
    </div>
  );
};

export default ManageAdmins;