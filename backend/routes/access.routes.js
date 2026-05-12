const express = require("express");
const router = express.Router();

const accessController = require("../controllers/access.controller");
const { deviceAuth } = require("../middleware/deviceAuth");

//router.post("/rfid/scan", accessController.scanRFID);
router.post("/rfid/scan", deviceAuth, accessController.scanRFID);
router.get("/rfid/already-registered", accessController.getAlreadyRegistered);
router.post(
  "/rfid/already-registered/clear",
  accessController.clearAlreadyRegistered,
);

module.exports = router;
