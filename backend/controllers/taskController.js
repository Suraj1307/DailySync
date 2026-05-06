const asyncHandler = require("../middleware/asyncHandler");
const Task = require("../models/Task");

const getTasks = asyncHandler(async (req, res) => {
  const filter = { user: req.user._id, source: "manual" };

  if (req.query.completed !== undefined) {
    filter.completed = req.query.completed === "true";
  }

  if (req.query.source) {
    filter.source = req.query.source;
  }

  const tasks = await Task.find(filter).sort({ dueDate: 1, createdAt: -1 });
  res.json({ tasks });
});

const createTask = asyncHandler(async (req, res) => {
  const { title, description, dueDate, priority, source, status, tags, metadata } = req.body;

  if (!title) {
    res.status(400);
    throw new Error("Title is required");
  }

  const task = await Task.create({
    user: req.user._id,
    title,
    description,
    dueDate: dueDate ? new Date(dueDate) : null,
    priority: priority || "medium",
    source: source || "manual",
    status: status || "pending",
    tags: tags || [],
    metadata: metadata || {}
  });

  res.status(201).json({ task });
});

const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  Object.assign(task, {
    title: req.body.title ?? task.title,
    description: req.body.description ?? task.description,
    dueDate: req.body.dueDate ? new Date(req.body.dueDate) : task.dueDate,
    priority: req.body.priority ?? task.priority,
    completed: typeof req.body.completed === "boolean" ? req.body.completed : task.completed,
    source: req.body.source ?? task.source,
    status: req.body.status ?? task.status,
    tags: req.body.tags ?? task.tags,
    metadata: req.body.metadata ?? task.metadata
  });

  if (task.completed) {
    task.status = "completed";
  }

  await task.save();
  res.json({ task });
});

const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }
  res.json({ message: "Task deleted" });
});

module.exports = { getTasks, createTask, updateTask, deleteTask };
