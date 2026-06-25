import React from "react";
import { useCO_PO_Mapping } from "../../hooks/useCO_PO_Mapping";

function CO_PO_Mapping({ subjectId }) {
  const { poAttainment } = useCO_PO_Mapping(subjectId);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-6 bg-red-500 rounded" />
        <h2 className="text-lg font-semibold text-gray-800">
          CO × Term Work Mapping (Attainments)
        </h2>
      </div>

      {/* DATA */}
      {poAttainment?.mappings?.length > 0 ? (
        // TABLE MODE
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-100 text-sm text-gray-700">
              <tr>
                <th className="text-left p-3 border">CO</th>
                <th className="text-center p-3 border">Mapping</th>
              </tr>
            </thead>

            <tbody>
              {poAttainment.mappings.map((m, idx) => (
                <tr key={idx} className="text-sm">
                  <td className="p-3 border">{m.co ?? "-"}</td>
                  <td className="p-3 border text-center">{m.value ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        // TILE MODE
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-gray-50 border text-center">
            <div className="text-sm text-gray-500">LV1</div>
            <div className="text-xl font-semibold text-gray-800">
              {poAttainment?.lv1 ?? 0}
            </div>
          </div>

          <div className="p-4 rounded-lg bg-gray-50 border text-center">
            <div className="text-sm text-gray-500">LV2</div>
            <div className="text-xl font-semibold text-gray-800">
              {poAttainment?.lv2 ?? 0}
            </div>
          </div>

          <div className="p-4 rounded-lg bg-gray-50 border text-center">
            <div className="text-sm text-gray-500">LV3</div>
            <div className="text-xl font-semibold text-gray-800">
              {poAttainment?.lv3 ?? 0}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CO_PO_Mapping;
