const Task = require("../models/Task");
const User = require("../models/User");
const { startOfDay, endOfDay } = require("../utils/date");
const { sendTelegramMessage, buildMorningSummary } = require("./telegramService");

const getLocalDateParts = (date, timezone) => {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23"
  });

  return Object.fromEntries(
    formatter
      .formatToParts(date)
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value])
  );
};

const getLocalDateKey = (date, timezone) => {
  if (!date) return null;
  const parts = getLocalDateParts(date, timezone);
  return `${parts.year}-${parts.month}-${parts.day}`;
};

const getLocalTimeKey = (date, timezone) => {
  const parts = getLocalDateParts(date, timezone);
  return `${parts.hour}:${parts.minute}`;
};

const shouldSendMorningSummary = (user, now = new Date()) => {
  const timezone = user.preferences?.timezone || "Asia/Calcutta";
  const preferredTime = user.preferences?.morningSummaryTime || "08:00";
  const currentTime = getLocalTimeKey(now, timezone);
  const todayKey = getLocalDateKey(now, timezone);
  const lastSentKey = getLocalDateKey(user.lastMorningSummarySentAt, timezone);

  return currentTime === preferredTime && lastSentKey !== todayKey;
};

const sendMorningSummaries = async () => {
  const users = await User.find();

  for (const user of users) {
    if (!shouldSendMorningSummary(user)) {
      continue;
    }

    const today = await Task.find({
      user: user._id,
      source: "manual",
      dueDate: { $gte: startOfDay(), $lte: endOfDay() },
      completed: false
    }).sort({ dueDate: 1 });

    const pending = await Task.find({
      user: user._id,
      source: "manual",
      completed: false
    })
      .sort({ dueDate: 1, createdAt: -1 })
      .limit(5);

    const text = buildMorningSummary(user, { today, pending });
    try {
      await sendTelegramMessage(user, text);
      user.lastMorningSummarySentAt = new Date();
      await user.save();
    } catch (error) {
      console.warn(`Morning summary failed for ${user.email}: ${error.message}`);
    }
  }
};

const sendDeadlineAlerts = async () => {
  const cutoff = new Date(Date.now() + 1000 * 60 * 60 * 12);
  const tasks = await Task.find({
    source: "manual",
    completed: false,
    reminderSent: false,
    dueDate: { $lte: cutoff, $gte: new Date() }
  }).populate("user");

  for (const task of tasks) {
    try {
      await sendTelegramMessage(
        task.user,
        `Reminder: ${task.title}${task.metadata?.timeText ? ` at ${task.metadata.timeText}` : ""}`
      );
      task.reminderSent = true;
      await task.save();
    } catch (error) {
      console.warn(`Reminder failed for task ${task._id}: ${error.message}`);
    }
  }
};

module.exports = { sendMorningSummaries, sendDeadlineAlerts };
