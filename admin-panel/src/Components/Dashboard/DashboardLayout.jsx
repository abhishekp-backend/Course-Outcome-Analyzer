import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Sidebar from "../UI/Sidebar";

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const { academicId, loading } = useSelector((state) => state.academicYear);

  useEffect(() => {
    if (
      academicId &&
      !loading &&
      location.pathname === "/dashboard/academic-years"
    ) {
      navigate("/dashboard", { replace: true });
    }
  }, [academicId, loading, location.pathname, navigate]);
  return (
    <div className="flex h-screen">
      <Sidebar active={location.pathname} />
      <main className="flex-1 p-6 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}
