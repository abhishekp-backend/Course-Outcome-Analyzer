import React, { useState, useEffect } from "react";
import SubjectList from "../SubjectList";
import SubjectForm from "../SubjectForm";
import { useSubjects } from "../../../hooks/useSubjects";
import { useStudents } from "../../../hooks/useStudent";
import StudentList from "../../Student/StudentList";
import { useParams } from "react-router-dom";
import { clearSingleStudent } from "../../../store/slices/studentSlice";
import { useDispatch, useSelector } from "react-redux";

function Dashboard() {
  const { subjects, fetchAllSubject, isSubjectFetched, isSubjectFetching } = useSubjects();
  const { fetchOneStudent, updateMarks } = useStudents();
  const [showForm, setForm] = useState(false);
  const [search, setSearch] = useState({ prn: "", subject: "" });
  const [isSearched, setSearched] = useState(false);
  const [isChanged, setChanged] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const dispatch = useDispatch();

  const { singleStudent } = useSelector((state) => state.students);

  useEffect(() => {
    if (!isSubjectFetched && !isSubjectFetching) {
      fetchAllSubject();
    }
  }, []);

  // Clear success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleSubjectAdded = () => {
    setSuccessMessage("Subject added successfully");
    setForm(false); // Close the form
    dispatch(fetchAllSubject()); // Refresh the subject list
  };

  return (
    <div className="px-20 pt-15 ">
      <div className=" gap-2 flex ">
        <input
          type="number"
          className="bg-white rounded outline-none border border-gray-400 mb-5 resize-none h-10 text-black p-2"
          placeholder="Search by PRN..."
          onChange={(e) => {
            setSearch({ ...search, prn: e.target.value });
          }}
          value={search.prn}
        />
        <button
          className=" bg-red-500 hover:bg-red-600 cursor-pointer p-2 text-white rounded h-fit "
          onClick={() => {
            fetchOneStudent(search);
            setSearched(true);
          }}
        >
          Search
        </button>
        {isSearched && (
          <button
            className="p-2 h-fit text-gray-500 hover:bg-gray-200 cursor-pointer rounded"
            onClick={() => {
              dispatch(clearSingleStudent());
              setSearched(false);
            }}
          >
            Close Search (X)
          </button>
        )}
        {isChanged && (
          <button
            onClick={() => {
              updateMarks(search.subject);
            }}
            className="bg-green-600/80 ml-auto hover:bg-green-700/90 cursor-pointer p-2 rounded text-white hover:shadow-xs shadow-sm h-fit "
          >
            Save
          </button>
        )}
      </div>
      {!isSearched ? (
        <div className=" h-full m-auto">
          {successMessage && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md flex items-center justify-between">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium">{successMessage}</span>
              </div>
              <button
                onClick={() => setSuccessMessage("")}
                className="text-green-600 hover:text-green-800 ml-4"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          )}
          <SubjectForm
            isOpen={showForm}
            onClose={() => setForm(!showForm)}
            onSubjectAdded={handleSubjectAdded}
          />
          <SubjectList subjects={subjects} />
        </div>
      ) : (
        <>
          <StudentList students={singleStudent} setChange={setChanged} />
        </>
      )}
    </div>
  );
}

export default Dashboard;
