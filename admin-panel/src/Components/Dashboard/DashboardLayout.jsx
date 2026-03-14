import React, { useState } from "react";
import Sidebar from "../UI/Sidebar";
import { Outlet, useLocation } from "react-router-dom";

export default function DashboardLayout() {
  const location = useLocation();
  const pathToName = {
    "/dashboard": "Dashboard",
    "/dashboard/subjects": "Subjects",
    "/dashboard/faculty": "Faculty",
    "/dashboard/students": "Students",
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar active={location.pathname} />
      <main className="flex-1 p-6 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}
