import React, { useState } from "react";
import TermWork from "./Components/TermWork";

function TermWorkManagement() {
  const [twCount, setTWCount] = useState(0);
  return (
    <div className="flex flex-col w-full gap-3 h-full">
      <div className="ml-auto flex gap-2">
        <span className="my-auto">Number of term works</span>
        <input
          type="number"
          onChange={(e) => setTWCount(e.target.value)}
          value={twCount}
          placeholder="Enter number of TWs"
          className="border border-gray-400 rounded p-2 shadow-xs"
        />
      </div>
      <div className="flex flex-col w-[70%] mx-auto">
        {
          Array.from({length: twCount}).map((_, i) => {
            return <TermWork key={i+1} twIndex={i+1} />
          })
          }
      </div>
    </div>
  );
}

export default TermWorkManagement;
