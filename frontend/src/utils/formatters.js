export const formatDate = (value) => {
  if (!value) return "No due date";
  const date = new Date(value);
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
};

export const formatShortDate = (value) => {
  if (!value) return "No date";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short"
  }).format(new Date(value));
};

export const formatRelativeTime = (value) => {
  if (!value) return "No due date";

  const now = new Date();
  const target = new Date(value);
  const diffMs = target.getTime() - now.getTime();
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (Math.abs(diffHours) < 24) {
    if (diffHours === 0) return "Due now";
    return diffHours > 0 ? `In ${diffHours}h` : `${Math.abs(diffHours)}h overdue`;
  }

  if (diffDays === 0) return "Today";
  return diffDays > 0 ? `In ${diffDays}d` : `${Math.abs(diffDays)}d overdue`;
};

export const priorityStyles = {
  low: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
  medium: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
  high: "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300"
};
