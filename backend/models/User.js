const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      unique: true,
      sparse: true,
      index: true
    },
    googleId: {
      type: String,
      index: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    avatar: String,
    telegramChatId: String,
    lastMorningSummarySentAt: Date,
    preferences: {
      darkMode: {
        type: Boolean,
        default: true
      },
      morningSummaryTime: {
        type: String,
        default: "08:00"
      },
      timezone: {
        type: String,
        default: "Asia/Calcutta"
      }
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", userSchema);
