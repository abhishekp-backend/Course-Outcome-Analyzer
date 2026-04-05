import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import StudentForm from "../Student/StudentForm";
import StudentList from "../Student/StudentList";
import { useStudents } from "../../hooks/useStudent";
import { useSubjects } from "../../hooks/useSubjects";
import AssessmentSetup from "../CO_PO/AssessmentSetup";
import CO_PO_Mapping from "../CO_PO/CO_PO_Mapping";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { updateCOPO } from "../../store/slices/userChanges";

export function SubjectInfo() {
  const { id } = useParams();
  const {
    removeStudent,
    fetchStudentsOfSubject
  } = useStudents(id);
  const {students} = useSelector(state => state.students);
  const { getSubjectInfo, subjects, fetchAllSubject, fetchCO, loadingCO } = useSubjects();

  const [isChanged, setChanged] = useState(false);
  const [activeTab, setActiveTab] = useState("students"); // "students", "co", "mapping", "attainment"
  const nav = useNavigate();

  const { currentSubject } = useSelector(state => state.subjects);
  const { coPos } = useSelector(state => state.userChanges);

  const dispatch = useDispatch();
  
  useEffect(() => {
    if (!loadingCO) {
      fetchCO(id);
    }
    getSubjectInfo(id);
    if (activeTab === "students") {
      fetchStudentsOfSubject(id)
    }
    fetchAllSubject();
  }, [dispatch]);

  const handleChange = (e) => {
    const f = e.target.files?.[0];
    // handleUpload(f);
  };

  return (
    <>
      <button onClick={()=>nav("/dashboard")} className="cursor-pointer hover:bg-red-600/90 text-gray-200 rounded px-4 m-5 mb-0 text-lg bg-red-600/50 opacity-70">&larr;</button>
      <div
        className="w-[80%] m-auto relative"
      >
        {/* Student adding form */}
        {/* <StudentForm
          isOpen={showForm}
          subject={id}
          onClose={() => setForm(false)}
        /> */}

        {/* Top bar */}
        <div className="flex w-full">
          <button
            onClick={() => {
              dispatch(updateCOPO());
            }}
            disabled={coPos.finder || Object.keys(coPos).length > 0 === 0}
            className={`bg-green-600/80 ml-auto hover:bg-green-700/90 cursor-pointer p-2 rounded text-white hover:shadow-xs shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${Object.keys(coPos).length > 0 || Object.keys(coPos).length > 0 ? "ring-2 ring-green-300/50" : ""}`}
          >
            Save
          </button>
        </div>

        {/* Upload section */}
        <div>
          <div className="flex flex-col">
            {/* Subject name displayed under Select File button */}
            <div className="mt-2">
              <h1 className="text-lg font-bold text-gray-800">
                Subject: {currentSubject?.name || subjects.find(s => s._id === id)?.name || "Loading..."}
              </h1>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6 border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("students")}
              className={`py-4 px-1 border-b-2 text-sm ${
                activeTab === "students"
                  ? "border-blue-400 text-blue-600/80 font-bold"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Marks
            </button>
            <button
              onClick={() => setActiveTab("co")}
              className={`py-4 px-1 border-b-3 text-sm ${
                activeTab === "co"
                  ? "border-blue-400 text-blue-600/80 font-bold"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Course Outcomes
            </button>
            <button
              onClick={() => setActiveTab("experiments")}
              className={`py-4 px-1 border-b-3 text-sm ${
                activeTab === "experiments"
                  ? "border-blue-400 text-blue-600/80 font-bold"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              TW COs
            </button>
            <button
              onClick={() => setActiveTab("mapping")}
              className={`py-4 px-1 border-b-2 text-sm ${
                activeTab === "mapping"
                  ? "border-blue-500 text-blue-600/80 font-bold"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              CO-PO Mapping
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === "students" && (
            <>
              {students.length === 0 ? (
                <div className="bg-gray-300/60 flex p-10 mt-5 rounded">
                  <p className="m-auto text-gray-500/70">No students</p>
                </div>
              ) : (
                <StudentList
                  students={students}
                  subject={id}
                  deleteStudent={removeStudent}
                  setChange={setChanged}
                />
              )}
            </>
          )}

          {activeTab === "co" && (
            <AssessmentSetup subjectId={id} />
          )}

          {activeTab === "mapping" && (
            <CO_PO_Mapping subjectId={id} />
          )}
        </div>
      </div>
    </>
  );
}
