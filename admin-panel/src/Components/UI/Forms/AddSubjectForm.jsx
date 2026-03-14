import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addSubject } from "../../../store/slices/subjectsSlice";

export default function AddSubjectForm({ onClose }) {
  const dispatch = useDispatch();
  const [form, setForm] = useState({ name: "", classId: "" });

  const handleSubmit = () => {
    dispatch(addSubject(form));
    onClose();
  };

  return (
    <div className="flex flex-col gap-3">
      <input
        type="text"
        placeholder="Subject Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="w-full p-2 border rounded"
        required
      />
      {/* <select
        value={form.classId}
        onChange={(e) => setForm({ ...form, classId: e.target.value })}
        className="w-full p-2 border rounded"
        required
      >
        <option value="">Select Class</option>
        {classes.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select> */}
      <button
        type="button"
        onClick={handleSubmit}
        className="bg-red-600 text-white py-2 rounded hover:bg-red-700"
      >
        Add Subject
      </button>
    </div>
  );
}
