import React from "react";
export const Select = ({ options, onChange, value, className = '' }) => {
    return (
      <select 
        className={`border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`} 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((option, index) => (
          <option key={index} value={option.value}>{option.label}</option>
        ))}
      </select>
    );
  };