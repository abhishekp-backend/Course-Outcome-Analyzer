import React, { useState } from 'react';

function TestModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-8">
      <button 
        onClick={() => {
          setIsOpen(true);
        }}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Open Test Modal
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Test Modal</h2>
            <p className="mb-4">This is a test modal to verify that modals are working correctly.</p>
            <button 
              onClick={() => setIsOpen(false)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Close Modal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TestModal;