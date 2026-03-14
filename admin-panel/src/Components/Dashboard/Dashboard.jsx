import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import ModalForm from "../UI/Forms/ModalForm";

import AddFacultyForm from "../UI/Forms/AddFacultyForm";
import AddStudentForm from "../UI/Forms/AddStudentForm";
import AddSubjectForm from "../UI/Forms/AddSubjectForm";

import { fetchStudents } from "../../store/slices/studentSlice" //"../../store/slices/studentSlice";
import { fetchFaculty } from "../../store/slices/facultySlice";

export default function Dashboard() {
  const dispatch = useDispatch();
  const [activeModal, setActiveModal] = useState(null);

  useEffect(() => {
    // dispatch(fetchStudents());
    // dispatch(fetchFaculty());
    // dispatch(fetchSubjects());
  }, [dispatch]);

  const openModal = (type) => setActiveModal(type);
  const closeModal = () => setActiveModal(null);

  return (
    <div className="flex min-h-screen">

      <main className="flex-1 p-6 bg-gray-50">
        <h1 className="text-3xl font-bold text-red-600 mb-6">Dashboard</h1>

        <div className="flex flex-wrap gap-4 mb-8">
          {["student", "faculty", "subject"].map((type) => (
            <button
              key={type}
              onClick={() => openModal(type)}
              className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
            >
              Add {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {activeModal && (
          <ModalForm
            title={`Add ${activeModal.charAt(0).toUpperCase() + activeModal.slice(1)}`}
            isOpen={!!activeModal}
            onClose={closeModal}
            onSubmit={() => {}}
          >
            {activeModal === "faculty" && <AddFacultyForm onClose={closeModal} />}
            {activeModal === "student" && <AddStudentForm onClose={closeModal} />}
            {activeModal === "subject" && <AddSubjectForm onClose={closeModal} />}
          </ModalForm>
        )}
      </main>
    </div>
  );
}
