import React, {useState} from "react";
import { updateSAField } from "../../store/slices/userChanges";
import { useDispatch } from "react-redux";

export default function SimpleAssessment({ title, field, thresholds }) {
  const [sa, setSA] = useState({totalMarks: thresholds?.totalMarks || 0, t1: thresholds?.t1 || 0, t2: thresholds?.t2 || 0, t3: thresholds?.t3 || 0});
  const dispatch = useDispatch();

  const changeSAData = (subField, value) => {
    dispatch(updateSAField({field, updates: {[`${field}.${subField}`]: value}}));
  }
  
  return (
    <div className="border rounded-lg shadow-xs p-4 space-y-4 text-white bg-red-500/90">
      <div className="font-semibold text-xl text-gray-50">
        {title}
      </div>
      <div className="flex gap-5 p-3 border rounded-lg w-fit">
        <span className="m-auto mx-0">Total Marks</span>
        <input
          type="number"
          placeholder="Total Marks"
          className="bg-white text-black rounded p-2"
          value={sa.totalMarks}
          onChange = {(e) => {
            setSA({...sa, totalMarks: Number(e.target.value)});
            changeSAData("totalMarks", Number(e.target.value));
          }}
          />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <span>Level 1</span>
        <input
          type="number"
          placeholder="Level 1"
          className=" bg-white text-black rounded p-2"
          value={sa.t1 || ""}
          onChange = {(e) => {
            setSA({...sa, t1: Number(e.target.value)});
            changeSAData("t1", Number(e.target.value));
          }}
          />
        <span>Level 2</span>
        <input
          type="number"
          placeholder="Level 2"
          className=" bg-white text-black rounded p-2"
          value={sa.t2 || ""}
          onChange = {(e) => {
            setSA({...sa, t2: Number(e.target.value)});
            changeSAData("t2", Number(e.target.value));
          }}
          />
        <span>Level 3</span>
        <input
          type="number"
          placeholder="Level 3"
          className=" bg-white text-black rounded p-2"
          value={sa.t3 || ""}
          onChange = {(e) => {
            setSA({...sa, t3: Number(e.target.value)});
            changeSAData("t3", Number(e.target.value));
          }}
        />
      </div>

    </div>
  );
}
