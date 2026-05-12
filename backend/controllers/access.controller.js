const User = require("../models/User");
const AccessLog = require("../models/AccessLog");
const DeviceStatus = require("../models/DeviceStatus");
const RFIDPending = require("../models/PendingRegistration");

// Normalisasi UID: hapus spasi, uppercase, pad tiap byte jadi 2 digit
// Contoh: "1 27 1E 2"   → "01271E02"
//         "8D A4 F1 C3" → "8DA4F1C3"
function normalizeUID(uid) {
  return uid
    .trim()
    .split(/\s+/)
    .map((byte) => byte.toUpperCase().padStart(2, "0"))
    .join("");
}

let lastAlreadyRegistered = null;
// Setelah normalisasi, UID harus tepat 8 karakter hex (4 byte)
const UID_REGEX = /^[A-F0-9]{8}$/;

exports.scanRFID = async (req, res) => {
  try {
    const { uid, device } = req.body;

    // =====================
    // VALIDASI INPUT
    // =====================
    if (!uid) {
      return res.status(400).json({
        success: false,
        message: "UID wajib dikirim",
      });
    }

    const normalizedUID = normalizeUID(uid);

    if (!UID_REGEX.test(normalizedUID)) {
      return res.status(400).json({
        success: false,
        message: "Format UID tidak valid",
      });
    }

    const deviceName = device || "ESP32_REDAKSI";

    // =====================
    // VALIDASI DEVICE
    // =====================
    const deviceStatus = await DeviceStatus.findOne({
      where: { device_name: deviceName },
    });

    if (!deviceStatus) {
      return res.status(404).json({
        success: false,
        message: "Device tidak ditemukan",
      });
    }

    // =====================
    // VALIDASI MODE DEVICE
    // =====================
    const validModes = ["daftar", "akses"];
    if (!validModes.includes(deviceStatus.mode)) {
      return res.status(400).json({
        success: false,
        message: `Mode device tidak valid: ${deviceStatus.mode}`,
      });
    }

    // =====================
    // MODE DAFTAR
    // =====================
    if (deviceStatus.mode === "daftar") {
      const [existingUser, existingPending] = await Promise.all([
        User.findOne({ where: { uid_rfid: normalizedUID } }),
        RFIDPending.findOne({ where: { uid_rfid: normalizedUID } }),
      ]);

      if (existingUser) {
        lastAlreadyRegistered = { uid: normalizedUID, timestamp: Date.now() };
        return res.status(409).json({
          success: false,
          message: "Kartu sudah terdaftar sebagai pengguna aktif",
          uid: normalizedUID,
        });
      }

      if (existingPending) {
        return res.status(409).json({
          success: false,
          message: "Kartu sudah dalam antrian pendaftaran",
          pending_id: existingPending.id,
        });
      }

      const pending = await RFIDPending.create({
        uid_rfid: normalizedUID,
        device: deviceName,
      });

      return res.status(200).json({
        success: true,
        mode: "daftar",
        pending_id: pending.id,
        uid: normalizedUID,
      });
    }

    // MODE AKSES
    const user = await User.findOne({
      where: {
        uid_rfid: normalizedUID,
        status: "aktif",
      },
    });

    const status = user ? "granted" : "denied";

    const log = await AccessLog.create({
      user_id: user ? user.id : null,
      uid_rfid: normalizedUID,
      status,
      photo: null,
      device: deviceName,
      photo_status: "pending", // ✅ hapus need_photo, cukup ini
    });

    return res.status(200).json({
      success: true,
      mode: "akses",
      status,
      log_id: log.id,
      user: user
        ? {
            id: user.id,
            nama: user.nama,
          }
        : null,
    });
  } catch (err) {
    console.error("[scanRFID Error]", {
      message: err.message,
      stack: err.stack,
      timestamp: new Date().toISOString(),
    });

    return res.status(500).json({
      success: false,
      message: "RFID scan gagal",
      error: err.message,
    });
  }
};

exports.getAlreadyRegistered = (req, res) => {
  if (!lastAlreadyRegistered) return res.json({ found: false });

  if (Date.now() - lastAlreadyRegistered.timestamp > 10000) {
    lastAlreadyRegistered = null;
    return res.json({ found: false });
  }

  return res.json({ found: true, uid: lastAlreadyRegistered.uid });
};

exports.clearAlreadyRegistered = (req, res) => {
  lastAlreadyRegistered = null;
  return res.json({ success: true });
};
