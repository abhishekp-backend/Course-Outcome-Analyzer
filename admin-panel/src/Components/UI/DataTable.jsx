import React from "react";

export default function DataTable({ columns, rows }) {
  return (
    <table className="w-full bg-white shadow rounded overflow-hidden">
      <thead className="bg-gray-100">
        <tr>
          {columns.map((col) => (
            <th key={col} className="text-left px-4 py-2 border-b">{col}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.isArray(rows) && rows.length === 0 ? (
          <tr>
            <td colSpan={columns.length} className="px-4 py-2 text-center text-gray-500">
              No records found
            </td>
          </tr>
        ) : (
          rows && rows.map((row, idx) => (
            <tr key={idx} className="hover:bg-gray-50 transition">
              {columns.map((col) => (
                <td key={col} className="px-4 py-2 border-b">{row[col] || "-"}</td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
