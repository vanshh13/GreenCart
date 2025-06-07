import React from "react";

export const Badge = ({ children, color = 'bg-gray-200', className = '' }) => {
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${color} ${className}`}>
        {children}
      </span>
    );
  };