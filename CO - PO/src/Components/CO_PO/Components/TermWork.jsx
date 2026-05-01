import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateTWField } from "../../../store/slices/userChanges";

function TermWork({ twIndex }) {
  const dispatch = useDispatch();

  const subjectTW =
    useSelector((state) => state.subjects.currentSubject?.co?.tw) || {};

  const updatedTW =
    useSelector((state) => state.userChanges.assess?.tw) || {};

  // ✅ merge once for initial state
  const initialTW = {
    ...subjectTW,
    ...updatedTW,
  };

  console.log(subjectTW)

  const [localTW, setLocalTW] = useState(initialTW);

  const totalMarksKey = `tw${twIndex}TotalMarks`;
  const classId = location.pathname.split("/").slice(-1)[0];

  const handleMatrixChange = (coIndex, value) => {
    const key = `tw${twIndex}co${coIndex}`;
    const val = Number(value);

    setLocalTW((prev) => ({ ...prev, [key]: val }));

    dispatch(
      updateTWField({
        classId,
        updates: {
          [key]: val,
        },
      })
    );
  };

  const handleTotalMarksChange = (value) => {
    const val = Number(value);

    setLocalTW((prev) => ({
      ...prev,
      [totalMarksKey]: val,
    }));


    dispatch(
      updateTWField({
        classId,
        updates: {
          [totalMarksKey]: val,
        },
      })
    );
  };

  return (
    <div className="space-y-4">

      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-800">
          Term Work {twIndex}
        </h3>

        <input
          type="number"
          value={localTW[totalMarksKey] || ""}
          onChange={(e) => handleTotalMarksChange(e.target.value)}
          className="border border-gray-200 rounded-lg h-9 w-20 px-2"
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3].map((coIndex) => {
          const key = `tw${twIndex}co${coIndex}`;

          return (
            <input
              key={key}
              type="number"
              value={localTW[key] || ""}
              onChange={(e) =>
                {handleMatrixChange(coIndex, e.target.value);console.log(e.target.value)}
              }
              className="border border-gray-200 rounded-lg h-10 px-3"
            />
          );
        })}
      </div>
    </div>
  );
}

export default TermWork;