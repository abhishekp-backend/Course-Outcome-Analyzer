import React from "react";
import { useSubjects } from "../../../hooks/useSubjects";
import { useNavigate } from "react-router-dom";
import { setCurrentSubject } from "../../../store/slices/subjectSlice";
import { useDispatch } from "react-redux";

function SubjectList({ subjects }) {
  const { removeSubject } = useSubjects();
  const nav = useNavigate();
  const dispatch = useDispatch();

  if (!subjects || subjects.length === 0) {
    return (
      <div className="bg-gray-100 p-6 rounded-lg text-center">
        <p className="text-gray-600">
          No subjects added yet. Ask your admin!
        </p>
      </div>
    );
  }

  return (
    <div className="h-100 mx-auto w-9/10 mt-4">
      
      {/* 🔥 Title OUTSIDE */}
      <h3 className="text-lg px-2 font-semibold text-gray-800 mb-3">
        Your Teaching Subjects
      </h3>

      {/* 🔥 Card only for table */}
      <div className="rounded-xl overflow-hidden bg-white shadow-md">
        
        <div className="max-h-[400px] overflow-y-auto">
          <table className="w-full border-separate border-spacing-0">
            
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider first:rounded-tl-xl">
                  Subject Name
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider last:rounded-tr-xl">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-100">
              {subjects.map((subject, index) => {
                const isLast = index === subjects.length - 1;

                return (
                  <tr
                    key={subject._id}
                    onClick={() => {
                      nav(`/subject/${subject._id}`);
                      dispatch(
                        setCurrentSubject({
                          name: subject.name,
                          semester: subject.semester,
                          branch: subject.branch,
                          co: null,
                        })
                      );
                    }}
                    className="hover:bg-gray-50 cursor-pointer transition"
                  >
                    <td
                      className={`px-6 py-4 text-sm font-medium text-gray-900 ${
                        isLast ? "rounded-bl-xl" : ""
                      }`}
                    >
                      {subject.name}
                      <br />
                      <span className="text-xs text-gray-500">
                        {subject.semester}th-{subject.branch}-{subject.division}
                      </span>
                    </td>

                    <td
                      className={`px-6 py-4 text-right text-sm font-medium ${
                        isLast ? "rounded-br-xl" : ""
                      }`}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeSubject(subject._id);
                        }}
                        className="text-red-500 hover:text-red-700 ml-2"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
}

export default SubjectList;