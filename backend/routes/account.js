const express = require("express");
const router = express.Router();
const controller = require("../controllers/account.controller");

const { auth } = require("../middleware/auth");
const { onlyAdmin } = require("../middleware/role");

router.get("/", auth, onlyAdmin, controller.getAccounts);
router.post("/", auth, onlyAdmin, controller.createAccount);
router.put("/:id/role", auth, onlyAdmin, controller.updateRole);
router.put("/:id/password", auth, onlyAdmin, controller.resetPassword);
router.delete("/:id", auth, onlyAdmin, controller.deleteAccount);

module.exports = router;
