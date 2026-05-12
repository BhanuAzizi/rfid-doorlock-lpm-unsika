const AccessLog = require("../models/AccessLog");
const fs = require("fs");
const path = require("path");
const { Op } = require("sequelize");

const UPLOAD_DIR = path.join(__dirname, "../uploads");

exports.uploadPhoto = async (req, res) => {
  try {
    const device = req.query.device || "ESP32_REDAKSI";

    if (!req.body || req.body.length === 0) {
      return res.status(400).json({ message: "Photo data missing" });
    }

    // ✅ Pastikan folder uploads ada
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }

    // ✅ Hanya ambil log dalam 30 detik terakhir
    const log = await AccessLog.findOne({
      where: {
        device,
        photo: null,
        photo_status: "pending",
        waktu: {
          [Op.gte]: new Date(Date.now() - 30 * 1000),
        },
      },
      order: [["id", "DESC"]],
    });

    if (!log) {
      return res.status(404).json({ message: "No pending access log found" });
    }

    const filename = `access_${log.id}_${Date.now()}.jpg`;
    const filePath = path.join(UPLOAD_DIR, filename);

    // ✅ Reserve dulu di DB sebelum tulis file
    const [updated] = await AccessLog.update(
      { photo_status: "uploaded", photo: filename },
      {
        where: {
          id: log.id,
          photo_status: "pending",
        },
      }
    );

    if (updated === 0) {
      return res.status(409).json({ message: "Log sudah diproses oleh request lain" });
    }

    fs.writeFileSync(filePath, req.body);

    return res.status(200).json({
      success: true,
      log_id: log.id,
      photo: filename,
    });

  } catch (err) {
    console.error("[uploadPhoto Error]", {
      message: err.message,
      stack: err.stack,
      timestamp: new Date().toISOrise(),
    });

    return res.status(500).json({
      message: "Upload failed",
      error: err.message,
    });
  }
};