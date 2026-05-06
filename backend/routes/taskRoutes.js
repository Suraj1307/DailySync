const express = require("express");
const { getTasks, createTask, updateTask, deleteTask } = require("../controllers/taskController");
const { requireClerkAuth, attachCurrentUser } = require("../middleware/authMiddleware");

const router = express.Router();

router
  .route("/")
  .get(requireClerkAuth, attachCurrentUser, getTasks)
  .post(requireClerkAuth, attachCurrentUser, createTask);
router
  .route("/:id")
  .put(requireClerkAuth, attachCurrentUser, updateTask)
  .delete(requireClerkAuth, attachCurrentUser, deleteTask);

module.exports = router;
