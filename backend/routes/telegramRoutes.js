const express = require("express");
const { requireClerkAuth, attachCurrentUser } = require("../middleware/authMiddleware");
const { getTelegramStatus, sendTestMessage } = require("../controllers/telegramController");

const router = express.Router();

router.get("/status", requireClerkAuth, attachCurrentUser, getTelegramStatus);
router.post("/send-test", requireClerkAuth, attachCurrentUser, sendTestMessage);

module.exports = router;
