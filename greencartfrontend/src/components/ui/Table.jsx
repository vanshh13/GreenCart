import React from "react";

export const Table = ({ children, className = "" }) => (
  <table className={`w-full border-collapse ${className}`}>{children}</table>
);

export const TableHead = ({ children, className = "" }) => (
  <thead className={`bg-gray-100 ${className}`}>{children}</thead>
);

export const TableHeader = ({ children, className = "" }) => (
  <tr className={`border-b ${className}`}>{children}</tr> // Ensure headers are in a row
);

export const TableHeadCell = ({ children, className = "" }) => (
  <th className={`px-4 py-2 text-left font-semibold border ${className}`}>
    {children}
  </th>
);

export const TableBody = ({ children, className = "" }) => (
  <tbody className={className}>{children}</tbody>
);

export const TableRow = ({ children, className = "" }) => (
  <tr className={`border-b ${className}`}>{children}</tr>
);

export const TableCell = ({ children, className = "" }) => (
  <td className={`px-4 py-2 border ${className}`}>{children}</td>
);
