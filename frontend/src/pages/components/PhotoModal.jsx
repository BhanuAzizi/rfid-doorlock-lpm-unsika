export default function PhotoModal({ photo, onClose }) {
  if (!photo) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">

      <div className="bg-[#1a1a1a] p-6 rounded-xl border border-[#7A0C0C] w-[500px]">

        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Foto Akses</h3>

          <button
            onClick={onClose}
            className="text-red-500 font-bold text-xl"
          >
            ×
          </button>
        </div>

        <img
          src={`http://localhost:3000/uploads/${photo}`}
          alt="access"
          className="rounded w-full border"
        />

      </div>
    </div>
  );
}
