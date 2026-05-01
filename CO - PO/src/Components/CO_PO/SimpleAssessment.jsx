import React, { useState } from "react";
import { updateSAField } from "../../store/slices/userChanges";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

export default function SimpleAssessment({ title, field, thresholds }) {
  const [sa, setSA] = useState({
    totalMarks: thresholds?.totalMarks || 0,
    t1: thresholds?.t1 || 0,
    t2: thresholds?.t2 || 0,
    t3: thresholds?.t3 || 0,
  });

  const dispatch = useDispatch();

  const location = useLocation();
  const classId = location.pathname.split("/").slice(-1);

  const changeSAData = (subField, value) => {
    dispatch(
      updateSAField({ classId, updates: { [`${field}.${subField}`]: value } }),
    );
  };

  const inputClass =
    "w-full bg-gray-50 border border-gray-200 rounded-lg h-10 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-300 transition";

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 space-y-6 border border-gray-100 hover:shadow-md transition">
      {/* 🔥 Header */}
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-6 bg-red-500 rounded" />
        <h2 className="text-base font-semibold text-gray-800">{title}</h2>
      </div>

      {/* 🔥 Total Marks (converted to same structure style) */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-600">Total Marks</label>
        <input
          type="number"
          className={inputClass}
          value={sa.totalMarks}
          onChange={(e) => {
            const val = Number(e.target.value);
            setSA({ ...sa, totalMarks: val });
            changeSAData("totalMarks", val);
          }}
        />
      </div>

      {/* 🔥 Threshold Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 bg-red-400 rounded" />
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Threshold Levels
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            { key: "t1", label: "Level 1" },
            { key: "t2", label: "Level 2" },
            { key: "t3", label: "Level 3" },
          ].map((lvl) => (
            <div key={lvl.key} className="space-y-1">
              <label className="text-xs text-gray-500">{lvl.label}</label>

              <input
                type="number"
                className={inputClass}
                value={sa[lvl.key] || ""}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setSA({ ...sa, [lvl.key]: val });
                  changeSAData(lvl.key, val);
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
