const express = require("express");
const router = express.Router();

const upload = require("../config/upload");
const photoController = require("../controllers/photo.controller");

const { deviceAuth } = require("../middleware/deviceAuth");

// router.get("/trigger", deviceAuth, photoController.checkTrigger);
router.post("/upload", deviceAuth, photoController.uploadPhoto);

module.exports = router;
