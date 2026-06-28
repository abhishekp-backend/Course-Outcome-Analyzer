import React, { useState, useEffect } from "react";
import SubjectList from "../SubjectList";
import SubjectForm from "../SubjectForm";
import { useSubjects } from "../../../hooks/useSubjects";
import { useStudents } from "../../../hooks/useStudent";
import StudentList from "../../Student/StudentList";
import { clearSingleStudent } from "../../../store/slices/studentSlice";
import { useDispatch, useSelector } from "react-redux";

function Dashboard({ isSearched, setSearched }) {
  const { subjects, fetchAllSubject, isSubjectFetched, isSubjectFetching } =
    useSubjects();
  const { updateMarks } = useStudents();

  const [showForm, setForm] = useState(false);
  const [isChanged, setChanged] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const dispatch = useDispatch();
  const { singleStudent } = useSelector((state) => state.students);

  useEffect(() => {
    if (!isSubjectFetched && !isSubjectFetching) {
      console.log("Fetching subjects!");
      fetchAllSubject();
    }
  }, []);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleSubjectAdded = () => {
    seSuccessMessage("Subject added successfully");
    setForm(false);
    dispatch(fetchAllSubject());
  };

  return (
    <div className="w-7/10 mx-auto px-20 pt-10 space-y-6">

      {/* 🔥 SEARCH CARD */}
      {isSearched && <div className="bg-white w-5/10 mx-auto rounded-xl shadow-sm p-5 space-y-4">

        <div className="flex gap-3 items-center">

          {isSearched && (
            <button
              className="text-gray-500 hover:text-gray-700 px-2"
              onClick={() => {
                dispatch(clearSingleStudent());
                setSearched(false);
              }}
            >
              Close
            </button>
          )}

          {/* {isChanged && (
            <button
              onClick={() => updateMarks(search.subject)}
              className="ml-auto bg-green-600 hover:bg-green-700 text-white px-4 h-10 rounded-lg shadow-sm"
            >
              Save
            </button>
          )} */}
        </div>
      </div>}

      {/* 🔥 SUCCESS MESSAGE */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex justify-between items-center">
          <span className="text-sm font-medium">{successMessage}</span>
          <button
            onClick={() => setSuccessMessage("")}
            className="text-green-600 hover:text-green-800"
          >
            ✕
          </button>
        </div>
      )}

      {/* 🔥 MAIN CONTENT */}
      {!isSearched ? (
        <div className="space-y-4">
          <SubjectForm
            isOpen={showForm}
            onClose={() => setForm(!showForm)}
            onSubjectAdded={handleSubjectAdded}
          />

          <SubjectList subjects={subjects} isFetching = {isSubjectFetching} />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-4">
          <StudentList students={singleStudent} setChange={setChanged} />
        </div>
      )}
    </div>
  );
}

export default Dashboard;