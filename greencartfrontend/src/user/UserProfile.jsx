import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { User, Mail, Phone, MapPin, Camera, Edit2, Save, X, Calendar, Instagram, Facebook, Twitter, Globe, Gift, Lock, Shield, Bell, Package } from 'lucide-react';
import Logout from '../components/authentication/Logout';
import { fetchOrderByUser, updateOrderStatus } from '../api';
import Notification from "../components/ui/notification/Notification";
import axios from 'axios';

const UserProfile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState('profile');
  const [notification, setNotification] = useState(null);
  const [confirmCancel, setConfirmCancel] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userTypeData, setUserTypeData] = useState(null);
  const [userType, setUserType] = useState('');
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Unified form state for both admin and customer
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    role: '',
    avatar: '/api/placeholder/150/150',
    social: {
      instagram: '',
      facebook: '',
      twitter: '',
      website: ''
    },
    preferences: {
      newsletter: true,
      notifications: true,
      twoFactor: false,
    }
  });

  const fetchUserDetails = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      // Get user ID from token or localStorage
      const userId = localStorage.getItem("userId"); // Ensure you store userId when logging in
      
      const res = await axios.get(`http://localhost:5000/api/users/getuserdetails/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      
      const { user, userType, userTypeData } = res.data;
      setUserData(user);
      setUserTypeData(userTypeData);
      setUserType(userType);
      
      // Initialize form data based on user type
      setUserForm({
        name: user.UserName,
        email: user.UserEmail,
        phone: userType === 'customer' ? userTypeData?.CustomerContact || '' : userTypeData?.adminContact || '',
        address: userType === 'customer' ? 
          (userTypeData?.CustomerAddress && userTypeData.CustomerAddress.length > 0 ? 
            formatAddress(userTypeData.CustomerAddress[0]) : 'No address provided') : 
          (userTypeData?.adminAddress ? formatAddress(userTypeData.adminAddress) : 'No address provided'),
        role: userType === 'admin' ? userTypeData?.role || 'Manager' : '',
        avatar: userTypeData?.Image || '/api/placeholder/150/150',
        social: {
          instagram: '',
          facebook: '',
          twitter: '',
          website: ''
        },
        preferences: {
          newsletter: true,
          notifications: true,
          twoFactor: false,
        }
      });
    } catch (error) {
      console.error("Error fetching user details:", error);
      setNotification({ message: "Failed to load user data", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to format address
  const formatAddress = (addressObj) => {
    if (!addressObj) return 'No address provided';
    
    // Check if it's just a reference ID
    if (typeof addressObj === 'string') return 'Address details not available';
    
    // Format the address if it's a populated object
    const { street, city, state, zipCode, country, fullAddress } = addressObj;
    
    if (fullAddress) return fullAddress;
    
    if (street || city || state || zipCode || country) {
      return [street, city, state, zipCode, country]
        .filter(Boolean)
        .join(', ');
    }
    
    return 'No address details available';
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  // Fetch orders when the "Orders" section is active
  useEffect(() => {
    if (activeSection === 'orders' && userType === 'customer') {
      fetchOrders();
    }
  }, [activeSection, userType]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetchOrderByUser(token);
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setNotification({ message: "Failed to load orders", type: "error" });
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setUserForm(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setUserForm(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");
      
      // Prepare data based on user type
      const updateData = {
        UserName: userForm.name,
        UserEmail: userForm.email,
        ...(userType === 'customer' ? {
          CustomerContact: userForm.phone,
          // Address updates would require special handling
        } : {
          adminContact: userForm.phone,
          // Admin address update logic
        })
      };

      await axios.put(`http://localhost:5000/api/users/updateuser/`, updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setNotification({ message: "Profile updated successfully!", type: "success" });
      setIsEditing(false);
      fetchUserDetails(); // Refresh user data
    } catch (error) {
      console.error("Error updating profile:", error);
      setNotification({ message: "Failed to update profile", type: "error" });
    }
  };

  // Determine which sections to show based on user type
  const sections = [
    { id: 'profile', label: 'Profile', icon: User },
    ...(userType === 'customer' ? [{ id: 'orders', label: 'Orders', icon: Package }] : [])
  ];

  const handleCancelClick = (orderId) => {
    setConfirmCancel(orderId);
    setNotification({
      message: "Are you sure you want to cancel this order?",
      type: "confirm",
    });
  };
  
  const onCancelConfirmed = async () => {
    if (!confirmCancel) return;
    const token = localStorage.getItem("authToken");
  
    try {
      await updateOrderStatus(token, confirmCancel, "Cancelled");
      setNotification({ message: "Order canceled successfully!", type: "success" });
      fetchOrders();
    } catch (error) {
      console.error("Error canceling order:", error);
      setNotification({ message: "Failed to cancel order. Please try again.", type: "error" });
    }
    setConfirmCancel(null);
  };
  
  const onCancelRejected = () => {
    setConfirmCancel(null);
    setNotification(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-green-500">Loading user profile...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-8 animate-fadeIn">
      {notification && (
        <Notification 
          message={notification.message} 
          type={notification.type} 
          onClose={() => setNotification(null)}
          onConfirm={confirmCancel ? onCancelConfirmed : null}
          onReject={confirmCancel ? onCancelRejected : null} 
        />
      )}

      <div className="max-w-5xl mx-auto">
        {/* Profile Header */}
        <div className="relative bg-white rounded-2xl p-8 shadow-xl mb-8 transition-all duration-300 hover:shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-blue-400 to-green-600 rounded-t-2xl"></div>
          
          {/* Profile Image and Basic Info */}
          <div className="relative flex flex-col items-center">
            <div className="relative group z-10">
              <div className="w-40 h-40 rounded-full border-4 border-white shadow-xl overflow-hidden transform transition-transform duration-300 group-hover:scale-105">
              <img 
                src={userForm.avatar && userForm.avatar.trim() !== "" ? userForm.avatar : "https://icon-library.com/images/profile-png-icon/profile-png-icon-2.jpg"}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = "https://tse2.mm.bing.net/th?id=OIP.AbGafkazjc_S1pZPh0B9cQHaIm&pid=Api&P=0&h=180"; }}
              />

                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                  <Camera className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" />
                </div>
              </div>
            </div>

            <div className="mt-4 text-center">
              <h1 className="text-3xl font-bold text-gray-800">{userForm.name}</h1>
              
              {/* User Type Badge */}
              <div className="mt-3">
                <span className="px-4 py-1 bg-green-100 text-green-600 rounded-full text-sm font-medium">
                  {userType === 'admin' ? (userForm.role || 'Manager') : 'Customer'}
                </span>
              </div>
            </div>
          </div>

          {/* Edit Toggle Button */}
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="absolute top-36 right-8 p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            {isEditing ? 
              <X className="w-5 h-5 text-red-500 group-hover:rotate-90 transition-transform duration-300" /> : 
              <Edit2 className="w-5 h-5 text-green-500 group-hover:rotate-12 transition-transform duration-300" />
            }
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8 gap-4">
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 ${
                activeSection === section.id 
                  ? 'bg-green-500 text-white shadow-lg transform -translate-y-1'
                  : 'bg-white text-gray-600 hover:bg-green-50 shadow'
              }`}
            >
              <section.icon className="w-5 h-5" />
              <span>{section.label}</span>
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-2xl p-8 shadow-xl transition-all duration-300 hover:shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-8">
            {activeSection === 'profile' && (
              <div className="grid md:grid-cols-2 gap-8">
                {/* Personal Information */}
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <User className="w-5 h-5 text-green-500" />
                    Personal Information
                  </h2>
                  
                  {[
                    { icon: User, name: 'name', label: 'Name', value: userForm.name },
                    { icon: Mail, name: 'email', label: 'Email', value: userForm.email },
                    { icon: Phone, name: 'phone', label: 'Phone', value: userForm.phone },
                    { icon: MapPin, name: 'address', label: 'Address', value: userForm.address }
                  ].map((field) => (
                    <div key={field.name} className="group">
                      <label className="text-sm text-gray-600 mb-1 block">{field.label}</label>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg group-hover:bg-green-50 transition-colors">
                        <field.icon className="w-5 h-5 text-green-500" />
                        {isEditing && field.name !== 'address' ? (
                          <input
                            type="text"
                            name={field.name}
                            value={field.value}
                            onChange={handleInputChange}
                            className="flex-1 bg-transparent outline-none border-b-2 border-transparent focus:border-green-500 transition-colors"
                          />
                        ) : (
                          <span className="text-gray-700">{field.value || 'Not provided'}</span>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Display role for Admin users */}
                  {userType === 'admin' && (
                    <div className="group">
                      <label className="text-sm text-gray-600 mb-1 block">Role</label>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg group-hover:bg-green-50 transition-colors">
                        <Shield className="w-5 h-5 text-green-500" />
                        <span className="text-gray-700">{userForm.role || 'Manager'}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Account Settings */}
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-500" />
                    Account Settings
                  </h2>
                  
                  <div className="grid gap-4">
                    {[
                      { name: 'preferences.twoFactor', label: 'Two-Factor Authentication', description: 'Add an extra layer of security to your account' },
                      { name: 'preferences.newsletter', label: 'Email Newsletter', description: 'Receive updates about organic products and offers' },
                      { name: 'preferences.notifications', label: 'Push Notifications', description: 'Get instant updates about your orders' }
                    ].map((setting) => (
                      <div key={setting.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-green-50 transition-colors">
                        <div>
                          <h3 className="font-medium text-gray-800">{setting.label}</h3>
                          <p className="text-sm text-gray-600">{setting.description}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name={setting.name}
                            checked={setting.name.includes('.') ? 
                              userForm[setting.name.split('.')[0]][setting.name.split('.')[1]] : 
                              userForm[setting.name]}
                            onChange={handleInputChange}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Save Changes Button */}
            {isEditing && activeSection === 'profile' && (
              <div className="flex justify-center mt-8">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-8 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
                >
                  <Save className="w-5 h-5" />
                  <span>Save Changes</span>
                </button>
              </div>
            )}
          </form>

          {/* Orders Section - Only for Customers */}
          {activeSection === 'orders' && userType === 'customer' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
                <Package className="w-5 h-5 text-green-500" />
                Your Orders
              </h2>

              {orders.length === 0 ? (
                <p className="text-gray-500">No orders found.</p>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order._id}
                      className="p-4 border rounded-lg shadow-sm hover:shadow-md transition cursor-pointer"
                      onClick={() => navigate(`/ordertracking/${order._id}`)}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Order ID: {order._id}</span>
                        <span
                          className={`px-3 py-1 text-sm rounded-full ${
                            order.orderStatus?.toLowerCase() === "delivered"
                              ? "bg-green-100 text-green-600"
                              : order.orderStatus?.toLowerCase() === "processing"
                              ? "bg-yellow-100 text-yellow-600"
                              : order.orderStatus?.toLowerCase() === "shipped"
                              ? "bg-blue-100 text-blue-600"
                              : order.orderStatus?.toLowerCase() === "pending"
                              ? "bg-gray-100 text-gray-600"
                              : order.orderStatus?.toLowerCase() === "cancelled"
                              ? "bg-red-100 text-red-600"
                              : order.orderStatus?.toLowerCase() === "returned"
                              ? "bg-purple-100 text-purple-600"
                              : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {order.orderStatus}
                        </span>
                      </div>

                      <p className="text-gray-700 mt-2">Total: ${order.totalPrice}</p>
                      <p className="text-gray-500 text-sm">
                        Date: {new Date(order.orderDate).toLocaleDateString()}
                      </p>

                      {/* Cancel Button - Only for Pending & Processing Orders */}
                      {(order.orderStatus?.toLowerCase() === "pending" || order.orderStatus?.toLowerCase() === "processing") && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent navigation when clicking the button
                            handleCancelClick(order._id);
                          }}
                          className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition block"
                        >
                          Cancel Order
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Logout Button */}
        <div className="flex justify-center mt-8">
          <button className="flex items-center gap-2 px-6 py-3 text-red-500 hover:text-red-600 transition-all duration-300 transform hover:-translate-y-1">
            <Logout/>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;