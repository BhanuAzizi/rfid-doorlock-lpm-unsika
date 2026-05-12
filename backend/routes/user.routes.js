const express = require("express");
const router = express.Router();
const controller = require("../controllers/user.controller");

const { auth } = require("../middleware/auth");
const { onlyAdmin } = require("../middleware/role");

// admin only
router.get("/", auth, onlyAdmin, controller.getUsers);
router.put("/:id", auth, onlyAdmin, controller.updateUser);
router.delete("/:id", auth, onlyAdmin, controller.deleteUser);

module.exports = router;
