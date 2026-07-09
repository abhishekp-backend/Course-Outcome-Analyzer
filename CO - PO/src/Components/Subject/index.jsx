import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";

import StudentList from "../Student/StudentList";

import { useStudents } from "../../hooks/useStudent";
import { useSubjects } from "../../hooks/useSubjects";

import AssessmentSetup from "../CO_PO/AssessmentSetup";
import CO_PO_Mapping from "../CO_PO/CO_PO_Mapping";
import TermWorkManagement from "../CO_PO/TermWorkManagement";

import { updateCOPO } from "../../store/slices/userChanges";
import toast from "react-hot-toast";
import { CgSearchLoading } from "react-icons/cg";
import UniversityCOs from "../CO_PO/UniversityCOs";

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
  const { students, loading:loadingStudents } = useSelector((state) => state.students);
  const { coPos, classId } = useSelector((state) => state.userChanges);

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

  const saveChanges = async () => {
    try {
      await dispatch(updateCOPO()).unwrap();
      toast.success("Saved changes!");
    } catch (err) {
      toast.error(err);
    }
  };

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
        {console.log(classId)}

        <button
          onClick={saveChanges}
          disabled={
            classId == null ||
            classId === undefined ||
            coPos.finder ||
            Object.keys(coPos).length === 0
          }
          className="ml-auto bg-green-600 hover:bg-green-700 text-white px-4 h-10 rounded-lg shadow-sm disabled:opacity-50"
        >
          Save
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm px-5">
        <div className="flex gap-6 border-b border-gray-100">
          {[
            { key: "co", label: "Course Outcomes" },
            // { key: "marks", label: "PBL/Assignments COs" },
            // { key: "marks", label: "Oral COs" },
            // { key: "marks", label: "UT COs" },
            { key: "marks", label: "COs" },
            { key: "experiments", label: "TW COs" },
            { key: "endsem", label: "University Exams" },
            { key: "mapping", label: "COs Attainment" },
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
        {activeTab === "marks" &&
          (students.length === 0 && !loadingStudents ? (
            <div className="p-10 text-center text-gray-500">
              No students available.
            </div>
          ) : loadingStudents ? 
            <CgSearchLoading size={30} color="gray" className="m-auto floatingUpDown" />
          : (
            <StudentList
              students={students}
              subject={id}
              deleteStudent={removeStudent}
              setChange={setChanged}
            />
          ))}

        {activeTab === "co" && <AssessmentSetup subjectId={id} />}

        {activeTab === "experiments" && (
          <TermWorkManagement subjectId={id} termWorks={currentSubject?.co} />
        )}

        {activeTab === "endsem" && (
          <UniversityCOs />
        )}

        {activeTab === "mapping" && <CO_PO_Mapping subjectId={id} />}
      </div>
    </div>
  );
}
