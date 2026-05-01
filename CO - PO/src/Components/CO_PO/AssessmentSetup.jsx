import React from "react";
import UTAccordion from "./UTAccordion";
import SimpleAssessment from "./SimpleAssessment";
import { useSelector } from "react-redux";

export default function AssessmentSetup() {
  const { currentSubject } = useSelector((state) => state.subjects);

  if (!currentSubject) {
    return (
      <div className="px-20 pt-10">
        <div className="bg-white rounded-xl shadow-sm p-6 text-gray-500">
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
  ];

  return (
    <div className="px-20 pt-6 space-y-8">

      {/* 🔥 Course Outcomes */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 bg-red-500 rounded" />
          <h2 className="text-lg font-semibold text-gray-800">
            Course Outcomes
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <UTAccordion
            title={"Course Outcome"}
            cos={currentSubject.co?.cos}
          />
        </div>
      </div>

      {/* 🔥 Assessments */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 bg-red-500 rounded" />
          <h2 className="text-lg font-semibold text-gray-800">
            Assessments
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {assessments.map((a) => {
            const assessData = currentSubject?.co?.[a.key];

            return (
              <div
                key={a.key}
                className="relative group"
              >

                <SimpleAssessment
                  title={a.title}
                  field={a.key}
                  thresholds={assessData}
                />
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}