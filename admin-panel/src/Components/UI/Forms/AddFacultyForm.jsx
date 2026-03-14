import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addFaculty } from "../../../store/slices/facultySlice";

export default function AddFacultyForm({ onClose }) {
  const dispatch = useDispatch();
  const { list: subjects } = useSelector((state) => state.subjects);

  const [form, setForm] = useState({ name: "", email: "", subjectId: "" });

  const handleSubmit = () => {
    dispatch(addFaculty(form)); // dispatch thunk
    setForm({ name: "", email: "", subjectId: "" });
    onClose();
  };

  return (
    <div className="flex flex-col gap-3">
      <input
        type="text"
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="w-full p-2 border rounded"
        required
      />
      <select
        value={form.subjectId}
        onChange={(e) => setForm({ ...form, subjectId: e.target.value })}
        className="w-full p-2 border rounded"
        required
      >
        <option value="">Select Subject</option>
        {subjects.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>

      <button
        type="button"
        onClick={handleSubmit}
        className="bg-red-600 text-white py-2 rounded hover:bg-red-700 mt-2"
      >
        Add Faculty
      </button>
    </div>
  );
}