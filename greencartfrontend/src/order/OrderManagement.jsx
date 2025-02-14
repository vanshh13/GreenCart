import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import AdminNavbar from "../components/AdminNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";

const OrderManagementDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null); // For pop-up
  const [newStatus, setNewStatus] = useState("");
  const [confirmingOrderStatus, setConfirmingOrderStatus] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
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
  
        // 🔥 FIXED: Ensure we are correctly extracting the deliveryAddress ID
        const addressRequests = orderDetailsData.map(orderDetail => {
          const addressId = orderDetail?.deliveryAddress?._id || orderDetail?.deliveryAddress;
          if (!addressId) return Promise.resolve(null); // Skip if no address ID
          return axios.get(`http://localhost:5000/api/addresses/${addressId}`).then(res => res.data);
        });
  
        const addressesData = await Promise.all(addressRequests);
  
        // Merge data into orders
        const updatedOrders = ordersData.map((order, index) => ({
          ...order,
          userDetails: usersData[index] || {},
          orderDetails: orderDetailsData[index] || {},
          addressDetails: addressesData[index] || {}, // Ensure fallback
        }));
  
        setOrders(updatedOrders);
        setFilteredOrders(updatedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
  
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
      const matchesCity = cityFilter === "" || order.addressDetails?.city?.toLowerCase().includes(cityFilter.toLowerCase());

      return matchesText && matchesStatus && matchesDate && matchesCity;
    });

    setFilteredOrders(filtered);
  }, [searchText, statusFilter, dateFilter, cityFilter, orders]);

  if (loading) return <div className="text-center py-4">Loading orders...</div>;
    // Handle Status Change Confirmation

const handleStatusChange = (orderId, status) => {
  setConfirmingOrderStatus({ orderId, status });
};

  
const confirmStatusChange = async () => {
  if (!confirmingOrderStatus) return;

  try {
    await axios.put(`http://localhost:5000/api/orders/${confirmingOrderStatus.orderId}`, { orderStatus: confirmingOrderStatus.status });
    setOrders(prevOrders =>
      prevOrders.map(order => 
        order._id === confirmingOrderStatus.orderId 
          ? { ...order, orderStatus: confirmingOrderStatus.status } 
          : order
      )
    );
  } catch (error) {
    console.error("Error updating order status:", error);
  } finally {
    setConfirmingOrderStatus(null);
  }
};


  return (
    <div>
      <AdminNavbar />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-8xl mx-auto mt-10 px-6"
      >
        <div className="max-w-10xl p-4flex justify-center w-full min-h-screen ">
          <CardHeader>  
            <CardTitle className="text-2xl font-bold">Order Management</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Filters Section */}
            <div className="flex flex-wrap gap-4 mb-4">
              <input
                type="text"
                placeholder="Search by Order ID, Name, or Address"
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                className="p-2 border rounded w-full md:w-1/3"
              />
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="p-2 border rounded w-full md:w-1/6"
              >
                <option value="">All Statuses</option>
                {["pending", "processing", "shipped", "delivered", "cancelled"].map(status => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
              <input
                type="date"
                value={dateFilter}
                onChange={e => setDateFilter(e.target.value)}
                className="p-2 border rounded w-full md:w-1/6"
              />
              <input
                type="text"
                placeholder="Filter by City"
                value={cityFilter}
                onChange={e => setCityFilter(e.target.value)}
                className="p-2 border rounded w-full md:w-1/6"
              />
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b bg-gray-100">
                    <th className="text-left p-3">Order ID</th>
                    <th className="text-left p-3">Customer</th>
                    <th className="text-left p-3">City</th>
                    <th className="text-left p-3">Total Amount</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(order => (
                    <motion.tr 
                      key={order._id} 
                      className="border-b hover:bg-gray-50 transition"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <td className="p-3">{order._id}</td>
                      <td className="p-3">{order.userDetails?.UserName || "Unknown"}</td>
                      <td className="p-3">{order.addressDetails?.cityVillage || "N/A"}</td>
                      <td className="p-3">${(order.totalPrice || 0).toFixed(2)}</td>
                      <td className="p-3">
                        <select
                          value={order.orderStatus}
                          onChange={e => handleStatusChange(order._id, e.target.value)}
                          className="p-2 border rounded"
                        >
                          {["pending", "processing", "shipped", "delivered", "cancelled"].map(status => (
                            <option key={status} value={status}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          View Details
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </div>
      </motion.div>

      {/* Order Details Pop-up */}
      {selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-bold mb-4">Order Details</h3>
            <p><strong>Order ID:</strong> {selectedOrder._id}</p>
            <p><strong>Customer:</strong> {selectedOrder.userDetails?.UserName || "Unknown"}</p>
            <p><strong>Total Price:</strong> ${selectedOrder.totalPrice ? selectedOrder.totalPrice.toFixed(2) : "N/A"}</p>
            <p><strong>City Or Village:</strong> {selectedOrder.addressDetails?.cityVillage || "N/A"}</p>
            <p><strong>State:</strong> {selectedOrder.addressDetails?.state || "N/A"}</p>
            <p><strong>Country:</strong> {selectedOrder.addressDetails?.country || "N/A"}</p>
            <p><strong>Status:</strong> {selectedOrder.orderStatus}</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

{confirmingOrderStatus && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
      <h3 className="text-lg font-bold mb-4">Confirm Status Change</h3>
      <p>
        Are you sure you want to change the order status to <b>{confirmingOrderStatus.status}</b>?
      </p>
      <div className="flex justify-end mt-4">
        <button
          onClick={() => setConfirmingOrderStatus(null)}
          className="px-4 py-2 bg-gray-300 rounded mr-2"
        >
          Cancel
        </button>
        <button
          onClick={confirmStatusChange}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
)}

      
    </div>
  );
};

export default OrderManagementDashboard;
