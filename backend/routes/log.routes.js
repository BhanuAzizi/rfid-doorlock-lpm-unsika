const express = require("express");
const router = express.Router();

const logController = require("../controllers/log.controller");

const { auth } = require("../middleware/auth");


router.get("/", auth, logController.getAccessLogs);

module.exports = router;
