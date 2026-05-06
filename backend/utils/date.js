const isSameDay = (dateA, dateB) => {
  const a = new Date(dateA);
  const b = new Date(dateB);
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
};

const startOfDay = (date = new Date()) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const endOfDay = (date = new Date()) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);

module.exports = { isSameDay, startOfDay, endOfDay };

