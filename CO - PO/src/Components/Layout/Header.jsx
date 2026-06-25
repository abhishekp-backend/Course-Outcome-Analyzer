import React from "react";
import { useLocation, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useSubjects } from "../../hooks/useSubjects";

function Header() {
  const { currentSubject } = useSelector((state) => state.subjects);
  const { user } = useSelector((state) => state.auth);

  function capitalize(text) {
    if (text) {
      return text[0].toUpperCase() + text.slice(1);
    }
  }

  const location = useLocation();
  const { id } = useParams();
  const { subjects } = useSubjects();
  const selectedSubject = subjects.find((s) => s._id === id);
  const title =
    location.pathname.split("/")[1] !== "subject"
      ? capitalize(location.pathname.slice(1))
      : `${selectedSubject?.name || ""}-${selectedSubject?.branch || ""}`;

  return (
    <div className="w-full px-6 py-4 flex items-center 
                    bg-white text-red-600 
                    shadow-sm border-b border-gray-100">

      {/* Title */}
      <p className="text-2xl font-semibold tracking-tight">
        {title}
      </p>

      {/* Profile */}
      <div className="ml-auto flex items-center gap-3">
        <img
          src="defaultPFP.png"
          alt="profile"
          className="w-9 h-9 rounded-full object-cover border border-gray-200"
        />
        <h1 className="text-base font-medium text-red-500">
          {user?.name}
        </h1>
      </div>
    </div>
  );
}

export default Header;