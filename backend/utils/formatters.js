const formatTaskLine = (task) => {
  const timePart = task.metadata?.timeText ? ` - ${task.metadata.timeText}` : "";
  return `- ${task.title}${timePart}`;
};

module.exports = { formatTaskLine };
