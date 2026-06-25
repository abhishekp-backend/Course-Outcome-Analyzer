import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateTWField } from "../../../store/slices/userChanges";

function TermWork({ twIndex }) {
  const dispatch = useDispatch();

  const subjectTW =
    useSelector((state) => state.subjects.currentSubject?.co?.tw) || {};

  const updatedTW =
    useSelector((state) => state.userChanges.assess?.tw) || {};

  const { currentSubject } = useSelector((state) => state.subjects);

  const initialTW = {
    ...subjectTW,
    ...updatedTW,
  };

  const [localTW, setLocalTW] = useState(initialTW);

  const totalMarksKey = `tw${twIndex}TotalMarks`;
  const selectKey = `tw${twIndex}co`;

  const classId = location.pathname.split("/").slice(-1)[0];

  // ✅ ensure dropdown always has default value
  useEffect(() => {
    if (!localTW[selectKey]) {
      const firstCO = currentSubject?.co?.cos?.[0]?.name || "";
      setLocalTW((prev) => ({
        ...prev,
        [selectKey]: firstCO,
      }));

      dispatch(
        updateTWField({
          classId,
          updates: {
            [selectKey]: firstCO,
          },
        })
      );
    }
  }, [currentSubject]);

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

  const handleSelectChange = (value) => {
    setLocalTW((prev) => ({
      ...prev,
      [selectKey]: value,
    }));

    dispatch(
      updateTWField({
        classId,
        updates: {
          [selectKey]: value,
        },
      })
    );
  };

  return (
    <div className="space-y-5 p-4 border border-gray-100 rounded-xl bg-white">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-800">
          Term Work {twIndex}
        </h3>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Total Marks</span>
          <input
            type="number"
            value={localTW[totalMarksKey] || ""}
            onChange={(e) => handleTotalMarksChange(e.target.value)}
            className="border border-gray-200 rounded-lg h-9 w-20 px-2 text-center"
          />
        </div>
      </div>

      {/* CO MATRIX */}
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3].map((coIndex) => {
          const key = `tw${twIndex}co${coIndex}`;

          return (
            <div key={key} className="flex flex-col gap-1">
              <span className="text-xs text-gray-500">
                CO{coIndex}
              </span>

              <input
                type="number"
                value={localTW[key] || ""}
                onChange={(e) =>
                  handleMatrixChange(coIndex, e.target.value)
                }
                className="border border-gray-200 rounded-lg h-10 px-3 focus:ring-1 focus:ring-blue-300"
              />
            </div>
          );
        })}
      </div>

      {/* CO SELECT */}
      <div className="pt-2">
        <label className="text-xs text-gray-500 block mb-1">
          Select Course Outcome
        </label>

        <select
          value={localTW[selectKey] || ""}
          onChange={(e) => handleSelectChange(e.target.value)}
          className="border border-gray-200 rounded-lg p-2 w-full bg-white"
        >
          <option value="">Select CO</option>

          {currentSubject?.co?.cos?.map((co, index) => {
            const label = co.name || `CO${index + 1}`;

            return (
              <option value={label} key={label}>
                {label} — {co?.topic || "No topic"}
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
}

export default TermWork;