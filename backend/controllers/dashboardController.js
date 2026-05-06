const asyncHandler = require("../middleware/asyncHandler");
const { getDashboardSnapshot } = require("../services/dashboardService");
const env = require("../config/env");

const getDashboard = asyncHandler(async (req, res) => {
  const snapshot = await getDashboardSnapshot(req.user._id);

  res.json({
    ...snapshot,
    integrations: {
      telegramConnected: Boolean(req.user.telegramChatId || env.telegramChatId)
    }
  });
});

module.exports = { getDashboard };
