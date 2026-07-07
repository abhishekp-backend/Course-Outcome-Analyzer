import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { insertUpdatingStudent } from "../../store/slices/studentSlice";

function StudentList({ students, deleteStudent, setChange }) {
  const [localMarks, setLocalMarks] = useState({});
  const dispatch = useDispatch();

  // CO-based marks (UT1, UT2)
  const handleMarkChange = (prn, test, co, value) => {
    const updatedMarks = {
      ...localMarks,
      [prn]: {
        ...localMarks[prn],
        [test]: {
          ...localMarks[prn]?.[test],
          [co.name]: value,
        },
      },
    };
    setLocalMarks(updatedMarks);
    setChange(true);
    dispatch(insertUpdatingStudent(updatedMarks));
  };

  // Simple marks like IA, PBL, TW, University Exam
  const handleSimpleMarkChange = (prn, field, value) => {
    const updatedMarks = {
      ...localMarks,
      [prn]: {
        ...localMarks[prn],
        [field]: value,
      },
    };
    setLocalMarks(updatedMarks);
    setChange(true);
    dispatch(insertUpdatingStudent(updatedMarks));
  };

  // Flatten students with performance first
  const formattedStudents = students.map((student) => {
    const perf = student.performance?.[0] || {}; // take first element from performance array
    return {
      roll: student.roll,
      name: student.name,
      prn: student.prn,
      // UT1 COs
      ut1: {
        co1: perf.ut1co1 ?? 0,
        co2: perf.ut1co2 ?? 0,
        co3: perf.ut1co3 ?? 0,
      },
      // UT2 COs
      ut2: {
        co4: perf.ut2co4 ?? 0,
        co5: perf.ut2co5 ?? 0,
        co6: perf.ut2co6 ?? 0,
      },
      // Other marks
      ia: perf.ia ?? 0,
      pbl: perf.pbl ?? 0,
      tw: perf.tw ?? 0,
      universityExam: perf.universityExam ?? perf.university ?? 0,
    };
  });

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PRN</th>

            {/* UT1 COs */}
            {["co1", "co2", "co3"].map((co, i) => (
              <th key={`ut1-${co}`} className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                UT1 {co.toUpperCase()}
              </th>
            ))}
            <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">UT1 Total</th>

            {/* UT2 COs */}
            {["co1", "co2", "co3"].map((co) => (
              <th key={`ut2-${co}`} className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                UT2 {co.toUpperCase()}
              </th>
            ))}
            <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">UT2 Total</th>

            {/* Simple marks */}
            <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">IA</th>
            <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">PBL</th>
            <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">TW</th>
            <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">University Exam</th>

            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>

        <tbody>
          {formattedStudents.map((student) => (
            <tr key={student.prn} className="hover:bg-gray-200/40 cursor-pointer">
              <td className="px-6 py-4 text-sm font-medium text-gray-900">{student.roll}</td>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">{student.name}</td>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">{student.prn}</td>

              {/* UT1 inputs */}
              {["co1", "co2", "co3"].map((co) => (
                <td key={`ut1-${co}`} className="px-3 py-4 text-center">
                  <input
                    type="number"
                    min={0}
                    max={co === "co3" ? 6 : 7}
                    className="w-16 border border-gray-300 rounded px-1 py-0.5 text-center"
                    value={localMarks[student.prn]?.ut1?.[co] ?? student.ut1[co]}
                    onChange={(e) =>
                      handleMarkChange(student.prn, "ut1", { name: co }, Number(e.target.value))
                    }
                  />
                </td>
              ))}

              <td className="px-3 py-4 text-center text-sm font-medium text-gray-600 bg-gray-50">
                {["co1", "co2", "co3"].reduce((sum, co) => sum + (localMarks[student.prn]?.ut1?.[co] ?? student.ut1[co]), 0)}
              </td>

              {/* UT2 inputs */}
              {["co4", "co5", "co6"].map((co) => (
                <td key={`ut2-${co}`} className="px-3 py-4 text-center">
                  <input
                    type="number"
                    min={0}
                    max={co === "co3" ? 6 : 7}
                    className="w-16 border border-gray-300 rounded px-1 py-0.5 text-center"
                    value={localMarks[student.prn]?.ut2?.[co] ?? student.ut2[co]}
                    onChange={(e) =>
                      handleMarkChange(student.prn, "ut2", { name: co }, Number(e.target.value))
                    }
                  />
                </td>
              ))}

              <td className="px-3 py-4 text-center text-sm font-medium text-gray-600 bg-gray-50">
                {["co4", "co5", "co6"].reduce((sum, co) => sum + (localMarks[student.prn]?.ut2?.[co] ?? student.ut2[co]), 0)}
              </td>

              {/* Simple marks */}
              {["ia", "pbl", "tw", "universityExam"].map((field) => (
                <td key={field} className="px-3 py-4 text-center">
                  <input
                    type="number"
                    min={0}
                    max={field === "ia" ? 40 : field === "pbl" ? 20 : field === "universityExam" ? 60 : 100}
                    className="w-16 border border-gray-300 rounded px-1 py-0.5 text-center"
                    value={localMarks[student.prn]?.[field] ?? student[field]}
                    onChange={(e) =>
                      handleSimpleMarkChange(student.prn, field, Number(e.target.value))
                    }
                  />
                </td>
              ))}

              <td className="px-6 py-4 text-left cursor-pointer text-sm font-medium text-red-500 hover:text-red-700">
                <button onClick={() => deleteStudent(student.prn)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StudentList;