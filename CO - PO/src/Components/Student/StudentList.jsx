import React, {useState} from "react";
import { insertUpdatingStudent } from "../../store/slices/studentSlice"
import {useDispatch} from "react-redux";

function StudentList({ students, deleteStudent, setChange}) {
  const [localMarks, setLocalMarks] = useState({});
  const dispatch = useDispatch()

  // Handler when mark changes for CO-based marks (UT1, UT2)
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

  // For non-object marks like ia, pbl, tw, universityExam
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


  return (
    <div className="overflow-x-auto">
      {console.log(students)}
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

            {/* New columns for marks */}
            <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              UT1 CO1 (Max: 7)
            </th>
            <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              UT1 CO2 (Max: 7)
            </th>
            <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              UT1 CO3 (Max: 6)
            </th>
            <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              UT1 Total
            </th>
            <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              UT2 CO1 (Max: 7)
            </th>
            <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              UT2 CO2 (Max: 7)
            </th>
            <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              UT2 CO3 (Max: 6)
            </th>
            <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              UT2 Total
            </th>
            <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              IA (Max: 40)
            </th>
            <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              PBL (Max: 20)
            </th>
            <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              TW
            </th>
            <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              University Exam (Max: 60)
            </th>

            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr key={index} className="hover:bg-gray-200/40 cursor-pointer">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {student.roll}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {student.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {student.prn}
              </td>

              {/* UT1 CO1, CO2, CO3 */}
              {[{name:"co1", max:7}, {name:"co2", max: 7}, {name:"co3", max: 6}].map((co) => (
                <td
                  key={`ut1-${co.name}`}
                  className="px-3 py-4 whitespace-nowrap text-center text-sm font-medium text-gray-900"
                >
                  <input
                    type="number"
                    min="0"
                    max={co.max}
                    className="w-16 border border-gray-300 rounded px-1 py-0.5 text-center"
                    defaultValue={typeof student.ut1 === 'object' && student.ut1 ? (student.ut1[co.name] ?? 0) : 0}
                    onChange={(e) =>
                      handleMarkChange(
                        student.prn,
                        "ut1",
                        co,
                        Number(e.target.value)
                      )
                    }
                  />
                </td>
              ))}
              
              {/* UT1 Total (read-only) */}
              <td className="px-3 py-4 whitespace-nowrap text-center text-sm font-medium text-gray-600 bg-gray-50">
                {typeof student.ut1 === 'object' && student.ut1
                  ? (Number(student.ut1.co1 || 0) + Number(student.ut1.co2 || 0) + Number(student.ut1.co3 || 0))
                  : (typeof student.ut1 === 'number' ? student.ut1 : 0)}
              </td>

              {/* UT2 CO1, CO2, CO3 */}
              {[{name:"co1", max:7}, {name:"co2", max: 7}, {name:"co3", max: 6}].map((co) => (
                <td
                  key={`ut2-${co.name}`}
                  className="px-3 py-4 whitespace-nowrap text-center text-sm font-medium text-gray-900"
                >
                  <input
                    type="number"
                    min="0"
                    max={co.max}
                    className="w-16 border border-gray-300 rounded px-1 py-0.5 text-center"
                    defaultValue={typeof student.ut2 === 'object' && student.ut2 ? (student.ut2[co.name] ?? 0) : 0}
                    onChange={(e) =>
                      handleMarkChange(
                        student.prn,
                        "ut2",
                        co,
                        Number(e.target.value)
                      )
                    }
                  />
                </td>
              ))}
              
              {/* UT2 Total (read-only) */}
              <td className="px-3 py-4 whitespace-nowrap text-center text-sm font-medium text-gray-600 bg-gray-50">
                {typeof student.ut2 === 'object' && student.ut2
                  ? (Number(student.ut2.co1 || 0) + Number(student.ut2.co2 || 0) + Number(student.ut2.co3 || 0))
                  : (typeof student.ut2 === 'number' ? student.ut2 : 0)}
              </td>

              {/* IA - Max 40 */}
              <td className="px-3 py-4 whitespace-nowrap text-center text-sm font-medium text-gray-900">
                <input
                  type="number"
                  min="0"
                  max="40"
                  className="w-16 border border-gray-300 rounded px-1 py-0.5 text-center"
                  defaultValue={student.ia ?? 0}
                  onChange={(e) =>
                    handleSimpleMarkChange(
                      student.prn,
                      "ia",
                      Number(e.target.value)
                    )
                  }
                />
              </td>

              {/* PBL - Max 20 */}
              <td className="px-3 py-4 whitespace-nowrap text-center text-sm font-medium text-gray-900">
                <input
                  type="number"
                  min="0"
                  max="20"
                  className="w-16 border border-gray-300 rounded px-1 py-0.5 text-center"
                  defaultValue={student.pbl ?? 0}
                  onChange={(e) =>
                    handleSimpleMarkChange(
                      student.prn,
                      "pbl",
                      Number(e.target.value)
                    )
                  }
                />
              </td>

              {/* TW */}
              <td className="px-3 py-4 whitespace-nowrap text-center text-sm font-medium text-gray-900">
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="w-16 border border-gray-300 rounded px-1 py-0.5 text-center"
                  defaultValue={student.tw ?? 0}
                  onChange={(e) =>
                    handleSimpleMarkChange(
                      student.prn,
                      "tw",
                      Number(e.target.value)
                    )
                  }
                />
              </td>

              {/* University Exam - Max 60 */}
              <td className="px-3 py-4 whitespace-nowrap text-center text-sm font-medium text-gray-900">
                <input
                  type="number"
                  min="0"
                  max="60"
                  className="w-16 border border-gray-300 rounded px-1 py-0.5 text-center"
                  defaultValue={student.universityExam ?? student.university ?? 0}
                  onChange={(e) =>
                    handleSimpleMarkChange(
                      student.prn,
                      "universityExam",
                      Number(e.target.value)
                    )
                  }
                />
              </td>

              <td className="px-6 py-4 whitespace-nowrap cursor-pointer text-sm font-medium text-red-500 hover:text-red-700">
                <button onClick={() => deleteStudent(student.prn)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StudentList;
