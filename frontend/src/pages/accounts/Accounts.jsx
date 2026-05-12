import { useEffect, useState } from "react";
import {
  getAccounts,
  createAccount,
  updateAccountRole,
  resetAccountPassword,
  deleteAccount,
} from "../../services/api";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [resetId, setResetId] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const currentUsername = localStorage.getItem("username");

  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "viewer",
  });

  const loadAccounts = async () => {
    const res = await getAccounts();
    setAccounts(res.data);
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  const handleAdd = async () => {
    await createAccount(form);
    setForm({ username: "", password: "", role: "viewer" });
    setShowAdd(false);
    loadAccounts();
  };

  const changeRole = async (id, role) => {
    await updateAccountRole(id, { role });
    loadAccounts();
  };

  const resetPassword = (id) => {
    setResetId(id);
  };

  const confirmResetPassword = async () => {
    await resetAccountPassword(resetId, {
      password: newPassword,
    });

    setResetId(null);
    setNewPassword("");

    alert("Password berhasil direset");
  };

  const remove = (id) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    await deleteAccount(deleteId);
    setDeleteId(null);
    loadAccounts();
  };

  return (
    <div className="flex bg-black min-h-screen text-white w-full overflow-x-hidden">
      {/* SIDEBAR */}
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* MAIN */}
      <div className="flex-1 md:ml-64 p-4 sm:p-6 md:p-8 min-w-0">
        <Header setSidebarOpen={setSidebarOpen} />

        <div className="bg-[#1a1a1a] p-4 sm:p-5 md:p-6 rounded-xl border border-[#7A0C0C]">
          {/* HEADER */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
            <h2 className="text-lg font-semibold">Account Management</h2>

            <button
              onClick={() => setShowAdd(true)}
              className="bg-[#7A0C0C] px-4 py-2 rounded w-full sm:w-auto"
            >
              + Add Account
            </button>
          </div>

          {/* DESKTOP TABLE */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 border-b border-gray-700">
                  <th className="p-3 text-left">Username</th>
                  <th className="p-3 text-left">Role</th>
                  <th className="p-3 text-left">Action</th>
                </tr>
              </thead>

              <tbody>
                {accounts.map((a) => (
                  <tr key={a.id} className="border-b border-gray-800">
                    <td className="p-3">{a.username}</td>

                    <td className="p-3">
                      <select
                        value={a.role}
                        onChange={(e) => changeRole(a.id, e.target.value)}
                        className="bg-black border px-3 py-1 rounded"
                      >
                        <option value="admin">admin</option>
                        <option value="viewer">viewer</option>
                      </select>
                    </td>

                    <td className="p-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => a.username === currentUsername && resetPassword(a.id)}
                          disabled={a.username !== currentUsername}
                          className={`px-3 py-1 rounded transition ${
                            a.username === currentUsername
                              ? "bg-blue-700 hover:bg-blue-800 cursor-pointer"
                              : "bg-gray-700 text-gray-500 cursor-not-allowed opacity-50"
                          }`}
                        >
                          Reset
                        </button>

                        {a.username !== currentUsername && (
                          <button
                            onClick={() => remove(a.id)}
                            className="px-3 py-1 bg-red-700 hover:bg-red-800 rounded transition"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARD */}
          <div className="md:hidden space-y-3 mt-4">
            {accounts.map((a) => (
              <div
                key={a.id}
                className="bg-[#141414] p-4 rounded-xl border border-gray-800"
              >
                <div className="font-semibold mb-3">{a.username}</div>

                <div className="mb-3">
                  <div className="text-sm text-gray-400 mb-1">Role</div>

                  <select
                    value={a.role}
                    onChange={(e) => changeRole(a.id, e.target.value)}
                    className="w-full bg-black border px-3 py-2 rounded"
                  >
                    <option value="admin">admin</option>
                    <option value="viewer">viewer</option>
                  </select>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => a.username === currentUsername && resetPassword(a.id)}
                    disabled={a.username !== currentUsername}
                    className={`flex-1 py-2 rounded transition ${
                      a.username === currentUsername
                        ? "bg-blue-700 hover:bg-blue-800 cursor-pointer"
                        : "bg-gray-700 text-gray-500 cursor-not-allowed opacity-50"
                    }`}
                  >
                    Reset
                  </button>

                  {a.username !== currentUsername && (
                    <button
                      onClick={() => remove(a.id)}
                      className="flex-1 py-2 bg-red-700 hover:bg-red-800 rounded transition"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* ADD MODAL */}
          {showAdd && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
              <div className="bg-[#111] p-6 rounded-xl w-[90%] max-w-sm border border-[#7A0C0C]">
                <h3 className="mb-4 font-semibold">Add Account</h3>

                <input
                  placeholder="Username"
                  className="w-full mb-3 px-3 py-2 bg-black border rounded"
                  value={form.username}
                  onChange={(e) =>
                    setForm({ ...form, username: e.target.value })
                  }
                />

                <input
                  placeholder="Password"
                  type="password"
                  className="w-full mb-3 px-3 py-2 bg-black border rounded"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />

                <select
                  className="w-full mb-4 bg-black border px-3 py-2 rounded"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  <option value="viewer">viewer</option>
                  <option value="admin">admin</option>
                </select>

                <div className="flex gap-2">
                  <button
                    onClick={() => setShowAdd(false)}
                    className="flex-1 py-2 bg-gray-600 rounded"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleAdd}
                    className="flex-1 py-2 bg-[#7A0C0C] rounded"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {deleteId && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div
            className="bg-[#141414] border border-red-700 rounded-xl p-6 w-[90%] max-w-sm text-center
                    animate-[fadeIn_.2s_ease]"
          >
            <div
              className="w-16 h-16 mx-auto mb-4 flex items-center justify-center
                      rounded-full bg-red-700/20 text-red-500 text-3xl"
            >
              🗑
            </div>

            <h3 className="text-lg font-semibold mb-2">Hapus Account</h3>

            <p className="text-gray-400 mb-6">
              Apakah Anda yakin ingin menghapus akun ini?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2 bg-gray-700 rounded hover:bg-gray-600 transition"
              >
                Batal
              </button>

              <button
                onClick={confirmDelete}
                className="flex-1 py-2 bg-red-700 rounded hover:bg-red-800 transition"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {resetId && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div
            className="bg-[#141414] border border-blue-700 rounded-xl p-6 w-[90%] max-w-sm
                    animate-[fadeIn_.2s_ease]"
          >
            <div
              className="w-16 h-16 mx-auto mb-4 flex items-center justify-center
                      rounded-full bg-blue-700/20 text-blue-400 text-3xl"
            >
              🔒
            </div>

            <h3 className="text-lg font-semibold mb-4 text-center">
              Reset Password
            </h3>

            <input
              type="password"
              placeholder="Password baru"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 bg-black border border-gray-700 rounded mb-4"
            />

            <div className="flex gap-3">
              <button
                onClick={() => setResetId(null)}
                className="flex-1 py-2 bg-gray-700 rounded hover:bg-gray-600"
              >
                Batal
              </button>

              <button
                onClick={confirmResetPassword}
                className="flex-1 py-2 bg-blue-700 rounded hover:bg-blue-800"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}