import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchStudents,
  addStudent,
  deleteStudent,
} from "../../store/slices/studentSlice";

import AddButton from "../UI/AddButton";
import DataTable from "../UI/DataTable";
import ModalForm from "../UI/Forms/ModalForm";

export default function ManageStudents() {
  const dispatch = useDispatch();

  const { list, loading } = useSelector((state) => state.students);

  const division = ["A", "B", "C", "D"];

  const [isModalOpen, setModalOpen] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    rollNumber: "",
  });

  useEffect(() => {
    dispatch(fetchStudents());
  }, [dispatch]);

  const isFormValid =
    form.firstName.trim() &&
    form.lastName.trim() &&
    form.email.trim() &&
    form.rollNumber.trim();

  const handleDelete = (id) => dispatch(deleteStudent(id));

  const handleSubmit = () => {
    dispatch(addStudent(form));

    setModalOpen(false);

    setForm({
      firstName: "",
      lastName: "",
      email: "",
      rollNumber: "",
      classId: "",
    });
  };

  const columns = [
    "First Name",
    "Last Name",
    "Email",
    "Roll Number",
    "Class",
    "Actions",
  ];

  const rows = list.map((s) => ({
    "First Name": s.firstName,
    "Last Name": s.lastName,
    Email: s.email,
    "Roll Number": s.rollNumber,

    Actions: (
      <div className="space-x-2">
        <button className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
          Edit
        </button>

        <button
          onClick={() => handleDelete(s.id)}
          className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    ),
  }));

  return (
    <div>
      <AddButton
        name="Student"
        onClick={() => setModalOpen(true)}
      />

      {loading && <p>Loading...</p>}

      <DataTable columns={columns} rows={rows} />

      <ModalForm
        title="Add Student"
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          placeholder="First Name"
          value={form.firstName}
          onChange={(e) =>
            setForm({ ...form, firstName: e.target.value })
          }
          className="w-full p-2 border rounded mb-2"
        />

        <input
          type="text"
          placeholder="Last Name"
          value={form.lastName}
          onChange={(e) =>
            setForm({ ...form, lastName: e.target.value })
          }
          className="w-full p-2 border rounded mb-2"
        />

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
          className="w-full p-2 border rounded mb-2"
        />

        <input
          type="text"
          placeholder="Roll Number"
          value={form.rollNumber}
          onChange={(e) =>
            setForm({ ...form, rollNumber: e.target.value })
          }
          className="w-full p-2 border rounded mb-2"
        />

        <select
          value={form.classId}
          onChange={(e) =>
            setForm({ ...form, classId: e.target.value })
          }
          className="w-full p-2 border rounded"
        >
          <option value="">Select Class</option>

          {division.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <button
          type="submit"
          disabled={!isFormValid}
          className={`w-full py-2 text-white mt-3 rounded ${
            isFormValid
              ? "bg-red-600 hover:bg-red-700"
              : "bg-red-400 cursor-not-allowed"
          }`}
        >
          Create Faculty
        </button>
      </ModalForm>
    </div>
  );
}