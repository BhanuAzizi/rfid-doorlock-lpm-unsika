import { useState } from "react";
import { confirmRFID, cancelPendingRFID } from "../../services/api";

export default function RegisterModal({ pending, onClose, onSuccess }) {
  const [nama, setNama] = useState("");
  const [jabatan, setJabatan] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!nama) return alert("Nama wajib diisi");
    if (!jabatan) return alert("Jabatan wajib diisi");

    try {
      setLoading(true);

      await confirmRFID({
        pending_id: pending.pending_id, // ✅ FIX
        nama,
        jabatan,
      });

      onSuccess();
    } catch (err) {
      const message =
        err.response?.data?.message || "Gagal daftar";

      alert(message);

      if (
        message.toLowerCase().includes("sudah terdaftar") ||
        message.toLowerCase().includes("already")
      ) {
        onClose();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    try {
      await cancelPendingRFID(pending.pending_id); // ✅ FIX
      onClose();
    } catch {
      alert("Gagal membatalkan pendaftaran");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#111] border border-[#7A0C0C] rounded-xl w-[420px] p-6">
        <h2 className="text-xl font-bold mb-2 text-white">
          Registrasi Kartu RFID
        </h2>

        <p className="text-sm text-gray-400 mb-4">
          UID terdeteksi:
          <span className="block text-red-500 font-mono mt-1">
            {pending.uid} {/* ✅ FIX */}
          </span>
        </p>

        <div className="space-y-4">
          <input
            placeholder="Nama Lengkap"
            className="w-full p-3 bg-black border border-gray-700 rounded text-white"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
          />

          <input
            placeholder="Jabatan"
            className="w-full p-3 bg-black border border-gray-700 rounded text-white"
            value={jabatan}
            onChange={(e) => setJabatan(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
          >
            Batal
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2 bg-[#7A0C0C] hover:bg-red-700 rounded text-white font-semibold"
          >
            {loading ? "Menyimpan..." : "Daftarkan"}
          </button>
        </div>
      </div>
    </div>
  );
}
