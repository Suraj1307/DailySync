const axios = require("axios");
const env = require("../config/env");
const { formatTaskLine } = require("../utils/formatters");

const getChatId = (user) => user.telegramChatId || env.telegramChatId;

const sendTelegramMessage = async (user, text) => {
  if (!env.telegramBotToken) {
    throw new Error("Telegram bot token is not configured");
  }

  const chatId = getChatId(user);
  if (!chatId) {
    throw new Error("Telegram chat id is not configured");
  }

  const url = `https://api.telegram.org/bot${env.telegramBotToken}/sendMessage`;
  const response = await axios.post(url, {
    chat_id: chatId,
    text,
    parse_mode: "HTML"
  });

  return response.data;
};

const buildMorningSummary = (user, tasks) => {
  const todayLines = tasks.today.map(formatTaskLine).join("\n") || "- No tasks for today";
  const pendingLines =
    tasks.pending.map((task) => `- ${task.title}`).join("\n") || "- No pending backlog";

  return `Good Morning ${user.name}

Today's Tasks:
${todayLines}

Pending:
${pendingLines}`;
};

module.exports = { sendTelegramMessage, buildMorningSummary };
