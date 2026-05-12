const express = require("express");
const router = express.Router();

const deviceController = require("../controllers/device.controller");

const { auth } = require("../middleware/auth");
const { onlyAdmin } = require("../middleware/role");


router.get("/mode", auth, deviceController.getMode);
router.post("/mode", auth, onlyAdmin, deviceController.updateMode);

module.exports = router;
