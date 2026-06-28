import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";

import StudentList from "../Student/StudentList";
import MarksUploadSection from "./MarksUploadSection";

import { useStudents } from "../../hooks/useStudent";
import { useSubjects } from "../../hooks/useSubjects";

import AssessmentSetup from "../CO_PO/AssessmentSetup";
import CO_PO_Mapping from "../CO_PO/CO_PO_Mapping";
import TermWorkManagement from "../CO_PO/TermWorkManagement";

import { updateCOPO } from "../../store/slices/userChanges";

export function SubjectInfo() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const tab = searchParams.get("tab") || "co";

  const { removeStudent, fetchStudentsOfSubject } = useStudents(id);
  const { getSubjectInfo, subjects, fetchAllSubject, fetchCO, loadingCO } =
    useSubjects();

  const [isChanged, setChanged] = useState(false);
  const [activeTab, setActiveTab] = useState(tab);

  const nav = useNavigate();
  const dispatch = useDispatch();

  const { currentSubject } = useSelector((state) => state.subjects);
  const { students } = useSelector((state) => state.students);
  const { coPos } = useSelector((state) => state.userChanges);

  useEffect(() => {
    if (!loadingCO) fetchCO(id);

    getSubjectInfo(id);

    if (activeTab === "marks") {
      fetchStudentsOfSubject({ classId: id });
    }

    fetchAllSubject();
  }, []);

  useEffect(() => {
    setSearchParams({ tab: activeTab });

    if (activeTab === "marks") {
      fetchStudentsOfSubject({ classId: id });
    }
  }, [activeTab]);

  return (
    <div className="px-20 pt-10 space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => nav("/dashboard")}
          className="text-red-500 hover:text-red-600 text-lg"
        >
          ← Back
        </button>

        <h1 className="text-xl font-semibold text-gray-800">
          {currentSubject?.name ||
            subjects.find((s) => s._id === id)?.name ||
            "Loading..."}
        </h1>

        <button
          onClick={() => dispatch(updateCOPO())}
          disabled={coPos.finder || Object.keys(coPos).length === 0}
          className="ml-auto bg-green-600 hover:bg-green-700 text-white px-4 h-10 rounded-lg shadow-sm disabled:opacity-50"
        >
          Save
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm px-5">
        <div className="flex gap-6 border-b border-gray-100">
          {[
            { key: "co", label: "Course Outcomes" },
            { key: "marks", label: "Marks" },
            { key: "experiments", label: "TW COs" },
            { key: "mapping", label: "CO-PO Mapping" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`py-4 text-sm font-medium transition ${
                activeTab === t.key
                  ? "text-red-600 border-b-2 border-red-500"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl h-full shadow-sm p-5">
        {activeTab === "marks" && (
          <>

            {students.length === 0 ? (
              <div className="flex p-10 rounded-lg bg-gray-50">
                <MarksUploadSection subjectId={id} />
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

        {activeTab === "co" && <AssessmentSetup subjectId={id} />}

        {activeTab === "experiments" && (
          <TermWorkManagement
            subjectId={id}
            termWorks={currentSubject?.co}
          />
        )}

        {activeTab === "mapping" && <CO_PO_Mapping subjectId={id} />}
      </div>
    </div>
  );
}