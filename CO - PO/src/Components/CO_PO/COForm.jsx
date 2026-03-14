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
  const location = useLocation()

  const handleChange = (field, value) => {
    const updates = { [field]: value };
    try {
      setLocalCo((prev) => ({ ...prev, [field]:value }));
      dispatch(updateCoPosField({ classId: location.pathname.split("/").slice(-1), "cos._id": {[innerDoc.toString()]: updates} }));
    } catch (err) {
      console.log(err)
    }
  };


  return (
    <div className="p-4 space-y-4 border-t-0 border border-gray-100 rounded-b-xl shadow-lg ">
      {/* Question + Total Marks */}
      <div className="flex gap-1">
        <input
          type="text"
          placeholder={`${co.name} Question`}
          className="w-full border rounded p-2"
          value={localCo.question}
          onChange={(e) => handleChange("question", e.target.value)}
        />
        <input
          type="number"
          placeholder="Total Marks"
          className="border rounded p-2"
          value={localCo.totalMarks}
          onChange={(e) => handleChange("totalMarks", Number(Number(e.target.value)))}
        />
      </div>

      {/* Thresholds */}
      <div className="grid grid-cols-2 gap-4">
        <input
          type="number"
          placeholder={`Threshold Level 1`}
          className="border rounded p-2"
          value={localCo.t1}
          onChange={(e) => handleChange("t1", Number(e.target.value))}
        />
        <input
          type="number"
          placeholder={`Threshold Level 2`}
          className="border rounded p-2"
          value={localCo.t2}
          onChange={(e) => handleChange("t2", Number(e.target.value))}
        />
        <input
          type="number"
          placeholder={`Threshold Level 3`}
          className="border rounded p-2"
          value={localCo.t3}
          onChange={(e) => handleChange("t3", Number(e.target.value))}
        />
      </div>

      {/* BT Level Mapping */}
      <div>
        <p className="font-medium mb-2">BT Level Mapping</p>
        <div className="grid grid-cols-3 gap-3">
          <select
            className="border rounded p-1 border-gray-300/80"
            value={localCo.btLevel}
            onChange={(e) => handleChange("btLevel", Number(Number(e.target.value)))}
          >
            <option value="" disabled>Select BT Level</option>
            {BT_LEVELS.map((levelName, levelIndex) => (
              <option key={levelIndex} value={levelIndex+1}>
                {levelName}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
