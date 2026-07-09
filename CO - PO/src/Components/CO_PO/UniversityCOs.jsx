import React from "react";
import SimpleAssessment from "./SimpleAssessment";
import { useSelector } from "react-redux";

function UniversityCOs() {
  const { currentSubject } = useSelector((state) => state.subjects);

  return (
    <SimpleAssessment
      title={"University COs"}
      thresholds={currentSubject?.co?.["universityExams"]}
      field={"universityExams"}
    />
  );
}

export default UniversityCOs;
