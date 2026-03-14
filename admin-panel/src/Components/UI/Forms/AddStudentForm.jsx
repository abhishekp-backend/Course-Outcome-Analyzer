import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addStudent } from "../../../store/slices/studentSlice";

export default function AddStudentForm({ onClose }) {
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    name: "",
    prn: "",
    roll: "",
    branch: "",
    year: "",
    division: "",
    subject: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim() || form.name.length < 2) newErrors.name = "Name must be at least 2 characters";
    if (!form.prn.trim()) newErrors.prn = "PRN is required";
    if (!form.roll || isNaN(form.roll)) newErrors.roll = "Valid roll number is required";
    if (!form.branch.trim()) newErrors.branch = "Branch is required";
    if (!form.year) newErrors.year = "Year is required";
    if (!form.division.trim()) newErrors.division = "Division is required";
    if (!form.subject.trim()) newErrors.subject = "Subject is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await dispatch(addStudent(form)).unwrap();
      onClose();
    } catch (err) {
      console.error("Failed to add student:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
        className={`w-full p-2 border rounded ${errors.name ? "border-red-500" : ""}`}
      />
      {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

      <input
        type="text"
        name="prn"
        placeholder="PRN"
        value={form.prn}
        onChange={handleChange}
        className={`w-full p-2 border rounded ${errors.prn ? "border-red-500" : ""}`}
      />
      {errors.prn && <p className="text-red-500 text-sm">{errors.prn}</p>}

      <input
        type="number"
        name="roll"
        placeholder="Roll Number"
        value={form.roll}
        onChange={handleChange}
        className={`w-full p-2 border rounded ${errors.roll ? "border-red-500" : ""}`}
      />
      {errors.roll && <p className="text-red-500 text-sm">{errors.roll}</p>}

      <input
        type="text"
        name="branch"
        placeholder="Branch"
        value={form.branch}
        onChange={handleChange}
        className={`w-full p-2 border rounded ${errors.branch ? "border-red-500" : ""}`}
      />
      {errors.branch && <p className="text-red-500 text-sm">{errors.branch}</p>}

      <select
        name="year"
        value={form.year}
        onChange={handleChange}
        className={`w-full p-2 border rounded ${errors.year ? "border-red-500" : ""}`}
      >
        <option value="">Select Year</option>
        <option value="1">1st Year</option>
        <option value="2">2nd Year</option>
        <option value="3">3rd Year</option>
        <option value="4">4th Year</option>
      </select>
      {errors.year && <p className="text-red-500 text-sm">{errors.year}</p>}

      <input
        type="text"
        name="division"
        placeholder="Division"
        value={form.division}
        onChange={handleChange}
        className={`w-full p-2 border rounded ${errors.division ? "border-red-500" : ""}`}
      />
      {errors.division && <p className="text-red-500 text-sm">{errors.division}</p>}

      <input
        type="text"
        name="subject"
        placeholder="Subject"
        value={form.subject}
        onChange={handleChange}
        className={`w-full p-2 border rounded ${errors.subject ? "border-red-500" : ""}`}
      />
      {errors.subject && <p className="text-red-500 text-sm">{errors.subject}</p>}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading}
        className="bg-red-600 text-white py-2 rounded hover:bg-red-700 disabled:opacity-50"
      >
        {loading ? "Adding..." : "Add Student"}
      </button>
    </div>
  );
}
