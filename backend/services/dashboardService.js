const Task = require("../models/Task");
const { startOfDay, endOfDay } = require("../utils/date");

const getDashboardSnapshot = async (userId) => {
  const now = new Date();
  const todayStart = startOfDay(now);
  const todayEnd = endOfDay(now);

  const [todayTasks, upcomingTasks, completedTasks] = await Promise.all([
    Task.find({
      user: userId,
      source: "manual",
      dueDate: { $gte: todayStart, $lte: todayEnd },
      completed: false
    })
      .sort({ dueDate: 1 })
      .limit(10),
    Task.find({
      user: userId,
      source: "manual",
      dueDate: { $gt: todayEnd },
      completed: false
    })
      .sort({ dueDate: 1 })
      .limit(10),
    Task.find({ user: userId, source: "manual", completed: true }).sort({ updatedAt: -1 }).limit(10)
  ]);

  const stats = await Task.aggregate([
    { $match: { user: userId, source: "manual" } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        completed: {
          $sum: {
            $cond: ["$completed", 1, 0]
          }
        },
        highPriority: {
          $sum: {
            $cond: [{ $eq: ["$priority", "high"] }, 1, 0]
          }
        }
      }
    }
  ]);

  return {
    stats: stats[0] || { total: 0, completed: 0, highPriority: 0 },
    todayTasks,
    upcomingTasks,
    completedTasks
  };
};

module.exports = { getDashboardSnapshot };
