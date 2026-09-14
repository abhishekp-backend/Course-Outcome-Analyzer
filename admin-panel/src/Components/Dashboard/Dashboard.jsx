import React, { useState } from "react";
import ModalForm from "../UI/Forms/ModalForm";

import AddFacultyForm from "../UI/Forms/AddFacultyForm";
import AddStudentForm from "../UI/Forms/AddStudentForm";
import AddSubjectForm from "../UI/Forms/AddSubjectForm";
import { useSelector } from "react-redux";
import Card from "../Analytics/Card";

export default function Dashboard() {
  const [activeModal, setActiveModal] = useState(null);

  const closeModal = () => setActiveModal(null);
  const { length: noOfFaculties } = useSelector((state) => state.faculty);
  const { length: noOfClasses } = useSelector((state) => state.class);
  const { length: noOfAcademicYears } = useSelector((state) => state.academicYear);
  const { length: noOfBranches} = useSelector(state => state.branch);
  const { length: noOfSubjects } = useSelector((state) => state.subjects);
  
  const { user } = useSelector(state => state.auth);

  const cards = {
    "Branches / HODs": noOfBranches,
    Faculties: noOfFaculties,
    Subjects: noOfSubjects,
    Classes: noOfClasses,
    AcademicYear: noOfAcademicYears,
  };

  return (
    <div className="flex">
      <main className="flex-1 p-6 bg-gray-50">
        <h1 className="text-3xl font-bold text-red-600 mb-6">Dashboard</h1>

        <div className="analytics grid grid-cols-4 gap-4 select-none">
          {Object.entries(cards).map((e) => {
            return <Card title={e[0]} counts={e[1]} />;
          })}
        </div>

        {activeModal && (
          <ModalForm
            title={`Add ${activeModal.charAt(0).toUpperCase() + activeModal.slice(1)}`}
            isOpen={!!activeModal}
            onClose={closeModal}
            onSubmit={() => {}}
          >
            {activeModal === "faculty" && (
              <AddFacultyForm onClose={closeModal} />
            )}
            {activeModal === "student" && (
              <AddStudentForm onClose={closeModal} />
            )}
            {activeModal === "subject" && (
              <AddSubjectForm onClose={closeModal} />
            )}
          </ModalForm>
        )}
      </main>
    </div>
  );
}
