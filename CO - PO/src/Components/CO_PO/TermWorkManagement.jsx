import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updateCoPosField } from "../../store/slices/userChanges";
import TermWork from "./Components/TermWork";

function TermWorkManagement({ termWorks }) {
  const dispatch = useDispatch();

  const tws = termWorks?.tws;
  const [twCount, setTWCount] = useState(tws || 0);

  useEffect(() => {
    if (typeof tws === "number") {
      setTWCount(tws);
    }
  }, [tws]);

  const changeTWData = (value) => {
    dispatch(
      updateCoPosField({
        classId: termWorks?.classId,
        updates: {
          tws: Number(value), // ✅ direct field update
        },
      })
    );
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-4">

        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-red-500 rounded" />
          <h2 className="text-lg font-semibold text-gray-800">
            Term Work Management
          </h2>
        </div>

        {/* Input */}
        <div className="flex items-center justify-between gap-4">

          <span className="text-sm text-gray-600">
            Number of Term Works
          </span>

          <input
            type="number"
            min={1}
            max={10}
            value={twCount}
            onChange={(e) => {
              const val = Number(e.target.value);
              setTWCount(val);
              changeTWData(val);
            }}
            className="
              w-24 bg-gray-50 border border-gray-200
              rounded-lg h-10 px-3 text-sm
              focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-300
              transition
            "
          />

        </div>

      </div>

      {/* List */}
      <div className="space-y-4">
        {twCount > 0 ? (
          Array.from({ length: twCount }).map((_, i) => (
            <div
              key={i + 1}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
            >
              <TermWork twIndex={i + 1} />
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl border border-gray-100 p-6 text-sm text-gray-500">
            No Term Works added
          </div>
        )}
      </div>

    </div>
  );
}

export default TermWorkManagement;