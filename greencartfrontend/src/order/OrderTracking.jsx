import React, { useEffect, useState } from "react"; 
import { Check, Truck, Package, ShoppingBag, XCircle } from "lucide-react";
import { Card, CardContent } from "../components/ui/Card";
import { orderTracking } from "../api";
import { useParams } from "react-router-dom";

const OrderTracking = () => {
  const { orderId } = useParams();
  const [orderStatus, setOrderStatus] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetchOrderStatus();
      const interval = setInterval(fetchOrderStatus, 30000); // Auto-refresh every 30s
      return () => clearInterval(interval);
    }
  }, [orderId]);

  const fetchOrderStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("authToken");
      
      if (!orderId) {
        throw new Error("Order ID is missing.");
      }

      console.log("Fetching order status for Order ID:", orderId);

      const response = await orderTracking(token, orderId);

      if (!response || !response.data) {
        throw new Error("Invalid response from server.");
      }

      setOrderStatus(response.data);
    } catch (error) {
      setError(error.message);
      console.error("Error fetching order tracking:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading order status...</p>;
  if (error)
    return (
      <p className="text-center text-red-500 flex items-center">
        <XCircle className="h-5 w-5 mr-2" /> {error}
      </p>
    );

  return (
    <div className="max-w-3xl mx-auto p-4">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Order Status</h2>

          <div className="mb-8">
            <p className="text-gray-600">Order ID: {orderId}</p>
            {orderStatus?.timestamps?.ordered && (
              <p className="text-gray-600">
                Order Placed: {new Date(orderStatus.timestamps.ordered).toLocaleString()}
              </p>
            )}
            {orderStatus?.expectedDelivery && (
              <p className="text-gray-600">
                Expected Delivery: {new Date(orderStatus.expectedDelivery).toLocaleDateString()}
              </p>
            )}
          </div>

          <OrderTimeline orderStatus={orderStatus} />
        </CardContent>
      </Card>
    </div>
  );
};

const OrderTimeline = ({ orderStatus }) => {
  const steps = [
    { id: "ordered", label: "Order Placed", icon: ShoppingBag },
    { id: "processing", label: "Processing", icon: Package },
    { id: "packed", label: "Packed", icon: Package },
    { id: "shipped", label: "Shipped", icon: Truck },
    { id: "delivered", label: "Delivered", icon: Check },
  ];

  const isCancelled = orderStatus?.timestamps?.cancelled;

  return (
    <div className="relative">
      {isCancelled ? (
        // If order is cancelled, show only the cancel step
        <div className="flex mb-8">
          <div className="relative flex items-center justify-center w-12 h-12 rounded-full border-2 border-red-600 bg-red-50">
            <XCircle className="h-6 w-6 text-red-600" />
          </div>

          <div className="ml-4 flex-1">
            <h3 className="font-semibold text-red-600">Order Cancelled</h3>
            <p className="text-sm text-gray-500">
              {new Date(orderStatus.timestamps.cancelled).toLocaleString()}
            </p>
          </div>
        </div>
      ) : (
        // Normal order tracking steps
        steps.map((step, index) => {
          const completed = orderStatus?.timestamps?.[step.id];
          const Icon = step.icon;

          return (
            <div key={step.id} className="flex mb-8 last:mb-0">
              <div
                className={`relative flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                  completed ? "border-green-600 bg-green-50" : "border-gray-300 bg-white"
                }`}
              >
                <Icon className={`h-6 w-6 ${completed ? "text-green-600" : "text-gray-400"}`} />
                {index < steps.length - 1 && (
                  <div
                    className={`absolute w-0.5 h-full top-12 left-1/2 transform -translate-x-1/2 ${
                      completed ? "bg-green-600" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>

              <div className="ml-4 flex-1">
                <h3 className={`font-semibold ${completed ? "text-green-600" : "text-gray-600"}`}>
                  {step.label}
                </h3>
                {completed && (
                  <p className="text-sm text-gray-500">
                    {new Date(orderStatus.timestamps[step.id]).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default OrderTracking;
