import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateMarksField } from "../../store/slices/userChanges";

function StudentList({ students, setChange, class: classId, twCount }) {
  const [localMarks, setLocalMarks] = useState({});
  const dispatch = useDispatch();
  const [marksType, setMarksType] = useState("tw");

  // CO-based marks (UT1, UT2)
  const handleMarkChange = (docId, prn, test, co, value) => {
    setLocalMarks((prev) => ({
      ...prev,

      [docId]: {
        ...prev[docId],

        prn,

        marks: {
          ...prev[docId]?.marks,

          [test]: {
            ...prev[docId]?.marks?.[test],

            [co.name]: value,
          },
        },
      },
    }));

    setChange(true);

    dispatch(
      updateMarksField({
        classId,
        docId,
        prn,
        field: `${test}${co.name}`,
        value,
      }),
    );
  };

  // Simple marks like IA, PBL, TW, University Exam
  const handleSimpleMarkChange = (docId, prn, field, value) => {
    setLocalMarks((prev) => ({
      ...prev,

      [docId]: {
        ...prev[docId],

        prn,

        marks: {
          ...prev[docId]?.marks,

          [field]: value,
        },
      },
    }));

    setChange(true);

    dispatch(
      updateMarksField({
        classId,
        docId,
        prn,
        field,
        value,
      }),
    );
  };

  // Flatten students with performance first
  const formattedStudents = students.map((student) => {
    const perf = student.performance?.[0] || {}; // take first element from performance array
    return {
      docId: student._id,
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
      internalAssessment: perf.internalAssessment ?? 0,
      pbl: perf.pbl ?? 0,
      tw: perf.tw ?? 0,
      tws: Object.fromEntries(
        Object.entries(perf).filter(([key]) => key.startsWith("tw")),
      ),
      universityExam: perf.universityExam ?? perf.university ?? 0,
    };
  });
  
  return (
    <div className="overflow-x-auto">
      {/* Drop-down for Marks */}
      <select
        name="marksType"
        value={marksType}
        onChange={(e) => setMarksType(e.target.value)}
        className="border border-gray-300 p-2 rounded text-gray-900 mb-2"
      >
        <option className="text-gray-900" value="tw">
          Term Works
        </option>
        <option className="text-gray-900" value="marks">
          Marks
        </option>
      </select>

      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Roll
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              PRN
            </th>

            {marksType === "marks" && <MarksComponent />}
            {marksType === "tw" && (
              <>
                {Array.from({ length: twCount }).map((_, index) => (
                  <React.Fragment key={index}>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      TW {index + 1} CO1
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      TW {index + 1} CO2
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      TW {index + 1} CO3
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      TW {index + 1} Total
                    </th>
                  </React.Fragment>
                ))}
              </>
            )}
          </tr>
        </thead>

        <tbody>
          {formattedStudents.map((student) => (
            <tr
              key={student.prn}
              className="hover:bg-gray-200/40 cursor-pointer"
            >
              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                {student.roll}
              </td>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                {student.name}
              </td>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                {student.prn}
              </td>

              {marksType === "marks" && (
                <>
                  {/* UT1 inputs */}
                  {["co1", "co2", "co3"].map((co) => (
                    <td key={`ut1-${co}`} className="px-3 py-4 text-center">
                      <input
                        type="number"
                        min={0}
                        max={co === "co3" ? 6 : 7}
                        className="w-16 border border-gray-300 rounded px-1 py-0.5 text-center"
                        value={
                          localMarks[student.docId]?.marks?.ut1?.[co] ??
                          student.ut1[co]
                        }
                        onChange={(e) =>
                          handleMarkChange(
                            student.docId,
                            student.prn,
                            "ut1",
                            { name: co },
                            Number(e.target.value),
                          )
                        }
                      />
                    </td>
                  ))}

                  <td className="px-3 py-4 text-center text-sm font-medium text-gray-600 bg-gray-50">
                    {["co1", "co2", "co3"].reduce(
                      (sum, co) =>
                        sum +
                        (localMarks[student.docId]?.marks?.ut1?.[co] ??
                          student.ut1[co]),
                      0,
                    )}
                  </td>

                  {/* UT2 inputs */}
                  {["co4", "co5", "co6"].map((co) => (
                    <td key={`ut2-${co}`} className="px-3 py-4 text-center">
                      <input
                        type="number"
                        min={0}
                        max={co === "co3" ? 6 : 7}
                        className="w-16 border border-gray-300 rounded px-1 py-0.5 text-center"
                        value={
                          localMarks[student.prn]?.ut2?.[co] ?? student.ut2[co]
                        }
                        onChange={(e) =>
                          handleMarkChange(
                            student.docId,
                            student.prn,
                            "ut2",
                            { name: co },
                            Number(e.target.value),
                          )
                        }
                      />
                    </td>
                  ))}

                  <td className="px-3 py-4 text-center text-sm font-medium text-gray-600 bg-gray-50">
                    {["co4", "co5", "co6"].reduce(
                      (sum, co) =>
                        sum +
                        (localMarks[student.prn]?.ut2?.[co] ?? student.ut2[co]),
                      0,
                    )}
                  </td>

                  {/* Simple marks */}
                  {["internalAssessment", "pbl", "universityExam"].map(
                    (field) => (
                      <td key={field} className="px-3 py-4 text-center">
                        <input
                          type="number"
                          min={0}
                          max={
                            field === "internalAssessment"
                              ? 40
                              : field === "pbl"
                                ? 20
                                : field === "universityExam"
                                  ? 60
                                  : 100
                          }
                          className="w-16 border border-gray-300 rounded px-1 py-0.5 text-center"
                          value={
                            localMarks[student.docId]?.marks?.[field] ??
                            student[field]
                          }
                          onChange={(e) =>
                            handleSimpleMarkChange(
                              student.docId,
                              student.prn,
                              field,
                              Number(e.target.value),
                            )
                          }
                        />
                      </td>
                    ),
                  )}
                </>
              )}

              {marksType === "tw" && (
                <>
                  {Array.from({ length: twCount }).map((_, index) => {
                    const twKey = `tw${index + 1}`;

                    return (
                      <React.Fragment key={twKey}>
                        {/* CO Inputs */}
                        {["co1", "co2", "co3"].map((co) => (
                          <td
                            key={`${twKey}-${co}`}
                            className="px-3 py-4 text-center"
                          >
                            <input
                              type="number"
                              min={0}
                              max={10}
                              className="w-16 border border-gray-300 rounded px-1 py-0.5 text-center"
                              value={
                                localMarks[student.docId]?.marks?.[
                                  twKey
                                ]?.[co] ??
                                student.tws?.[twKey + co] ??
                                0
                              }
                              onChange={(e) =>
                                handleMarkChange(
                                  student.docId,
                                  student.prn,
                                  twKey,
                                  { name: co },
                                  Number(e.target.value),
                                )
                              }
                            />
                          </td>
                        ))}

                        {/* Total */}
                        <td className="px-3 py-4 text-center text-sm font-semibold bg-gray-50">
                          {["co1", "co2", "co3"].reduce(
                            (sum, co) =>
                              sum +
                              (localMarks[student.docId]?.marks?.[twKey]?.[
                                co
                              ] ??
                                student.tw?.[twKey]?.[co] ??
                                0),
                            0,
                          )}
                        </td>
                      </React.Fragment>
                    );
                  })}
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MarksComponent() {
  return (
    <>
      {/* UT1 COs */}
      {["co1", "co2", "co3"].map((co) => (
        <th
          key={`ut1-${co}`}
          className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
        >
          UT1 {co.toUpperCase()}
        </th>
      ))}
      <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
        UT1 Total
      </th>

      {/* UT2 COs */}
      {["co1", "co2", "co3"].map((co) => (
        <th
          key={`ut2-${co}`}
          className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
        >
          UT2 {co.toUpperCase()}
        </th>
      ))}
      <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
        UT2 Total
      </th>

      {/* Simple marks */}
      <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
        IA
      </th>
      <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
        PBL
      </th>
      <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
        University Exam
      </th>
    </>
  );
}

export default StudentList;
