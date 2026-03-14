import React from "react";
import { useSubjects } from "../../../hooks/useSubjects";
import { useNavigate } from "react-router-dom";
import { setCurrentSubject } from "../../../store/slices/subjectSlice";
import { useDispatch } from "react-redux"

function SubjectList({ subjects }) {
  const { removeSubject } = useSubjects();
  const nav = useNavigate();
  const dispatch = useDispatch()
  if (!subjects || subjects.length === 0) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg text-center">
        <p className="text-gray-600">
          No subjects added yet. Add your first teaching subject!
        </p>
      </div>
    );
  }

  return (
      <div className="overflow-y-scroll h-100 mx-auto rounded-xl p-2 border border-gray-50 bg-gray-50/50 w-9/10 mt-2">
        <h3 className="text-lg p-4 font-semibold text-gray-800 mb-4">
          Your Teaching Subjects
        </h3>
        <table className="w-full divide-y divide-gray-200 overflow-y-scroll">
          <thead className="bg-gray-100">
            <tr>
              <th
                scope="col"
                className=" px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Subject Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 overflow-y-auto">
            {subjects.map((subject) => (
              <tr
                key={subject._id}
                onClick={() => {
                  nav(`/subject/${subject._id}`);
                  dispatch(setCurrentSubject({name:subject.name, semester: subject.semester, branch: subject.branch, co: null}))
                }}
                className="hover:bg-gray-200/40 cursor-pointer hover:underline"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {subject.name}
                  <br />
                  <span className="text-xs text-gray-500">
                    {subject.semester}th-{subject.branch}-{subject.division}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => removeSubject(subject._id)}
                    className="text-red-600 hover:text-red-900 ml-2"
                  >
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

export default SubjectList;
