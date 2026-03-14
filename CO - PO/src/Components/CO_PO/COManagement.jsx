import React, { useState } from 'react';

function COManagement({ subjectId }) {
  const [showForm, setShowForm] = useState(false);
  const [editingCO, setEditingCO] = useState(null);
  const [formData, setFormData] = useState({
    coNumber: '',
    description: '',
    assessmentMethods: [],
    threshold: 60
  });

  const assessmentOptions = ['UT1', 'UT2'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = editingCO
      ? await updateCourseOutcome(editingCO._id, formData)
      : await createCourseOutcome({ ...formData, subject: subjectId });

    if (result.success) {
      setShowForm(false);
      setEditingCO(null);
      setFormData({ coNumber: '', description: '', assessmentMethods: [], threshold: 60 });
    }
  };

  const handleEdit = (co) => {
    setEditingCO(co);
    setFormData({
      coNumber: co.coNumber,
      description: co.description,
      assessmentMethods: co.assessmentMethods || [],
      threshold: co.threshold || 60
    });
    setShowForm(true);
  };

  const toggleAssessmentMethod = (method) => {
    setFormData(prev => ({
      ...prev,
      assessmentMethods: prev.assessmentMethods.includes(method)
        ? prev.assessmentMethods.filter(m => m !== method)
        : [...prev.assessmentMethods, method]
    }));
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Course Outcomes (COs)</h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingCO(null);
            setFormData({ coNumber: '', description: '', assessmentMethods: [], threshold: 60 });
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : 'Add CO'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 border border-gray-200 rounded-lg">
                    <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Assessment Methods</label>
            <div className="flex flex-wrap gap-2">
              {assessmentOptions.map(method => (
                <label key={method} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.assessmentMethods.includes(method)}
                    onChange={() => toggleAssessmentMethod(method)}
                    className="mr-2"
                  />
                  {method}
                </label>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Question</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 h-11 py-2 border rounded border-gray-700/70 resize-none "
              rows="3"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">CO Number</label>
              <input
                type="number"
                min="1"
                max="12"
                required
                value={formData.coNumber}
                onChange={(e) => setFormData({ ...formData, coNumber: e.target.value })}
                className="w-full px-3 py-2 border rounded border-gray-700/70"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Total Marks</label>
              <input
                type="number"
                min="0"
                max="7"
                required
                value={formData.threshold}
                onChange={(e) => setFormData({ ...formData, threshold: e.target.value })}
                className="w-full px-3 py-2 border rounded border-gray-700/70"
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            {editingCO ? 'Update CO' : 'Create CO'}
          </button>
        </form>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="space-y-2">
        {cos.length === 0 ? (
          <p className="text-gray-500">No Course Outcomes defined yet.</p>
        ) : (
          cos.map((co) => (
            <div key={co._id} className="p-4 border rounded-lg flex justify-between items-start">
              <div>
                <h3 className="font-semibold">CO{co.coNumber}</h3>
                <p className="text-gray-600">{co.description}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Threshold: {co.threshold}% | Methods: {co.assessmentMethods?.join(', ') || 'None'}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(co)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Edit
                </button>
                <button
                  onClick={() => removeCO(co._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default COManagement;

