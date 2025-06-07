import { useState } from "react";

export function Switch({ checked, onChange }) {
  return (
    <div
      className={`w-12 h-6 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer ${
        checked ? "bg-blue-500" : "bg-gray-300"
      }`}
      onClick={() => onChange(!checked)}
    >
      <div
        className={`bg-white w-5 h-5 rounded-full shadow-md transform duration-300 ${
          checked ? "translate-x-6" : "translate-x-0"
        }`}
      ></div>
    </div>
  );
}
