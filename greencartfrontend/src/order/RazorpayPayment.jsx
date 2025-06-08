import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { createRazorpayOrder,verifyRazorpayPayment,getPaymentDetails } from "../api";

const RazorpayPayment = ({ amount, onSuccess, onFailure, customerInfo }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentId, setPaymentId] = useState("");
  const [paymentDetails, setPaymentDetails] = useState(null);

  // Load Razorpay script
  useEffect(() => {
    const loadRazorpayScript = async () => {
      return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });
    };

    loadRazorpayScript();
  }, []);

  // Create and open Razorpay order
  const createOrder = async () => {
    setIsLoading(true);
    try {
      const response = await createRazorpayOrder({
        amount: amount,
        currency: "INR",
      });
  
      if (response.data.success) {
        openRazorpayCheckout(response.data); // your Razorpay integration logic
      } else {
        toast.error("Failed to create payment order");
        if (onFailure) onFailure("Failed to create order");
      }
    } catch (error) {
      console.error("Error creating Razorpay order:", error);
  
      if (error.response?.status === 403) {
        toast.error("Session expired! Redirecting to login...");
        setTimeout(() => (window.location.href = "/authpage"), 2000);
      } else {
        toast.error("Payment initialization failed");
        if (onFailure) onFailure("Payment initialization failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Open Razorpay checkout
  const openRazorpayCheckout = (orderData) => {
    if (!window.Razorpay) {
      toast.error("Razorpay SDK failed to load");
      return;
    }
    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID || "rzp_test_90ZGyZNVzzFKRH",
      amount: orderData.amount,
      currency: orderData.currency,
      name: "Green Cart",
      description: "Payment for your order",
      order_id: orderData.order_id,
      handler: function (response) {
        handlePaymentSuccess(response);
      },
      prefill: {
        name: customerInfo?.name || "",
        email: customerInfo?.email || "",
        contact: customerInfo?.phone || ""
      },
      theme: {
        color: "#4CAF50"
      },
      modal: {
        ondismiss: function () {
          toast.info("Payment cancelled");
          if (onFailure) onFailure("Payment cancelled by user");
        }
      }
    };

    const razorpayInstance = new window.Razorpay(options);
    razorpayInstance.open();
  };

  // Handle successful payment
  const handlePaymentSuccess = async (response) => {
    try {
      const verifyData = {
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
      };
  
      const verifyResponse = await verifyRazorpayPayment(verifyData);
  
      if (verifyResponse.data.success) {
        setPaymentId(response.razorpay_payment_id);
        toast.success("Payment successful!");
        if (onSuccess) onSuccess(response);
      } else {
        toast.error("Payment verification failed");
        if (onFailure) onFailure("Payment verification failed");
      }
    } catch (error) {
      console.error("Payment verification error:", error);
  
      if (error.response?.status === 403) {
        toast.error("Session expired! Redirecting to login...");
        setTimeout(() => (window.location.href = "/authpage"), 2000);
      } else {
        toast.error("Payment verification failed");
        if (onFailure) onFailure("Payment verification failed");
      }
    }
  };

  // Fetch payment details
  const fetchPaymentDetails = async () => {
    if (!paymentId) {
      toast.error("Please enter a payment ID");
      return;
    }
  
    setIsLoading(true);
    try {
      const response = await getPaymentDetails(paymentId);
  
      if (response.data.success) {
        setPaymentDetails(response.data);
        toast.success("Payment details fetched successfully");
      } else {
        toast.error("Failed to fetch payment details");
      }
    } catch (error) {
      console.error("Error fetching payment:", error);
      toast.error("Failed to fetch payment details");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-green-800 mb-4">Razorpay Payment</h2>
      
      {/* Payment Button */}
      <button 
        className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition duration-300 ease-in-out w-full mb-4"
        onClick={createOrder}
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : `Pay ₹${amount}`}
      </button>

      {/* Payment Verification Section */}
      <div className="mt-6 border-t pt-4">
        <h3 className="text-lg font-medium text-gray-800 mb-3">Verify Payment</h3>
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            value={paymentId}
            onChange={(e) => setPaymentId(e.target.value)}
            placeholder="Enter Payment ID"
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={fetchPaymentDetails}
            disabled={isLoading || !paymentId}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-300 disabled:opacity-50"
          >
            Verify
          </button>
        </div>

        {/* Payment Details Display */}
        {paymentDetails && (
          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <h4 className="font-medium text-gray-700 mb-2">Payment Details:</h4>
            <ul className="space-y-1 text-sm">
              <li><span className="font-medium">Amount:</span> ₹{paymentDetails.amount}</li>
              <li><span className="font-medium">Currency:</span> {paymentDetails.currency}</li>
              <li><span className="font-medium">Status:</span> <span className={`font-medium ${paymentDetails.status === 'captured' ? 'text-green-600' : 'text-orange-500'}`}>{paymentDetails.status}</span></li>
              <li><span className="font-medium">Method:</span> {paymentDetails.method}</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default RazorpayPayment;