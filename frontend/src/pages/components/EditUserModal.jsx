import { useEffect, useState } from "react";

export default function EditUserModal({ user, onClose, onSave }) {
  const [nama, setNama] = useState(user.nama);
  const [jabatan, setJabatan] = useState(user.jabatan || "");
  const [status, setStatus] = useState(user.status);
  const [loading, setLoading] = useState(false);
  const [closing, setClosing] = useState(false);

  const closeModal = () => {
    setClosing(true);
    setTimeout(onClose, 200);
  };

  // ESC to close
  useEffect(() => {
    const esc = (e) => e.key === "Escape" && closeModal();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, []);

  const submit = async () => {
    if (loading) return;
    setLoading(true);

    try {
      await onSave({
        id: user.id,
        nama,
        jabatan,
        status,
      });
      closeModal();
    } catch {
      // error ditangani parent (toast)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={closeModal} // backdrop click
      className={`fixed inset-0 z-50 flex items-center justify-center
        bg-black/70 transition-opacity duration-200
        ${closing ? "opacity-0" : "opacity-100"}`}
    >
      <div
        onClick={(e) => e.stopPropagation()} // cegah close saat klik modal
        className={`bg-[#1a1a1a] p-6 rounded-xl w-96 border border-[#7A0C0C]
          transform transition-all duration-200
          ${closing ? "scale-95 opacity-0" : "scale-100 opacity-100"}`}
      >
        <h3 className="text-lg font-semibold mb-4">Edit User</h3>

        <input
          className="w-full mb-3 p-2 bg-black border border-gray-700 rounded"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          disabled={loading}
        />

        <input
          className="w-full mb-3 p-2 bg-black border border-gray-700 rounded"
          value={jabatan}
          onChange={(e) => setJabatan(e.target.value)}
          disabled={loading}
        />

        <select
          className="w-full mb-4 p-2 bg-black border border-gray-700 rounded"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          disabled={loading}
        >
          <option value="aktif">Aktif</option>
          <option value="nonaktif">Nonaktif</option>
        </select>

        <div className="flex justify-end gap-3">
          <button
            onClick={closeModal}
            disabled={loading}
            className="text-gray-400 hover:text-white disabled:opacity-40"
          >
            Batal
          </button>

          <button
            onClick={submit}
            disabled={loading}
            className={`px-4 py-2 rounded font-semibold transition
              ${
                loading
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-[#7A0C0C] hover:bg-[#9A0F0F]"
              }`}
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}
