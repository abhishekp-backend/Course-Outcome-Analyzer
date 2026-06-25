import React, { useState } from "react";
import COForm from "./COForm";
import { MdArrowDropDown } from "react-icons/md";

export default function UTAccordion({ title, cos }) {
  const [openCO, setOpenCO] = useState(null);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">

      {/* 🔥 Accordion body */}   
      <div className="p-3 space-y-2">

        {cos?.map((co, index) => {
          const isOpen = openCO === co._id;
          const label = co.name || `CO${index + 1}`;

          return (
            <div key={co._id || index} className="space-y-2">

              {/* Accordion button */}
              <button
                onClick={() =>
                  setOpenCO(isOpen ? null : co._id)
                }
                className={`
                  w-full flex items-center justify-between
                  px-4 py-3 rounded-lg text-sm font-medium
                  border transition
                  ${isOpen
                    ? "bg-red-50 border-red-200 text-gray-800"
                    : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                  }
                `}
              >
                <span>{label}</span>

                <MdArrowDropDown
                  className={`text-xl transition-transform duration-200 ${
                    isOpen ? "rotate-180 text-red-500" : "text-gray-400"
                  }`}
                />
              </button>

              {/* Accordion content */}
              {isOpen && (
                <div className="pl-2">
                  <COForm
                    index={index}
                    innerDoc={co._id}
                    co={co}
                  />
                </div>
              )}
            </div>
          );
        })}

      </div>
    </div>
  );
}