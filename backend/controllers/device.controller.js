const DeviceStatus = require("../models/DeviceStatus");

/*
  GET MODE DEVICE
  digunakan oleh ESP32
*/
exports.getMode = async (req, res) => {
  try {
    const device = await DeviceStatus.findOne({
      where: { device_name: "ESP32_REDAKSI" }
    });

    if (!device) {
      return res.status(404).json({
        message: "Device not found"
      });
    }

    res.status(200).json({
      mode: device.mode
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get device mode",
      error: error.message
    });
  }
};

/*
  UPDATE MODE DEVICE
  digunakan oleh web admin
*/
exports.updateMode = async (req, res) => {
  try {
    const { mode } = req.body;

    if (!mode || !["akses", "daftar"].includes(mode)) {
      return res.status(400).json({
        message: "Invalid mode value"
      });
    }

    const device = await DeviceStatus.findOne({
      where: { device_name: "ESP32_REDAKSI" }
    });

    if (!device) {
      return res.status(404).json({
        message: "Device not found"
      });
    }

    device.mode = mode;
    await device.save();

    res.status(200).json({
      message: "Device mode updated",
      mode: device.mode
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update device mode",
      error: error.message
    });
  }
};
