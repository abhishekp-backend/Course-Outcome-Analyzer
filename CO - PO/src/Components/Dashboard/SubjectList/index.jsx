import React from "react";
import { useSubjects } from "../../../hooks/useSubjects";
import { useNavigate } from "react-router-dom";
import { setCurrentSubject } from "../../../store/slices/subjectSlice";
import { useDispatch } from "react-redux";
import { PiStudentDuotone, PiBookThin } from "react-icons/pi";
import { SiGithubactions } from "react-icons/si";
import { RxUpdate } from "react-icons/rx";

function SubjectList({ subjects, isFetching }) {
  const { removeSubject } = useSubjects();
  const nav = useNavigate();
  const dispatch = useDispatch();

  if (isFetching) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-gray-50 p-8 text-center">
        <p className="text-gray-600">Fetching subjects.</p>
      </div>
    );
  }

  if (!subjects || subjects.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-gray-50 p-8 text-center">
        <p className="text-gray-600">No subjects added yet. Ask your admin!</p>
      </div>
    );
  }

  function semSuffix(sem) {
    switch (sem) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  }

  return (
    <>
      <h3 className="mb-4 px-2 text-2xl font-semibold text-gray-800/90">
        Your Teaching Subjects
      </h3>

      <div className="mx-auto mt-4 w-full max-w-7xl">
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="max-h-[500px] overflow-y-auto">
            <table className="w-full">
              <thead className="sticky top-0 z-10 border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    <div className="flex items-center gap-2">
                      <PiBookThin size={18} />
                      Subject
                    </div>
                  </th>

                  <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                    <div className="flex items-center justify-center gap-2">
                      <PiStudentDuotone size={18} />
                      Students
                    </div>
                  </th>

                  <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                    <div className="flex items-center justify-center gap-2">
                      <SiGithubactions size={16} />
                      Actions
                    </div>
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    <div className="flex items-center justify-center gap-2">
                      <RxUpdate size={16} />
                      Last Updated
                    </div>
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {subjects.map((subject, index) => {
                  const splittedTime = subject?.lastUpdated.split("T");
                  const date = splittedTime[0];
                  const time = splittedTime[1];

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
                          }),
                        );
                      }}
                      className={`hover:underline cursor-pointer transition-colors duration-200 hover:bg-indigo-50 ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50/40"
                      }`}
                    >
                      <td className="px-6 py-5 align-middle">
                        <p className="font-semibold text-gray-800/90">
                          {subject.name}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {subject.semester}
                          {semSuffix(subject.semester)} Sem • {subject.branch} •{" "}
                          {subject.division}
                        </p>
                      </td>

                      <td className="px-6 py-5 text-center align-middle">
                        <div>
                          <p className="text-lg font-bold text-gray-800/90">
                            {subject?.noOfStudents || 0}
                          </p>
                          <p className="text-xs text-gray-500">Students</p>
                        </div>
                      </td>

                      <td className="px-6 py-5 text-center align-middle">
                        {subject?.completedInfo ? (
                          <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                            No Action Required
                          </span>
                        ) : (
                          <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                            Fill Details
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-5 align-middle">
                        <p className="font-medium text-gray-700">{date}</p>
                        <p className="mt-1 text-xs text-gray-500">
                          {time?.slice(0, time.length - 1).split(".")[0]}
                        </p>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default SubjectList;
