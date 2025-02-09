import React from "react";

const Notification = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center z-50">
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 text-white font-bold hover:text-gray-300">
        ✖
      </button>
    </div>
  );
};

export default Notification;
