import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);


/* ================= DEVICE ================= */

export const getDeviceMode = () => {
  return api.get("/api/device/mode");
};

export const setDeviceMode = (mode) => {
  return api.post("/api/device/mode", { mode });
};

/* ================= LOG ================= */

export const getAccessLogs = ({
  page = 1,
  limit = 10,
  search = "",
  startDate = "",
  endDate = "",
}) => {
  return api.get("/api/logs", {
    params: {
      page,
      limit,
      search,
      startDate,
      endDate,
    },
  });
};

/* ================= USERS ================= */

export const getUsers = ({ search = "", page = 1, limit = 10 }) => {
  return api.get("/api/users", {
    params: {
      search,
      page,
      limit,
    },
  });
};

export const updateUser = (id, data) => {
  return api.put(`/api/users/${id}`, data);
};

export const deleteUser = (id) => {
  return api.delete(`/api/users/${id}`);
};

/* ================= RFID ================= */

export const getPendingRFID = () => {
  return api.get("/api/rfid/pending/latest");
};

export const confirmRFID = (data) => {
  return api.post("/api/rfid/confirm", data);
};

export const cancelPendingRFID = (id) => {
  return api.delete(`/api/rfid/pending/${id}`);
};

export const getAlreadyRegistered = () =>
  api.get("/api/access/rfid/already-registered");

export const clearAlreadyRegistered = () =>
  api.post("/api/access/rfid/already-registered/clear");

/* ================= ACCOUNT ================= */
export const getAccounts = () => api.get("/api/accounts");

export const createAccount = (data) =>
  api.post("/api/accounts", data);

export const updateAccountRole = (id, data) =>
  api.put(`/api/accounts/${id}/role`, data);

export const resetAccountPassword = (id, data) =>
  api.put(`/api/accounts/${id}/password`, data);

export const deleteAccount = (id) =>
  api.delete(`/api/accounts/${id}`);


export default api;
