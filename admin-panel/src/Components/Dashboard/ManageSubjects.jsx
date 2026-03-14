import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchAcademicSubjects,
  addSubject,
  deleteSubject,
  updateSubject,
} from "../../store/slices/subjectsSlice";
import { fetchFaculty } from "../../store/slices/facultySlice";
import { fetchBranches } from "../../store/slices/branchSlice";
import { fetchClasses } from "../../store/slices/classSlice";
import AddButton from "../UI/AddButton";
import DataTable from "../UI/DataTable";
import ModalForm from "../UI/Forms/ModalForm";
import {getChangedFields} from "../../hook/utils"

export default function ManageSubjects() {
  const dispatch = useDispatch();

  const { subjects, loading } = useSelector((state) => state.subjects);
  const { faculties } = useSelector((state) => state.faculty);
  const { branches } = useSelector((state) => state.branch);
  const { academicId } = useSelector((state) => state.academicYear);
  const { classes } = useSelector((state) => state.class)

  /* ===================== STATE ===================== */

  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    branch: "",
    semester: "",
  });

  const [editingSubject, setEditingSubject] = useState(null);
  const [originalSubject, setOriginalSubject] = useState(null);

  /* ===================== EFFECTS ===================== */

  useEffect(() => {
    if (academicId !== "") {
      dispatch(fetchAcademicSubjects());
      if (branches.length === 0) {
        dispatch(fetchBranches({ year: "2026" }));
      }
      if (faculties.length === 0) {
        dispatch(fetchFaculty());
      }
      dispatch(fetchClasses())
    }
  }, [dispatch, academicId, faculties, branches]);

  /* ===================== VALIDATION ===================== */

  const isCreateValid =
    form.name.trim() &&
    form.branch &&
    form.semester;

  /* ===================== HANDLERS ===================== */

  const handleCreate = () => {
    if (!isCreateValid) return;

    dispatch(addSubject(form));
    setCreateOpen(false);
    setForm({ name: "", facultyId: "", branch: "", semester: "" });
  };

  const handleDelete = (id) => {
    dispatch(deleteSubject(id));
  };

  const changedFields = getChangedFields(editingSubject, originalSubject)

  const handleUpdate = () => {
    if (!editingSubject || !originalSubject) return;

    const diff = getChangedFields(editingSubject, originalSubject);

    if (Object.keys(diff).length === 0) {
      setEditOpen(false);
      return;
    }
    
    dispatch(
      updateSubject({
        id: editingSubject._id,
        data: diff,
      })
    );
    setEditingSubject(null)
    setOriginalSubject(null)

    setEditOpen(false);
  };

  /* ===================== TABLE ===================== */

  const columns = ["Name", "Branch", "Semester", "Actions"];

  const rows = Array.isArray(subjects)
    ? subjects.map((s) => ({
        Name: s.name,
        Branch: s.branchName,
        Semester: s.semester,
        Actions: (
          <div className="space-x-2">
            <button
              onClick={() => {
                setEditingSubject({ ...s });
                setOriginalSubject({ ...s });
                setEditOpen(true);
              }}
              className="px-2 py-1 bg-blue-500 text-white rounded"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(s._id)}
              className="px-2 py-1 bg-red-500 text-white rounded"
            >
              Delete
            </button>
          </div>
        ),
      }))
    : [];

  /* ===================== RENDER ===================== */

  return (
    <div>
      <AddButton name="Subject" onClick={() => setCreateOpen(true)} />

      {loading ? <p>Loading...</p> : <DataTable columns={columns} rows={rows} />}

      {/* CREATE MODAL */}
      <ModalForm
        title="Add Subject"
        isOpen={isCreateOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreate}
      >
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Name"
          className="w-full p-2 border rounded mb-2"
        />

        <select
          value={form.branch}
          onChange={(e) => setForm({ ...form, branch: e.target.value })}
          className="w-full p-2 border rounded mb-2"
        >
          <option value="">Select Branch</option>
          {branches.map((b) => (
            <option key={b._id} value={b._id}>
              {b.branchName}
            </option>
          ))}
        </select>

        <select
          value={form.semester}
          onChange={(e) => setForm({ ...form, semester: e.target.value })}
          className="w-full p-2 border rounded mb-4"
        >
          <option value="" disabled>Select Semester</option>
          {Array.from({ length: 8 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>

        <button
          disabled={!isCreateValid}
          className="w-full py-2 bg-red-600 text-white rounded disabled:bg-red-400"
        >
          Create Subject
        </button>
      </ModalForm>

      {/* EDIT MODAL */}
      <ModalForm
        title="Edit Subject"
        isOpen={isEditOpen}
        onClose={() => setEditOpen(false)}
        onSubmit={handleUpdate}
      >
        <input
          value={editingSubject?.name || ""}
          className="w-full p-2 border rounded mb-2 bg-gray-100"
        />

        <select
          value={editingSubject?.facultyId || ""}
          onChange={(e) =>
            setEditingSubject({
              ...editingSubject,
              facultyId: e.target.value,
            })
          }
          className="w-full p-2 border rounded mb-2"
        >
          <option value="">Select Faculty</option>
          {faculties.map((f) => (
            <option key={f._id} value={f._id}>
              {f.username}
            </option>
          ))}
        </select>

        <select
          value={editingSubject?.branch || ""}
          onChange={(e) =>
            setEditingSubject({
              ...editingSubject,
              branch: e.target.value,
            })
          }
          className="w-full p-2 border rounded mb-2"
        >
          <option value="">Select Branch</option>
          {branches.map((b) => (
            <option key={b._id} value={b._id}>
              {b.branchName}
            </option>
          ))}
        </select>

        <select
          value={editingSubject?.semester || ""}
          onChange={(e) =>
            setEditingSubject({
              ...editingSubject,
              semester: e.target.value,
            })
          }
          className="w-full p-2 border rounded mb-4"
        >
          <option value="">Select Semester</option>
          {Array.from({ length: 8 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>

        <button
          disabled={Object.keys(changedFields).length === 0}
          className="w-full py-2 bg-red-600 text-white rounded disabled:bg-red-400"
        >
          Update Subject
        </button>
      </ModalForm>
    </div>
  );
}
