import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import StatCard from "../components/StatCard";
import PhotoModal from "../components/PhotoModal";
import RegisterModal from "../components/RegisterModal";
import AlreadyRegisteredModal from "../components/AlreadyRegisteredModal";
import {
  getAccessLogs,
  getPendingRFID,
  getAlreadyRegistered,
  clearAlreadyRegistered,
} from "../../services/api";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logs, setLogs] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [pendingRFID, setPendingRFID] = useState(null);
  const [alreadyRegistered, setAlreadyRegistered] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const formatDate = (date) => date.toISOString().split("T")[0];

  const setToday = () => {
    const today = new Date();
    setStartDate(formatDate(today));
    setEndDate(formatDate(today));
    setPage(1);
  };

  const setThisWeek = () => {
    const now = new Date();
    const first = now.getDate() - now.getDay();
    const last = first + 6;
    const start = new Date(now.setDate(first));
    const end = new Date(now.setDate(last));
    setStartDate(formatDate(start));
    setEndDate(formatDate(end));
    setPage(1);
  };

  const setThisMonth = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    setStartDate(formatDate(start));
    setEndDate(formatDate(end));
    setPage(1);
  };

  const resetFilter = () => {
    setSearch("");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  // ── Polling logs ──────────────────────────────────────────
  useEffect(() => {
    loadLogs();
    const interval = setInterval(loadLogs, 3000);
    return () => clearInterval(interval);
  }, [page, search, startDate, endDate]);

  const loadLogs = async () => {
    const res = await getAccessLogs({ page, limit: 10, search, startDate, endDate });
    setLogs(res.data.data || []);
    setTotalPages(res.data.pagination.totalPages || 1);
  };

  // ── Polling pending RFID (kartu baru) ────────────────────
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await getPendingRFID();
        if (res.data?.found === true && res.data?.pending && !pendingRFID) {
          setPendingRFID({
            pending_id: res.data.pending.id,
            uid: res.data.pending.uid_rfid,
          });
        }
      } catch {
        // aman diabaikan
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [pendingRFID]);

  // ── Polling already registered (kartu sudah terdaftar) ───
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await getAlreadyRegistered();
        if (res.data?.found === true && !alreadyRegistered && !pendingRFID) {
          setAlreadyRegistered({ uid: res.data.uid });
        }
      } catch {
        // aman diabaikan
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [alreadyRegistered, pendingRFID]);

  return (
    <div className="flex text-white bg-black min-h-screen w-full overflow-x-hidden">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <div className="flex-1 md:ml-64 p-4 sm:p-6 md:p-8 min-w-0 flex flex-col">
        <Header setSidebarOpen={setSidebarOpen} />

        {/* STAT */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <StatCard title="Total Akses" value={logs?.length || 0} />
          <StatCard
            title="Granted"
            value={logs?.filter((l) => l.status === "granted").length || 0}
          />
          <StatCard
            title="Denied"
            value={logs?.filter((l) => l.status === "denied").length || 0}
          />
          <StatCard title="Device" value="ESP32_REDAKSI" />
        </div>

        {/* TABLE */}
        <div className="bg-[#1a1a1a] w-full p-3 sm:p-4 md:p-6 rounded-xl border border-[#7A0C0C]">
          <h3 className="text-lg font-semibold mb-4">Access Log</h3>

          <div className="mb-6 p-4 rounded-lg border border-gray-700 bg-[#111]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <h4 className="text-base font-semibold text-white">Filter Access Log</h4>
                {(search || startDate || endDate) && (
                  <span className="ml-3 px-2 py-1 text-xs rounded bg-green-700 text-white">
                    Filter aktif
                  </span>
                )}
              </div>
              <button
                onClick={resetFilter}
                className="px-3 py-1 text-sm rounded bg-red-700 hover:bg-red-600"
              >
                Reset
              </button>
            </div>

            <p className="text-sm text-gray-400 mb-4">
              Cari berdasarkan nama, UID RFID, atau rentang waktu akses
            </p>

            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 mb-3">
              <input
                type="text"
                placeholder="Cari nama / UID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="px-3 py-2 rounded bg-[#0a0a0a] border border-gray-700 w-full sm:w-64"
              />
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span>Dari</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-3 py-2 rounded bg-[#0a0a0a] border border-gray-700 text-white"
                />
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span>Sampai</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-3 py-2 rounded bg-[#0a0a0a] border border-gray-700 text-white"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button onClick={setToday} className="px-3 py-1 text-sm rounded bg-gray-700">
                Hari ini
              </button>
              <button onClick={setThisWeek} className="px-3 py-1 text-sm rounded bg-gray-700">
                Minggu ini
              </button>
              <button onClick={setThisMonth} className="px-3 py-1 text-sm rounded bg-gray-700">
                Bulan ini
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[600px]">
              <thead>
                <tr className="text-gray-400 border-b border-gray-700">
                  <th className="text-left p-2">Waktu</th>
                  <th className="text-left p-2">Nama</th>
                  <th className="text-left p-2">UID</th>
                  <th className="text-left p-2">Jabatan</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Foto</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-b border-gray-800 hover:bg-[#222]">
                    <td className="p-2">{new Date(log.waktu).toLocaleString()}</td>
                    <td className="p-2">{log.user?.nama || "-"}</td>
                    <td className="p-2">{log.uid_rfid}</td>
                    <td className="p-2">{log.user?.jabatan || "-"}</td>
                    <td className={`p-2 font-semibold ${log.status === "granted" ? "text-green-500" : "text-red-500"}`}>
                      {log.status.toUpperCase()}
                    </td>
                    <td className="p-2">
                      {log.photo ? (
                        <button
                          onClick={() => setSelectedPhoto(log.photo)}
                          className="text-[#7A0C0C] underline"
                        >
                          Lihat
                        </button>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col sm:flex-row justify-between sm:justify-end mt-4 gap-3 items-center">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-4 py-1 rounded bg-gray-700 disabled:opacity-40"
            >
              Prev
            </button>
            <span className="text-sm text-gray-300">
              Page {page} / {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="px-4 py-1 rounded bg-gray-700 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>

        {/* MODALS */}
        <PhotoModal photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} />

        {pendingRFID && (
          <RegisterModal
            pending={pendingRFID}
            onClose={() => setPendingRFID(null)}
            onSuccess={() => {
              setPendingRFID(null);
              alert("RFID berhasil didaftarkan");
            }}
          />
        )}

        {alreadyRegistered && (
          <AlreadyRegisteredModal
            uid={alreadyRegistered.uid}
            onClose={async () => {
              await clearAlreadyRegistered();
              setAlreadyRegistered(null);
            }}
          />
        )}
      </div>
    </div>
  );
}