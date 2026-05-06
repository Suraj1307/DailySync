const asyncHandler = require("../middleware/asyncHandler");
const { sendMorningSummaries, sendDeadlineAlerts } = require("../services/reminderService");

const runMorningSummary = asyncHandler(async (req, res) => {
  await sendMorningSummaries();
  res.json({ message: "Morning summaries sent" });
});

const runDeadlineAlerts = asyncHandler(async (req, res) => {
  await sendDeadlineAlerts();
  res.json({ message: "Deadline alerts processed" });
});

module.exports = { runMorningSummary, runDeadlineAlerts };
