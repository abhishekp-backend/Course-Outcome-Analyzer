import React, { useState } from "react";
import {useSubjects} from "../../../hooks/useSubjects"

function SubjectForm({ isOpen, onClose, onSubmit, onSubjectAdded }) {
  const {createSubject} = useSubjects()
  const [formData, setFormData] = useState({
    name: "",
    branch: "",
    semester: "",
    year: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Subject name is required";
    }

    if (!formData.branch.trim()) {
      newErrors.branch = "Branch is required";
    }

    if (!formData.semester) {
      newErrors.semester = "Semester is required";
    } else if (formData.semester < 1 || formData.semester > 8) {
      newErrors.semester = "Semester must be between 1 and 8";
    }

    if (formData.year==="") {
      newErrors.year = "Year is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);
      // Convert semester and year to numbers
      const formattedData = {
        ...formData,
        semester: Number(formData.semester),
        year: Number(formData.year),
      };

      const result = await createSubject(formattedData);
      
      if (result.success) {
        // Reset form
        setFormData({
          name: "",
          branch: "",
          semester: "",
          year: "",
        });
        // Call the callback to show success message
        if (onSubjectAdded) {
          onSubjectAdded();
        }
        // Close the form
        if (onClose) {
          onClose();
        }
      } else {
        // Handle error - you can add error state here if needed
        console.error("Failed to add subject:", result.error);
      }
      setIsSubmitting(false);
    }
  };

  // Always render the component, but conditionally show/hide it
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Add Teaching Subject
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Subject Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter subject name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="branch"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Branch
                </label>
                <select name="branch" value={formData.branch} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded">
                  <option value="" disabled>Select Branch</option>
                  <option value="CSE">CSE</option>
                  <option value="IT">IT</option>
                  <option value="AIML">AIML</option>
                  <option value="CSBS">CSBS</option>
                </select>
                {errors.branch && (
                  <p className="mt-1 text-sm text-red-600">{errors.branch}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="semester"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Semester
                </label>
                <input
                  id="semester"
                  name="semester"
                  type="number"
                  min="1"
                  max="8"
                  value={formData.semester}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter semester (1-8)"
                />
                {errors.semester && (
                  <p className="mt-1 text-sm text-red-600">{errors.semester}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="year"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Year
                </label>
                <select name="year" value={formData.year} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded">
                  <option value="" disabled>Select Year</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
                {errors.year && (
                  <p className="mt-1 text-sm text-red-600">{errors.year}</p>
                )}
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Adding..." : "Add Subject"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default SubjectForm;
