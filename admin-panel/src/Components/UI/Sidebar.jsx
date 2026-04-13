import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAcademicYears } from "../../store/slices/academicYearSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchAcademicSubjects } from "../../store/slices/subjectsSlice";
import { fetchBranches } from "../../store/slices/branchSlice";
import { fetchClasses } from "../../store/slices/classSlice";
import { fetchFaculty } from "../../store/slices/facultySlice";

export default function Sidebar({ active }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { years, academicId } = useSelector((state) => state.academicYear);
  const menuItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Subjects", path: "/dashboard/subjects" },
    { name: "Faculty", path: "/dashboard/faculty" },
    { name: "Students", path: "/dashboard/students" },
    { name: "Academic Years", path: "/dashboard/academic-years" },
    { name: "Branches", path: "/dashboard/branches" },
    { name: "Sections", path: "/dashboard/classes" },
  ];
  const [fetchedAll, setFetchedAll] = useState(false);

  useEffect(() => {
    dispatch(fetchAcademicYears());
    dispatch(fetchBranches());
    dispatch(fetchClasses());
    dispatch(fetchFaculty());
    if (academicId !== "") {
      dispatch(fetchAcademicSubjects());
    }
    console.log(academicId !== "", academicId.length)
  }, [dispatch, academicId]);

  return (
    <aside className="w-64 bg-white text-gray-800 flex flex-col min-h-screen shadow-md">
      <h1 className="text-2xl font-bold p-6 border-b border-gray-200 m-auto">
        Admin Panel
      </h1>
      <select className="w-[80%] border rounded-sm m-auto p-1 ">
        {Array.from(years).map((e) => {
          return (
            <option key={e.year} value={e.year}>
              {e.label}
            </option>
          );
        })}
      </select>
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.name}
            className={`w-full text-left px-4 py-2 rounded transition ${
              active === item.path || active === item.path + "/"
                ? "bg-red-600 text-white"
                : "hover:bg-red-100 text-gray-800"
            }`}
            onClick={() => navigate(item.path)}
          >
            {item.name}
          </button>
        ))}
      </nav>
    </aside>
  );
}
