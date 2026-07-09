import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchStudents,
  addStudent,
  deleteStudent,
} from "../../store/slices/studentSlice";
import { fetchClasses } from "../../store/slices/classSlice";
import AddButton from "../UI/AddButton";
import DataTable from "../UI/DataTable";
import ModalForm from "../UI/Forms/ModalForm";
import { uploadExcel } from "../../store/slices/studentSlice.js";
import toast from "react-hot-toast"

export default function ManageStudents() {
  const dispatch = useDispatch();

  const { list, loading } = useSelector((state) => state.students);
  const { classes } = useSelector((state) => state.class);
  const division = ["A", "B", "C", "D"];
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileRef = useRef();

  const [isModalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    rollNumber: "",
  });
  const [id, setId] = useState("");

  const validateClientSide = (f) => {
    const allowedTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
      "application/vnd.ms-excel", // .xls
      "text/csv", // .csv
    ];
    const maxSize = 10 * 1024 * 1024; // 10MB safety
    if (!allowedTypes.includes(f.type)) {
      alert("Invalid file type. Only Excel/CSV allowed.");
      return false;
    }
    if (f.size > maxSize) {
      alert("File too large. Max 10MB.");
      return false;
    }
    return true;
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter") setDragActive(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const f = e.dataTransfer?.files?.[0];
    if (f && validateClientSide(f)) setFile(f);
  };

  const handleDragLeave = (e) => {
    // If leaving the browser window completely
    if (
      e.clientX <= 0 ||
      e.clientY <= 0 ||
      e.clientX >= window.innerWidth ||
      e.clientY >= window.innerHeight
    ) {
      setDragActive(false);
    }
  };

  useEffect(() => {
    // dispatch(fetchStudents());
    dispatch(fetchClasses());
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

  const handleUpload = async () => {
    if (!id) {
      alert("Please select a class");
      return;
    }

    try {
      const result = await dispatch(uploadExcel({ file, id })).unwrap();

      console.log(result);
      setFile(null);

      toast.success(result.message);
    } catch (err) {
      toast.error(err);
    }
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="mb-4">
        {file && <span className="text-gray-600">{file.name}</span>}

        {file && (
          <button
            onClick={handleUpload}
            className="bg-green-600/80 hover:bg-green-700/90 p-2 rounded text-white shadow-sm"
          >
            Upload
          </button>
        )}
      </div>

      {dragActive && (
        <div className="fixed inset-0 z-99 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <p className="text-white text-xl font-semibold animate-pulse">
            Drop file to upload
          </p>
        </div>
      )}

      <input
        ref={fileRef}
        id="file-upload"
        type="file"
        accept=".xlsx,.xls,.csv"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (!f) return;
          if (validateClientSide(f)) setFile(f); // save selected file to state
        }}
      />
      {!file && <AddButton name="Student" onClick={() => setModalOpen(true)} />}
      {loading && <p>Loading...</p>}
      <div className="flex">
        <p className="m-auto ml-0 mr-0">Select Class: </p>
        <select
          name="class"
          value={id}
          onChange={(e) => setId(e.target.value)}
          className="border rounded p-1 m-auto ml-2 outline-none"
        >
          k
          <option value="" disabled>
            Select Class
          </option>
          {classes?.map((e) => {
            return (
              <option
                value={JSON.stringify({
                  branch: e.branch,
                  division: e.division,
                  classId: e._id,
                })}
              >
                {e.branch}-{e.subject}-{e.division}
              </option>
            );
          })}
        </select>
      </div>
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
          onChange={(e) => setForm({ ...form, firstName: e.target.value })}
          className="w-full p-2 border rounded mb-2"
        />

        <input
          type="text"
          placeholder="Last Name"
          value={form.lastName}
          onChange={(e) => setForm({ ...form, lastName: e.target.value })}
          className="w-full p-2 border rounded mb-2"
        />

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full p-2 border rounded mb-2"
        />

        <input
          type="text"
          placeholder="Roll Number"
          value={form.rollNumber}
          onChange={(e) => setForm({ ...form, rollNumber: e.target.value })}
          className="w-full p-2 border rounded mb-2"
        />

        <select
          value={form.classId}
          onChange={(e) => setForm({ ...form, classId: e.target.value })}
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
