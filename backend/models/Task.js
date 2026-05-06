const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    dueDate: Date,
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium"
    },
    completed: {
      type: Boolean,
      default: false
    },
    source: {
      type: String,
      enum: ["manual"],
      default: "manual"
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending"
    },
    reminderSent: {
      type: Boolean,
      default: false
    },
    tags: [String],
    metadata: {
      timeText: String
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Task", taskSchema);
