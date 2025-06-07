import { useState, useEffect } from "react";
export function Toast({ message, isVisible, onClose, type = "info", duration = 3000 }) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const bgColor =
    type === "error" ? "bg-red-600" :
    type === "success" ? "bg-green-600" :
    "bg-gray-900";

  return (
    <div className={`fixed bottom-4 right-4 ${bgColor} text-white px-4 py-2 rounded-lg shadow-lg`}>
      {message}
    </div>
  );
}
