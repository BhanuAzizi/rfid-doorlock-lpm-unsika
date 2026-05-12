import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      return alert("Username dan password wajib diisi");
    }

    try {
      setLoading(true);

      const res = await api.post("/api/auth/login", {
        username,
        password,
      });

      // simpan login
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);
      localStorage.setItem("username", res.data.user.username);

      navigate("/dashboard");
    } catch (err) {
      alert("Username atau password salah");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-black text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-[#111] p-8 rounded-xl w-80 border border-[#7A0C0C]"
      >
        <h2 className="text-xl font-bold text-center mb-6 text-[#7A0C0C]">
          Login Sistem
        </h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-4 px-4 py-2 rounded bg-black border border-gray-700"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 px-4 py-2 rounded bg-black border border-gray-700"
        />

        <button
          disabled={loading}
          className="w-full py-2 rounded bg-[#7A0C0C] hover:bg-red-800"
        >
          {loading ? "Loading..." : "Login"}
        </button>
      </form>
    </div>
  );
}
