import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Select } from "../components/ui/Select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableHeadCell } from "../components/ui/Table";
import { Search, Filter } from "lucide-react";

const OrderManagementDashboard = () => {
  const [orders, setOrders] = useState([
    {
      id: "ORD-001",
      customer: {
        name: "John Doe",
        email: "john@example.com",
        phone: "+1 234 567 8900"
      },
      products: [
        { name: "Gaming Laptop", quantity: 1, price: 1299 },
        { name: "Wireless Mouse", quantity: 2, price: 29.99 }
      ],
      totalAmount: 1358.98,
      paymentStatus: "paid",
      orderStatus: "processing"
    },
    {
      id: "ORD-002",
      customer: {
        name: "Jane Smith",
        email: "jane@example.com",
        phone: "+1 234 567 8901"
      },
      products: [{ name: "Mechanical Keyboard", quantity: 1, price: 159.99 }],
      totalAmount: 159.99,
      paymentStatus: "pending",
      orderStatus: "pending"
    }
  ]);

  const orderStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
  const paymentStatuses = ["paid", "pending", "failed", "refunded"];

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(
      orders.map(order => (order.id === orderId ? { ...order, orderStatus: newStatus } : order))
    );
  };

  const getStatusColor = status => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100 text-blue-800",
      shipped: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      paid: "bg-green-100 text-green-800",
      failed: "bg-red-100 text-red-800",
      refunded: "bg-gray-100 text-gray-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Order Management</CardTitle>
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search orders..."
              className="pl-8 pr-4 py-2 w-full rounded-md border border-gray-300"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-md border border-gray-300">
            <Filter className="h-4 w-4" />
            Filter
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHead>
              <TableHeader>
                <TableHeadCell>Order ID</TableHeadCell>
                <TableHeadCell>Customer</TableHeadCell>
                <TableHeadCell>Products</TableHeadCell>
                <TableHeadCell>Total Amount</TableHeadCell>
                <TableHeadCell>Payment Status</TableHeadCell>
                <TableHeadCell>Order Status</TableHeadCell>
                <TableHeadCell>Actions</TableHeadCell>
              </TableHeader>
            </TableHead>
            <TableBody>
              {orders.map(order => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{order.customer.name}</div>
                      <div className="text-sm text-gray-500">{order.customer.email}</div>
                      <div className="text-sm text-gray-500">{order.customer.phone}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs">
                      {order.products.map((product, idx) => (
                        <div key={idx} className="text-sm">
                          {product.quantity}x {product.name} (${product.price})
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(order.paymentStatus)}>
                      {order.paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <select
                      value={order.orderStatus}
                      onChange={e => handleStatusChange(order.id, e.target.value)}
                      className="p-2 rounded-md border border-gray-300"
                    >
                      {orderStatuses.map(status => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </select>
                  </TableCell>
                  <TableCell>
                    <button className="text-blue-600 hover:text-blue-800">View Details</button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderManagementDashboard;
