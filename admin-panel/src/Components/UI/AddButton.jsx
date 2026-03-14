import React from "react";

export default function AddButton({ name, onClick }) {
  return (
    <button
      onClick={onClick}
      className="mb-4 bg-red-600 text-white font-semibold py-2 px-4 rounded shadow hover:bg-red-700 transition"
    >
      + Add {name}
    </button>
  );
}
