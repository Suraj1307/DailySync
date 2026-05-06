const asyncHandler = require("../middleware/asyncHandler");
const { getAuth } = require("@clerk/express");
const User = require("../models/User");
const { syncClerkUser } = require("../services/clerkUserService");

const syncCurrentUser = asyncHandler(async (req, res) => {
  const auth = getAuth(req);

  if (!auth?.userId) {
    res.status(401);
    throw new Error("Clerk auth user id is missing during sync");
  }
  const user = await syncClerkUser(auth.userId, {
    email: req.body.email,
    name: req.body.name,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    username: req.body.username,
    avatar: req.body.avatar
  });
  res.status(201).json({ user });
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({ user });
});

const updatePreferences = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { darkMode, morningSummaryTime, timezone, telegramChatId } = req.body;

  user.preferences.darkMode =
    typeof darkMode === "boolean" ? darkMode : user.preferences.darkMode;
  user.preferences.morningSummaryTime =
    morningSummaryTime || user.preferences.morningSummaryTime;
  user.preferences.timezone = timezone || user.preferences.timezone;
  user.telegramChatId = telegramChatId || user.telegramChatId;

  await user.save();

  res.json({
    message: "Preferences updated",
    user
  });
});

const logout = asyncHandler(async (req, res) => {
  res.json({ message: "Sign out is handled by Clerk on the frontend" });
});

module.exports = {
  syncCurrentUser,
  getCurrentUser,
  updatePreferences,
  logout
};
