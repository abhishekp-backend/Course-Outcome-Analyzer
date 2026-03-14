import React from "react";
import UTAccordion from "./UTAccordion";
import SimpleAssessment from "./SimpleAssessment";
import { useSelector } from "react-redux";

export default function AssessmentSetup() {
  const { currentSubject } = useSelector((state) => state.subjects);

  if (!currentSubject) return <p>Loading...</p>;

  const assessments = [
    { key: "internalAssessment", title: "Internal Assessment" },
    { key: "termWork", title: "Term Work" },
    { key: "practicals", title: "Practicals" },
    { key: "pbls", title: "PBLs" },
  ];

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">

      {/* UTs (contain COs) */}
      <UTAccordion title={"Course Outcome"} cos={currentSubject.co.cos} />
      {/* Update through each co doc id and field names */}

      {/* Simple assessments */}
      {assessments.map((a) => {
        const assessData = currentSubject.co[a.key];
        return (
          <SimpleAssessment
            key={a.key}
            title={a.title}
            field={a.key}
            thresholds={assessData}
          />
        );
      })}
    </div>
  );
}
