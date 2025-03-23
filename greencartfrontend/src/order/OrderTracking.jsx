import React, { useEffect, useState } from "react";
import { Check, Truck, Package, ShoppingBag, XCircle, Clock, RefreshCw } from "lucide-react";
import { Card, CardContent } from "../components/ui/Card";
import { orderTracking } from "../api";
import { useParams } from "react-router-dom";
import BackButton from "../components/ui/BackButton";

const OrderTracking = () => {
  const { orderId } = useParams();
  const [orderStatus, setOrderStatus] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (orderId) {
      fetchOrderStatus();
      const interval = setInterval(fetchOrderStatus, 30000); // Auto-refresh every 30s
      return () => clearInterval(interval);
    }
  }, [orderId]);

  const fetchOrderStatus = async () => {
    try {
      if (!refreshing) setLoading(true);
      setRefreshing(true);
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
      setRefreshing(false);
    }
  };

  const handleManualRefresh = () => {
    setRefreshing(true);
    fetchOrderStatus();
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64">
      <div className="animate-spin text-primary mb-4">
        <RefreshCw className="h-10 w-10" />
      </div>
      <p className="text-gray-500 font-medium">Loading your order status...</p>
    </div>
  );

  if (error)
    return (
      <Card className="border-red-200 bg-red-50 max-w-3xl mx-auto">
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center py-8">
            <XCircle className="h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-xl font-semibold text-red-600 mb-2">Error Loading Order</h3>
            <p className="text-red-500">{error}</p>
            <button 
              onClick={handleManualRefresh}
              className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-full flex items-center transition-all duration-300"
            >
              <RefreshCw className="h-4 w-4 mr-2" /> Try Again
            </button>
          </div>
        </CardContent>
      </Card>
    );

  // Calculate current step
  const getCurrentStep = () => {
    const steps = ["ordered", "processing", "packed", "shipped", "delivered"];
    if (orderStatus?.timestamps?.cancelled) return "cancelled";
    
    let currentStep = 0;
    steps.forEach((step, index) => {
      if (orderStatus?.timestamps?.[step]) {
        currentStep = index;
      }
    });
    
    return steps[currentStep];
  };

  const currentStep = getCurrentStep();
  const isComplete = currentStep === "delivered";
  const isCancelled = currentStep === "cancelled";

  return (
    <div className="bg-gray-50 min-h-screen">
      <BackButton/>
    <div className="max-w-4xl mx-auto p-4">
      <Card className="border-0 shadow-lg rounded-xl overflow-hidden">
        <div className={`h-3 w-full ${isCancelled ? 'bg-red-500' : isComplete ? 'bg-green-500' : 'bg-blue-500'}`}></div>
        <CardContent className="p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-1">Order Status</h2>
              <div className="flex items-center">
                <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                  isCancelled ? 'bg-red-100 text-red-700' : 
                  isComplete ? 'bg-green-100 text-green-700' : 
                  'bg-blue-100 text-blue-700'
                }`}>
                  {isCancelled ? 'Cancelled' : isComplete ? 'Delivered' : 'In Progress'}
                </span>
                {refreshing && (
                  <span className="ml-2 text-gray-400 flex items-center text-sm">
                    <RefreshCw className="h-3 w-3 mr-1 animate-spin" /> Updating...
                  </span>
                )}
              </div>
            </div>
            
            <button 
              onClick={handleManualRefresh}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center transition-all duration-300"
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} /> Refresh
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Order ID</h3>
              <p className="text-lg font-semibold">{orderId}</p>
            </div>
            
            {orderStatus?.timestamps?.ordered && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Order Placed</h3>
                <p className="text-lg font-semibold">{new Date(orderStatus.timestamps.ordered).toLocaleString()}</p>
              </div>
            )}
            
            {orderStatus?.expectedDelivery && !isCancelled && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Expected Delivery</h3>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-gray-400" />
                  <p className="text-lg font-semibold">{new Date(orderStatus.expectedDelivery).toLocaleDateString()}</p>
                </div>
              </div>
            )}
          </div>

          <OrderTimeline orderStatus={orderStatus} />
        </CardContent>
      </Card>
    </div>
    </div>
  );
};

const OrderTimeline = ({ orderStatus }) => {
  const steps = [
    { id: "ordered", label: "Order Placed", icon: ShoppingBag, description: "Your order has been received" },
    { id: "processing", label: "Processing", icon: Package, description: "Your order is being processed" },
    { id: "packed", label: "Packed", icon: Package, description: "Your items have been packed" },
    { id: "shipped", label: "Shipped", icon: Truck, description: "Your order is on the way" },
    { id: "delivered", label: "Delivered", icon: Check, description: "Your order has been delivered" },
  ];

  const isCancelled = orderStatus?.timestamps?.cancelled;

  return (
    <div className="relative">
      {isCancelled ? (
        // If order is cancelled, show only the cancel step
        <div className="flex mb-8 p-6 rounded-xl bg-red-50 border border-red-100">
          <div className="relative flex items-center justify-center w-16 h-16 rounded-full border-2 border-red-500 bg-white shadow-md">
            <XCircle className="h-8 w-8 text-red-500" />
          </div>

          <div className="ml-6 flex-1">
            <h3 className="font-bold text-xl text-red-600 mb-1">Order Cancelled</h3>
            <p className="text-red-800 opacity-75 mb-2">
              We're sorry, your order has been cancelled.
            </p>
            <p className="text-sm text-red-600 font-medium">
              {new Date(orderStatus.timestamps.cancelled).toLocaleString()}
            </p>
          </div>
        </div>
      ) : (
        // Normal order tracking steps
        <div className="relative">
          {/* Progress bar */}
          <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gray-200"></div>
          
          {steps.map((step, index) => {
            const completed = orderStatus?.timestamps?.[step.id];
            const Icon = step.icon;
            const isLast = index === steps.length - 1;
            
            // Calculate if step is active (current step)
            const isActive = completed && (!steps[index + 1] || !orderStatus?.timestamps?.[steps[index + 1].id]);
            
            return (
              <div key={step.id} className={`relative flex mb-8 last:mb-0 pl-12 ${completed ? "" : "opacity-50"}`}>
                <div
                  className={`absolute left-0 flex items-center justify-center w-12 h-12 rounded-full shadow-md ${
                    completed 
                      ? isActive 
                        ? "border-2 border-blue-500 bg-blue-50 ring-4 ring-blue-100" 
                        : "border-2 border-green-500 bg-green-50" 
                      : "border-2 border-gray-300 bg-white"
                  }`}
                >
                  <Icon className={`h-6 w-6 ${
                    completed 
                      ? isActive 
                        ? "text-blue-500" 
                        : "text-green-500" 
                      : "text-gray-400"
                  }`} />
                </div>

                <div className={`flex-1 p-5 rounded-xl transition-all ${
                  isActive ? "bg-blue-50 border border-blue-100" : completed ? "bg-gray-50" : ""
                }`}>
                  <h3 className={`font-bold text-lg mb-1 ${
                    completed 
                      ? isActive 
                        ? "text-blue-700" 
                        : "text-green-700" 
                      : "text-gray-500"
                  }`}>
                    {step.label}
                  </h3>
                  <p className={`text-sm mb-2 ${completed ? "text-gray-700" : "text-gray-500"}`}>
                    {step.description}
                  </p>
                  {completed && (
                    <p className={`text-sm font-medium ${
                      isActive ? "text-blue-600" : "text-green-600"
                    }`}>
                      {new Date(orderStatus.timestamps[step.id]).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrderTracking;