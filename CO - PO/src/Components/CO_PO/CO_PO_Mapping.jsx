import React, { useState, useEffect } from 'react';
import { useCO_PO_Mapping } from '../../hooks/useCO_PO_Mapping';

function CO_PO_Mapping({ subjectId }) {
  const { loading, mappings } = useCO_PO_Mapping(subjectId);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">CO-PO Mapping</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead>
            <th>CO Levels</th>
            <th>Count of Levels</th>
          </thead>
          <tbody>
            <tr className="bg-gray-200">
              <td className="px-4 py-2 border">Lvl. 1</td>
              <td className="px-4 py-2 border">{mappings.lv1}</td>
            </tr>
            <tr className="bg-gray-200">
              <td className="px-4 py-2 border">Lvl. 2</td>
              <td className="px-4 py-2 border">{mappings.lv2}</td>
            </tr>
            <tr className="bg-gray-200">
              <td className="px-4 py-2 border">Lvl. 3</td>
              <td className="px-4 py-2 border">{mappings.lv3}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CO_PO_Mapping;

