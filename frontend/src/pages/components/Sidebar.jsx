import { NavLink } from "react-router-dom";

export default function Sidebar({ open, setOpen }) {
  const role = localStorage.getItem("role");

  return (
    <>
      {/* OVERLAY */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          w-64 h-screen bg-[#0d0d0d] border-r border-[#7A0C0C]
          flex flex-col fixed top-0 left-0 z-50
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* HEADER SIDEBAR */}
        <div className="px-4 py-4 border-b border-[#7A0C0C] flex items-center justify-between">
          {/* CLOSE BUTTON (mobile only) */}
          <button
            onClick={() => setOpen(false)}
            className="md:hidden px-2 py-1 text-white bg-[#7A0C0C] rounded hover:bg-red-800 transition"
          >
            ←
          </button>

          {/* LOGO */}
          <div className="flex-1 text-center">
            <h1 className="text-xl font-bold text-[#7A0C0C] tracking-wide">
              LPM UNSIKA
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Doorlock Monitoring System
            </p>
          </div>

          {/* spacer supaya logo tetap center */}
          <div className="md:hidden w-6"></div>
        </div>

        {/* MENU */}
        <nav className="flex-1 px-4 py-6 space-y-2 text-sm">
          <NavLink
            to="/dashboard"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `block w-full px-4 py-3 rounded-lg font-medium transition
              ${
                isActive
                  ? "bg-[#7A0C0C] text-white shadow"
                  : "text-gray-300 hover:bg-[#1a1a1a]"
              }`
            }
          >
            Dashboard
          </NavLink>

          {role === "admin" && (
            <>
              <NavLink
                to="/users"
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `block w-full px-4 py-3 rounded-lg font-medium transition
                  ${
                    isActive
                      ? "bg-[#7A0C0C] text-white shadow"
                      : "text-gray-300 hover:bg-[#1a1a1a]"
                  }`
                }
              >
                User Management
              </NavLink>

              <NavLink
                to="/accounts"
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `block w-full px-4 py-3 rounded-lg font-medium transition
                  ${
                    isActive
                      ? "bg-[#7A0C0C] text-white shadow"
                      : "text-gray-300 hover:bg-[#1a1a1a]"
                  }`
                }
              >
                Account Management
              </NavLink>
            </>
          )}
        </nav>

        {/* FOOTER */}
        <div className="px-4 py-4 text-xs text-gray-500 border-t border-[#7A0C0C] text-center">
          © 2026 LPM UNSIKA
        </div>
      </aside>
    </>
  );
}
