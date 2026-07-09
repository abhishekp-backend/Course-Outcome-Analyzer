import React, { useState, useRef, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useSubjects } from "../../hooks/useSubjects";
import { useStudents } from "../../hooks/useStudent";
import { logoutUser } from "../../store/slices/authSlice";
import { useAuth } from "../../hooks/useAuth";

function Header({ isSearched, setSearched, searchInputRef }) {
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
      : `${selectedSubject?.name || ""} • ${selectedSubject?.branch || ""}`;

  const [search, setSearch] = useState({ prn: "", subject: "" });
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const { fetchOneStudent } = useStudents();
  const { logout } = useAuth();

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-20 flex h-20 w-full items-center justify-between border-b border-gray-200 bg-white px-8 shadow-sm">
      {/* Left */}
      <div className="min-w-[220px]">
        <h1 className="truncate text-2xl font-semibold tracking-tight text-gray-900/90">
          {title}
        </h1>
      </div>

      {/* Center */}
      <div className="mx-10 flex max-w-xl items-center gap-3">
        <input
          type="text"
          ref={searchInputRef}
          placeholder={document.activeElement === searchInputRef.current ? "Search student by PRN..." : "Press S or Ctrl + F"}
          value={search.prn}
          onChange={(e) =>
            setSearch({
              ...search,
              prn: e.target.value,
            })
          }
          className="h-11 flex-1 rounded-xl border border-gray-300 bg-gray-50 px-4 text-sm text-gray-700 placeholder:text-gray-400 transition-all duration-200 focus:border-red-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-100"
        />

        <button
          onClick={() => {
            fetchOneStudent(search);
            setSearched(true);
          }}
          className="h-11 rounded-xl bg-red-500 px-6 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-red-600 hover:shadow-md active:scale-[0.98]"
        >
          Search
        </button>
      </div>

      {/* Right */}
      <div ref={menuRef} className="relative ml-8">
        <button
          onClick={() => setShowMenu((prev) => !prev)}
          className="flex min-w-fit items-center gap-3 rounded-xl p-2 transition hover:bg-gray-100"
        >
          <div className="text-right">
            <p className="text-sm text-gray-500">Welcome</p>

            <h2 className="font-semibold text-gray-800">{user?.name}</h2>
          </div>

          <img
            src="defaultPFP.png"
            alt="profile"
            className="h-11 w-11 rounded-full border border-gray-200 object-cover shadow-sm"
          />
        </button>

        <div
          className={`absolute right-0 top-full mt-2 w-44 origin-top-right rounded-xl border border-gray-200 bg-white p-2 shadow-lg transition-all duration-200 ease-out ${
            showMenu
              ? "translate-y-0 scale-100 opacity-100 pointer-events-auto"
              : "-translate-y-2 scale-95 opacity-0 pointer-events-none"
          }`}
        >
          <button
            onClick={() => {
              logout();
            }}
            className="w-full rounded-lg px-4 py-2 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
