import React, { useState } from "react";
import { useStudents } from "../../hooks/useStudent";

function StudentForm({ isOpen, onClose, subject }) {
  const { createStudent } = useStudents(subject);
  const [formData, setFormData] = useState({
    name: "",
    prn: "",
    roll: "",
    semester: "",
    branch: "",
  });

  const [errors, setErrors] = useState({});

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
      newErrors.name = "Student name is required";
    }

    if (!formData.prn.trim()) {
      newErrors.prn = "PRN is required";
    } else if (!/^\d{10}$/.test(formData.prn)) {
      newErrors.prn = "PRN must be exactly 10 digits";
    }

    if (!formData.roll.trim()) {
      newErrors.roll = "Roll No is required";
    } else {
      const rollNumber = Number(formData.roll);
      if (isNaN(rollNumber)) {
        newErrors.roll = "Roll number must be a valid number";
      } else if (rollNumber <= 0) {
        newErrors.roll = "Roll number must be greater than 0";
      }
    }

    if (!formData.semester) {
      newErrors.semester = "Semester is required";
    }

    if (!formData.branch.trim()) {
      newErrors.branch = "Branch is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const formattedData = {
        ...formData,
        roll: Number(formData.roll),
        semester: Number(formData.semester),
        subject: subject,
      };

      createStudent(formattedData);

      onClose();

      setFormData({
        name: "",
        prn: "",
        roll: "",
        semester: "",
        branch: "",
      });
    }
  };
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] ">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex">
              <h2 className="text-xl font-semibold text-gray-800">
                Add Student Details
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 focus:outline-none ml-auto"
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
              {/* Student Name */}
              <div>
                <label
                  htmlFor="studentName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Student Name
                </label>
                <input
                  id="studentName"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter student name"
                />
                {errors.studentName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.studentName}
                  </p>
                )}
              </div>

              {/* PRN */}
              <div>
                <label
                  htmlFor="prn"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  PRN
                </label>
                <input
                  id="prn"
                  name="prn"
                  type="text"
                  value={formData.prn}
                  onChange={handleChange}
                  maxLength={10}
                  pattern="[0-9]{10}"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter 10-digit PRN"
                />
                {errors.prn && (
                  <p className="mt-1 text-sm text-red-600">{errors.prn}</p>
                )}
              </div>

              {/* Roll No */}
              <div>
                <label
                  htmlFor="rollNo"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Roll Number
                </label>
                <input
                  id="rollNo"
                  name="roll"
                  type="number"
                  min="1"
                  value={formData.roll}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter roll number (must be greater than 0)"
                />
                {errors.roll && (
                  <p className="mt-1 text-sm text-red-600">{errors.roll}</p>
                )}
              </div>

              {/* Semester */}
              <div>
                <label
                  htmlFor="semester"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Semester
                </label>
                <select
                  id="semester"
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="" disabled>Select Semester</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                </select>
                {errors.semester && (
                  <p className="mt-1 text-sm text-red-600">{errors.semester}</p>
                )}
              </div>

              {/* Branch */}
              <div>
                <label
                  htmlFor="branch"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Branch
                </label>
                <select
                  id="branch"
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="" disabled>Select Branch</option>
                  <option value="CSE">CSE</option>
                  <option value="AIML">AIML</option>
                  <option value="IT">IT</option>
                  <option value="CSBS">CSBS</option>
                </select>
                {errors.branch && (
                  <p className="mt-1 text-sm text-red-600">{errors.branch}</p>
                )}
              </div>

              {/* Buttons */}
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
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                >
                  Add Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default StudentForm;
