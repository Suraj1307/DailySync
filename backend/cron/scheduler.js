const cron = require("node-cron");
const { sendMorningSummaries, sendDeadlineAlerts } = require("../services/reminderService");

const startCronJobs = () => {
  cron.schedule("* * * * *", sendMorningSummaries, {
    timezone: "Asia/Calcutta"
  });

  cron.schedule("0 * * * *", sendDeadlineAlerts, {
    timezone: "Asia/Calcutta"
  });

  console.log("Cron jobs started");
};

module.exports = startCronJobs;
