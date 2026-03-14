import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBranches,
  createBranch
} from "../../store/slices/branchSlice";
import AddButton from "../UI/AddButton";
import DataTable from "../UI/DataTable";
import ModalForm from "../UI/Forms/ModalForm";

export default function ManageBranches() {
  const dispatch = useDispatch();

  const { branches, loading } = useSelector(
    (state) => state.branch
  );
  const { faculties } = useSelector(
    (state) => state.faculty
  )

  const [isModalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    faculty: ""
  });

  /* ===================== EFFECT ===================== */

  useEffect(() => {
    dispatch(fetchBranches({}));
  }, [dispatch]);

  /* ===================== HANDLERS ===================== */

  const isFormValid =
    Boolean(form.name)

  const handleSubmit = () => {
    if (!isFormValid) return;

    dispatch(createBranch(form));
    setModalOpen(false);
    setForm({ name: "", faculty: "" });
  };

  /* ===================== TABLE ===================== */

  const columns = [
    "Name",
    "Year",
    "Actions"
  ];

  const rows = branches.map((b) => ({
    Name: b.branchName,
    Year: b.academicYear
  }));

  /* ===================== RENDER ===================== */

  return (
    <div>
      <AddButton
        name="Branch"
        onClick={() => setModalOpen(true)}
      />

      {loading && <p>Loading...</p>}

      <DataTable columns={columns} rows={rows} />

      <ModalForm
        title="Add Branch"
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          placeholder="Branch Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
          className="w-full p-2 border rounded mb-2"
        />

        {/* <select value={""} className = "w-full border p-2 rounded mt-1 mb-2">
          <option value="">Select Faculty</option>
          {
            faculties.map(e => {
              return (
                <option key={e.id} value={e.id}>{e.username}</option>
              )
            })
          }
        </select> */}

        <button
          type="submit"
          disabled={!isFormValid}
          className={`w-full px-4 py-2 rounded text-white ${
            isFormValid
              ? "bg-red-600"
              : "bg-red-400 cursor-not-allowed"
          }`}
        >
          Create Branch
        </button>
      </ModalForm>
    </div>
  );
}
