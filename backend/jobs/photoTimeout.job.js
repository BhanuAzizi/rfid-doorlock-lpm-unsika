const cron = require("node-cron");
const { Op } = require("sequelize");
const AccessLog = require("../models/AccessLog");

const startPhotoTimeoutJob = () => {
  // Jalankan tiap 1 menit
  cron.schedule("* * * * *", async () => {
    try {
      const [count] = await AccessLog.update(
        { photo_status: "failed" },
        {
          where: {
            photo_status: "pending",
            waktu: {
              [Op.lt]: new Date(Date.now() - 30 * 1000), // pending lebih dari 30 detik
            },
          },
        }
      );

      if (count > 0) {
        console.log(`[PhotoTimeout] ${count} log ditandai failed`);
      }
    } catch (err) {
      console.error("[PhotoTimeout Error]", err.message);
    }
  });

  console.log("[PhotoTimeout] Cron job started");
};

module.exports = startPhotoTimeoutJob;