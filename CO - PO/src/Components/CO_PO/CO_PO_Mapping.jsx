import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateSAField } from "../../store/slices/userChanges";

function CO_PO_Mapping({ subjectId }) {
  const dispatch = useDispatch();

  const { currentSubject } = useSelector((state) => state.subjects);

  const cos = currentSubject?.cos || [];
  const tws = currentSubject?.tws || 0;
  const twData = currentSubject?.tw || {};

  const handleChange = (twIndex, coIndex, value) => {
    const key = `tw${twIndex}co${coIndex}`;

    dispatch(
      updateSAField({
        updates: {
          [`tw.${key}`]: Number(value),
        },
      })
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-6 bg-red-500 rounded" />
        <h2 className="text-lg font-semibold text-gray-800">
          CO × Term Work Mapping
        </h2>
      </div>

      {/* Matrix */}
      <div className="space-y-4">

        {cos.map((co, coIndex) => (
          <div
            key={co._id}
            className="bg-white border border-gray-100 rounded-xl p-4 space-y-3"
          >

            {/* CO label */}
            <div className="font-semibold text-gray-800">
              {co.name}
            </div>

            {/* TW inputs */}
            <div className="grid gap-3" style={{
              gridTemplateColumns: `repeat(${tws}, minmax(0, 1fr))`
            }}>

              {Array.from({ length: tws }).map((_, twIndex) => {
                const key = `tw${twIndex + 1}co${coIndex + 1}`;

                return (
                  <input
                    key={key}
                    type="number"
                    value={twData?.[key] || 0}
                    onChange={(e) =>
                      handleChange(
                        twIndex + 1,
                        coIndex + 1,
                        e.target.value
                      )
                    }
                    className="border border-gray-200 rounded-lg h-10 px-2 text-sm bg-gray-50 focus:ring-2 focus:ring-red-400 focus:border-red-300 transition"
                    placeholder={key}
                  />
                );
              })}

            </div>
          </div>
        ))}

      </div>
    </div>
  );
}

export default CO_PO_Mapping;