import React, { useState } from "react";
import { useSelector } from "react-redux";
import UTAccordion from "./UTAccordion";
import SimpleAssessment from "./SimpleAssessment";
import { MdArrowDropDown } from "react-icons/md";
import { updateCOValues } from "../../store/slices/userChanges";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

export default function AssessmentSetup({setChange}) {
  const { currentSubject } = useSelector((state) => state.subjects);

  const dispatch = useDispatch();
  const { id: classId } = useParams();

  const [openPO, setOpenPO] = useState(false);
  const [coValues, setCOValues] = useState({
    target: currentSubject?.coTarget ?? 0,
    levels: { ...(currentSubject?.co?.coLevels || {}) },
  });

  if (!currentSubject) {
    return (
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 text-gray-500">
          Loading...
        </div>
      </div>
    );
  }

  const assessments = [
    { key: "internalAssessment", title: "Internal Assessment" },
    { key: "termWork", title: "Term Work" },
    { key: "practicals", title: "Practicals" },
    { key: "pbls", title: "PBLs" },
    { key: "attendance", title: "Attendance" },
  ];

  const poList = [
    {
      code: "PO1",
      title: "Engineering Knowledge",
      description:
        "Apply advanced knowledge of mathematics, science, and mechanical engineering principles to solve complex engineering problems.",
    },
    {
      code: "PO2",
      title: "Problem Analysis",
      description:
        "Identify, formulate, analyze, and solve complex mechanical engineering problems using research-based knowledge and critical thinking.",
    },
    {
      code: "PO3",
      title: "Design and Development of Solutions",
      description:
        "Design innovative systems, components, or processes that meet specified needs while considering safety, sustainability, and economic constraints.",
    },
    {
      code: "PO4",
      title: "Investigation of Complex Problems",
      description:
        "Conduct experiments, analyze and interpret data, and synthesize information to provide valid conclusions using modern research methods.",
    },
    {
      code: "PO5",
      title: "Modern Tool Usage",
      description:
        "Select and apply appropriate engineering software, simulation tools, computational techniques, and modern equipment for solving engineering problems.",
    },
    {
      code: "PO6",
      title: "Engineer and Society",
      description:
        "Assess societal, health, safety, legal, and cultural issues relevant to engineering practice and apply engineering solutions responsibly.",
    },
    {
      code: "PO7",
      title: "Environment and Sustainability",
      description:
        "Understand the impact of engineering solutions on the environment and promote sustainable development through responsible engineering practices.",
    },
    {
      code: "PO8",
      title: "Ethics",
      description:
        "Apply ethical principles and commit to professional ethics, integrity, and responsibilities in engineering practice and research.",
    },
    {
      code: "PO9",
      title: "Individual and Team Work",
      description:
        "Function effectively as an individual, team member, or leader in multidisciplinary and multicultural environments.",
    },
    {
      code: "PO10",
      title: "Communication",
      description:
        "Communicate effectively with engineering professionals and society through technical reports, presentations, research publications, and interpersonal interactions.",
    },
    {
      code: "PO11",
      title: "Project Management and Lifelong Learning",
      description:
        "Apply engineering and management principles to lead projects efficiently and engage in lifelong learning to adapt to technological advancements and professional challenges.",
    },
  ];

  const handleCOValuesChange = (field, value) => {
    setCOValues((prev) => {
      const updated =
        field === "target"
          ? {
              ...prev,
              target: value,
            }
          : {
              ...prev,
              levels: {
                ...prev.levels,
                [field]: value,
              },
            };

      dispatch(
        updateCOValues({
          classId: classId,
          field,
          value,
        }),
      );

      setChange(true);

      return updated;
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8 space-y-8">
      {/* ================= Course Outcomes ================= */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 rounded bg-red-500" />
          <h2 className="text-xl font-semibold text-gray-800">
            Course Outcomes
          </h2>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-50 border border-gray-200 rounded-2xl flex flex-col gap-1 p-3">
            {/* Target */}
            <div className="w-fit flex flex-wrap items-center gap-4 bg-gray-50 py-1 px-2">
              <label
                htmlFor="target"
                className="font-medium text-gray-700 min-w-[70px]"
              >
                Target
              </label>

              <div>
                <input
                  id="target"
                  type="number"
                  min={1}
                  max={100}
                  value={coValues.target}
                  onChange={(e) =>
                    handleCOValuesChange("target", Number(e.target.value))
                  }
                  className="w-fit h-9 rounded-md border border-gray-300 bg-white px-2 text-center text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400"
                />
              </div>

              {coValues.target > 0 && (
                <span className="text-sm text-gray-500">
                  Target in marks ({((coValues.target * 25) / 100).toFixed(2)}
                  /25)
                </span>
              )}
            </div>

            {/* CO Levels */}
            <div className="flex flex-wrap gap-6">
              {Object.keys(coValues?.levels)
                .slice(0, -1)
                .map((e) => (
                  <div
                    key={e}
                    className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2"
                  >
                    <label
                      htmlFor={e}
                      className="text-sm font-medium text-gray-700 whitespace-nowrap"
                    >
                      Level {e.at(-1)}
                    </label>
                    <input
                      id={e}
                      type="number"
                      placeholder={coValues?.levels[e]}
                      value={coValues?.levels[e]}
                      className="w-20 h-9 rounded-md border border-gray-300 bg-white px-2 text-center text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400"
                      onChange={(ev) =>
                        handleCOValuesChange(e, Number(ev.target.value))
                      }
                    />
                  </div>
                ))}
            </div>
          </div>

          <div className="border border-gray-100 rounded-xl overflow-hidden">
            <UTAccordion title="Course Outcome" cos={currentSubject.co?.cos} />
          </div>
        </div>
      </div>

      {/* ================= Project Outcomes ================= */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 rounded bg-red-500" />
          <h2 className="text-xl font-semibold text-gray-800">
            Project Outcomes
          </h2>
        </div>

        <div className="border border-gray-200 rounded-xl overflow-hidden">
          {/* Header */}
          <button
            onClick={() => setOpenPO((prev) => !prev)}
            className="w-full flex items-center justify-between px-5 py-4 bg-white hover:bg-gray-50 transition"
          >
            <span className="font-medium text-gray-800">
              List of Project Outcomes
            </span>

            <MdArrowDropDown
              size={28}
              className={`transition-transform duration-200 ${
                openPO ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown */}
          {openPO && (
            <div className="border-t border-gray-200 divide-y divide-gray-200">
              {poList.map((po) => (
                <div key={po.code} className="px-5 py-4 bg-gray-50">
                  <h3 className="font-medium text-gray-800">
                    {po.code}: {po.title}
                  </h3>

                  <p className="mt-1 text-sm text-gray-600 leading-6">
                    {po.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CO-PO Matrix */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
        {/* CO-PO Matrix */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 rounded bg-red-500" />
            <h2 className="text-xl font-semibold text-gray-800">
              CO-PO Matrix
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-200 px-4 py-3 text-left font-semibold min-w-[90px]">
                    CO / PO
                  </th>

                  {poList.map((po) => (
                    <th
                      key={po.code}
                      className="border border-gray-200 px-3 py-3 text-center font-semibold min-w-[90px]"
                    >
                      {po.code}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {currentSubject?.co?.cos?.map((co, rowIndex) => (
                  <tr key={co.id || rowIndex} className="hover:bg-gray-50">
                    <td className="border border-gray-200 px-4 py-3 font-medium bg-gray-50">
                      CO{rowIndex + 1}
                    </td>

                    {poList.map((po) => (
                      <td
                        key={`${rowIndex}-${po.code}`}
                        className="border border-gray-200 px-2 py-2 text-center"
                      >
                        <select
                          className="w-16 h-9 rounded-md border border-gray-300 bg-white text-center text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400"
                          defaultValue=""
                        >
                          <option value="">-</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                        </select>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 rounded bg-red-500" />
          <h2 className="text-xl font-semibold text-gray-800">
            Project Outcomes
          </h2>
        </div>

        <div className="border border-gray-100 rounded-xl overflow-hidden">
          <UTAccordion title="Project Outcome" cos={currentSubject.co?.pos} />
        </div>
      </div> */}

      {/* ================= Assessments ================= */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 rounded bg-red-500" />
          <h2 className="text-xl font-semibold text-gray-800">Assessments</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {assessments.map((assessment) => {
            const assessData = currentSubject?.co?.[assessment.key];

            return (
              <SimpleAssessment
                key={assessment.key}
                title={assessment.title}
                field={assessment.key}
                thresholds={assessData}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
