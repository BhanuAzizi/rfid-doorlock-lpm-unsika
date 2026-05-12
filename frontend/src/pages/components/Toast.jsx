export default function Toast({ type = "success", message, onClose }) {
  return (
    <div
      className={`fixed top-5 right-5 z-[999] px-4 py-3 rounded-lg shadow-lg
        text-sm font-semibold animate-slide-in
        ${
          type === "success"
            ? "bg-green-600/90 text-white"
            : "bg-red-600/90 text-white"
        }`}
    >
      {message}
      <button
        onClick={onClose}
        className="ml-4 text-xs opacity-80 hover:opacity-100"
      >
        ✕
      </button>
    </div>
  );
}
