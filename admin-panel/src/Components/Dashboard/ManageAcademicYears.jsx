import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAcademicYears,
  createAcademicYear
} from "../../store/slices/academicYearSlice";
import AddButton from "../UI/AddButton";
import DataTable from "../UI/DataTable";
import ModalForm from "../UI/Forms/ModalForm";

export default function ManageAcademicYears() {
  const dispatch = useDispatch();
  const { years, loading } = useSelector(
    (state) => state.academicYear
  );

  const [isModalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    year: "",
    label: "",
    startDate: "",
    endDate: ""
  });

  /* ===================== ACADEMIC YEAR OPTIONS ===================== */

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-indexed

  // Academic year starts in June
  const academicStartYear =
    currentMonth >= 5 ? currentYear : currentYear - 1;

  const academicYearOptions = Array.from({ length: 10 }, (_, i) => {
    const start = academicStartYear + i;
    const end = start + 1;
    return `${start}-${end}`;
  });

  /* ===================== EFFECT ===================== */

  useEffect(() => {
    dispatch(fetchAcademicYears());
  }, [dispatch]);

  /* ===================== HANDLERS ===================== */

  const handleYearChange = (year) => {
    const endYearShort = year.split("-")[1]?.slice(-2);

    setForm((prev) => ({
      ...prev,
      year,
      label: year
        ? `AY ${year.split("-")[0]}-${endYearShort}`
        : ""
    }));
  };

  const isFormValid =
    Boolean(form.year) &&
    Boolean(form.label) &&
    Boolean(form.startDate) &&
    Boolean(form.endDate);

  const handleSubmit = () => {
    if (!isFormValid) return;

    dispatch(createAcademicYear(form));
    setModalOpen(false);
    setForm({
      year: "",
      label: "",
      startDate: "",
      endDate: ""
    });
  };

  /* ===================== TABLE ===================== */

  const columns = [
    "Year",
    "Label",
    "Start Date",
    "End Date"
  ];

  const rows = years.map((y) => ({
    Year: y.year,
    Label: y.label,
    "Start Date": new Date(y.startDate).toLocaleDateString(),
    "End Date": new Date(y.endDate).toLocaleDateString()
  }));

  /* ===================== RENDER ===================== */

  return (
    <div>
      <AddButton
        name="Academic Year"
        onClick={() => setModalOpen(true)}
      />

      {loading && <p>Loading...</p>}

      <DataTable columns={columns} rows={rows} />

      <ModalForm
        title="Add Academic Year"
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      >
        {/* Academic Year Dropdown */}
        <select
          value={form.year}
          onChange={(e) =>
            handleYearChange(e.target.value)
          }
          className="w-full p-2 border rounded mb-2"
        >
          <option value="">Select Academic Year</option>
          {academicYearOptions.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        {/* Auto-generated Label (editable) */}
        <input
          type="text"
          placeholder="Label (auto-generated)"
          value={form.label}
          onChange={(e) =>
            setForm({ ...form, label: e.target.value })
          }
          className="w-full p-2 border rounded mb-2"
        />

        {/* Start Date */}
        <input
          type="date"
          value={form.startDate}
          onChange={(e) =>
            setForm({ ...form, startDate: e.target.value })
          }
          className="w-full p-2 border rounded mb-2"
        />

        {/* End Date */}
        <input
          type="date"
          value={form.endDate}
          onChange={(e) =>
            setForm({ ...form, endDate: e.target.value })
          }
          className="w-full p-2 border rounded mb-4"
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isFormValid}
          className={`w-full px-4 py-2 rounded text-white ${
            isFormValid
              ? "bg-red-600"
              : "bg-red-400 cursor-not-allowed"
          }`}
        >
          Create Academic Year
        </button>
      </ModalForm>
    </div>
  );
}
