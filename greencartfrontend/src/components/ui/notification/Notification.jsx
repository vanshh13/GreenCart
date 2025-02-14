import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Notification = ({ message, onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 9000); // 9 seconds auto-hide
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ scale: 0.5, opacity: 0, y: -20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.5, opacity: 0, y: -20 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center z-50"
      >
        <span>{message}</span>
        <button
          onClick={onClose}
          className="ml-4 text-white font-bold hover:text-gray-300"
        >
          ✖
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

export default Notification;
