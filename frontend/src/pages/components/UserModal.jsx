import { useState } from "react";
import { createUser } from "../../services/api";

export default function UserModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    nama: "",
    uid_rfid: "",
    jabatan: "",
  });

  const submit = async () => {
    await createUser(form);
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
      <div className="bg-[#1a1a1a] p-6 w-96 rounded-xl border border-[#7A0C0C]">
        <h3 className="text-lg mb-4">Tambah User RFID</h3>

        <input
          placeholder="Nama"
          className="input"
          onChange={(e) =>
            setForm({ ...form, nama: e.target.value })
          }
        />

        <input
          placeholder="UID RFID"
          className="input mt-3"
          onChange={(e) =>
            setForm({ ...form, uid_rfid: e.target.value })
          }
        />

        <input
          placeholder="Jabatan"
          className="input mt-3"
          onChange={(e) =>
            setForm({ ...form, jabatan: e.target.value })
          }
        />

        <div className="flex justify-end gap-3 mt-5">
          <button onClick={onClose}>Batal</button>
          <button
            onClick={submit}
            className="bg-[#7A0C0C] px-4 py-2 rounded"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
