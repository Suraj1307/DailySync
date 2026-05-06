const { getAuth, requireAuth } = require("@clerk/express");
const User = require("../models/User");
const { syncClerkUser } = require("../services/clerkUserService");

const requireClerkAuth = requireAuth();

const attachCurrentUser = async (req, res, next) => {
  try {
    const auth = getAuth(req);
    if (!auth.userId) {
      return res.status(401).json({ message: "Clerk user id was not found on the request" });
    }
    let user = await User.findOne({ clerkId: auth.userId });

    if (!user) {
      return res.status(401).json({ message: "User profile is not synced yet. Please sign in again." });
    }

    req.clerkAuth = auth;
    req.user = user;
    next();
  } catch (error) {
    error.message = `Failed to attach current user: ${error.message}`;
    next(error);
  }
};

module.exports = { requireClerkAuth, attachCurrentUser };
