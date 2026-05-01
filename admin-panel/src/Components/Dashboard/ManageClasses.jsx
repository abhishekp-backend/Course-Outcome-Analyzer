import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchClasses, createClass } from "../../store/slices/classSlice";
import { fetchFaculty } from "../../store/slices/facultySlice.js";
import { fetchAcademicSubjects } from "../../store/slices/subjectsSlice";

import AddButton from "../UI/AddButton";
import DataTable from "../UI/DataTable";
import ModalForm from "../UI/Forms/ModalForm";

export default function ManageClasses() {
  const dispatch = useDispatch();
  const { faculties } = useSelector((s) => s.faculty);
  const { subjects } = useSelector((s) => s.subjects);
  const { academicId } = useSelector((s) => s.academicYear);
  const { classes, loading } = useSelector((s) => s.class);
  const { branches } = useSelector((state) => state.branch);
  // const { currentYear } = useSelector((s) => s.academicYear);

  const [isModalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    academicYearId: "",
    subjectId: "",
    division: "",
    facultyId: "",
    semester: 0,
    branch: "",
  });

  /* ===================== EFFECT ===================== */

  useEffect(() => {
    dispatch(fetchFaculty());
    dispatch(fetchClasses());
    if (academicId !== "") {
      dispatch(fetchAcademicSubjects());
    }
  }, [dispatch, academicId]);

  /* ===================== VALIDATION ===================== */

  const isFormValid = Boolean(form.subjectId) && Boolean(form.division);

  /* ===================== SUBMIT ===================== */

  const handleSubmit = () => {
    if (!isFormValid) return;
    console.log("Creating")
    dispatch(createClass(form));
    setModalOpen(false);
    setForm({
      academicYearId: "",
      subjectId: "",
      division: "",
      facultyId: "",
      semester: null,
      branch: "",
    });
    console.log("Created")
  };

  /* ===================== TABLE ===================== */

  const columns = ["Branch", "Subject", "Semester", "Division"];

  const rows = Array.isArray(classes)
    ? classes.map((c) => ({
        Branch: c.branch,
        Subject: c.subject,
        Division: c.division,
        Semester: c.semester,
        Faculty: c.faculty,
      }))
    : [];

  const DIVISIONS = ["A", "B", "C", "D"];

  /* ===================== RENDER ===================== */

  return (
    <div>
      <AddButton name="Class / Section" onClick={() => setModalOpen(true)} />
      {/* Fetch classes/division */}
      {loading.fetch ? (
        <p className="m-auto">Loading...</p>
      ) : (
        <DataTable columns={columns} rows={rows} />
      )}

      <ModalForm
        title="Create Class / Section"
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      >
        {/* Branch */}
        <select
          value={form.subjectId}
          onChange={(e) => setForm({ ...form, subjectId: e.target.value })}
          className="w-full p-2 border rounded mb-2"
        >
          <option value="" disabled>
            Select Subject
          </option>
          {subjects.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name}
            </option>
          ))}
        </select>

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
          className="w-full p-2 border rounded mb-2"
        >
          <option value={0} disabled>
            Select Semester
          </option>
          {Array.from({ length: 8 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>

        <select
          value={form.division}
          onChange={(e) => setForm({ ...form, division: e.target.value })}
          className="w-full p-2 border rounded mb-2"
        >
          <option value="" disabled>
            Select Division
          </option>

          {DIVISIONS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        <select
          value={form.facultyId}
          onChange={(e) => setForm({ ...form, facultyId: e.target.value })}
          className="w-full p-2 border rounded mb-4"
        >
          <option value="" disabled>
            Select Faculty
          </option>

          {faculties.map((f) => (
            <option key={f._id} value={f._id}>
              {f.username}
            </option>
          ))}
        </select>

        <button
          type="submit"
          disabled={!isFormValid}
          className={`w-full px-4 py-2 rounded text-white ${
            isFormValid ? "bg-red-600" : "bg-red-400 cursor-not-allowed"
          }`}
        >
          Create Class
        </button>
      </ModalForm>
    </div>
  );
}
