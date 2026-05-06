const asyncHandler = require("../middleware/asyncHandler");
const { sendTelegramMessage } = require("../services/telegramService");
const env = require("../config/env");

const getTelegramStatus = asyncHandler(async (req, res) => {
  res.json({
    connected: Boolean(req.user.telegramChatId || env.telegramChatId),
    chatId: req.user.telegramChatId || env.telegramChatId || null
  });
});

const sendTestMessage = asyncHandler(async (req, res) => {
  const message =
    req.body.message ||
    `DailySync Test

Telegram integration is connected successfully.

You will receive:
- morning summaries
- deadline alerts
- task reminders`;
  const response = await sendTelegramMessage(req.user, message);
  res.json({ message: "Telegram message sent", response });
});

module.exports = { getTelegramStatus, sendTestMessage };
