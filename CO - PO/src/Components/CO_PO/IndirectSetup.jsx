import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { updateIndirectField } from "../../store/slices/userChanges";
import { fetchIndirect } from "../../store/slices/indirectSlice";

function IndirectSetup({ classId, setChange }) {
  const dispatch = useDispatch();

  // --------------------------------
  // Existing values from database
  // --------------------------------
  const {
    data: indirect,
    loading,
    error,
  } = useSelector((state) => state.indirect);

  // --------------------------------
  // Local input state
  // --------------------------------
  const [marks, setMarks] = useState({
    level1: 0,
    level2: 0,
    level3: 0,
  });

  // --------------------------------
  // Fetch data whenever class changes
  // --------------------------------
  useEffect(() => {
    if (!classId) return;

    dispatch(fetchIndirect(classId));
  }, [classId, dispatch]);

  // --------------------------------
  // Load database values into inputs
  // --------------------------------
  useEffect(() => {
    if (!indirect) return;

    setMarks({
      level1: indirect.level1 ?? 0,
      level2: indirect.level2 ?? 0,
      level3: indirect.level3 ?? 0,
    });
  }, [indirect]);

  // --------------------------------
  // Handle input change
  // --------------------------------
  const handleChange = (field, value) => {
    const numericValue =
      value === "" ? "" : Number(value);

    // Update UI
    setMarks((prev) => ({
      ...prev,
      [field]: numericValue,
    }));

    // Don't store empty values
    if (numericValue === "") {
      return;
    }

    // There are unsaved changes
    setChange?.(true);

    // Store only the changed field
    dispatch(
      updateIndirectField({
        classId,
        field,
        value: numericValue,
      })
    );
  };

  const fields = [
    {
      key: "level1",
      label: "Level 1",
    },
    {
      key: "level2",
      label: "Level 2",
    },
    {
      key: "level3",
      label: "Level 3",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-5">

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-red-500 rounded" />

          <h2 className="text-lg font-semibold text-gray-800">
            Indirect Assessment
          </h2>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-sm text-gray-500">
            Loading indirect assessment...
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="text-sm text-red-500">
            {error}
          </div>
        )}

        {/* Fields */}
        {!loading && !error && (
          <div className="space-y-3">

            {fields.map(({ key, label }) => (
              <div
                key={key}
                className="
                  flex items-center justify-between
                  gap-4 p-2 rounded-lg
                  hover:bg-gray-50
                  transition
                "
              >
                <span className="text-sm text-gray-600">
                  {label}
                </span>

                <input
                  type="number"
                  min={0}
                  value={marks[key]}
                  onChange={(e) =>
                    handleChange(key, e.target.value)
                  }
                  className="
                    w-24 h-10 px-3
                    bg-gray-50
                    border border-gray-200
                    rounded-lg
                    text-sm
                    focus:outline-none
                    focus:ring-2
                    focus:ring-red-400
                    focus:border-red-300
                    transition
                  "
                />
              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}

export default IndirectSetup;