import React, { useState, useEffect } from 'react';
import { useCO_PO_Mapping } from '../../hooks/useCO_PO_Mapping';

function CO_PO_Mapping({ subjectId }) {
  const { mappings, createCO_PO_Mapping, removeMapping, loading } = useCO_PO_Mapping(subjectId);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    co: '',
    po: '',
    correlationLevel: 2
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await createCO_PO_Mapping({
      ...formData,
      subject: subjectId
    });

    if (result.success) {
      setShowForm(false);
      setFormData({ co: '', po: '', correlationLevel: 2 });
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">CO-PO Mapping</h2>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded-lg">
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Course Outcome (CO)</label>
              <select
                required
                value={formData.co}
                onChange={(e) => setFormData({ ...formData, co: e.target.value })}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="">Select CO</option>
                {cos.map(co => (
                  <option key={co._id} value={co._id}>
                    CO{co.coNumber} - {co.description.substring(0, 50)}...
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Program Outcome (PO)</label>
              <select
                required
                value={formData.po}
                onChange={(e) => setFormData({ ...formData, po: e.target.value })}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="">Select PO</option>
                {pos.map(po => (
                  <option key={po._id} value={po._id}>
                    PO{po.poNumber} - {po.description.substring(0, 50)}...
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Correlation Level</label>
              <select
                required
                value={formData.correlationLevel}
                onChange={(e) => setFormData({ ...formData, correlationLevel: Number(e.target.value) })}
                className="w-full px-3 py-2 border rounded"
              >
                <option value={1}>Low (1)</option>
                <option value={2}>Medium (2)</option>
                <option value={3}>High (3)</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Create Mapping
          </button>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 border">CO</th>
              <th className="px-4 py-2 border">PO</th>
              <th className="px-4 py-2 border">Correlation</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {console.log(mappings)}
            {mappings.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-4 py-2 text-center text-gray-500">
                  No mappings defined yet.
                </td>
              </tr>
            ) : (
              mappings.map((mapping) => (
                <tr key={mapping._id}>
                  <td className="px-4 py-2 border">
                    CO{mapping.co?.coNumber}: {mapping.co?.description?.substring(0, 40)}...
                  </td>
                  <td className="px-4 py-2 border">
                    PO{mapping.po?.poNumber}: {mapping.po?.description?.substring(0, 40)}...
                  </td>
                  <td className="px-4 py-2 border text-center">
                    {mapping.correlationLevel === 1 ? 'Low' : mapping.correlationLevel === 2 ? 'Medium' : 'High'}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    <button
                      onClick={() => removeMapping(mapping._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CO_PO_Mapping;

