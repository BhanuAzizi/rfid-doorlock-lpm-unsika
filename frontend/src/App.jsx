import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/login/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import Users from "./pages/users/Users";
import Accounts from "./pages/accounts/Accounts";

import ProtectedRoute from "./pages/components/ProtectedRoute";

export default function App() {
  return (
    <Routes>

      {/* LOGIN */}
      <Route path="/login" element={<Login />} />

      {/* DEFAULT */}
      <Route path="/" element={<Navigate to="/dashboard" />} />

      {/* DASHBOARD */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* USERS — ADMIN */}
      <Route
        path="/users"
        element={
          <ProtectedRoute role="admin">
            <Users />
          </ProtectedRoute>
        }
      />

      {/* ACCOUNTS — ADMIN */}
      <Route
        path="/accounts"
        element={
          <ProtectedRoute role="admin">
            <Accounts />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}
