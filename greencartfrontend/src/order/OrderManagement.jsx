import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  IndianRupee
} from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import AdminNavbar from "../components/AdminNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { AlertCircle, Check, ChevronDown, Download, Printer, RefreshCw, Search, Sliders } from "lucide-react";
import {updateOrderStatus } from "../api";
import Notification from "../components/ui/notification/Notification";
import useNotification from "../components/ui/notification//useNotification"; 

const OrderManagementDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [confirmingOrderStatus, setConfirmingOrderStatus] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [notification, setNotification] = useState({ message: "", show: false });

const showNotification = (message) => {
  setNotification({ message, show: true });
  setTimeout(() => setNotification({ message: "", show: false }), 3000);
};

  const fetchOrders = async () => {
    setIsRefreshing(true);
    try {
      const orderRes = await axios.get("http://localhost:5000/api/orders");
      let ordersData = orderRes.data;

      // Fetch user details for each order
      const userRequests = ordersData.map(order =>
        axios.get(`http://localhost:5000/api/users/${order.user}`).then(res => res.data)
      );

      // Fetch order details for each order
      const orderDetailRequests = ordersData.map(order =>
        axios.get(`http://localhost:5000/api/order-details/order/${order._id}`).then(res => res.data)
      );

      const usersData = await Promise.all(userRequests);
      const orderDetailsData = await Promise.all(orderDetailRequests);

      const addressRequests = orderDetailsData.map(orderDetail => {
        const addressId = orderDetail?.deliveryAddress?._id || orderDetail?.deliveryAddress;
        if (!addressId) return Promise.resolve(null);
        return axios.get(`http://localhost:5000/api/addresses/${addressId}`).then(res => res.data);
      });

      const addressesData = await Promise.all(addressRequests);

      // Merge data into orders
      const updatedOrders = ordersData.map((order, index) => ({
        ...order,
        userDetails: usersData[index] || {},
        orderDetails: orderDetailsData[index] || {},
        addressDetails: addressesData[index] || {},
      }));

      setOrders(updatedOrders);
      setFilteredOrders(updatedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Apply filters when values change
  useEffect(() => {
    let filtered = orders.filter(order => {
      const matchesText =
        searchText === "" ||
        order._id.includes(searchText) ||
        order.userDetails?.UserName?.toLowerCase().includes(searchText.toLowerCase()) ||
        order.addressDetails?.city?.toLowerCase().includes(searchText.toLowerCase());

      const matchesStatus = statusFilter === "" || order.orderStatus === statusFilter;
      const matchesDate = dateFilter === "" || new Date(order.orderDate).toISOString().split("T")[0] === dateFilter;
      const matchesCity = cityFilter === "" || order.addressDetails?.city?.toLowerCase().includes(cityFilter.toLowerCase()) ||
                          order.addressDetails?.cityVillage?.toLowerCase().includes(cityFilter.toLowerCase());

      return matchesText && matchesStatus && matchesDate && matchesCity;
    });

    setFilteredOrders(filtered);
  }, [searchText, statusFilter, dateFilter, cityFilter, orders]);

  const handleStatusChange = (orderId, status) => {
    setConfirmingOrderStatus({ orderId, status });
  };
  
  const confirmStatusChange = async () => {
    if (!confirmingOrderStatus) return;
  
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Authentication token is missing.");
  
      console.log("Updating order status...");
      console.log("Order ID:", confirmingOrderStatus?.orderId);
      console.log("New Status:", confirmingOrderStatus?.status);
  
      const response = await updateOrderStatus(
        token,
        confirmingOrderStatus.orderId,
        confirmingOrderStatus.status
      );
  
      console.log("Response from server:", response);
  
      // ✅ Show success notification
      showNotification(`✅ Order status updated to ${confirmingOrderStatus.status}!`);
  
      // ✅ Update order list in UI
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === confirmingOrderStatus.orderId
            ? { ...order, orderStatus: confirmingOrderStatus.status }
            : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error.response?.data || error.message);
      showNotification("⚠️ Failed to update order status. Please try again.");
    } finally {
      setConfirmingOrderStatus(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "processing": return "bg-blue-100 text-blue-800";
      case "shipped": return "bg-purple-100 text-purple-800";
      case "delivered": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const exportToCSV = () => {
    const headers = ["Order ID", "Customer", "City", "Total Amount", "Status", "Date"];
    const data = filteredOrders.map(order => [
      order._id,
      order.userDetails?.UserName || "Unknown",
      order.addressDetails?.cityVillage || "N/A",
      (order.totalPrice || 0).toFixed(2),
      order.orderStatus,
      new Date(order.orderDate).toLocaleDateString()
    ]);
    
    const csvContent = [
      headers.join(","),
      ...data.map(row => row.join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", "orders_export.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const printOrders = () => {
    const printContent = document.getElementById("orders-table").outerHTML;
    const originalContent = document.body.innerHTML;
    
    document.body.innerHTML = `
      <h1 style="text-align: center; margin-bottom: 20px;">Orders Report</h1>
      ${printContent}
    `;
    
    window.print();
    document.body.innerHTML = originalContent;
    
    // Re-initialize the React app after printing
    window.location.reload();
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      >
        <RefreshCw size={40} className="text-blue-600"/>
      </motion.div>
      <p className="mt-4 text-lg">Loading orders...</p>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
    {notification.show && (
      <Notification
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ message: "", type: "", show: false })}
      />
    )}
    <button onClick={() => showNotification("Your order has been placed!", "success")}>
      Show Notification
    </button>
      <AdminNavbar />
      
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
  className="w-full min-h-[calc(100vh-6rem)] pt-[3rem]" // Adjusted height to account for navbar
>
<Card className="shadow-lg bg-white rounded-xl overflow-hidden px-4 py-8 w-full h-full">
<CardHeader className="bg-white">  
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl font-bold">Order Management</CardTitle>
              <div className="flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 bg-white bg-opacity-20 rounded-full"
                  onClick={fetchOrders}
                >
                  <motion.div animate={isRefreshing ? { rotate: 360 } : {}} transition={isRefreshing ? { repeat: Infinity, duration: 1, ease: "linear" } : {}}>
                    <RefreshCw size={20} />
                  </motion.div>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 bg-white bg-opacity-20 rounded-full"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Sliders size={20} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 bg-white bg-opacity-20 rounded-full"
                  onClick={exportToCSV}
                >
                  <Download size={20} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 bg-white bg-opacity-20 rounded-full"
                  onClick={printOrders}
                >
                  <Printer size={20} />
                </motion.button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            {/* Search Bar */}
            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by Order ID, Customer Name, or Address"
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                className="pl-10 p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Advanced Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden mb-4"
                >
                  <div className="p-4 bg-gray-100 rounded-lg grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">All Statuses</option>
                        {["pending", "processing", "shipped", "delivered", "cancelled"].map(status => (
                          <option key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Order Date</label>
                      <input
                        type="date"
                        value={dateFilter}
                        onChange={e => setDateFilter(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <input
                        type="text"
                        placeholder="Filter by City"
                        value={cityFilter}
                        onChange={e => setCityFilter(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Order Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500"
              >
                <h3 className="text-gray-500 text-sm">Total Orders</h3>
                <p className="text-2xl font-bold">{orders.length}</p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.03 }}
                className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500"
              >
                <h3 className="text-gray-500 text-sm">Processing Orders</h3>
                <p className="text-2xl font-bold">
                  {orders.filter(o => o.orderStatus === "processing").length}
                </p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.03 }}
                className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500"
              >
                <h3 className="text-gray-500 text-sm">Pending Orders</h3>
                <p className="text-2xl font-bold">
                  {orders.filter(o => o.orderStatus === "pending").length}
                </p>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500"
              >
                <h3 className="text-gray-500 text-sm">Delivered Orders</h3>
                <p className="text-2xl font-bold">
                  {orders.filter(o => o.orderStatus === "delivered").length}
                </p>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500"
              >
                <h3 className="text-gray-500 text-sm">Cancelled Orders</h3>
                <p className="text-2xl font-bold">
                  {orders.filter(o => o.orderStatus === "cancelled").length}
                </p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500"
              >
                <h3 className="text-gray-500 text-sm">shipped Orders</h3>
                <p className="text-2xl font-bold">
                  {orders.filter(o => o.orderStatus === "shipped").length}
                </p>
              </motion.div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table id="orders-table" className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="text-left p-4 font-medium text-gray-500">Order ID</th>
                      <th className="text-left p-4 font-medium text-gray-500">Customer</th>
                      <th className="text-left p-4 font-medium text-gray-500">City</th>
                      <th className="text-left p-4 font-medium text-gray-500">Total Amount</th>
                      <th className="text-left p-4 font-medium text-gray-500">Status</th>
                      <th className="text-left p-4 font-medium text-gray-500">Date</th>
                      <th className="text-left p-4 font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.length > 0 ? (
                      filteredOrders.map((order, index) => (
                        <motion.tr 
                          key={order._id} 
                          className="border-b hover:bg-gray-50 transition"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <td className="p-4 text-sm">{order._id}</td>
                          <td className="p-4 text-sm">{order.userDetails?.UserName || "Unknown"}</td>
                          <td className="p-4 text-sm">{order.addressDetails?.cityVillage || "N/A"}</td>
                          <td className="p-4 text-sm font-medium flex items-center">
                            <IndianRupee className="h-4 w-4 mr-1" /> {/* Adjust size and spacing */}
                            {(order.totalPrice || 0).toFixed(2)}
                          </td>                          <td className="p-4 text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
                              {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                            </span>
                          </td>
                          <td className="p-4 text-sm">
                            {new Date(order.orderDate).toLocaleDateString()}
                          </td>
                          <td className="p-4 text-sm">
                            <div className="flex items-center space-x-3">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleStatusChange(order._id, order.orderStatus)}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                Update
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setSelectedOrder(order)}
                                className="text-green-600 hover:text-green-800"
                              >
                                View
                              </motion.button>
                            </div>
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="p-4 text-center text-gray-500">
                          No orders found matching your filters
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div 
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white rounded-lg shadow-xl w-full max-w-md m-4"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900">Order Details</h3>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-3">
                  <div className="grid grid-cols-3 items-center">
                    <span className="text-sm font-medium text-gray-500">Order ID:</span>
                    <span className="col-span-2 text-sm text-gray-900">{selectedOrder._id}</span>
                  </div>
                  
                  <div className="grid grid-cols-3 items-center">
                    <span className="text-sm font-medium text-gray-500">Customer:</span>
                    <span className="col-span-2 text-sm text-gray-900">{selectedOrder.userDetails?.UserName || "Unknown"}</span>
                  </div>
                  
                  <div className="grid grid-cols-3 items-center">
                    <span className="text-sm font-medium text-gray-500">Phone:</span>
                    <span className="col-span-2 text-sm text-gray-900">{selectedOrder.userDetails?.phone || "N/A"}</span>
                  </div>
                  
                  <div className="grid grid-cols-3 items-center">
                    <span className="text-sm font-medium text-gray-500">Total Price:</span>
                    <span className="col-span-2 text-sm text-gray-900 font-medium flex items-center">
                      <IndianRupee className="h-4 w-4 mr-1" /> {/* Adjust size and spacing */}
                      {selectedOrder.totalPrice ? selectedOrder.totalPrice.toFixed(2) : "N/A"}
                    </span>                  </div>
                                      
                  <div className="grid grid-cols-3 items-center">
                    <span className="text-sm font-medium text-gray-500">Status:</span>
                    <span className={`col-span-2 text-sm px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.orderStatus)}`}>
                      {selectedOrder.orderStatus.charAt(0).toUpperCase() + selectedOrder.orderStatus.slice(1)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-3 items-start">
                    <span className="text-sm font-medium text-gray-500">Address:</span>
                    <div className="col-span-2 text-sm text-gray-900">
                      <p>{selectedOrder.addressDetails?.streetAddress || "N/A"}</p>
                      <p>{selectedOrder.addressDetails?.cityVillage || "N/A"}, {selectedOrder.addressDetails?.state || "N/A"}</p>
                      <p>{selectedOrder.addressDetails?.country || "N/A"}, {selectedOrder.addressDetails?.zipCode || "N/A"}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 items-center">
                    <span className="text-sm font-medium text-gray-500">Order Date:</span>
                    <span className="col-span-2 text-sm text-gray-900">
                      {new Date(selectedOrder.orderDate).toLocaleString()}
                    </span>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedOrder(null)}
                    className="px-4 py-2 bg-gray-200 rounded-md text-gray-800 text-sm font-medium"
                  >
                    Close
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSelectedOrder(null);
                      handleStatusChange(selectedOrder._id, selectedOrder.orderStatus);
                    }}
                    className="px-4 py-2 bg-blue-600 rounded-md text-white text-sm font-medium"
                  >
                    Update Status
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status Change Confirmation Modal */}
      <AnimatePresence>
        {confirmingOrderStatus && (
          <motion.div 
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white rounded-lg shadow-xl w-full max-w-md m-4"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <div className="p-6">
                <div className="flex items-center mb-4 text-amber-500">
                  <AlertCircle className="h-6 w-6 mr-2" />
                  <h3 className="text-lg font-bold">Update Order Status</h3>
                </div>
                
                <p className="mb-4 text-gray-700">
                  Select the new status for this order:
                </p>
                
                <select
                  value={confirmingOrderStatus.status}
                  onChange={(e) => setConfirmingOrderStatus({...confirmingOrderStatus, status: e.target.value})}
                  className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  {["pending", "processing", "shipped", "delivered", "cancelled"].map(status => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
                
                <div className="flex justify-end space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setConfirmingOrderStatus(null)}
                    className="px-4 py-2 bg-gray-200 rounded-md text-gray-800 text-sm font-medium"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={confirmStatusChange}
                    className="px-4 py-2 bg-green-600 rounded-md text-white text-sm font-medium flex items-center"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Confirm
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrderManagementDashboard;