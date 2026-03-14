import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchFaculty,
  addFaculty,
  deleteFaculty,
  updateFaculty
} from "../../store/slices/facultySlice";
import { fetchAcademicSubjects } from "../../store/slices/subjectsSlice";
import AddButton from "../UI/AddButton";
import DataTable from "../UI/DataTable";
import ModalForm from "../UI/Forms/ModalForm";
import { getChangedFields } from "../../hook/utils"

export default function ManageFaculty() {
  const dispatch = useDispatch();

  const { faculties, loading } = useSelector(
    (state) => state.faculty
  );
  const { subjects } = useSelector(
    (state) => state.subjects
  );
  const {currentYear} = useSelector(
    (state) => state.academicYear
  )

  const [isModalOpen, setModalOpen] = useState(false);
  const [showEditForm, showEdit] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState({})
  const [originalFaculty, setOriginalFaculty] = useState(null);
  const [form, setForm] = useState({
    username: "",
    email: "",
    subjectId: "null",
  });

  /* ===================== EFFECT ===================== */

  useEffect(() => {
    dispatch(fetchFaculty());
    if (currentYear) {
      dispatch(fetchAcademicSubjects(currentYear));
    }
  }, [dispatch, currentYear]);

  /* ===================== HANDLERS ===================== */

  const isFormValid =
    form.username.trim() &&
    form.email.trim();

  const handleSubmit = () => {
    if (!isFormValid) return;

    dispatch(addFaculty(form));
    setModalOpen(false);
    setForm({ username: "", email: "", subjectId: "" });
  };

  const handleDelete = (id) => {
    dispatch(deleteFaculty(id));
  };

const handleUpdateFaculty = () => {
  if (!originalFaculty) return;

  const changedFields = getChangedFields(
    editingFaculty,
    originalFaculty
  );

  if (Object.keys(changedFields).length === 0) {
    showEdit(false);
    return;
  }

  dispatch(
    updateFaculty({
      id: editingFaculty._id,
      data: changedFields,
    })
  );

  showEdit(false);
};

  /* ===================== TABLE ===================== */

  const columns = ["Username", "Email", "Actions"];
  const rows = faculties.map((e)=>({
    Username: e.username,
    Email: e.email,
    Branch: e.branch,
    Actions: (
      <div className="space-x-2">
        <button
          onClick={() => {
            showEdit(!showEditForm);
            setEditingFaculty(e);
            setOriginalFaculty(e)
          }}
          className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Edit
        </button>
        <button
          onClick={() => handleDelete(e._id)}
          className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    ),
  }))

  /* ===================== RENDER ===================== */

  return (
    <div>
      <AddButton name="Faculty" onClick={() => {setModalOpen(true); }} />

      {loading && <p>Loading...</p>}
      <DataTable columns={columns} rows={rows} />

      {/* Faculty Creation Modal Form */}
      <ModalForm
        title="Add Faculty"
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={(e) =>
            setForm({ ...form, username: e.target.value })
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

        <button
          type="submit"
          disabled={!isFormValid}
          className={`w-full py-2 text-white rounded ${
            isFormValid
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-blue-400 cursor-not-allowed"
          }`}
        >
          Create Faculty
        </button>
      </ModalForm>

      {/* Faculty Editing Modal Form */}
      <ModalForm
        title="Change Faculty Details"
        isOpen={showEditForm}
        onClose={() => showEdit(false)}
        // onSubmit={handleSubmit}
      >
        <input
          type="text"
          placeholder="Username"
          value={editingFaculty.username || ""}
          onChange={(e) =>
            setEditingFaculty({ ...editingFaculty, username: e.target.value })
          }
          className="w-full p-2 border rounded mb-2"
        />

        <input
          type="email"
          placeholder="Email"
          value={editingFaculty.email || ""}
          onChange={(e) =>
            setEditingFaculty({ ...editingFaculty, email: e.target.value })
          }
          className="w-full p-2 border rounded mb-2"
        />

        <select
          value={editingFaculty.subjectId || ""}
          onChange={(e) =>
            setEditingFaculty({ ...editingFaculty, subjectId: e.target.value })
          }
          className="w-full p-2 border rounded mb-4"
        >
          <option disabled>Select Subject</option>
          {subjects && subjects.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name}
            </option>
          ))}
        </select>

        <button
          type="submit"
          disabled={!isFormValid}
          className={`w-full py-2 text-white rounded ${
            isFormValid
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-blue-400 cursor-not-allowed"
          }`}
        >
          Edit Faculty
        </button>
      </ModalForm>
    </div>
  );
}
