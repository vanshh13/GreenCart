import React, { useState, useEffect } from 'react';
import { Check, Filter, Search, ChevronDown, Eye, Trash2, RefreshCw } from 'lucide-react';
import AdminNavbar from '../components/AdminNavigation';
import { motion, AnimatePresence } from "framer-motion";
import axios from 'axios';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    type: 'all',
    status: 'all',
    timeframe: 'all'
  });
  const [unreadCount, setUnreadCount] = useState(0);
  
  // State for dropdown toggles
  const [openDropdown, setOpenDropdown] = useState(null);
  
  // Toggle dropdown function
  const toggleDropdown = (dropdown) => {
    if (openDropdown === dropdown) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(dropdown);
    }
  };
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenDropdown(null);
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
  
  // Prevent dropdown buttons from triggering the outside click handler
  const handleDropdownClick = (e, dropdown) => {
    e.stopPropagation();
    toggleDropdown(dropdown);
  };
  
  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get("http://localhost:5000/api/notifications");
      const data = res.data;
      console.log(data.notifications);
      setNotifications(data.notifications);
      setFilteredNotifications(data.notifications);
      setUnreadCount(data.notifications.filter(notif => notif.status === "unread").length);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchNotifications();
  }, []);
  
  // Apply filters and search whenever activeFilters or search query change
  useEffect(() => {
    let filtered = [...notifications];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(notif => 
        notif.message.toLowerCase().includes(query) || 
        notif.type.toLowerCase().includes(query)
      );
    }
    
    // Filter by type
    if (activeFilters.type !== 'all') {
      filtered = filtered.filter(notif => notif.type === activeFilters.type);
    }
    
    // Filter by status
    if (activeFilters.status !== 'all') {
      filtered = filtered.filter(notif => notif.status === activeFilters.status);
    }
    
    // Filter by timeframe
    if (activeFilters.timeframe !== 'all') {
      const now = new Date();
      const timeFrames = {
        'today': 24 * 60 * 60 * 1000,
        'week': 7 * 24 * 60 * 60 * 1000,
        'month': 30 * 24 * 60 * 60 * 1000,
      };
      
      filtered = filtered.filter(notif => {
        const notifDate = new Date(notif.createdAt);
        const timeDiff = now - notifDate;
        return timeDiff <= timeFrames[activeFilters.timeframe];
      });
    }
    
    setFilteredNotifications(filtered);
  }, [activeFilters, notifications, searchQuery]);
  
  // Mark notification as read
  const markAsRead = async (id) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/notifications/${id}/read`);
      
      if (res.status === 200) {
        setNotifications((prevNotifications) =>
          prevNotifications.map((notif) =>
            notif._id === id ? { ...notif, status: "read" } : notif
          )
        );
        setUnreadCount((prev) => prev - 1);
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      const res = await axios.put(`http://localhost:5000/api/notifications/mark-all-read`);

      if (res.status === 200) {
        setNotifications((prevNotifications) =>
          prevNotifications.map((notif) => ({ ...notif, status: "read" }))
        );
        setUnreadCount(0);
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  // Clear all notifications
  const clearAllNotifications = async () => {
    if (!window.confirm("Are you sure you want to delete all notifications?")) return;
  
    try {
      const res = await axios.delete("http://localhost:5000/api/notifications/clear-all");
  
      if (res.status === 200) {
        setNotifications([]);
        setFilteredNotifications([]);
        setUnreadCount(0);
      }
    } catch (error) {
      console.error("Error clearing notifications:", error);
    }
  };
  
  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    const iconMap = {
      new_user: "👤",
      new_order: "🛒",
      user_deleted: "❌",
      new_product: "📦",
      new_blog: "📝",
      order_cancelled: "🚫",
      update_admin: "👑",
      update_orderstatus: "📋",
      update_adminrole: "🔄",
      update_product: "🔄",
      product_deleted: "🗑️",
      update_blog: "📝",
      blog_deleted: "🗑️"
    };
    
    return iconMap[type] || "🔔";
  };
  
  // Format time
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    // Less than a day
    if (diff < 24 * 60 * 60 * 1000) {
      const hours = Math.floor(diff / (60 * 60 * 1000));
      if (hours < 1) {
        const minutes = Math.floor(diff / (60 * 1000));
        return minutes < 1 ? 'Just now' : `${minutes}m ago`;
      }
      return `${hours}h ago`;
    }
    // Less than a week
    else if (diff < 7 * 24 * 60 * 60 * 1000) {
      const days = Math.floor(diff / (24 * 60 * 60 * 1000));
      return `${days}d ago`;
    }
    // Otherwise show date
    else {
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }
  };
  
  // Format notification type for display
  const formatType = (type) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };
  
  // Get type badge color
  const getTypeBadgeColor = (type) => {
    const colorMap = {
      new_user: "bg-green-100 text-green-800",
      new_order: "bg-blue-100 text-blue-800",
      user_deleted: "bg-red-100 text-red-800",
      new_product: "bg-purple-100 text-purple-800",
      new_blog: "bg-indigo-100 text-indigo-800",
      order_cancelled: "bg-red-100 text-red-800",
      update_admin: "bg-yellow-100 text-yellow-800",
      update_orderstatus: "bg-blue-100 text-blue-800",
      update_adminrole: "bg-yellow-100 text-yellow-800",
      update_product: "bg-purple-100 text-purple-800",
      product_deleted: "bg-red-100 text-red-800",
      update_blog: "bg-indigo-100 text-indigo-800",
      blog_deleted: "bg-red-100 text-red-800"
    };
    
    return colorMap[type] || "bg-gray-100 text-gray-800";
  };
  
  return (
    <div className="bg-gray-50 min-h-screen">
      <AdminNavbar />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full mt-8 mx-auto"
      >
        <div className="bg-white shadow rounded-xl overflow-hidden px-4 py-8 mt-4 sm:mt-8 lg:mt-12 w-full">
          <div className="w-full mx-auto px-4 py-6">
            <div className="bg-white rounded-lg shadow">
              {/* Header */}
              <div className="px-6 py-4 border-b flex flex-col md:flex-row md:items-center justify-between">
                <div className="mb-4 md:mb-0">
                  <h1 className="text-2xl font-bold">Notifications</h1>
                  <p className="text-gray-500 text-sm">
                    You have <span className="font-medium">{unreadCount}</span> unread notifications
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 justify-end">
                  <button 
                    onClick={markAllAsRead}
                    className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 flex items-center"
                    disabled={unreadCount === 0}
                  >
                    <Check size={16} className="mr-1" />
                    Mark all as read
                  </button>
                  <button 
                    onClick={clearAllNotifications}
                    className="px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100 flex items-center"
                  >
                    <Trash2 size={16} className="mr-1" />
                    Clear all
                  </button>
                  <button 
                    onClick={fetchNotifications}
                    className="px-3 py-1.5 text-sm bg-gray-50 text-gray-600 rounded hover:bg-gray-100 flex items-center"
                  >
                    <RefreshCw size={16} className="mr-1" />
                    Refresh
                  </button>
                </div>
              </div>
              
              {/* Search and Filters */}
              <div className="p-4 border-b bg-gray-50">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Search */}
                  <div className="w-full md:w-1/3 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search notifications..."
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {/* Type Filter Dropdown */}
                    <div className="relative inline-block">
                      <button 
                        className="px-3 py-2 bg-white border rounded-lg hover:bg-gray-50 flex items-center"
                        onClick={(e) => handleDropdownClick(e, 'type')}
                      >
                        <Filter size={16} className="mr-2 text-gray-500" />
                        Type: {activeFilters.type === 'all' ? 'All' : formatType(activeFilters.type)}
                        <ChevronDown size={16} className="ml-2 text-gray-500" />
                      </button>
                      <AnimatePresence>
                        {openDropdown === 'type' && (
                          <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute z-10 mt-1 w-56 bg-white border rounded-lg shadow-lg"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="py-1 max-h-60 overflow-y-auto">
                              <button 
                                onClick={() => {
                                  setActiveFilters({...activeFilters, type: 'all'});
                                  setOpenDropdown(null);
                                }}
                                className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${activeFilters.type === 'all' ? 'bg-blue-50 text-blue-700' : ''}`}
                              >
                                All types
                              </button>
                              {[
                                "new_user", "new_order", "user_deleted", "new_product", 
                                "new_blog", "order_cancelled", "update_admin", "update_orderstatus", 
                                "update_adminrole", "update_product", "product_deleted", 
                                "update_blog", "blog_deleted"
                              ].map(type => (
                                <button 
                                  key={type}
                                  onClick={() => {
                                    setActiveFilters({...activeFilters, type});
                                    setOpenDropdown(null);
                                  }}
                                  className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${activeFilters.type === type ? 'bg-blue-50 text-blue-700' : ''}`}
                                >
                                  {formatType(type)}
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    
                    {/* Status Filter Dropdown */}
                    <div className="relative inline-block">
                      <button 
                        className="px-3 py-2 bg-white border rounded-lg hover:bg-gray-50 flex items-center"
                        onClick={(e) => handleDropdownClick(e, 'status')}
                      >
                        <Filter size={16} className="mr-2 text-gray-500" />
                        Status: {activeFilters.status === 'all' ? 'All' : activeFilters.status.charAt(0).toUpperCase() + activeFilters.status.slice(1)}
                        <ChevronDown size={16} className="ml-2 text-gray-500" />
                      </button>
                      <AnimatePresence>
                        {openDropdown === 'status' && (
                          <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute z-10 mt-1 w-40 bg-white border rounded-lg shadow-lg"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="py-1">
                              <button 
                                onClick={() => {
                                  setActiveFilters({...activeFilters, status: 'all'});
                                  setOpenDropdown(null);
                                }}
                                className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${activeFilters.status === 'all' ? 'bg-blue-50 text-blue-700' : ''}`}
                              >
                                All
                              </button>
                              <button 
                                onClick={() => {
                                  setActiveFilters({...activeFilters, status: 'unread'});
                                  setOpenDropdown(null);
                                }}
                                className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${activeFilters.status === 'unread' ? 'bg-blue-50 text-blue-700' : ''}`}
                              >
                                Unread
                              </button>
                              <button 
                                onClick={() => {
                                  setActiveFilters({...activeFilters, status: 'read'});
                                  setOpenDropdown(null);
                                }}
                                className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${activeFilters.status === 'read' ? 'bg-blue-50 text-blue-700' : ''}`}
                              >
                                Read
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    
                    {/* Timeframe Filter Dropdown */}
                    <div className="relative inline-block">
                      <button 
                        className="px-3 py-2 bg-white border rounded-lg hover:bg-gray-50 flex items-center"
                        onClick={(e) => handleDropdownClick(e, 'timeframe')}
                      >
                        <Filter size={16} className="mr-2 text-gray-500" />
                        Time: {activeFilters.timeframe === 'all' ? 'All time' : activeFilters.timeframe.charAt(0).toUpperCase() + activeFilters.timeframe.slice(1)}
                        <ChevronDown size={16} className="ml-2 text-gray-500" />
                      </button>
                      <AnimatePresence>
                        {openDropdown === 'timeframe' && (
                          <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute z-10 mt-1 w-40 bg-white border rounded-lg shadow-lg"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="py-1">
                              <button 
                                onClick={() => {
                                  setActiveFilters({...activeFilters, timeframe: 'all'});
                                  setOpenDropdown(null);
                                }}
                                className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${activeFilters.timeframe === 'all' ? 'bg-blue-50 text-blue-700' : ''}`}
                              >
                                All time
                              </button>
                              <button 
                                onClick={() => {
                                  setActiveFilters({...activeFilters, timeframe: 'today'});
                                  setOpenDropdown(null);
                                }}
                                className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${activeFilters.timeframe === 'today' ? 'bg-blue-50 text-blue-700' : ''}`}
                              >
                                Today
                              </button>
                              <button 
                                onClick={() => {
                                  setActiveFilters({...activeFilters, timeframe: 'week'});
                                  setOpenDropdown(null);
                                }}
                                className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${activeFilters.timeframe === 'week' ? 'bg-blue-50 text-blue-700' : ''}`}
                              >
                                This week
                              </button>
                              <button 
                                onClick={() => {
                                  setActiveFilters({...activeFilters, timeframe: 'month'});
                                  setOpenDropdown(null);
                                }}
                                className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${activeFilters.timeframe === 'month' ? 'bg-blue-50 text-blue-700' : ''}`}
                              >
                                This month
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Notifications List */}
              <div>
                {isLoading ? (
                  <div className="p-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-2 text-gray-500">Loading notifications...</p>
                  </div>
                ) : filteredNotifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🔔</span>
                    </div>
                    <h3 className="text-lg font-medium">No notifications found</h3>
                    <p className="text-gray-500 mt-1">Try adjusting your filters or search terms</p>
                  </div>
                ) : (
                  filteredNotifications.map((notification) => (
                    <div 
                      key={notification._id} 
                      className={`p-4 border-b hover:bg-gray-50 flex items-start space-x-3 ${
                        notification.status === 'unread' ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full">
                        <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-base ${notification.status === 'unread' ? 'font-medium' : ''}`}>
                          {notification.message}
                        </p>
                        <div className="flex flex-wrap items-center mt-2 gap-2">
                          <span className="text-xs text-gray-500">
                            {formatTime(notification.createdAt)}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getTypeBadgeColor(notification.type)}`}>
                            {formatType(notification.type)}
                          </span>
                          {notification.actionBy && (
                            <span className="text-xs text-gray-500">
                              by User ID: {notification.actionBy && typeof notification.actionBy === 'object' ? 
                                String(notification.actionBy._id || '') : 
                                String(notification.actionBy || '')}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        {notification.status === 'unread' ? (
                          <button 
                            onClick={() => markAsRead(notification._id)}
                            className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50"
                            title="Mark as read"
                          >
                            <Check size={18} />
                          </button>
                        ) : (
                          <span className="text-gray-400 p-2" title="Already read">
                            <Eye size={18} />
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              {/* Pagination - Could be implemented if needed */}
              <div className="p-4 border-t flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Showing {filteredNotifications.length} of {notifications.length} notifications
                </div>
                
                {/* Placeholder for pagination controls if needed */}
                <div className="flex gap-1">
                  {/* This could be expanded with proper pagination controls */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NotificationsPage;