import { useEffect, useState } from "react";
import { getDeviceMode, setDeviceMode } from "../../services/api";

export default function Header({ setSidebarOpen }) {
  const [mode, setMode] = useState("akses");
  const [loading, setLoading] = useState(false);

  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username");

  useEffect(() => {
    loadMode();

    const interval = setInterval(() => {
      loadMode();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const loadMode = async () => {
    try {
      const res = await getDeviceMode();
      setMode(res.data.mode);
    } catch (err) {
      console.error("Failed get device mode");
    }
  };

  const toggleMode = async () => {
    if (role !== "admin") return;

    const newMode = mode === "akses" ? "daftar" : "akses";

    try {
      setLoading(true);
      await setDeviceMode(newMode);
      setMode(newMode);
    } catch (err) {
      alert("Gagal mengubah mode device");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 md:mb-8">

      {/* LEFT SIDE */}
      <div className="flex items-center gap-3">

        {/* HAMBURGER */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden px-3 py-2 bg-[#7A0C0C] rounded-lg"
        >
          ☰
        </button>

        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-400 text-sm">
            Monitoring akses pintu ruangan
          </p>
        </div>

      </div>

      {/* RIGHT SIDE */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">

        {/* MODE DEVICE */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          <span className="text-sm text-gray-400">Mode Device</span>

          {role === "admin" ? (
            <button
              disabled={loading}
              onClick={toggleMode}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                mode === "akses"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-700 hover:bg-red-800"
              }`}
            >
              {loading ? "..." : mode.toUpperCase()}
            </button>
          ) : (
            <span
              className={`px-6 py-2 rounded-lg font-semibold ${
                mode === "akses"
                  ? "bg-green-600"
                  : "bg-red-700"
              }`}
            >
              {mode.toUpperCase()}
            </span>
          )}
        </div>

        {/* USER INFO */}
        <div className="flex items-center justify-between sm:justify-start gap-3 sm:border-l border-gray-700 sm:pl-4 pt-2 sm:pt-0 border-t sm:border-t-0">

          <div className="text-right">
            <div className="text-sm font-semibold">{username}</div>
            <div className="text-xs text-gray-400">{role}</div>
          </div>

          <button
            onClick={logout}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm"
          >
            Logout
          </button>

        </div>

      </div>

    </div>
  );
}