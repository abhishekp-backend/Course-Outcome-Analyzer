import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateCoPosField } from "../../store/slices/userChanges";
import { useLocation } from "react-router-dom";

const BT_LEVELS = [
  "Remembering",
  "Understanding",
  "Applying",
  "Analyzing",
  "Evaluating",
  "Creating",
];

export default function COForm({ co, innerDoc }) {
  const dispatch = useDispatch();
  const [localCo, setLocalCo] = useState(co);
  const location = useLocation();

  const handleChange = (field, value) => {
    const updates = { [field]: value };

    setLocalCo((prev) => ({ ...prev, [field]: value }));

    dispatch(
      updateCoPosField({
        classId: location.pathname.split("/").slice(-1),
        "cos._id": { [innerDoc.toString()]: updates },
      })
    );
  };

  const inputClass =
    "w-full bg-gray-50 border border-gray-200 rounded-lg h-10 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-300 transition";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-6">

      {/* 🔥 Header */}
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-6 bg-red-500 rounded" />
        <h2 className="text-base font-semibold text-gray-800">
          Course Outcome {co?.name.slice(2)}
        </h2>
      </div>

      {/* 🔥 Question + Marks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div className="space-y-2 md:col-span-1">
          <label className="text-sm text-gray-600">Question</label>
          <input
            type="text"
            placeholder={`${co.name} Question`}
            className={inputClass}
            value={localCo.question}
            onChange={(e) => handleChange("question", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-600">Total Marks</label>
          <input
            type="number"
            className={inputClass}
            value={localCo.totalMarks}
            onChange={(e) =>
              handleChange("totalMarks", Number(e.target.value))
            }
          />
        </div>
      </div>

      {/* 🔥 Thresholds */}
      <div className="space-y-3">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          Threshold Levels
        </p>

        <div className="grid grid-cols-3 gap-4">
          {["t1", "t2", "t3"].map((key, i) => (
            <div key={key} className="space-y-1">
              <label className="text-xs text-gray-500">
                Level {i + 1}
              </label>
              <input
                type="number"
                className={inputClass}
                value={localCo[key] || ""}
                onChange={(e) =>
                  handleChange(key, Number(e.target.value))
                }
              />
            </div>
          ))}
        </div>
      </div>

      {/* 🔥 Topic + BT Level */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">

        <div className="space-y-2">
          <label className="text-sm text-gray-600">Topic</label>
          <input
            type="text"
            className={inputClass}
            value={localCo.topic}
            placeholder="Enter topic"
            onChange={(e) => handleChange("topic", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-600">BT Level Mapping</label>
          <select
            className={inputClass}
            value={localCo.btLevel}
            onChange={(e) =>
              handleChange("btLevel", Number(e.target.value))
            }
          >
            <option value="" disabled>
              Select BT Level
            </option>
            {BT_LEVELS.map((level, idx) => (
              <option key={idx} value={idx + 1}>
                {level}
              </option>
            ))}
          </select>
        </div>

      </div>
    </div>
  );
}