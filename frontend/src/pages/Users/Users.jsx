import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import EditUserModal from "../components/EditUserModal";
import { getUsers, updateUser, deleteUser } from "../../services/api";
import Toast from "../components/Toast";

export default function Users() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [totalUser, setTotalUser] = useState(0);
  const [toast, setToast] = useState(null);
  const [deleteUserId, setDeleteUserId] = useState(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  const loadUsers = async () => {
    const res = await getUsers({
      search,
      page,
      limit: 10,
    });

    setUsers(res.data.data);
    setTotalPage(res.data.pagination.totalPage);
    setTotalUser(res.data.pagination.total);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    loadUsers();
  }, [page]);

  useEffect(() => {
    const delay = setTimeout(() => {
      setPage(1);
      loadUsers();
    }, 500);

    return () => clearTimeout(delay);
  }, [search]);

  const handleDelete = (id) => {
    setDeleteUserId(id);
  };
  const confirmDelete = async () => {
    try {
      await deleteUser(deleteUserId);

      setToast({
        type: "success",
        message: "User berhasil dihapus",
      });

      setDeleteUserId(null);

      loadUsers();
    } catch {
      setToast({
        type: "error",
        message: "Gagal menghapus user",
      });
    }
  };

  return (
    <div className="flex bg-black min-h-screen text-white w-full max-w-full overflow-x-hidden">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <div className="flex-1 md:ml-64 p-4 sm:p-6 md:p-8 min-w-0 flex flex-col overflow-x-hidden">
        <Header setSidebarOpen={setSidebarOpen} />

        <div className="flex-1 w-full">
          <div className="bg-[#141414] w-full max-w-full p-4 sm:p-5 md:p-6 rounded-2xl border border-[#7A0C0C]/60 shadow-lg overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
              <h2 className="text-lg font-semibold tracking-wide">
                User Management
              </h2>

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari nama..."
                className="bg-black border border-gray-700 px-4 py-2 rounded-lg w-full sm:w-64"
              />
            </div>
            <p className="text-sm text-gray-400 mb-2">
              Total User:{" "}
              <span className="text-white font-semibold">{totalUser}</span>
            </p>

            {/* DESKTOP TABLE */}
            {/* DESKTOP TABLE */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-700">
                    <th className="text-left py-3 px-3">Nama</th>
                    <th className="text-left py-3 px-3">UID</th>
                    <th className="text-left py-3 px-3">Jabatan</th>
                    <th className="text-center py-3 px-3">Status</th>
                    <th className="text-center py-3 px-3">Aksi</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b border-gray-800">
                      <td className="py-4 px-3">{u.nama}</td>

                      <td className="py-4 px-3">{u.uid_rfid}</td>

                      <td className="py-4 px-3">{u.jabatan || "-"}</td>

                      <td className="py-4 px-3 text-center">
                        {u.status.toUpperCase()}
                      </td>

                      <td className="py-4 px-3">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => setEditUser(u)}
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-md text-xs font-semibold transition"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(u.id)}
                            className="px-3 py-1 bg-red-700 hover:bg-red-800 rounded-md text-xs font-semibold transition"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* MOBILE CARD */}
            <div className="md:hidden space-y-3 mt-4">
              {users.map((u) => (
                <div
                  key={u.id}
                  className="bg-[#1a1a1a] p-4 rounded-xl border border-gray-800"
                >
                  <div className="font-semibold mb-2">{u.nama}</div>

                  <div className="text-sm">UID: {u.uid_rfid}</div>

                  <div className="text-sm">Jabatan: {u.jabatan || "-"}</div>

                  <div className="text-sm">
                    Status: {u.status.toUpperCase()}
                  </div>

                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => setEditUser(u)}
                      className="flex-1 bg-blue-600 py-2 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(u.id)}
                      className="flex-1 bg-red-600 py-2 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-4 py-2 bg-[#7A0C0C] rounded disabled:opacity-40"
              >
                Prev
              </button>

              <span className="text-sm text-gray-400">
                Page {page} of {totalPage}
              </span>

              <button
                disabled={page === totalPage}
                onClick={() => setPage(page + 1)}
                className="px-4 py-2 bg-[#7A0C0C] rounded disabled:opacity-40"
              >
                Next
              </button>
            </div>

            {editUser && (
              <EditUserModal
                user={editUser}
                onClose={() => setEditUser(null)}
                onSave={async (updatedUser) => {
                  try {
                    await updateUser(updatedUser.id, updatedUser);
                    setToast({
                      type: "success",
                      message: "User berhasil diperbarui",
                    });
                    setEditUser(null);
                    loadUsers();
                  } catch {
                    setToast({
                      type: "error",
                      message: "Gagal memperbarui user",
                    });
                    throw new Error(); // biar modal tau gagal
                  }
                }}
              />
            )}
            {toast && (
              <Toast
                type={toast.type}
                message={toast.message}
                onClose={() => setToast(null)}
              />
            )}
          </div>
        </div>
      </div>
      {deleteUserId && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-backdrop">
          <div className="bg-[#141414] border border-[#7A0C0C] rounded-xl p-6 w-[90%] max-w-sm text-center animate-modal">
            {/* ICON */}
            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-yellow-500/20 text-yellow-400 text-3xl">
              ?
            </div>

            {/* TEXT */}
            <h3 className="text-lg font-semibold mb-2">Konfirmasi Hapus</h3>

            <p className="text-gray-400 text-sm mb-6">
              Apakah Anda benar-benar ingin menghapus user ini?
            </p>

            {/* BUTTON */}
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteUserId(null)}
                className="flex-1 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition"
              >
                Batal
              </button>

              <button
                onClick={confirmDelete}
                className="flex-1 py-2 rounded-lg bg-red-700 hover:bg-red-800 transition"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
