import React from "react";
import { useCO_PO_Mapping } from "../../hooks/useCO_PO_Mapping";

function CO_PO_Mapping({ subjectId }) {
  const { mappings } = useCO_PO_Mapping(subjectId);

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-red-500 rounded" />
          <h2 className="text-lg font-semibold text-gray-800">
            CO Attainment Report
          </h2>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gray-50 border rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500">Level 1</p>
            <p className="text-2xl font-bold text-red-500">
              {mappings?.summary?.level1 ?? 0}
            </p>
          </div>

          <div className="bg-gray-50 border rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500">Level 2</p>
            <p className="text-2xl font-bold text-yellow-500">
              {mappings?.summary?.level2 ?? 0}
            </p>
          </div>

          <div className="bg-gray-50 border rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500">Level 3</p>
            <p className="text-2xl font-bold text-green-500">
              {mappings?.summary?.level3 ?? 0}
            </p>
          </div>
        </div>

        {/* Attainment Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-center">Target</th>
                <th className="px-4 py-3 text-center">Total</th>
                <th className="px-4 py-3 text-center">Achieved</th>
                <th className="px-4 py-3 text-center">Students</th>
                <th className="px-4 py-3 text-center">Attainment %</th>
                <th className="px-4 py-3 text-center">Level</th>
              </tr>
            </thead>

            <tbody>
              {Object.entries(mappings?.coAttainment ?? {}).map(
                ([co, item]) => (
                  <tr key={co} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium uppercase">{co}</td>
                    <td className="px-4 py-3 text-center">{item.target}</td>
                    <td className="px-4 py-3 text-center">{item.total}</td>
                    <td className="px-4 py-3 text-center">{item.achieved}</td>
                    <td className="px-4 py-3 text-center">
                      {item.totalStudents}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {item.attainmentPercentage.toFixed(2)}%
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          item.level === 3
                            ? "bg-green-100 text-green-700"
                            : item.level === 2
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        Level {item.level}
                      </span>
                    </td>
                  </tr>
                ),
              )}
              {Object.entries(mappings?.assessAttainment ?? {}).map(
                ([co, item]) => (
                  <tr key={co} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium uppercase">{co}</td>
                    <td className="px-4 py-3 text-center">{item.target}</td>
                    <td className="px-4 py-3 text-center">{item.total}</td>
                    <td className="px-4 py-3 text-center">{item.achieved}</td>
                    <td className="px-4 py-3 text-center">
                      {item.totalStudents}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {item.attainmentPercentage.toFixed(2)}%
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          item.level === 3
                            ? "bg-green-100 text-green-700"
                            : item.level === 2
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        Level {item.level}
                      </span>
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default CO_PO_Mapping;
