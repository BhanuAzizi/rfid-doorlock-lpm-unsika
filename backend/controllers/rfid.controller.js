const User = require("../models/User");
const DeviceStatus = require("../models/DeviceStatus");
const Pending = require("../models/PendingRegistration");

/*
  CONFIRM REGISTRATION
  dipanggil dari frontend (popup)
*/
exports.confirmRFID = async (req, res) => {
  try {
    const { pending_id, nama, jabatan } = req.body;

    if (!pending_id || !nama) {
      return res.status(400).json({
        success: false,
        message: "Data belum lengkap",
      });
    }

    const pending = await Pending.findByPk(pending_id);

    if (!pending) {
      return res.status(404).json({
        success: false,
        message: "Data pending tidak ditemukan",
      });
    }

    const exists = await User.findOne({
      where: { uid_rfid: pending.uid_rfid },
    });

    if (exists) {
      await pending.destroy();
      return res.status(409).json({
        success: false,
        message: "UID sudah terdaftar",
      });
    }

    const user = await User.create({
      nama,
      uid_rfid: pending.uid_rfid,
      jabatan,
      status: "aktif",
    });

    await DeviceStatus.update(
      { mode: "akses" },
      { where: { device_name: pending.device } }
    );

    await pending.destroy();

    res.status(201).json({
      success: true,
      message: "RFID berhasil didaftarkan",
      data: user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Gagal konfirmasi RFID",
      error: err.message,
    });
  }
};


/*
  GET LATEST PENDING RFID
  digunakan frontend untuk polling
*/
exports.getLatestPending = async (req, res) => {
  try {
    const pending = await Pending.findOne({
      order: [["id", "DESC"]],
    });

    if (!pending) {
      return res.json({ found: false });
    }

    return res.json({
      found: true,
      pending,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed get pending RFID",
      error: error.message,
    });
  }
};

exports.cancelPendingRFID = async (req, res) => {
  try {
    const { id } = req.params;

    const pending = await Pending.findByPk(id);

    if (!pending) {
      return res.status(404).json({
        success: false,
        message: "Pending RFID tidak ditemukan",
      });
    }

    await pending.destroy();

    return res.status(200).json({
      success: true,
      message: "Pendaftaran RFID dibatalkan",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Gagal membatalkan pendaftaran",
      error: error.message,
    });
  }
};