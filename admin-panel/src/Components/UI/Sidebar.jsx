import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAcademicYears } from "../../store/slices/academicYearSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchAcademicSubjects } from "../../store/slices/subjectsSlice";
import { fetchBranches } from "../../store/slices/branchSlice";
import { fetchClasses } from "../../store/slices/classSlice";
import { fetchFaculty } from "../../store/slices/facultySlice";
import { logoutUser } from "../../store/slices/authSlice";

export default function Sidebar({ active }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { years, academicId } = useSelector((state) => state.academicYear);
  const { user } = useSelector((state) => state.auth);

  console.log(user.role !== "admin" ? "hidden" : "");

  const menuItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Sections", path: "/dashboard/classes" },
    { name: "Faculty", path: "/dashboard/faculty" },
    { name: "Subjects", path: "/dashboard/subjects" },
    { name: "Students", path: "/dashboard/students" },
    { name: "Branches", path: "/dashboard/branches", style: `${user.role !== "admin" ? "hidden": ""}` },
    { name: "Academic Years", path: "/dashboard/academic-years" },
    // { name: "Head of Departments", path: "/dashboard/hods" },
  ];

  useEffect(() => {
    dispatch(fetchAcademicYears());
    dispatch(fetchBranches());
    dispatch(fetchClasses());
    dispatch(fetchFaculty());
    if (academicId !== "") {
      dispatch(fetchAcademicSubjects());
    }
  }, [dispatch, academicId]);

  return (
    <aside className="w-64 stick bg-white text-gray-800 flex flex-col h-screen shadow-md">
      <h1 className="text-2xl font-bold px-6 py-5 border-b border-gray-200 text-center">
        {!user.role ? "Admin" : user?.role} Panel
      </h1>

      <div className="px-6 py-4">
        <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500">
          {Array.from(years).map((e) => {
            return (
              <option key={e.year} value={e.year}>
                {e.label}
              </option>
            );
          })}
        </select>
      </div>

      <nav className="flex-1 px-4 py-2 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.name}
            className={`${item?.style} w-full cursor-pointer text-left px-4 py-2.5 rounded-md transition ${
              active === item.path || active === item.path + "/"
                ? "bg-red-600 text-white shadow-sm"
                : "text-gray-700 hover:bg-red-50 hover:text-red-600"
            }`}
            onClick={() => navigate(item.path)}
          >
            {item.name}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={()=>dispatch(logoutUser())}
          className="w-full cursor-pointer outline-none px-4 py-2.5 rounded-md text-left font-medium text-red-600 border border-red-200 hover:bg-red-50 hover:border-red-300 transition duration-200"
        >
          Log Out
        </button>
      </div>
    </aside>
  );
}
