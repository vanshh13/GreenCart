import React from 'react';

export const Select = ({ options, onChange, value, className = '' }) => {
  return (
    <select
      className={`border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((option, index) => (
        <option key={index} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export const SelectTrigger = ({ children, className = '' }) => (
  <div className={`border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}>
    {children}
  </div>
);

export const SelectValue = ({ placeholder }) => (
  <span className="text-gray-500">{placeholder}</span>
);

export const SelectContent = ({ children, className = '' }) => (
  <div className={`absolute mt-2 w-full bg-white border rounded-md shadow-lg z-10 ${className}`}>
    {children}
  </div>
);

export const SelectItem = ({ children, value, onClick }) => (
  <div
    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
    onClick={() => onClick(value)}
  >
    {children}
  </div>
);