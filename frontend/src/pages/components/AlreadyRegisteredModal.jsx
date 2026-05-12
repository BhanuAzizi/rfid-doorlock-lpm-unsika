export default function AlreadyRegisteredModal({ uid, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
      <div className="bg-[#111] border border-[#7A0C0C] rounded-xl w-full max-w-[380px] p-4 sm:p-6">

        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#2a0a0a] flex items-center justify-center flex-shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="#E24B4A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              className="sm:w-5 sm:h-5">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <div>
            <p className="text-white font-semibold text-sm sm:text-base">Kartu sudah terdaftar</p>
            <p className="text-gray-500 text-xs mt-0.5">Kartu ditolak</p>
          </div>
        </div>

        <div className="bg-[#0a0a0a] border border-gray-800 rounded-lg px-3 sm:px-4 py-3 mb-4">
          <p className="text-[10px] text-gray-600 uppercase tracking-widest mb-1">UID Terdeteksi</p>
          <p className="font-mono text-[#E24B4A] text-xs sm:text-sm tracking-widest break-all">{uid}</p>
        </div>

        <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-5">
          Kartu dengan UID ini sudah terdaftar sebagai pengguna aktif dalam sistem.
          Tidak dapat didaftarkan ulang.
        </p>

        <button
          onClick={onClose}
          className="w-full py-2.5 sm:py-3 bg-[#7A0C0C] hover:bg-red-700 active:bg-red-800 rounded-lg text-white text-sm font-semibold transition-colors"
        >
          Mengerti
        </button>
      </div>
    </div>
  );
}