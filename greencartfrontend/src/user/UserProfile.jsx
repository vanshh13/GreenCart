import React, { useEffect,useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { User, Mail, Phone, MapPin, Camera, Edit2, Save, X, Calendar, Instagram, Facebook, Twitter, Globe, Gift, Lock, Shield, Bell, Package } from 'lucide-react';
import Logout from '../components/authentication/Logout';
import { fetchOrderByUser, updateOrderStatus } from '../api';
import Notification from "../components/ui/notification/Notification";

const UserProfile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState('profile');
  const [notification, setNotification] = useState(null);
  const [confirmCancel, setConfirmCancel] = useState(null); // Track order being canceled

  const [userForm, setUserForm] = useState({
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    phone: "+1 234 567 8900",
    address: "123 Green Street, Nature City",
    bio: "Passionate about organic products and sustainable living",
    birthday: "1990-05-15",
    instagram: "@sarahj_organic",
    facebook: "sarah.johnson",
    twitter: "@sarahj_green",
    website: "www.sarahsorganics.com",
    avatar: "/api/placeholder/150/150",
    preferences: {
      newsletter: true,
      notifications: true,
      twoFactor: false
    }
  });
  const [orders, setOrders] = useState([]);
// Fetch orders when the "Orders" section is active
useEffect(() => {
  if (activeSection === 'orders') {
    fetchOrders();
  }
}, [activeSection]);

const fetchOrders = async () => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await fetchOrderByUser(token);
    const data = response.data;
    console.log(data);
    setOrders(data);
  } catch (error) {
    console.error("Error fetching orders:", error);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsEditing(false);
  };

  const sections = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'social', label: 'Social', icon: Globe },
    { id: 'privacy', label: 'Privacy', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'orders', label: 'Orders', icon: Package }
  ];

  // const onCancel = async (orderId) => {
  //   if (!window.confirm("Are you sure you want to cancel this order?")) return;
  //   const token = localStorage.getItem("authToken");
  
  //   try {
  //     await updateOrderStatus(token, orderId, "cancelled"); // Call API to update status
      
  //     setNotification({ message: "Order canceled successfully!", type: "success" });
  
  //     fetchOrders(); // Refresh the order list
  //   } catch (error) {
  //     console.error("Error canceling order:", error);
  //     setNotification({ message: "Failed to cancel order. Please try again.", type: "error" });
  //   }
  // };
  const handleCancelClick = (orderId) => {
    setConfirmCancel(orderId); // Store the order ID to be canceled
    setNotification({
      message: "Are you sure you want to cancel this order?",
      type: "confirm",
    });
  };
  
  const onCancelConfirmed = async () => {
    if (!confirmCancel) return;
    const token = localStorage.getItem("authToken");
  
    try {
      await updateOrderStatus(token, confirmCancel, "Cancelled"); // Call API to update status
      
      setNotification({ message: "Order canceled successfully!", type: "success" });
      fetchOrders(); // Refresh the order list
    } catch (error) {
      console.error("Error canceling order:", error);
      setNotification({ message: "Failed to cancel order. Please try again.", type: "error" });
    }
  
    setConfirmCancel(null); // Reset the confirmation state
  };
  
  // Cancel the action if the user chooses "No"
  const onCancelRejected = () => {
    setConfirmCancel(null);
    setNotification(null);
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white p-8 animate-fadeIn">
{notification && (
  <Notification 
    message={notification.message} 
    type={notification.type} 
    onClose={() => setNotification(null)}
    onConfirm={confirmCancel ? onCancelConfirmed : null} // Show buttons for confirmation
    onReject={confirmCancel ? onCancelRejected : null} 
  />
)}


      <div className="max-w-5xl mx-auto">
        {/* Profile Header */}
        <div className="relative bg-white rounded-2xl p-8 shadow-xl mb-8 transition-all duration-300 hover:shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-green-400 to-green-600 rounded-t-2xl"></div>
          
          {/* Profile Image and Basic Info */}
          <div className="relative flex flex-col items-center">
            <div className="relative group z-10">
              <div className="w-40 h-40 rounded-full border-4 border-white shadow-xl overflow-hidden transform transition-transform duration-300 group-hover:scale-105">
                <img 
                  src={userForm.avatar} 
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                  <Camera className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" />
                </div>
              </div>
            </div>

            <div className="mt-4 text-center">
              <h1 className="text-3xl font-bold text-gray-800">{userForm.name}</h1>
              <p className="text-gray-600 mt-2 italic">{userForm.bio}</p>
              
              {/* Status Badge */}
              <div className="mt-3">
                <span className="px-4 py-1 bg-green-100 text-green-600 rounded-full text-sm font-medium">
                  Premium Member
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
                    { icon: Mail, name: 'email', label: 'Email', value: userForm.email },
                    { icon: Phone, name: 'phone', label: 'Phone', value: userForm.phone },
                    { icon: MapPin, name: 'address', label: 'Address', value: userForm.address },
                    { icon: Gift, name: 'birthday', label: 'Birthday', value: userForm.birthday }
                  ].map((field) => (
                    <div key={field.name} className="group">
                      <label className="text-sm text-gray-600 mb-1 block">{field.label}</label>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg group-hover:bg-green-50 transition-colors">
                        <field.icon className="w-5 h-5 text-green-500" />
                        {isEditing ? (
                          <input
                            type={field.name === 'birthday' ? 'date' : 'text'}
                            name={field.name}
                            value={field.value}
                            onChange={handleInputChange}
                            className="flex-1 bg-transparent outline-none border-b-2 border-transparent focus:border-green-500 transition-colors"
                          />
                        ) : (
                          <span className="text-gray-700">{field.value}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Social Links */}
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-green-500" />
                    Social Links
                  </h2>
                  
                  {[
                    { icon: Instagram, name: 'instagram', label: 'Instagram', value: userForm.instagram },
                    { icon: Facebook, name: 'facebook', label: 'Facebook', value: userForm.facebook },
                    { icon: Twitter, name: 'twitter', label: 'Twitter', value: userForm.twitter },
                    { icon: Globe, name: 'website', label: 'Website', value: userForm.website }
                  ].map((field) => (
                    <div key={field.name} className="group">
                      <label className="text-sm text-gray-600 mb-1 block">{field.label}</label>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg group-hover:bg-green-50 transition-colors">
                        <field.icon className="w-5 h-5 text-green-500" />
                        {isEditing ? (
                          <input
                            type="text"
                            name={field.name}
                            value={field.value}
                            onChange={handleInputChange}
                            className="flex-1 bg-transparent outline-none border-b-2 border-transparent focus:border-green-500 transition-colors"
                          />
                        ) : (
                          <span className="text-gray-700">{field.value}</span>
                        )}
                      </div>
                    </div>
                  ))}
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
            {activeSection === 'privacy' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-500" />
                  Privacy Settings
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
            )}

{activeSection === 'orders' && (
  <div>
    <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
      <Package className="w-5 h-5 text-green-500" />
      Your Orders
    </h2>

    {orders.length === 0 ? (
      <p className="text-gray-500">No orders found.</p>
    ) : (
      <div className="space-y-4">
        {orders.map((order) => {
          console.log(`Order ID: ${order._id}, Status: ${order.orderStatus}`); // Debugging

          return (
            <div
              key={order._id}
              className="p-4 border rounded-lg shadow-sm hover:shadow-md transition cursor-pointer"
              onClick={() => navigate(`/ordertracking/${order._id}`)}
            >
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Order ID: {order._id}</span>
                <span
                  className={`px-3 py-1 text-sm rounded-full ${
                    order.orderStatus === "delivered"
                      ? "bg-green-100 text-green-600"
                      : order.orderStatus === "processing"
                      ? "bg-yellow-100 text-yellow-600"
                      : order.orderStatus === "shipped"
                      ? "bg-blue-100 text-blue-600"
                      : order.orderStatus === "pending"
                      ? "bg-gray-100 text-gray-600"
                      : order.orderStatus === "cancelled"
                      ? "bg-red-100 text-red-600"
                      : order.orderStatus === "returned"
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
              {(order.orderStatus === "pending" || order.orderStatus === "processing") && (
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
          );
        })}
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