const express = require("express");
const router = express.Router();

const rfidController = require("../controllers/rfid.controller");

const { auth } = require("../middleware/auth");
const { onlyAdmin } = require("../middleware/role");

// admin konfirmasi RFID
router.post("/confirm", auth, onlyAdmin, rfidController.confirmRFID);

// admin lihat pending RFID terbaru
router.get("/pending/latest", auth, onlyAdmin, rfidController.getLatestPending);

// admin batalkan RFID
router.delete("/pending/:id", auth, onlyAdmin, rfidController.cancelPendingRFID);

module.exports = router;
