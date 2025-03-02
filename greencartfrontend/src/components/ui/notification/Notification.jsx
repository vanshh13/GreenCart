import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Info } from "lucide-react"; // Icons for better appearance

const Notification = ({
  message,
  type = "success",
  position = "top", // "top" or "middle"
  onClose,
  onConfirm,
  onReject,
}) => {
  useEffect(() => {
    if (message && type !== "confirm") {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // Auto-hide after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [message, onClose, type]);

  if (!message) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: position === "top" ? -50 : -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: position === "top" ? -50 : -20 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed left-1/2 transform -translate-x-1/2 ${
          position === "top" ? "top-5" : "top-1/2 -translate-y-1/2"
        } bg-white text-black px-6 py-4 rounded-lg shadow-xl flex flex-col items-center gap-4 border-l-4 z-[9999] 
          w-[400px] max-w-full text-sm font-medium`}
        style={{
          borderColor: type === "success" ? "#16a34a" : type === "error" ? "#dc2626" : "#2563eb",
        }}
      >
        {/* Icon & Message */}
        <div className="flex items-center gap-2">
          {type === "success" && <CheckCircle className="w-5 h-5 text-green-600" />}
          {type === "error" && <XCircle className="w-5 h-5 text-red-600" />}
          {type === "info" && <Info className="w-5 h-5 text-blue-600" />}
          <p>{message}</p>
        </div>

        {/* Confirmation Buttons */}
        {type === "confirm" && (
          <div className="flex gap-4">
            <button
              onClick={onConfirm}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Yes
            </button>
            <button
              onClick={onReject}
              className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition"
            >
              No
            </button>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default Notification;
