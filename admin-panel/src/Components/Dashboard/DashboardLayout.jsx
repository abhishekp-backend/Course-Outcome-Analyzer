import React from "react";
import Sidebar from "../UI/Sidebar";
import { Outlet, useLocation } from "react-router-dom";

export default function DashboardLayout() {
  const location = useLocation();

  return (
    <div className="flex h-screen">
      <Sidebar active={location.pathname} />
      <main className="flex-1 p-6 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}
