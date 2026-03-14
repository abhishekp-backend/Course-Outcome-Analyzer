import React, { useState } from "react";
import COForm from "./COForm";
import { MdArrowDropDown } from "react-icons/md";

export default function UTAccordion({ title, cos }) {
  const [openCO, setOpenCO] = useState(null);

  return (
    <div className="rounded-lg">

      <div className="p-4 font-semibold text-gray-50 text-xl bg-red-400 rounded-t-lg">
        {title}
      </div>

      <div className="p-3 space-y-2 border-x border-gray-400 border-b rounded-b-xl">

        {cos.map((co, index) => {

          const label = co.name || `CO${index + 1}`;

          return (
            <div key={co._id || index}>
              <button
                onClick={() => setOpenCO(openCO === co._id ? null : co._id)}
                className={`w-full text-left ${openCO === co._id ? "bg-gray-300 text-gray-700" : "bg-gray-100 text-gray-400"} p-3 rounded flex items-center`}
              >
                {label}

                <MdArrowDropDown
                  className={`ml-auto transition ${
                    openCO === co._id ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openCO === co._id && (
                <COForm
                  index={index}
                  innerDoc={co._id}
                  co={co}   // REAL data from slice
                />
              )}
            </div>
          );
        })}

      </div>
    </div>
  );
}
