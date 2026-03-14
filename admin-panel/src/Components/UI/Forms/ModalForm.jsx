import React from "react";

export default function ModalForm({ title, children, isOpen, onClose, onSubmit }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg w-96 p-6">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          {children}
          <div className="mt-4 flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 cursor-pointer transition">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
